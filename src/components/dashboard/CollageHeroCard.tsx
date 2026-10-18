import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, BookOpen, Sparkles, Trophy, CheckCircle2, Zap, Orbit } from 'lucide-react';
import { ProgressRing } from '../common/ProgressRing';

interface CollageHeroCardProps {
  onContinueLearning: () => void;
  onOpenRoadmap?: () => void;
}

export const CollageHeroCard: React.FC<CollageHeroCardProps> = ({
  onContinueLearning,
}) => {
  const { data } = useApp();

  // Calculate total and completed lectures across all subjects
  const totalLectures = data.subjects.reduce((sum, s) => sum + s.totalLectures, 0);
  const completedLectures = data.subjects.reduce((sum, s) => sum + s.completedLectures, 0);
  const overallLessonPercent = totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0;

  // Active milestone for current semester
  const currentSemesterRoadmap = data.roadmap.find((r) => r.semesterNumber === data.profile.semester);
  const activeMilestone =
    currentSemesterRoadmap?.milestones.find((m) => !m.completed) ||
    currentSemesterRoadmap?.milestones[0] || {
      title: 'Master Trees, Graphs & Dynamic Programming',
    };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#181335] via-[#0F0D24] to-[#070512] border border-[#B46CFF]/35 p-6 sm:p-7 shadow-[0_16px_50px_rgba(0,0,0,0.8),0_0_25px_rgba(139,61,255,0.22)] backdrop-blur-2xl">
      {/* Volumetric Neon Ambient Glow Behind Card */}
      <div className="absolute top-[-25%] right-[-10%] w-80 h-80 bg-[#8B3DFF]/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-72 h-72 bg-[#00F0FF]/15 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-[#B46CFF]/12 rounded-full blur-[120px] pointer-events-none" />

      {/* Cyberpunk Top Specular Neon Rail */}
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00F0FF]/50 via-[#B46CFF]/80 to-transparent" />

      {/* Cyberpunk Grid Accent Pattern */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#B46CFF 1px, transparent 1px), linear-gradient(to right, #00F0FF 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left Column: Progress Info & Milestone */}
        <div className="flex-1 max-w-lg space-y-3.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-[#8B3DFF]/25 border border-[#B46CFF]/45 text-[11px] font-black tracking-widest text-[#B46CFF] uppercase shadow-[0_0_15px_rgba(180,108,255,0.4)] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9D] animate-ping" />
              Semester {data.profile.semester} Progress
            </span>
            <span className="text-xs text-[#AAA9C6] flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#100E22] border border-white/10">
              <Trophy size={13} className="text-[#00FF9D]" />
              <span className="text-white font-mono">{overallLessonPercent}% Completed</span>
            </span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              BCA Academic Progress
            </h2>
            <p className="text-xs sm:text-sm text-[#AAA9C6] mt-1.5 leading-relaxed">
              Current Focus: <span className="text-white font-semibold">{activeMilestone.title}</span>
            </p>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center gap-4 py-1 text-xs text-[#AAA9C6] flex-wrap">
            <div>
              <span className="text-white font-bold font-mono text-sm">{completedLectures}</span>
              <span className="text-[#AAA9C6]"> / {totalLectures} lessons completed</span>
            </div>
            <span>•</span>
            <button
              type="button"
              onClick={onContinueLearning}
              className="text-[#00F0FF] hover:text-white font-semibold hover:underline transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Explore Curriculum</span>
              <ArrowRight size={12} />
            </button>
          </div>

          {/* Prominent Action Button: Continue Learning */}
          <div className="pt-1.5 flex items-center gap-3">
            <button
              type="button"
              onClick={onContinueLearning}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#8B3DFF] via-[#A855F7] to-[#4D79FF] hover:opacity-95 text-white text-xs sm:text-sm font-bold flex items-center gap-2.5 shadow-[0_4px_30px_rgba(139,61,255,0.55)] hover:shadow-[0_4px_40px_rgba(139,61,255,0.8)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border border-white/25"
            >
              <span>Continue Learning</span>
              <ArrowRight size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Right Column: Glowing Circular Progress Ring with 3D Depth */}
        <div className="flex items-center justify-center shrink-0 self-center md:self-auto py-2">
          <div className="relative p-5 rounded-3xl bg-gradient-to-b from-[#13102B]/90 to-[#0A0818]/90 border border-[#B46CFF]/35 shadow-[0_12px_36px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.1)] flex flex-col items-center">
            {/* Ambient Radial Ring Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#8B3DFF]/20 to-[#00F0FF]/15 rounded-3xl blur-xl pointer-events-none" />

            <div className="relative w-[124px] h-[124px] flex items-center justify-center">
              <ProgressRing
                progress={overallLessonPercent}
                size={124}
                strokeWidth={9}
                showText={false}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none select-none">
                <span className="text-2xl font-black text-white font-mono tabular-nums tracking-tight leading-none drop-shadow-[0_0_8px_rgba(180,108,255,0.45)]">
                  {overallLessonPercent}%
                </span>
                <span className="text-[10px] text-[#00F0FF] font-extrabold uppercase tracking-widest mt-1.5 leading-none">
                  Mastery
                </span>
              </div>
            </div>

            <div className="mt-3 text-center">
              <span className="text-[11px] font-semibold text-[#00FF9D] flex items-center gap-1.5 justify-center">
                <CheckCircle2 size={13} className="text-[#00FF9D]" />
                <span>On Track for 9.5+ CGPA</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
