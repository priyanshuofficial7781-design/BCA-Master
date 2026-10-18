import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Plus,
  Bell,
  Flame,
  Volume2,
  VolumeX,
  FileText,
  Binary,
  Sun,
  Moon,
  LogOut,
  LogIn,
  Sparkles,
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { soundEffects } from '../../services/soundEffects';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenAddTask: () => void;
  onOpenNotifications: () => void;
  onOpenBadges?: () => void;
  onOpenResume?: () => void;
  onOpenDsaVisualizer?: () => void;
  onReturnToWelcome?: () => void;
  onOpenAIChat?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  onOpenAddTask,
  onOpenNotifications,
  onOpenBadges,
  onOpenResume,
  onOpenDsaVisualizer,
  onReturnToWelcome,
  onOpenAIChat,
}) => {
  const { data, streakDays, userLevel, theme, toggleTheme, currentUser, signInWithGoogle, signOutUser } = useApp();
  const [isAudioOn, setIsAudioOn] = useState(() => soundEffects.isEnabled());

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleToggleAudio = () => {
    const newState = soundEffects.toggle();
    setIsAudioOn(newState);
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#070512]/95 backdrop-blur-xl border-b border-[#B46CFF]/20 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2 shadow-[0_4px_25px_rgba(0,0,0,0.6)]">
      {/* Top Hairline Neon Glow */}
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[#B46CFF]/40 to-transparent pointer-events-none" />

      {/* Left: Avatar + Greeting + Name clickable to return to Splash screen */}
      <button
        type="button"
        onClick={() => {
          soundEffects.playClick();
          onReturnToWelcome?.();
        }}
        className="flex items-center gap-2 sm:gap-2.5 text-left hover:opacity-95 transition-all cursor-pointer group min-w-0 max-w-[42%] sm:max-w-xs shrink"
        title="Return to Welcome / Splash Screen"
      >
        <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-gradient-to-tr from-[#8B3DFF] via-[#B46CFF] to-[#00F0FF] p-0.5 shadow-[0_0_15px_rgba(139,61,255,0.4)] shrink-0 group-hover:scale-105 transition-transform">
          <div className="w-full h-full rounded-[14px] bg-[#0E0C1C] flex items-center justify-center text-xs sm:text-sm font-black text-white uppercase">
            {data.profile.name.charAt(0) || 'C'}
          </div>
          <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#8B3DFF] border-2 border-[#070512] flex items-center justify-center text-[8px] sm:text-[9px] font-black text-white shadow-sm">
            {userLevel}
          </span>
        </div>

        <div className="min-w-0 truncate">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] sm:text-[11px] text-[#AAA9C6] font-medium truncate inline leading-tight">
              {getGreeting()}
            </span>
            <span className="px-1.5 py-0.5 rounded-md bg-[#8B3DFF]/20 border border-[#B46CFF]/35 text-[9px] sm:text-[10px] font-black text-[#B46CFF] shrink-0">
              Sem {data.profile.semester}
            </span>
          </div>
          <h1 className="text-sm sm:text-base font-black tracking-tight bg-gradient-to-r from-white via-[#B46CFF] to-[#00F0FF] bg-clip-text text-transparent truncate max-w-[120px] sm:max-w-[180px] md:max-w-xs">
            {data.profile.name || 'Student'}
          </h1>
        </div>
      </button>

      {/* Right Controls: cleanly scaled to prevent overlapping */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 justify-end">
        {/* AI Help Shortcut - Gemini & ChatGPT */}
        {onOpenAIChat && (
          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              onOpenAIChat();
            }}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-900/60 to-purple-800/40 hover:from-purple-800 hover:to-purple-700 border border-[#B46CFF]/45 text-white text-xs font-bold transition-all shadow-[0_0_12px_rgba(139,61,255,0.25)] cursor-pointer"
            title="Ask AI: Google Gemini 3.8 Flash & ChatGPT-4o Coding Coach"
          >
            <Sparkles size={13} className="text-[#00F0FF] animate-pulse" />
            <span className="hidden sm:inline">Ask AI</span>
            <span className="sm:hidden">AI</span>
          </button>
        )}

        {/* DSA Visualizer Shortcut - Desktop only */}
        {onOpenDsaVisualizer && (
          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              onOpenDsaVisualizer();
            }}
            className="hidden xl:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#14112B] hover:bg-[#1E1940] border border-[#00FF9D]/30 text-[#00FF9D] text-xs font-bold transition-all shadow-[0_0_10px_rgba(0,255,157,0.15)] cursor-pointer"
            title="Open Interactive DSA Code Runner & Visualizer"
          >
            <Binary size={13} />
            <span>DSA Visualizer</span>
          </button>
        )}

        {/* Resume & Dossier Shortcut - Large screens only */}
        {onOpenResume && (
          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              onOpenResume();
            }}
            className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#14112B] hover:bg-[#1E1940] border border-[#00F0FF]/30 text-[#00F0FF] text-xs font-bold transition-all shadow-[0_0_10px_rgba(0,240,255,0.15)] cursor-pointer"
            title="Open Resume & Academic Dossier Export"
          >
            <FileText size={13} />
            <span>Resume PDF</span>
          </button>
        )}

        {/* Cyberpunk Audio Master Toggle - Tablet/Desktop */}
        <button
          type="button"
          onClick={handleToggleAudio}
          className={`hidden sm:flex w-8 h-8 rounded-xl border items-center justify-center transition-all cursor-pointer ${
            isAudioOn
              ? 'bg-[#181335] border-[#B46CFF]/40 text-[#00F0FF] shadow-[0_0_10px_rgba(0,240,255,0.25)]'
              : 'bg-[#12101F] border-white/10 text-gray-500'
          }`}
          title={isAudioOn ? 'Sound Effects Enabled (Click to Mute)' : 'Sound Effects Muted (Click to Enable)'}
        >
          {isAudioOn ? <Volume2 size={15} /> : <VolumeX size={15} />}
        </button>

        {/* Day / High Contrast Light Mode Master Toggle */}
        <button
          type="button"
          onClick={() => {
            soundEffects.playClick();
            toggleTheme();
          }}
          className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
            theme === 'light'
              ? 'bg-amber-500/15 border-amber-500/40 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.25)]'
              : 'bg-[#181335] border-[#B46CFF]/40 text-[#00F0FF] shadow-[0_0_10px_rgba(0,240,255,0.25)]'
          }`}
          title={theme === 'light' ? 'High Contrast Light Mode Active' : 'Cyberpunk Dark Mode Active'}
          aria-label="Toggle display theme"
        >
          {theme === 'light' ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-[#00F0FF]" />}
        </button>

        {/* PWA In-App Install Prompt - Desktop/Tablet */}
        <div className="hidden md:block">
          <PWAInstallButton variant="header" />
        </div>

        {/* Streak Flame Badge */}
        <div
          title={`${streakDays} Days Consistent Study`}
          className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-gradient-to-r from-[#181335] to-[#100E22] border border-amber-500/35 text-xs font-bold text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)] shrink-0"
        >
          <Flame size={13} className="fill-amber-400 text-amber-400 animate-pulse" />
          <span className="tabular-nums font-mono text-xs">{streakDays}d<span className="hidden xl:inline"> Streak</span></span>
        </div>

        {/* Google Authentication Control */}
        {currentUser && !currentUser.isAnonymous ? (
          <div className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-xl bg-[#14112B] border border-emerald-500/35 text-xs font-medium text-white shadow-[0_0_12px_rgba(16,185,129,0.2)] shrink-0 max-w-[120px]">
            {currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={currentUser.displayName || 'Google User'}
                className="w-5 h-5 rounded-full border border-emerald-400 object-cover shrink-0"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-black flex items-center justify-center text-[10px] shrink-0">
                {currentUser.displayName?.charAt(0) || 'G'}
              </div>
            )}
            <span className="hidden md:inline max-w-[65px] truncate text-[11px] font-bold text-emerald-300">
              {currentUser.displayName?.split(' ')[0] || 'User'}
            </span>
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                signOutUser();
              }}
              title="Sign out of Google"
              className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut size={12} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={async () => {
              soundEffects.playClick();
              try {
                await signInWithGoogle();
              } catch (e) {
                console.warn('Google sign-in cancelled or failed', e);
              }
            }}
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-[0_0_12px_rgba(255,255,255,0.25)] transition-all active:scale-95 cursor-pointer shrink-0"
            title="Sign in with your Google account"
          >
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
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
            <span className="hidden lg:inline text-xs">Sign In</span>
          </button>
        )}

        {/* Quick Add Task button (Hidden on small screens where bottom nav has center Add button) */}
        <button
          onClick={() => {
            soundEffects.playClick();
            onOpenAddTask();
          }}
          className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-[#8B3DFF] to-[#4D79FF] hover:opacity-90 text-white text-xs font-bold shadow-[0_0_18px_rgba(139,61,255,0.45)] transition-all active:scale-95 border border-white/20 cursor-pointer shrink-0"
          aria-label="Add new study task"
        >
          <Plus size={14} strokeWidth={2.5} />
          <span>Add Task</span>
        </button>

        {/* Study Reminders Bell with indicator */}
        <button
          onClick={() => {
            soundEffects.playClick();
            onOpenNotifications();
          }}
          className="w-8 h-8 rounded-xl bg-[#14112B] hover:bg-[#1E1940] border border-[#B46CFF]/25 flex items-center justify-center text-[#AAA9C6] hover:text-white transition-colors relative cursor-pointer shrink-0 shadow-inner"
          aria-label="Notifications"
        >
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00FF9D] shadow-[0_0_8px_#00FF9D]" />
        </button>

        {/* Settings button */}
        <button
          onClick={() => {
            soundEffects.playClick();
            onOpenSettings();
          }}
          className="w-8 h-8 rounded-xl bg-[#14112B] hover:bg-[#1E1940] border border-[#B46CFF]/25 flex items-center justify-center text-[#AAA9C6] hover:text-white transition-colors cursor-pointer shrink-0 shadow-inner"
          aria-label="Settings"
        >
          <Settings size={15} />
        </button>
      </div>
    </header>
  );
};
