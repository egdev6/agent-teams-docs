import React, { useEffect, useRef } from 'react';

type Ring = {
  x: number;
  y: number;
  r: number;
  maxR: number;
  speed: number;
  lineWidth: number;
};

type TrailPoint = {
  x: number;
  y: number;
  age: number;
};

export default function MousePulse() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const c = canvas;
    const cx = ctx;

    // Skip mouse effects entirely on touch/mobile — no pointer to track
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    c.width = window.innerWidth;
    c.height = window.innerHeight;

    let animId: number;
    const rings: Ring[] = [];
    const trail: TrailPoint[] = [];
    const TRAIL_MAX = 14;
    const TRAIL_DECAY = 0.085;

    function emitPulse(x: number, y: number) {
      const defs = [
        { startR: 4,  maxR: 18, speed: 0.38, lw: 1.5 },
        { startR: 9,  maxR: 28, speed: 0.52, lw: 1.0 },
      ];
      for (const d of defs) {
        rings.push({ x, y, r: d.startR, maxR: d.maxR, speed: d.speed, lineWidth: d.lw });
      }
    }

    function draw() {
      cx.clearRect(0, 0, c.width, c.height);

      for (let i = trail.length - 1; i >= 0; i--) {
        trail[i].age += TRAIL_DECAY;
        if (trail[i].age >= 1) trail.splice(i, 1);
      }

      if (trail.length > 1) {
        // Glow pass (wide, soft, low opacity) drawn first
        cx.save();
        for (let i = 1; i < trail.length; i++) {
          const prev = trail[i - 1];
          const curr = trail[i];
          const t = 1 - curr.age;
          const glowAlpha = Math.max(0, t * 0.18);
          const glowWidth  = Math.max(1, t * 10);
          cx.beginPath();
          cx.moveTo(prev.x, prev.y);
          cx.lineTo(curr.x, curr.y);
          cx.strokeStyle = `rgba(255, 20, 55, ${glowAlpha})`;
          cx.lineWidth = glowWidth;
          cx.lineCap = 'round';
          cx.stroke();
        }
        // Sharp core line on top
        for (let i = 1; i < trail.length; i++) {
          const prev = trail[i - 1];
          const curr = trail[i];
          const t = 1 - curr.age;
          const alpha = Math.max(0, t * 0.55);
          const width  = Math.max(0.4, t * 1.8);
          cx.beginPath();
          cx.moveTo(prev.x, prev.y);
          cx.lineTo(curr.x, curr.y);
          cx.strokeStyle = `rgba(255, 120, 130, ${alpha})`;
          cx.lineWidth = width;
          cx.lineCap = 'round';
          cx.stroke();
        }
        cx.restore();

        // Bright glow dot at head
        const head = trail[0];
        const headT = 1 - head.age;
        const headGlow = cx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 10);
        headGlow.addColorStop(0,   `rgba(255, 180, 180, ${headT * 0.90})`);
        headGlow.addColorStop(0.4, `rgba(255,  40,  70, ${headT * 0.55})`);
        headGlow.addColorStop(1,   'rgba(255, 0, 40, 0)');
        cx.beginPath();
        cx.arc(head.x, head.y, 10, 0, Math.PI * 2);
        cx.fillStyle = headGlow;
        cx.fill();
      }

      for (let i = rings.length - 1; i >= 0; i--) {
        const ring = rings[i];
        const progress = (ring.r - ring.maxR * 0.13) / (ring.maxR * 0.87);
        const alpha = Math.max(0, (1 - progress) * 0.65);
        cx.beginPath();
        cx.arc(ring.x, ring.y, ring.r, 0, Math.PI * 2);
        cx.strokeStyle = `rgba(255, 20, 55, ${alpha})`;
        cx.lineWidth = ring.lineWidth;
        cx.stroke();
        ring.r += ring.speed;
        if (ring.r >= ring.maxR) rings.splice(i, 1);
      }

      animId = requestAnimationFrame(draw);
    }

    function onMouseMove(e: MouseEvent) {
      trail.unshift({ x: e.clientX, y: e.clientY, age: 0 });
      if (trail.length > TRAIL_MAX) trail.length = TRAIL_MAX;
    }

    function onMouseLeave() {
      trail.length = 0;
    }

    function onClick(e: MouseEvent) {
      emitPulse(e.clientX, e.clientY);
    }

    function onResize() {
      c.width = window.innerWidth;
      c.height = window.innerHeight;
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('click', onClick);
    window.addEventListener('resize', onResize);
    draw();

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }}
      aria-hidden="true"
    />
  );
}
