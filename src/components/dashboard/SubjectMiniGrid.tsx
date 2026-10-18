import React from 'react';
import { useApp } from '../../context/AppContext';
import { Code2, BrainCircuit, Calculator, Terminal, Shield, ArrowUpRight } from 'lucide-react';
import { ProgressBar } from '../common/ProgressBar';

interface SubjectMiniGridProps {
  onSelectSubject: (subjectId: string) => void;
  onOpenLearningHub: () => void;
}

export const SubjectMiniGrid: React.FC<SubjectMiniGridProps> = ({
  onSelectSubject,
  onOpenLearningHub,
}) => {
  const { data } = useApp();

  const getSubjectIcon = (id: string) => {
    switch (id) {
      case 'sub-cpp-dsa':
        return <Code2 size={18} className="text-purple-400" />;
      case 'sub-aptitude':
        return <BrainCircuit size={18} className="text-pink-400" />;
      case 'sub-math':
        return <Calculator size={18} className="text-blue-400" />;
      case 'sub-python':
        return <Terminal size={18} className="text-emerald-400" />;
      case 'sub-cyber':
        return <Shield size={18} className="text-amber-400" />;
      default:
        return <Code2 size={18} className="text-purple-400" />;
    }
  };

  const primarySubjects = data.subjects.slice(0, 3);

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
          Continue Learning
        </h3>

        <button
          onClick={onOpenLearningHub}
          className="text-xs text-purple-300 hover:text-white font-medium transition-colors"
        >
          View all subjects →
        </button>
      </div>

      <div className="space-y-3">
        {primarySubjects.map((sub, idx) => {
          const progressPercent = Math.round(
            (sub.completedLectures / sub.totalLectures) * 100
          );

          return (
            <div
              key={sub.id}
              onClick={() => onSelectSubject(sub.id)}
              className="group cursor-pointer p-4 rounded-3xl bg-[#13111C]/80 border border-purple-500/20 backdrop-blur-xl hover:border-purple-500/40 hover:bg-[#1A1629]/90 transition-all space-y-3 shadow-md hover:shadow-[0_4px_24px_rgba(169,112,255,0.15)]"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(169,112,255,0.25)]">
                    {getSubjectIcon(sub.id)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white truncate group-hover:text-purple-200 transition-colors">
                      {sub.name}
                    </h4>
                    <span className="text-[11px] text-[#9E99AF]">
                      Chapter: {idx + 1} · {sub.code}
                    </span>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-xl bg-[#201C33] group-hover:bg-[#2C2447] flex items-center justify-center text-[#9E99AF] group-hover:text-white transition-colors shrink-0">
                  <ArrowUpRight size={16} />
                </div>
              </div>

              {/* Progress info & Spring Animated ProgressBar */}
              <div>
                <div className="flex items-center justify-between text-[11px] text-[#9E99AF] mb-1.5 font-medium">
                  <span className="tabular-nums font-mono">
                    Lectures: {sub.completedLectures} of {sub.totalLectures}
                  </span>
                  <span className="text-purple-300 font-semibold tabular-nums font-mono">
                    Progress: {progressPercent}%
                  </span>
                </div>

                <ProgressBar progress={progressPercent} height={7} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
