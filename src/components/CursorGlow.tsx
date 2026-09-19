"use client";

import { useEffect, useRef } from "react";

function hexToRgba(hex: string, a: number): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

export default function CursorGlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    const mouse = { x: -9999, y: -9999 };
    const smooth = { x: -9999, y: -9999 };
    let raf = 0;
    let running = true;
    let prev = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const onPointerMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onPointerLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);

    const render = (time: number) => {
      const dt = Math.min(prev === 0 ? 1 : (time - prev) / 16.7, 3);
      prev = time;
      const t = time * 0.001;

      ctx.clearRect(0, 0, w, h);

      smooth.x += (mouse.x - smooth.x) * 0.06;
      smooth.y += (mouse.y - smooth.y) * 0.06;

      const ambientA = 0.08 + Math.sin(t * 0.6) * 0.03;
      ctx.fillStyle = `radial-gradient(42% 42% at 18% 22%, ${hexToRgba("#14b8a6", ambientA)}, transparent 70%)`;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = `radial-gradient(46% 46% at 84% 78%, ${hexToRgba("#c084fc", ambientA * 0.8)}, transparent 70%)`;
      ctx.fillRect(0, 0, w, h);

      const lightOn =
        smooth.x > -2000 &&
        smooth.x < w + 2000 &&
        smooth.y > -2000 &&
        smooth.y < h + 2000;
      if (!lightOn) return;

      const glow = ctx.createRadialGradient(smooth.x, smooth.y, 0, smooth.x, smooth.y, 340);
      glow.addColorStop(0, "rgba(255,255,255,0.045)");
      glow.addColorStop(0.5, "rgba(255,255,255,0.016)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);
    };

    const frame = (time: number) => {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      render(time);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      render(0);
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 h-screen w-screen mix-blend-screen"
    />
  );
}