import { useEffect, useRef } from "react";
import Lenis from "lenis";

/**
 * Initialises Lenis smooth-scroll and drives the scroll-linked
 * CSS custom properties used by the progress bar, hero parallax,
 * and section glow offsets.
 *
 * Lenis gives the page a buttery-smooth, momentum-based scroll feel
 * similar to Apple.com / Stripe.com.
 */
export function useScrollProgress() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // ── Lenis smooth scroll ──
    const lenis = new Lenis({
      duration: 1.2,          // scroll duration (higher = smoother)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // exponential ease-out
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenisRef.current = lenis;

    // ── Scroll-linked CSS variables ──
    const setVar = (name: string, value: string) =>
      document.documentElement.style.setProperty(name, value);

    lenis.on("scroll", (e: { progress: number; scroll: number }) => {
      const scrollY = e.scroll;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight || 1;
      const progress = Math.min(scrollY / scrollable, 1);
      const heroProgress = Math.min(scrollY / (window.innerHeight || 1), 1);

      setVar("--scroll-progress", progress.toFixed(5));
      setVar("--hero-progress", heroProgress.toFixed(5));
      setVar("--hero-fade", (1 - heroProgress * 0.35).toFixed(5));
      setVar("--hero-y", `${(heroProgress * 50).toFixed(2)}px`);
      setVar("--hero-scale", (1 + heroProgress * 0.04).toFixed(5));

      // Parallax offset for section background glows
      setVar("--parallax-y", `${(scrollY * 0.08).toFixed(2)}px`);
    });

    // ── RAF loop ──
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // ── Handle anchor clicks for Lenis ──
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a[href^='#']") as HTMLAnchorElement | null;
      if (!anchor) return;

      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#admin") return;

      const el = document.querySelector(hash);
      if (el) {
        e.preventDefault();
        lenis.scrollTo(el as HTMLElement, { offset: -72 });
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
      lenis.destroy();
    };
  }, []);

  return lenisRef;
}
