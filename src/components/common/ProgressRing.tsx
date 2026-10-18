import React from 'react';
import { motion } from 'motion/react';

interface ProgressRingProps {
  progress: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  color?: string;
  gradientId?: string;
  showText?: boolean;
  sublabel?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 110,
  strokeWidth = 9,
  gradientId = 'purpleGradient',
  showText = true,
  sublabel,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const targetOffset = circumference - (clampedProgress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A970FF" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#657BFF" />
          </linearGradient>
          <filter id={`glow-${gradientId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#8B5CF6" floodOpacity="0.6" />
          </filter>
        </defs>
        {/* Track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#161424"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated Progress circle with spring overshoot */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: targetOffset }}
          transition={{
            type: 'spring',
            stiffness: 90,
            damping: 14,
            mass: 0.9,
            restDelta: 0.001,
          }}
          strokeLinecap="round"
          fill="transparent"
          filter={`url(#glow-${gradientId})`}
        />
      </svg>
      {showText && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none p-1">
          <span className="text-xl font-bold tracking-tight text-white font-mono tabular-nums leading-none">
            {Math.round(clampedProgress)}%
          </span>
          {sublabel && (
            <span className="text-[10px] font-medium text-purple-200/80 mt-1 max-w-[80px] truncate leading-none">
              {sublabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
