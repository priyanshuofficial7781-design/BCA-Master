import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { getTodayString } from '../../data/initialData';
import { soundController } from '../../utils/sound';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Volume2,
  VolumeX,
  Sparkles,
  Flame,
  CheckCircle2,
  BookOpen,
  Timer,
  Coffee,
  Brain,
  ShieldCheck,
  Zap,
  Sliders,
  Headphones,
  CloudRain,
  Radio,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type PresetMode = 'work_25' | 'work_50' | 'work_90' | 'work_120' | 'short_break' | 'long_break' | 'custom';

interface PresetConfig {
  name: string;
  minutes: number;
  type: 'work' | 'break';
  icon: React.ReactNode;
  subtitle: string;
  ringColor: string;
}

const PRESET_CONFIG: Record<PresetMode, PresetConfig> = {
  work_25: {
    name: '25m Sprint',
    minutes: 25,
    type: 'work',
    icon: <Brain className="w-3.5 h-3.5" />,
    subtitle: 'Classic Pomodoro focus',
    ringColor: '#A970FF',
  },
  work_50: {
    name: '50m Double',
    minutes: 50,
    type: 'work',
    icon: <Zap className="w-3.5 h-3.5" />,
    subtitle: 'Extended problem solving',
    ringColor: '#8B5CF6',
  },
  work_90: {
    name: '90m Exam Block',
    minutes: 90,
    type: 'work',
    icon: <Sparkles className="w-3.5 h-3.5" />,
    subtitle: 'BCA University Exam simulation',
    ringColor: '#657BFF',
  },
  work_120: {
    name: '120m Marathon',
    minutes: 120,
    type: 'work',
    icon: <Flame className="w-3.5 h-3.5" />,
    subtitle: 'Full coding contest & lab hackathon',
    ringColor: '#EC4899',
  },
  short_break: {
    name: '5m Refresh',
    minutes: 5,
    type: 'break',
    icon: <Coffee className="w-3.5 h-3.5" />,
    subtitle: 'Rest & hydration',
    ringColor: '#10B981',
  },
  long_break: {
    name: '15m Rest',
    minutes: 15,
    type: 'break',
    icon: <Coffee className="w-3.5 h-3.5" />,
    subtitle: 'Walk and reboot',
    ringColor: '#38BDF8',
  },
  custom: {
    name: 'Custom',
    minutes: 45,
    type: 'work',
    icon: <Sliders className="w-3.5 h-3.5" />,
    subtitle: 'User defined minutes',
    ringColor: '#F59E0B',
  },
};

export const PomodoroFocusView: React.FC = () => {
  const { data, logPomodoroSession, todayPomodoroMinutes } = useApp();

  const [preset, setPreset] = useState<PresetMode>('work_90');
  const [customMinutes, setCustomMinutes] = useState<number>(45);
  const [timeLeft, setTimeLeft] = useState<number>(90 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [ambientSound, setAmbientSound] = useState<'none' | 'binaural' | 'rain'>('none');
  const [ambientVolume, setAmbientVolume] = useState<number>(0.4);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('sub-cpp-dsa');
  const [sessionNotes, setSessionNotes] = useState<string>('90m BCA Algorithm & Data Structures Sprint');
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  const currentDurationMinutes = preset === 'custom' ? customMinutes : PRESET_CONFIG[preset].minutes;
  const initialSeconds = currentDurationMinutes * 60;
  const progressPercent = Math.min(100, Math.max(0, ((initialSeconds - timeLeft) / initialSeconds) * 100));

  const timerRef = useRef<number | null>(null);

  // Switch presets
  const handleSelectPreset = (newPreset: PresetMode) => {
    setIsRunning(false);
    setPreset(newPreset);
    const mins = newPreset === 'custom' ? customMinutes : PRESET_CONFIG[newPreset].minutes;
    setTimeLeft(mins * 60);
  };

  const handleCustomMinuteChange = (mins: number) => {
    const clamped = Math.max(1, Math.min(240, mins));
    setCustomMinutes(clamped);
    if (preset === 'custom') {
      setIsRunning(false);
      setTimeLeft(clamped * 60);
    }
  };

  // Ambient sound management
  const handleToggleAmbient = (type: 'binaural' | 'rain') => {
    if (ambientSound === type) {
      soundController.stopAmbient();
      setAmbientSound('none');
    } else {
      if (type === 'binaural') {
        soundController.startAmbientBinaural(ambientVolume);
      } else {
        soundController.startAmbientRain(ambientVolume);
      }
      setAmbientSound(type);
    }
  };

  const handleVolumeChange = (vol: number) => {
    setAmbientVolume(vol);
    soundController.setAmbientVolume(vol);
  };

  // Timer Tick
  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleCompleteSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, preset, customMinutes, selectedSubjectId]);

  // Clean up sound on unmount
  useEffect(() => {
    return () => {
      soundController.stopAmbient();
    };
  }, []);

  const handleCompleteSession = () => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);

    if (soundEnabled) {
      if (PRESET_CONFIG[preset].type === 'work') {
        soundController.playFocusCompleteChime();
      } else {
        soundController.playBreakCompleteBell();
      }
    }

    if (PRESET_CONFIG[preset].type === 'work') {
      logPomodoroSession({
        date: getTodayString(0),
        durationMinutes: currentDurationMinutes,
        mode: 'work',
        subjectId: selectedSubjectId,
        completedAt: new Date().toISOString(),
      });
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 5000);
    }

    // Auto-prompt appropriate break
    if (PRESET_CONFIG[preset].type === 'work') {
      if (currentDurationMinutes >= 90) {
        handleSelectPreset('long_break');
      } else {
        handleSelectPreset('short_break');
      }
    } else {
      handleSelectPreset('work_25');
    }
  };

  const handleToggleTimer = () => {
    if (!isRunning && soundEnabled) {
      soundController.playStartTap();
    }
    setIsRunning(!isRunning);
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    setTimeLeft(currentDurationMinutes * 60);
  };

  const handleSkip = () => {
    handleCompleteSession();
  };

  // Format hours, minutes, seconds
  const totalHrs = Math.floor(timeLeft / 3600);
  const remainingMins = Math.floor((timeLeft % 3600) / 60);
  const remainingSecs = timeLeft % 60;

  const formattedTime =
    totalHrs > 0
      ? `${String(totalHrs).padStart(2, '0')}:${String(remainingMins).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`
      : `${String(remainingMins).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;

  const todaySessions = (data.pomodoroSessions || []).filter(
    (s) => s.date === getTodayString(0) && s.mode === 'work'
  );

  // SVG Ring calculations
  const ringSize = 270;
  const strokeWidth = 14;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-400">
              <Timer className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-white">Focus Marathon Engine</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-500/15 text-violet-300 border border-violet-500/30">
              90m & 120m Blocks
            </span>
          </div>
          <p className="text-sm text-[#9F9AB0] mt-1">
            Build elite coding endurance with calibrated 25m, 50m, 90m exam blocks, and 120m hackathon marathons.
          </p>
        </div>

        {/* Chime & Ambient Quick Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              if (next) soundController.playStartTap();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
              soundEnabled
                ? 'bg-violet-500/15 border-violet-500/30 text-violet-300 shadow-[0_0_12px_rgba(169,112,255,0.2)]'
                : 'bg-[#161424] border-white/5 text-[#8A8599]'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{soundEnabled ? 'Chimes Active' : 'Chimes Muted'}</span>
          </button>

          <button
            onClick={() => soundController.playFocusCompleteChime()}
            className="px-2.5 py-1.5 rounded-xl text-xs font-medium bg-[#161424] hover:bg-[#201C33] border border-white/10 text-[#BBB5CA] transition-colors"
          >
            Test Chime
          </button>
        </div>
      </div>

      {/* Main Glassmorphic Timer Card */}
      <div className="relative rounded-3xl bg-[#13111C]/85 border border-purple-500/25 backdrop-blur-xl p-6 sm:p-8 shadow-[0_8px_36px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Ambient Top Radiant Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-32 bg-gradient-to-b from-violet-600/20 to-transparent blur-3xl pointer-events-none" />

        {/* Marathon Presets Bar */}
        <div className="space-y-2 mb-8">
          <div className="flex items-center justify-between text-xs text-[#8E8A9E] px-1 font-medium">
            <span>Select Focus Duration:</span>
            <span className="text-violet-300 font-semibold">{PRESET_CONFIG[preset].subtitle}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {(['work_25', 'work_50', 'work_90', 'work_120', 'short_break', 'long_break', 'custom'] as PresetMode[]).map(
              (p) => {
                const active = preset === p;
                const isWork = PRESET_CONFIG[p].type === 'work';
                return (
                  <button
                    key={p}
                    onClick={() => handleSelectPreset(p)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all text-center ${
                      active
                        ? isWork
                          ? 'bg-gradient-to-b from-violet-600 to-indigo-600 border-violet-400/50 text-white shadow-[0_0_18px_rgba(139,92,246,0.55)] scale-[1.02]'
                          : 'bg-gradient-to-b from-emerald-600 to-teal-600 border-emerald-400/50 text-white shadow-[0_0_18px_rgba(16,185,129,0.55)] scale-[1.02]'
                        : 'bg-[#0E0D17] border-white/5 text-[#9691A5] hover:text-white hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center gap-1 text-xs font-bold">
                      {PRESET_CONFIG[p].icon}
                      <span>{PRESET_CONFIG[p].name}</span>
                    </div>
                    <span className="text-[10px] opacity-75 mt-0.5">
                      {p === 'custom' ? `${customMinutes}m` : `${PRESET_CONFIG[p].minutes} mins`}
                    </span>
                  </button>
                );
              }
            )}
          </div>

          {/* Custom Minute Dial if Custom selected */}
          {preset === 'custom' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="pt-2 flex items-center justify-center gap-3 p-3 rounded-2xl bg-[#0A0912] border border-amber-500/30"
            >
              <label className="text-xs font-semibold text-amber-300">Set Custom Minutes (1-240):</label>
              <input
                type="number"
                min="1"
                max="240"
                value={customMinutes}
                onChange={(e) => handleCustomMinuteChange(Number(e.target.value))}
                className="w-20 px-2.5 py-1 rounded-xl bg-[#171524] border border-white/10 text-white text-sm font-bold font-mono text-center focus:outline-none focus:border-amber-400"
              />
              <span className="text-xs text-[#8E8A9E]">mins</span>
            </motion.div>
          )}
        </div>

        {/* Central Timer Display with Spring Animated SVG Ring */}
        <div className="flex flex-col items-center justify-center my-2">
          <div className="relative flex items-center justify-center" style={{ width: ringSize, height: ringSize }}>
            <svg width={ringSize} height={ringSize} className="transform -rotate-90">
              <defs>
                <linearGradient id="marathonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#A970FF" />
                  <stop offset="50%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
                <filter id="marathonGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow
                    dx="0"
                    dy="0"
                    stdDeviation="7"
                    floodColor={PRESET_CONFIG[preset].ringColor}
                    floodOpacity="0.75"
                  />
                </filter>
              </defs>

              {/* Background Track */}
              <circle
                cx={ringSize / 2}
                cy={ringSize / 2}
                r={radius}
                stroke="#171523"
                strokeWidth={strokeWidth}
                fill="transparent"
              />

              {/* Glowing Dynamic Stroke */}
              <motion.circle
                cx={ringSize / 2}
                cy={ringSize / 2}
                r={radius}
                stroke="url(#marathonGradient)"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                filter="url(#marathonGlow)"
                className="transition-all duration-300"
              />
            </svg>

            {/* Time readout in center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
              <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white font-mono tabular-nums drop-shadow-[0_0_24px_rgba(169,112,255,0.45)]">
                {formattedTime}
              </span>
              <span className="text-xs uppercase tracking-widest font-semibold text-violet-300/80 mt-1 flex items-center gap-1.5">
                {isRunning ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                    <span>Focusing Active</span>
                  </>
                ) : (
                  <span>Ready to Begin</span>
                )}
              </span>
            </div>
          </div>

          {/* Interactive Controls Bar */}
          <div className="flex items-center gap-4 mt-8">
            <button
              onClick={handleResetTimer}
              className="p-3.5 rounded-2xl bg-[#171524] hover:bg-[#201C33] border border-white/10 text-[#9F9AB0] hover:text-white transition-all active:scale-95 shadow-sm"
              title="Reset Timer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={handleToggleTimer}
              className={`flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-base transition-all transform active:scale-95 shadow-lg ${
                isRunning
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:bg-amber-500/30'
                  : 'bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white border border-violet-400/30 shadow-[0_0_24px_rgba(139,92,246,0.6)] hover:brightness-110'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5 fill-current" />
                  <span>Pause Timer</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                  <span>Start {currentDurationMinutes}m Focus</span>
                </>
              )}
            </button>

            <button
              onClick={handleSkip}
              className="p-3.5 rounded-2xl bg-[#171524] hover:bg-[#201C33] border border-white/10 text-[#9F9AB0] hover:text-white transition-all active:scale-95 shadow-sm"
              title="Skip / Finish Early"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Ambient Soundscapes Synthesizer Panel */}
        <div className="mt-8 pt-6 border-t border-purple-500/10 rounded-2xl bg-[#0D0C15] p-4 border border-white/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Headphones className="w-4 h-4 text-violet-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Synthesized Focus Soundscapes
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
                Web Audio
              </span>
            </div>

            {/* Volume slider */}
            {ambientSound !== 'none' && (
              <div className="flex items-center gap-2 text-xs text-[#8E8A9E]">
                <span>Vol:</span>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={ambientVolume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  className="w-24 accent-violet-500"
                />
                <span className="font-mono text-white text-[11px]">{Math.round(ambientVolume * 100)}%</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <button
              onClick={() => handleToggleAmbient('binaural')}
              className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                ambientSound === 'binaural'
                  ? 'bg-violet-950/40 border-violet-500/40 text-violet-200 shadow-[0_0_15px_rgba(169,112,255,0.25)]'
                  : 'bg-[#141220] border-white/5 text-[#8E8A9E] hover:text-white hover:border-white/10'
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  ambientSound === 'binaural' ? 'bg-violet-500/20 text-violet-300' : 'bg-white/5'
                }`}
              >
                <Radio className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <span>432Hz Alpha Binaural Drone</span>
                  {ambientSound === 'binaural' && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </div>
                <div className="text-[11px] text-[#8E8A9E]">Theta brainwave entrainment for deep code focus</div>
              </div>
            </button>

            <button
              onClick={() => handleToggleAmbient('rain')}
              className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                ambientSound === 'rain'
                  ? 'bg-blue-950/40 border-blue-500/40 text-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.25)]'
                  : 'bg-[#141220] border-white/5 text-[#8E8A9E] hover:text-white hover:border-white/10'
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  ambientSound === 'rain' ? 'bg-blue-500/20 text-blue-300' : 'bg-white/5'
                }`}
              >
                <CloudRain className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <span>Lo-Fi Soft Pink Rainfall</span>
                  {ambientSound === 'rain' && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </div>
                <div className="text-[11px] text-[#8E8A9E]">Masks background noise and room distractions</div>
              </div>
            </button>
          </div>
        </div>

        {/* Linked Subject / Task Drawer */}
        <div className="mt-4 pt-4 border-t border-purple-500/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-[#8C879B] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-violet-400" />
              <span>Link to BCA Subject</span>
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full bg-[#0E0D17] border border-purple-500/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
            >
              {data.subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name} ({sub.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#8C879B] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Session Target / Goal</span>
            </label>
            <input
              type="text"
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              placeholder="e.g. Master Tree Inorder Traversal"
              className="w-full bg-[#0E0D17] border border-purple-500/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors placeholder:text-white/20"
            />
          </div>
        </div>
      </div>

      {/* Celebration Notification Toast */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-violet-950/80 border border-emerald-500/40 text-emerald-200 flex items-center justify-between shadow-[0_0_24px_rgba(16,185,129,0.3)]"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Focus Marathon Completed! 🎉</h4>
                <p className="text-xs text-emerald-300/80">
                  {currentDurationMinutes} minutes recorded to today's study progress. Great stamina!
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Today's Focus Metrics (starts from 0 baseline and increases!) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#13111C]/80 border border-purple-500/15 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#9590A6] font-medium">Focus Time Today</span>
            <span className="p-1.5 rounded-lg bg-violet-500/10 text-violet-400">
              <Timer className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-white tracking-tight">
            {todayPomodoroMinutes} <span className="text-sm font-normal text-[#8E8A9E]">mins</span>
          </div>
          <p className="text-xs text-purple-300/70 mt-1">
            Builds continuously as you study today
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#13111C]/80 border border-purple-500/15 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#9590A6] font-medium">Completed Sprints</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-white tracking-tight">
            {todaySessions.length} <span className="text-sm font-normal text-[#8E8A9E]">sessions</span>
          </div>
          <p className="text-xs text-emerald-400/70 mt-1">
            Target: 180 min total deep work daily
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#13111C]/80 border border-purple-500/15 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#9590A6] font-medium">Endurance Multiplier</span>
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Flame className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-white tracking-tight">
            {currentDurationMinutes >= 90 ? '2.0x' : '1.0x'}{' '}
            <span className="text-sm font-normal text-[#8E8A9E]">XP rate</span>
          </div>
          <p className="text-xs text-amber-300/70 mt-1">
            90m & 120m marathons award double bonus XP
          </p>
        </div>
      </div>
    </div>
  );
};
