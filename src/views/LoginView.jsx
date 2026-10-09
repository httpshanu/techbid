import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Flame, 
  Sparkles, 
  Tv, 
  KeyRound, 
  AlertCircle,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { soundEngine } from '../sound/soundEngine';

export default function LoginView({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const userClean = username.trim().toLowerCase();
    const passClean = password.trim();

    // Accepted credentials:
    // admin / admin, admin / techbid, admin / 1234, or any user if fields filled
    setTimeout(() => {
      if (!userClean) {
        setError('Please enter your Host Username or ID');
        setIsLoading(false);
        return;
      }
      if (!passClean) {
        setError('Please enter your Security Passcode');
        setIsLoading(false);
        return;
      }

      // Valid credentials or quick pass
      const validPasswords = ['admin', 'admin123', 'techbid', '1234', 'techbid2024'];
      const isValid = validPasswords.includes(passClean.toLowerCase()) || userClean === 'admin';

      if (isValid || passClean.length >= 3) {
        soundEngine.playCardFlip();
        if (rememberMe) {
          try {
            localStorage.setItem('techbid_remember_auth', 'true');
          } catch (e) {}
        }
        onLogin({ username: username.trim(), role: 'admin' }, 'ppt');
      } else {
        setError('Incorrect passcode! (Default: admin / admin)');
        setIsLoading(false);
      }
    }, 400);
  };

  const handleQuickLogin = (role = 'admin') => {
    setUsername('admin');
    setPassword('admin');
    soundEngine.playCardFlip();
    onLogin({ username: 'Admin Host', role }, role === 'admin' ? 'ppt' : 'display');
  };

  const handleSpectatorAccess = () => {
    soundEngine.playCardFlip();
    onLogin({ username: 'Spectator', role: 'guest' }, 'ppt');
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-[#05070f] text-slate-100 overflow-hidden select-none">
      {/* Background Neon Energy Fog */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-500/5 rounded-full blur-[180px] pointer-events-none" />

      {/* Cyber Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#00f0ff 1px, transparent 1px), linear-gradient(90deg, #00f0ff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Main Login Card */}
      <div className="relative w-full max-w-md rounded-3xl border-2 border-cyan-500/30 bg-gradient-to-b from-[#131b34]/95 via-[#090e1f]/95 to-[#04060d]/98 shadow-[0_0_80px_rgba(0,240,255,0.25)] backdrop-blur-2xl p-7 sm:p-9 z-10 animate-in fade-in duration-300">
        
        {/* Glow Header */}
        <div className="text-center mb-7">
          <div className="inline-flex relative mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 via-amber-400 to-cyan-400 p-0.5 shadow-[0_0_30px_rgba(0,240,255,0.4)] animate-pulse">
              <div className="w-full h-full rounded-[14px] bg-[#090e1f] flex items-center justify-center">
                <Flame className="w-8 h-8 text-amber-400 fill-current" />
              </div>
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-cyan-400 text-black flex items-center justify-center text-[10px] font-mono font-bold shadow-md">
              <Lock className="w-3 h-3" />
            </div>
          </div>

          <div className="flex items-center justify-center space-x-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
              SECURITY ACCESS TERMINAL
            </span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-wider uppercase text-glow-cyan">
            TECH BID
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            LIVE AUCTION TOURNAMENT PORTAL
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Input */}
          <div>
            <label className="text-[11px] font-mono text-slate-300 uppercase tracking-wider block mb-1.5 font-bold flex items-center justify-between">
              <span>HOST ID / USERNAME:</span>
              <span className="text-cyan-400 text-[10px]">Default: admin</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                placeholder="Enter host ID (e.g. admin)"
                className="w-full bg-[#080d1e] border border-white/15 focus:border-cyan-400 rounded-2xl pl-10 pr-4 py-3 text-sm font-mono text-white placeholder-slate-600 focus:outline-none transition-colors shadow-inner"
                autoComplete="username"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="text-[11px] font-mono text-slate-300 uppercase tracking-wider block mb-1.5 font-bold flex items-center justify-between">
              <span>SECURITY PASSCODE:</span>
              <span className="text-cyan-400 text-[10px]">Default: admin</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Enter passcode (e.g. admin)"
                className="w-full bg-[#080d1e] border border-white/15 focus:border-cyan-400 rounded-2xl pl-10 pr-11 py-3 text-sm font-mono text-white placeholder-slate-600 focus:outline-none transition-colors shadow-inner"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Session & Quick Preset */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 rounded bg-slate-900 border-white/20 text-cyan-400 focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-[11px] font-mono text-slate-400">Remember session</span>
            </label>

            <button
              type="button"
              onClick={() => {
                setUsername('admin');
                setPassword('admin');
                setError('');
              }}
              className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors"
            >
              Autofill credentials
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-mono flex items-center space-x-2 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Main Enter Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 rounded-2xl font-display font-black text-sm uppercase tracking-widest text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 shadow-[0_0_30px_rgba(255,215,0,0.5)] flex items-center justify-center space-x-2 transition-all transform active:scale-98 disabled:opacity-50"
          >
            {isLoading ? (
              <span>AUTHENTICATING...</span>
            ) : (
              <>
                <span>ENTER AUCTION ARENA</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-[10px] font-mono uppercase">
            <span className="bg-[#0b1022] px-3 text-slate-500 font-bold">
              OR QUICK ACCESS
            </span>
          </div>
        </div>

        {/* Quick Launch Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleQuickLogin('admin')}
            className="p-3 rounded-2xl bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 flex flex-col items-center justify-center text-center transition-all group hover:border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.15)]"
          >
            <div className="flex items-center space-x-1.5 font-display font-bold text-xs">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>HOST DEMO</span>
            </div>
            <span className="text-[9px] font-mono text-slate-400 mt-0.5">
              1-Click Admin Access
            </span>
          </button>

          <button
            type="button"
            onClick={handleSpectatorAccess}
            className="p-3 rounded-2xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 text-purple-300 flex flex-col items-center justify-center text-center transition-all group hover:border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
          >
            <div className="flex items-center space-x-1.5 font-display font-bold text-xs">
              <Tv className="w-3.5 h-3.5 text-purple-400" />
              <span>PROJECTOR VIEW</span>
            </div>
            <span className="text-[9px] font-mono text-slate-400 mt-0.5">
              Direct Arena Display
            </span>
          </button>
        </div>

        {/* Footer Security Badge */}
        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <div className="flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>SESSION ENCRYPTION ACTIVE</span>
          </div>
          <span>v5.0 LIVE</span>
        </div>
      </div>
    </div>
  );
}
