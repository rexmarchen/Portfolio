import { Reveal } from "../ui/Reveal";
import { SkillBar } from "../ui/SkillBar";
import { GlassCard } from "../ui/GlassCard";
import { PortfolioConfig } from "../../config/portfolio";

type AboutProps = {
  config: PortfolioConfig;
};

const skills = [
  { label: "Video Editing", percentage: 95 },
  { label: "Motion Graphics", percentage: 90 },
  { label: "Color Grading", percentage: 85 },
  { label: "Sound Design", percentage: 80 },
  { label: "After Effects", percentage: 92 },
  { label: "Premiere Pro", percentage: 95 },
];

const timeline = [
  {
    year: "2024",
    title: "Premium Client Work",
    desc: "Working with top brands and agencies on high-impact video campaigns.",
  },
  {
    year: "2023",
    title: "Motion Graphics Focus",
    desc: "Expanded into kinetic typography, product visuals, and launch animations.",
  },
  {
    year: "2022",
    title: "Content Creator Era",
    desc: "Built editing systems for YouTube creators and Instagram influencers.",
  },
  {
    year: "2021",
    title: "Started the Journey",
    desc: "First edits, learning the craft, building a passion for cinematic storytelling.",
  },
];

const stats = [
  { value: "100+", label: "Projects Delivered" },
  { value: "50+", label: "Happy Clients" },
  { value: "3+", label: "Years Experience" },
];

export function About({ config }: AboutProps) {
  return (
    <section
      id="about"
      className="relative py-20 md:py-32 px-5 md:px-8 border-t border-white/[0.04]"
    >
      {/* Background glows */}
      <div className="absolute top-20 left-0 w-80 h-80 bg-accent-violet/[0.06] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 right-0 w-64 h-64 bg-accent-cyan/[0.05] rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <Reveal>
          <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.18em] text-accent-cyan mb-3">
            About the studio
          </p>
          <h2 className="text-[clamp(2rem,5vw,4.5rem)] font-black leading-[0.92] text-white max-w-3xl">
            Crafting visuals that feel expensive.
          </h2>
        </Reveal>

        {/* Bio + Skills */}
        <div className="mt-14 md:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Left: Bio */}
          <Reveal delay={100}>
            <div className="space-y-5">
              <p className="text-text-muted text-base md:text-lg leading-relaxed">
                {config.brand} is a premium video editing studio specializing in
                cinematic edits, motion graphics, and brand visuals. Every frame
                is crafted with purpose — delivering content that stops the
                scroll, tells the story, and elevates the brand.
              </p>
              <p className="text-text-muted text-base md:text-lg leading-relaxed">
                From raw footage to polished deliverables, the studio combines
                technical precision with creative vision to produce work that
                feels effortless yet impactful.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                {stats.map((stat) => (
                  <GlassCard
                    key={stat.label}
                    className="text-center !p-4"
                    hover={false}
                  >
                    <div className="text-2xl md:text-3xl font-black gradient-text">
                      {stat.value}
                    </div>
                    <p className="mt-1 text-[0.65rem] font-bold uppercase tracking-wider text-text-soft">
                      {stat.label}
                    </p>
                  </GlassCard>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Right: Skills */}
          <Reveal delay={200}>
            <GlassCard className="space-y-5">
              <h3 className="text-lg font-bold text-white mb-2">
                Technical Arsenal
              </h3>
              {skills.map((skill, i) => (
                <SkillBar
                  key={skill.label}
                  label={skill.label}
                  percentage={skill.percentage}
                  delay={i * 100}
                />
              ))}
            </GlassCard>
          </Reveal>
        </div>

        {/* Timeline */}
        <div className="mt-20 md:mt-28">
          <Reveal>
            <h3 className="text-[0.72rem] font-extrabold uppercase tracking-[0.18em] text-accent-cyan mb-8">
              The journey so far
            </h3>
          </Reveal>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 md:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-accent-cyan/30 via-accent-violet/20 to-transparent" />

            <div className="space-y-8">
              {timeline.map((item, i) => (
                <Reveal key={item.year} delay={i * 100}>
                  <div className="relative flex gap-6 md:gap-8 pl-4 md:pl-6">
                    {/* Dot */}
                    <div className="relative z-10 mt-1.5">
                      <div className="w-3 h-3 rounded-full bg-accent-cyan shadow-[0_0_12px_rgba(6,182,212,0.5)]" />
                    </div>

                    {/* Content */}
                    <div className="pb-2">
                      <span className="text-xs font-bold text-accent-cyan/80 tracking-wider">
                        {item.year}
                      </span>
                      <h4 className="mt-1 text-lg md:text-xl font-bold text-white">
                        {item.title}
                      </h4>
                      <p className="mt-1 text-sm text-text-muted leading-relaxed max-w-lg">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
