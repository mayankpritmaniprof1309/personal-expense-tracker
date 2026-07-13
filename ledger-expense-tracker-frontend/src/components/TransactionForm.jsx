import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, ArrowUpCircle, ArrowDownCircle, Loader2, CalendarDays } from "lucide-react";

function getTodayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

const emptyForm = { name: "", amount: "", type: "expense", isDefault: false, date: getTodayISO() };

export default function TransactionForm({ onSubmit, initialData = null, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const isEdit = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      // When editing, extract the date from the existing transaction
      let existingDate = getTodayISO();
      if (initialData.date) {
        const d = new Date(initialData.date);
        if (!Number.isNaN(d.getTime())) {
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, "0");
          const dd = String(d.getDate()).padStart(2, "0");
          existingDate = `${yyyy}-${mm}-${dd}`;
        }
      } else if (initialData.createdAt) {
        const d = new Date(initialData.createdAt);
        if (!Number.isNaN(d.getTime())) {
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, "0");
          const dd = String(d.getDate()).padStart(2, "0");
          existingDate = `${yyyy}-${mm}-${dd}`;
        }
      }
      setForm({
        name: initialData.name || "",
        amount: initialData.amount ?? "",
        type: initialData.type || "expense",
        isDefault: Boolean(initialData.isDefault),
        date: existingDate,
      });
    } else {
      setForm({ ...emptyForm, date: getTodayISO() });
    }
  }, [initialData]);

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "Give this transaction a name.";
    if (!form.amount || Number(form.amount) <= 0) next.amount = "Enter an amount greater than 0.";

    // Validate date is not in the future
    if (form.date) {
      const selected = new Date(form.date + "T23:59:59");
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (selected > today) {
        next.date = "Future dates are not allowed.";
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        name: form.name.trim(),
        amount: Number(form.amount),
        type: form.type,
        isDefault: form.isDefault,
        date: form.date,
      });
      if (!isEdit) setForm({ ...emptyForm, date: getTodayISO() });
    } finally {
      setSubmitting(false);
    }
  }

  const todayISO = getTodayISO();

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit}
      className={`glass-panel space-y-4 p-6 transition-all duration-300 ${
        isEdit ? "ring-2 ring-violet-500/50 shadow-glow-violet" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-white">
          {isEdit ? "Edit transaction" : "Add a transaction"}
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-white/50">Transaction name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Salary, Groceries, Rent"
            className="input-glass"
          />
          {errors.name && <p className="mt-1 text-xs text-expense-400">{errors.name}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-white/50">Amount</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
            placeholder="0.00"
            className="input-glass tabular"
          />
          {errors.amount && <p className="mt-1 text-xs text-expense-400">{errors.amount}</p>}
        </div>
      </div>

      {/* Transaction date field */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-white/50">Transaction date</label>
        <div className="relative">
          <CalendarDays
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
          />
          <input
            type="date"
            value={form.date}
            max={todayISO}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            className="input-glass input-date pl-10"
          />
        </div>
        {errors.date && <p className="mt-1 text-xs text-expense-400">{errors.date}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-white/50">Type</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setForm((f) => ({ ...f, type: "income" }))}
            className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
              form.type === "income"
                ? "border-income-500/50 bg-income-glow text-income-400"
                : "border-white/10 bg-white/[0.02] text-white/50 hover:bg-white/[0.05]"
            }`}
          >
            <ArrowUpCircle size={16} /> Income
          </button>
          <button
            type="button"
            onClick={() => setForm((f) => ({ ...f, type: "expense" }))}
            className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
              form.type === "expense"
                ? "border-expense-500/50 bg-expense-glow text-expense-400"
                : "border-white/10 bg-white/[0.02] text-white/50 hover:bg-white/[0.05]"
            }`}
          >
            <ArrowDownCircle size={16} /> Expense
          </button>
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-3 text-sm text-white/60">
        <input
          type="checkbox"
          checked={form.isDefault}
          onChange={(e) => setForm((f) => ({ ...f, isDefault: e.target.checked }))}
          className="h-4 w-4 rounded border-white/20 bg-white/5 accent-violet-500"
        />
        Save as a default/recurring category
      </label>

      <div className="flex gap-3 pt-1">
        <button type="submit" disabled={submitting} className="btn-primary flex-1">
          {submitting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Plus size={16} />
          )}
          {isEdit ? "Save changes" : "Add transaction"}
        </button>
        {isEdit && (
          <button type="button" onClick={onCancel} className="btn-ghost">
            Cancel
          </button>
        )}
      </div>
    </motion.form>
  );
}

