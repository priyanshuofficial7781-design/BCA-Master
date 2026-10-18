import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { PlannerTask } from '../../types';
import { getTodayString } from '../../data/initialData';
import { Clock, Calendar, AlertTriangle } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTask?: PlannerTask | null;
  defaultDate?: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  initialTask,
  defaultDate,
}) => {
  const { data, addTask, updateTask, deleteTask } = useApp();

  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState(data.subjects[0]?.id || '');
  const [date, setDate] = useState(defaultDate || getTodayString(0));
  const [startTime, setStartTime] = useState('10:00');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [notes, setNotes] = useState('');
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setSubjectId(initialTask.subjectId);
      setDate(initialTask.date);
      setStartTime(initialTask.startTime);
      setDurationMinutes(initialTask.durationMinutes);
      setPriority(initialTask.priority);
      setNotes(initialTask.notes || '');
    } else {
      setTitle('');
      setSubjectId(data.subjects[0]?.id || '');
      setDate(defaultDate || getTodayString(0));
      setStartTime('10:00');
      setDurationMinutes(45);
      setPriority('medium');
      setNotes('');
    }
  }, [initialTask, defaultDate, isOpen, data.subjects]);

  // Check for time collisions with other tasks on the same date
  useEffect(() => {
    if (!startTime || !durationMinutes || !date) {
      setConflictWarning(null);
      return;
    }

    const [startH, startM] = startTime.split(':').map(Number);
    const newStart = startH * 60 + startM;
    const newEnd = newStart + durationMinutes;

    const existingSameDay = data.tasks.filter(
      (t) => t.date === date && (!initialTask || t.id !== initialTask.id)
    );

    const collision = existingSameDay.find((t) => {
      const [exH, exM] = t.startTime.split(':').map(Number);
      const exStart = exH * 60 + exM;
      const exEnd = exStart + t.durationMinutes;
      // Overlap check
      return Math.max(newStart, exStart) < Math.min(newEnd, exEnd);
    });

    if (collision) {
      setConflictWarning(
        `Session overlaps with "${collision.title}" (${collision.startTime}, ${collision.durationMinutes}m).`
      );
    } else {
      setConflictWarning(null);
    }
  }, [startTime, durationMinutes, date, data.tasks, initialTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (initialTask) {
      updateTask(initialTask.id, {
        title: title.trim(),
        subjectId,
        date,
        startTime,
        durationMinutes: Number(durationMinutes),
        priority,
        notes: notes.trim(),
      });
    } else {
      addTask({
        title: title.trim(),
        subjectId,
        date,
        startTime,
        durationMinutes: Number(durationMinutes),
        priority,
        status: 'todo',
        notes: notes.trim(),
      });
    }

    onClose();
  };

  const handleDelete = () => {
    if (initialTask) {
      deleteTask(initialTask.id);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialTask ? 'Edit Study Task' : 'Schedule Study Session'}
      subtitle="Organize your BCA lessons, revision or coding practice"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-[#AAA5B6] uppercase tracking-wider mb-1.5">
            Task / Session Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g., Solve 3 LeetCode Binary Tree Questions"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1629] border border-purple-500/20 text-white placeholder-[#686378] text-sm focus:outline-none focus:border-purple-400"
          />
        </div>

        {/* Subject selection */}
        <div>
          <label className="block text-xs font-semibold text-[#AAA5B6] uppercase tracking-wider mb-1.5">
            Subject or Category
          </label>
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1629] border border-purple-500/20 text-white text-sm focus:outline-none focus:border-purple-400"
          >
            {data.subjects.map((sub) => (
              <option key={sub.id} value={sub.id} className="bg-[#161424] text-white">
                {sub.name} ({sub.code})
              </option>
            ))}
          </select>
        </div>

        {/* Date & Start Time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#AAA5B6] uppercase tracking-wider mb-1.5">
              <span className="flex items-center gap-1">
                <Calendar size={13} /> Date
              </span>
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1629] border border-purple-500/20 text-white text-sm focus:outline-none focus:border-purple-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#AAA5B6] uppercase tracking-wider mb-1.5">
              <span className="flex items-center gap-1">
                <Clock size={13} /> Start Time
              </span>
            </label>
            <input
              type="time"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1629] border border-purple-500/20 text-white text-sm focus:outline-none focus:border-purple-400"
            />
          </div>
        </div>

        {/* Duration & Priority */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#AAA5B6] uppercase tracking-wider mb-1.5">
              Duration (minutes)
            </label>
            <select
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1629] border border-purple-500/20 text-white text-sm focus:outline-none focus:border-purple-400"
            >
              <option value={25} className="bg-[#161424]">25 mins (Pomodoro)</option>
              <option value={30} className="bg-[#161424]">30 mins</option>
              <option value={45} className="bg-[#161424]">45 mins (1 Lecture)</option>
              <option value={60} className="bg-[#161424]">60 mins (1 Hour)</option>
              <option value={90} className="bg-[#161424]">90 mins (Deep Work)</option>
              <option value={120} className="bg-[#161424]">120 mins (2 Hours)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#AAA5B6] uppercase tracking-wider mb-1.5">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1629] border border-purple-500/20 text-white text-sm focus:outline-none focus:border-purple-400"
            >
              <option value="high" className="bg-[#161424]">High Priority</option>
              <option value="medium" className="bg-[#161424]">Medium Priority</option>
              <option value="low" className="bg-[#161424]">Low Priority</option>
            </select>
          </div>
        </div>

        {/* Conflict Warning */}
        {conflictWarning && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-300">
            <AlertTriangle size={16} className="shrink-0 mt-0.5 text-amber-400" />
            <span>{conflictWarning}</span>
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-[#AAA5B6] uppercase tracking-wider mb-1.5">
            Notes / Learning Objectives
          </label>
          <textarea
            rows={2}
            placeholder="Key concepts to memorize, problem links, or textbook pages..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1629] border border-purple-500/20 text-white placeholder-[#686378] text-sm focus:outline-none focus:border-purple-400 resize-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-purple-500/15">
          {initialTask ? (
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-medium border border-rose-500/30 transition-colors"
            >
              Delete Task
            </button>
          ) : <div />}

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#201C33] hover:bg-[#282340] text-[#9E99AF] hover:text-white text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(169,112,255,0.4)] transition-all active:scale-95"
            >
              {initialTask ? 'Save Changes' : 'Schedule Session'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
