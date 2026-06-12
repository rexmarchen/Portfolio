import { Reveal } from "../ui/Reveal";
import { VideoCard } from "../ui/VideoCard";
import { VideoItem } from "../../config/portfolio";

type ProjectsProps = {
  featured: VideoItem[];
  all: VideoItem[];
};

export function Projects({ featured, all }: ProjectsProps) {
  return (
    <>
      {/* Featured section */}
      <section
        id="work"
        className="relative py-20 md:py-32 px-5 md:px-8 border-t border-white/[0.04]"
      >
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-cyan/[0.06] rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <Reveal>
            <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.18em] text-accent-cyan mb-3">
              Selected edits
            </p>
            <h2 className="text-[clamp(2rem,5vw,4.5rem)] font-black leading-[0.92] text-white max-w-3xl">
              Scroll the reel. Videos preview automatically.
            </h2>
          </Reveal>

          <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {featured.map((item, index) => (
              <VideoCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Full library */}
      <section className="relative py-20 md:py-28 px-5 md:px-8 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.18em] text-accent-cyan mb-3">
              Portfolio library
            </p>
            <h2 className="text-[clamp(2rem,5vw,4.5rem)] font-black leading-[0.92] text-white max-w-3xl">
              The full collection of client edits.
            </h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {all.map((item, index) => (
              <VideoCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
