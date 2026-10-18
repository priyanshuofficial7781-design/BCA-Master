import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SubjectDetailModal } from './SubjectDetailModal';
import { ProgressBar } from '../common/ProgressBar';
import {
  Search,
  BookOpen,
  Code2,
  BrainCircuit,
  Calculator,
  Terminal,
  Cpu,
  Binary,
  MessageSquare,
  Sparkles,
  Shield,
  Layers,
  ChevronRight,
  Plus,
} from 'lucide-react';

export const LearningHubView: React.FC = () => {
  const { data, incrementSubjectLecture } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);

  // Subject icon mapper
  const getSubjectIcon = (id: string) => {
    switch (id) {
      case 'sub-cpp-dsa':
        return <Code2 size={20} className="text-purple-400" />;
      case 'sub-aptitude':
        return <BrainCircuit size={20} className="text-pink-400" />;
      case 'sub-math':
        return <Calculator size={20} className="text-blue-400" />;
      case 'sub-python':
        return <Terminal size={20} className="text-emerald-400" />;
      case 'sub-coa':
        return <Cpu size={20} className="text-cyan-400" />;
      case 'sub-ctp':
        return <Binary size={20} className="text-indigo-400" />;
      case 'sub-comm':
        return <MessageSquare size={20} className="text-amber-400" />;
      case 'sub-genai':
        return <Sparkles size={20} className="text-purple-300" />;
      case 'sub-cyber':
        return <Shield size={20} className="text-rose-400" />;
      case 'sub-aiml':
        return <Layers size={20} className="text-teal-400" />;
      default:
        return <BookOpen size={20} className="text-purple-400" />;
    }
  };

  const categories = [
    { id: 'all', label: 'All Subjects' },
    { id: 'programming', label: 'Programming & DSA' },
    { id: 'core', label: 'Core Computer Science' },
    { id: 'math', label: 'Mathematics' },
    { id: 'specialization', label: 'AI & Security' },
    { id: 'soft_skills', label: 'Aptitude & Soft Skills' },
  ];

  const filteredSubjects = data.subjects.filter((sub) => {
    const matchesSearch =
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.notes.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || sub.category === selectedCategory;

    const matchesSemester =
      selectedSemester === 'all' || sub.semester.toString() === selectedSemester;

    return matchesSearch && matchesCategory && matchesSemester;
  });

  return (
    <div className="space-y-6 pb-24 lg:pb-12 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Curriculum & Learning Hub
          </h2>
          <p className="text-xs sm:text-sm text-[#9E99AF]">
            Track lectures, revision, and practical coding assignments across all 10 BCA subjects
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-purple-300 bg-purple-500/15 border border-purple-500/25 px-3 py-1.5 rounded-xl font-medium">
            10 Curated Subjects
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3 p-4 rounded-2xl bg-[#161424] border border-purple-500/20">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9E99AF]"
            />
            <input
              type="text"
              placeholder="Search subjects, codes, or lecture topics (e.g. C++, Aptitude, Graph)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#1D192E] border border-purple-500/20 text-white placeholder-[#686378] text-xs sm:text-sm focus:outline-none focus:border-purple-400"
            />
          </div>

          {/* Semester Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-[#9E99AF] font-medium hidden sm:inline">
              Semester:
            </span>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#1D192E] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400"
            >
              <option value="all">All Semesters</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
              <option value="3">Semester 3</option>
              <option value="4">Semester 4</option>
              <option value="5">Semester 5</option>
              <option value="6">Semester 6</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-purple-600 text-white shadow-sm font-semibold'
                  : 'bg-[#1D192E] text-[#9E99AF] hover:text-white border border-purple-500/15'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Subject Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSubjects.map((sub) => {
          const progressPercent = Math.round(
            (sub.completedLectures / sub.totalLectures) * 100
          );

          const revisionStyles = {
            needs_revision: 'text-rose-300 bg-rose-500/10 border-rose-500/20',
            in_progress: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
            mastered: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
          };

          return (
            <div
              key={sub.id}
              className="group rounded-2xl bg-[#161424] border border-purple-500/20 hover:border-purple-500/40 p-5 hover:bg-[#1A172C] transition-all hover:shadow-[0_6px_25px_rgba(139,92,246,0.15)] flex flex-col justify-between"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center shrink-0">
                      {getSubjectIcon(sub.id)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-purple-300">
                          {sub.code}
                        </span>
                        <span className="text-[10px] text-[#9E99AF]">
                          · Sem {sub.semester}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white tracking-tight truncate group-hover:text-purple-200 transition-colors">
                        {sub.name}
                      </h3>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md border shrink-0 ${
                      revisionStyles[sub.revisionStatus]
                    }`}
                  >
                    {sub.revisionStatus.replace('_', ' ')}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 my-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#9E99AF]">
                      {sub.completedLectures} of {sub.totalLectures} Lectures Completed
                    </span>
                    <span className="font-bold text-purple-300 tabular-nums">
                      {progressPercent}%
                    </span>
                  </div>
                  <ProgressBar progress={progressPercent} height={6} />
                </div>

                {/* Modules & Notes summary */}
                <p className="text-xs text-[#AAA5B6] line-clamp-2 my-2 leading-relaxed">
                  {sub.notes || 'Modules and practice curriculum configured.'}
                </p>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-purple-500/10 mt-3">
                <button
                  type="button"
                  onClick={() => incrementSubjectLecture(sub.id, 1)}
                  disabled={sub.completedLectures >= sub.totalLectures}
                  className="px-2.5 py-1 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 disabled:opacity-40 text-purple-200 text-xs font-medium border border-purple-500/20 flex items-center gap-1 transition-all active:scale-95"
                >
                  <Plus size={13} />
                  <span>+1 Lecture</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSubjectId(sub.id)}
                  className="flex items-center gap-1 text-xs text-purple-300 hover:text-white font-semibold group-hover:translate-x-0.5 transition-all"
                >
                  <span>Open Subject Hub</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Subject Detail & Customizer Modal */}
      <SubjectDetailModal
        isOpen={Boolean(activeSubjectId)}
        onClose={() => setActiveSubjectId(null)}
        subjectId={activeSubjectId}
      />
    </div>
  );
};
