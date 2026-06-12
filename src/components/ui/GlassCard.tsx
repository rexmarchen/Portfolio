import { ReactNode } from "react";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: boolean;
};

export function GlassCard({
  children,
  className = "",
  hover = true,
  padding = true,
}: GlassCardProps) {
  return (
    <div
      className={`
        rounded-2xl border border-white/[0.08] bg-white/[0.03]
        backdrop-blur-xl transition-all duration-300
        ${hover ? "hover:border-white/[0.16] hover:bg-white/[0.06] hover:shadow-[0_20px_60px_rgba(6,182,212,0.08)]" : ""}
        ${padding ? "p-6 md:p-8" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
