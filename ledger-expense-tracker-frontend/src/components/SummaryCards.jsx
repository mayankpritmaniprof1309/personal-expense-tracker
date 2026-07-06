import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, Scale, Receipt } from "lucide-react";
import { formatCurrency } from "../utils/format";

export default function SummaryCards({ summary }) {
  const income = summary?.income?.totalAmount ?? 0;
  const expense = summary?.expense?.totalAmount ?? 0;
  const balance = summary?.balance ?? income - expense;
  const totalCount = (summary?.income?.count ?? 0) + (summary?.expense?.count ?? 0);

  const cards = [
    {
      label: "Total Income",
      value: formatCurrency(income),
      icon: ArrowUpRight,
      accent: "text-income-400",
      chip: "bg-income-glow",
    },
    {
      label: "Total Expense",
      value: formatCurrency(expense),
      icon: ArrowDownLeft,
      accent: "text-expense-400",
      chip: "bg-expense-glow",
    },
    {
      label: "Balance",
      value: formatCurrency(balance),
      icon: Scale,
      accent: balance >= 0 ? "text-cyan-400" : "text-expense-400",
      chip: "bg-cyan-400/15",
    },
    {
      label: "Total Transactions",
      value: totalCount,
      icon: Receipt,
      accent: "text-violet-400",
      chip: "bg-violet-500/15",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c, i) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
          className="glass-panel p-5"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-white/40">
              {c.label}
            </p>
            <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${c.chip} ${c.accent}`}>
              <c.icon size={15} />
            </span>
          </div>
          <p className="tabular mt-3 text-2xl font-semibold text-white">{c.value}</p>
        </motion.div>
      ))}
    </div>
  );
}
