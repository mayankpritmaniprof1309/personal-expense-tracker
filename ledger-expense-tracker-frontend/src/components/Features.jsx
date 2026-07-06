import { motion } from "framer-motion";
import { ArrowUpRight, PieChart, ShieldCheck, LineChart, Wallet2, FileDown } from "lucide-react";

const features = [
  {
    icon: Wallet2,
    title: "Track income & expenses",
    desc: "Log every transaction in seconds with smart defaults for recurring entries.",
    span: "lg:col-span-2",
  },
  {
    icon: PieChart,
    title: "Analytics dashboard",
    desc: "See income vs. expense split at a glance with live charts.",
    span: "",
  },
  {
    icon: LineChart,
    title: "Monthly reports",
    desc: "Bar, area, and line views of how your spending trends over time.",
    span: "",
  },
  {
    icon: ShieldCheck,
    title: "Secure authentication",
    desc: "JWT-based sessions keep your financial data locked to your account only.",
    span: "lg:col-span-2",
  },
  {
    icon: FileDown,
    title: "Export anywhere",
    desc: "Pull your reports as PDF or CSV whenever you need them outside the app.",
    span: "lg:col-span-3",
  },
];

export default function Features() {
  return (
    <section className="px-4 py-16" id="features">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-violet-400">
              What you get
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-white sm:text-4xl">
              A finance stack in one dashboard.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className={`glass-panel group relative overflow-hidden p-6 transition-transform duration-300 hover:-translate-y-1 ${f.span}`}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-400/20 text-violet-300">
                <f.icon size={20} />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/50">{f.desc}</p>
              <ArrowUpRight
                size={16}
                className="absolute right-6 top-6 text-white/20 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white/50"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
