const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
let browser;

const ids = ['eld', 'legal-lens', 'signal-lab', 'real-estate', 'gpt2-summarization', 'cpp-systems'];
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
  const resumeDownloads = [];
  const pdfRequests = [];
  page.on('download', download => resumeDownloads.push(download.suggestedFilename()));
  context.on('request', request => { if (/\.pdf(?:[?#]|$)/i.test(request.url())) pdfRequests.push(request.url()); });
  page.on('pageerror', error => errors.push(error.message));
  const response = await page.goto(base, { waitUntil: 'networkidle' });
  assert.equal(response.status(), 200);
  const home = new URL(page.url());
  home.hash = '';
  assert.deepEqual(await visibleProjects(page), ids);
  assert.equal(await page.locator('article.project').count(), ids.length);
  assert.equal(await page.locator('#experience').evaluate(node =>
    Boolean(node.compareDocumentPosition(document.querySelector('#work')) & Node.DOCUMENT_POSITION_FOLLOWING)), true,
  'IBM experience precedes featured projects');
  assert.match(await page.locator('#experience').textContent(), /IBM/);
  assert.match(await page.locator('#experience').textContent(), /8\+/);
  assert.match(await page.locator('#legal-lens').textContent(), /14 of 27 historical questions/);
  assert.equal(await page.locator('#legal-lens a[href="https://github.com/ZainiiiBoyx278/legal-lens/blob/codex/legal-lens-evaluation/evaluation/results/REPORT.md"]').count(), 1);
  const resume = page.locator('#resume');
  const resumeTrigger = resume.locator(':scope > summary');
  const resumePanel = page.locator('#resume-panel');
  assert.equal(await page.locator('a[download], a[href$=".pdf"], iframe, embed, object').count(), 0);
  assert.match(await resumeTrigger.textContent(), /View resume/);
  assert.equal(await resumePanel.isVisible(), false);
  await resumeTrigger.hover();
  await resumePanel.waitFor({ state: 'visible' });
  await resumePanel.hover({ position: { x: 30, y: 100 } });
  assert.equal(await resumePanel.isVisible(), true, 'Hover preview remains reachable');
  await page.locator('#hero-title').hover();
  await resumePanel.waitFor({ state: 'hidden' });
  await resumeTrigger.click();
  await page.locator('#hero-title').hover();
  await page.waitForTimeout(300);
  assert.equal(await resumePanel.isVisible(), true, 'Click pins the hover preview');
  assert.match(await resumePanel.textContent(), /Sep 2026/);
  assert.match(await resumePanel.textContent(), /8\+ production defects/);
  assert.match(await resumePanel.textContent(), /8\.37/);
  assert.ok(await resumePanel.evaluate(node => node.getBoundingClientRect().bottom <= innerHeight), 'Desktop preview fits available height');
  await page.screenshot({ path: path.join(output, 'resume-desktop.png'), animations: 'disabled' });
  await resumePanel.evaluate(node => { node.scrollTop = node.scrollHeight; });
  assert.ok(await page.locator('#resume-recognition').evaluate(node => {
    const panel = document.querySelector('#resume-panel').getBoundingClientRect();
    const heading = node.getBoundingClientRect();
    return heading.top >= panel.top && heading.bottom <= panel.bottom;
  }), 'Entire resume is reachable by scrolling');
  await page.getByRole('button', { name: 'Close resume preview' }).click();
  assert.equal(await resumePanel.isVisible(), false);
  assert.equal(await resumeTrigger.evaluate(node => node === document.activeElement), true, 'Close restores trigger focus');
  await resumeTrigger.press('Enter');
  assert.equal(await resumePanel.isVisible(), true);
  await page.getByRole('button', { name: 'Close resume preview' }).focus();
  await page.keyboard.press('Escape');
  assert.equal(await resumePanel.isVisible(), false);
  assert.equal(await resumeTrigger.evaluate(node => node === document.activeElement), true);
  await resumeTrigger.press('Space');
  assert.equal(await resumePanel.isVisible(), true);
  await page.locator('#hero-title').click();
  assert.equal(await resumePanel.isVisible(), false, 'Outside click dismisses preview');
  const filters = {
    systems: ['eld', 'cpp-systems'],
    ai: ['legal-lens', 'signal-lab', 'gpt2-summarization', 'cpp-systems'],
    apps: ['legal-lens', 'signal-lab', 'real-estate', 'cpp-systems'],
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
  assert.match(await page.locator('#filter-status').textContent(), /^0 of 6/);
  await page.locator('#reset-filters').click();
  assert.deepEqual(await visibleProjects(page), ids);
  assert.equal(await search.inputValue(), '');
  await search.fill('Signal');
  assert.deepEqual(await visibleProjects(page), ['signal-lab']);
  await search.fill('');
  assert.equal(await page.locator('#signal-lab a[href="labs/signal/"]').count() > 0, true, 'Signal demo is linked');
  assert.equal(await page.locator('#signal-lab a[href="https://github.com/yashwant938/portfolio-/tree/main/projects/signal"]').count() > 0, true, 'Signal public source is linked');
  const detail = page.locator('#legal-lens details').first();
  await detail.locator(':scope > summary').focus();
  await page.keyboard.press('Enter');
  assert.equal(await detail.getAttribute('open'), '', 'Native details respond to keyboard input');
  await page.keyboard.press('Enter');
  assert.equal(await detail.getAttribute('open'), null);
  assert.match(await page.locator('.impact-strip').textContent(), /4\s+merged fixes/);
  assert.match(await resumePanel.textContent(), /4 merged fixes/);
  assert.equal(await page.locator('#eld .pr-status.merged').count(), 4);
  assert.equal(await page.locator('#eld .evidence-item').count(), 4);
  const caseStudy = page.locator('#eld-case-study');
  const warningCase = page.locator('#eld-case-warning');
  const headerCase = page.locator('#eld-case-headers');
  assert.equal(await caseStudy.isVisible(), true, 'Case study cards are visible');
  assert.equal(await warningCase.getAttribute('open'), null);
  assert.equal(await headerCase.getAttribute('open'), null);
  await warningCase.locator('summary').hover();
  await page.waitForFunction(() => getComputedStyle(document.querySelector('#eld-case-warning .case-study-peek')).opacity === '1');
  assert.equal(await warningCase.getAttribute('open'), null, 'Hover previews without opening or shifting the layout');
  await warningCase.locator('summary').click();
  assert.equal(await warningCase.getAttribute('open'), '');
  assert.match(await warningCase.textContent(), /PROVIDE\(bar = 5\)/);
  assert.match(await warningCase.textContent(), /script\.t:5:/);
  assert.match(await warningCase.textContent(), /12 focused passes, no skips/);
  assert.equal(await warningCase.locator('a[href="https://github.com/qualcomm/eld/pull/2207"]').count(), 1);
  await warningCase.locator('summary').focus();
  await page.keyboard.press('Enter');
  assert.equal(await warningCase.getAttribute('open'), null, 'Keyboard closes the disclosure');
  await headerCase.locator('summary').focus();
  await page.keyboard.press('Space');
  assert.equal(await headerCase.getAttribute('open'), '', 'Keyboard opens the second case study');
  assert.match(await headerCase.textContent(), /isEhdrInLayout\(\)/);
  assert.match(await headerCase.textContent(), /164 focused passes and 10 expected unsupported skips/);
  assert.equal(await headerCase.locator('a[href="https://github.com/qualcomm/eld/pull/2065"]').count(), 1);
  await headerCase.screenshot({ path: path.join(output, 'eld-case-open-desktop.png'), animations: 'disabled' });
  await page.keyboard.press('Space');
  assert.equal(await headerCase.getAttribute('open'), null);
  for (const number of [2011, 2065, 2129, 2207]) {
    assert.ok(await page.locator('#eld details a[href="https://github.com/qualcomm/eld/pull/' + number + '"]').count() > 0);
    assert.ok(await resumePanel.locator('a[href="https://github.com/qualcomm/eld/pull/' + number + '"]').count() > 0);
  }
  assert.equal(await page.locator('#eld .pr-status.open').count(), 2);
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
      if (expanded) {
        const panel = await resumePanel.evaluate(node => ({ width: node.clientWidth, scroll: node.scrollWidth }));
        assert.ok(panel.scroll <= panel.width + 1, 'Resume text fits preview at ' + width);
      }
      viewports.push({ ...layout, expanded });
    }
  }
  await page.evaluate(() => document.querySelectorAll('details').forEach(n => { n.open = false; }));
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({ path: path.join(output, 'homepage-desktop.png'), fullPage: true, animations: 'disabled' });
  await page.locator('#work').screenshot({ path: path.join(output, 'projects-desktop.png'), animations: 'disabled' });
  await page.locator('#eld').screenshot({ path: path.join(output, 'eld-contributions-desktop.png'), animations: 'disabled' });
  await caseStudy.screenshot({ path: path.join(output, 'eld-case-study-desktop.png'), animations: 'disabled' });
  await page.setViewportSize({ width: 390, height: 900 });
  await caseStudy.screenshot({ path: path.join(output, 'eld-case-study-mobile.png'), animations: 'disabled' });
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
  assert.match(await page.locator('#eld .project-status').textContent(), /4 merged fixes/);
  assert.equal(await page.locator('#contributions .contribution-card').first().locator('.pr-status.merged').count(), 4);
  for (const name of ['MoodPet', 'LLVMBugSquad']) {
    assert.ok(await page.locator('a[href="https://github.com/yashwant938/' + name + '"]').count() > 0);
  }
  await loadImages(page);
  await checkStructure(page);
  const plain = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
  const plainPage = await plain.newPage();
  await plainPage.goto(home.href, { waitUntil: 'networkidle' });
  assert.deepEqual(await visibleProjects(plainPage), ids);
  assert.equal(await plainPage.locator('#eld-case-study').isVisible(), true, 'Case study cards are readable without JavaScript');
  await plainPage.locator('#eld-case-headers > summary').click();
  assert.equal(await plainPage.locator('#eld-case-headers').getAttribute('open'), '', 'Case studies work without JavaScript');
  assert.equal(await plainPage.locator('.project-controls').isVisible(), false);
  assert.equal(await plainPage.locator('#project-motion').isVisible(), false);
  await plainPage.locator('#resume > summary').click();
  assert.equal(await plainPage.locator('#resume-panel').isVisible(), true, 'HTML resume works without JavaScript');
  assert.match(await plainPage.locator('#resume-panel').textContent(), /Recognition/);
  await plainPage.locator('#resume > summary').click();
  const plainDetail = plainPage.locator('#legal-lens details').first();
  await plainDetail.locator(':scope > summary').click();
  assert.equal(await plainDetail.getAttribute('open'), '', 'Native details work without JavaScript');
  await plain.close();
  const touch = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const touchPage = await touch.newPage();
  touchPage.on('pageerror', error => errors.push(error.message));
  await touchPage.goto(home.href, { waitUntil: 'networkidle' });
  await touchPage.locator('#eld-case-headers > summary').tap();
  assert.equal(await touchPage.locator('#eld-case-headers').getAttribute('open'), '', 'Tap opens the case study on mobile');
  await touchPage.locator('#eld-case-headers').screenshot({ path: path.join(output, 'eld-case-open-mobile.png'), animations: 'disabled' });
  await touchPage.locator('#eld-case-headers > summary').tap();
  await touchPage.locator('#resume > summary').tap();
  assert.equal(await touchPage.locator('#resume-panel').isVisible(), true, 'Tap opens inline mobile resume');
  await touchPage.screenshot({ path: path.join(output, 'resume-mobile.png'), animations: 'disabled' });
  await touchPage.getByRole('button', { name: 'Close resume preview' }).tap();
  assert.equal(await touchPage.locator('#resume-panel').isVisible(), false);
  await touch.close();
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
  assert.deepEqual(resumeDownloads, [], 'Resume never triggers a download');
  assert.deepEqual(pdfRequests, [], 'Browsing never requests a PDF');
  await browser.close();
  const results = {
    passed: true, projectCards: ids, experienceBeforeProjects: true,
    resume: { format: 'HTML', hover: true, clickToPin: true, keyboard: true, touch: true, noJavaScript: true, downloads: resumeDownloads, pdfRequests },
    filters, projectScreenshots: screenshots, mergedPRLinks: [2011, 2065, 2129, 2207],
    legacyRoutes: ['cpp-concepts → cpp-systems', 'filesystem-lab → cpp-systems', 'contributions → expanded ELD', 'moodpet → archive.html#moodpet'],
    motion: 'pause control, body state, initial and changed reduced-motion preference passed',
    viewports, javascriptErrors: errors,
    javascriptDisabled: 'all six projects, resume, and native details readable; script controls hidden'
  };
  fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
})().catch(async error => {
  console.error(error);
  if (browser) await browser.close();
  process.exit(1);
});
