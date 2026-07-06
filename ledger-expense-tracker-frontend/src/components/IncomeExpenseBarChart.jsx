import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "../utils/format";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-lg px-3 py-2 text-xs">
      <p className="mb-1 font-medium text-white">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="tabular" style={{ color: p.fill }}>
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
}

export default function IncomeExpenseBarChart({ transactions = [] }) {
  const data = useMemo(() => {
    const grouped = {};
    transactions.forEach((t) => {
      const key = t.name || "Other";
      if (!grouped[key]) grouped[key] = { name: key, income: 0, expense: 0 };
      grouped[key][t.type === "income" ? "income" : "expense"] += Number(t.amount) || 0;
    });
    return Object.values(grouped)
      .sort((a, b) => b.income + b.expense - (a.income + a.expense))
      .slice(0, 6);
  }, [transactions]);

  return (
    <div className="glass-panel p-6">
      <h3 className="font-display text-lg font-semibold text-white">Top Categories</h3>
      <p className="mt-1 text-xs text-white/40">Income vs. expense by transaction name</p>

      {data.length === 0 ? (
        <div className="flex h-64 items-center justify-center text-sm text-white/30">
          No data to visualize yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
              axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Legend
              formatter={(value) => <span className="text-xs capitalize text-white/60">{value}</span>}
            />
            <Bar dataKey="income" name="Income" fill="#4ade80" radius={[6, 6, 0, 0]} animationDuration={700} />
            <Bar dataKey="expense" name="Expense" fill="#fb7185" radius={[6, 6, 0, 0]} animationDuration={700} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
