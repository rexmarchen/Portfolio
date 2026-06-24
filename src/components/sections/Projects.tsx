import { useState } from "react";
import { Reveal } from "../ui/Reveal";
import { VideoCard } from "../ui/VideoCard";
import { VideoItem } from "../../config/portfolio";

type ProjectsProps = {
  featured: VideoItem[];
  all: VideoItem[];
};

export function Projects({ featured, all }: ProjectsProps) {
  const [activeFilter, setActiveFilter] = useState<"motion" | "reel">("motion");

  // Helper to determine item type with backward-compatible category fallback
  const getItemType = (item: VideoItem): "motion" | "reel" => {
    if (item.type === "motion" || item.type === "reel") return item.type;
    const cat = (item.category || "").toLowerCase();
    if (cat.includes("motion") || cat.includes("graphics")) {
      return "motion";
    }
    return "reel";
  };

  const filteredFeatured = featured.filter((item) => getItemType(item) === activeFilter);
  const filteredAll = all.filter((item) => getItemType(item) === activeFilter);

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

          {/* Filter Bar */}
          <div className="mt-10 flex justify-start">
            <div className="flex p-1 rounded-xl bg-white/[0.02] border border-white/[0.06] w-fit backdrop-blur-md">
              <button
                onClick={() => setActiveFilter("motion")}
                className={`
                  px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider
                  transition-all duration-300 cursor-pointer
                  ${
                    activeFilter === "motion"
                      ? "bg-accent-cyan/15 text-accent-cyan shadow-[0_0_12px_rgba(6,182,212,0.1)] border border-accent-cyan/20"
                      : "text-text-soft hover:text-white border border-transparent"
                  }
                `}
              >
                Motion Graphics
              </button>
              <button
                onClick={() => setActiveFilter("reel")}
                className={`
                  px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider
                  transition-all duration-300 cursor-pointer
                  ${
                    activeFilter === "reel"
                      ? "bg-accent-cyan/15 text-accent-cyan shadow-[0_0_12px_rgba(6,182,212,0.1)] border border-accent-cyan/20"
                      : "text-text-soft hover:text-white border border-transparent"
                  }
                `}
              >
                Reels
              </button>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {filteredFeatured.map((item, index) => (
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
            {filteredAll.map((item, index) => (
              <VideoCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
