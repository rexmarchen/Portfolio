import { Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { VideoItem } from "../config/portfolio";
import { useInView } from "../hooks/useInView";

type VideoCardProps = {
  item: VideoItem;
  index: number;
  showMeta?: boolean;
};

export function VideoCard({ item, index, showMeta = false }: VideoCardProps) {
  const cardRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [mediaFailed, setMediaFailed] = useState(false);
  const hasVideo = item.video.trim().length > 0 && !mediaFailed;
  const isVisible = useInView(cardRef, {
    threshold: 0.38,
    rootMargin: "0px 0px -12% 0px",
  });

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !hasVideo) {
      return;
    }

    if (isVisible) {
      video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }, [isVisible, hasVideo]);

  const playPreview = () => {
    videoRef.current?.play().catch(() => undefined);
  };

  return (
    <article
      className={`video-card ${isVisible ? "is-visible" : ""}`}
      ref={cardRef}
      style={{ transitionDelay: `${index * 90}ms` }}
      onPointerEnter={playPreview}
      onFocus={playPreview}
    >
      <div className="video-frame">
        {hasVideo && (
          <video
            ref={videoRef}
            poster={item.poster || undefined}
            src={item.video}
            muted
            loop
            playsInline
            preload={item.featured ? "metadata" : "none"}
            onError={() => setMediaFailed(true)}
          />
        )}

        {!hasVideo && (
          <div className="video-fallback">
            <span>Video slot</span>
            <strong>Add your edit</strong>
          </div>
        )}

        <div className="video-shade" />
        <div className="play-mark" aria-hidden="true">
          <Play size={18} fill="currentColor" />
        </div>
      </div>

      {showMeta && (
        <div className="video-meta">
          <div>
            <span>{item.category}</span>
            <h3>{item.title}</h3>
          </div>
          <p>{item.clientType}</p>
        </div>
      )}
    </article>
  );
}
