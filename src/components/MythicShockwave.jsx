import React, { useEffect, useRef } from 'react';

export default function MythicShockwave({ active, tier, cardName, onComplete }) {
  const canvasRef = useRef(null);

  // Canvas particle engine for rising golden embers and fiery sparks
  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Generate 65 embers
    const isMythic = tier === 5;
    const emberColors = isMythic
      ? ['#ffd700', '#ffea75', '#ff9900', '#fff3a8', '#00f0ff']
      : ['#ff4466', '#ff8844', '#ffd700', '#ff2255'];

    const particles = Array.from({ length: 65 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1.5;
      const startX = canvas.width / 2 + (Math.random() - 0.5) * 300;
      const startY = canvas.height / 2 + (Math.random() - 0.5) * 350;

      return {
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed * 0.8 + (Math.random() - 0.5) * 1.5,
        vy: -Math.abs(Math.sin(angle) * speed) - Math.random() * 2.5 - 1.2, // always drift upwards
        size: Math.random() * 3.5 + 1.5,
        color: emberColors[Math.floor(Math.random() * emberColors.length)],
        alpha: Math.random() * 0.7 + 0.3,
        fadeSpeed: Math.random() * 0.007 + 0.004,
        wobble: Math.random() * 10,
        wobbleSpeed: Math.random() * 0.04 + 0.02
      };
    });

    let startTime = Date.now();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.vx + Math.sin(p.wobble) * 0.8;
        p.y += p.vy;
        p.wobble += p.wobbleSpeed;
        p.alpha -= p.fadeSpeed;

        if (p.alpha > 0) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.shadowBlur = 12;
          ctx.shadowColor = p.color;
          ctx.fill();
          ctx.restore();
        }
      });

      // Keep animation running for 3 seconds then signal complete
      if (Date.now() - startTime < 3200) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        if (onComplete) onComplete();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [active, tier, onComplete]);

  if (!active) return null;

  const isMythic = tier === 5;
  const ringColor = isMythic
    ? 'border-amber-400 shadow-[0_0_60px_rgba(255,215,0,0.9)]'
    : 'border-rose-500 shadow-[0_0_60px_rgba(255,0,85,0.85)]';

  const glowColor = isMythic
    ? 'rgba(255, 215, 0, 0.45)'
    : 'rgba(255, 0, 85, 0.45)';

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden flex items-center justify-center">
      {/* 1. Golden / Crimson Screen Edge Lightning Flash */}
      <div 
        className="absolute inset-0 animate-lightning-flash"
        style={{
          boxShadow: `inset 0 0 100px 20px ${glowColor}, inset 0 0 40px ${glowColor}`
        }}
      />

      {/* 2. Expanding Dual Shockwave Rings */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[700px] rounded-[60px] border-4 ${ringColor} animate-shockwave-1`}
      />
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[750px] rounded-[60px] border-2 ${ringColor} animate-shockwave-2`}
      />

      {/* 3. Golden Sparks & Rising Embers Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* 4. Dramatic Top Herald Alert Ribbon */}
      <div className="absolute top-14 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-1 animate-bounce">
        <div
          className={`px-5 py-2 rounded-full border text-xs sm:text-sm font-mono font-black tracking-widest uppercase flex items-center space-x-2 shadow-2xl backdrop-blur-xl ${
            isMythic
              ? 'bg-amber-950/90 border-amber-400 text-amber-200 shadow-[0_0_35px_rgba(255,215,0,0.6)]'
              : 'bg-rose-950/90 border-rose-500 text-rose-200 shadow-[0_0_35px_rgba(244,63,94,0.6)]'
          }`}
        >
          <span className="animate-spin text-base">⚡</span>
          <span>
            {isMythic ? 'MYTHIC CARD UNLOCKED • +300 PTS' : 'LEGENDARY POWERHOUSE • +200 PTS'}
          </span>
          <span className="animate-spin text-base">⚡</span>
        </div>
      </div>
    </div>
  );
}
