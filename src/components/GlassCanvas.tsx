"use client";

import { useEffect, useRef } from "react";

type Shard = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rot: number;
  spin: number;
  verts: number[];
  hue: [number, number, number];
  alpha: number;
};

const PALETTE = ["#14b8a6", "#5eead4", "#2dd4bf", "#c084fc", "#a78bfa"];

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function hexToRgba(hex: string, a: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
}

function makeShard(w: number, h: number): Shard {
  const count = 5 + Math.floor(Math.random() * 3);
  const verts: number[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 1.2;
    const radius = 0.55 + Math.random() * 0.45;
    verts.push(Math.cos(angle) * radius, Math.sin(angle) * radius);
  }
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 4,
    vy: (Math.random() - 0.5) * 4,
    size: 110 + Math.random() * 260,
    rot: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.08,
    verts,
    hue: hexToRgb(PALETTE[Math.floor(Math.random() * PALETTE.length)]),
    alpha: 0.06 + Math.random() * 0.09,
  };
}

export default function GlassCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let shards: Shard[] = [];
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
      const count = Math.min(16, Math.max(7, Math.round(Math.sqrt(w * h) / 150)));
      shards = Array.from({ length: count }, () => makeShard(w, h));
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

    const drawShard = (s: Shard, light: number) => {
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.rot);
      ctx.scale(s.size, s.size);

      const [r, g, b] = s.hue;
      const alpha = Math.min(0.5, s.alpha + light * 0.22);

      ctx.beginPath();
      ctx.moveTo(s.verts[0], s.verts[1]);
      for (let i = 2; i < s.verts.length; i += 2) {
        ctx.lineTo(s.verts[i], s.verts[i + 1]);
      }
      ctx.closePath();

      const fill = ctx.createLinearGradient(-0.8, -0.8, 0.8, 0.8);
      fill.addColorStop(0, `rgba(${r},${g},${b},${alpha})`);
      fill.addColorStop(1, `rgba(${r},${g},${b},${alpha * 0.2})`);
      ctx.fillStyle = fill;
      ctx.fill();

      ctx.strokeStyle = `rgba(${r},${g},${b},${Math.min(0.6, 0.1 + light * 0.5)})`;
      ctx.lineWidth = 0.02;
      ctx.stroke();

      const coreAlpha = Math.min(0.4, 0.05 + light * 0.3);
      const coreHx = -0.2;
      const coreHy = -0.25;
      const core = ctx.createRadialGradient(coreHx, coreHy, 0.01, coreHx, coreHy, 0.8);
      core.addColorStop(0, `rgba(${r},${g},${b},${coreAlpha})`);
      core.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = core;
      ctx.fill();

      ctx.restore();
    };

    const render = (time: number) => {
      const dt = Math.min(prev === 0 ? 1 : (time - prev) / 16.7, 3);
      prev = time;
      const t = time * 0.001;

      ctx.clearRect(0, 0, w, h);

      smooth.x += (mouse.x - smooth.x) * 0.06;
      smooth.y += (mouse.y - smooth.y) * 0.06;

      const ambientA = 0.05 + Math.sin(t * 0.6) * 0.02;
      ctx.fillStyle = `radial-gradient(42% 42% at 18% 22%, ${hexToRgba("#14b8a6", ambientA)}, transparent 70%)`;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = `radial-gradient(46% 46% at 84% 78%, ${hexToRgba("#c084fc", ambientA * 0.8)}, transparent 70%)`;
      ctx.fillRect(0, 0, w, h);

      const lightOn = smooth.x > -2000 && smooth.x < w + 2000 && smooth.y > -2000 && smooth.y < h + 2000;

      for (const s of shards) {
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.rot += s.spin * dt;
        const r = s.size;
        if (s.x < -r) s.x = w + r;
        if (s.x > w + r) s.x = -r;
        if (s.y < -r) s.y = h + r;
        if (s.y > h + r) s.y = -r;

        const dx = s.x - smooth.x;
        const dy = s.y - smooth.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const light = lightOn ? Math.max(0, 1 - dist / 480) : 0;
        drawShard(s, light);
      }

      if (lightOn) {
        const glow = ctx.createRadialGradient(smooth.x, smooth.y, 0, smooth.x, smooth.y, 340);
        glow.addColorStop(0, "rgba(255,255,255,0.04)");
        glow.addColorStop(0.5, "rgba(255,255,255,0.015)");
        glow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, w, h);
      }
    };

    const frame = (time: number) => {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      render(time);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      smooth.x = w / 2;
      smooth.y = h * 0.4;
      render(performance.now());
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