import React, { useEffect, useRef } from 'react';
import styles from '../pages/index.module.css';

type Particle = {
  x: number;
  y: number;
  radius: number;
  baseRadius: number;
  opacity: number;
  speed: number;
  vx: number;          // horizontal drift velocity
  vxAccel: number;     // slow random acceleration applied each frame
  pulsePhase: number;  // current phase for size pulsing
  pulseSpeed: number;  // how fast the size pulses
  pulseAmp: number;    // amplitude of size pulse (fraction of baseRadius)
  type: 'orb' | 'spark';
};

function makeOrb(w: number, h: number, randomY = false): Particle {
  const baseRadius = Math.random() * 55 + 20;
  return {
    x: Math.random() * (w + 120) - 60,
    y: randomY ? Math.random() * h : h + Math.random() * 120,
    radius: baseRadius,
    baseRadius,
    opacity: Math.random() * 0.42 + 0.10,
    speed: Math.random() * 0.70 + 0.35,
    vx: (Math.random() - 0.5) * 0.6,
    vxAccel: (Math.random() - 0.5) * 0.008,
    pulsePhase: Math.random() * Math.PI * 2,
    pulseSpeed: Math.random() * 0.012 + 0.004,
    pulseAmp: Math.random() * 0.25 + 0.08,
    type: 'orb',
  };
}

function makeSpark(w: number, h: number, randomY = false): Particle {
  const baseRadius = Math.random() * 5 + 2.5; // 2.5–7.5 px core (was 1.5–4)
  return {
    x: Math.random() * w,
    y: randomY ? Math.random() * h : h + Math.random() * 80,
    radius: baseRadius,
    baseRadius,
    opacity: Math.random() * 0.30 + 0.70,    // 0.70–1.0 (was 0.55–1.0)
    speed: Math.random() * 0.9 + 0.4,
    vx: (Math.random() - 0.5) * 1.2,
    vxAccel: (Math.random() - 0.5) * 0.025,
    pulsePhase: Math.random() * Math.PI * 2,
    pulseSpeed: Math.random() * 0.045 + 0.015,
    pulseAmp: Math.random() * 0.55 + 0.20,
    type: 'spark',
  };
}

function drawOrb(ctx: CanvasRenderingContext2D, p: Particle, rx: number) {
  const r = p.radius;
  const o = p.opacity;
  // Real lens bokeh: aperture disc → center slightly dimmer, bright ring at ~0.35r, soft edge
  const g = ctx.createRadialGradient(rx, p.y, 0, rx, p.y, r);
  g.addColorStop(0,    `rgba(255, 15, 50, ${o * 0.75})`);
  g.addColorStop(0.30, `rgba(255, 25, 60, ${o})`);        // brightest ring
  g.addColorStop(0.62, `rgba(255, 10, 45, ${o * 0.72})`);
  g.addColorStop(0.84, `rgba(210,  0, 35, ${o * 0.20})`);
  g.addColorStop(1,    `rgba(180,  0, 28, 0)`);

  ctx.beginPath();
  ctx.arc(rx, p.y, r, 0, Math.PI * 2);
  ctx.fillStyle = g;
  ctx.fill();
}

function drawSpark(ctx: CanvasRenderingContext2D, p: Particle, rx: number) {
  const haloR = p.radius * 7;
  // Outer halo
  const gHalo = ctx.createRadialGradient(rx, p.y, 0, rx, p.y, haloR);
  gHalo.addColorStop(0,   `rgba(255, 120, 100, ${p.opacity * 0.9})`);
  gHalo.addColorStop(0.3, `rgba(255,  40,  60, ${p.opacity * 0.55})`);
  gHalo.addColorStop(1,   `rgba(220,   0,  40, 0)`);
  ctx.beginPath();
  ctx.arc(rx, p.y, haloR, 0, Math.PI * 2);
  ctx.fillStyle = gHalo;
  ctx.fill();
  // Bright white-red core
  ctx.beginPath();
  ctx.arc(rx, p.y, p.radius, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255, 230, 220, ${p.opacity})`;
  ctx.fill();
}

export default function HeroBokeh() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const c = canvas;
    const cx = ctx;

    let w = c.offsetWidth;
    let h = c.offsetHeight;
    c.width = w;
    c.height = h;

    const isMobile = window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;
    const orbCount   = isMobile ? 7  : 22;
    const sparkCount = isMobile ? 3  : 12;
    const TARGET_FPS = isMobile ? 30 : 60;
    const FRAME_MS   = 1000 / TARGET_FPS;
    let lastFrameTime = 0;

    const particles: Particle[] = [
      ...Array.from({ length: orbCount },   () => makeOrb(w, h, true)),
      ...Array.from({ length: sparkCount }, () => makeSpark(w, h, true)),
    ];

    let animId: number;

    // Focal glows (skip second on mobile to save fill passes)
    const foci = isMobile
      ? [
          { baseX: 0.82, baseY: 0.12, t: 0,      speed: 0.00035, range: 0.045, color: '220, 10, 50' },
        ]
      : [
          { baseX: 0.82, baseY: 0.12, t: 0,      speed: 0.00035, range: 0.045, color: '220, 10, 50' },
          { baseX: 0.14, baseY: 0.80, t: Math.PI, speed: 0.00028, range: 0.040, color: '180, 0, 60' },
        ];

    function draw(timestamp: number) {
      if (timestamp - lastFrameTime < FRAME_MS) {
        animId = requestAnimationFrame(draw);
        return;
      }
      lastFrameTime = timestamp;

      cx.clearRect(0, 0, w, h);

      // Ambient light at the top (matching the original's light source)
      const ambient = cx.createRadialGradient(w * 0.55, -h * 0.1, 0, w * 0.55, -h * 0.1, h * 0.9);
      ambient.addColorStop(0,   'rgba(255, 0, 54, 0.07)');
      ambient.addColorStop(0.5, 'rgba(255, 0, 54, 0.03)');
      ambient.addColorStop(1,   'rgba(0, 0, 0, 0)');
      cx.fillStyle = ambient;
      cx.fillRect(0, 0, w, h);

      // Dynamic focal glows
      for (const f of foci) {
        f.t += f.speed;
        const fx = (f.baseX + Math.sin(f.t * 1.3) * f.range) * w;
        const fy = (f.baseY + Math.cos(f.t)        * f.range * 0.6) * h;
        const gr = Math.min(w, h) * 0.65;
        const gf = cx.createRadialGradient(fx, fy, 0, fx, fy, gr);
        gf.addColorStop(0,    `rgba(${f.color}, 0.13)`);
        gf.addColorStop(0.35, `rgba(${f.color}, 0.06)`);
        gf.addColorStop(1,    `rgba(${f.color}, 0)`);
        cx.fillStyle = gf;
        cx.fillRect(0, 0, w, h);
      }

      for (const p of particles) {
        // Pulse radius
        p.pulsePhase += p.pulseSpeed;
        p.radius = p.baseRadius * (1 + Math.sin(p.pulsePhase) * p.pulseAmp);

        if (p.type === 'orb') {
          drawOrb(cx, p, p.x);
        } else {
          drawSpark(cx, p, p.x);
        }

        // Vertical rise
        p.y -= p.speed;

        // Horizontal drift with slow random acceleration
        p.vxAccel += (Math.random() - 0.5) * 0.006;
        p.vxAccel = Math.max(-0.06, Math.min(0.06, p.vxAccel)); // clamp accel
        p.vx += p.vxAccel;
        const maxVx = p.type === 'spark' ? 1.6 : 0.8;
        p.vx = Math.max(-maxVx, Math.min(maxVx, p.vx));         // clamp velocity
        p.x += p.vx;

        // Wrap horizontally with a margin
        const margin = p.type === 'orb' ? p.radius : p.radius * 7;
        if (p.x > w + margin) p.x = -margin;
        else if (p.x < -margin) p.x = w + margin;

        if (p.y + (p.type === 'orb' ? p.radius : p.radius * 7) < 0) {
          const reset = p.type === 'orb' ? makeOrb(w, h) : makeSpark(w, h);
          Object.assign(p, reset);
        }
      }

      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);

    function onResize() {
      w = c.offsetWidth;
      h = c.offsetHeight;
      c.width = w;
      c.height = h;
    }

    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.heroBokeh} aria-hidden="true" />;
}
