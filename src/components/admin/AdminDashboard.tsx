import {
  ArrowLeft,
  Download,
  Eye,
  EyeOff,
  Key,
  LogOut,
  RotateCcw,
  Save,
} from "lucide-react";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { PortfolioConfig, VideoItem } from "../../config/portfolio";
import { hashPassword, verifyPassword } from "../../utils/auth";
import {
  getPasswordHash,
  logout,
  setPasswordHash,
} from "../../storage/authStorage";
import { VideoEditor } from "./VideoEditor";

type AdminDashboardProps = {
  config: PortfolioConfig;
  onChange: (config: PortfolioConfig) => void;
  onReset: () => void;
  onLogout: () => void;
};

type Tab = "brand" | "contact" | "videos" | "settings";

const brandFields: Array<{
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

export function AdminDashboard({
  config,
  onChange,
  onReset,
  onLogout,
}: AdminDashboardProps) {
  const [tab, setTab] = useState<Tab>("brand");
  const [saved, setSaved] = useState(false);

  // Password change state
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);

  const exportText = useMemo(() => JSON.stringify(config, null, 2), [config]);

  const save = (next: PortfolioConfig) => {
    onChange(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const updateField = (key: keyof PortfolioConfig, value: string) => {
    save({ ...config, [key]: value });
  };

  const updateSocial = (
    key: keyof PortfolioConfig["socials"],
    value: string,
  ) => {
    save({ ...config, socials: { ...config.socials, [key]: value } });
  };

  const updateVideos = (videos: VideoItem[]) => {
    save({ ...config, videos });
  };

  const importConfig = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(String(reader.result)) as PortfolioConfig;
        save(imported);
      } catch {
        alert("Invalid JSON file.");
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

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess(false);

    const valid = await verifyPassword(currentPw, getPasswordHash());
    if (!valid) {
      setPwError("Current password is incorrect.");
      return;
    }
    if (newPw.length < 6) {
      setPwError("New password must be at least 6 characters.");
      return;
    }
    if (newPw !== confirmPw) {
      setPwError("Passwords do not match.");
      return;
    }

    const newHash = await hashPassword(newPw);
    setPasswordHash(newHash);
    setPwSuccess(true);
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
    setTimeout(() => setPwSuccess(false), 3000);
  };

  const handleLogout = () => {
    logout();
    onLogout();
  };

  const tabs: Array<{ id: Tab; label: string }> = [
    { id: "brand", label: "Brand" },
    { id: "contact", label: "Contact" },
    { id: "videos", label: "Videos" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-bg text-white">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-bg/90 backdrop-blur-2xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 md:px-8 h-14">
          <a
            href="#top"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-muted hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> View site
          </a>

          <span className="text-xs font-black uppercase tracking-[0.16em] text-white">
            {config.brand} Admin
          </span>

          <div className="flex items-center gap-3">
            <span
              className={`
                inline-flex items-center gap-1.5 text-xs font-bold
                transition-colors duration-300
                ${saved ? "text-accent-cyan" : "text-text-soft"}
              `}
            >
              <Save size={13} />
              {saved ? "Saved" : "Auto-save"}
            </span>
            <button
              onClick={handleLogout}
              className="
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                text-xs font-bold text-text-soft
                hover:text-red-400 hover:bg-red-500/10
                transition-all duration-200
              "
            >
              <LogOut size={13} /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-5 md:px-8 py-8 md:py-12">
        {/* Hero */}
        <div className="mb-10">
          <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.18em] text-accent-cyan mb-2">
            Owner control
          </p>
          <h1 className="text-[clamp(1.8rem,5vw,4rem)] font-black leading-[0.92] text-white">
            Edit your portfolio from the website.
          </h1>
          <p className="mt-3 text-sm text-text-muted max-w-xl">
            Changes save in this browser. For real videos, put files in{" "}
            <code className="px-1.5 py-0.5 rounded bg-white/[0.06] text-xs font-mono">
              public/videos
            </code>
            , then enter paths like{" "}
            <code className="px-1.5 py-0.5 rounded bg-white/[0.06] text-xs font-mono">
              /videos/my-edit.mp4
            </code>
            .
          </p>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 mb-8 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] w-fit">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`
                px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider
                transition-all duration-200
                ${
                  tab === t.id
                    ? "bg-white/[0.08] text-white shadow-sm"
                    : "text-text-soft hover:text-white hover:bg-white/[0.04]"
                }
              `}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="space-y-6 animate-fade-in">
          {/* Brand tab */}
          {tab === "brand" && (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 md:p-7 space-y-4">
              <h2 className="text-lg font-bold text-white mb-4">
                Brand Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {brandFields.map((field) => (
                  <label key={field.key} className="block">
                    <span className="block text-[0.65rem] font-bold uppercase tracking-wider text-text-soft mb-1.5">
                      {field.label}
                    </span>
                    {field.multiline ? (
                      <textarea
                        value={String(config[field.key])}
                        onChange={(e) => updateField(field.key, e.target.value)}
                        rows={3}
                        className="
                          w-full px-3 py-2.5 rounded-lg resize-y
                          bg-white/[0.04] border border-white/[0.08]
                          text-white text-sm font-medium
                          outline-none transition-all duration-300
                          focus:border-accent-cyan/40 focus:bg-white/[0.06]
                        "
                      />
                    ) : (
                      <input
                        value={String(config[field.key])}
                        onChange={(e) => updateField(field.key, e.target.value)}
                        className="
                          w-full px-3 py-2.5 rounded-lg
                          bg-white/[0.04] border border-white/[0.08]
                          text-white text-sm font-medium
                          outline-none transition-all duration-300
                          focus:border-accent-cyan/40 focus:bg-white/[0.06]
                        "
                      />
                    )}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Contact tab */}
          {tab === "contact" && (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 md:p-7 space-y-4">
              <h2 className="text-lg font-bold text-white mb-4">
                Contact Links
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(
                  [
                    { key: "instagram" as const, label: "Instagram link" },
                    { key: "whatsapp" as const, label: "WhatsApp link" },
                    { key: "email" as const, label: "Email link" },
                  ]
                ).map((field) => (
                  <label key={field.key} className="block">
                    <span className="block text-[0.65rem] font-bold uppercase tracking-wider text-text-soft mb-1.5">
                      {field.label}
                    </span>
                    <input
                      value={config.socials[field.key]}
                      onChange={(e) => updateSocial(field.key, e.target.value)}
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
            </div>
          )}

          {/* Videos tab */}
          {tab === "videos" && (
            <VideoEditor videos={config.videos} onChange={updateVideos} />
          )}

          {/* Settings tab */}
          {tab === "settings" && (
            <div className="space-y-6">
              {/* Change password */}
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 md:p-7">
                <div className="flex items-center gap-2 mb-5">
                  <Key size={18} className="text-accent-cyan" />
                  <h2 className="text-lg font-bold text-white">
                    Change Password
                  </h2>
                </div>

                <form
                  onSubmit={handlePasswordChange}
                  className="max-w-md space-y-4"
                >
                  {(
                    [
                      {
                        label: "Current password",
                        value: currentPw,
                        set: setCurrentPw,
                      },
                      {
                        label: "New password",
                        value: newPw,
                        set: setNewPw,
                      },
                      {
                        label: "Confirm new password",
                        value: confirmPw,
                        set: setConfirmPw,
                      },
                    ]
                  ).map((field) => (
                    <label key={field.label} className="block">
                      <span className="block text-[0.65rem] font-bold uppercase tracking-wider text-text-soft mb-1.5">
                        {field.label}
                      </span>
                      <div className="relative">
                        <input
                          type={showPw ? "text" : "password"}
                          value={field.value}
                          onChange={(e) => {
                            field.set(e.target.value);
                            setPwError("");
                          }}
                          className="
                            w-full px-3 py-2.5 pr-10 rounded-lg
                            bg-white/[0.04] border border-white/[0.08]
                            text-white text-sm font-medium
                            outline-none transition-all duration-300
                            focus:border-accent-cyan/40 focus:bg-white/[0.06]
                          "
                        />
                      </div>
                    </label>
                  ))}

                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="inline-flex items-center gap-1.5 text-xs text-text-soft hover:text-white transition-colors"
                  >
                    {showPw ? <EyeOff size={13} /> : <Eye size={13} />}
                    {showPw ? "Hide passwords" : "Show passwords"}
                  </button>

                  {pwError && (
                    <p className="text-xs font-medium text-red-400">
                      {pwError}
                    </p>
                  )}
                  {pwSuccess && (
                    <p className="text-xs font-medium text-green-400">
                      Password changed successfully!
                    </p>
                  )}

                  <button
                    type="submit"
                    className="
                      inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                      text-xs font-bold uppercase tracking-wider
                      border border-white/[0.1] bg-white/[0.04] text-white
                      hover:border-accent-cyan/40 hover:bg-accent-cyan/10
                      transition-all duration-300
                    "
                  >
                    Update Password
                  </button>
                </form>
              </div>

              {/* Import/Export/Reset */}
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 md:p-7">
                <h2 className="text-lg font-bold text-white mb-5">
                  Data Management
                </h2>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={downloadConfig}
                    className="
                      inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
                      text-xs font-bold uppercase tracking-wider
                      border border-white/[0.1] bg-white/[0.04] text-white
                      hover:border-accent-cyan/40 hover:bg-accent-cyan/10
                      transition-all duration-300
                    "
                  >
                    <Download size={14} /> Export backup
                  </button>

                  <label
                    className="
                      relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
                      text-xs font-bold uppercase tracking-wider cursor-pointer
                      border border-white/[0.1] bg-white/[0.04] text-white
                      hover:border-accent-cyan/40 hover:bg-accent-cyan/10
                      transition-all duration-300 overflow-hidden
                    "
                  >
                    Import backup
                    <input
                      type="file"
                      accept="application/json"
                      onChange={importConfig}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </label>

                  <button
                    onClick={onReset}
                    className="
                      inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
                      text-xs font-bold uppercase tracking-wider
                      border border-red-500/20 bg-red-500/5 text-red-400
                      hover:border-red-500/40 hover:bg-red-500/10
                      transition-all duration-300
                    "
                  >
                    <RotateCcw size={14} /> Reset all
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
