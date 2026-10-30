import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Evaluation } from "./recommender";

const labels = {
  user: "Similar listeners",
  item: "Similar items",
  popular: "Popular baseline",
};

export default function EvaluationChart({
  results,
}: {
  results: Evaluation[];
}) {
  return (
    <div className="chart-wrap">
      <ResponsiveContainer width="100%" height={210}>
        <BarChart
          data={results.map((result) => ({
            ...result,
            name: labels[result.method],
          }))}
          margin={{ top: 15, right: 18, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            vertical={false}
            stroke="#26343a"
            strokeDasharray="3 4"
          />
          <XAxis
            dataKey="name"
            tick={{ fill: "#aab9b4", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 4]}
            tick={{ fill: "#71877e", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "rgba(157,232,201,.05)" }}
            contentStyle={{
              background: "#15272b",
              border: "1px solid #38544b",
              borderRadius: 8,
              color: "#eef8ef",
            }}
            formatter={(value) => [Number(value).toFixed(3), "MAE"]}
          />
          <Bar dataKey="mae" radius={[6, 6, 0, 0]} maxBarSize={58}>
            {results.map((result) => (
              <Cell
                key={result.method}
                fill={
                  result.method === "user"
                    ? "#a5ecd0"
                    : result.method === "item"
                      ? "#9cb4e8"
                      : "#e6c58e"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
