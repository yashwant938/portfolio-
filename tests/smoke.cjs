const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
let browser;

const ids = ['eld', 'legal-lens', 'cpp-systems', 'gpt2-summarization', 'real-estate'];
const visibleProjects = page => page.locator('article.project:visible').evaluateAll(nodes => nodes.map(n => n.id));
async function loadImages(page) {
  await page.evaluate(async () => {
    await Promise.all([...document.images].map(img => { img.loading = 'eager'; return img.decode(); }));
    await document.fonts.ready;
  });
}
async function checkStructure(page) {
  const structure = await page.evaluate(() => {
    const ids = [...document.querySelectorAll('[id]')].map(n => n.id);
    return {
      duplicates: ids.filter((id, index) => ids.indexOf(id) !== index),
      invalidAnchors: [...document.querySelectorAll('a[href^="#"]')].map(a => a.getAttribute('href'))
        .filter(href => href !== '#' && !document.getElementById(decodeURIComponent(href.slice(1)))),
      unsafeTargets: [...document.querySelectorAll('a[target="_blank"]')].filter(a => !a.rel.includes('noopener')).map(a => a.href),
      brokenImages: [...document.images].filter(img => !img.complete || !img.naturalWidth).map(img => img.src)
    };
  });
  assert.deepEqual(structure, { duplicates: [], invalidAnchors: [], unsafeTargets: [], brokenImages: [] });
}
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
  const home = new URL(page.url());
  home.hash = '';
  assert.deepEqual(await visibleProjects(page), ids);
  assert.equal(await page.locator('article.project').count(), 5);
  assert.equal(await page.locator('#experience').evaluate(node =>
    Boolean(node.compareDocumentPosition(document.querySelector('#work')) & Node.DOCUMENT_POSITION_FOLLOWING)), true,
  'IBM experience precedes featured projects');
  assert.match(await page.locator('#experience').textContent(), /IBM/);
  assert.match(await page.locator('#experience').textContent(), /8\+/);
  const resume = page.locator('.hero a[download]');
  assert.equal(await resume.count(), 1);
  assert.equal(await resume.isVisible(), true);
  assert.match(await resume.textContent(), /Download\s+Resume/i);
  const resumeURL = await resume.evaluate(a => a.href);
  const pdfResponse = await context.request.get(resumeURL);
  assert.equal(pdfResponse.status(), 200);
  const pdf = await pdfResponse.body();
  assert.equal(pdf.subarray(0, 5).toString('ascii'), '%PDF-', 'Resume URL returns a real PDF');
  assert.ok(pdf.length > 1000);
  const filters = {
    systems: ['eld', 'cpp-systems'],
    ai: ['legal-lens', 'cpp-systems', 'gpt2-summarization'],
    apps: ['legal-lens', 'cpp-systems', 'real-estate'],
    research: ['legal-lens', 'gpt2-summarization'],
    all: ids
  };
  for (const [filter, expected] of Object.entries(filters)) {
    const button = page.locator('[data-filter="' + filter + '"]');
    await button.click();
    assert.equal(await button.getAttribute('aria-pressed'), 'true');
    assert.deepEqual(await visibleProjects(page), expected, filter + ' filter');
  }
  const search = page.getByRole('searchbox', { name: 'Find a project' });
  assert.equal(await search.getAttribute('id'), 'project-search');
  await search.fill('  mInIlM  ');
  assert.deepEqual(await visibleProjects(page), ['legal-lens']);
  await page.locator('[data-filter="apps"]').click();
  await search.fill('Razorpay');
  assert.deepEqual(await visibleProjects(page), ['real-estate']);
  await page.locator('[data-filter="systems"]').click();
  assert.deepEqual(await visibleProjects(page), []);
  assert.equal(await page.locator('#no-results').isVisible(), true);
  assert.match(await page.locator('#filter-status').textContent(), /^0 of 5/);
  await page.locator('#reset-filters').click();
  assert.deepEqual(await visibleProjects(page), ids);
  assert.equal(await search.inputValue(), '');
  const detail = page.locator('#legal-lens details').first();
  await detail.locator(':scope > summary').focus();
  await page.keyboard.press('Enter');
  assert.equal(await detail.getAttribute('open'), '', 'Native details respond to keyboard input');
  await page.keyboard.press('Enter');
  assert.equal(await detail.getAttribute('open'), null);
  for (const number of [2011, 2065]) {
    assert.ok(await page.locator('#eld details a[href="https://github.com/qualcomm/eld/pull/' + number + '"]').count() > 0);
  }
  for (const href of ['https://yashwant938.github.io/CompilerCppTopics/',
    'https://github.com/yashwant938/CompilerCppTopics', 'https://github.com/yashwant938/OOPD-Project']) {
    assert.ok(await page.locator('#cpp-systems a[href="' + href + '"]').count() > 0, 'Preserve combined lab link ' + href);
  }
  const motion = page.locator('#project-motion');
  assert.equal(await motion.getAttribute('aria-pressed'), 'true', 'Reduced motion pauses motion initially');
  assert.equal(await page.locator('body').evaluate(n => n.classList.contains('motion-paused')), true);
  await motion.click();
  assert.equal(await motion.getAttribute('aria-pressed'), 'false');
  assert.equal(await page.locator('body').evaluate(n => n.classList.contains('motion-paused')), false);
  await motion.click();
  assert.equal(await motion.getAttribute('aria-pressed'), 'true');
  assert.equal(await page.locator('body').evaluate(n => n.classList.contains('motion-paused')), true);
  await loadImages(page);
  await checkStructure(page);
  const screenshots = await page.locator('article.project img').evaluateAll(images => images
    .filter(img => /\.(png|jpe?g|webp)(\?|$)/i.test(img.currentSrc || img.src))
    .map(img => ({ src: img.currentSrc || img.src, width: img.naturalWidth, height: img.naturalHeight, alt: img.alt })));
  assert.ok(screenshots.length > 0, 'Featured projects include actual raster screenshots');
  for (const image of screenshots) {
    assert.ok(image.width >= 320 && image.height >= 150, 'Usable screenshot dimensions: ' + image.src);
    assert.ok(image.alt.trim(), 'Screenshot alternative text: ' + image.src);
  }
  const viewports = [];
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const expanded of [false, true]) {
      await page.evaluate(open => document.querySelectorAll('details').forEach(n => { n.open = open; }), expanded);
      await page.evaluate(() => document.fonts.ready);
      const layout = await page.evaluate(() => ({ width: innerWidth, documentWidth: document.documentElement.scrollWidth }));
      assert.ok(layout.documentWidth <= width + 1, 'Horizontal overflow: ' + JSON.stringify({ ...layout, expanded }));
      viewports.push({ ...layout, expanded });
    }
  }
  await page.evaluate(() => document.querySelectorAll('details').forEach(n => { n.open = false; }));
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({ path: path.join(output, 'homepage-desktop.png'), fullPage: true, animations: 'disabled' });
  await page.locator('#work').screenshot({ path: path.join(output, 'projects-desktop.png'), animations: 'disabled' });
  await page.setViewportSize({ width: 390, height: 900 });
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({ path: path.join(output, 'homepage-mobile.png'), fullPage: true, animations: 'disabled' });
  for (const oldHash of ['cpp-concepts', 'filesystem-lab']) {
    const url = new URL(home); url.hash = oldHash;
    await page.goto(url.href, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => location.hash === '#cpp-systems');
    assert.equal(await page.locator('#cpp-systems').isVisible(), true);
  }
  const contributionsURL = new URL(home); contributionsURL.hash = 'contributions';
  await page.goto(contributionsURL.href, { waitUntil: 'networkidle' });
  assert.equal(await page.locator('#eld details').first().getAttribute('open'), '', 'Legacy contributions link opens ELD evidence');
  const archiveURL = new URL(home); archiveURL.hash = 'moodpet';
  await page.goto(archiveURL.href, { waitUntil: 'networkidle' });
  await page.waitForURL(url => url.pathname.endsWith('/archive.html') && url.hash === '#moodpet');
  assert.equal(await page.locator('#moodpet').isVisible(), true);
  for (const name of ['MoodPet', 'LLVMBugSquad']) {
    assert.ok(await page.locator('a[href="https://github.com/yashwant938/' + name + '"]').count() > 0);
  }
  await loadImages(page);
  await checkStructure(page);
  const plain = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
  const plainPage = await plain.newPage();
  await plainPage.goto(home.href, { waitUntil: 'networkidle' });
  assert.deepEqual(await visibleProjects(plainPage), ids);
  assert.equal(await plainPage.locator('.project-controls').isVisible(), false);
  assert.equal(await plainPage.locator('#project-motion').isVisible(), false);
  assert.equal(await plainPage.locator('.hero a[download]').isVisible(), true);
  const plainDetail = plainPage.locator('#legal-lens details').first();
  await plainDetail.locator(':scope > summary').click();
  assert.equal(await plainDetail.getAttribute('open'), '', 'Native details work without JavaScript');
  await plain.close();
  const animated = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
  const motionPage = await animated.newPage();
  motionPage.on('pageerror', error => errors.push(error.message));
  await motionPage.goto(home.href, { waitUntil: 'networkidle' });
  assert.equal(await motionPage.locator('#project-motion').getAttribute('aria-pressed'), 'false');
  await motionPage.locator('#project-motion').click();
  assert.equal(await motionPage.locator('body').evaluate(n => n.classList.contains('motion-paused')), true);
  await motionPage.locator('#project-motion').click();
  assert.equal(await motionPage.locator('body').evaluate(n => n.classList.contains('motion-paused')), false);
  await motionPage.emulateMedia({ reducedMotion: 'reduce' });
  await motionPage.waitForFunction(() => document.querySelector('#project-motion').getAttribute('aria-pressed') === 'true');
  assert.equal(await motionPage.locator('body').evaluate(n => n.classList.contains('motion-paused')), true);
  await animated.close();
  assert.deepEqual(errors, [], 'No browser JavaScript errors');
  await browser.close();
  const results = {
    passed: true, projectCards: ids, experienceBeforeProjects: true,
    resume: { url: resumeURL, bytes: pdf.length, signature: '%PDF-' },
    filters, projectScreenshots: screenshots, mergedPRLinks: [2011, 2065],
    legacyRoutes: ['cpp-concepts → cpp-systems', 'filesystem-lab → cpp-systems', 'contributions → expanded ELD', 'moodpet → archive.html#moodpet'],
    motion: 'pause control, body state, initial and changed reduced-motion preference passed',
    viewports, javascriptErrors: errors,
    javascriptDisabled: 'all five projects, resume, and native details readable; script controls hidden'
  };
  fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
})().catch(async error => {
  console.error(error);
  if (browser) await browser.close();
  process.exit(1);
});
