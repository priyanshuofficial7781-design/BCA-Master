import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Subject } from '../../types';
import { Modal } from '../common/Modal';
import { ProgressBar } from '../common/ProgressBar';
import {
  CheckCircle2,
  Circle,
  Plus,
  BookOpen,
  Calendar,
  Save,
  Check,
  RotateCcw,
} from 'lucide-react';

interface SubjectDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectId: string | null;
}

export const SubjectDetailModal: React.FC<SubjectDetailModalProps> = ({
  isOpen,
  onClose,
  subjectId,
}) => {
  const {
    data,
    updateSubject,
    incrementSubjectLecture,
    toggleSubjectModule,
    addSubjectModule,
  } = useApp();

  const subject = data.subjects.find((s) => s.id === subjectId);

  const [notes, setNotes] = useState('');
  const [totalLecturesInput, setTotalLecturesInput] = useState(0);
  const [completedLecturesInput, setCompletedLecturesInput] = useState(0);
  const [revisionStatus, setRevisionStatus] = useState<Subject['revisionStatus']>('in_progress');
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  // New module state
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newModuleLectures, setNewModuleLectures] = useState(5);

  useEffect(() => {
    if (subject) {
      setNotes(subject.notes || '');
      setTotalLecturesInput(subject.totalLectures);
      setCompletedLecturesInput(subject.completedLectures);
      setRevisionStatus(subject.revisionStatus);
    }
  }, [subject, isOpen]);

  if (!subject) return null;

  const progressPercent =
    subject.totalLectures > 0
      ? Math.round((subject.completedLectures / subject.totalLectures) * 100)
      : 0;

  const handleSaveMeta = () => {
    updateSubject(subject.id, {
      notes,
      totalLectures: Number(totalLecturesInput),
      completedLectures: Math.min(Number(totalLecturesInput), Number(completedLecturesInput)),
      revisionStatus,
    });
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2000);
  };

  const handleCreateModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModuleTitle.trim()) return;
    addSubjectModule(subject.id, newModuleTitle.trim(), Number(newModuleLectures));
    setNewModuleTitle('');
    setIsAddingModule(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={subject.name}
      subtitle={`${subject.code} · Semester ${subject.semester} Curriculum`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Progress & Quick Lecture Log Bar */}
        <div className="p-4 rounded-2xl bg-[#1D192E] border border-purple-500/20 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs text-[#9E99AF] font-medium">Lecture Completion</span>
              <div className="text-lg font-bold text-white tabular-nums">
                {subject.completedLectures} of {subject.totalLectures} Lectures Completed ({progressPercent}%)
              </div>
            </div>

            {/* Quick Increment Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => incrementSubjectLecture(subject.id, 1)}
                disabled={subject.completedLectures >= subject.totalLectures}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1 active:scale-95"
              >
                <Plus size={14} />
                <span>Log 1 Lecture</span>
              </button>

              <button
                type="button"
                onClick={() => incrementSubjectLecture(subject.id, -1)}
                disabled={subject.completedLectures <= 0}
                className="w-8 h-8 rounded-xl bg-[#28223D] hover:bg-[#342C4F] text-[#9E99AF] hover:text-white text-xs font-bold flex items-center justify-center transition-colors"
                title="Decrement 1 lecture"
              >
                -1
              </button>
            </div>
          </div>

          <ProgressBar progress={progressPercent} height={7} />

          <div className="flex flex-wrap items-center justify-between text-xs text-[#9E99AF] pt-1">
            <span className="flex items-center gap-1">
              <Calendar size={12} className="text-purple-400" />
              Last studied: {subject.lastStudied || 'Not logged yet'}
            </span>
            <span className="text-purple-300 capitalize font-medium">
              Status: {subject.revisionStatus.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Course Modules Checklist */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
              <BookOpen size={16} className="text-purple-400" />
              <span>Curriculum Modules & Topics</span>
            </h4>
            <button
              onClick={() => setIsAddingModule(!isAddingModule)}
              className="text-xs text-purple-300 hover:text-purple-200 font-medium transition-colors"
            >
              {isAddingModule ? 'Cancel' : '+ Add Custom Module'}
            </button>
          </div>

          {/* Add module inline form */}
          {isAddingModule && (
            <form onSubmit={handleCreateModule} className="p-3.5 rounded-xl bg-[#1A1629] border border-purple-500/30 space-y-3 animate-fadeIn">
              <div>
                <label className="block text-[11px] font-semibold text-[#AAA5B6] mb-1">
                  Module Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Graph Algorithms & Dijkstra Shortest Path"
                  value={newModuleTitle}
                  onChange={(e) => setNewModuleTitle(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#151221] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="block text-[11px] font-semibold text-[#AAA5B6] mb-1">
                    Lectures Count
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={newModuleLectures}
                    onChange={(e) => setNewModuleLectures(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#151221] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-5 px-4 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-semibold hover:bg-purple-500 transition-colors"
                >
                  Add Module
                </button>
              </div>
            </form>
          )}

          {/* Module list */}
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {subject.modules.map((mod) => (
              <div
                key={mod.id}
                onClick={() => toggleSubjectModule(subject.id, mod.id)}
                className={`cursor-pointer flex items-center justify-between p-3 rounded-xl border transition-all ${
                  mod.completed
                    ? 'bg-[#151221]/70 border-purple-500/10 opacity-80'
                    : 'bg-[#1A1629] border-purple-500/15 hover:border-purple-500/35 hover:bg-[#201C33]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="text-purple-400 shrink-0">
                    {mod.completed ? (
                      <CheckCircle2 size={18} className="text-emerald-400 fill-emerald-400/20" />
                    ) : (
                      <Circle size={18} className="text-[#9E99AF]" />
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium truncate ${
                      mod.completed ? 'line-through text-[#878296]' : 'text-white'
                    }`}
                  >
                    {mod.title}
                  </span>
                </div>
                <span className="text-[11px] text-[#9E99AF] font-mono tabular-nums shrink-0 ml-2">
                  {mod.lectureCount} lectures
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Configurable Lecture Targets & Revision Status */}
        <div className="p-4 rounded-xl bg-[#1A1629] border border-purple-500/15 space-y-3">
          <h5 className="text-xs font-semibold text-white uppercase tracking-wider">
            Configure Targets & Status
          </h5>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] text-[#AAA5B6] mb-1 font-medium">
                Total Lectures
              </label>
              <input
                type="number"
                min={1}
                value={totalLecturesInput}
                onChange={(e) => setTotalLecturesInput(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg bg-[#151221] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] text-[#AAA5B6] mb-1 font-medium">
                Completed Lectures
              </label>
              <input
                type="number"
                min={0}
                max={totalLecturesInput}
                value={completedLecturesInput}
                onChange={(e) => setCompletedLecturesInput(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg bg-[#151221] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] text-[#AAA5B6] mb-1 font-medium">
                Revision Status
              </label>
              <select
                value={revisionStatus}
                onChange={(e) => setRevisionStatus(e.target.value as any)}
                className="w-full px-3 py-1.5 rounded-lg bg-[#151221] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400"
              >
                <option value="needs_revision" className="bg-[#161424]">Needs Revision</option>
                <option value="in_progress" className="bg-[#161424]">In Progress</option>
                <option value="mastered" className="bg-[#161424]">Mastered</option>
              </select>
            </div>
          </div>
        </div>

        {/* Subject Personal Notes */}
        <div>
          <label className="block text-xs font-semibold text-[#AAA5B6] uppercase tracking-wider mb-1.5">
            Subject Study Notes & Exam Reminders
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Important formulas, textbook references, professor hints, or cheat sheet points..."
            className="w-full px-3.5 py-2 rounded-xl bg-[#1A1629] border border-purple-500/20 text-white placeholder-[#686378] text-xs focus:outline-none focus:border-purple-400 resize-none leading-relaxed"
          />
        </div>

        {/* Footer save buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-purple-500/15">
          {isSavedNotice ? (
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <Check size={14} /> Saved changes successfully!
            </span>
          ) : (
            <span className="text-xs text-[#9E99AF]">Changes persist across all devices</span>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#201C33] hover:bg-[#282340] text-[#9E99AF] hover:text-white text-xs font-medium transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleSaveMeta}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
            >
              <Save size={14} />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
