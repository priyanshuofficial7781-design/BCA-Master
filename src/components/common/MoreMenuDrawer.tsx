import React from 'react';
import { useApp, NavigationTab } from '../../context/AppContext';
import {
  GraduationCap,
  Timer,
  Compass,
  ShieldCheck,
  Layers,
  Briefcase,
  BarChart3,
  Settings,
  X,
  ChevronRight,
  Sparkles,
  BookOpen,
  Users,
  Terminal,
  Brain,
  FileText,
  Youtube,
} from 'lucide-react';

interface MoreMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
  onOpenResume?: () => void;
  onReturnToWelcome?: () => void;
  onOpenAIChat?: () => void;
}

export const MoreMenuDrawer: React.FC<MoreMenuDrawerProps> = ({
  isOpen,
  onClose,
  onOpenSettings,
  onOpenResume,
  onReturnToWelcome,
  onOpenAIChat,
}) => {
  const { setActiveTab, data, overallCgpa } = useApp();

  if (!isOpen) return null;

  const handleSelect = (tab: NavigationTab) => {
    setActiveTab(tab);
    onClose();
  };

  const moreItems: Array<{
    id: NavigationTab;
    title: string;
    description: string;
    icon: React.ReactNode;
    badge?: string;
  }> = [
    {
      id: 'code-sandbox',
      title: 'Dedicated Coding Place (All Languages)',
      description: 'Multi-language studio for Python, C++, C, Java, JS, TS, HTML, SQL, Go, Rust, PHP & C#',
      icon: <Terminal size={20} className="text-[#00FF9D]" />,
      badge: '12+ Langs',
    },
    {
      id: 'viva-lab',
      title: 'AI Tech Viva & Voice Lab',
      description: 'Voice-enabled oral viva simulator with university professor feedback and marks',
      icon: <Brain size={20} className="text-[#00F0FF]" />,
      badge: 'Voice AI',
    },
    {
      id: 'video-lectures',
      title: 'Video Lectures & Study Theater',
      description: 'Watch curated university BCA lectures & float Picture-in-Picture while coding',
      icon: <Youtube size={20} className="text-[#FF0033]" />,
      badge: 'YouTube',
    },
    {
      id: 'study-rooms',
      title: 'Peer Study Rooms & Whiteboard',
      description: 'Live collaborative drawing canvas, sync sprint timer & peer chat',
      icon: <Users size={20} className="text-cyan-400" />,
      badge: 'Live',
    },
    {
      id: 'practice-bank',
      title: '10,000+ Question Practice Bank',
      description: 'Searchable study sheets for DSA, Core CS, Web & Aptitude',
      icon: <BookOpen size={20} className="text-violet-400" />,
      badge: '10k+ Qs',
    },
    {
      id: 'pomodoro',
      title: 'Focus Pomodoro Engine',
      description: 'Synthesized audio chimes and 25/5 deep work sprints',
      icon: <Timer size={20} className="text-violet-400" />,
      badge: 'Chime',
    },
    {
      id: 'capstone',
      title: 'Capstone Project Studio',
      description: 'Sem 5/6 project blueprints, architectures & viva defense',
      icon: <Sparkles size={20} className="text-emerald-400" />,
    },
    {
      id: 'placement',
      title: 'Placement Preparation',
      description: 'DSA sheets, aptitude mastery, & internship applications',
      icon: <Briefcase size={20} className="text-amber-400" />,
    },
    {
      id: 'projects',
      title: 'Project Portfolio Lab',
      description: 'Full-stack software projects, GitHub repos and live demos',
      icon: <Layers size={20} className="text-emerald-400" />,
      badge: `${data.projects.length}`,
    },
    {
      id: 'specializations',
      title: 'Specializations (AI & Cyber)',
      description: 'Multi-phase learning paths with practical lab exercises',
      icon: <ShieldCheck size={20} className="text-purple-400" />,
    },
    {
      id: 'analytics',
      title: 'Analytics & Velocity',
      description: 'Weekly study velocity, streak charts & subject breakdown',
      icon: <BarChart3 size={20} className="text-pink-400" />,
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-md animate-fadeIn lg:hidden"
      onClick={onClose}
    >
      <div
        className="w-full max-h-[85vh] overflow-y-auto bg-[#13111C] border-t border-purple-500/25 rounded-t-3xl shadow-2xl p-5 pb-8 space-y-4 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grab Handle */}
        <div className="w-10 h-1 bg-[#2C2647] rounded-full mx-auto -mt-1 mb-2" />

        <div className="flex items-center justify-between pb-2 border-b border-purple-500/10">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
              <span>BCA Academic & Career Suite</span>
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            </h3>
            <p className="text-xs text-[#9E99AF]">Academic calculators, deep focus, and placement prep</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1F1B2F] text-[#9E99AF] hover:text-white flex items-center justify-center"
          >
            <X size={16} />
          </button>
        </div>

        {/* Featured Placement Resume Dossier */}
        {onOpenResume && (
          <button
            onClick={() => {
              onClose();
              onOpenResume();
            }}
            className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-[#17112E] to-[#121A30] border border-[#00F0FF]/40 hover:border-[#00F0FF]/70 flex items-center justify-between text-left transition-all shadow-[0_0_20px_rgba(0,240,255,0.15)] group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#00F0FF]/15 border border-[#00F0FF]/30 flex items-center justify-center text-[#00F0FF] shrink-0 group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(0,240,255,0.3)]">
                <FileText size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-[#00F0FF] transition-colors">
                  1-Page Placement Resume Dossier
                </h4>
                <p className="text-[11px] text-[#AAA9C6]">
                  ATS-compliant PDF resume, exam question blueprint & data backup
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-[#00F0FF] bg-[#00F0FF]/20 px-2.5 py-1 rounded-full border border-[#00F0FF]/30">
              ATS PDF
            </span>
          </button>
        )}

        {/* Menu Items */}
        <div className="space-y-2">
          {moreItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className="w-full p-3 rounded-2xl bg-[#171524]/90 border border-purple-500/15 hover:border-purple-500/35 hover:bg-[#201C33] flex items-center justify-between text-left transition-all active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-500/20 flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                  <p className="text-[11px] text-[#9E99AF]">{item.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className="text-[10px] font-bold text-purple-300 bg-purple-500/20 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                    {item.badge}
                  </span>
                )}
                <ChevronRight size={16} className="text-[#9E99AF]" />
              </div>
            </button>
          ))}
        </div>

        {/* Quick Actions Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {onReturnToWelcome && (
            <button
              onClick={() => {
                onClose();
                onReturnToWelcome();
              }}
              className="w-full p-3 rounded-2xl bg-[#171524] border border-purple-500/20 flex items-center justify-center gap-2 text-xs font-semibold text-[#AAA9C6] hover:text-white transition-colors cursor-pointer"
            >
              <GraduationCap size={15} className="text-[#B46CFF]" />
              <span>Welcome Splash Screen</span>
            </button>
          )}

          <button
            onClick={() => {
              onClose();
              onOpenSettings();
            }}
            className="w-full p-3 rounded-2xl bg-[#1E192F] border border-purple-500/20 flex items-center justify-center gap-2 text-xs font-semibold text-purple-300 hover:text-white transition-colors cursor-pointer"
          >
            <Settings size={15} />
            <span>Profile & Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
