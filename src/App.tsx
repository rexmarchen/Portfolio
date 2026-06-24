import { useEffect, useState } from "react";

import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { Hero } from "./components/sections/Hero";
import { Projects } from "./components/sections/Projects";
import { About } from "./components/sections/About";
import { Services } from "./components/sections/Services";
import { Process } from "./components/sections/Process";
import { Contact } from "./components/sections/Contact";
import { AdminLogin } from "./components/admin/AdminLogin";
import { AdminDashboard } from "./components/admin/AdminDashboard";

import { loadPortfolio, resetPortfolio, savePortfolio } from "./storage/portfolioStorage";
import { isAuthenticated, logout } from "./storage/authStorage";
import { useScrollProgress } from "./hooks/useScrollProgress";

function App() {
  const [portfolio, setPortfolio] = useState(loadPortfolio);
  const [isAdmin, setIsAdmin] = useState(() => window.location.hash === "#admin" || window.location.pathname === "/admin" || window.location.pathname === "/admin/");
  const [authed, setAuthed] = useState(() => isAuthenticated());

  // Redirect /admin or /admin/ to /#admin
  useEffect(() => {
    if (window.location.pathname === "/admin" || window.location.pathname === "/admin/") {
      window.location.replace("/#admin");
    }
  }, []);

  useScrollProgress();

  // Load config from database on mount, fallback to localStorage
  useEffect(() => {
    fetch("/api/portfolio")
      .then((res) => {
        if (!res.ok) throw new Error("API failed");
        return res.json();
      })
      .then((data) => {
        setPortfolio(data);
      })
      .catch((err) => {
        console.warn("Using localStorage fallback:", err);
      });
  }, []);

  // Update title
  useEffect(() => {
    document.title = `${portfolio.brand} | Video Editing & Motion Graphics`;
  }, [portfolio.brand]);

  // Listen for hash changes
  useEffect(() => {
    const handleHash = () => {
      setIsAdmin(window.location.hash === "#admin");
    };
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const updatePortfolio = async (next: typeof portfolio) => {
    setPortfolio(next);
    savePortfolio(next); // Sync local storage

    try {
      await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
    } catch (err) {
      console.error("Failed to save to database:", err);
    }
  };

  const restoreDefault = async () => {
    const fallback = resetPortfolio();
    setPortfolio(fallback);

    try {
      await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fallback),
      });
    } catch (err) {
      console.error("Failed to restore default database config:", err);
    }
  };

  const handleLogout = () => {
    logout();
    setAuthed(false);
    window.location.hash = "#top";
  };

  // ── Admin Routes ──
  if (isAdmin) {
    if (!authed) {
      return <AdminLogin onSuccess={() => setAuthed(true)} />;
    }
    return (
      <AdminDashboard
        config={portfolio}
        onChange={updatePortfolio}
        onReset={restoreDefault}
        onLogout={handleLogout}
      />
    );
  }

  // ── Public Portfolio ──
  const featured = portfolio.videos.filter((v) => v.featured);

  return (
    <>
      {/* Scroll progress bar */}
      <div
        className="scroll-progress"
        style={{ transform: "scaleX(var(--scroll-progress, 0))" }}
      />

      <Navbar brand={portfolio.brand} />

      <main className="relative bg-bg">
        <Hero config={portfolio} />

        {/* Intro band */}
        <section className="relative py-20 md:py-28 px-5 md:px-8 border-t border-white/[0.04] overflow-hidden">
          {/* Ambient background glow matching the illustration's colors */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[35rem] h-[35rem] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center relative z-10">
            {/* Left Column: Eyebrow, Heading, Paragraph */}
            <div className="flex flex-col justify-center text-left">
              <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.18em] text-accent-cyan mb-3">
                Built for clients who judge by results
              </p>
              <h2 className="text-[clamp(2.2rem,4.5vw,4.2rem)] font-black leading-[0.95] text-white tracking-tight mb-6">
                Clean edits. Sharp motion. Premium delivery.
              </h2>
              <p className="text-text-muted text-base md:text-lg leading-relaxed max-w-xl">
                {portfolio.brand} turns raw footage into brand-ready edits that
                feel expensive, move fast, and make the first three seconds count.
              </p>
            </div>

            {/* Right Column: Editing Panel Illustration */}
            <div className="relative flex justify-center lg:justify-end translate-y-6 lg:translate-y-12">
              {/* Soft purple/cyan gradient glow beneath the card */}
              <div className="absolute -inset-6 bg-gradient-to-tr from-accent-cyan/20 to-violet-500/25 rounded-3xl blur-3xl opacity-40 pointer-events-none" />
              
              <div 
                className="relative overflow-hidden group max-w-md lg:max-w-full"
                style={{
                  maskImage: 'radial-gradient(ellipse at center, black 60%, transparent 98%)',
                  WebkitMaskImage: 'radial-gradient(ellipse at center, black 60%, transparent 98%)'
                }}
              >
                <img
                  src="/images/intro-panel.png"
                  alt="Video Editing Workspace"
                  className="w-full h-auto object-cover transform group-hover:scale-[1.02] transition-transform duration-700 filter brightness-95 contrast-105"
                />
              </div>
            </div>
          </div>
        </section>

        <Projects featured={featured} all={portfolio.videos} />
        <About config={portfolio} />
        <Services />
        <Process />
        <Contact config={portfolio} />
      </main>

      <Footer brand={portfolio.brand} socials={portfolio.socials} />
    </>
  );
}

export default App;
