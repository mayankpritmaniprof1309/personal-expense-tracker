import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency } from "../utils/format";

const sparkline = [12, 18, 14, 24, 20, 32, 28, 40, 36, 48];

function Sparkline() {
  const max = Math.max(...sparkline);
  const points = sparkline
    .map((v, i) => `${(i / (sparkline.length - 1)) * 100},${28 - (v / max) * 28}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 28" className="h-10 w-full" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke="url(#sparkGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="sparkGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:pt-24">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-income-400" />
            Every rupee, accounted for
          </span>

          <h1 className="mt-6 font-display text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            Know exactly where
            <br />
            your money <span className="gradient-text">goes.</span>
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-white/50">
            Ledger turns scattered income and expenses into a single clear
            picture — logged in seconds, visualized instantly, and always
            within reach.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link to="/signup" className="btn-primary">
              Get Started <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="btn-ghost">
              Login
            </Link>
          </div>

          <div className="mt-10 flex items-center gap-8 text-white/40">
            <div>
              <p className="font-display text-2xl font-semibold text-white">2 min</p>
              <p className="text-xs">to log a transaction</p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <p className="font-display text-2xl font-semibold text-white">100%</p>
              <p className="text-xs">private to your account</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="glass-panel glow-border relative mx-auto max-w-md p-6 shadow-glow-violet">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-white/40">Current balance</p>
              <span className="rounded-full bg-income-glow px-2 py-1 text-[10px] font-medium text-income-400">
                +18.4% this month
              </span>
            </div>
            <p className="tabular mt-3 text-4xl font-semibold text-white">
              {formatCurrency(84250)}
            </p>
            <div className="mt-4">
              <Sparkline />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <div className="flex items-center gap-2 text-income-400">
                  <TrendingUp size={14} />
                  <span className="text-xs font-medium text-white/50">Income</span>
                </div>
                <p className="tabular mt-2 text-lg font-semibold text-white">
                  {formatCurrency(50000)}
                </p>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <div className="flex items-center gap-2 text-expense-400">
                  <TrendingDown size={14} />
                  <span className="text-xs font-medium text-white/50">Expense</span>
                </div>
                <p className="tabular mt-2 text-lg font-semibold text-white">
                  {formatCurrency(20000)}
                </p>
              </div>
            </div>
          </div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="glass absolute -left-6 top-8 hidden rounded-xl px-4 py-3 sm:block"
          >
            <p className="text-[10px] text-white/40">Salary credited</p>
            <p className="tabular text-sm font-semibold text-income-400">+{formatCurrency(50000)}</p>
          </motion.div>

          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="glass absolute -bottom-6 -right-4 hidden rounded-xl px-4 py-3 sm:block"
          >
            <p className="text-[10px] text-white/40">Groceries</p>
            <p className="tabular text-sm font-semibold text-expense-400">-{formatCurrency(1850)}</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
