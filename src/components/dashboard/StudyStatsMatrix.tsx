import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Trophy,
  ArrowUpRight,
  Sparkles,
  Check,
  Menu,
} from 'lucide-react';
import { ProgressBar } from '../common/ProgressBar';

interface StudyStatsMatrixProps {
  onOpenAnalytics: () => void;
  onOpenLearningHub: () => void;
}

export const StudyStatsMatrix: React.FC<StudyStatsMatrixProps> = ({
  onOpenAnalytics,
  onOpenLearningHub,
}) => {
  const { data, userLevel, totalXp } = useApp();

  const totalCourses = data.subjects.length;
  const completedCourses = data.subjects.filter(
    (s) => s.completedLectures >= s.totalLectures && s.totalLectures > 0
  ).length;

  // Level progress
  const xpInCurrentLevel = totalXp % 300;
  const levelProgressPercent = Math.min(100, Math.round((xpInCurrentLevel / 300) * 100));

  // Compute 7 days of activity for daily streak checkmarks & dot matrix
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dayLetters = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const todayDate = new Date();
  const currentDayIndex = (todayDate.getDay() + 6) % 7; // 0 for Mon, 6 for Sun

  const dayActivity = daysOfWeek.map((dayLabel, index) => {
    const dayOffset = index - currentDayIndex;
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + dayOffset);
    const dateStr = targetDate.toISOString().split('T')[0];

    const logsForDay = data.studyLogs.filter((log) => log.date === dateStr);
    const totalMinutes = logsForDay.reduce((sum, log) => sum + log.durationMinutes, 0);
    const hours = Number((totalMinutes / 60).toFixed(1));
    const isCompleted = hours > 0;

    return {
      dayLetter: dayLetters[index],
      dayLabel,
      hours,
      isCompleted,
      isToday: index === currentDayIndex,
    };
  });

  return (
    <div className="space-y-4">
      {/* Level Card with Spring-Physics Progress Bar */}
      <div className="p-4 rounded-3xl bg-[#13111C]/80 border border-purple-500/20 backdrop-blur-xl flex items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shadow-[0_0_12px_rgba(169,112,255,0.3)]">
            <Sparkles size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-tight">Level {userLevel}</span>
              <span className="text-[11px] text-[#9E99AF]">· {totalXp} XP</span>
            </div>
            <div className="text-[11px] text-[#9E99AF] mt-0.5">
              {300 - xpInCurrentLevel} XP to Level {userLevel + 1}
            </div>
          </div>
        </div>

        {/* Spring-physics animated ProgressBar */}
        <div className="w-28 sm:w-36">
          <ProgressBar progress={levelProgressPercent} height={6} />
          <span className="text-[10px] text-[#9E99AF] block text-right mt-1 tabular-nums font-mono">
            {levelProgressPercent}%
          </span>
        </div>
      </div>

      {/* Two Stats Cards: Total courses & Completed */}
      <div className="grid grid-cols-2 gap-3.5">
        <div
          onClick={onOpenLearningHub}
          className="cursor-pointer p-4 rounded-3xl bg-[#13111C]/80 border border-purple-500/20 backdrop-blur-xl hover:border-purple-500/40 hover:bg-[#1A1629]/90 transition-all shadow-md"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center text-xs">
              🎫
            </div>
            <span className="text-xs text-[#9E99AF] font-medium">Total courses</span>
          </div>
          <div className="text-3xl font-extrabold text-white tabular-nums tracking-tight">
            {totalCourses}
          </div>
        </div>

        <div
          onClick={onOpenLearningHub}
          className="cursor-pointer p-4 rounded-3xl bg-[#13111C]/80 border border-purple-500/20 backdrop-blur-xl hover:border-purple-500/40 hover:bg-[#1A1629]/90 transition-all shadow-md"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center">
              <Trophy size={14} />
            </div>
            <span className="text-xs text-[#9E99AF] font-medium">Completed</span>
          </div>
          <div className="text-3xl font-extrabold text-white tabular-nums tracking-tight">
            {completedCourses}
          </div>
        </div>
      </div>

      {/* Daily Streaks Section with Hexagonal Checkmark Badges */}
      <div
        onClick={onOpenAnalytics}
        className="cursor-pointer p-4 sm:p-5 rounded-3xl bg-[#13111C]/80 border border-purple-500/20 backdrop-blur-xl hover:border-purple-500/35 transition-all space-y-3 shadow-md"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white tracking-tight">Daily Streaks</h3>
          <ArrowUpRight size={16} className="text-[#9E99AF] hover:text-white transition-colors" />
        </div>

        {/* M T W T F S S Day Badges */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {dayActivity.map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <span className={`text-[11px] font-medium ${day.isToday ? 'text-purple-300 font-bold' : 'text-[#8E8A9C]'}`}>
                {day.dayLetter}
              </span>

              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center transition-all ${
                  day.isCompleted
                    ? 'bg-gradient-to-tr from-[#8B5CF6] to-[#A970FF] text-white shadow-[0_0_15px_rgba(169,112,255,0.4)]'
                    : day.isToday
                    ? 'bg-[#201C33] border border-purple-500/40 text-purple-300'
                    : 'bg-[#181626] border border-purple-500/15 text-[#5A5469]'
                }`}
              >
                {day.isCompleted ? (
                  <Check size={18} strokeWidth={3} />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-current opacity-40" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Highest Study Hour Dot-Matrix Graph */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#13111C]/80 border border-purple-500/20 backdrop-blur-xl space-y-4 shadow-md">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white tracking-tight">Highest Study hour</h3>
          <button className="text-[#9E99AF] hover:text-white transition-colors" aria-label="Menu">
            <Menu size={16} />
          </button>
        </div>

        <div className="flex gap-3">
          <div className="flex flex-col justify-between text-[10px] text-[#9E99AF] font-mono tabular-nums h-36 py-1 select-none">
            <span>6h</span>
            <span>5h</span>
            <span>4h</span>
            <span>3h</span>
            <span>2h</span>
            <span>1h</span>
            <span>0</span>
          </div>

          <div className="flex-1 flex justify-between gap-1 h-36">
            {dayActivity.map((day, colIdx) => (
              <div key={colIdx} className="flex-1 flex flex-col justify-between items-center py-1">
                {[6, 5, 4, 3, 2, 1].map((level) => {
                  const isLit = day.hours >= level;
                  const isPeak = isLit && (day.hours < level + 1 || level === 6);

                  return (
                    <div
                      key={level}
                      className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                        isPeak
                          ? 'bg-white shadow-[0_0_10px_#ffffff,0_0_15px_#a970ff] scale-110'
                          : isLit
                          ? 'bg-[#A970FF] shadow-[0_0_8px_rgba(169,112,255,0.7)]'
                          : 'bg-[#201C33]'
                      }`}
                    />
                  );
                })}
                <div
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all ${
                    day.hours > 0 ? 'bg-[#A970FF]' : 'bg-[#201C33]'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between pl-6 text-[10px] text-[#9E99AF] font-medium select-none">
          {dayActivity.map((d, i) => (
            <span key={i} className={`flex-1 text-center ${d.isToday ? 'text-purple-300 font-bold' : ''}`}>
              {d.dayLabel}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
