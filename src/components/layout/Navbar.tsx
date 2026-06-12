import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

type NavbarProps = {
  brand: string;
};

export function Navbar({ brand }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { href: "#work", label: "Work" },
    { href: "#about", label: "About" },
    { href: "#services", label: "Services" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-500
          ${scrolled
            ? "bg-bg/80 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_8px_40px_rgba(0,0,0,0.4)]"
            : "bg-transparent border-b border-transparent"
          }
        `}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-5 md:px-8 h-16 md:h-[4.5rem]">
          {/* Brand */}
          <a
            href="#top"
            className="text-white font-black tracking-[0.12em] text-sm md:text-base hover:text-accent-cyan transition-colors duration-300"
            style={{
              textShadow: "0 0 20px rgba(6, 182, 212, 0.3)",
            }}
          >
            {brand}
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="
                  relative text-[0.8rem] font-semibold uppercase tracking-[0.08em]
                  text-text-muted hover:text-white transition-colors duration-300
                  after:absolute after:bottom-[-4px] after:left-0 after:right-0
                  after:h-[1px] after:bg-gradient-to-r after:from-transparent
                  after:via-accent-cyan after:to-transparent
                  after:scale-x-0 after:transition-transform after:duration-300
                  hover:after:scale-x-100
                "
              >
                {link.label}
              </a>
            ))}
            <a
              href="#admin"
              className="
                ml-2 px-5 py-2 rounded-full text-[0.75rem] font-bold uppercase tracking-wider
                border border-white/[0.1] bg-white/[0.04] text-text-muted
                hover:border-accent-cyan/40 hover:text-white hover:bg-accent-cyan/10
                transition-all duration-300
              "
            >
              Admin
            </a>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-white hover:text-accent-cyan transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`
          fixed inset-0 z-40 md:hidden transition-all duration-400
          ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />

        {/* Drawer */}
        <nav
          className={`
            absolute right-0 top-0 bottom-0 w-72 bg-bg/95 backdrop-blur-2xl
            border-l border-white/[0.06] flex flex-col pt-24 px-8 gap-2
            transition-transform duration-400 ease-[cubic-bezier(0.2,0.8,0.2,1)]
            ${mobileOpen ? "translate-x-0" : "translate-x-full"}
          `}
        >
          {links.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="
                py-3 text-lg font-semibold text-text-muted hover:text-white
                border-b border-white/[0.05] transition-colors duration-300
              "
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#admin"
            onClick={() => setMobileOpen(false)}
            className="
              mt-4 py-3 px-5 rounded-xl text-sm font-bold text-center uppercase
              border border-white/[0.1] bg-white/[0.04] text-text-muted
              hover:border-accent-cyan/40 hover:text-white
              transition-all duration-300
            "
          >
            Admin Panel
          </a>
        </nav>
      </div>
    </>
  );
}
