import { ArrowUpRight, Mail, MessageCircle, Send, Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";
import { Reveal } from "../ui/Reveal";
import { PortfolioConfig } from "../../config/portfolio";

type ContactProps = {
  config: PortfolioConfig;
};

export function Contact({ config }: ContactProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const getInstaLabel = (url: string) => {
    try {
      const parts = url.replace(/\/$/, "").split("/");
      const last = parts[parts.length - 1] || "";
      const username = last.split("?")[0] || "";
      return username ? `@${username}` : "Instagram";
    } catch {
      return "Instagram";
    }
  };

  const getWhatsappLabel = (url: string) => {
    try {
      const num = url.split("wa.me/")[1]?.split("?")[0] || "";
      const cleaned = num.replace(/^91/, "");
      return cleaned || "WhatsApp";
    } catch {
      return "WhatsApp";
    }
  };

  const getEmailLabel = (url: string) => {
    return url.replace("mailto:", "") || "Email";
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const mailtoLink = `mailto:${config.email}?subject=${encodeURIComponent(formData.subject || "Project Inquiry")}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`,
    )}`;

    window.open(mailtoLink, "_blank");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section
      id="contact"
      className="relative py-20 md:py-32 px-5 md:px-8 border-t border-white/[0.04] overflow-hidden"
    >
      {/* Background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-accent-cyan/[0.08] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-[15%] w-80 h-80 bg-accent-violet/[0.06] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto text-center">
        {/* Header */}
        <Reveal>
          <Sparkles
            size={28}
            className="mx-auto mb-4 text-accent-cyan drop-shadow-[0_0_16px_rgba(6,182,212,0.4)] animate-float"
          />
          <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.18em] text-accent-cyan mb-3">
            Ready for the next edit
          </p>
          <h2 className="text-[clamp(2rem,5vw,4rem)] font-black leading-[0.92] text-white">
            Bring the footage. {config.brand} will make it feel premium.
          </h2>
        </Reveal>

        {/* Contact form */}
        <Reveal delay={150}>
          <form
            onSubmit={handleSubmit}
            className="
              mt-12 p-6 md:p-10 rounded-3xl text-left
              border border-white/[0.08] bg-white/[0.03]
              backdrop-blur-xl
              shadow-[0_0_80px_rgba(6,182,212,0.04)]
            "
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-soft mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="
                    w-full px-4 py-3 rounded-xl
                    bg-white/[0.04] border border-white/[0.08]
                    text-white text-sm font-medium
                    placeholder:text-text-soft/60
                    outline-none transition-all duration-300
                    focus:border-accent-cyan/40 focus:bg-white/[0.06]
                    focus:shadow-[0_0_20px_rgba(6,182,212,0.1)]
                  "
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-soft mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="
                    w-full px-4 py-3 rounded-xl
                    bg-white/[0.04] border border-white/[0.08]
                    text-white text-sm font-medium
                    placeholder:text-text-soft/60
                    outline-none transition-all duration-300
                    focus:border-accent-cyan/40 focus:bg-white/[0.06]
                    focus:shadow-[0_0_20px_rgba(6,182,212,0.1)]
                  "
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-text-soft mb-2">
                Subject
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                className="
                  w-full px-4 py-3 rounded-xl
                  bg-white/[0.04] border border-white/[0.08]
                  text-white text-sm font-medium
                  placeholder:text-text-soft/60
                  outline-none transition-all duration-300
                  focus:border-accent-cyan/40 focus:bg-white/[0.06]
                  focus:shadow-[0_0_20px_rgba(6,182,212,0.1)]
                "
                placeholder="Project type (e.g., Brand Film, Reels Pack)"
              />
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-text-soft mb-2">
                Message
              </label>
              <textarea
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                required
                rows={5}
                className="
                  w-full px-4 py-3 rounded-xl resize-y
                  bg-white/[0.04] border border-white/[0.08]
                  text-white text-sm font-medium
                  placeholder:text-text-soft/60
                  outline-none transition-all duration-300
                  focus:border-accent-cyan/40 focus:bg-white/[0.06]
                  focus:shadow-[0_0_20px_rgba(6,182,212,0.1)]
                "
                placeholder="Tell us about your project..."
              />
            </div>

            <button
              type="submit"
              className="
                group/btn relative w-full inline-flex items-center justify-center gap-2.5
                px-8 py-4 rounded-2xl
                font-extrabold text-sm uppercase tracking-wider
                text-bg bg-gradient-to-r from-white via-accent-cyan/20 to-accent-cyan
                shadow-[0_14px_40px_rgba(6,182,212,0.2)]
                overflow-hidden transition-all duration-300
                hover:shadow-[0_20px_50px_rgba(6,182,212,0.35)]
                hover:-translate-y-0.5
                disabled:opacity-60
              "
              disabled={submitted}
            >
              <span className="relative z-10 flex items-center gap-2">
                {submitted ? (
                  "Message sent!"
                ) : (
                  <>
                    <Send size={16} />
                    Send message
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
            </button>
          </form>
        </Reveal>

        {/* Social links */}
        <Reveal delay={250}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href={config.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                text-xs font-bold uppercase tracking-wider text-white
                border border-white/[0.1] bg-white/[0.03]
                hover:border-accent-cyan/40 hover:bg-accent-cyan/10
                transition-all duration-300 hover:-translate-y-0.5
              "
            >
              Instagram: {getInstaLabel(config.socials.instagram)} <ArrowUpRight size={14} />
            </a>
            <a
              href={config.socials.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                text-xs font-bold uppercase tracking-wider text-white
                border border-white/[0.1] bg-white/[0.03]
                hover:border-accent-cyan/40 hover:bg-accent-cyan/10
                transition-all duration-300 hover:-translate-y-0.5
              "
            >
              <MessageCircle size={14} /> WhatsApp: {getWhatsappLabel(config.socials.whatsapp)}
            </a>
            <a
              href={config.socials.email}
              className="
                inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                text-xs font-bold uppercase tracking-wider text-white
                border border-white/[0.1] bg-white/[0.03]
                hover:border-accent-cyan/40 hover:bg-accent-cyan/10
                transition-all duration-300 hover:-translate-y-0.5
              "
            >
              <Mail size={14} /> Email: {getEmailLabel(config.socials.email)}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
