export type RatingMatrix = Record<string, Record<string, number | null>>;

export const products = [
  {
    id: "orbit",
    name: "Orbit One",
    type: "OVER-EAR",
    description: "Warm sound for long listening sessions.",
    color: "#b7f0df",
    mark: "01",
  },
  {
    id: "pulse",
    name: "Pulse Air",
    type: "WIRELESS",
    description: "A lightweight everyday companion.",
    color: "#f4c9a9",
    mark: "02",
  },
  {
    id: "nova",
    name: "Nova Studio",
    type: "STUDIO",
    description: "Clear detail for focused work.",
    color: "#c4c6ff",
    mark: "03",
  },
  {
    id: "drift",
    name: "Drift Mini",
    type: "IN-EAR",
    description: "Small, portable, made to move.",
    color: "#e9dfb0",
    mark: "04",
  },
  {
    id: "echo",
    name: "Echo Pro",
    type: "NOISE-CANCELLING",
    description: "A quieter space for the commute.",
    color: "#a8d7eb",
    mark: "05",
  },
  {
    id: "arc",
    name: "Arc Open",
    type: "OPEN-BACK",
    description: "An airy sound with room to breathe.",
    color: "#d8c0e8",
    mark: "06",
  },
  {
    id: "beam",
    name: "Beam Sport",
    type: "SPORT",
    description: "A secure fit for active days.",
    color: "#c3dca9",
    mark: "07",
  },
  {
    id: "halo",
    name: "Halo Play",
    type: "GAMING",
    description: "An immersive pick for play.",
    color: "#eab8b8",
    mark: "08",
  },
] as const;

export const listeners = [
  { id: "maya", name: "Maya", detail: "The everyday listener" },
  { id: "alex", name: "Alex", detail: "The detail seeker" },
  { id: "sam", name: "Sam", detail: "The commuter" },
  { id: "riley", name: "Riley", detail: "The explorer" },
  { id: "noor", name: "Noor", detail: "The creator" },
  { id: "kai", name: "Kai", detail: "The active listener" },
  { id: "jules", name: "Jules", detail: "The casual listener" },
  { id: "dev", name: "Dev", detail: "The gamer" },
  { id: "you", name: "Your profile", detail: "Start from scratch" },
] as const;

const rows: Record<string, (number | null)[]> = {
  maya: [5, 4, 4, 2, 5, null, null, null],
  alex: [5, 3, 5, 1, 4, 5, null, 2],
  sam: [4, 5, 3, 3, 5, 2, 3, null],
  riley: [3, 4, 2, 5, 3, null, 5, 4],
  noor: [5, 3, 5, 1, 4, 5, 2, 3],
  kai: [2, 4, 2, 5, 3, 1, 5, 4],
  jules: [4, 5, 3, 4, 4, 2, null, 3],
  dev: [3, 3, 4, 2, 4, 3, 2, 5],
  you: [null, null, null, null, null, null, null, null],
};

export function initialRatings(): RatingMatrix {
  return Object.fromEntries(
    Object.entries(rows).map(([user, ratings]) => [
      user,
      Object.fromEntries(
        products.map((product, index) => [product.id, ratings[index]]),
      ),
    ]),
  );
}
