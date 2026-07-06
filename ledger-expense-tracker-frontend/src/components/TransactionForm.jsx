import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, ArrowUpCircle, ArrowDownCircle, Loader2 } from "lucide-react";

const emptyForm = { name: "", amount: "", type: "expense", isDefault: false };

export default function TransactionForm({ onSubmit, initialData = null, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const isEdit = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        amount: initialData.amount ?? "",
        type: initialData.type || "expense",
        isDefault: Boolean(initialData.isDefault),
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialData]);

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "Give this transaction a name.";
    if (!form.amount || Number(form.amount) <= 0) next.amount = "Enter an amount greater than 0.";
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
      });
      if (!isEdit) setForm(emptyForm);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit}
      className="glass-panel space-y-4 p-6"
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
