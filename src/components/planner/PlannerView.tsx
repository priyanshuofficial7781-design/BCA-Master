import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PlannerTask } from '../../types';
import { getTodayString } from '../../data/initialData';
import { TaskModal } from './TaskModal';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  CheckCircle2,
  Circle,
  Sparkles,
  Edit2,
  Trash2,
  BookOpen,
} from 'lucide-react';

export const PlannerView: React.FC = () => {
  const { data, toggleTaskComplete, deleteTask, addTask } = useApp();

  const [selectedDate, setSelectedDate] = useState<string>(getTodayString(0));
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<PlannerTask | null>(null);

  // Navigate date
  const changeDate = (days: number) => {
    const cur = new Date(selectedDate);
    cur.setDate(cur.getDate() + days);
    setSelectedDate(cur.toISOString().split('T')[0]);
  };

  const setDateToToday = () => {
    setSelectedDate(getTodayString(0));
  };

  // Filter tasks for current view
  const currentDayTasks = data.tasks.filter((t) => {
    const matchesDate = t.date === selectedDate;
    const matchesSubject = subjectFilter === 'all' || t.subjectId === subjectFilter;
    return matchesDate && matchesSubject;
  });

  // Calculate day stats
  const totalDayMinutes = currentDayTasks.reduce((sum, t) => sum + t.durationMinutes, 0);
  const completedDayMinutes = currentDayTasks
    .filter((t) => t.status === 'completed')
    .reduce((sum, t) => sum + t.durationMinutes, 0);

  const targetDayMinutes = (data.profile.dailyStudyTargetHours || 3.5) * 60;
  const remainingMinutes = Math.max(0, targetDayMinutes - completedDayMinutes);

  // Quick Study Session Generator
  const handleGenerateSmartSessions = () => {
    // Generate 3 balanced BCA study sessions for the selected day
    const newSessions = [
      {
        title: 'C++ & DSA: Tree Traversals & Recursion Practice',
        subjectId: 'sub-cpp-dsa',
        date: selectedDate,
        startTime: '09:30',
        durationMinutes: 60,
        priority: 'high' as const,
        status: 'todo' as const,
        notes: 'Target: Inorder & Postorder reconstruction problems.',
      },
      {
        title: 'Quantitative Aptitude: Speed Math & Ratio Drills',
        subjectId: 'sub-aptitude',
        date: selectedDate,
        startTime: '14:00',
        durationMinutes: 45,
        priority: 'medium' as const,
        status: 'todo' as const,
        notes: 'Target: Solve 12 questions within 30 minutes.',
      },
      {
        title: 'Core Subject Revision: Operating Systems Memory Management',
        subjectId: 'sub-coa',
        date: selectedDate,
        startTime: '17:30',
        durationMinutes: 45,
        priority: 'medium' as const,
        status: 'todo' as const,
        notes: 'Target: Paging, Page faults, and LRU replacement algorithm.',
      },
    ];

    newSessions.forEach((session) => {
      // Check if session with same title on this date exists
      const exists = data.tasks.some((t) => t.date === selectedDate && t.title === session.title);
      if (!exists) {
        addTask(session);
      }
    });
  };

  const getSubjectName = (subjectId: string) => {
    const sub = data.subjects.find((s) => s.id === subjectId);
    return sub ? sub.name : 'Curriculum Subject';
  };

  return (
    <div className="space-y-6 pb-24 lg:pb-12 animate-fadeIn max-w-5xl mx-auto">
      {/* Header & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Smart Study Planner
          </h2>
          <p className="text-xs sm:text-sm text-[#9E99AF]">
            Plan balanced BCA daily study sessions with zero burnout
          </p>
        </div>

        {/* View toggle (Day / Week / Month) */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#161424] border border-purple-500/20 shrink-0 self-start sm:self-auto">
          {(['day', 'week', 'month'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                viewMode === mode
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-[#9E99AF] hover:text-white'
              }`}
            >
              {mode} View
            </button>
          ))}
        </div>
      </div>

      {/* Date Navigation & Smart Generator Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-2xl bg-[#161424] border border-purple-500/20">
        {/* Date scroller */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => changeDate(-1)}
            className="w-8 h-8 rounded-lg bg-[#201C33] hover:bg-[#2B2544] text-[#9E99AF] hover:text-white flex items-center justify-center transition-colors"
            title="Previous Day"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1D192E] border border-purple-500/20 text-white text-xs sm:text-sm font-semibold">
            <CalendarIcon size={14} className="text-purple-400" />
            <span>
              {new Date(selectedDate).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>

          <button
            onClick={() => changeDate(1)}
            className="w-8 h-8 rounded-lg bg-[#201C33] hover:bg-[#2B2544] text-[#9E99AF] hover:text-white flex items-center justify-center transition-colors"
            title="Next Day"
          >
            <ChevronRight size={16} />
          </button>

          <button
            onClick={setDateToToday}
            className="px-2.5 py-1.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 text-xs font-medium border border-purple-500/20 transition-colors"
          >
            Today
          </button>
        </div>

        {/* Actions: Add task & Smart Generator */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleGenerateSmartSessions}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 text-xs font-medium border border-purple-500/30 transition-colors"
            title="Generate suggested sessions according to daily target hours"
          >
            <Sparkles size={14} className="text-purple-300" />
            <span>Suggest Sessions</span>
          </button>

          <button
            onClick={() => {
              setEditingTask(null);
              setIsTaskModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(139,92,246,0.35)] transition-all active:scale-95"
          >
            <Plus size={15} />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Daily Progress Gauge Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[#161424] border border-purple-500/15">
          <span className="text-[11px] text-[#9E99AF]">Scheduled Time</span>
          <p className="text-lg font-bold text-white tabular-nums mt-0.5">
            {(totalDayMinutes / 60).toFixed(1)} hrs
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#161424] border border-purple-500/15">
          <span className="text-[11px] text-[#9E99AF]">Completed Time</span>
          <p className="text-lg font-bold text-emerald-400 tabular-nums mt-0.5">
            {(completedDayMinutes / 60).toFixed(1)} hrs
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#161424] border border-purple-500/15">
          <span className="text-[11px] text-[#9E99AF]">Daily Goal</span>
          <p className="text-lg font-bold text-purple-300 tabular-nums mt-0.5">
            {data.profile.dailyStudyTargetHours} hrs
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#161424] border border-purple-500/15">
          <span className="text-[11px] text-[#9E99AF]">Remaining To Goal</span>
          <p className="text-lg font-bold text-amber-400 tabular-nums mt-0.5">
            {(remainingMinutes / 60).toFixed(1)} hrs
          </p>
        </div>
      </div>

      {/* Subject Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSubjectFilter('all')}
          className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
            subjectFilter === 'all'
              ? 'bg-purple-600 text-white font-semibold'
              : 'bg-[#161424] text-[#9E99AF] hover:text-white border border-purple-500/15'
          }`}
        >
          All Subjects ({data.tasks.filter((t) => t.date === selectedDate).length})
        </button>
        {data.subjects.map((sub) => {
          const count = data.tasks.filter(
            (t) => t.date === selectedDate && t.subjectId === sub.id
          ).length;
          return (
            <button
              key={sub.id}
              onClick={() => setSubjectFilter(sub.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                subjectFilter === sub.id
                  ? 'bg-purple-600 text-white font-semibold'
                  : 'bg-[#161424] text-[#9E99AF] hover:text-white border border-purple-500/15'
              }`}
            >
              {sub.name.split('&')[0]} ({count})
            </button>
          );
        })}
      </div>

      {/* Tasks List for Selected View */}
      {currentDayTasks.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl bg-[#161424] border border-dashed border-purple-500/25">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/20 mx-auto flex items-center justify-center text-purple-400 mb-3">
            <BookOpen size={24} />
          </div>
          <h3 className="text-base font-semibold text-white">No Study Sessions Scheduled</h3>
          <p className="text-xs text-[#9E99AF] max-w-sm mx-auto mt-1 mb-5">
            Keep your momentum going! Click below to create a custom study session or auto-generate a balanced schedule.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleGenerateSmartSessions}
              className="px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 text-xs font-semibold border border-purple-500/30 flex items-center gap-1.5 transition-colors"
            >
              <Sparkles size={14} />
              <span>Generate Smart Schedule</span>
            </button>
            <button
              onClick={() => {
                setEditingTask(null);
                setIsTaskModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-semibold shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all flex items-center gap-1.5"
            >
              <Plus size={14} />
              <span>Add Custom Task</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {currentDayTasks
            .sort((a, b) => a.startTime.localeCompare(b.startTime))
            .map((task) => {
              const isDone = task.status === 'completed';
              return (
                <div
                  key={task.id}
                  className={`group p-4 rounded-2xl border transition-all ${
                    isDone
                      ? 'bg-[#151221]/70 border-purple-500/10'
                      : 'bg-[#161424] border-purple-500/20 hover:border-purple-500/40 hover:bg-[#1A162B]'
                  }`}
                >
                  <div className="flex items-start sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <button
                        type="button"
                        onClick={() => toggleTaskComplete(task.id)}
                        className="mt-0.5 sm:mt-0 text-purple-400 hover:text-purple-300 transition-colors shrink-0"
                        title={isDone ? 'Mark as todo' : 'Mark as completed'}
                      >
                        {isDone ? (
                          <CheckCircle2 size={22} className="text-emerald-400 fill-emerald-400/20" />
                        ) : (
                          <Circle size={22} className="text-[#9E99AF] hover:text-purple-400" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <h4
                          className={`text-sm sm:text-base font-semibold leading-snug ${
                            isDone ? 'line-through text-[#878296]' : 'text-white'
                          }`}
                        >
                          {task.title}
                        </h4>

                        <div className="flex flex-wrap items-center gap-2.5 mt-1.5 text-xs text-[#9E99AF]">
                          <span className="text-purple-300 font-medium">
                            {getSubjectName(task.subjectId)}
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1 tabular-nums text-white">
                            <Clock size={12} className="text-purple-400" />
                            {task.startTime} ({task.durationMinutes} mins)
                          </span>
                          <span>·</span>
                          <span
                            className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${
                              task.priority === 'high'
                                ? 'text-rose-400 border-rose-500/30 bg-rose-500/10'
                                : task.priority === 'medium'
                                ? 'text-amber-400 border-amber-500/30 bg-amber-500/10'
                                : 'text-blue-400 border-blue-500/30 bg-blue-500/10'
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>

                        {task.notes && (
                          <p className="text-xs text-[#9E99AF] mt-2 italic bg-[#1F1B30] p-2 rounded-lg border border-purple-500/10">
                            {task.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions: Edit & Delete */}
                    <div className="flex items-center gap-1.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditingTask(task);
                          setIsTaskModalOpen(true);
                        }}
                        className="w-8 h-8 rounded-lg bg-[#201C33] hover:bg-[#2C2547] text-[#9E99AF] hover:text-white flex items-center justify-center transition-colors"
                        title="Edit Task"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="w-8 h-8 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 flex items-center justify-center transition-colors"
                        title="Delete Task"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Task Modal (Create & Edit) */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        initialTask={editingTask}
        defaultDate={selectedDate}
      />
    </div>
  );
};
