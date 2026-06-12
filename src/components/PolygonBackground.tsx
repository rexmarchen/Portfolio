import { useEffect, useRef } from "react";

type Point = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

export function PolygonBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let points: Point[] = [];
    const pointer = { x: 0, y: 0, active: false };
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const pointCount = width < 700 ? 28 : 48;
      points = Array.from({ length: pointCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
      }));
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      context.fillStyle = "#030303";
      context.fillRect(0, 0, width, height);

      for (const point of points) {
        if (!prefersReducedMotion) {
          point.x += point.vx;
          point.y += point.vy;
        }

        if (point.x < -20) point.x = width + 20;
        if (point.x > width + 20) point.x = -20;
        if (point.y < -20) point.y = height + 20;
        if (point.y > height + 20) point.y = -20;
      }

      for (let index = 0; index < points.length; index += 1) {
        const a = points[index];

        for (let nextIndex = index + 1; nextIndex < points.length; nextIndex += 1) {
          const b = points[nextIndex];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          const maxDistance = width < 700 ? 138 : 168;

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.25;
            context.strokeStyle = `rgba(255,255,255,${opacity})`;
            context.lineWidth = 1;
            context.beginPath();
            context.moveTo(a.x, a.y);
            context.lineTo(b.x, b.y);
            context.stroke();
          }
        }

        const pointerDistance = Math.hypot(a.x - pointer.x, a.y - pointer.y);
        const pointGlow =
          pointer.active && pointerDistance < 180
            ? 0.46 - pointerDistance / 420
            : 0.18;

        context.fillStyle = `rgba(255,255,255,${Math.max(pointGlow, 0.12)})`;
        context.beginPath();
        context.arc(a.x, a.y, 1.45, 0, Math.PI * 2);
        context.fill();
      }

      context.strokeStyle = "rgba(255,255,255,0.08)";
      context.lineWidth = 1;
      context.strokeRect(width * 0.08, height * 0.13, width * 0.84, height * 0.68);

      animationFrame = window.requestAnimationFrame(draw);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    resize();
    draw();

    window.addEventListener("resize", resize);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return <canvas className="polygon-canvas" ref={canvasRef} aria-hidden="true" />;
}
