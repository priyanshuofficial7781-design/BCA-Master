import React from 'react';
import { useApp } from '../../context/AppContext';
import { getTodayString } from '../../data/initialData';
import {
  CheckCircle2,
  Circle,
  Clock,
  Plus,
  BookOpen,
  Calendar,
  Binary,
  Layers,
  Code,
  Shield,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface CollageTodaysPlanProps {
  onOpenAddTask: () => void;
  onOpenPlanner: () => void;
}

export const CollageTodaysPlan: React.FC<CollageTodaysPlanProps> = ({
  onOpenAddTask,
  onOpenPlanner,
}) => {
  const { data, toggleTaskComplete } = useApp();
  const today = getTodayString(0);
  const todayTasks = data.tasks.filter((t) => t.date === today);

  const completedCount = todayTasks.filter((t) => t.status === 'completed').length;
  const progressPercent = todayTasks.length > 0 ? Math.round((completedCount / todayTasks.length) * 100) : 0;

  const getSubjectDetails = (subjectId: string) => {
    const sub = data.subjects.find((s) => s.id === subjectId);
    if (!sub) return { name: 'General CS Task', icon: <BookOpen size={16} className="text-[#8B3DFF]" /> };

    if (sub.name.includes('C++') || sub.name.includes('DSA')) {
      return { name: sub.name, icon: <Binary size={16} className="text-[#8B3DFF]" /> };
    }
    if (sub.name.includes('Math') || sub.name.includes('Discrete')) {
      return { name: sub.name, icon: <Layers size={16} className="text-[#4D79FF]" /> };
    }
    if (sub.name.includes('Python') || sub.name.includes('Web')) {
      return { name: sub.name, icon: <Code size={16} className="text-[#00FF9D]" /> };
    }
    if (sub.name.includes('Cyber') || sub.name.includes('Network')) {
      return { name: sub.name, icon: <Shield size={16} className="text-[#F59E0B]" /> };
    }
    return { name: sub.name, icon: <BookOpen size={16} className="text-[#B46CFF]" /> };
  };

  const priorityStyles: Record<string, string> = {
    high: 'text-[#FF2E93] bg-[#FF2E93]/15 border-[#FF2E93]/35 shadow-[0_0_10px_rgba(255,46,147,0.25)]',
    medium: 'text-[#F59E0B] bg-[#F59E0B]/15 border-[#F59E0B]/35',
    low: 'text-[#00F0FF] bg-[#00F0FF]/15 border-[#00F0FF]/35',
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#181335] via-[#100E22] to-[#080614] border border-[#B46CFF]/30 p-5 sm:p-6 shadow-[0_16px_45px_rgba(0,0,0,0.7),0_0_20px_rgba(139,61,255,0.18)] backdrop-blur-xl">
      {/* Top Specular Neon Rail */}
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#B46CFF]/60 via-[#00F0FF]/50 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[#B46CFF]/15">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
              Today's Plan
            </h3>
            {todayTasks.length > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#8B3DFF]/25 border border-[#B46CFF]/35 text-[11px] font-bold text-[#B46CFF] shadow-[0_0_10px_rgba(180,108,255,0.3)]">
                {completedCount} / {todayTasks.length} Done ({progressPercent}%)
              </span>
            )}
          </div>
          <p className="text-xs text-[#AAA9C6] mt-0.5">
            Scheduled lectures, problem sets & study sessions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenAddTask}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#8B3DFF] to-[#4D79FF] hover:opacity-90 text-white text-xs font-bold shadow-[0_0_15px_rgba(139,61,255,0.45)] transition-all cursor-pointer active:scale-95 border border-white/20"
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>Add Task</span>
          </button>
          <button
            type="button"
            onClick={onOpenPlanner}
            className="text-xs text-[#AAA9C6] hover:text-[#00F0FF] transition-colors px-2 py-1 flex items-center gap-1 cursor-pointer"
          >
            <span>Full Planner</span>
            <ChevronRight size={12} />
          </button>
        </div>
      </div>

      {/* Task List */}
      {todayTasks.length === 0 ? (
        <div className="text-center py-8 px-4 rounded-2xl bg-[#0A0818]/70 border border-dashed border-[#B46CFF]/20">
          <Calendar size={28} className="mx-auto text-[#B46CFF]/60 mb-2" />
          <p className="text-xs text-[#AAA9C6]">No study tasks scheduled for today.</p>
          <button
            type="button"
            onClick={onOpenAddTask}
            className="mt-3 px-4 py-2 rounded-xl bg-[#16132D] border border-[#B46CFF]/35 text-white text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-[#8B3DFF]/20 transition-all cursor-pointer shadow-sm"
          >
            <Plus size={13} />
            <span>Plan Today's First Session</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {todayTasks.map((task) => {
            const isDone = task.status === 'completed';
            const sub = getSubjectDetails(task.subjectId);

            return (
              <div
                key={task.id}
                onClick={() => toggleTaskComplete(task.id)}
                className={`group flex items-center justify-between gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer select-none ${
                  isDone
                    ? 'bg-[#0A0818]/50 border-white/5 opacity-60'
                    : 'bg-gradient-to-r from-[#14112B]/90 to-[#0F0D22]/90 border-[#B46CFF]/20 hover:border-[#B46CFF]/50 hover:shadow-[0_0_20px_rgba(139,61,255,0.2)]'
                }`}
              >
                {/* Checkbox and Details */}
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTaskComplete(task.id);
                    }}
                    className="shrink-0 text-[#8B3DFF] hover:scale-110 transition-transform cursor-pointer"
                    aria-label={isDone ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    {isDone ? (
                      <CheckCircle2 size={22} className="text-[#00FF9D] fill-[#00FF9D]/20" />
                    ) : (
                      <Circle size={22} className="text-[#AAA9C6] group-hover:text-[#B46CFF]" />
                    )}
                  </button>

                  {/* Subject Icon Box */}
                  <div className="w-8 h-8 rounded-xl bg-[#0A0818] border border-[#B46CFF]/25 flex items-center justify-center shrink-0 shadow-inner">
                    {sub.icon}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4
                      className={`text-xs sm:text-sm font-semibold truncate ${
                        isDone ? 'line-through text-[#AAA9C6]' : 'text-white'
                      }`}
                    >
                      {task.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#AAA9C6]">
                      <span className="text-[#B46CFF] truncate max-w-[150px] font-medium">{sub.name}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-mono tabular-nums text-white/90">
                        <Clock size={11} className="text-[#00F0FF]" />
                        {task.startTime} ({task.durationMinutes}m)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Priority Pill */}
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-lg border uppercase tracking-wider shrink-0 ${
                    priorityStyles[task.priority] || priorityStyles.medium
                  }`}
                >
                  {task.priority}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
