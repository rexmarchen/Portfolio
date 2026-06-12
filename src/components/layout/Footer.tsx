import { ArrowUpRight } from "lucide-react";

type FooterProps = {
  brand: string;
  socials: {
    instagram: string;
    whatsapp: string;
    email: string;
  };
};

export function Footer({ brand, socials }: FooterProps) {
  return (
    <footer className="relative border-t border-white/[0.06]">
      {/* Gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-cyan/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-12 md:py-16">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Brand */}
          <div>
            <span
              className="text-white font-black tracking-[0.12em] text-sm"
              style={{ textShadow: "0 0 16px rgba(6, 182, 212, 0.2)" }}
            >
              {brand}
            </span>
            <p className="mt-1 text-xs text-text-soft">
              Premium video editing & motion graphics
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-4">
            {[
              { label: "Instagram", href: socials.instagram },
              { label: "Email", href: socials.email },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex items-center gap-1 text-xs font-semibold text-text-soft
                  hover:text-accent-cyan transition-colors duration-300
                "
              >
                {link.label}
                <ArrowUpRight size={12} />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/[0.04] text-center">
          <p className="text-xs text-text-soft/60">
            © {new Date().getFullYear()} {brand}. Crafted with precision.
          </p>
        </div>
      </div>
    </footer>
  );
}
