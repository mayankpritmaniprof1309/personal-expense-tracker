import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, UserPlus, Loader2, Wallet } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", contact: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  function validate() {
    if (!form.name.trim()) return "Tell us your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Enter a valid email address.";
    if (form.password.length < 6) return "Password should be at least 6 characters.";
    if (!/^\d{10}$/.test(form.contact)) return "Enter a valid 10-digit contact number.";
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setLoading(true);
    try {
      await register(form);
      toast.success("Account created — please log in.");
      navigate("/login");
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't create your account. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-88px)] items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="glass-panel glow-border w-full max-w-md p-8"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400">
            <Wallet size={20} className="text-white" />
          </span>
          <h1 className="mt-4 font-display text-2xl font-semibold text-white">Create your account</h1>
          <p className="mt-1 text-sm text-white/40">Start tracking in under a minute.</p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-expense-500/30 bg-expense-glow px-4 py-3 text-sm text-expense-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/50">Name</label>
            <input
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Mayank Sharma"
              className="input-glass"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/50">Email</label>
            <input
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="you@example.com"
              className="input-glass"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/50">Contact number</label>
            <input
              type="tel"
              autoComplete="tel"
              value={form.contact}
              onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
              placeholder="9876543210"
              className="input-glass"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/50">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="At least 6 characters"
                className="input-glass pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/40">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-violet-400 hover:text-violet-300">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
