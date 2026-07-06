import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileBarChart,
  Wallet,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const links = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/reports", label: "Reports", icon: FileBarChart },
];

function NavItem({ to, label, icon: Icon, end, onClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
          isActive
            ? "bg-gradient-to-r from-violet-500/20 to-cyan-400/10 text-white"
            : "text-white/50 hover:bg-white/[0.04] hover:text-white"
        }`
      }
    >
      <Icon size={18} />
      {label}
    </NavLink>
  );
}

export default function DashboardShell({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="min-h-screen">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/[0.06] bg-void-900/60 backdrop-blur-xl lg:flex">
        <div className="flex items-center gap-2 px-6 py-6 font-display text-lg font-semibold text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400">
            <Wallet size={18} strokeWidth={2.5} />
          </span>
          Ledger
        </div>
        <nav className="flex-1 space-y-1 px-4">
          {links.map((l) => (
            <NavItem key={l.to} {...l} />
          ))}
        </nav>
        <div className="border-t border-white/[0.06] p-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/[0.03] px-3 py-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-sm font-semibold text-white">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">{user?.name || "User"}</p>
              <p className="truncate text-xs text-white/40">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-ghost w-full justify-center !py-2.5 text-xs">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile topbar */}
      <div className="glass sticky top-0 z-40 flex items-center justify-between px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2 font-display font-semibold text-white">
          <Wallet size={18} /> Ledger
        </div>
        <button onClick={() => setDrawerOpen(true)} aria-label="Open menu" className="text-white">
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60" onClick={() => setDrawerOpen(false)} />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="glass-strong absolute inset-y-0 left-0 flex w-72 flex-col p-4"
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="font-display text-lg font-semibold text-white">Ledger</span>
                <button onClick={() => setDrawerOpen(false)} className="text-white/60">
                  <X size={20} />
                </button>
              </div>
              <nav className="flex-1 space-y-1">
                {links.map((l) => (
                  <NavItem key={l.to} {...l} onClick={() => setDrawerOpen(false)} />
                ))}
              </nav>
              <button onClick={handleLogout} className="btn-ghost w-full justify-center !py-2.5 text-xs">
                <LogOut size={14} /> Logout
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="px-4 pb-24 pt-6 lg:ml-64 lg:px-8 lg:pb-10 lg:pt-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="glass fixed inset-x-4 bottom-4 z-40 flex items-center justify-around rounded-2xl p-2 lg:hidden">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-[11px] font-medium transition-colors ${
                isActive ? "text-white" : "text-white/40"
              }`
            }
          >
            <l.icon size={18} />
            {l.label}
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          className="flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-[11px] font-medium text-white/40"
        >
          <LogOut size={18} />
          Logout
        </button>
      </nav>
    </div>
  );
}
