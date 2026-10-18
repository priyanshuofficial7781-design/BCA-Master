import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, UserCheck, Sparkles } from 'lucide-react';

interface FeaturedHeroProps {
  onStartPractice: () => void;
  onOpenRoadmap: () => void;
}

export const FeaturedHero: React.FC<FeaturedHeroProps> = ({
  onStartPractice,
  onOpenRoadmap,
}) => {
  const { data, overallRoadmapProgress } = useApp();

  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#1C162E] via-[#161324] to-[#120F1D] border border-purple-500/25 p-5 sm:p-6 shadow-[0_10px_35px_rgba(0,0,0,0.5)] glow-purple">
      {/* Decorative ambient background glows */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-600/15 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        {/* Left text column matching Screenshot 1 */}
        <div className="flex-1 max-w-lg">
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#657BFF] text-[10px] font-extrabold tracking-wider text-white uppercase mb-3 shadow-[0_0_10px_rgba(139,92,246,0.5)]">
            FEATURED
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
            Mock Interview
          </h2>

          <p className="text-xs sm:text-sm text-[#AAA5B6] mt-1.5 leading-relaxed max-w-sm">
            Simulate a real-world interview experience with AI-powered feedback
          </p>

          {/* Action button matching Screenshot 1 */}
          <div className="flex items-center gap-3 mt-5">
            <button
              onClick={onStartPractice}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#A970FF] to-[#657BFF] hover:opacity-95 text-white text-xs font-bold shadow-[0_4px_25px_rgba(139,92,246,0.5)] transition-all active:scale-95"
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Right side glowing avatar grid graphic from Screenshot 1 */}
        <div className="flex flex-col items-center justify-center shrink-0">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
            {/* Soft glowing aura */}
            <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse" />
            <div className="absolute inset-2 bg-purple-500/30 rounded-full blur-lg" />

            {/* Dot grid background */}
            <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 gap-1.5 opacity-25 p-2 pointer-events-none">
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} className="w-1 h-1 rounded-full bg-white mx-auto my-auto" />
              ))}
            </div>

            {/* Silhouette icon with strong white glow */}
            <div className="relative z-10 w-14 h-14 rounded-full bg-white/95 text-[#13111C] flex items-center justify-center shadow-[0_0_35px_rgba(255,255,255,0.85)]">
              <UserCheck size={28} className="text-[#1A152E]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
