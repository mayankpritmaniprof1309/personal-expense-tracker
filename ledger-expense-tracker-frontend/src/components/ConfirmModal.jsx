import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export default function ConfirmModal({
  open,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmLabel = "Delete",
  loading = false,
  onConfirm,
  onCancel,
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong w-full max-w-sm rounded-2xl p-6"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-expense-glow text-expense-400">
              <AlertTriangle size={20} />
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm text-white/50">{description}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={onCancel} className="btn-ghost !px-4 !py-2 text-xs">
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-expense-500 px-4 py-2 text-xs font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
              >
                {loading ? "Deleting…" : confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
