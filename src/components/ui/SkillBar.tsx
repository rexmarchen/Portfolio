import { useEffect, useRef, useState } from "react";
import { useInView } from "../../hooks/useInView";

type SkillBarProps = {
  label: string;
  percentage: number;
  delay?: number;
};

export function SkillBar({ label, percentage, delay = 0 }: SkillBarProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const visible = useInView(ref, { threshold: 0.3 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!visible) return;

    const duration = 1200;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * percentage));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const timer = setTimeout(() => {
      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timer);
  }, [visible, percentage, delay]);

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-text-primary">{label}</span>
        <span className="text-sm font-bold text-accent-cyan tabular-nums">
          {count}%
        </span>
      </div>
      <div className="h-2.5 rounded-full bg-white/[0.06] border border-white/[0.06] overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent-cyan via-accent-violet to-accent-blue transition-all duration-1000 ease-out"
          style={{
            width: visible ? `${percentage}%` : "0%",
            transitionDelay: `${delay}ms`,
            boxShadow: "0 0 16px rgba(6, 182, 212, 0.4)",
          }}
        />
      </div>
    </div>
  );
}
