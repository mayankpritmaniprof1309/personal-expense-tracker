import { Wallet } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/[0.06] px-4 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-white/40 sm:flex-row">
        <div className="flex items-center gap-2 font-display text-white/70">
          <Wallet size={16} />
          Ledger
        </div>
        <p>Built for people who want to see where the money actually goes.</p>
        <p>&copy; {new Date().getFullYear()} Ledger. All rights reserved.</p>
      </div>
    </footer>
  );
}
