import { Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";
import { verifyPassword } from "../../utils/auth";
import {
  getPasswordHash,
  setAuthenticated,
} from "../../storage/authStorage";

type AdminLoginProps = {
  onSuccess: () => void;
};

export function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const hash = getPasswordHash();
    const valid = await verifyPassword(password, hash);

    if (valid) {
      setAuthenticated(true);
      onSuccess();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 bg-bg relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-accent-cyan/[0.06] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-accent-violet/[0.05] rounded-full blur-[120px] pointer-events-none" />

      <div
        className={`
          relative w-full max-w-md p-8 md:p-10 rounded-3xl
          border border-white/[0.08] bg-white/[0.03] backdrop-blur-2xl
          shadow-[0_0_100px_rgba(6,182,212,0.04)]
          animate-scale-in
          ${shake ? "animate-[shake_0.5s_ease-in-out]" : ""}
        `}
        style={shake ? { animation: "shake 0.5s ease-in-out" } : undefined}
      >
        {/* Icon */}
        <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center">
          <Lock size={22} className="text-accent-cyan" />
        </div>

        <h1 className="text-center text-2xl font-bold text-white mb-1">
          Admin Access
        </h1>
        <p className="text-center text-sm text-text-muted mb-8">
          Enter your password to manage the portfolio
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Enter password"
              autoFocus
              className={`
                w-full px-4 py-3.5 pr-12 rounded-xl
                bg-white/[0.04] text-white text-sm font-medium
                placeholder:text-text-soft/60
                outline-none transition-all duration-300
                ${
                  error
                    ? "border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.1)]"
                    : "border-white/[0.08] focus:border-accent-cyan/40 focus:shadow-[0_0_20px_rgba(6,182,212,0.1)]"
                }
                border
              `}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-soft hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <p className="text-xs font-medium text-red-400 text-center animate-fade-in">
              Incorrect password. Please try again.
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="
              group/btn relative w-full flex items-center justify-center gap-2.5
              px-6 py-3.5 rounded-xl
              font-bold text-sm uppercase tracking-wider
              text-bg bg-gradient-to-r from-white via-accent-cyan/20 to-accent-cyan
              shadow-[0_10px_30px_rgba(6,182,212,0.2)]
              overflow-hidden transition-all duration-300
              hover:shadow-[0_16px_40px_rgba(6,182,212,0.3)]
              hover:-translate-y-0.5
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
            "
          >
            <span className="relative z-10 flex items-center gap-2">
              <ShieldCheck size={16} />
              {loading ? "Verifying..." : "Sign In"}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
          </button>
        </form>

        <p className="mt-6 text-center text-[0.65rem] text-text-soft/60">
          Default password: rexeditzz2024
        </p>
      </div>

      {/* Inline shake keyframe */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 50%, 90% { transform: translateX(-6px); }
          30%, 70% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}
