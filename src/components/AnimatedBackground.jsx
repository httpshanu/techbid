import React, { useEffect, useRef } from 'react';

/**
 * Cinematic Animated Cyber Command Background
 * Features:
 * 1. Flowing light packets/pulses along heavy fiber optic cables
 * 2. 60 FPS floating cyber particle motes on canvas
 * 3. Asynchronously flickering server rack blade LEDs
 * 4. Ambient neon breathing auras
 */
export default function AnimatedBackground() {
  const canvasRef = useRef(null);

  // Floating Cyber Particles Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Generate 45 floating ambient digital particles
    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.8,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.5 - 0.2, // Drifting upwards
      alpha: Math.random() * 0.6 + 0.2,
      color: Math.random() > 0.6 ? '#00f0ff' : Math.random() > 0.3 ? '#ff9900' : '#b026ff'
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around screen
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
      {/* Dynamic Ambient Breathing Glow Behind Center */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-r from-amber-500/10 via-cyan-500/15 to-purple-500/10 rounded-full blur-[160px] animate-pulse" style={{ animationDuration: '6s' }} />

      {/* ======================================================== */}
      {/* LEFT SERVER RACK CLUSTER WITH DYNAMIC BLINKING LEDS      */}
      {/* ======================================================== */}
      <div className="absolute top-0 bottom-0 left-0 w-72 md:w-88 opacity-50 hidden sm:block bg-gradient-to-r from-[#060913] via-[#04060e] to-transparent p-4 border-r border-cyan-500/10">
        <div className="h-full flex flex-col justify-between">
          {/* Top Server Unit */}
          <div className="p-3 rounded-xl bg-black/60 border border-cyan-500/20 backdrop-blur-md">
            <div className="flex justify-between items-center text-cyan-400 font-mono text-[9px] mb-1.5 font-bold">
              <span>MAINFRAME // RACK-01</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </div>
            <div className="grid grid-cols-8 gap-1.5 py-1">
              {[...Array(16)].map((_, i) => (
                <span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full ${
                    i % 3 === 0
                      ? 'bg-emerald-400 animate-pulse'
                      : i % 4 === 0
                      ? 'bg-amber-400 animate-ping'
                      : 'bg-cyan-400'
                  }`}
                  style={{ animationDuration: `${1.2 + (i % 5) * 0.4}s` }}
                />
              ))}
            </div>
          </div>

          {/* Blade Server Stack with Active Lights */}
          <div className="space-y-1.5 my-auto">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="h-5 bg-slate-900/90 rounded border border-slate-800/80 flex items-center justify-between px-2.5 shadow-inner"
              >
                <div className="flex items-center space-x-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"
                    style={{ animationDuration: `${0.8 + (i % 4) * 0.3}s` }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"
                    style={{ animationDuration: `${1.5 + (i % 3) * 0.5}s` }}
                  />
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${i % 2 === 0 ? 'bg-amber-400' : 'bg-slate-700'} animate-ping`}
                    style={{ animationDuration: '2.5s' }}
                  />
                </div>
                <span className="font-mono text-[7px] text-slate-500">BLADE_{i + 1}</span>
              </div>
            ))}
          </div>

          {/* Live Data Stream Log */}
          <div className="p-2.5 rounded-xl bg-black/70 border border-white/5 font-mono text-[8px] text-cyan-400/80 leading-relaxed">
            <div className="text-[7px] text-slate-500 uppercase tracking-widest mb-1">DATA STREAM</div>
            <p className="animate-pulse">
              &gt; FLOW: 104.2 GB/s<br/>
              &gt; CRYPTO_SYNC: TRUE<br/>
              &gt; 75_SLABS_INDEXED
            </p>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* RIGHT SERVER RACK CLUSTER WITH BLINKING LEDS             */}
      {/* ======================================================== */}
      <div className="absolute top-0 bottom-0 right-0 w-72 md:w-88 opacity-50 hidden sm:block bg-gradient-to-l from-[#060913] via-[#04060e] to-transparent p-4 border-l border-cyan-500/10">
        <div className="h-full flex flex-col justify-between">
          <div className="p-3 rounded-xl bg-black/60 border border-purple-500/20 backdrop-blur-md">
            <div className="flex justify-between items-center text-purple-400 font-mono text-[9px] mb-1 font-bold">
              <span>AUXILIARY // CLUSTER</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            </div>
            <div className="grid grid-cols-8 gap-1.5 py-1">
              {[...Array(16)].map((_, i) => (
                <span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full ${
                    i % 2 === 0 ? 'bg-cyan-400 animate-pulse' : 'bg-purple-400'
                  }`}
                  style={{ animationDuration: `${0.9 + (i % 3) * 0.4}s` }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-1.5 my-auto">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="h-5 bg-slate-900/90 rounded border border-slate-800/80 flex items-center justify-between px-2.5 shadow-inner"
              >
                <span className="font-mono text-[7px] text-slate-500">NODE_{i + 10}</span>
                <div className="flex items-center space-x-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"
                    style={{ animationDuration: `${1.1 + (i % 3) * 0.3}s` }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"
                    style={{ animationDuration: `${1.4 + (i % 4) * 0.2}s` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-2.5 rounded-xl bg-black/70 border border-white/5 font-mono text-[8px] text-amber-400/80 leading-relaxed">
            <div className="text-[7px] text-slate-500 uppercase tracking-widest mb-1">PACKET ROUTER</div>
            <p className="animate-pulse">
              &gt; STATUS: NOMINAL<br/>
              &gt; 0% DROPPED<br/>
              &gt; PROJ_STREAM: 4K 60FPS
            </p>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* FLOWING FIBER OPTIC DATA CABLES (LIGHT STREAM ANIMATIONS) */}
      {/* ======================================================== */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
        <defs>
          {/* Animated Glow Pulses */}
          <linearGradient id="amberPulse" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff5500" stopOpacity="0" />
            <stop offset="50%" stopColor="#ffd700" stopOpacity="1" />
            <stop offset="100%" stopColor="#ff8800" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="cyanPulse" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0066ff" stopOpacity="0" />
            <stop offset="50%" stopColor="#00f0ff" stopOpacity="1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          <filter id="cableGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Heavy Upper Left Cables */}
        <path d="M-80,60 Q300,140 540,240" stroke="#090e1c" strokeWidth="18" fill="none" />
        <path d="M-80,60 Q300,140 540,240" stroke="#ff8800" strokeWidth="3" strokeDasharray="30 180" fill="none" className="animate-pulse" filter="url(#cableGlow)">
          <animate attributeName="stroke-dashoffset" from="400" to="0" dur="4s" repeatCount="indefinite" />
        </path>

        <path d="M-80,110 Q350,190 600,270" stroke="#060914" strokeWidth="22" fill="none" />
        <path d="M-80,110 Q350,190 600,270" stroke="#00f0ff" strokeWidth="3" strokeDasharray="40 220" fill="none" className="animate-pulse" filter="url(#cableGlow)">
          <animate attributeName="stroke-dashoffset" from="0" to="-500" dur="5s" repeatCount="indefinite" />
        </path>

        {/* Heavy Upper Right Cables */}
        <path d="M2000,60 Q1620,140 1380,240" stroke="#090e1c" strokeWidth="18" fill="none" />
        <path d="M2000,60 Q1620,140 1380,240" stroke="#ffd700" strokeWidth="3" strokeDasharray="30 180" fill="none" className="animate-pulse" filter="url(#cableGlow)">
          <animate attributeName="stroke-dashoffset" from="0" to="400" dur="4.5s" repeatCount="indefinite" />
        </path>

        <path d="M2000,110 Q1570,190 1320,270" stroke="#060914" strokeWidth="22" fill="none" />
        <path d="M2000,110 Q1570,190 1320,270" stroke="#00f0ff" strokeWidth="3" strokeDasharray="40 220" fill="none" className="animate-pulse" filter="url(#cableGlow)">
          <animate attributeName="stroke-dashoffset" from="-500" to="0" dur="5.5s" repeatCount="indefinite" />
        </path>

        {/* Lower Deck Flowing Cables */}
        <path d="M-100,880 Q450,780 750,860" stroke="#080c18" strokeWidth="20" fill="none" />
        <path d="M-100,880 Q450,780 750,860" stroke="#ff7700" strokeWidth="2" strokeDasharray="30 200" fill="none">
          <animate attributeName="stroke-dashoffset" from="0" to="-400" dur="6s" repeatCount="indefinite" />
        </path>

        <path d="M2050,880 Q1450,780 1150,860" stroke="#080c18" strokeWidth="20" fill="none" />
        <path d="M2050,880 Q1450,780 1150,860" stroke="#00f0ff" strokeWidth="2" strokeDasharray="30 200" fill="none">
          <animate attributeName="stroke-dashoffset" from="400" to="0" dur="6s" repeatCount="indefinite" />
        </path>
      </svg>

      {/* Floating Canvas Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Bottom Command Bridge Deck Silhouette */}
      <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#020306] via-[#050811]/90 to-transparent border-t border-cyan-500/10 pointer-events-none" />
    </div>
  );
}
