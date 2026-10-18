import React from 'react';
import { useApp } from '../../context/AppContext';
import { getTodayString } from '../../data/initialData';
import { CheckCircle2, Circle, Clock, Plus, BookOpen, AlertCircle } from 'lucide-react';

interface DailyFocusSectionProps {
  onOpenAddTask: () => void;
  onOpenPlanner: () => void;
}

export const DailyFocusSection: React.FC<DailyFocusSectionProps> = ({
  onOpenAddTask,
  onOpenPlanner,
}) => {
  const { data, toggleTaskComplete } = useApp();
  const today = getTodayString(0);
  const todayTasks = data.tasks.filter((t) => t.date === today);

  const getSubjectName = (subjectId: string) => {
    const sub = data.subjects.find((s) => s.id === subjectId);
    return sub ? sub.name : 'General Task';
  };

  const priorityStyles = {
    high: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    low: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  };

  return (
    <div className="rounded-2xl bg-[#161424] border border-purple-500/20 p-5 shadow-[0_4px_25px_rgba(0,0,0,0.4)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-white tracking-tight">
            Today's Focus & Study Tasks
          </h3>
          <p className="text-xs text-[#9E99AF]">
            {todayTasks.filter((t) => t.status === 'completed').length} of {todayTasks.length} tasks completed today
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAddTask}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 text-xs font-medium border border-purple-500/25 transition-colors"
          >
            <Plus size={14} />
            <span>Add</span>
          </button>
          <button
            onClick={onOpenPlanner}
            className="text-xs text-purple-300 hover:text-white transition-colors"
          >
            View All
          </button>
        </div>
      </div>

      {/* Task list */}
      {todayTasks.length === 0 ? (
        <div className="text-center py-8 px-4 rounded-xl bg-[#1A1629] border border-dashed border-purple-500/20">
          <BookOpen size={28} className="mx-auto text-purple-400/50 mb-2" />
          <p className="text-xs text-[#9E99AF]">No tasks planned for today yet.</p>
          <button
            onClick={onOpenAddTask}
            className="mt-3 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-medium inline-flex items-center gap-1.5"
          >
            <Plus size={13} />
            <span>Schedule a Study Session</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {todayTasks.map((task) => {
            const isDone = task.status === 'completed';
            return (
              <div
                key={task.id}
                className={`group flex items-start sm:items-center justify-between gap-3 p-3 sm:p-3.5 rounded-xl border transition-all ${
                  isDone
                    ? 'bg-[#151221]/70 border-purple-500/10 opacity-75'
                    : 'bg-[#1D192E] border-purple-500/20 hover:border-purple-500/40 hover:bg-[#221D36]'
                }`}
              >
                {/* Checkbox & title */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => toggleTaskComplete(task.id)}
                    className="mt-0.5 sm:mt-0 text-purple-400 hover:text-purple-300 transition-colors shrink-0"
                    aria-label={isDone ? 'Mark task as incomplete' : 'Mark task as complete'}
                  >
                    {isDone ? (
                      <CheckCircle2 size={20} className="text-emerald-400 fill-emerald-400/20" />
                    ) : (
                      <Circle size={20} className="text-[#9E99AF] hover:text-purple-400" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-xs sm:text-sm font-medium leading-snug truncate ${
                        isDone ? 'line-through text-[#878296]' : 'text-white'
                      }`}
                    >
                      {task.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-[#9E99AF]">
                      <span className="text-purple-300 truncate max-w-[140px] sm:max-w-none">
                        {getSubjectName(task.subjectId)}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 tabular-nums">
                        <Clock size={11} />
                        {task.startTime} ({task.durationMinutes}m)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Priority pill */}
                <div className="shrink-0 flex items-center gap-2">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border uppercase tracking-wider ${
                      priorityStyles[task.priority]
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
