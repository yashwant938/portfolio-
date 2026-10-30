import type { RatingMatrix } from "./data";

export type Method = "user" | "item" | "popular";
export type Evidence = {
  id: string;
  similarity: number;
  rating: number;
  overlap: number;
};
export type Prediction = {
  score: number;
  direct: boolean;
  evidence: Evidence[];
  method: Method;
};
export type Evaluation = {
  method: Method;
  mae: number;
  coverage: number;
  count: number;
};

const isRating = (value: number | null | undefined): value is number =>
  typeof value === "number" &&
  Number.isFinite(value) &&
  value >= 1 &&
  value <= 5;
const average = (values: number[]) =>
  values.reduce((a, b) => a + b, 0) / values.length;
const clamp = (value: number) => Math.max(1, Math.min(5, value));

export function similarity(
  a: Record<string, number | null>,
  b: Record<string, number | null>,
): { value: number; overlap: number } {
  const common = Object.keys(a).filter(
    (key) => isRating(a[key]) && isRating(b[key]),
  );
  if (common.length < 2) return { value: 0, overlap: common.length };
  const x = common.map((key) => a[key] as number);
  const y = common.map((key) => b[key] as number);
  const mx = average(x),
    my = average(y);
  let numerator = 0,
    dx = 0,
    dy = 0;
  for (let i = 0; i < common.length; i++) {
    numerator += (x[i] - mx) * (y[i] - my);
    dx += (x[i] - mx) ** 2;
    dy += (y[i] - my) ** 2;
  }
  return {
    value: dx && dy ? numerator / Math.sqrt(dx * dy) : 0,
    overlap: common.length,
  };
}

function popularity(matrix: RatingMatrix, product: string): number {
  const all = Object.values(matrix).flatMap((row) =>
    Object.values(row).filter(isRating),
  );
  const global = all.length ? average(all) : 3.5;
  const ratings = Object.values(matrix)
    .map((row) => row[product])
    .filter(isRating);
  // Three virtual ratings at the global mean regularize sparsely rated items.
  return (
    (ratings.reduce((a, b) => a + b, 0) + 3 * global) / (ratings.length + 3)
  );
}

function itemRatings(
  matrix: RatingMatrix,
  product: string,
): Record<string, number | null> {
  return Object.fromEntries(
    Object.entries(matrix).map(([user, ratings]) => [
      user,
      ratings[product] ?? null,
    ]),
  );
}

export function predict(
  matrix: RatingMatrix,
  user: string,
  product: string,
  method: Method,
  k = 3,
): Prediction {
  const fallback = (): Prediction => ({
    score: popularity(matrix, product),
    direct: false,
    evidence: [],
    method,
  });
  if (method === "popular") return { ...fallback(), direct: true };
  const active = matrix[user];
  if (!active) return fallback();
  const evidence: Evidence[] = [];
  if (method === "user") {
    for (const [other, ratings] of Object.entries(matrix)) {
      if (other === user || !isRating(ratings[product])) continue;
      const compared = similarity(active, ratings);
      if (compared.value > 1e-10)
        evidence.push({
          id: other,
          similarity: compared.value,
          rating: ratings[product] as number,
          overlap: compared.overlap,
        });
    }
  } else {
    const targetRatings = itemRatings(matrix, product);
    for (const [ratedProduct, rating] of Object.entries(active)) {
      if (ratedProduct === product || !isRating(rating)) continue;
      const compared = similarity(
        targetRatings,
        itemRatings(matrix, ratedProduct),
      );
      if (compared.value > 1e-10)
        evidence.push({
          id: ratedProduct,
          similarity: compared.value,
          rating,
          overlap: compared.overlap,
        });
    }
  }
  evidence.sort(
    (a, b) => b.similarity - a.similarity || a.id.localeCompare(b.id),
  );
  const top = evidence.slice(0, Math.max(1, Math.min(5, Math.floor(k))));
  if (!top.length) return fallback();
  const weight = top.reduce((sum, item) => sum + item.similarity, 0);
  if (method === "item") {
    return {
      score: clamp(
        top.reduce((sum, item) => sum + item.similarity * item.rating, 0) /
          weight,
      ),
      direct: true,
      evidence: top,
      method,
    };
  }
  const activeRatings = Object.values(active).filter(isRating);
  if (!activeRatings.length) return fallback();
  const adjustment =
    top.reduce((sum, item) => {
      const neighborMean = average(
        Object.values(matrix[item.id]).filter(isRating),
      );
      return sum + item.similarity * (item.rating - neighborMean);
    }, 0) / weight;
  return {
    score: clamp(average(activeRatings) + adjustment),
    direct: true,
    evidence: top,
    method,
  };
}

export function recommend(
  matrix: RatingMatrix,
  user: string,
  productIds: string[],
  method: Method,
  k = 3,
) {
  return productIds
    .filter((id) => !isRating(matrix[user]?.[id]))
    .map((id) => ({ id, ...predict(matrix, user, id, method, k) }))
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
}

export function evaluate(
  matrix: RatingMatrix,
  methods: Method[],
  k = 3,
): Evaluation[] {
  const totals = methods.map((method) => ({
    method,
    absoluteError: 0,
    direct: 0,
    count: 0,
  }));
  for (const [user, row] of Object.entries(matrix)) {
    for (const [product, actual] of Object.entries(row)) {
      if (!isRating(actual)) continue;
      // Copy only the changed row; the held-out rating is not visible to any model.
      const training = { ...matrix, [user]: { ...row, [product]: null } };
      for (const total of totals) {
        const prediction = predict(training, user, product, total.method, k);
        total.absoluteError += Math.abs(actual - prediction.score);
        total.direct += Number(prediction.direct);
        total.count++;
      }
    }
  }
  return totals.map((total) => ({
    method: total.method,
    mae: total.count ? total.absoluteError / total.count : 0,
    coverage: total.count ? total.direct / total.count : 0,
    count: total.count,
  }));
}
