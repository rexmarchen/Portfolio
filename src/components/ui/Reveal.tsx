import { ReactNode, useRef } from "react";
import { useInView } from "../../hooks/useInView";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const visible = useInView(ref, {
    threshold: 0.15,
    rootMargin: "0px 0px -8% 0px",
  });

  return (
    <div
      ref={ref}
      className={`reveal-base ${visible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
