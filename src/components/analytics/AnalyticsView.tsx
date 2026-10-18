import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProgressRing } from '../common/ProgressRing';
import { ProgressBar } from '../common/ProgressBar';
import {
  BarChart3,
  Calendar,
  Flame,
  CheckCircle2,
  Clock,
  BookOpen,
  FolderGit2,
  TrendingUp,
  Download,
} from 'lucide-react';
import { generateRoadmapProgressPDF } from '../../utils/pdfGenerator';
import { soundEffects } from '../../services/soundEffects';

export const AnalyticsView: React.FC = () => {
  const {
    data,
    streakDays,
    overallRoadmapProgress,
    overallSubjectProgress,
    overallCgpa,
  } = useApp();

  const [timeFilter, setTimeFilter] = useState<'7d' | '30d' | 'all'>('7d');
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  // Compute total logged study minutes
  const totalStudyMinutes = data.studyLogs.reduce((sum, log) => sum + log.durationMinutes, 0);
  const totalStudyHours = (totalStudyMinutes / 60).toFixed(1);

  // Compute completed tasks ratio
  const totalTasks = data.tasks.length;
  const completedTasks = data.tasks.filter((t) => t.status === 'completed').length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Study hours per subject
  const subjectHours = data.subjects.map((sub) => {
    const logs = data.studyLogs.filter((l) => l.subjectId === sub.id);
    const mins = logs.reduce((sum, l) => sum + l.durationMinutes, 0);
    return {
      name: sub.name.split('&')[0].trim(),
      code: sub.code,
      hours: Number((mins / 60).toFixed(1)),
      lecturesPercent: Math.round((sub.completedLectures / sub.totalLectures) * 100),
    };
  });

  const maxSubjectHours = Math.max(1, ...subjectHours.map((s) => s.hours));

  // Past 7 Days activity for bar chart
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayDate = new Date();
  const currentDayIndex = (todayDate.getDay() + 6) % 7;

  const weeklyBars = daysOfWeek.map((dayLabel, index) => {
    const dayOffset = index - currentDayIndex;
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + dayOffset);
    const dateStr = targetDate.toISOString().split('T')[0];

    const logsForDay = data.studyLogs.filter((log) => log.date === dateStr);
    const totalMinutes = logsForDay.reduce((sum, log) => sum + log.durationMinutes, 0);
    const hours = Number((totalMinutes / 60).toFixed(1));

    return {
      dayLabel,
      dateStr,
      hours,
      isToday: index === currentDayIndex,
    };
  });

  const maxWeeklyHours = Math.max(3, ...weeklyBars.map((b) => b.hours));

  const handleDownloadProgressPDF = () => {
    try {
      setIsExportingPDF(true);
      soundEffects.playLevelUp();
      generateRoadmapProgressPDF({
        name: data.profile.name,
        semester: data.profile.semester,
        college: data.profile.college,
        targetRole: data.profile.targetRole,
        cgpa: overallCgpa,
        streakDays: streakDays,
        overallProgress: overallRoadmapProgress,
        roadmap: data.roadmap,
        subjects: data.subjects,
        projects: data.projects,
      });
    } catch (err) {
      console.error('Failed to generate roadmap progress PDF', err);
    } finally {
      setIsExportingPDF(false);
    }
  };

  return (
    <div className="space-y-6 pb-24 lg:pb-12 animate-fadeIn max-w-5xl mx-auto">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#161424] border border-purple-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 size={18} className="text-purple-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Progress & Learning Analytics
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#9E99AF]">
            Real-time insights derived from your logged study sessions and completed tasks
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#1D192E] border border-purple-500/20 self-start sm:self-auto">
            {[
              { id: '7d', label: '7 Days' },
              { id: '30d', label: '30 Days' },
              { id: 'all', label: 'All Time' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setTimeFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  timeFilter === f.id
                    ? 'bg-purple-600 text-white font-semibold shadow-sm'
                    : 'text-[#9E99AF] hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleDownloadProgressPDF}
            disabled={isExportingPDF}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#8B3DFF] to-[#00F0FF] hover:brightness-110 active:scale-95 text-white text-xs font-bold shadow-[0_0_15px_rgba(139,61,255,0.4)] transition-all cursor-pointer border border-white/20 disabled:opacity-50"
            title="Download detailed academic roadmap progress report in PDF format"
          >
            <Download size={13} className={isExportingPDF ? 'animate-bounce' : ''} />
            <span>{isExportingPDF ? 'Exporting...' : 'Export Progress PDF'}</span>
          </button>
        </div>
      </div>

      {/* Top High-Level Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-[#161424] border border-purple-500/20 space-y-1">
          <div className="flex items-center justify-between text-[#9E99AF] text-xs">
            <span>Total Study Time</span>
            <Clock size={15} className="text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">{totalStudyHours} hrs</div>
          <p className="text-[11px] text-purple-300">Across all BCA modules</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#161424] border border-purple-500/20 space-y-1">
          <div className="flex items-center justify-between text-[#9E99AF] text-xs">
            <span>Current Streak</span>
            <Flame size={15} className="text-amber-400 fill-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 tabular-nums">{streakDays} Days</div>
          <p className="text-[11px] text-[#9E99AF]">Consistent daily study</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#161424] border border-purple-500/20 space-y-1">
          <div className="flex items-center justify-between text-[#9E99AF] text-xs">
            <span>Tasks Completed</span>
            <CheckCircle2 size={15} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">
            {completedTasks} / {totalTasks}
          </div>
          <p className="text-[11px] text-emerald-300">{taskCompletionRate}% execution rate</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#161424] border border-purple-500/20 space-y-1">
          <div className="flex items-center justify-between text-[#9E99AF] text-xs">
            <span>Curriculum Completion</span>
            <TrendingUp size={15} className="text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">{overallSubjectProgress}%</div>
          <p className="text-[11px] text-blue-300">All BCA subjects</p>
        </div>
      </div>

      {/* Two Column Section: Weekly Hours Bar Chart + Curriculum Progress Ring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Weekly Bar Chart */}
        <div className="p-5 rounded-2xl bg-[#161424] border border-purple-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Daily Study Activity</h3>
            <span className="text-xs text-[#9E99AF]">Target: {data.profile.dailyStudyTargetHours}h / day</span>
          </div>

          <div className="flex items-end justify-between gap-3 h-40 pt-4 px-2">
            {weeklyBars.map((bar, i) => {
              const heightPercent = Math.max(10, Math.round((bar.hours / maxWeeklyHours) * 100));
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[10px] text-[#9E99AF] font-mono tabular-nums">
                    {bar.hours > 0 ? `${bar.hours}h` : '0'}
                  </span>
                  <div className="w-full max-w-[36px] h-full flex items-end">
                    <div
                      className={`w-full rounded-t-xl transition-all duration-700 ${
                        bar.isToday
                          ? 'bg-gradient-to-t from-[#8B5CF6] via-[#A970FF] to-[#657BFF] shadow-[0_0_15px_rgba(169,112,255,0.4)]'
                          : bar.hours > 0
                          ? 'bg-gradient-to-t from-purple-800 to-purple-600'
                          : 'bg-[#201C33]'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      bar.isToday ? 'text-purple-300 font-bold' : 'text-[#9E99AF]'
                    }`}
                  >
                    {bar.dayLabel}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-xl bg-[#1D192E] border border-purple-500/10 text-xs text-[#9E99AF] flex items-center justify-between">
            <span>Logs count: {data.studyLogs.length} logged sessions</span>
            <span className="text-purple-300 font-semibold">
              Weekly target: {data.profile.weeklyStudyTargetHours}h
            </span>
          </div>
        </div>

        {/* Curriculum Ring Breakdown */}
        <div className="p-5 rounded-2xl bg-[#161424] border border-purple-500/20 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Degree Completion Engine</h3>
            <span className="text-xs text-purple-300">Sem {data.profile.semester} · BCA</span>
          </div>

          <div className="flex items-center justify-around py-3">
            <div className="text-center space-y-2">
              <ProgressRing progress={taskCompletionRate} size={110} strokeWidth={9} sublabel="Tasks" />
              <div className="text-xs text-[#AAA5B6] font-medium">Task Velocity</div>
            </div>

            <div className="text-center space-y-2">
              <ProgressRing progress={overallSubjectProgress} size={110} strokeWidth={9} gradientId="emeraldGradient" sublabel="Lectures" />
              <div className="text-xs text-[#AAA5B6] font-medium">Total Lectures</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-[#1D192E] border border-purple-500/10">
              <span className="text-[#9E99AF] block text-[10px]">Projects Active</span>
              <span className="font-bold text-white text-sm">
                {data.projects.filter((p) => p.status === 'in_progress').length} In Progress
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#1D192E] border border-purple-500/10">
              <span className="text-[#9E99AF] block text-[10px]">DSA Solved</span>
              <span className="font-bold text-white text-sm">
                {data.dsaTopics.reduce((acc, t) => acc + t.solvedEasy + t.solvedMedium + t.solvedHard, 0)} Problems
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Subject-Wise Time Allocation Bars */}
      <div className="p-5 rounded-2xl bg-[#161424] border border-purple-500/20 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Subject-Wise Study Investment</h3>
          <span className="text-xs text-[#9E99AF]">Hours & lecture completion rate</span>
        </div>

        <div className="space-y-3">
          {subjectHours.map((sub, i) => {
            const barWidth = maxSubjectHours > 0 ? Math.max(5, (sub.hours / maxSubjectHours) * 100) : 5;
            return (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">
                    {sub.name} <span className="text-[#9E99AF] text-[11px] font-normal">({sub.code})</span>
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-purple-300 font-mono font-bold tabular-nums">{sub.hours} hrs</span>
                    <span className="text-[#9E99AF] text-[11px] tabular-nums">({sub.lecturesPercent}% lectures)</span>
                  </div>
                </div>

                <div className="w-full h-2 rounded-full bg-[#201C33] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 transition-all duration-500"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
