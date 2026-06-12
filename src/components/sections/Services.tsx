import { Clapperboard, Film, Scissors, Zap } from "lucide-react";
import { Reveal } from "../ui/Reveal";

const services = [
  {
    icon: Film,
    title: "Cinematic Editing",
    text: "Story-led cuts, premium pacing, clean sound design, and client-ready exports.",
  },
  {
    icon: Zap,
    title: "Motion Graphics",
    text: "Kinetic text, product highlights, overlays, intros, transitions, and launch visuals.",
  },
  {
    icon: Scissors,
    title: "Short-Form Reels",
    text: "Fast hooks, retention edits, captions, trend polish, and scroll-stopping structure.",
  },
  {
    icon: Clapperboard,
    title: "Brand Packages",
    text: "Ad creatives, social edits, YouTube assets, thumbnails, and recurring content systems.",
  },
];

export function Services() {
  return (
    <section
      id="services"
      className="relative py-20 md:py-32 px-5 md:px-8 border-t border-white/[0.04]"
    >
      {/* Background glow */}
      <div className="absolute top-0 right-[10%] w-96 h-96 bg-accent-cyan/[0.05] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <Reveal>
          <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.18em] text-accent-cyan mb-3">
            What clients book
          </p>
          <h2 className="text-[clamp(2rem,5vw,4.5rem)] font-black leading-[0.92] text-white max-w-3xl">
            Editing systems for creators, brands, and launches.
          </h2>
        </Reveal>

        <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <Reveal key={service.title} delay={i * 80}>
                <div
                  className="
                    group relative overflow-hidden rounded-2xl p-6 md:p-7
                    min-h-[16rem] flex flex-col justify-between
                    border border-white/[0.06] bg-white/[0.02]
                    transition-all duration-400 ease-[cubic-bezier(0.2,0.8,0.2,1)]
                    hover:border-white/[0.14] hover:bg-white/[0.05]
                    hover:-translate-y-2 hover:shadow-[0_24px_70px_rgba(6,182,212,0.08)]
                  "
                >
                  {/* Hover gradient overlay */}
                  <div
                    className="
                      absolute inset-0 opacity-0 transition-opacity duration-400
                      bg-[radial-gradient(circle_at_20%_20%,rgba(6,182,212,0.12),transparent_60%)]
                      group-hover:opacity-100
                    "
                  />

                  {/* Icon */}
                  <div className="relative">
                    <Icon
                      size={24}
                      className="text-accent-cyan drop-shadow-[0_0_12px_rgba(6,182,212,0.3)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-[-5deg] group-hover:scale-110"
                    />
                  </div>

                  {/* Content */}
                  <div className="relative mt-auto">
                    <h3 className="text-lg md:text-xl font-bold text-white leading-tight mb-2">
                      {service.title}
                    </h3>
                    <p className="text-sm text-text-muted leading-relaxed">
                      {service.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
