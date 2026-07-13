import { useMemo, useState } from "react";
import {
  ComposedChart,
  Bar,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { BarChart3, AreaChart as AreaIcon, LineChart as LineIcon, ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { formatCurrency } from "../utils/format";

const VIEWS = [
  { key: "bar", label: "Bar", icon: BarChart3 },
  { key: "area", label: "Area", icon: AreaIcon },
  { key: "line", label: "Line", icon: LineIcon },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-lg px-3 py-2 text-xs">
      <p className="mb-1 font-medium text-white">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="tabular" style={{ color: p.stroke || p.fill }}>
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
}

/** Build a "YYYY-MM" key from a Date object */
function toMonthKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/** Format a "YYYY-MM" key to a display label like "Jul 2026" */
function formatMonthLabel(key) {
  const [y, m] = key.split("-");
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}

export default function MonthlyReport({ transactions = [] }) {
  const [view, setView] = useState("area");
  const [selectedMonth, setSelectedMonth] = useState(null);

  // Derive all months that have data, sorted chronologically
  const availableMonths = useMemo(() => {
    const monthSet = new Set();
    transactions.forEach((t) => {
      const d = new Date(t.date || t.createdAt || Date.now());
      if (!Number.isNaN(d.getTime())) {
        monthSet.add(toMonthKey(d));
      }
    });
    return [...monthSet].sort();
  }, [transactions]);

  // Default to current month if it has data, otherwise last available month
  const currentMonthKey = toMonthKey(new Date());
  const defaultMonth = availableMonths.includes(currentMonthKey)
    ? currentMonthKey
    : availableMonths[availableMonths.length - 1] || currentMonthKey;

  const effectiveMonth = (selectedMonth && availableMonths.includes(selectedMonth))
    ? selectedMonth
    : defaultMonth;

  const selectedIdx = availableMonths.indexOf(effectiveMonth);
  const canGoBack = selectedIdx > 0;
  const canGoForward = selectedIdx < availableMonths.length - 1;

  function goBack() {
    if (canGoBack) setSelectedMonth(availableMonths[selectedIdx - 1]);
  }
  function goForward() {
    if (canGoForward) setSelectedMonth(availableMonths[selectedIdx + 1]);
  }

  // Aggregate day-by-day data for the selected month
  const data = useMemo(() => {
    const [y, m] = effectiveMonth.split("-").map(Number);

    const dayMap = {};

    transactions.forEach((t) => {
      const d = new Date(t.date || t.createdAt || Date.now());
      if (Number.isNaN(d.getTime())) return;
      if (toMonthKey(d) !== effectiveMonth) return;
      const dayNum = d.getDate();
      if (!dayMap[dayNum]) {
        const label = `${dayNum} ${new Date(y, m - 1, dayNum).toLocaleDateString("en-IN", { month: "short" })}`;
        dayMap[dayNum] = { day: label, income: 0, expense: 0, _sort: dayNum };
      }
      dayMap[dayNum][t.type === "income" ? "income" : "expense"] += Number(t.amount) || 0;
    });

    return Object.values(dayMap).sort((a, b) => a._sort - b._sort);
  }, [transactions, effectiveMonth]);

  return (
    <div className="glass-panel p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold text-white">Monthly Report</h3>
          <p className="mt-1 text-xs text-white/40">Day-by-day breakdown for the selected month</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Month selector */}
          <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.02] p-1">
            <button
              type="button"
              onClick={goBack}
              disabled={!canGoBack}
              className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
              aria-label="Previous month"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="flex items-center gap-1.5 px-2 text-xs font-medium text-white">
              <CalendarDays size={12} className="text-white/40" />
              {formatMonthLabel(effectiveMonth)}
            </span>
            <button
              type="button"
              onClick={goForward}
              disabled={!canGoForward}
              className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
              aria-label="Next month"
            >
              <ChevronRight size={14} />
            </button>
          </div>
          {/* View toggle */}
          <div className="flex rounded-xl border border-white/10 bg-white/[0.02] p-1">
            {VIEWS.map((v) => (
              <button
                key={v.key}
                onClick={() => setView(v.key)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  view === v.key ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70"
                }`}
              >
                <v.icon size={13} /> {v.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="flex h-72 items-center justify-center text-sm text-white/30">
          No transactions in {formatMonthLabel(effectiveMonth)}
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={data}>
            <defs>
              <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4ade80" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#4ade80" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fb7185" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#fb7185" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="day"
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
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.1)" }} />
            <Legend formatter={(value) => <span className="text-xs capitalize text-white/60">{value}</span>} />

            {view === "bar" && (
              <>
                <Bar dataKey="income" name="Income" fill="#4ade80" radius={[6, 6, 0, 0]} animationDuration={700} />
                <Bar dataKey="expense" name="Expense" fill="#fb7185" radius={[6, 6, 0, 0]} animationDuration={700} />
              </>
            )}
            {view === "area" && (
              <>
                <Area
                  type="monotone"
                  dataKey="income"
                  name="Income"
                  stroke="#4ade80"
                  fill="url(#incomeFill)"
                  strokeWidth={2}
                  animationDuration={800}
                />
                <Area
                  type="monotone"
                  dataKey="expense"
                  name="Expense"
                  stroke="#fb7185"
                  fill="url(#expenseFill)"
                  strokeWidth={2}
                  animationDuration={800}
                />
              </>
            )}
            {view === "line" && (
              <>
                <Line
                  type="monotone"
                  dataKey="income"
                  name="Income"
                  stroke="#4ade80"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  animationDuration={800}
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  name="Expense"
                  stroke="#fb7185"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  animationDuration={800}
                />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

