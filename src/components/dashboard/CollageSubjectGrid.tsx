import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Code,
  Binary,
  Target,
  Layers,
  Terminal,
  Shield,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { ProgressBar } from '../common/ProgressBar';

interface CollageSubjectGridProps {
  onSelectSubject: (subjectId: string) => void;
  onOpenLearningHub: () => void;
}

export const CollageSubjectGrid: React.FC<CollageSubjectGridProps> = ({
  onSelectSubject,
  onOpenLearningHub,
}) => {
  const { data } = useApp();

  // Mapping the 6 exact subjects from the Master Prompt collage
  const subjectConfigs = [
    {
      id: 'sub-cpp-dsa',
      title: 'C++ / DSA',
      code: 'BCA-301',
      category: 'Core Data Structures',
      icon: <Binary size={20} className="text-[#B46CFF]" />,
      glowColor: 'rgba(180, 108, 255, 0.45)',
      accentBg: 'bg-[#8B3DFF]/20 border-[#B46CFF]/40',
      activeChapter: 'Chapter 4: Graphs & DP',
      defaultLectures: { completed: 18, total: 32 },
    },
    {
      id: 'sub-aptitude',
      title: 'Aptitude',
      code: 'BCA-APT',
      category: 'Placement Readiness',
      icon: <Target size={20} className="text-[#FF2E93]" />,
      glowColor: 'rgba(255, 46, 147, 0.45)',
      accentBg: 'bg-[#FF2E93]/20 border-[#FF2E93]/40',
      activeChapter: 'Quant & Analytical Logic',
      defaultLectures: { completed: 24, total: 40 },
    },
    {
      id: 'sub-math',
      title: 'Mathematics',
      code: 'BCA-302',
      category: 'Discrete Structures',
      icon: <Layers size={20} className="text-[#00F0FF]" />,
      glowColor: 'rgba(0, 240, 255, 0.45)',
      accentBg: 'bg-[#00F0FF]/20 border-[#00F0FF]/40',
      activeChapter: 'Matrix & Graph Theory',
      defaultLectures: { completed: 12, total: 24 },
    },
    {
      id: 'sub-python',
      title: 'Python',
      code: 'BCA-303',
      category: 'Scripting & Automation',
      icon: <Terminal size={20} className="text-[#00FF9D]" />,
      glowColor: 'rgba(0, 255, 157, 0.45)',
      accentBg: 'bg-[#00FF9D]/20 border-[#00FF9D]/40',
      activeChapter: 'OOPs, NumPy & Pandas',
      defaultLectures: { completed: 15, total: 26 },
    },
    {
      id: 'sub-cyber',
      title: 'Cybersecurity',
      code: 'BCA-304',
      category: 'Networks & Defense',
      icon: <Shield size={20} className="text-[#F59E0B]" />,
      glowColor: 'rgba(245, 158, 11, 0.45)',
      accentBg: 'bg-[#F59E0B]/20 border-[#F59E0B]/40',
      activeChapter: 'Crypto & Secure Protocols',
      defaultLectures: { completed: 9, total: 22 },
    },
    {
      id: 'sub-aiml',
      title: 'AI / ML',
      code: 'BCA-305',
      category: 'Intelligent Systems',
      icon: <Code size={20} className="text-[#E040FB]" />,
      glowColor: 'rgba(224, 64, 251, 0.45)',
      accentBg: 'bg-[#E040FB]/20 border-[#E040FB]/40',
      activeChapter: 'Neural Nets & Scikit-Learn',
      defaultLectures: { completed: 8, total: 20 },
    },
  ];

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-xl bg-[#8B3DFF]/20 text-[#B46CFF] border border-[#B46CFF]/30 shadow-[0_0_12px_rgba(139,61,255,0.3)]">
            <Sparkles size={14} />
          </span>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
              Curriculum Core Subjects
            </h3>
            <p className="text-xs text-[#AAA9C6]">
              6 active BCA semester focus domains
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenLearningHub}
          className="text-xs text-[#00F0FF] hover:text-white font-bold flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>View all subjects</span>
          <ChevronRight size={14} />
        </button>
      </div>

      {/* 6-Card Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {subjectConfigs.map((cfg) => {
          // Find real subject if present in state, or use defaults
          const realSub = data.subjects.find(
            (s) => s.id === cfg.id || s.name.toLowerCase().includes(cfg.title.toLowerCase())
          );
          const total = realSub ? realSub.totalLectures : cfg.defaultLectures.total;
          const completed = realSub ? realSub.completedLectures : cfg.defaultLectures.completed;
          const progressPercent = Math.round((completed / total) * 100);

          return (
            <div
              key={cfg.title}
              onClick={() => onSelectSubject(realSub?.id || 'sub-cpp-dsa')}
              className="group cursor-pointer p-4 rounded-3xl bg-gradient-to-br from-[#181335]/90 via-[#100E22]/90 to-[#080614]/90 border border-[#B46CFF]/25 hover:border-[#B46CFF]/60 hover:shadow-[0_10px_35px_rgba(139,61,255,0.25)] transition-all space-y-3.5 shadow-md backdrop-blur-xl relative overflow-hidden"
            >
              {/* Top hairline specular rail */}
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#B46CFF]/40 to-transparent group-hover:via-[#00F0FF]/60 transition-all" />

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${cfg.accentBg} transition-transform group-hover:scale-105 shadow-sm`}
                    style={{ boxShadow: `0 0 18px ${cfg.glowColor}` }}
                  >
                    {cfg.icon}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white truncate group-hover:text-[#00F0FF] transition-colors">
                      {cfg.title}
                    </h4>
                    <span className="text-[11px] text-[#AAA9C6] block truncate">
                      {cfg.activeChapter}
                    </span>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-xl bg-[#0A0818] group-hover:bg-[#8B3DFF]/30 border border-white/5 group-hover:border-[#B46CFF]/40 flex items-center justify-center text-[#AAA9C6] group-hover:text-white transition-colors shrink-0">
                  <ArrowUpRight size={15} />
                </div>
              </div>

              {/* Progress and Lecture status */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[11px] text-[#AAA9C6] font-medium">
                  <span className="font-mono tabular-nums">
                    {completed} of {total} Lectures
                  </span>
                  <span className="text-white font-bold font-mono tabular-nums">
                    {progressPercent}%
                  </span>
                </div>

                <ProgressBar progress={progressPercent} height={6} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
