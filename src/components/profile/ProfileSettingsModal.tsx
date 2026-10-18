import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import {
  User,
  Download,
  Upload,
  RotateCcw,
  Check,
  AlertCircle,
  Shield,
  ShieldCheck,
  Clock,
  Sparkles,
  Wifi,
  Smartphone,
  RefreshCw,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Eye,
  LogOut,
  Code2,
} from 'lucide-react';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { soundEffects } from '../../services/soundEffects';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRevisitOnboarding?: () => void;
  onReturnToWelcome?: () => void;
}

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
  isOpen,
  onClose,
  onRevisitOnboarding,
  onReturnToWelcome,
}) => {
  const {
    data,
    theme,
    toggleTheme,
    updateProfile,
    exportDataJSON,
    importDataJSON,
    resetToDefaults,
    resetTodayProgressToZero,
    currentUser,
    signInWithGoogle,
    signInGuest,
    signOutUser,
  } = useApp();

  const [name, setName] = useState(data.profile.name);
  const [semester, setSemester] = useState(data.profile.semester);
  const [college, setCollege] = useState(data.profile.college);
  const [targetRole, setTargetRole] = useState(data.profile.targetRole);
  const [dailyHours, setDailyHours] = useState(data.profile.dailyStudyTargetHours);
  const [weeklyHours, setWeeklyHours] = useState(data.profile.weeklyStudyTargetHours);
  const [primaryTrack, setPrimaryTrack] = useState(data.profile.primaryTrack);
  const [reducedMotion, setReducedMotion] = useState(data.profile.reducedMotion);

  // LeetCode & GitHub states
  const [leetcodeHandle, setLeetcodeHandle] = useState(data.profile.leetcodeHandle || 'bca_coder_pro');
  const [leetcodeSolved, setLeetcodeSolved] = useState(data.profile.leetcodeStats?.totalSolved ?? 148);
  const [githubHandle, setGithubHandle] = useState(data.profile.githubHandle || 'bca-student-dev');
  const [githubRepos, setGithubRepos] = useState(data.profile.githubStats?.repoCount ?? 16);

  const [importStatus, setImportStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [backupDownloaded, setBackupDownloaded] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(() => soundEffects.isEnabled());

  const {
    isOnline,
    isSyncing,
    syncState,
    pendingCount,
    lastSyncTime,
    triggerManualSync,
    isServiceWorkerSupported,
    isBackgroundSyncSupported,
  } = useOnlineStatus();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim(),
      semester: Number(semester) as any,
      college: college.trim(),
      targetRole: targetRole.trim(),
      dailyStudyTargetHours: Number(dailyHours),
      weeklyStudyTargetHours: Number(weeklyHours),
      primaryTrack,
      reducedMotion,
      leetcodeHandle: leetcodeHandle.trim(),
      leetcodeStats: {
        ...(data.profile.leetcodeStats || {
          username: leetcodeHandle.trim(),
          ranking: 142580,
          totalSolved: 148,
          easySolved: 82,
          mediumSolved: 54,
          hardSolved: 12,
          streakDays: 14,
          contestRating: 1640,
        }),
        username: leetcodeHandle.trim(),
        totalSolved: Number(leetcodeSolved),
      },
      githubHandle: githubHandle.trim(),
      githubStats: {
        ...(data.profile.githubStats || {
          username: githubHandle.trim(),
          repoCount: 16,
          starCount: 28,
          commitStreakDays: 19,
          topRepoName: 'fullstack-bca-capstone',
          topRepoUrl: 'https://github.com',
          profileUrl: 'https://github.com',
        }),
        username: githubHandle.trim(),
        repoCount: Number(githubRepos),
      },
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importDataJSON(content);
      if (res.success) {
        setImportStatus({ success: true, message: 'Data backup restored successfully!' });
      } else {
        setImportStatus({ success: false, message: res.error || 'Failed to import JSON file.' });
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmReset = () => {
    resetToDefaults();
    setShowResetConfirm(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Profile, Goals & Data Storage"
      subtitle="Configure your BCA student profile, daily goals, and JSON backup"
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Google Authentication & Cloud Sync Card */}
        <div className="p-4 rounded-2xl bg-[#141126] border border-purple-500/25 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
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
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <span>Google Account Authentication</span>
                  {currentUser && !currentUser.isAnonymous ? (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                      SYNCED
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono">
                      GUEST MODE
                    </span>
                  )}
                </h4>
                <p className="text-[11px] text-[#AAA9C6] mt-0.5">
                  {currentUser && !currentUser.isAnonymous
                    ? `Authenticated as ${currentUser.email || currentUser.displayName}`
                    : 'Sign in with Google to synchronize your goals and developer stats across devices.'}
                </p>
              </div>
            </div>

            {currentUser && !currentUser.isAnonymous ? (
              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  signOutUser();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-all cursor-pointer self-start sm:self-center"
              >
                <LogOut size={13} />
                <span>Sign Out</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={async () => {
                  soundEffects.playClick();
                  try {
                    await signInWithGoogle();
                  } catch (e) {
                    console.warn(e);
                  }
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold shadow-md transition-all cursor-pointer self-start sm:self-center"
              >
                <span>Sign In with Google</span>
              </button>
            )}
          </div>
        </div>

        {/* Student Profile Form */}
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#AAA5B6] mb-1">
                Student Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#1A1629] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#AAA5B6] mb-1">
                Current Semester
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value) as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#1A1629] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400"
              >
                <option value={1}>Semester 1 (1st Year)</option>
                <option value={2}>Semester 2 (1st Year)</option>
                <option value={3}>Semester 3 (2nd Year)</option>
                <option value={4}>Semester 4 (2nd Year)</option>
                <option value={5}>Semester 5 (3rd Year)</option>
                <option value={6}>Semester 6 (3rd Year)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#AAA5B6] mb-1">
                College / University
              </label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#1A1629] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#AAA5B6] mb-1">
                Target Role
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. SDE, AI Engineer, Cyber Analyst"
                className="w-full px-3 py-2 rounded-xl bg-[#1A1629] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#AAA5B6] mb-1">
                Daily Study Target (hrs)
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                max="16"
                value={dailyHours}
                onChange={(e) => setDailyHours(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#1A1629] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#AAA5B6] mb-1">
                Weekly Target (hrs)
              </label>
              <input
                type="number"
                step="1"
                min="5"
                max="80"
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#1A1629] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#AAA5B6] mb-1">
                Specialization Track
              </label>
              <select
                value={primaryTrack}
                onChange={(e) => setPrimaryTrack(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#1A1629] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400"
              >
                <option value="swe">DSA & Software Eng</option>
                <option value="aiml">AI & Machine Learning</option>
                <option value="cyber">Cybersecurity Defense</option>
                <option value="fullstack">Web & Fullstack</option>
              </select>
            </div>
          </div>

          {/* Developer Profiles: LeetCode & GitHub */}
          <div className="pt-3 border-t border-purple-500/20 space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Code2 size={14} className="text-[#00F0FF]" />
              <span>Developer Portfolios (LeetCode & GitHub)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#AAA5B6] mb-1">
                  LeetCode Username
                </label>
                <input
                  type="text"
                  value={leetcodeHandle}
                  onChange={(e) => setLeetcodeHandle(e.target.value)}
                  placeholder="e.g. bca_coder_pro"
                  className="w-full px-3 py-2 rounded-xl bg-[#1A1629] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-[#FFA116]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#AAA5B6] mb-1">
                  LeetCode Solved Count
                </label>
                <input
                  type="number"
                  min="0"
                  value={leetcodeSolved}
                  onChange={(e) => setLeetcodeSolved(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#1A1629] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-[#FFA116] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#AAA5B6] mb-1">
                  GitHub Username
                </label>
                <input
                  type="text"
                  value={githubHandle}
                  onChange={(e) => setGithubHandle(e.target.value)}
                  placeholder="e.g. bca-student-dev"
                  className="w-full px-3 py-2 rounded-xl bg-[#1A1629] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#AAA5B6] mb-1">
                  GitHub Public Repos
                </label>
                <input
                  type="number"
                  min="0"
                  value={githubRepos}
                  onChange={(e) => setGithubRepos(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#1A1629] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-[#00F0FF] font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {savedSuccess ? (
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <Check size={14} /> Profile updated successfully!
              </span>
            ) : <div />}

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-sm"
            >
              Update Profile
            </button>
          </div>
        </form>

        {/* Visual Theme & Daytime Sunlight Contrast Toggle */}
        <div className="p-4 rounded-3xl bg-[#13111C] border border-[#B46CFF]/30 space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-[#8B3DFF]/20 text-[#00F0FF] border border-[#B46CFF]/30 shadow-[0_0_12px_rgba(139,61,255,0.3)]">
                {theme === 'light' ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-[#00F0FF]" />}
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span>Display Theme & Readability</span>
                  <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-[9px] font-mono text-[#00F0FF] font-bold">
                    DAY/NIGHT
                  </span>
                </h4>
              </div>
            </div>

            {/* Quick 1-click Toggle Button */}
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                toggleTheme();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                theme === 'light'
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                  : 'bg-[#8B3DFF]/25 border-[#B46CFF]/40 text-[#00F0FF] shadow-[0_0_12px_rgba(0,240,255,0.25)]'
              }`}
            >
              {theme === 'light' ? (
                <>
                  <Sun size={13} className="text-amber-400" />
                  <span>Light Mode Active</span>
                </>
              ) : (
                <>
                  <Moon size={13} className="text-[#00F0FF]" />
                  <span>Cyberpunk Active</span>
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-[#AAA5B6] leading-relaxed">
            Switch between the dark <strong className="text-white">Cyberpunk</strong> neon obsidian glass aesthetic and <strong className="text-white">High Contrast Light</strong> mode for daytime and outdoor readability under bright sunlight.
          </p>

          {/* Interactive 2-Card Mode Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Card 1: Cyberpunk Theme */}
            <button
              type="button"
              onClick={() => {
                if (theme !== 'cyberpunk') {
                  soundEffects.playClick();
                  updateProfile({ theme: 'cyberpunk' });
                }
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between gap-2 ${
                theme !== 'light'
                  ? 'bg-gradient-to-br from-[#1B1638] to-[#0F0D24] border-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.3)] ring-1 ring-[#00F0FF]'
                  : 'bg-white border-purple-200/80 hover:border-purple-300 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${theme === 'light' ? 'bg-purple-100 border border-purple-200 text-purple-700' : 'bg-[#8B3DFF]/25 border border-[#B46CFF]/40 text-[#00F0FF]'}`}>
                    <Moon size={16} />
                  </div>
                  <div>
                    <span className={`text-xs font-bold block ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Cyberpunk Obsidian</span>
                    <span className={`text-[10px] font-medium ${theme === 'light' ? 'text-purple-600' : 'text-[#00F0FF]'}`}>Dark Mode</span>
                  </div>
                </div>
                {theme !== 'light' && (
                  <span className="w-5 h-5 rounded-full bg-[#00F0FF] text-[#06050C] flex items-center justify-center text-[10px] font-black">
                    ✓
                  </span>
                )}
              </div>
              <p className={`text-[11px] ${theme === 'light' ? 'text-slate-600' : 'text-[#AAA5B6]'}`}>
                Volumetric dark glass, deep space violet gradients, and specular neon lighting.
              </p>
            </button>

            {/* Card 2: High Contrast Light Mode */}
            <button
              type="button"
              onClick={() => {
                if (theme !== 'light') {
                  soundEffects.playClick();
                  updateProfile({ theme: 'light' });
                }
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between gap-2 ${
                theme === 'light'
                  ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.25)] ring-1 ring-amber-400'
                  : 'bg-[#181528] border-white/10 hover:border-white/20 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                    <Sun size={16} />
                  </div>
                  <div>
                    <span className={`text-xs font-bold block ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>High Contrast Light</span>
                    <span className="text-[10px] text-amber-500 font-medium">Daytime Sunlight Mode</span>
                  </div>
                </div>
                {theme === 'light' && (
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-black">
                    ✓
                  </span>
                )}
              </div>
              <p className={`text-[11px] ${theme === 'light' ? 'text-slate-600' : 'text-[#AAA5B6]'}`}>
                Crisp daytime sunlight readability, deep black typography, and high contrast edges.
              </p>
            </button>
          </div>
        </div>

        {/* Cyberpunk Web Audio Feedback Section */}
        <div className="p-4 rounded-3xl bg-[#13111C] border border-[#B46CFF]/30 space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-lg bg-[#8B3DFF]/20 text-[#00F0FF]">
                {audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Cyberpunk Web Audio Feedback
              </h4>
            </div>
            <button
              type="button"
              onClick={() => {
                const nextState = soundEffects.toggle();
                setAudioEnabled(nextState);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                audioEnabled
                  ? 'bg-[#8B3DFF]/30 border-[#B46CFF]/50 text-[#00F0FF] shadow-[0_0_10px_rgba(0,240,255,0.25)]'
                  : 'bg-[#181528] border-white/10 text-gray-400'
              }`}
            >
              {audioEnabled ? 'Sound Enabled' : 'Muted'}
            </button>
          </div>

          <p className="text-xs text-[#AAA5B6] leading-relaxed">
            High-tech audio chimes synthesized purely in your browser for task checkoffs, pomodoro bells, and streak milestones with zero network latency.
          </p>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              disabled={!audioEnabled}
              onClick={() => soundEffects.playLevelUp()}
              className="px-3 py-1.5 rounded-xl bg-[#1D1836] hover:bg-[#28224D] border border-[#B46CFF]/20 text-[#B46CFF] hover:text-white text-xs font-semibold disabled:opacity-40 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles size={12} />
              <span>Test Chime</span>
            </button>
            <button
              type="button"
              disabled={!audioEnabled}
              onClick={() => soundEffects.playPomodoroGong()}
              className="px-3 py-1.5 rounded-xl bg-[#1D1836] hover:bg-[#28224D] border border-[#00F0FF]/20 text-[#00F0FF] hover:text-white text-xs font-semibold disabled:opacity-40 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Clock size={12} />
              <span>Test Focus Gong</span>
            </button>
          </div>
        </div>

        {/* Offline Sync & PWA Service Worker Section */}
        <div className="p-4 rounded-3xl bg-[#13111C] border border-violet-500/25 space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wifi size={16} className={isOnline ? 'text-emerald-400' : 'text-amber-400'} />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Service Worker & Background Sync Engine
              </h4>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-purple-300">
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>{isOnline ? 'Online Sync Active' : 'Offline Queue Active'}</span>
            </div>
          </div>

          <p className="text-xs text-[#AAA5B6] leading-relaxed">
            Service Worker background synchronization ensures your roadmap milestones, study sessions, and question answers are safely queued while offline and reconciled immediately when network connectivity resumes.
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-2xl bg-[#171424] border border-white/5 space-y-1">
              <span className="text-[10px] text-[#AAA9C6] uppercase font-bold tracking-wider block">Service Worker</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1 text-[11px]">
                <ShieldCheck size={12} />
                <span>{isServiceWorkerSupported ? 'Registered & Active' : 'Fallback Mode'}</span>
              </span>
            </div>

            <div className="p-2.5 rounded-2xl bg-[#171424] border border-white/5 space-y-1">
              <span className="text-[10px] text-[#AAA9C6] uppercase font-bold tracking-wider block">Offline Mutations</span>
              <span className="font-bold text-white font-mono text-[11px]">
                {pendingCount > 0 ? `${pendingCount} queued for sync` : 'All records in sync'}
              </span>
            </div>
          </div>

          <div className="space-y-2.5 pt-1">
            <PWAInstallButton variant="settings" />

            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#171424] border border-white/5 text-xs text-[#AAA5B6]">
              <div className="flex items-center gap-2">
                <RefreshCw size={13} className={`text-violet-400 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>Last Sync: {lastSyncTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  triggerManualSync();
                }}
                disabled={isSyncing || !isOnline}
                className="px-3 py-1.5 rounded-xl bg-violet-600/25 hover:bg-violet-600/40 text-violet-300 text-xs font-semibold border border-violet-500/35 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw size={12} className={isSyncing ? 'animate-spin' : ''} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* JSON Backup and Restore Section */}
        <div className="p-4 rounded-3xl bg-[#13111C] border border-purple-500/25 space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-violet-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Student Data Backup & Safekeeping
              </h4>
            </div>
            <span className="text-[11px] font-mono text-purple-300">
              {data.tasks.length} tasks · {data.studyLogs.length} logs · {data.questionBankProgress?.masteredIds.length || 0} mastered
            </span>
          </div>
          <p className="text-xs text-[#AAA5B6] leading-relaxed">
            Download a complete offline copy of your entire BCA roadmap, daily study history, subject lecture trackers, CGPA grades, 10k question bookmarks, and task list for safekeeping.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            {/* Primary Backup Data Button */}
            <button
              type="button"
              onClick={() => {
                exportDataJSON();
                setBackupDownloaded(true);
                setTimeout(() => setBackupDownloaded(false), 4000);
              }}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:brightness-110 text-white text-xs font-bold shadow-[0_0_16px_rgba(139,92,246,0.5)] border border-violet-400/30 flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer"
            >
              <Download size={15} strokeWidth={2.5} />
              <span>Backup Data</span>
            </button>

            {/* Restore / Import Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2.5 rounded-2xl bg-[#1A1828] hover:bg-[#231F36] text-purple-300 hover:text-white text-xs font-medium border border-purple-500/20 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Upload size={14} />
              <span>Restore from Backup</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json,application/json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {backupDownloaded && (
            <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
              <Check size={16} className="text-emerald-400" />
              <span>
                Backup file downloaded successfully! Your entire study history and tasks are safely stored.
              </span>
            </div>
          )}

          {importStatus && (
            <div
              className={`p-3 rounded-2xl border text-xs flex items-center gap-2 ${
                importStatus.success
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
              }`}
            >
              {importStatus.success ? <Check size={16} /> : <AlertCircle size={16} />}
              <span>{importStatus.message}</span>
            </div>
          )}
        </div>

        {/* Onboarding & Welcome Screen Controls */}
        <div className="p-4 rounded-3xl bg-[#13111C] border border-purple-500/25 space-y-3 shadow-md">
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>Onboarding Setup & Welcome Experience</span>
            </h4>
            <p className="text-[11px] text-[#9E99AF] mt-0.5">
              Revisit your semester goals, study targets, learning priorities, or return to the opening 3D welcome screen.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {onRevisitOnboarding && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onRevisitOnboarding();
                }}
                className="px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 text-xs font-semibold border border-purple-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Sparkles size={13} className="text-purple-400" />
                <span>Revisit 3-Step Onboarding</span>
              </button>
            )}

            {onReturnToWelcome && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onReturnToWelcome();
                }}
                className="px-3.5 py-2 rounded-xl bg-[#1D1B39] hover:bg-[#252347] text-[#AAA9C6] hover:text-white text-xs font-semibold border border-purple-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>Open Welcome / Splash Screen</span>
              </button>
            )}
          </div>
        </div>

        {/* Zero Baseline Fresh Day Reset */}
        <div className="p-4 rounded-2xl bg-[#13111C] border border-violet-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-xs font-bold text-violet-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>Zero-Baseline Daily Progression</span>
            </h4>
            <p className="text-[11px] text-[#9E99AF] mt-0.5">
              Reset today's lectures, study minutes, and tasks to 0 so you can experience fresh daily gradual increase.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              resetTodayProgressToZero();
              onClose();
            }}
            className="px-3.5 py-2 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 text-xs font-semibold border border-violet-500/30 flex items-center gap-1.5 transition-all shrink-0"
          >
            <RotateCcw size={13} />
            <span>Start Fresh Day (0 Base)</span>
          </button>
        </div>

        {/* Reset / Dangerous Zone */}
        <div className="p-4 rounded-2xl bg-[#1A1629] border border-rose-500/20 flex items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider">
              Reset Application Data
            </h4>
            <p className="text-[11px] text-[#9E99AF]">
              Revert all subjects, tasks, and roadmaps to initial BCA templates.
            </p>
          </div>

          {showResetConfirm ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-2.5 py-1.5 rounded-lg bg-[#201C33] text-[#9E99AF] text-xs hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
              >
                Yes, Reset All
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-medium border border-rose-500/30 flex items-center gap-1"
            >
              <RotateCcw size={13} />
              <span>Reset Data</span>
            </button>
          )}
        </div>

        {/* Version stamp */}
        <div className="text-center text-[11px] text-[#787388] pt-2">
          BCA Career Planner · Version {data.version} · Offline-Ready
        </div>
      </div>
    </Modal>
  );
};
