import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import SummaryCards from "../components/SummaryCards";
import TransactionForm from "../components/TransactionForm";
import TransactionTable from "../components/TransactionTable";
import ExpensePieChart from "../components/ExpensePieChart";
import IncomeExpenseBarChart from "../components/IncomeExpenseBarChart";
import MonthlyReport from "../components/MonthlyReport";
import ConfirmModal from "../components/ConfirmModal";
import { SummaryCardsSkeleton, ChartSkeleton, TableRowsSkeleton } from "../components/LoadingSkeleton";
import {
  getTransactions,
  getSummary,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../services/transactionService";

function deriveSummary(transactions) {
  const income = transactions.filter((t) => t.type === "income");
  const expense = transactions.filter((t) => t.type === "expense");
  const incomeTotal = income.reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const expenseTotal = expense.reduce((sum, t) => sum + Number(t.amount || 0), 0);
  return {
    income: { totalAmount: incomeTotal, count: income.length },
    expense: { totalAmount: expenseTotal, count: expense.length },
    balance: incomeTotal - expenseTotal,
  };
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [editingTx, setEditingTx] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoadError("");
    try {
      const [txRes, summaryRes] = await Promise.all([getTransactions(), getSummary()]);
      const txList = Array.isArray(txRes) ? txRes : txRes?.transactions || txRes?.data || [];
      setTransactions(txList);
      setSummary(summaryRes?.summary || summaryRes || deriveSummary(txList));
    } catch (err) {
      setLoadError(
        err?.response?.data?.message ||
          "Couldn't reach the server. Make sure your backend is running and VITE_API_BASE_URL is set."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  async function handleCreate(payload) {
    const tempId = `temp-${Date.now()}`;
    const optimisticTx = { ...payload, _id: tempId, createdAt: new Date().toISOString() };
    const prevTransactions = transactions;
    const prevSummary = summary;

    setTransactions((prev) => [optimisticTx, ...prev]);
    setSummary((prev) => {
      const base = prev || { income: { totalAmount: 0, count: 0 }, expense: { totalAmount: 0, count: 0 }, balance: 0 };
      const key = payload.type === "income" ? "income" : "expense";
      const next = {
        ...base,
        [key]: {
          totalAmount: (base[key]?.totalAmount || 0) + Number(payload.amount),
          count: (base[key]?.count || 0) + 1,
        },
      };
      next.balance = next.income.totalAmount - next.expense.totalAmount;
      return next;
    });

    try {
      const res = await createTransaction(payload);
      const savedTx = res?.transaction || res?.data || res;
      if (savedTx?._id || savedTx?.id) {
        setTransactions((prev) => prev.map((t) => (t._id === tempId ? savedTx : t)));
      }
      toast.success("Transaction added");
      fetchAll();
    } catch (err) {
      setTransactions(prevTransactions);
      setSummary(prevSummary);
      toast.error(err?.response?.data?.message || "Couldn't add that transaction");
    }
  }

  async function handleUpdate(payload) {
    const id = editingTx._id || editingTx.id;
    const prevTransactions = transactions;
    const prevSummary = summary;

    setTransactions((prev) => prev.map((t) => ((t._id || t.id) === id ? { ...t, ...payload } : t)));
    setEditingTx(null);

    try {
      await updateTransaction(id, payload);
      toast.success("Transaction updated");
      fetchAll();
    } catch (err) {
      setTransactions(prevTransactions);
      setSummary(prevSummary);
      toast.error(err?.response?.data?.message || "Couldn't update that transaction");
    }
  }

  async function handleDeleteConfirmed() {
    if (!deleteTarget) return;
    const id = deleteTarget._id || deleteTarget.id;
    const prevTransactions = transactions;
    const prevSummary = summary;

    setDeleteLoading(true);
    setTransactions((prev) => prev.filter((t) => (t._id || t.id) !== id));
    setSummary((prev) => {
      if (!prev) return prev;
      const key = deleteTarget.type === "income" ? "income" : "expense";
      const next = {
        ...prev,
        [key]: {
          totalAmount: Math.max(0, (prev[key]?.totalAmount || 0) - Number(deleteTarget.amount)),
          count: Math.max(0, (prev[key]?.count || 0) - 1),
        },
      };
      next.balance = next.income.totalAmount - next.expense.totalAmount;
      return next;
    });

    try {
      await deleteTransaction(id);
      toast.success("Transaction deleted");
      fetchAll();
    } catch (err) {
      setTransactions(prevTransactions);
      setSummary(prevSummary);
      toast.error(err?.response?.data?.message || "Couldn't delete that transaction");
    } finally {
      setDeleteLoading(false);
      setDeleteTarget(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-white sm:text-3xl">Overview</h1>
        <p className="mt-1 text-sm text-white/40">Your income, expenses, and balance at a glance.</p>
      </div>

      {loadError && (
        <div className="rounded-xl border border-expense-500/30 bg-expense-glow px-4 py-3 text-sm text-expense-400">
          {loadError}
        </div>
      )}

      {loading ? <SummaryCardsSkeleton /> : <SummaryCards summary={summary} />}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <TransactionForm
            key={editingTx ? editingTx._id || editingTx.id : "new"}
            initialData={editingTx}
            onSubmit={editingTx ? handleUpdate : handleCreate}
            onCancel={() => setEditingTx(null)}
          />
        </div>
        <div className="lg:col-span-3">
          {loading ? (
            <div className="glass-panel p-6">
              <TableRowsSkeleton />
            </div>
          ) : (
            <TransactionTable
              transactions={transactions}
              onEdit={setEditingTx}
              onDelete={setDeleteTarget}
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {loading ? <ChartSkeleton /> : <ExpensePieChart summary={summary} />}
        {loading ? <ChartSkeleton /> : <IncomeExpenseBarChart transactions={transactions} />}
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        {loading ? <ChartSkeleton /> : <MonthlyReport transactions={transactions} />}
      </motion.div>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title={`Delete "${deleteTarget?.name}"?`}
        description="This transaction will be permanently removed from your records."
        loading={deleteLoading}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
