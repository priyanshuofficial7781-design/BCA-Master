import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Flame,
  Clock,
  Play,
  Compass,
  ChevronRight,
  TrendingUp,
  Target,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'motion/react';
import { getTodayString } from '../../data/initialData';

interface CollageActivityMilestoneProps {
  onOpenPomodoro: () => void;
  onOpenLearningHub?: () => void;
  onOpenRoadmap?: () => void;
  onOpenAnalytics: () => void;
}

export const CollageActivityMilestone: React.FC<CollageActivityMilestoneProps> = ({
  onOpenPomodoro,
  onOpenLearningHub,
  onOpenAnalytics,
}) => {
  const { data, streakDays } = useApp();
  const today = getTodayString(0);

  // Compute 7 days study hours for the weekly activity chart
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayDate = new Date();
  const currentDayIndex = (todayDate.getDay() + 6) % 7; // 0 for Mon, 6 for Sun

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

  const totalWeeklyHours = weeklyData.reduce((sum, d) => sum + d.hours, 0);
  const maxHours = Math.max(4, ...weeklyData.map((d) => d.hours));

  // Find next upcoming pending task
  const pendingTasks = data.tasks.filter((t) => t.date >= today && t.status !== 'completed');
  const nextTask = pendingTasks[0];

  // Find current semester roadmap milestone
  const currentSemesterRoadmap = data.roadmap.find((r) => r.semesterNumber === data.profile.semester);
  const currentMilestones = currentSemesterRoadmap?.milestones || [];
  const completedMilestones = currentMilestones.filter((m) => m.completed).length;
  const milestonePercent = currentMilestones.length > 0 ? Math.round((completedMilestones / currentMilestones.length) * 100) : 0;
  const activeMilestone = currentMilestones.find((m) => !m.completed) || currentMilestones[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 1. Weekly Study Activity Chart */}
      <div
        onClick={onOpenAnalytics}
        className="group cursor-pointer p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#181335] via-[#100E22] to-[#080614] border border-[#B46CFF]/30 hover:border-[#B46CFF]/60 hover:shadow-[0_12px_40px_rgba(139,61,255,0.25)] transition-all shadow-[0_16px_45px_rgba(0,0,0,0.7)] backdrop-blur-xl flex flex-col justify-between relative overflow-hidden"
      >
        {/* Top hairline specular rail */}
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00F0FF]/50 via-[#B46CFF]/70 to-transparent pointer-events-none" />

        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[#8B3DFF]/20 text-[#B46CFF] border border-[#B46CFF]/35 shadow-[0_0_12px_rgba(139,61,255,0.3)]">
                <TrendingUp size={16} />
              </span>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">Weekly Study Activity</h3>
                <p className="text-[11px] text-[#AAA9C6]">Logged study hours across 7 days</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold shadow-[0_0_12px_rgba(245,158,11,0.2)]">
              <Flame size={14} className="fill-amber-400 text-amber-400 animate-pulse" />
              <span>{streakDays}d Streak</span>
            </div>
          </div>

          {/* 7-Day Bar Columns with guaranteed height */}
          <div className="flex items-end justify-between gap-2 h-28 my-3 px-1">
            {weeklyData.map((d, i) => {
              const heightPercent = Math.max(14, Math.round((d.hours / maxHours) * 100));
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[10px] text-[#AAA9C6] tabular-nums font-mono">
                    {d.hours > 0 ? `${d.hours}h` : '-'}
                  </span>
                  <div className="w-full max-w-[28px] h-[70px] flex items-end">
                    <motion.div
                      initial={{ height: '0%' }}
                      animate={{ height: `${heightPercent}%` }}
                      transition={{
                        type: 'spring',
                        stiffness: 120,
                        damping: 14,
                        delay: i * 0.04,
                      }}
                      className={`w-full rounded-t-lg transition-all ${
                        d.isToday
                          ? 'bg-gradient-to-t from-[#8B3DFF] via-[#B46CFF] to-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.6)]'
                          : d.hours > 0
                          ? 'bg-gradient-to-t from-[#8B3DFF]/80 to-[#B46CFF]'
                          : 'bg-[#16132D]'
                      }`}
                    />
                  </div>
                  <span
                    className={`text-[11px] font-bold ${
                      d.isToday ? 'text-[#00F0FF]' : 'text-[#AAA9C6]'
                    }`}
                  >
                    {d.dayLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[#B46CFF]/15 text-[11px] text-[#AAA9C6] mt-2">
          <span>
            Total: <strong className="text-white font-mono">{totalWeeklyHours.toFixed(1)}h</strong> / {data.profile.weeklyStudyTargetHours}h target
          </span>
          <span className="text-[#00F0FF] font-bold group-hover:underline flex items-center gap-1">
            <span>Velocity Analytics</span>
            <ChevronRight size={12} />
          </span>
        </div>
      </div>

      {/* 2. Next Upcoming Task & Current Roadmap Milestone */}
      <div className="flex flex-col gap-3.5">
        {/* Next Task Card */}
        <div
          onClick={onOpenPomodoro}
          className="group cursor-pointer p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-[#181335] via-[#100E22] to-[#080614] border border-[#B46CFF]/30 hover:border-[#B46CFF]/50 transition-all shadow-[0_12px_35px_rgba(0,0,0,0.6)] backdrop-blur-xl flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#FF2E93]/60 to-transparent pointer-events-none" />

          <div className="flex items-center justify-between mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FF2E93]/20 border border-[#FF2E93]/35 text-[10px] font-extrabold text-[#FF2E93] uppercase tracking-wider shadow-[0_0_10px_rgba(255,46,147,0.3)]">
              Next Upcoming Session
            </span>
            <span className="text-xs text-[#00F0FF] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Start Focus</span>
              <Play size={11} className="fill-[#00F0FF]" />
            </span>
          </div>

          {nextTask ? (
            <div className="space-y-1">
              <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-[#00F0FF] transition-colors truncate">
                {nextTask.title}
              </h4>
              <div className="flex items-center gap-3 text-xs text-[#AAA9C6]">
                <span className="flex items-center gap-1 font-mono">
                  <Clock size={12} className="text-[#00F0FF]" />
                  {nextTask.startTime}
                </span>
                <span>•</span>
                <span>{nextTask.durationMinutes} min focus session</span>
              </div>
            </div>
          ) : (
            <div className="py-2 text-xs text-[#AAA9C6]">
              All today's tasks completed. Ready for tomorrow's roadmap goal!
            </div>
          )}
        </div>

        {/* Current Academic Focus Module Card */}
        <div
          onClick={onOpenLearningHub}
          className="group cursor-pointer p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-[#181335] via-[#100E22] to-[#080614] border border-[#B46CFF]/30 hover:border-[#B46CFF]/50 transition-all shadow-[0_12px_35px_rgba(0,0,0,0.6)] backdrop-blur-xl flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00FF9D]/60 to-transparent pointer-events-none" />

          <div className="flex items-center justify-between mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#00FF9D]/20 border border-[#00FF9D]/35 text-[10px] font-extrabold text-[#00FF9D] uppercase tracking-wider shadow-[0_0_10px_rgba(0,255,157,0.3)]">
              Active Focus Module
            </span>
            <span className="text-xs text-[#00FF9D] font-mono font-bold">
              Semester {data.profile.semester}
            </span>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-[#00FF9D] transition-colors truncate">
              {data.subjects[0]?.name || activeMilestone?.title || 'Core Data Structures & Algorithms'}
            </h4>
            <div className="flex items-center justify-between text-xs text-[#AAA9C6] pt-1">
              <span>Syllabus Topics & Practice</span>
              <span className="text-[#B46CFF] font-bold flex items-center gap-1 group-hover:underline">
                <span>Learning Hub</span>
                <ChevronRight size={12} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
