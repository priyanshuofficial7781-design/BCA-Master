import React from 'react';
import { Zap, MessageSquareCode } from 'lucide-react';

interface QuickActionsGridProps {
  onOpenQuickPractice: () => void;
  onOpenQuestions: () => void;
}

export const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({
  onOpenQuickPractice,
  onOpenQuestions,
}) => {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {/* Quick Practice Card */}
      <button
        type="button"
        onClick={onOpenQuickPractice}
        className="group text-left p-4 sm:p-5 rounded-2xl bg-[#161424] border border-purple-500/20 hover:border-purple-500/40 hover:bg-[#1A172C] transition-all hover:shadow-[0_4px_20px_rgba(139,92,246,0.15)] active:scale-[0.98]"
      >
        <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-400 group-hover:text-purple-300 group-hover:scale-105 transition-all mb-3 shadow-[0_0_12px_rgba(169,112,255,0.2)]">
          <Zap size={20} className="fill-purple-400/20" />
        </div>
        <h4 className="text-sm sm:text-base font-semibold text-white tracking-tight">
          Quick Practice
        </h4>
        <p className="text-xs text-[#9E99AF] mt-0.5">Get better, faster</p>
      </button>

      {/* Your Questions / Growth Card */}
      <button
        type="button"
        onClick={onOpenQuestions}
        className="group text-left p-4 sm:p-5 rounded-2xl bg-[#161424] border border-purple-500/20 hover:border-purple-500/40 hover:bg-[#1A172C] transition-all hover:shadow-[0_4px_20px_rgba(139,92,246,0.15)] active:scale-[0.98]"
      >
        <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-indigo-400 group-hover:text-indigo-300 group-hover:scale-105 transition-all mb-3 shadow-[0_0_12px_rgba(99,102,241,0.2)]">
          <MessageSquareCode size={20} />
        </div>
        <h4 className="text-sm sm:text-base font-semibold text-white tracking-tight">
          Your Questions
        </h4>
        <p className="text-xs text-[#9E99AF] mt-0.5">Target growth areas</p>
      </button>
    </div>
  );
};
