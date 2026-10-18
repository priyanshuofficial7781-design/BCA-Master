import React from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { getTodayString } from '../../data/initialData';
import { Bell, Flame, Clock, BookOpen, CheckCircle2 } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTask: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  onOpenTask,
}) => {
  const { data, streakDays, todayTasksSummary } = useApp();
  const today = getTodayString(0);
  const remainingTasks = data.tasks.filter((t) => t.date === today && t.status !== 'completed');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Study Reminders & Updates"
      subtitle="Active notifications for your BCA daily routine"
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Streak Alert */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
            <Flame size={18} className="fill-amber-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">
              {streakDays} Day Study Streak Active!
            </h4>
            <p className="text-[11px] text-[#D1CEE0] mt-0.5 leading-relaxed">
              Complete your planned study tasks today to extend your streak and keep your placement momentum.
            </p>
          </div>
        </div>

        {/* Pending tasks reminder */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-white">Today's Remaining Sessions</span>
            <span className="text-purple-300 font-mono">
              {remainingTasks.length} pending
            </span>
          </div>

          {remainingTasks.length === 0 ? (
            <div className="p-4 rounded-xl bg-[#1A1629] border border-purple-500/15 text-center text-xs text-emerald-300 flex items-center justify-center gap-2">
              <CheckCircle2 size={16} />
              <span>All tasks for today are completed! Great job!</span>
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {remainingTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 rounded-xl bg-[#1A1629] border border-purple-500/15 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-white truncate">{task.title}</p>
                    <span className="text-[11px] text-[#9E99AF] flex items-center gap-1 mt-0.5">
                      <Clock size={11} /> Scheduled for {task.startTime} ({task.durationMinutes}m)
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase text-purple-300 bg-purple-500/15 px-2 py-0.5 rounded border border-purple-500/20 shrink-0">
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Milestone notification */}
        <div className="p-3.5 rounded-xl bg-[#1A1629] border border-purple-500/15 flex items-start gap-3">
          <BookOpen size={16} className="text-purple-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-white block">Curriculum Tip</span>
            <p className="text-[#AAA5B6] mt-0.5 leading-relaxed">
              Semester {data.profile.semester} is critical for Data Structures and Relational Databases. Aim for at least 1 C++ coding session daily.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
          >
            Got it
          </button>
        </div>
      </div>
    </Modal>
  );
};
