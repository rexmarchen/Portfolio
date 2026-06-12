import { Plus, Trash2, Upload, Loader2 } from "lucide-react";
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
  const [uploadingField, setUploadingField] = useState<{
    index: number;
    field: "video" | "poster";
  } | null>(null);

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
    onChange([...videos, makeVideo()]);
  };

  const removeVideo = (index: number) => {
    onChange(videos.filter((_, i) => i !== index));
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Videos</h2>
        <button
          type="button"
          onClick={addVideo}
          className="
            inline-flex items-center gap-2 px-4 py-2 rounded-xl
            text-xs font-bold uppercase tracking-wider
            border border-white/[0.1] bg-white/[0.04] text-white
            hover:border-accent-cyan/40 hover:bg-accent-cyan/10
            transition-all duration-300
          "
        >
          <Plus size={14} /> Add video
        </button>
      </div>

      <div className="space-y-3">
        {videos.map((video, index) => (
          <div
            key={video.id}
            className="
              rounded-xl border border-white/[0.06] bg-white/[0.02]
              p-4 space-y-3 transition-all duration-300
              hover:border-white/[0.1]
            "
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <strong className="text-sm font-bold text-white">
                {video.title || `Video ${index + 1}`}
              </strong>
              <button
                type="button"
                onClick={() => removeVideo(index)}
                className="
                  w-8 h-8 grid place-items-center rounded-lg
                  text-text-soft hover:text-red-400 hover:bg-red-500/10
                  transition-all duration-200
                "
                aria-label={`Remove ${video.title}`}
              >
                <Trash2 size={14} />
              </button>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(
                [
                  { key: "title", label: "Title" },
                  { key: "category", label: "Category" },
                  { key: "clientType", label: "Client type" },
                ] as const
              ).map((field) => (
                <label key={field.key} className="block">
                  <span className="block text-[0.65rem] font-bold uppercase tracking-wider text-text-soft mb-1">
                    {field.label}
                  </span>
                  <input
                    value={video[field.key]}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      updateVideo(index, field.key, e.target.value)
                    }
                    className="
                      w-full px-3 py-2.5 rounded-lg
                      bg-white/[0.04] border border-white/[0.08]
                      text-white text-sm font-medium
                      outline-none transition-all duration-300
                      focus:border-accent-cyan/40 focus:bg-white/[0.06]
                    "
                  />
                </label>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Video path & upload */}
              <div>
                <span className="block text-[0.65rem] font-bold uppercase tracking-wider text-text-soft mb-1">
                  Video path or URL
                </span>
                <div className="flex gap-2">
                  <input
                    value={video.video}
                    onChange={(e) =>
                      updateVideo(index, "video", e.target.value)
                    }
                    placeholder="/videos/my-edit.mp4"
                    className="
                      flex-1 px-3 py-2.5 rounded-lg
                      bg-white/[0.04] border border-white/[0.08]
                      text-white text-sm font-medium
                      placeholder:text-text-soft/40
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
                    {uploadingField?.index === index &&
                    uploadingField?.field === "video" ? (
                      <Loader2 size={16} className="animate-spin text-accent-cyan" />
                    ) : (
                      <Upload size={16} />
                    )}
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleFileUpload(index, "video", e)}
                      className="hidden"
                      disabled={uploadingField !== null}
                    />
                  </label>
                </div>
              </div>

              {/* Poster path & upload */}
              <div>
                <span className="block text-[0.65rem] font-bold uppercase tracking-wider text-text-soft mb-1">
                  Poster path or URL
                </span>
                <div className="flex gap-2">
                  <input
                    value={video.poster}
                    onChange={(e) =>
                      updateVideo(index, "poster", e.target.value)
                    }
                    placeholder="/posters/my-edit.jpg"
                    className="
                      flex-1 px-3 py-2.5 rounded-lg
                      bg-white/[0.04] border border-white/[0.08]
                      text-white text-sm font-medium
                      placeholder:text-text-soft/40
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
                    {uploadingField?.index === index &&
                    uploadingField?.field === "poster" ? (
                      <Loader2 size={16} className="animate-spin text-accent-cyan" />
                    ) : (
                      <Upload size={16} />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(index, "poster", e)}
                      className="hidden"
                      disabled={uploadingField !== null}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Featured toggle */}
            <label className="inline-flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={video.featured}
                onChange={(e) =>
                  updateVideo(index, "featured", e.target.checked)
                }
                className="w-4 h-4 rounded accent-accent-cyan"
              />
              <span className="text-xs font-semibold text-text-muted">
                Show in selected edits
              </span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

