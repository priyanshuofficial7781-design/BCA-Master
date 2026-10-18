import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, RotateCcw, Sparkles, GraduationCap, Compass, BookOpen, Trophy, User, LogOut, CheckCircle2 } from 'lucide-react';
import { soundEffects } from '../../services/soundEffects';

interface SplashScreenProps {
  onGetStarted: () => void;
  onContinue: () => void;
  onResetProfile: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onGetStarted,
  onContinue,
  onResetProfile,
}) => {
  const { data, currentUser, signInWithGoogle, signInGuest, signOutUser } = useApp();
  const isReturningUser = Boolean(data.profile.onboardingCompleted);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between items-center bg-[#06050C] text-[#F7F5FF] overflow-hidden px-4 py-8 select-none">
      {/* Volumetric background lights and ambient glow */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-b from-[#8B3DFF]/30 via-[#00F0FF]/15 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-gradient-to-t from-[#B46CFF]/25 via-[#8B3DFF]/15 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-[-10%] w-[350px] h-[350px] rounded-full bg-[#4D79FF]/10 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/4 right-[-10%] w-[350px] h-[350px] rounded-full bg-[#E45BFF]/10 blur-[100px] pointer-events-none" />

      {/* Subtle background tech grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#8B3DFF 1px, transparent 1px), linear-gradient(to right, #8B3DFF 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Header Tag / Institutional Seal */}
      <div className="relative z-10 flex items-center gap-2 pt-2 animate-fadeIn">
        <div className="px-3.5 py-1.5 rounded-full bg-[#15162B]/80 border border-[#8B3DFF]/30 backdrop-blur-md flex items-center gap-2 shadow-[0_0_15px_rgba(139,61,255,0.25)]">
          <GraduationCap size={15} className="text-[#B46CFF]" />
          <span className="text-xs font-semibold tracking-wider uppercase text-[#AAA9C6]">
            Bachelor of Computer Applications
          </span>
        </div>
      </div>

      {/* Center 3D-inspired Layered Illustration & Brand Area */}
      <div className="relative z-10 w-full max-w-lg flex flex-col items-center text-center my-auto py-6">
        {/* Layered 3D Vector & CSS Illustration */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 mb-6 flex items-center justify-center animate-float">
          {/* Orbital glowing halo */}
          <div className="absolute inset-0 rounded-full border border-[#B46CFF]/35 shadow-[0_0_40px_rgba(139,61,255,0.35)] animate-pulse" />
          <div className="absolute inset-4 rounded-full border border-dashed border-[#00F0FF]/40 rotate-45" />

          {/* Floating Orbit Knowledge Badges */}
          <div className="absolute top-2 -left-4 sm:left-0 px-2.5 py-1.5 rounded-xl bg-[#15162B]/90 border border-[#8B3DFF]/40 shadow-[0_4px_20px_rgba(139,61,255,0.35)] backdrop-blur-md flex items-center gap-1.5 animate-bounce [animation-duration:3.5s]">
            <span className="w-2 h-2 rounded-full bg-[#55E6B0] shadow-[0_0_8px_#55E6B0]" />
            <span className="text-[11px] font-bold text-white tracking-wide">C++ / DSA</span>
          </div>

          <div className="absolute bottom-6 -right-3 sm:right-0 px-2.5 py-1.5 rounded-xl bg-[#15162B]/90 border border-[#4D79FF]/40 shadow-[0_4px_20px_rgba(77,121,255,0.35)] backdrop-blur-md flex items-center gap-1.5 animate-bounce [animation-duration:4s]">
            <Trophy size={12} className="text-[#E45BFF]" />
            <span className="text-[11px] font-bold text-white tracking-wide">10.0 CGPA</span>
          </div>

          <div className="absolute -bottom-2 left-6 px-2.5 py-1.5 rounded-xl bg-[#15162B]/90 border border-[#B46CFF]/40 shadow-[0_4px_20px_rgba(180,108,255,0.35)] backdrop-blur-md flex items-center gap-1.5 animate-bounce [animation-duration:4.5s]">
            <Sparkles size={12} className="text-[#55E6B0]" />
            <span className="text-[11px] font-bold text-white tracking-wide">Projects & Placement</span>
          </div>

          {/* SVG 3D Isometric Stacked Books and Graduation Cap */}
          <svg
            viewBox="0 0 280 280"
            className="w-56 h-56 sm:w-64 sm:h-64 filter drop-shadow-[0_20px_35px_rgba(139,61,255,0.45)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Gradients for 3D Books and Cap */}
              <linearGradient id="gradBook1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4D79FF" />
                <stop offset="100%" stopColor="#1E2A78" />
              </linearGradient>
              <linearGradient id="gradBook2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B3DFF" />
                <stop offset="100%" stopColor="#431282" />
              </linearGradient>
              <linearGradient id="gradBook3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#B46CFF" />
                <stop offset="100%" stopColor="#5E16A8" />
              </linearGradient>
              <linearGradient id="gradPages" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#E2E0EE" />
                <stop offset="50%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#C4C1D9" />
              </linearGradient>
              <linearGradient id="gradGoldPages" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FBD38D" />
                <stop offset="100%" stopColor="#ECC94B" />
              </linearGradient>
              <linearGradient id="gradCapTop" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2A1B54" />
                <stop offset="50%" stopColor="#1D153B" />
                <stop offset="100%" stopColor="#110B24" />
              </linearGradient>
              <linearGradient id="gradTassel" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFE066" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
              <radialGradient id="capGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#8B3DFF" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#8B3DFF" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Ambient ground shadow beneath books */}
            <ellipse cx="140" cy="245" rx="90" ry="18" fill="#000000" fillOpacity="0.65" />
            <ellipse cx="140" cy="240" rx="75" ry="14" fill="#8B3DFF" fillOpacity="0.25" filter="blur(8px)" />

            {/* BOOK 3 (Bottom - Foundation & Mathematics) */}
            {/* Spine */}
            <path d="M 45 210 Q 50 205 60 205 L 205 205 Q 215 205 220 210 L 220 228 Q 215 233 205 233 L 60 233 Q 50 233 45 228 Z" fill="url(#gradBook1)" />
            {/* Pages edge */}
            <path d="M 220 210 L 235 200 L 235 218 L 220 228 Z" fill="url(#gradPages)" />
            <path d="M 60 205 L 75 195 L 235 200 L 220 210 Z" fill="#2E3875" />
            {/* Embossed math mark */}
            <text x="130" y="224" fill="#55E6B0" fontSize="12" fontWeight="bold" fontFamily="monospace">Σ MATH & OS</text>

            {/* BOOK 2 (Middle - Algorithms & Core CS) */}
            {/* Spine */}
            <path d="M 55 175 Q 60 170 70 170 L 200 170 Q 210 170 215 175 L 215 194 Q 210 199 200 199 L 70 199 Q 60 199 55 194 Z" fill="url(#gradBook2)" />
            {/* Pages edge */}
            <path d="M 215 175 L 228 165 L 228 184 L 215 194 Z" fill="url(#gradGoldPages)" />
            <path d="M 70 170 L 83 160 L 228 165 L 215 175 Z" fill="#511994" />
            {/* Code symbol */}
            <text x="125" y="189" fill="#B46CFF" fontSize="12" fontWeight="bold" fontFamily="monospace">&lt; C++ / DSA &gt;</text>

            {/* BOOK 1 (Top - Web, AI & Cloud) */}
            {/* Spine */}
            <path d="M 65 140 Q 70 135 80 135 L 190 135 Q 200 135 205 140 L 205 160 Q 200 165 190 165 L 80 165 Q 70 165 65 160 Z" fill="url(#gradBook3)" />
            {/* Pages edge */}
            <path d="M 205 140 L 218 130 L 218 150 L 205 160 Z" fill="url(#gradPages)" />
            <path d="M 80 135 L 93 125 L 218 130 L 205 140 Z" fill="#7C22DB" />
            {/* Insignia */}
            <text x="120" y="154" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="monospace">&#123; FULL STACK &#125;</text>

            {/* GRADUATION CAP (Layered 3D Mortarboard) */}
            {/* Skull Cap Base */}
            <path d="M 105 110 Q 140 128 175 110 L 172 125 Q 140 145 108 125 Z" fill="#120B24" />
            <path d="M 108 125 Q 140 145 172 125 L 172 128 Q 140 148 108 128 Z" fill="#4D79FF" />

            {/* Diamond Mortarboard Top with Sheen */}
            {/* Under-shadow */}
            <polygon points="140,58 238,98 140,138 42,98" fill="#0A0617" />
            {/* Edge thickness */}
            <polygon points="42,98 140,138 140,143 42,103" fill="#311F5E" />
            <polygon points="140,138 238,98 238,103 140,143" fill="#1D123D" />
            {/* Main Diamond Surface */}
            <polygon points="140,55 238,95 140,135 42,95" fill="url(#gradCapTop)" stroke="#8B3DFF" strokeWidth="1.5" strokeOpacity="0.6" />

            {/* Specular sheen line on cap */}
            <line x1="60" y1="91" x2="135" y2="60" stroke="#B46CFF" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />

            {/* Center Cap Button */}
            <ellipse cx="140" cy="95" rx="6" ry="3.5" fill="url(#gradTassel)" />

            {/* Golden Tassel & Band */}
            <path
              d="M 140 95 Q 170 100 185 115 Q 192 125 194 142"
              fill="none"
              stroke="url(#gradTassel)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Tassel fringe */}
            <path
              d="M 191 142 L 198 142 L 200 162 L 189 162 Z"
              fill="url(#gradTassel)"
            />
            <line x1="194" y1="162" x2="194" y2="168" stroke="#FFE066" strokeWidth="2" strokeLinecap="round" />
            <line x1="191" y1="162" x2="190" y2="167" stroke="#FFE066" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="197" y1="162" x2="198" y2="167" stroke="#FFE066" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* App Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 text-white">
          BCA{' '}
          <span className="bg-gradient-to-r from-[#B46CFF] via-[#8B3DFF] to-[#4D79FF] bg-clip-text text-transparent">
            Career Planner
          </span>
        </h1>

        {/* Tagline */}
        <p className="text-sm sm:text-base font-semibold tracking-wider text-[#B46CFF] mb-2 uppercase">
          Plan • Learn • Build • Grow
        </p>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-[#AAA9C6] max-w-sm mx-auto leading-relaxed mb-8">
          Your complete learning and career companion for your BCA journey.
        </p>

        {/* Interactive Action Controls */}
        <div className="w-full max-w-sm space-y-3">
          {/* Authenticated User Banner if already signed in with Google */}
          {currentUser && !currentUser.isAnonymous && (
            <div className="p-3 rounded-2xl bg-[#141226] border border-emerald-500/35 flex items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-2.5 min-w-0">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'Google Account'}
                    className="w-8 h-8 rounded-full border border-emerald-400 object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center text-xs shrink-0">
                    {currentUser.displayName?.charAt(0) || 'G'}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white truncate">
                    <span>{currentUser.displayName || 'Google User'}</span>
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                  </div>
                  <p className="text-[10px] text-[#AAA9C6] truncate font-mono">
                    {currentUser.email || 'Cloud Synced'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  signOutUser();
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
                title="Switch or Sign Out"
              >
                <LogOut size={14} />
              </button>
            </div>
          )}

          {authError && (
            <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/35 text-rose-300 text-xs text-center">
              {authError}
            </div>
          )}

          {/* Primary Action Button */}
          {isReturningUser ? (
            <button
              type="button"
              onClick={onContinue}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#8B3DFF] via-[#A855F7] to-[#4D79FF] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-[0_0_30px_rgba(139,61,255,0.45)] hover:shadow-[0_0_40px_rgba(139,61,255,0.65)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border border-white/20"
            >
              <span>Continue to Dashboard</span>
              <ArrowRight size={18} strokeWidth={2.5} />
            </button>
          ) : (
            <button
              type="button"
              onClick={onGetStarted}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#8B3DFF] via-[#A855F7] to-[#4D79FF] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-[0_0_30px_rgba(139,61,255,0.45)] hover:shadow-[0_0_40px_rgba(139,61,255,0.65)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border border-white/20"
            >
              <span>Get Started (3-Step Setup)</span>
              <ArrowRight size={18} strokeWidth={2.5} />
            </button>
          )}

          {/* Google Sign-In CTA (if not already authenticated with Google) */}
          {(!currentUser || currentUser.isAnonymous) && (
            <button
              type="button"
              disabled={authLoading}
              onClick={async () => {
                soundEffects.playClick();
                setAuthLoading(true);
                setAuthError(null);
                try {
                  await signInWithGoogle();
                  soundEffects.playLevelUp();
                  if (isReturningUser) {
                    onContinue();
                  } else {
                    onGetStarted();
                  }
                } catch (e: any) {
                  if (e?.code !== 'auth/popup-closed-by-user') {
                    setAuthError(e?.message || 'Google Sign-In was cancelled or failed.');
                  }
                } finally {
                  setAuthLoading(false);
                }
              }}
              className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{authLoading ? 'Signing in with Google...' : 'Sign In with Google'}</span>
            </button>
          )}

          {/* Guest Mode & Offline Action */}
          <div className="flex items-center justify-between text-xs pt-1">
            <button
              type="button"
              onClick={async () => {
                soundEffects.playClick();
                try {
                  await signInGuest();
                } catch (e) {
                  // offline guest ok
                }
                if (isReturningUser) {
                  onContinue();
                } else {
                  onGetStarted();
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs text-[#AAA9C6] hover:text-white transition-colors py-1 px-2 rounded-lg hover:bg-[#15162B]"
            >
              <User size={12} />
              <span>Continue as Guest</span>
            </button>

            {isReturningUser && (
              <button
                type="button"
                onClick={onResetProfile}
                className="inline-flex items-center gap-1.5 text-xs text-[#AAA9C6] hover:text-[#E45BFF] transition-colors py-1 px-2 rounded-lg hover:bg-[#15162B]"
              >
                <RotateCcw size={12} />
                <span>Reset Profile</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer Notice */}
      <footer className="relative z-10 text-center pt-4">
        <p className="text-[11px] text-[#AAA9C6]/80 font-medium tracking-wide">
          Your journey starts here • 3-Year BCA Success Blueprint
        </p>
      </footer>
    </div>
  );
};
