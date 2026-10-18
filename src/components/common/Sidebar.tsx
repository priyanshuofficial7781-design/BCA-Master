import React from 'react';
import { useApp, NavigationTab } from '../../context/AppContext';
import {
  Home,
  Calendar,
  BookOpen,
  Compass,
  Briefcase,
  Layers,
  BarChart3,
  ShieldCheck,
  Settings,
  Sparkles,
  Timer,
  GraduationCap,
  Users,
  Award,
  Terminal,
  Brain,
  FileText,
  Youtube,
} from 'lucide-react';

interface SidebarProps {
  onOpenSettings: () => void;
  onOpenBadges?: () => void;
  onOpenResume?: () => void;
  onReturnToWelcome?: () => void;
  onOpenAIChat?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onOpenSettings,
  onOpenBadges,
  onOpenResume,
  onReturnToWelcome,
  onOpenAIChat,
}) => {
  const { activeTab, setActiveTab, data, streakDays, overallRoadmapProgress, overallCgpa } = useApp();

  const navItems: Array<{
    id: NavigationTab;
    label: string;
    icon: React.ReactNode;
    badge?: string;
  }> = [
    { id: 'home', label: '1. Home Dashboard', icon: <Home size={18} /> },
    { id: 'planner', label: '2. Study Planner', icon: <Calendar size={18} /> },
    { id: 'learn', label: '3. Learning Hub', icon: <BookOpen size={18} />, badge: `${data.subjects.length} Sub` },
    { id: 'code-sandbox', label: '4. Dedicated Coding Place', icon: <Terminal size={18} />, badge: '12+ Langs' },
    { id: 'viva-lab', label: '5. AI Tech Viva Lab', icon: <Brain size={18} />, badge: 'Voice AI' },
    { id: 'video-lectures', label: '6. Video Lectures', icon: <Youtube size={18} className="text-rose-400" />, badge: 'YouTube' },
    { id: 'specializations', label: '7. Specializations', icon: <ShieldCheck size={18} /> },
    { id: 'projects', label: '8. Project Portfolio', icon: <Layers size={18} />, badge: `${data.projects.length}` },
    { id: 'placement', label: '9. Placement & DSA', icon: <Briefcase size={18} /> },
    { id: 'analytics', label: '10. Study Velocity & Stats', icon: <BarChart3 size={18} /> },
    { id: 'pomodoro', label: '11. Focus Pomodoro', icon: <Timer size={18} />, badge: 'Focus' },
    { id: 'study-rooms', label: '12. Peer Study Rooms', icon: <Users size={18} />, badge: 'Collab' },
    { id: 'practice-bank', label: '13. 10k+ Question Bank', icon: <BookOpen size={18} />, badge: '10k' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-[#0C0A14] border-r border-purple-500/15 h-screen sticky top-0 p-4 select-none">
      {/* Brand logo & title */}
      <button
        type="button"
        onClick={onReturnToWelcome}
        className="w-full flex items-center gap-3 px-3 py-3 mb-4 border-b border-purple-500/10 text-left hover:bg-purple-500/10 rounded-2xl transition-all cursor-pointer group"
        title="Return to Welcome / Splash Screen"
      >
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#8B5CF6] via-[#A970FF] to-[#657BFF] flex items-center justify-center text-white shadow-[0_0_20px_rgba(139,92,246,0.5)] group-hover:scale-105 transition-transform shrink-0">
          <GraduationCap size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-white text-base leading-tight tracking-tight">
              BCA Planner
            </h2>
            <span className="text-[9px] text-[#B46CFF] bg-[#8B3DFF]/20 px-1.5 py-0.5 rounded border border-[#8B3DFF]/30">
              Welcome
            </span>
          </div>
          <p className="text-[11px] text-purple-300/80 font-medium truncate">Plan • Learn • Build</p>
        </div>
      </button>

      {/* Navigation menu links */}
      <nav className="flex-1 space-y-1 overflow-y-auto pr-1 scrollbar-none">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600/30 to-purple-800/15 text-white border border-purple-500/40 shadow-[0_0_15px_rgba(169,112,255,0.2)] font-semibold'
                  : 'text-[#9E99AF] hover:text-white hover:bg-[#1A1629]/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-[#A970FF]' : 'text-[#9E99AF]'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/20 font-medium font-mono">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Profile & Settings */}
      <div className="pt-4 border-t border-purple-500/10 mt-2 space-y-2">
        <div className="p-3 rounded-2xl bg-[#141220] border border-purple-500/15">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-white">{data.profile.name}</span>
            <span className="text-[10px] text-amber-400 font-bold bg-amber-400/10 px-1.5 py-0.5 rounded-md border border-amber-400/20">
              {streakDays}d active
            </span>
          </div>
          <div className="text-[11px] text-[#9E99AF] truncate">{data.profile.targetRole}</div>
        </div>

        {onOpenAIChat && (
          <button
            type="button"
            onClick={onOpenAIChat}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600/30 to-[#00F0FF]/20 hover:from-purple-600/50 hover:to-[#00F0FF]/30 border border-[#B46CFF]/40 transition-all shadow-[0_0_12px_rgba(139,61,255,0.25)] cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles size={16} className="text-[#00F0FF] group-hover:rotate-12 transition-transform" />
              <span>Ask AI Tutor</span>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-[#00F0FF] border border-[#00F0FF]/30 font-bold">
              Gemini & GPT
            </span>
          </button>
        )}

        {onOpenResume && (
          <button
            onClick={onOpenResume}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-[#00F0FF] hover:text-white bg-[#00F0FF]/10 hover:bg-[#00F0FF]/20 border border-[#00F0FF]/30 transition-all shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <FileText size={16} className="text-[#00F0FF]" />
              <span>Resume Dossier</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#00F0FF]/20 text-[#00F0FF] font-bold">
              ATS PDF
            </span>
          </button>
        )}

        {onOpenBadges && (
          <button
            onClick={onOpenBadges}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-violet-300 hover:text-white bg-violet-600/15 hover:bg-violet-600/25 border border-violet-500/25 transition-all shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <Award size={16} className="text-violet-400" />
              <span>Cyber Credentials</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-200">
              4 Badges
            </span>
          </button>
        )}

        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-[#9E99AF] hover:text-white hover:bg-[#1A1629] transition-colors"
        >
          <Settings size={16} />
          <span>Settings & Backup</span>
        </button>
      </div>
    </aside>
  );
};
