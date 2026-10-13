# Yashwant — Systems × Intelligence

Personal portfolio featuring systems engineering, LLVM contributions, and generative AI projects.

Live website: https://yashwant938.github.io/portfolio-/

## Development

The website is a prebuilt static site in `docs/`, with no runtime dependencies.

Run `python -m http.server 4173 --directory docs` and open http://localhost:4173.

Edit `content/projects.json` for project case studies, contribution status, and
archive links. Edit `content/index.template.html` for the page structure and
experience section. The four original project illustrations are preserved in
`content/visuals/`.

After a content edit, run `python scripts/build.py` and commit the generated
`docs/index.html` too. Python's standard library is sufficient. Edit
`docs/style.css` for design and `docs/app.js` for the galaxy, search, and filters.
All project content and expandable details remain readable with JavaScript off.

## Checks

With the preview server running, install development dependencies using
`npm install` and run `npm test`. The browser smoke checks use Microsoft Edge
through Playwright; `BROWSER_CHANNEL=chrome` selects Chrome instead. `BASE_URL`
can point to a different preview or deployed site. No browser is bundled with
the portfolio itself.

Checks cover combined search/category filtering, reset and empty states,
keyboard-operated details, motion controls, links within the page, image loads,
JavaScript errors, and overflow at 320, 390, 768, and 1440 pixels. The no-JavaScript
check confirms the complete project catalogue is still readable.

## Deployment

GitHub Pages publishes the `/docs` folder on `main`. Push changes to `main` to update the live website.

Content was reviewed against public repository source and PR records on
October 13, 2026. The catalogue includes 13 project case studies and an ELD
contribution highlight. Related bioinformatics repositories are grouped as one
project; algorithms practice is linked separately. Empty repositories and bare
forks are not presented as authored products. Prototype and evaluation limits
are included in the expandable details, and merged/open/draft contributions are
distinguished. Reported project/PR test results are historical evidence, not
tests rerun by this website's smoke checks.

Project illustrations are conceptual graphics. The portrait was supplied by
Yashwant. Reduced-motion preferences are respected; motion can also be paused
manually. IBM dates follow the approved resume (full-time July 2025–September
2026; internship January–July 2025).
