import { ArrowLeft, Download, Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { ChangeEvent, useMemo, useState } from "react";
import { PortfolioConfig, VideoItem } from "../config/portfolio";

type AdminPanelProps = {
  config: PortfolioConfig;
  onChange: (config: PortfolioConfig) => void;
  onReset: () => void;
};

const textFields: Array<{
  key: keyof Pick<
    PortfolioConfig,
    "brand" | "studioTag" | "headline" | "subheadline" | "availability" | "location"
  >;
  label: string;
  multiline?: boolean;
}> = [
  { key: "brand", label: "Name" },
  { key: "studioTag", label: "Studio tag" },
  { key: "headline", label: "Hero headline", multiline: true },
  { key: "subheadline", label: "Hero subheadline", multiline: true },
  { key: "availability", label: "Availability" },
  { key: "location", label: "Location" },
];

function makeVideo(): VideoItem {
  const id = `edit-${Date.now()}`;

  return {
    id,
    title: "New Client Edit",
    category: "Video Edit",
    clientType: "Client",
    video: "",
    poster: "",
    featured: true,
  };
}

export function AdminPanel({ config, onChange, onReset }: AdminPanelProps) {
  const [saved, setSaved] = useState(false);
  const exportText = useMemo(() => JSON.stringify(config, null, 2), [config]);

  const updateConfig = (nextConfig: PortfolioConfig) => {
    onChange(nextConfig);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1300);
  };

  const updateField = (key: keyof PortfolioConfig, value: string) => {
    updateConfig({ ...config, [key]: value });
  };

  const updateSocial = (key: keyof PortfolioConfig["socials"], value: string) => {
    updateConfig({
      ...config,
      socials: {
        ...config.socials,
        [key]: value,
      },
    });
  };

  const updateVideo = (index: number, key: keyof VideoItem, value: string | boolean) => {
    const videos = config.videos.map((video, videoIndex) =>
      videoIndex === index ? { ...video, [key]: value } : video,
    );

    updateConfig({ ...config, videos });
  };

  const addVideo = () => {
    updateConfig({ ...config, videos: [...config.videos, makeVideo()] });
  };

  const removeVideo = (index: number) => {
    updateConfig({
      ...config,
      videos: config.videos.filter((_, videoIndex) => videoIndex !== index),
    });
  };

  const importConfig = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(String(reader.result)) as PortfolioConfig;
        updateConfig(imported);
      } catch {
        window.alert("This JSON file could not be imported.");
      }
    };
    reader.readAsText(file);
  };

  const downloadConfig = () => {
    const blob = new Blob([exportText], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "rexeditzz-portfolio-config.json";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <main className="admin-page">
      <header className="admin-topbar">
        <a className="admin-back" href="#top">
          <ArrowLeft size={17} />
          View site
        </a>
        <strong>{config.brand} Admin</strong>
        <span className={`save-state ${saved ? "is-saved" : ""}`}>
          <Save size={15} />
          {saved ? "Saved" : "Auto save"}
        </span>
      </header>

      <section className="admin-hero">
        <p className="eyebrow">Owner control</p>
        <h1>Edit your portfolio from the website.</h1>
        <p>
          Changes save in this browser. For real videos, put files in
          `public/videos`, then enter paths like `/videos/my-edit.mp4`.
        </p>
      </section>

      <section className="admin-layout">
        <div className="admin-panel">
          <h2>Brand</h2>
          <div className="field-grid">
            {textFields.map((field) => (
              <label className="admin-field" key={field.key}>
                <span>{field.label}</span>
                {field.multiline ? (
                  <textarea
                    value={String(config[field.key])}
                    onChange={(event) => updateField(field.key, event.target.value)}
                  />
                ) : (
                  <input
                    value={String(config[field.key])}
                    onChange={(event) => updateField(field.key, event.target.value)}
                  />
                )}
              </label>
            ))}
          </div>
        </div>

        <div className="admin-panel">
          <h2>Contact</h2>
          <div className="field-grid three">
            <label className="admin-field">
              <span>Instagram link</span>
              <input
                value={config.socials.instagram}
                onChange={(event) => updateSocial("instagram", event.target.value)}
              />
            </label>
            <label className="admin-field">
              <span>WhatsApp link</span>
              <input
                value={config.socials.whatsapp}
                onChange={(event) => updateSocial("whatsapp", event.target.value)}
              />
            </label>
            <label className="admin-field">
              <span>Email link</span>
              <input
                value={config.socials.email}
                onChange={(event) => updateSocial("email", event.target.value)}
              />
            </label>
          </div>
        </div>

        <div className="admin-panel">
          <div className="admin-panel-title">
            <h2>Videos</h2>
            <button className="admin-button" type="button" onClick={addVideo}>
              <Plus size={16} />
              Add video
            </button>
          </div>

          <div className="video-editor-list">
            {config.videos.map((video, index) => (
              <article className="video-editor" key={video.id}>
                <div className="video-editor-heading">
                  <strong>{video.title || `Video ${index + 1}`}</strong>
                  <button
                    aria-label={`Remove ${video.title}`}
                    className="icon-button"
                    type="button"
                    onClick={() => removeVideo(index)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="field-grid three">
                  <label className="admin-field">
                    <span>Title</span>
                    <input
                      value={video.title}
                      onChange={(event) => updateVideo(index, "title", event.target.value)}
                    />
                  </label>
                  <label className="admin-field">
                    <span>Category</span>
                    <input
                      value={video.category}
                      onChange={(event) =>
                        updateVideo(index, "category", event.target.value)
                      }
                    />
                  </label>
                  <label className="admin-field">
                    <span>Client type</span>
                    <input
                      value={video.clientType}
                      onChange={(event) =>
                        updateVideo(index, "clientType", event.target.value)
                      }
                    />
                  </label>
                </div>

                <div className="field-grid two">
                  <label className="admin-field">
                    <span>Video path or direct URL</span>
                    <input
                      placeholder="/videos/my-edit.mp4"
                      value={video.video}
                      onChange={(event) => updateVideo(index, "video", event.target.value)}
                    />
                  </label>
                  <label className="admin-field">
                    <span>Poster path or direct URL</span>
                    <input
                      placeholder="/posters/my-edit.jpg"
                      value={video.poster}
                      onChange={(event) => updateVideo(index, "poster", event.target.value)}
                    />
                  </label>
                </div>

                <label className="feature-toggle">
                  <input
                    checked={video.featured}
                    type="checkbox"
                    onChange={(event) =>
                      updateVideo(index, "featured", event.target.checked)
                    }
                  />
                  Show in selected edits
                </label>
              </article>
            ))}
          </div>
        </div>

        <div className="admin-actions">
          <button className="admin-button" type="button" onClick={downloadConfig}>
            <Download size={16} />
            Export backup
          </button>
          <label className="admin-button file-button">
            Import backup
            <input accept="application/json" type="file" onChange={importConfig} />
          </label>
          <button className="admin-button danger" type="button" onClick={onReset}>
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </section>
    </main>
  );
}
