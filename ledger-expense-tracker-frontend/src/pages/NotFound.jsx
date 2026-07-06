import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.04] text-white/40">
        <Compass size={26} />
      </span>
      <h1 className="mt-6 font-display text-3xl font-semibold text-white">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-white/40">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link to="/" className="btn-primary mt-6">
        Back to home
      </Link>
    </div>
  );
}
