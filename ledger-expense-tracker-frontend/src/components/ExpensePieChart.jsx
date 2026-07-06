import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { formatCurrency } from "../utils/format";

const COLORS = { Income: "#4ade80", Expense: "#fb7185" };

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="glass-strong rounded-lg px-3 py-2 text-xs">
      <p className="font-medium text-white">{item.name}</p>
      <p className="tabular text-white/60">{formatCurrency(item.value)}</p>
    </div>
  );
}

export default function ExpensePieChart({ summary }) {
  const data = [
    { name: "Income", value: summary?.income?.totalAmount ?? 0 },
    { name: "Expense", value: summary?.expense?.totalAmount ?? 0 },
  ];
  const isEmpty = data.every((d) => d.value === 0);

  return (
    <div className="glass-panel p-6">
      <h3 className="font-display text-lg font-semibold text-white">Income vs Expense</h3>
      <p className="mt-1 text-xs text-white/40">Share of total activity this period</p>

      {isEmpty ? (
        <div className="flex h-64 items-center justify-center text-sm text-white/30">
          No data to visualize yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={4}
              cornerRadius={8}
              stroke="none"
              animationDuration={800}
            >
              {data.map((d) => (
                <Cell key={d.name} fill={COLORS[d.name]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              formatter={(value) => <span className="text-xs text-white/60">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
