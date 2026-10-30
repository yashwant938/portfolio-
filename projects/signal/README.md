# Signal — Recommendation Lab

[Open the interactive lab](https://yashwant938.github.io/portfolio-/labs/signal/)

Signal is a small browser-based learning tool for recommendation systems. It compares user-based and item-based collaborative filtering with a regularized popularity baseline, explains the evidence for each suggestion, and runs leave-one-rating-out evaluation on a fictional ratings matrix. Users can change ratings and compare predictions against the starter data.

This is the public source for the interactive lab. It uses fictional data; it does not contain the original coursework notebook or its historical dataset. The benchmark is for learning and is not a claim of real-world model performance. Ratings stay in browser local storage.

## Run locally

Use Node.js 20.19+ or 22.12+.

```sh
npm ci
npm run dev
npm test
npm run format:check
npm run build
```

To run browser tests, install Playwright Chromium (`npx playwright install chromium`) and run `npm run test:browser`. An existing compatible browser can be supplied via `SIGNAL_BROWSER_EXECUTABLE`.

## Methods

User- and item-based methods use positive Pearson correlation with at least two shared ratings and at most the selected number of neighbors. User-based predictions adjust for neighbor rating averages; item-based predictions weight the listener’s own ratings. Scores are limited to 1–5, and missing collaborative evidence falls back to the popularity baseline. The baseline regularizes each item toward the global mean with three virtual ratings.

Evaluation hides each rating in turn and reports mean absolute error across the same holdouts. The direct column counts predictions that did not use a fallback; all predictions count in MAE. A small synthetic matrix and repeated holdouts cannot establish real-world accuracy, ranking quality, fairness or scalability.

**Stack:** React, TypeScript, Vite, Recharts, Vitest, Playwright, and Prettier.
