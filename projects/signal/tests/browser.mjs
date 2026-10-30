import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { chromium } from "playwright";

const url = "http://127.0.0.1:4180/";
const server = spawn(
  process.execPath,
  [
    "node_modules/vite/bin/vite.js",
    "--host",
    "127.0.0.1",
    "--port",
    "4180",
    "--strictPort",
  ],
  { stdio: "ignore" },
);
let browser;
try {
  let ready = false;
  for (let i = 0; i < 100; i++) {
    if (server.exitCode !== null)
      throw new Error("Preview server stopped before becoming ready");
    try {
      if ((await fetch(url)).ok) {
        ready = true;
        break;
      }
    } catch {
      /* wait for server */
    }
    await delay(100);
  }
  if (!ready) throw new Error("Preview server did not start");
  const executablePath = process.env.SIGNAL_BROWSER_EXECUTABLE || undefined;
  browser = await chromium.launch({ headless: true, executablePath });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const errors = [],
    external = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => {
    if (!request.url().startsWith(url)) external.push(request.url());
  });
  await page.goto(url, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".rec-card").count(), 3);
  const before = await page.locator(".rec-card").allTextContents();
  await page.getByRole("button", { name: "Rate Orbit One 1 out of 5" }).click();
  assert.notDeepEqual(
    await page.locator(".rec-card").allTextContents(),
    before,
    "Ratings change actual recommendations",
  );
  assert.match(
    await page.locator(".counterfactual").textContent(),
    /Prediction changed/,
    "The explanation compares against the starting data",
  );
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(
    await page
      .getByRole("button", { name: "Rate Orbit One 1 out of 5" })
      .getAttribute("aria-pressed"),
    "true",
    "Ratings persist locally",
  );
  await page.locator("#listener").selectOption("you");
  assert.match(
    await page.locator(".explanation").textContent(),
    /popularity fallback/i,
    "Cold start is labelled",
  );
  await page.getByRole("button", { name: "Rate Orbit One 5 out of 5" }).click();
  await page.getByRole("button", { name: "Rate Pulse Air 4 out of 5" }).click();
  await page
    .getByRole("button", { name: "Rate Nova Studio 4 out of 5" })
    .click();
  assert.ok(
    (await page.locator(".evidence-row").count()) > 0,
    "A supported prediction shows evidence",
  );
  await page
    .getByRole("button", { name: "Similar items", exact: true })
    .click();
  assert.equal(
    await page
      .getByRole("button", { name: "Similar items", exact: true })
      .getAttribute("aria-pressed"),
    "true",
  );
  await page.getByRole("button", { name: "Run evaluation" }).click();
  await page.locator(".recharts-surface").waitFor();
  assert.equal(
    await page.locator(".result-row").count(),
    3,
    "All three methods are evaluated",
  );
  await page
    .getByRole("button", { name: "Rate Drift Mini 3 out of 5" })
    .click();
  assert.match(
    await page.locator(".chart-placeholder").textContent(),
    /changed since the last run/i,
    "Stale metrics are hidden",
  );
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    assert.equal(
      await page
        .getByRole("link", { name: "View source on GitHub" })
        .isVisible(),
      true,
      `Source link is accessible at ${width}px`,
    );
    await page
      .getByRole("button", { name: /Run evaluation|Run again/ })
      .click();
    await page.locator(".recharts-surface").waitFor();
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
      true,
      `No horizontal overflow at ${width}px`,
    );
  }
  await page.getByRole("button", { name: "Reset all demo ratings" }).click();
  assert.equal(
    await page
      .getByRole("button", { name: "Rate Orbit One 5 out of 5" })
      .getAttribute("aria-pressed"),
    "false",
    "Reset clears the new profile",
  );
  assert.deepEqual(errors, []);
  assert.deepEqual(
    external,
    [],
    "The interactive demo makes no external requests",
  );
  console.log(
    "Browser checks passed: live recommendations, evidence, cold start, persistence, evaluation, reset and responsive layouts.",
  );
} finally {
  if (browser) await browser.close();
  server.kill();
}
