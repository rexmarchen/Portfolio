import { Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { VideoItem } from "../../config/portfolio";
import { useInView } from "../../hooks/useInView";

type VideoCardProps = {
  item: VideoItem;
  index: number;
};

export function VideoCard({ item, index }: VideoCardProps) {
  const cardRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [mediaFailed, setMediaFailed] = useState(false);
  const hasVideo = item.video.trim().length > 0 && !mediaFailed;
  const isVisible = useInView(cardRef, {
    threshold: 0.35,
    rootMargin: "0px 0px -10% 0px",
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hasVideo) return;

    let playTimeout: ReturnType<typeof setTimeout>;

    if (isVisible) {
      // Debounce video playing by 350ms to ensure the user has paused scrolling on it
      playTimeout = setTimeout(() => {
        video.play().catch(() => undefined);
      }, 350);
    } else {
      video.pause();
      video.currentTime = 0;
    }

    return () => {
      clearTimeout(playTimeout);
      if (video) {
        video.pause();
      }
    };
  }, [isVisible, hasVideo]);

  return (
    <article
      ref={cardRef}
      className={`
        group relative min-w-0 cursor-pointer
        opacity-0 translate-y-8 scale-[0.98]
        transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]
        ${isVisible ? "opacity-100 translate-y-0 scale-100" : ""}
      `}
      style={{ transitionDelay: `${index * 100}ms` }}
      onPointerEnter={() => {
        const video = videoRef.current;
        if (video && hasVideo) {
          video.play().catch(() => undefined);
        }
      }}
      onPointerLeave={() => {
        const video = videoRef.current;
        if (video) {
          video.pause();
          video.currentTime = 0;
        }
      }}
    >
      {/* Card frame */}
      <div
        className="
          relative overflow-hidden aspect-[4/5] rounded-2xl
          border border-white/[0.08] bg-surface-1
          transition-all duration-400 ease-[cubic-bezier(0.2,0.8,0.2,1)]
          group-hover:border-accent-cyan/40
          group-hover:shadow-[0_24px_70px_rgba(6,182,212,0.12),0_0_0_1px_rgba(6,182,212,0.06)]
          group-hover:-translate-y-2 group-hover:scale-[1.01]
        "
      >
        {/* Video or Fallback */}
        {hasVideo ? (
          <video
            ref={videoRef}
            poster={item.poster || undefined}
            src={item.video}
            muted
            loop
            playsInline
            disablePictureInPicture
            controlsList="nodownload"
            preload="metadata"
            onError={() => setMediaFailed(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 transform-gpu [will-change:transform]"
          />
        ) : (
          <div
            className="
              w-full h-full flex flex-col justify-end p-5
              bg-gradient-to-b from-surface-2 via-surface-1 to-bg
              transition-transform duration-500 group-hover:scale-105
            "
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(6,182,212,0.12),transparent_12rem)]" />
            <span className="relative text-xs font-bold uppercase tracking-widest text-text-soft">
              Video slot
            </span>
            <strong className="relative mt-1 text-lg font-bold text-white leading-tight">
              Add your edit
            </strong>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

        {/* Shimmer on hover */}
        <div
          className="
            absolute inset-0 pointer-events-none opacity-0
            bg-[linear-gradient(115deg,transparent_0%,transparent_38%,rgba(255,255,255,0.2)_48%,transparent_58%,transparent_100%)]
            translate-x-[-120%] transition-all duration-600
            group-hover:opacity-100 group-hover:translate-x-[120%]
          "
        />

        {/* Play button */}
        <div
          className="
            absolute top-4 right-4 z-10
            w-10 h-10 grid place-items-center
            rounded-full border border-white/20 bg-black/40 backdrop-blur-md
            text-white shadow-[0_0_20px_rgba(6,182,212,0.15)]
            transition-all duration-300
            group-hover:border-accent-cyan/60 group-hover:bg-accent-cyan/20
            group-hover:scale-110 group-hover:rotate-[4deg]
          "
        >
          <Play size={16} fill="currentColor" />
        </div>

        {/* Bottom info overlay */}
        <div
          className="
            absolute bottom-0 inset-x-0 p-4 z-10
            translate-y-full opacity-0 transition-all duration-400
            group-hover:translate-y-0 group-hover:opacity-100
          "
        >
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-accent-cyan">
            {item.category}
          </span>
          <h3 className="mt-1 text-sm font-bold text-white leading-tight">
            {item.title}
          </h3>
          <p className="mt-0.5 text-[0.65rem] text-text-muted font-medium">
            {item.clientType}
          </p>
        </div>
      </div>
    </article>
  );
}
