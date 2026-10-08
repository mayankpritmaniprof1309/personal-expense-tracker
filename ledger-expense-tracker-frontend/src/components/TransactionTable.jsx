import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Search,
  Pencil,
  Trash2,
  ArrowUpCircle,
  ArrowDownCircle,
  Inbox,
  ChevronLeft,
  ChevronRight,
  Banknote,
  Smartphone,
  FileDown,
  Sheet,
  Loader2,
} from "lucide-react";
import { formatCurrency, formatDate } from "../utils/format";
import { getExportTransactions } from "../services/transactionService";
import { exportTransactionsToCSV, exportReportToPDF } from "../utils/export";

const PAGE_SIZE = 8;

export default function TransactionTable({ transactions = [], onEdit, onDelete }) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [modeFilter, setModeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [exportingCSV, setExportingCSV] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchesQuery = t.name?.toLowerCase().includes(query.toLowerCase());
      const matchesType = typeFilter === "all" || t.type === typeFilter;
      const mode = t.transactionMode || "upi";
      const matchesMode = modeFilter === "all" || mode === modeFilter;
      return matchesQuery && matchesType && matchesMode;
    });
  }, [transactions, query, typeFilter, modeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function updateQuery(v) {
    setQuery(v);
    setPage(1);
  }
  function updateType(v) {
    setTypeFilter(v);
    setPage(1);
  }
  function updateMode(v) {
    setModeFilter(v);
    setPage(1);
  }

  async function handleExportCSV() {
    setExportingCSV(true);
    try {
      const params = {};
      if (typeFilter !== "all") params.type = typeFilter;
      if (modeFilter !== "all") params.mode = modeFilter;
      if (query.trim()) params.search = query.trim();

      const res = await getExportTransactions(params);
      const fullList = Array.isArray(res) ? res : res?.transactions || res?.data || [];
      if (!fullList.length) {
        toast.error("No transactions found matching active filters");
        return;
      }
      exportTransactionsToCSV(fullList);
      toast.success(`Exported all ${fullList.length} matching transactions to Excel/CSV`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to export Excel/CSV");
    } finally {
      setExportingCSV(false);
    }
  }

  async function handleExportPDF() {
    setExportingPDF(true);
    try {
      const params = {};
      if (typeFilter !== "all") params.type = typeFilter;
      if (modeFilter !== "all") params.mode = modeFilter;
      if (query.trim()) params.search = query.trim();

      const res = await getExportTransactions(params);
      const fullList = Array.isArray(res) ? res : res?.transactions || res?.data || [];
      if (!fullList.length) {
        toast.error("No transactions found matching active filters");
        return;
      }
      exportReportToPDF({ transactions: fullList });
      toast.success(`Exported all ${fullList.length} matching transactions to PDF`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to export PDF");
    } finally {
      setExportingPDF(false);
    }
  }

  return (
    <div className="glass-panel p-6">
      <div className="mb-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-white">Transactions</h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleExportCSV}
              disabled={exportingCSV}
              className="btn-ghost !py-1.5 !px-3 text-xs"
              title="Export all matching transactions to Excel/CSV"
            >
              {exportingCSV ? <Loader2 size={13} className="animate-spin" /> : <Sheet size={13} />}
              {exportingCSV ? "Exporting..." : "Export Excel"}
            </button>
            <button
              type="button"
              onClick={handleExportPDF}
              disabled={exportingPDF}
              className="btn-primary !py-1.5 !px-3 text-xs"
              title="Export all matching transactions to PDF"
            >
              {exportingPDF ? <Loader2 size={13} className="animate-spin" /> : <FileDown size={13} />}
              {exportingPDF ? "Exporting..." : "Export PDF"}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 min-w-[180px]">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              value={query}
              onChange={(e) => updateQuery(e.target.value)}
              placeholder="Search transactions..."
              className="input-glass !py-2 pl-9 w-full text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.02] p-1 text-xs">
              <span className="px-2 text-[11px] font-semibold uppercase tracking-wider text-white/40">Type:</span>
              {["all", "income", "expense"].map((t) => (
                <button
                  key={t}
                  onClick={() => updateType(t)}
                  className={`rounded-lg px-2.5 py-1 font-medium capitalize transition-colors ${
                    typeFilter === t ? "bg-violet-500/30 text-violet-200 border border-violet-500/40" : "text-white/40 hover:text-white/70"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.02] p-1 text-xs">
              <span className="px-2 text-[11px] font-semibold uppercase tracking-wider text-white/40">Mode:</span>
              {[
                { id: "all", label: "All" },
                { id: "cash", label: "💵 Cash" },
                { id: "upi", label: "📱 UPI" },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => updateMode(m.id)}
                  className={`rounded-lg px-2.5 py-1 font-medium transition-colors ${
                    modeFilter === m.id ? "bg-cyan-500/30 text-cyan-200 border border-cyan-500/40" : "text-white/40 hover:text-white/70"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {pageItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.04] text-white/30">
            <Inbox size={22} />
          </div>
          <p className="mt-4 text-sm font-medium text-white/60">No transactions found</p>
          <p className="mt-1 text-xs text-white/30">
            {transactions.length === 0
              ? "Add your first transaction using the form above."
              : "Try a different search term or filter combination."}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-xl border border-white/[0.06] md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02] text-left text-xs uppercase tracking-wider text-white/40">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Mode</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 text-right font-medium">Amount</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {pageItems.map((t) => {
                    const mode = t.transactionMode || "upi";
                    return (
                      <motion.tr
                        key={t._id || t.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-b border-white/[0.04] last:border-none hover:bg-white/[0.02]"
                      >
                        <td className="px-4 py-3 font-medium text-white">
                          {t.name}
                          {t.isDefault && (
                            <span className="ml-2 rounded-full bg-violet-500/15 px-2 py-0.5 text-[10px] text-violet-300">
                              default
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                              t.type === "income" ? "text-income-400" : "text-expense-400"
                            }`}
                          >
                            {t.type === "income" ? (
                              <ArrowUpCircle size={13} />
                            ) : (
                              <ArrowDownCircle size={13} />
                            )}
                            {t.type === "income" ? "Income" : "Expense"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {mode === "cash" ? (
                            <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-300">
                              <Banknote size={12} /> Cash
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-xs font-medium text-cyan-300">
                              <Smartphone size={12} /> UPI
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-white/50">{formatDate(t.date || t.createdAt)}</td>
                        <td
                          className={`tabular px-4 py-3 text-right font-semibold ${
                            t.type === "income" ? "text-income-400" : "text-expense-400"
                          }`}
                        >
                          {t.type === "income" ? "+" : "-"}
                          {formatCurrency(t.amount)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => onEdit(t)}
                              className="rounded-lg p-2 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
                              aria-label={`Edit ${t.name}`}
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => onDelete(t)}
                              className="rounded-lg p-2 text-white/40 transition-colors hover:bg-expense-glow hover:text-expense-400"
                              aria-label={`Delete ${t.name}`}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            <AnimatePresence initial={false}>
              {pageItems.map((t) => {
                const mode = t.transactionMode || "upi";
                return (
                  <motion.div
                    key={t._id || t.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">{t.name}</p>
                        <p className="mt-0.5 text-xs text-white/40">{formatDate(t.date || t.createdAt)}</p>
                      </div>
                      <p
                        className={`tabular text-sm font-semibold ${
                          t.type === "income" ? "text-income-400" : "text-expense-400"
                        }`}
                      >
                        {t.type === "income" ? "+" : "-"}
                        {formatCurrency(t.amount)}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                            t.type === "income" ? "text-income-400" : "text-expense-400"
                          }`}
                        >
                          {t.type === "income" ? <ArrowUpCircle size={13} /> : <ArrowDownCircle size={13} />}
                          {t.type === "income" ? "Income" : "Expense"}
                        </span>
                        {mode === "cash" ? (
                          <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[11px] font-medium text-amber-300">
                            💵 Cash
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-md border border-cyan-500/30 bg-cyan-500/10 px-1.5 py-0.5 text-[11px] font-medium text-cyan-300">
                            📱 UPI
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => onEdit(t)}
                          className="rounded-lg p-2 text-white/40 hover:bg-white/10 hover:text-white"
                          aria-label={`Edit ${t.name}`}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => onDelete(t)}
                          className="rounded-lg p-2 text-white/40 hover:bg-expense-glow hover:text-expense-400"
                          aria-label={`Delete ${t.name}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {totalPages > 1 && (
            <div className="mt-5 flex items-center justify-between text-xs text-white/40">
              <span>
                Page {currentPage} of {totalPages} &middot; {filtered.length} transactions
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="btn-ghost !px-3 !py-1.5 disabled:opacity-30"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="btn-ghost !px-3 !py-1.5 disabled:opacity-30"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
