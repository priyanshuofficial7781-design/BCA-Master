import React from 'react';
import { useApp } from '../../context/AppContext';
import { ProgressRing } from '../common/ProgressRing';
import { ChevronRight, Flame, Target } from 'lucide-react';
import { motion } from 'motion/react';

interface StudyOverviewCardProps {
  onOpenPlanner: () => void;
  onOpenAnalytics: () => void;
}

export const StudyOverviewCard: React.FC<StudyOverviewCardProps> = ({
  onOpenPlanner,
  onOpenAnalytics,
}) => {
  const {
    todayTasksSummary,
    todayCompletedMinutes,
    todayPlannedMinutes,
    streakDays,
    data,
  } = useApp();

  // Completion percentage for today's tasks
  const todayProgressPercent =
    todayTasksSummary.total > 0
      ? Math.round((todayTasksSummary.completed / todayTasksSummary.total) * 100)
      : 0;

  // Compute 7 days study hours for the weekly streak chart
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayDate = new Date();
  const currentDayIndex = (todayDate.getDay() + 6) % 7; // 0 for Mon, 6 for Sun

  // Calculate past 7 days study hours from real studyLogs
  const weeklyData = daysOfWeek.map((dayLabel, index) => {
    const dayOffset = index - currentDayIndex;
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + dayOffset);
    const dateStr = targetDate.toISOString().split('T')[0];

    const logsForDay = data.studyLogs.filter((log) => log.date === dateStr);
    const totalMinutes = logsForDay.reduce((sum, log) => sum + log.durationMinutes, 0);
    const hours = Number((totalMinutes / 60).toFixed(1));

    return {
      dayLabel,
      hours,
      isToday: index === currentDayIndex,
    };
  });

  const maxHours = Math.max(4, ...weeklyData.map((d) => d.hours));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Card 1: Study Progress with Spring Animated Ring */}
      <div
        onClick={onOpenPlanner}
        className="group relative cursor-pointer overflow-hidden rounded-3xl bg-[#13111C]/80 border border-purple-500/20 backdrop-blur-xl p-5 hover:border-purple-500/40 transition-all hover:shadow-[0_8px_30px_rgba(139,92,246,0.2)] flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-violet-500/10 text-violet-400">
              <Target size={16} />
            </span>
            <h3 className="text-sm font-bold text-white">Study Progress</h3>
          </div>
          <ChevronRight
            size={16}
            className="text-[#9E99AF] group-hover:text-purple-300 group-hover:translate-x-0.5 transition-all"
          />
        </div>

        <div className="flex items-center gap-5 my-1">
          <ProgressRing progress={todayProgressPercent} size={92} strokeWidth={8} />

          <div className="flex-1 space-y-2">
            <div>
              <div className="text-[11px] text-[#9E99AF] font-medium tracking-wide">Goals Met Today</div>
              <div className="text-base font-bold text-white font-mono tabular-nums">
                {todayTasksSummary.completed} / {todayTasksSummary.total} tasks
              </div>
            </div>

            <div>
              <div className="text-[11px] text-[#9E99AF] font-medium tracking-wide">Today's Focus Time</div>
              <div className="text-sm font-semibold text-purple-300 font-mono tabular-nums">
                {(todayCompletedMinutes / 60).toFixed(1)}h / {(todayPlannedMinutes / 60).toFixed(1)}h
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-purple-500/10 text-[11px] text-[#9E99AF] mt-2">
          <span>Target: {data.profile.dailyStudyTargetHours}h / day</span>
          <span className="text-purple-300 font-medium group-hover:underline">Open Planner →</span>
        </div>
      </div>

      {/* Card 2: Learning Streaks Bar Chart with Spring-Physics Columns */}
      <div
        onClick={onOpenAnalytics}
        className="group relative cursor-pointer overflow-hidden rounded-3xl bg-[#13111C]/80 border border-purple-500/20 backdrop-blur-xl p-5 hover:border-purple-500/40 transition-all hover:shadow-[0_8px_30px_rgba(139,92,246,0.2)] flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-amber-500/10 text-amber-400">
              <Flame size={16} className="fill-amber-400" />
            </span>
            <h3 className="text-sm font-bold text-white">Learning Streaks</h3>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold bg-amber-400/10 px-2 py-0.5 rounded-lg border border-amber-400/20">
            <span>{streakDays} Days Active</span>
            <ChevronRight
              size={14}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </div>
        </div>

        {/* 7-day visual bar chart with spring animation */}
        <div className="flex items-end justify-between gap-2 h-24 pt-2 px-1">
          {weeklyData.map((d, i) => {
            const heightPercent = Math.max(12, Math.round((d.hours / maxHours) * 100));
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[9px] text-[#9E99AF] tabular-nums font-mono">
                  {d.hours > 0 ? `${d.hours}h` : '-'}
                </span>
                <div className="w-full max-w-[28px] h-full flex items-end">
                  <motion.div
                    initial={{ height: '0%' }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{
                      type: 'spring',
                      stiffness: 110,
                      damping: 12,
                      mass: 0.8,
                      delay: i * 0.04,
                    }}
                    className={`w-full rounded-t-lg ${
                      d.isToday
                        ? 'bg-gradient-to-t from-purple-600 via-purple-500 to-indigo-400 shadow-[0_0_14px_rgba(169,112,255,0.6)]'
                        : d.hours > 0
                        ? 'bg-gradient-to-t from-purple-800/80 to-purple-600/80'
                        : 'bg-[#1D1A2C]'
                    }`}
                  />
                </div>
                <span
                  className={`text-[10px] font-medium ${
                    d.isToday ? 'text-purple-300 font-bold' : 'text-[#9E99AF]'
                  }`}
                >
                  {d.dayLabel}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-purple-500/10 text-[11px] text-[#9E99AF] mt-2">
          <span>Weekly target: {data.profile.weeklyStudyTargetHours} hours</span>
          <span className="text-purple-300 font-medium group-hover:underline">Full Analytics →</span>
        </div>
      </div>
    </div>
  );
};
