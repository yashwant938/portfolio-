import { describe, expect, it } from "vitest";
import { initialRatings, products } from "./data";
import { evaluate, predict, recommend, similarity } from "./recommender";

describe("recommendation calculations", () => {
  it("uses Pearson correlation over common ratings and rejects insufficient overlap", () => {
    expect(similarity({ a: 5, b: 1 }, { a: 4, b: 2 })).toEqual({
      value: 1,
      overlap: 2,
    });
    expect(similarity({ a: 5, b: null }, { a: 4, b: 2 })).toEqual({
      value: 0,
      overlap: 1,
    });
    expect(similarity({ a: 3, b: 3 }, { a: 4, b: 2 }).value).toBe(0);
  });

  it("computes user-neighbor predictions from the actual rating and neighbor mean", () => {
    const matrix = {
      target: { a: 5, b: 1, c: null },
      neighbor: { a: 4, b: 2, c: 5 },
    };
    const result = predict(matrix, "target", "c", "user");
    expect(result.direct).toBe(true);
    expect(result.score).toBeCloseTo(3 + (5 - 11 / 3));
    expect(result.evidence[0]).toMatchObject({
      id: "neighbor",
      rating: 5,
      overlap: 2,
    });
  });

  it("uses a clearly marked popularity fallback when there is no evidence", () => {
    const matrix = { cold: { a: null }, peer: { a: 5 } };
    const result = predict(matrix, "cold", "a", "user");
    expect(result.direct).toBe(false);
    expect(result.evidence).toHaveLength(0);
    expect(result.score).toBe(5);
  });

  it("never recommends an already rated item and keeps scores in range", () => {
    const matrix = initialRatings();
    for (const method of ["user", "item", "popular"] as const) {
      const results = recommend(
        matrix,
        "maya",
        products.map((p) => p.id),
        method,
      );
      expect(results.every((result) => matrix.maya[result.id] === null)).toBe(
        true,
      );
      expect(
        results.every((result) => result.score >= 1 && result.score <= 5),
      ).toBe(true);
    }
  });

  it("evaluates every held-out rating without mutating the original matrix", () => {
    const matrix = initialRatings();
    const before = JSON.stringify(matrix);
    const expected = Object.values(matrix)
      .flatMap(Object.values)
      .filter((v) => v !== null).length;
    const scores = evaluate(matrix, ["user", "item", "popular"]);
    expect(JSON.stringify(matrix)).toBe(before);
    expect(
      scores.every(
        (score) => score.count === expected && score.mae >= 0 && score.mae <= 4,
      ),
    ).toBe(true);
    expect(
      scores.every((score) => score.coverage >= 0 && score.coverage <= 1),
    ).toBe(true);
    expect(scores.find((score) => score.method === "popular")?.coverage).toBe(
      1,
    );
  });
});
