const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
let browser;

(async () => {
  browser = await chromium.launch({ headless: true, channel: process.env.BROWSER_CHANNEL || 'msedge' });
  const base = process.env.BASE_URL || 'http://127.0.0.1:4173';
  const output = process.env.QA_DIR || path.join(__dirname, '..', 'test-results');
  fs.mkdirSync(output, { recursive: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const response = await page.goto(base, { waitUntil: 'networkidle' });
  assert.equal(response.status(), 200);
  assert.equal(await page.locator('.project:visible').count(), 14);
  assert.equal(await page.locator('.contribution-list .merged').count(), 2);
  assert.equal(await page.locator('.contribution-list .draft').count(), 1);

  await page.getByRole('button', { name: 'Systems', exact: true }).click();
  assert.deepEqual(await page.locator('.project:visible').evaluateAll(nodes => nodes.map(n => n.id)),
    ['eld', 'llvm-bugsquad', 'cpp-concepts', 'filesystem-lab']);
  await page.getByRole('button', { name: 'AI & ML', exact: true }).click();
  assert.equal(await page.locator('.project:visible').count(), 7);
  await page.getByRole('searchbox', { name: 'Find a project' }).fill('  mInIlM  ');
  assert.deepEqual(await page.locator('.project:visible').evaluateAll(nodes => nodes.map(n => n.id)), ['legal-lens']);
  await page.getByRole('button', { name: 'Applications', exact: true }).click();
  await page.getByRole('searchbox').fill('Razorpay');
  assert.deepEqual(await page.locator('.project:visible').evaluateAll(nodes => nodes.map(n => n.id)), ['real-estate']);
  await page.getByRole('button', { name: 'Systems', exact: true }).click();
  assert.equal(await page.locator('.project:visible').count(), 0);
  assert.equal(await page.locator('#no-results').isVisible(), true);
  assert.match(await page.locator('#filter-status').textContent(), /^0 of 14/);
  await page.getByRole('button', { name: 'Show all work' }).click();
  assert.equal(await page.locator('.project:visible').count(), 14);
  assert.equal(await page.getByRole('searchbox').inputValue(), '');

  const detail = page.locator('#legal-lens details');
  await detail.locator('summary').focus();
  await page.keyboard.press('Enter');
  assert.equal(await detail.getAttribute('open'), '');
  await page.keyboard.press('Enter');
  assert.equal(await detail.getAttribute('open'), null);

  const motion = page.locator('#motion');
  assert.equal(await motion.getAttribute('aria-pressed'), 'true', 'Reduced-motion preference should pause the animation');
  await motion.click();
  assert.equal(await motion.getAttribute('aria-pressed'), 'false');
  await motion.click();
  assert.equal(await motion.getAttribute('aria-pressed'), 'true');

  // Decode below-the-fold lazy images before assessing whether they loaded.
  await page.evaluate(async () => {
    await Promise.all([...document.images].map(img => { img.loading = 'eager'; return img.decode(); }));
  });
  const structure = await page.evaluate(() => {
    const ids = [...document.querySelectorAll('[id]')].map(n => n.id);
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    const invalidAnchors = [...document.querySelectorAll('a[href^="#"]')]
      .map(a => a.getAttribute('href')).filter(href => href !== '#' && !document.getElementById(href.slice(1)));
    const unsafeTargets = [...document.querySelectorAll('a[target="_blank"]')].filter(a => !a.rel.includes('noopener')).length;
    const brokenImages = [...document.images].filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src);
    return { duplicates, invalidAnchors, unsafeTargets, brokenImages };
  });
  assert.deepEqual(structure, { duplicates: [], invalidAnchors: [], unsafeTargets: 0, brokenImages: [] });

  const viewports = [];
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.evaluate(() => document.querySelectorAll('details').forEach(d => { d.open = true; }));
    await page.evaluate(() => document.fonts.ready);
    const layout = await page.evaluate(() => ({ width: innerWidth, documentWidth: document.documentElement.scrollWidth }));
    assert.ok(layout.documentWidth <= width + 1, `Horizontal overflow: ${JSON.stringify(layout)}`);
    viewports.push(layout);
    await page.evaluate(() => document.querySelectorAll('details').forEach(d => { d.open = false; }));
  }
  await page.locator('#work').scrollIntoViewIfNeeded();
  await page.screenshot({ path: path.join(output, 'projects-desktop.png') });
  assert.deepEqual(errors, [], 'Browser JavaScript errors');

  const plain = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
  const plainPage = await plain.newPage();
  await plainPage.goto(base);
  assert.equal(await plainPage.locator('.project:visible').count(), 14);
  assert.equal(await plainPage.locator('.project-controls').isVisible(), false);
  await plain.close();
  await browser.close();
  const results = { passed: true, projectCards: 14, aiFilter: 7, mergedPRs: 2, draftPRs: 1, viewports, javascriptErrors: errors, javascriptDisabled: 'all projects readable' };
  fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
})().catch(async error => { console.error(error); if (browser) await browser.close(); process.exit(1); });
