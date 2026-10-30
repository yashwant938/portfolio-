import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  CircleHelp,
  FlaskConical,
  Github,
  Headphones,
  Layers3,
  RotateCcw,
  Sparkles,
  Star,
  UsersRound,
  Zap,
} from "lucide-react";
import { initialRatings, listeners, products } from "./data";
import type { RatingMatrix } from "./data";
import { evaluate, predict, recommend } from "./recommender";
import type { Evaluation, Method } from "./recommender";

const EvaluationChart = lazy(() => import("./EvaluationChart"));

const SOURCE =
  "https://github.com/yashwant938/portfolio-/tree/main/projects/signal";
const STORAGE = "signal-recommender-ratings-v1";
const methods: {
  id: Method;
  label: string;
  short: string;
  description: string;
}[] = [
  {
    id: "user",
    label: "Similar listeners",
    short: "USER-BASED",
    description: "Find people whose overlapping ratings move like yours.",
  },
  {
    id: "item",
    label: "Similar items",
    short: "ITEM-BASED",
    description: "Find products rated similarly across listeners.",
  },
  {
    id: "popular",
    label: "Popular baseline",
    short: "BASELINE",
    description: "Rank by rating, with a global-average prior.",
  },
];

function savedRatings(): RatingMatrix {
  const defaults = initialRatings();
  try {
    const stored = JSON.parse(
      localStorage.getItem(STORAGE) || "null",
    ) as RatingMatrix | null;
    if (!stored || typeof stored !== "object") return defaults;
    for (const user of Object.keys(defaults))
      for (const product of Object.keys(defaults[user])) {
        const value = stored[user]?.[product];
        if (
          value !== null &&
          (!Number.isInteger(value) ||
            typeof value !== "number" ||
            value < 1 ||
            value > 5)
        )
          return defaults;
        defaults[user][product] = value;
      }
    return defaults;
  } catch {
    return defaults;
  }
}

function HeadphoneArt({
  color,
  compact = false,
}: {
  color: string;
  compact?: boolean;
}) {
  return (
    <span
      className={`product-art ${compact ? "compact" : ""}`}
      style={{ "--product-color": color } as CSSProperties}
      aria-hidden="true"
    >
      <Headphones strokeWidth={1.1} />
    </span>
  );
}

function App() {
  const [matrix, setMatrix] = useState<RatingMatrix>(savedRatings);
  const [user, setUser] = useState("maya");
  const [method, setMethod] = useState<Method>("user");
  const [k, setK] = useState(3);
  const [selectedId, setSelectedId] = useState("");
  const [benchmark, setBenchmark] = useState<{
    signature: string;
    results: Evaluation[];
  } | null>(null);
  const starting = useMemo(initialRatings, []);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE, JSON.stringify(matrix));
    } catch {
      /* still usable without storage */
    }
  }, [matrix]);

  const productIds = products.map((product) => product.id);
  const ranked = useMemo(
    () => recommend(matrix, user, productIds, method, k),
    [matrix, user, method, k],
  );
  const selected = ranked.find((item) => item.id === selectedId) || ranked[0];
  const difference =
    selected &&
    JSON.stringify(matrix) !== JSON.stringify(starting) &&
    starting[user][selected.id] === null
      ? selected.score - predict(starting, user, selected.id, method, k).score
      : null;
  const activeUser = listeners.find((item) => item.id === user)!;
  const currentMethod = methods.find((item) => item.id === method)!;
  const count = Object.values(matrix[user]).filter(
    (value) => value !== null,
  ).length;
  const signature = JSON.stringify([matrix, k]);
  const currentBenchmark =
    benchmark?.signature === signature ? benchmark.results : null;
  const setRating = (product: string, value: number | null) => {
    setMatrix((previous) => ({
      ...previous,
      [user]: { ...previous[user], [product]: value },
    }));
  };
  const reset = () => {
    setMatrix(initialRatings());
    setSelectedId("");
    setBenchmark(null);
  };

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="#top" aria-label="Signal home">
            <span className="brand-mark">
              <AudioLines size={21} />
            </span>
            <span>
              SIGNAL<small>RECOMMENDATION LAB</small>
            </span>
          </a>
          <nav aria-label="Main navigation">
            <a href="#workspace">The lab</a>
            <a href="#evaluation">Evaluation</a>
            <a href="#how-it-works">How it works</a>
          </nav>
          <a
            className="source-link"
            aria-label="View source on GitHub"
            href={SOURCE}
            target="_blank"
            rel="noreferrer"
          >
            <Github size={16} />
            <span>View source</span>
            <ArrowUpRight size={14} />
          </a>
        </div>
      </header>

      <main id="top">
        <section className="hero container">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="status-dot" /> AN INTERACTIVE RECOMMENDATION LAB{" "}
              <span className="eyebrow-line" /> 01 / 03
            </div>
            <h1>
              Good recommendations
              <br />
              <em>should make sense.</em>
            </h1>
            <p>
              What makes a recommendation click? Explore the signals behind the
              suggestions, change the inputs, and see the thinking unfold.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#workspace">
                Enter the lab <ArrowDown size={16} />
              </a>
              <a className="text-link" href="#how-it-works">
                Explore the idea <ArrowDownRight size={16} />
              </a>
            </div>
            <div className="hero-note">
              <span className="small-orbit">
                <Sparkles size={14} />
              </span>
              <span>
                <strong>A little curiosity goes a long way.</strong>
                <br />
                Built to make machine learning feel tangible.
              </span>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="visual-top">
              <span>THE SIGNAL MAP</span>
              <span>● LIVE MODEL</span>
            </div>
            <div className="orbit-stage">
              <div className="orbit-ring ring-one" />
              <div className="orbit-ring ring-two" />
              <div className="orbit-ring ring-three" />
              <div className="orbit-line line-one" />
              <div className="orbit-line line-two" />
              <div className="orbit-line line-three" />
              <div className="center-node">
                <AudioLines size={35} />
                <span>YOUR TASTE</span>
              </div>
              <div className="orbit-node node-a">
                <Headphones size={22} />
                <small>ITEM 01</small>
              </div>
              <div className="orbit-node node-b">
                <UsersRound size={21} />
                <small>LISTENER</small>
              </div>
              <div className="orbit-node node-c">
                <Headphones size={21} />
                <small>ITEM 08</small>
              </div>
              <div className="orbit-point point-a" />
              <div className="orbit-point point-b" />
              <div className="orbit-point point-c" />
            </div>
            <div className="visual-bottom">
              <span>INPUT → SIGNAL → DISCOVERY</span>
              <span>FIG. 01</span>
            </div>
          </div>
        </section>

        <div className="fact-strip">
          <div className="container fact-inner">
            <span>
              <strong>03</strong> ranking strategies
            </span>
            <span>
              <strong>08</strong> fictional products
            </span>
            <span>
              <strong>01</strong> open lab
            </span>
            <span>
              <strong>00</strong> accounts required
            </span>
          </div>
        </div>

        <section className="section container" id="workspace">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                <span className="status-dot" /> THE WORKSPACE{" "}
                <span className="eyebrow-line" /> 02 / 03
              </div>
              <h2>
                Play with the <em>signals.</em>
              </h2>
              <p>
                Pick a listener, rate a few headphones, then inspect what the
                model finds.
              </p>
            </div>
            <div className="data-label">
              <span className="data-icon">
                <Layers3 size={16} />
              </span>
              <span>
                FICTIONAL DATASET<strong>Made for exploration</strong>
              </span>
            </div>
          </div>
          <div className="notice">
            <CircleHelp size={17} />
            <span>
              Starter listeners, products and ratings are fictional. This is a
              small learning simulation—not the original Amazon dataset or a
              production model.
            </span>
          </div>
          <div className="control-panel">
            <div className="control-user">
              <label htmlFor="listener">LISTENER PROFILE</label>
              <div className="select-wrap">
                <span className="avatar">{activeUser.name.charAt(0)}</span>
                <select
                  id="listener"
                  value={user}
                  onChange={(event) => {
                    setUser(event.target.value);
                    setSelectedId("");
                  }}
                >
                  {listeners.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} · {item.detail}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="control-method">
              <span className="field-label">RECOMMENDATION METHOD</span>
              <div
                className="method-switch"
                role="group"
                aria-label="Recommendation method"
              >
                {methods.map((item) => (
                  <button
                    key={item.id}
                    className={method === item.id ? "active" : ""}
                    aria-pressed={method === item.id}
                    onClick={() => {
                      setMethod(item.id);
                      setSelectedId("");
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <button
              className="reset-button"
              type="button"
              onClick={reset}
              aria-label="Reset all demo ratings"
            >
              <RotateCcw size={15} /> Reset
            </button>
          </div>

          <div className="lab-grid">
            <section
              className="panel rating-panel"
              aria-labelledby="ratings-title"
            >
              <div className="panel-heading">
                <div>
                  <div className="mini-label">01 / INPUT</div>
                  <h3 id="ratings-title">Shape your taste</h3>
                  <p>Change a rating to update the model.</p>
                </div>
                <div className="rating-count">
                  <strong>{count}</strong>
                  <span> / 8 rated</span>
                </div>
              </div>
              <div className="rating-list">
                {products.map((product) => (
                  <div className="rating-row" key={product.id}>
                    <HeadphoneArt color={product.color} compact />
                    <div className="rating-product">
                      <strong>{product.name}</strong>
                      <span>{product.type}</span>
                    </div>
                    <div className="rating-actions">
                      <div
                        className="stars"
                        role="group"
                        aria-label={`Rate ${product.name}`}
                      >
                        {[1, 2, 3, 4, 5].map((value) => (
                          <button
                            type="button"
                            key={value}
                            aria-label={`Rate ${product.name} ${value} out of 5`}
                            aria-pressed={matrix[user][product.id] === value}
                            title={`${value} out of 5`}
                            onClick={() => setRating(product.id, value)}
                          >
                            <Star
                              size={15}
                              fill={
                                (matrix[user][product.id] || 0) >= value
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                          </button>
                        ))}
                      </div>
                      {matrix[user][product.id] !== null && (
                        <button
                          className="clear-rating"
                          onClick={() => setRating(product.id, null)}
                          aria-label={`Clear rating for ${product.name}`}
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="panel-foot">
                <span className="pulsing-dot" /> Your changes stay in this
                browser.
              </div>
            </section>

            <section
              className="panel output-panel"
              aria-labelledby="recommendations-title"
            >
              <div className="panel-heading">
                <div>
                  <div className="mini-label">02 / OUTPUT</div>
                  <h3 id="recommendations-title">
                    Made for {user === "you" ? "you" : activeUser.name}
                  </h3>
                  <p>{currentMethod.description}</p>
                </div>
                <span className="model-badge">
                  <span /> LIVE
                </span>
              </div>
              {ranked.length ? (
                <div className="rec-list">
                  {ranked.slice(0, 3).map((item, index) => {
                    const product = products.find((p) => p.id === item.id)!;
                    return (
                      <button
                        className={`rec-card ${selected?.id === item.id ? "selected" : ""}`}
                        type="button"
                        key={item.id}
                        onClick={() => setSelectedId(item.id)}
                        aria-pressed={selected?.id === item.id}
                      >
                        <span className="rec-rank">0{index + 1}</span>
                        <HeadphoneArt color={product.color} />
                        <span className="rec-copy">
                          <span className="mini-label">{product.type}</span>
                          <strong>{product.name}</strong>
                          <span>{product.description}</span>
                          <small>
                            {item.direct
                              ? currentMethod.short
                              : "POPULARITY FALLBACK"}
                          </small>
                        </span>
                        <span className="rec-score">
                          <strong>{item.score.toFixed(1)}</strong>
                          <span>/ 5 predicted</span>
                          <ArrowUpRight size={17} />
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-state">
                  <Sparkles size={24} />
                  <h4>Everything is rated.</h4>
                  <p>Clear a rating to discover a recommendation.</p>
                </div>
              )}
              <div className="panel-foot">
                <span className="pulsing-dot" /> Recalculates as you rate ·
                rated items are excluded
              </div>
            </section>
          </div>

          <div className="explain-grid">
            <section className="panel explanation" aria-labelledby="why-title">
              <div className="explain-header">
                <div>
                  <div className="mini-label">03 / EXPLANATION</div>
                  <h3 id="why-title">Why this recommendation?</h3>
                </div>
                <span className="icon-box">
                  <Sparkles size={18} />
                </span>
              </div>
              {selected ? (
                <>
                  <p className="explain-intro">
                    <strong>
                      {products.find((p) => p.id === selected.id)?.name}
                    </strong>{" "}
                    is predicted at{" "}
                    <strong>{selected.score.toFixed(2)} / 5</strong> using{" "}
                    {selected.direct
                      ? currentMethod.label.toLowerCase()
                      : "the popularity fallback"}
                    .
                  </p>
                  {difference !== null && (
                    <p className="counterfactual">
                      <Sparkles size={14} /> Prediction changed{" "}
                      <strong>
                        {difference >= 0 ? "+" : ""}
                        {difference.toFixed(2)}
                      </strong>{" "}
                      from the starter data with this method and neighbor
                      setting.
                    </p>
                  )}
                  {selected.evidence.length ? (
                    <div className="evidence-list">
                      {selected.evidence.map((e) => {
                        const label =
                          method === "user"
                            ? listeners.find((person) => person.id === e.id)
                                ?.name
                            : products.find((product) => product.id === e.id)
                                ?.name;
                        return (
                          <div className="evidence-row" key={e.id}>
                            <div className="evidence-info">
                              <span>
                                {method === "user" ? "Listener" : "Your rating"}{" "}
                                <strong>{label}</strong>
                              </span>
                              <span>
                                Similarity {e.similarity.toFixed(2)} ·{" "}
                                {e.overlap} shared ratings · {e.rating} / 5
                              </span>
                            </div>
                            <div className="evidence-track">
                              <span
                                style={{
                                  width: `${Math.max(0, Math.min(100, e.similarity * 100))}%`,
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="explain-empty">
                      {method === "popular"
                        ? "This baseline uses the item’s ratings, regularized toward the overall average. It does not use neighbor similarity."
                        : "Not enough positive overlap for this method. The score falls back to the regularized popularity baseline; try rating more products or choosing another listener."}
                    </p>
                  )}
                  <p className="explain-caption">
                    {method === "user" && selected.direct
                      ? "Positive Pearson similarity weights each listener’s rating relative to their own average."
                      : method === "item" && selected.direct
                        ? "Positive Pearson similarity weights your ratings of related items."
                        : "A fallback is labelled so it is never presented as a collaborative prediction."}
                  </p>
                </>
              ) : (
                <p className="explain-empty">
                  Clear a rating to see how the model explains a suggestion.
                </p>
              )}
            </section>
            <aside className="panel tuning">
              <div className="mini-label">TUNE THE MODEL</div>
              <h3>How many neighbors?</h3>
              <p>
                More neighbors bring more signals. Fewer can make an explanation
                easier to inspect.
              </p>
              <div className="range-heading">
                <label htmlFor="neighbors">Maximum neighbors</label>
                <strong>{k.toString().padStart(2, "0")}</strong>
              </div>
              <input
                id="neighbors"
                type="range"
                min="1"
                max="5"
                value={k}
                onChange={(event) => setK(Number(event.target.value))}
              />
              <div className="range-labels">
                <span>1 NEIGHBOR</span>
                <span>5 NEIGHBORS</span>
              </div>
              <div className="tuning-note">
                <Zap size={16} />
                <span>
                  Only positive similarities with at least two shared ratings
                  are used. Popularity does not use neighbors.
                </span>
              </div>
            </aside>
          </div>
        </section>

        <section className="evaluation-section" id="evaluation">
          <div className="container">
            <div className="section-heading evaluation-heading">
              <div>
                <div className="eyebrow">
                  <span className="status-dot" /> THE EXPERIMENT{" "}
                  <span className="eyebrow-line" /> 03 / 03
                </div>
                <h2>
                  Make the model <em>prove it.</em>
                </h2>
                <p>
                  Compare methods on the same fictional ratings. Hold one rating
                  out, predict it, then repeat.
                </p>
              </div>
              <button
                className="button secondary"
                onClick={() =>
                  setBenchmark({
                    signature,
                    results: evaluate(
                      matrix,
                      methods.map((item) => item.id),
                      k,
                    ),
                  })
                }
              >
                <FlaskConical size={17} />{" "}
                {currentBenchmark ? "Run again" : "Run evaluation"}{" "}
                <ArrowRight size={16} />
              </button>
            </div>
            <div className="eval-grid">
              <div className="eval-chart panel">
                <div className="chart-top">
                  <div>
                    <div className="mini-label">LEAVE-ONE-RATING-OUT</div>
                    <h3>
                      Prediction error <span>↓ lower is better</span>
                    </h3>
                  </div>
                  <span className="chart-pill">MAE / 5</span>
                </div>
                {currentBenchmark ? (
                  <Suspense
                    fallback={
                      <div className="chart-placeholder">Loading chart…</div>
                    }
                  >
                    <EvaluationChart results={currentBenchmark} />
                  </Suspense>
                ) : (
                  <div className="chart-placeholder">
                    <span className="placeholder-icon">
                      <FlaskConical size={23} />
                    </span>
                    <strong>
                      {benchmark
                        ? "Ratings changed since the last run."
                        : "Your experiment is ready."}
                    </strong>
                    <span>Run the evaluation to see the comparison.</span>
                  </div>
                )}
                <p className="chart-caption">
                  Mean absolute error measures how far a prediction was from a
                  held-out rating, on the 1–5 scale.
                </p>
              </div>
              <div className="eval-side">
                <div className="eval-insight">
                  <span className="icon-box">
                    <FlaskConical size={18} />
                  </span>
                  <div>
                    <h3>Small data. Honest results.</h3>
                    <p>
                      Each rating is hidden before it is predicted. The same
                      examples are used for all three methods.
                    </p>
                  </div>
                </div>
                {currentBenchmark ? (
                  <div className="result-table">
                    <div className="result-header">
                      <span>METHOD</span>
                      <span>MAE</span>
                      <span>DIRECT*</span>
                    </div>
                    {currentBenchmark.map((result) => (
                      <div className="result-row" key={result.method}>
                        <strong>
                          {
                            methods.find((item) => item.id === result.method)
                              ?.label
                          }
                        </strong>
                        <span>{result.mae.toFixed(3)}</span>
                        <span>{Math.round(result.coverage * 100)}%</span>
                      </div>
                    ))}
                    <p>
                      * Direct means no popularity fallback. All predictions,
                      including fallbacks, count toward MAE.{" "}
                      {currentBenchmark[0].count} ratings evaluated.
                    </p>
                  </div>
                ) : (
                  <div className="eval-steps">
                    <div>
                      <span>01</span> Hide one rating
                    </div>
                    <div>
                      <span>02</span> Predict it with each method
                    </div>
                    <div>
                      <span>03</span> Compare error and fallback use
                    </div>
                  </div>
                )}
                <p className="eval-caveat">
                  Synthetic data, tiny sample, repeated holdouts. This is a
                  learning exercise—not a representative benchmark or evidence
                  of real-world performance.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="section container learn-section" id="how-it-works">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                <span className="status-dot" /> UNDER THE HOOD
              </div>
              <h2>
                Curiosity, <em>explained.</em>
              </h2>
              <p>The ideas behind the interface, in plain language.</p>
            </div>
            <a
              className="text-link"
              href={SOURCE}
              target="_blank"
              rel="noreferrer"
            >
              Explore the source <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="learn-grid">
            <article>
              <span className="learn-icon">
                <UsersRound size={20} />
              </span>
              <span className="learn-number">01</span>
              <h3>People like you</h3>
              <p>
                User-based filtering finds listeners with correlated ratings,
                then weights their opinions of an unseen item. It adjusts for
                each listener’s average rating.
              </p>
            </article>
            <article>
              <span className="learn-icon">
                <Layers3 size={20} />
              </span>
              <span className="learn-number">02</span>
              <h3>Items that relate</h3>
              <p>
                Item-based filtering compares products using shared listeners.
                Your ratings of similar products contribute to the prediction.
              </p>
            </article>
            <article>
              <span className="learn-icon">
                <FlaskConical size={20} />
              </span>
              <span className="learn-number">03</span>
              <h3>Test the idea</h3>
              <p>
                A leave-one-rating-out exercise tests each method on the same
                hidden ratings. Cold starts use a clearly labelled regularized
                popularity fallback.
              </p>
            </article>
          </div>
          <details className="method-details">
            <summary>
              What are the limitations? <ArrowDown size={16} />
            </summary>
            <p>
              Pearson similarity is based only on overlapping ratings and can be
              unstable with few overlaps. This small fictional matrix is not
              representative. The exercise does not measure ranking quality,
              bias, diversity, privacy, real users or production-scale behavior.
              The separate historical notebook used Amazon Electronics data;
              this interface does not load or reproduce its results.
            </p>
          </details>
        </section>
      </main>
      <footer>
        <div className="container footer-inner">
          <div>
            <a className="brand" href="#top">
              <span className="brand-mark">
                <AudioLines size={20} />
              </span>
              <span>
                SIGNAL<small>RECOMMENDATION LAB</small>
              </span>
            </a>
            <p>An experiment in making the invisible visible.</p>
          </div>
          <div className="footer-right">
            <span>MADE FOR THE CURIOUS</span>
            <a href={SOURCE} target="_blank" rel="noreferrer">
              View the project <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>
            Fictional data · no account required · ratings stored locally
          </span>
          <a href="#top">BACK TO TOP ↑</a>
        </div>
      </footer>
    </>
  );
}

export default App;
