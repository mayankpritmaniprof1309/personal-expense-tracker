import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Flame,
  Hash,
  FileDown,
  Sheet,
} from "lucide-react";
import { getTransactions } from "../services/transactionService";
import { formatCurrency, formatDate } from "../utils/format";
import { exportTransactionsToCSV, exportReportToPDF } from "../utils/export";
import { SummaryCardsSkeleton, TableRowsSkeleton, ChartSkeleton } from "../components/LoadingSkeleton";
import IncomeExpenseBarChart from "../components/IncomeExpenseBarChart";
import MonthlyReport from "../components/MonthlyReport";

export default function Reports() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await getTransactions();
        const list = Array.isArray(res) ? res : res?.transactions || res?.data || [];
        setTransactions(list);
      } catch (err) {
        setLoadError(
          err?.response?.data?.message || "Couldn't load your transactions for this report."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const stats = useMemo(() => {
    const income = transactions.filter((t) => t.type === "income");
    const expense = transactions.filter((t) => t.type === "expense");
    const totalIncome = income.reduce((s, t) => s + Number(t.amount || 0), 0);
    const totalExpense = expense.reduce((s, t) => s + Number(t.amount || 0), 0);
    const highestExpense = expense.reduce(
      (max, t) => (Number(t.amount) > Number(max?.amount || 0) ? t : max),
      null
    );
    return {
      totalIncome,
      totalExpense,
      savings: totalIncome - totalExpense,
      highestExpense,
      count: transactions.length,
    };
  }, [transactions]);

  const cards = [
    { label: "Total Income", value: formatCurrency(stats.totalIncome), icon: TrendingUp, accent: "text-income-400", chip: "bg-income-glow" },
    { label: "Total Expense", value: formatCurrency(stats.totalExpense), icon: TrendingDown, accent: "text-expense-400", chip: "bg-expense-glow" },
    { label: "Savings", value: formatCurrency(stats.savings), icon: PiggyBank, accent: stats.savings >= 0 ? "text-cyan-400" : "text-expense-400", chip: "bg-cyan-400/15" },
    {
      label: "Highest Expense",
      value: stats.highestExpense ? formatCurrency(stats.highestExpense.amount) : "—",
      sub: stats.highestExpense?.name,
      icon: Flame,
      accent: "text-orange-400",
      chip: "bg-orange-400/15",
    },
    { label: "Transactions", value: stats.count, icon: Hash, accent: "text-violet-400", chip: "bg-violet-500/15" },
  ];

  function handleExportCSV() {
    if (!transactions.length) {
      toast.error("No transactions to export yet");
      return;
    }
    exportTransactionsToCSV(transactions);
    toast.success("CSV export started");
  }

  function handleExportPDF() {
    if (!transactions.length) {
      toast.error("No transactions to export yet");
      return;
    }
    exportReportToPDF({ stats, transactions });
    toast.success("PDF export started");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-white sm:text-3xl">Reports</h1>
          <p className="mt-1 text-sm text-white/40">A complete snapshot of your financial activity.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExportCSV} className="btn-ghost">
            <Sheet size={15} /> Export CSV
          </button>
          <button onClick={handleExportPDF} className="btn-primary">
            <FileDown size={15} /> Export PDF
          </button>
        </div>
      </div>

      {loadError && (
        <div className="rounded-xl border border-expense-500/30 bg-expense-glow px-4 py-3 text-sm text-expense-400">
          {loadError}
        </div>
      )}

      {loading ? (
        <SummaryCardsSkeleton />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {cards.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="glass-panel p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wider text-white/40">{c.label}</p>
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${c.chip} ${c.accent}`}>
                  <c.icon size={15} />
                </span>
              </div>
              <p className="tabular mt-3 text-xl font-semibold text-white">{c.value}</p>
              {c.sub && <p className="mt-0.5 truncate text-xs text-white/40">{c.sub}</p>}
            </motion.div>
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-1 gap-6 lg:grid-cols-2"
      >
        {loading ? <ChartSkeleton /> : <IncomeExpenseBarChart transactions={transactions} />}
        {loading ? <ChartSkeleton /> : <MonthlyReport transactions={transactions} />}
      </motion.div>

      <div className="glass-panel p-6">
        <h3 className="mb-4 font-display text-lg font-semibold text-white">All transactions</h3>
        {loading ? (
          <TableRowsSkeleton rows={6} />
        ) : transactions.length === 0 ? (
          <p className="py-10 text-center text-sm text-white/30">No transactions recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] text-left text-xs uppercase tracking-wider text-white/40">
                  <th className="px-3 py-2 font-medium">Name</th>
                  <th className="px-3 py-2 font-medium">Type</th>
                  <th className="px-3 py-2 font-medium">Date</th>
                  <th className="px-3 py-2 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t._id || t.id} className="border-b border-white/[0.04] last:border-none">
                    <td className="px-3 py-2.5 text-white">{t.name}</td>
                    <td className={`px-3 py-2.5 capitalize ${t.type === "income" ? "text-income-400" : "text-expense-400"}`}>
                      {t.type}
                    </td>
                    <td className="px-3 py-2.5 text-white/50">{formatDate(t.date || t.createdAt)}</td>
                    <td
                      className={`tabular px-3 py-2.5 text-right font-medium ${
                        t.type === "income" ? "text-income-400" : "text-expense-400"
                      }`}
                    >
                      {t.type === "income" ? "+" : "-"}
                      {formatCurrency(t.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
