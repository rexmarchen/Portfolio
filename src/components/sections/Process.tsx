import { Reveal } from "../ui/Reveal";

const steps = [
  {
    num: "01",
    title: "Brief & References",
    desc: "Understanding your vision, target audience, and creative direction.",
  },
  {
    num: "02",
    title: "Edit Direction",
    desc: "Structure the narrative, select footage, and establish pacing.",
  },
  {
    num: "03",
    title: "Motion Polish",
    desc: "Add transitions, graphics, color grading, and sound design.",
  },
  {
    num: "04",
    title: "Client Delivery",
    desc: "Final review, revisions, and export in all required formats.",
  },
];

export function Process() {
  return (
    <section className="relative py-20 md:py-32 px-5 md:px-8 border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[0.7fr_1fr] gap-12 lg:gap-20">
          {/* Left: Header */}
          <Reveal>
            <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.18em] text-accent-cyan mb-3">
              Premium workflow
            </p>
            <h2 className="text-[clamp(2rem,5vw,4rem)] font-black leading-[0.92] text-white">
              From brief to delivery without confusion.
            </h2>
          </Reveal>

          {/* Right: Steps */}
          <div className="relative">
            {/* Top border */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-accent-cyan/30 via-white/[0.06] to-transparent" />

            {steps.map((step, i) => (
              <Reveal key={step.num} delay={i * 100}>
                <div
                  className="
                    group relative grid grid-cols-[3.5rem_1fr] gap-4 items-center
                    min-h-[5rem] py-5 border-b border-white/[0.06]
                    transition-all duration-300
                    hover:pl-3 hover:bg-white/[0.02]
                  "
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-accent-cyan/[0.06] to-transparent pointer-events-none" />

                  <span className="relative text-xs font-black text-text-soft group-hover:text-accent-cyan transition-colors duration-300">
                    {step.num}
                  </span>

                  <div className="relative">
                    <strong className="text-lg md:text-2xl font-bold text-white leading-tight">
                      {step.title}
                    </strong>
                    <p className="mt-0.5 text-sm text-text-muted">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
