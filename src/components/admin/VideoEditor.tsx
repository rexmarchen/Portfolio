import { Plus, Trash2, Upload, Loader2, Search, ArrowUp, ArrowDown, Sparkles, Film, Image, MoreVertical } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { PortfolioConfig, VideoItem } from "../../config/portfolio";

type VideoEditorProps = {
  videos: VideoItem[];
  onChange: (videos: VideoItem[]) => void;
};

function makeVideo(): VideoItem {
  return {
    id: `edit-${Date.now()}`,
    title: "New Client Edit",
    category: "Video Edit",
    clientType: "Client",
    video: "",
    poster: "",
    featured: true,
  };
}

export function VideoEditor({ videos, onChange }: VideoEditorProps) {
  // Helper to determine item type with backward-compatible category fallback
  const getItemType = (item: VideoItem): "motion" | "reel" => {
    if (item.type === "motion" || item.type === "reel") return item.type;
    const cat = (item.category || "").toLowerCase();
    if (cat.includes("motion") || cat.includes("graphics")) {
      return "motion";
    }
    return "reel";
  };

  const [activeType, setActiveType] = useState<"motion" | "reel">("motion");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState<number | null>(() => {
    const firstMotion = videos.findIndex((v) => getItemType(v) === "motion");
    if (firstMotion !== -1) return firstMotion;
    const firstReel = videos.findIndex((v) => getItemType(v) === "reel");
    if (firstReel !== -1) return firstReel;
    return videos.length > 0 ? 0 : null;
  });
  const [uploadingField, setUploadingField] = useState<{
    index: number;
    field: "video" | "poster";
  } | null>(null);
  const [deleteConfirmIndex, setDeleteConfirmIndex] = useState<number | null>(null);
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);

  const updateVideo = (
    index: number,
    key: keyof VideoItem,
    value: string | boolean,
  ) => {
    const next = videos.map((v, i) =>
      i === index ? { ...v, [key]: value } : v,
    );
    onChange(next);
  };

  const addVideo = () => {
    setSearchQuery(""); // Clear search so the new card is visible
    const newVid = {
      ...makeVideo(),
      type: activeType,
      category: activeType === "motion" ? "Motion Graphics" : "Video Edit"
    };
    const nextVideos = [...videos, newVid];
    onChange(nextVideos);
    setActiveIndex(nextVideos.length - 1);
  };

  const removeVideo = (index: number) => {
    const next = videos.filter((_, i) => i !== index);
    onChange(next);
    setDeleteConfirmIndex(null);
    
    if (next.length === 0) {
      setActiveIndex(null);
    } else if (activeIndex === index) {
      setActiveIndex(Math.max(0, index - 1));
    } else if (activeIndex !== null && activeIndex > index) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const moveVideo = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === videos.length - 1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const next = [...videos];
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;

    onChange(next);
    if (activeIndex === index) {
      setActiveIndex(targetIndex);
    } else if (activeIndex === targetIndex) {
      setActiveIndex(index);
    }
  };

  const handleFileUpload = async (
    index: number,
    field: "video" | "poster",
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField({ index, field });

    try {
      const response = await fetch(`/api/upload`, {
        method: "POST",
        headers: {
          "x-filename": file.name,
          "x-folder": field === "video" ? "videos" : "posters",
        },
        body: file,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      if (data.success) {
        updateVideo(index, field, data.url);
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to upload file.");
    } finally {
      setUploadingField(null);
    }
  };

  // Filtered videos mapped with their original indices
  const filteredVideos = videos
    .map((video, originalIndex) => ({ video, originalIndex }))
    .filter(({ video }) => {
      if (getItemType(video) !== activeType) return false;
      const q = searchQuery.toLowerCase();
      return (
        video.title.toLowerCase().includes(q) ||
        video.category.toLowerCase().includes(q) ||
        video.clientType.toLowerCase().includes(q)
      );
    });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative">
      {/* Click-outside backdrop for open dropdown */}
      {openMenuIndex !== null && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setOpenMenuIndex(null)}
        />
      )}
      {/* Left panel: Video list & search */}
      <div className="lg:col-span-5 space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
            <input
              type="text"
              placeholder="Search edits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
                w-full pl-9 pr-3 py-2.5 rounded-xl text-xs
                bg-white/[0.03] border border-white/[0.06] text-white
                placeholder:text-text-soft/40 outline-none
                focus:border-accent-cyan/40 focus:bg-white/[0.05]
                transition-all duration-300
              "
            />
          </div>
          <button
            type="button"
            onClick={addVideo}
            className="
              inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider
              border border-accent-cyan/20 bg-accent-cyan/10 text-accent-cyan
              hover:bg-accent-cyan/20 hover:border-accent-cyan/30
              transition-all duration-300 shrink-0 cursor-pointer
            "
          >
            <Plus size={14} /> Add
          </button>
        </div>
        {/* Type tabs: Motion Graphics vs Reels */}
        <div className="flex p-0.5 rounded-xl bg-white/[0.02] border border-white/[0.06] w-full">
          <button
            type="button"
            onClick={() => {
              setActiveType("motion");
              const motionVids = videos
                .map((video, originalIndex) => ({ video, originalIndex }))
                .filter(({ video }) => getItemType(video) === "motion");
              setActiveIndex(motionVids.length > 0 ? motionVids[0].originalIndex : null);
            }}
            className={`
              flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer
              ${
                activeType === "motion"
                  ? "bg-accent-cyan/15 text-accent-cyan shadow-[0_0_12px_rgba(6,182,212,0.05)] border border-accent-cyan/15"
                  : "text-text-soft hover:text-white border border-transparent"
              }
            `}
          >
            Motion Graphics
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveType("reel");
              const reelVids = videos
                .map((video, originalIndex) => ({ video, originalIndex }))
                .filter(({ video }) => getItemType(video) === "reel");
              setActiveIndex(reelVids.length > 0 ? reelVids[0].originalIndex : null);
            }}
            className={`
              flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer
              ${
                activeType === "reel"
                  ? "bg-accent-cyan/15 text-accent-cyan shadow-[0_0_12px_rgba(6,182,212,0.05)] border border-accent-cyan/15"
                  : "text-text-soft hover:text-white border border-transparent"
              }
            `}
          >
            Reels
          </button>
        </div>

        {/* Scrollable list of video cards */}
        <div className="space-y-2.5 max-h-[60vh] lg:max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
          {filteredVideos.length === 0 ? (
            <div className="text-center py-10 rounded-xl border border-dashed border-white/[0.06] bg-white/[0.01]">
              <Film size={20} className="mx-auto text-text-soft/30 mb-2" />
              <p className="text-xs text-text-soft">No edits found.</p>
            </div>
          ) : (
            filteredVideos.map(({ video, originalIndex }) => {
              const isActive = activeIndex === originalIndex;
              const hasVideo = !!video.video.trim();

              return (
                <div
                  key={video.id}
                  onClick={() => {
                    setActiveIndex(originalIndex);
                    setDeleteConfirmIndex(null);
                  }}
                  className={`
                    group relative rounded-xl border p-3.5 flex gap-3.5 items-center cursor-pointer
                    transition-all duration-300
                    ${
                      isActive
                        ? "border-accent-cyan bg-white/[0.08] shadow-[0_0_15px_rgba(6,182,212,0.05)]"
                        : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]"
                    }
                  `}
                >
                  {/* Thumbnail Preview */}
                  <div className="w-12 h-16 rounded-lg bg-white/[0.04] border border-white/[0.08] overflow-hidden flex items-center justify-center shrink-0 relative">
                    {video.poster ? (
                      <img src={video.poster} alt="" className="w-full h-full object-cover animate-fade-in" />
                    ) : (
                      <Film size={16} className={isActive ? "text-accent-cyan" : "text-text-soft"} />
                    )}
                  </div>

                  {/* Title & Info */}
                  <div className="flex-1 min-w-0 pr-10">
                    <h4 className="text-xs font-bold text-white truncate group-hover:text-accent-cyan transition-colors">
                      {video.title || "Untitled Edit"}
                    </h4>
                    <p className="text-[10px] text-text-soft truncate mt-0.5">
                      {video.category || "No Category"} • {video.clientType || "No Client"}
                    </p>

                    {/* Badges row */}
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      {video.featured && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20">
                          <Sparkles size={8} /> Featured
                        </span>
                      )}
                      {hasVideo ? (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Ready
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Draft
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Option Menu (Three-dots) */}
                  <div className="relative shrink-0 z-20">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveIndex(originalIndex);
                        setOpenMenuIndex(openMenuIndex === originalIndex ? null : originalIndex);
                      }}
                      className="p-1.5 rounded-lg hover:bg-white/[0.08] text-text-soft hover:text-white transition-colors cursor-pointer"
                      title="More actions"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {openMenuIndex === originalIndex && (
                      <div className="absolute right-0 mt-1 w-36 rounded-xl border border-white/[0.08] bg-[#121214] p-1.5 shadow-2xl z-30">
                        {/* Move Up */}
                        <button
                          type="button"
                          disabled={originalIndex === 0}
                          onClick={(e) => {
                            e.stopPropagation();
                            moveVideo(originalIndex, "up");
                            setOpenMenuIndex(null);
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-left hover:bg-white/[0.06] text-white disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                        >
                          <ArrowUp size={13} /> Move Up
                        </button>

                        {/* Move Down */}
                        <button
                          type="button"
                          disabled={originalIndex === videos.length - 1}
                          onClick={(e) => {
                            e.stopPropagation();
                            moveVideo(originalIndex, "down");
                            setOpenMenuIndex(null);
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-left hover:bg-white/[0.06] text-white disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                        >
                          <ArrowDown size={13} /> Move Down
                        </button>

                        {/* Toggle Featured */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateVideo(originalIndex, "featured", !video.featured);
                            setOpenMenuIndex(null);
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-left hover:bg-white/[0.06] text-white transition-colors cursor-pointer"
                        >
                          <Sparkles size={13} className={video.featured ? "text-accent-cyan" : "text-text-soft"} /> 
                          {video.featured ? "Unfeature" : "Feature"}
                        </button>

                        <div className="h-px bg-white/[0.06] my-1" />

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeVideo(originalIndex);
                            setOpenMenuIndex(null);
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-left text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right panel: Detail Editor */}
      <div className="lg:col-span-7">
        {activeIndex !== null && videos[activeIndex] ? (
          (() => {
            const activeVideo = videos[activeIndex];
            const isFeatured = activeVideo.featured;
            const hasVideo = !!activeVideo.video.trim();
            const hasPoster = !!activeVideo.poster.trim();

            return (
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 md:p-6 space-y-6">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                  <div className="min-w-0 flex-1 pr-4">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-text-soft">
                      Editing Video #{activeIndex + 1}
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5 truncate">
                      {activeVideo.title || "Untitled Edit"}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => updateVideo(activeIndex, "featured", !activeVideo.featured)}
                      className={`
                        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider
                        transition-all duration-300 border cursor-pointer
                        ${
                          isFeatured
                            ? "bg-accent-cyan/10 border-accent-cyan/30 text-accent-cyan shadow-[0_0_12px_rgba(6,182,212,0.1)]"
                            : "bg-white/[0.02] border-white/[0.08] text-text-soft hover:text-white hover:bg-white/[0.04]"
                        }
                      `}
                    >
                      <Sparkles size={12} /> {isFeatured ? "Featured" : "Feature"}
                    </button>

                    {deleteConfirmIndex === activeIndex ? (
                      <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 p-1 rounded-lg">
                        <button
                          type="button"
                          onClick={() => removeVideo(activeIndex)}
                          className="px-2 py-1 rounded bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer hover:bg-red-600"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmIndex(null)}
                          className="px-2 py-1 rounded bg-white/[0.04] text-text-soft hover:text-white text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmIndex(activeIndex)}
                        className="
                          p-2 rounded-lg border border-white/[0.08] bg-white/[0.02]
                          text-text-soft hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20
                          transition-all duration-200 cursor-pointer
                        "
                        title="Delete video"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Form fields */}
                <div className="space-y-5">
                  {/* Basic details */}
                  <div className="space-y-3.5">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider border-l-2 border-accent-cyan pl-2">
                      Basic Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      {(
                        [
                          { key: "title", label: "Title", placeholder: "e.g., Cinematic Brand Film" },
                          { key: "category", label: "Category", placeholder: "e.g., Commercial" },
                          { key: "clientType", label: "Client type", placeholder: "e.g., Brands" },
                        ] as const
                      ).map((field) => (
                        <label key={field.key} className="block">
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-text-soft mb-1.5">
                            {field.label}
                          </span>
                          <input
                            value={activeVideo[field.key]}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              updateVideo(activeIndex, field.key, e.target.value)
                            }
                            placeholder={field.placeholder}
                            className="
                              w-full px-3 py-2.5 rounded-lg text-xs
                              bg-white/[0.04] border border-white/[0.08]
                              text-white font-medium placeholder:text-text-soft/30
                              outline-none transition-all duration-300
                              focus:border-accent-cyan/40 focus:bg-white/[0.06]
                            "
                          />
                        </label>
                      ))}
                      <label className="block">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-text-soft mb-1.5">
                          Type
                        </span>
                        <select
                          value={activeVideo.type || "reel"}
                          onChange={(e) => {
                            updateVideo(activeIndex, "type", e.target.value as "motion" | "reel");
                          }}
                          className="
                            w-full px-3 py-2.5 rounded-lg text-xs
                            bg-[#1b1b1f] border border-white/[0.08]
                            text-white font-medium
                            outline-none transition-all duration-300
                            focus:border-accent-cyan/40 focus:bg-white/[0.06]
                          "
                        >
                          <option value="motion">Motion Graphics</option>
                          <option value="reel">Reels</option>
                        </select>
                      </label>
                    </div>
                  </div>

                  {/* Asset paths & uploads */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider border-l-2 border-accent-cyan pl-2">
                      Asset Settings & Media
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Video configuration */}
                      <div className="space-y-2">
                        <label className="block">
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-text-soft mb-1.5">
                            Video path or URL
                          </span>
                          <div className="flex gap-2">
                            <input
                              value={activeVideo.video}
                              onChange={(e) =>
                                updateVideo(activeIndex, "video", e.target.value)
                              }
                              placeholder="/videos/my-edit.mp4"
                              className="
                                flex-1 px-3 py-2.5 rounded-lg text-xs
                                bg-white/[0.04] border border-white/[0.08]
                                text-white font-medium placeholder:text-text-soft/30
                                outline-none transition-all duration-300
                                focus:border-accent-cyan/40 focus:bg-white/[0.06]
                              "
                            />
                            <label
                              title="Upload video file"
                              className="
                                flex items-center justify-center p-2.5 rounded-lg
                                border border-white/[0.08] bg-white/[0.04]
                                text-text-soft hover:text-white hover:border-accent-cyan/40 hover:bg-white/[0.06]
                                cursor-pointer transition-all duration-300 min-w-[42px]
                              "
                            >
                              {uploadingField?.index === activeIndex &&
                              uploadingField?.field === "video" ? (
                                <Loader2 size={16} className="animate-spin text-accent-cyan" />
                              ) : (
                                <Upload size={16} />
                              )}
                              <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => handleFileUpload(activeIndex, "video", e)}
                                className="hidden"
                                disabled={uploadingField !== null}
                              />
                            </label>
                          </div>
                        </label>

                        {/* Video Preview */}
                        <div className="rounded-xl border border-white/[0.06] bg-black/30 overflow-hidden h-40 flex items-center justify-center relative">
                          {hasVideo ? (
                            <video
                              src={activeVideo.video}
                              controls
                              className="w-full h-full object-contain"
                              key={activeVideo.video} // Forces video re-render on path change
                            />
                          ) : (
                            <div className="text-center p-4">
                              <Film size={24} className="mx-auto text-text-soft/30 mb-1.5" />
                              <p className="text-[10px] text-text-soft/60">No video file linked</p>
                              <p className="text-[8px] text-text-soft/30 mt-0.5">Upload a video or enter a valid local path</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Poster configuration */}
                      <div className="space-y-2">
                        <label className="block">
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-text-soft mb-1.5">
                            Poster path or URL
                          </span>
                          <div className="flex gap-2">
                            <input
                              value={activeVideo.poster}
                              onChange={(e) =>
                                updateVideo(activeIndex, "poster", e.target.value)
                              }
                              placeholder="/posters/my-edit.jpg"
                              className="
                                flex-1 px-3 py-2.5 rounded-lg text-xs
                                bg-white/[0.04] border border-white/[0.08]
                                text-white font-medium placeholder:text-text-soft/30
                                outline-none transition-all duration-300
                                focus:border-accent-cyan/40 focus:bg-white/[0.06]
                              "
                            />
                            <label
                              title="Upload poster image"
                              className="
                                flex items-center justify-center p-2.5 rounded-lg
                                border border-white/[0.08] bg-white/[0.04]
                                text-text-soft hover:text-white hover:border-accent-cyan/40 hover:bg-white/[0.06]
                                cursor-pointer transition-all duration-300 min-w-[42px]
                              "
                            >
                              {uploadingField?.index === activeIndex &&
                              uploadingField?.field === "poster" ? (
                                <Loader2 size={16} className="animate-spin text-accent-cyan" />
                              ) : (
                                <Upload size={16} />
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(activeIndex, "poster", e)}
                                className="hidden"
                                disabled={uploadingField !== null}
                              />
                            </label>
                          </div>
                        </label>

                        {/* Poster Preview */}
                        <div className="rounded-xl border border-white/[0.06] bg-black/30 overflow-hidden h-40 flex items-center justify-center relative">
                          {hasPoster ? (
                            <img
                              src={activeVideo.poster}
                              alt="Poster preview"
                              className="w-full h-full object-contain animate-fade-in"
                              key={activeVideo.poster}
                            />
                          ) : (
                            <div className="text-center p-4">
                              <Image size={24} className="mx-auto text-text-soft/30 mb-1.5" />
                              <p className="text-[10px] text-text-soft/60">No poster image linked</p>
                              <p className="text-[8px] text-text-soft/30 mt-0.5">Upload a poster or enter a valid local path</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            );
          })()
        ) : (
          <div className="rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01] p-16 text-center">
            <Film size={40} className="mx-auto text-text-soft/30 mb-2.5 animate-pulse" />
            <h3 className="text-sm font-bold text-white">No Video Selected</h3>
            <p className="text-xs text-text-soft max-w-xs mx-auto mt-1.5">
              Select an edit card from the sidebar list to view/modify its details, or click "+ Add" to create a new portfolio edit.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

