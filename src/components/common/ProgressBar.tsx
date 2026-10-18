import React from 'react';
import { motion } from 'motion/react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  height?: number;
  className?: string;
  showLabel?: boolean;
  colorScheme?: 'violet' | 'emerald' | 'blue';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  className = '',
  showLabel = false,
  colorScheme = 'violet',
}) => {
  const clamped = Math.min(100, Math.max(0, progress));

  const gradientMap = {
    violet: 'from-[#8B5CF6] via-[#A970FF] to-[#657BFF]',
    emerald: 'from-emerald-500 via-teal-400 to-cyan-400',
    blue: 'from-blue-500 via-indigo-500 to-purple-500',
  };

  const glowShadowMap = {
    violet: '0 0 14px rgba(169, 112, 255, 0.55)',
    emerald: '0 0 14px rgba(16, 185, 129, 0.55)',
    blue: '0 0 14px rgba(99, 102, 241, 0.55)',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-[#A5A0B5] font-medium tracking-wide">Progress</span>
          <span className="text-white font-semibold font-mono tabular-nums">{Math.round(clamped)}%</span>
        </div>
      )}
      <div
        className="w-full bg-[#13111C]/90 rounded-full overflow-hidden p-[2px] border border-purple-500/20 shadow-inner"
        style={{ height: height + 4 }}
      >
        <div className="relative w-full h-full rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${clamped}%` }}
            transition={{
              type: 'spring',
              stiffness: 110,
              damping: 12,
              mass: 0.9,
              restDelta: 0.001,
            }}
            className={`h-full rounded-full bg-gradient-to-r ${gradientMap[colorScheme]} relative`}
            style={{
              boxShadow: glowShadowMap[colorScheme],
            }}
          >
            {/* Luminous moving flare highlight at leading edge */}
            {clamped > 2 && (
              <div className="absolute right-0 top-0 bottom-0 w-3 bg-white/40 rounded-full blur-[1px]" />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
