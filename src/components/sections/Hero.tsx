import { ArrowUpRight, ChevronDown, Play } from "lucide-react";
import { ParticleField } from "../ui/ParticleField";
import { PortfolioConfig } from "../../config/portfolio";

type HeroProps = {
  config: PortfolioConfig;
};

export function Hero({ config }: HeroProps) {
  return (
    <section
      id="top"
      className="relative min-h-screen flex items-end overflow-hidden isolate"
    >
      {/* Particle background */}
      <div
        className="absolute inset-0 z-0 will-change-transform"
        style={{ transform: `scale(var(--hero-scale, 1))`, transformOrigin: "center" }}
      >
        <ParticleField />
      </div>

      {/* Editing Timeline Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-45 pointer-events-none filter grayscale contrast-110 brightness-100"
        style={{ backgroundImage: `url('/images/hero-bg.png')` }}
      />

      {/* Gradient overlays — parallax */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none will-change-transform"
        style={{
          background: `
            radial-gradient(circle at 72% 24%, rgba(6, 182, 212, 0.18), transparent 22rem),
            radial-gradient(circle at 24% 72%, rgba(139, 92, 246, 0.12), transparent 26rem)
          `,
          transform: `translate3d(0, var(--hero-y, 0px), 0)`,
          opacity: `var(--hero-fade, 1)`,
        }}
      />
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background: `
            linear-gradient(90deg, rgba(0,0,0,0.95), rgba(0,0,0,0.6) 48%, rgba(0,0,0,0.2)),
            linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.95))
          `,
        }}
      />

      {/* Hero sweep animation */}
      <div
        className="absolute inset-0 z-[3] pointer-events-none opacity-30 mix-blend-screen"
        style={{
          background:
            "linear-gradient(115deg, transparent 0%, transparent 38%, rgba(6,182,212,0.15) 48%, transparent 58%, transparent 100%)",
          animation: "hero-sweep 7s cubic-bezier(0.2,0.8,0.2,1) infinite",
        }}
      />

      {/* Content — slight upward parallax for depth */}
      <div
        className="relative z-10 w-full max-w-6xl mx-auto px-5 md:px-8 pb-16 md:pb-20 pt-32 md:pt-40 will-change-transform"
        style={{ transform: `translate3d(0, var(--hero-y, 0px), 0)` }}
      >
        <div className="animate-fade-up">
          {/* Eyebrow */}
          <p className="text-[0.72rem] md:text-xs font-extrabold uppercase tracking-[0.18em] text-accent-cyan mb-4">
            {config.studioTag}
          </p>

          {/* Brand name */}
          <h1
            className="text-[clamp(2.5rem,6.2vw,5.5rem)] font-black leading-[0.82] tracking-tight text-white mb-0 animate-title-glow font-display whitespace-nowrap"
          >
            {config.brand}
          </h1>

          {/* Headline */}
          <p className="max-w-3xl mt-5 text-[clamp(1.4rem,3.5vw,3.5rem)] font-extrabold leading-[0.95] text-white/90 font-title">
            {config.headline}
          </p>

          {/* Sub-headline */}
          <p className="max-w-xl mt-4 text-[clamp(0.95rem,1.8vw,1.15rem)] text-text-muted leading-relaxed">
            {config.subheadline}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 mt-8">
            <a
              href="#work"
              className="
                group/btn relative inline-flex items-center gap-2.5 px-7 py-3.5
                rounded-full font-extrabold text-sm uppercase tracking-wider
                text-bg bg-gradient-to-r from-white via-accent-cyan/20 to-accent-cyan
                shadow-[0_14px_40px_rgba(6,182,212,0.25),inset_0_1px_0_rgba(255,255,255,0.6)]
                overflow-hidden transition-all duration-300
                hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(6,182,212,0.35)]
              "
            >
              <span className="relative z-10 flex items-center gap-2">
                <Play size={16} fill="currentColor" />
                Watch edits
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
            </a>

            <a
              href={config.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="
                group/btn relative inline-flex items-center gap-2 px-7 py-3.5
                rounded-full font-extrabold text-sm uppercase tracking-wider
                text-white border border-white/[0.15] bg-white/[0.04]
                overflow-hidden transition-all duration-300
                hover:-translate-y-1 hover:border-accent-cyan/40
                hover:bg-accent-cyan/10 hover:shadow-[0_14px_40px_rgba(6,182,212,0.15)]
              "
            >
              <span className="relative z-10 flex items-center gap-2">
                Book a project
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
            </a>
          </div>
        </div>

        {/* Status badges */}
        <div
          className="
            mt-12 md:mt-0 md:absolute md:right-8 md:bottom-20
            flex flex-col items-start md:items-end gap-1.5
            animate-fade-up
          "
          style={{ animationDelay: "300ms" }}
        >
          <span className="text-xs font-extrabold uppercase tracking-wider text-white/80">
            {config.availability}
          </span>
          <span className="text-xs font-extrabold uppercase tracking-wider text-text-muted">
            {config.location}
          </span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 animate-bounce-slow">
        <ChevronDown size={20} className="text-text-soft/40" />
      </div>
    </section>
  );
}
