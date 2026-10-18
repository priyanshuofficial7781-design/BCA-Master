import React, { useState } from 'react';
import {
  X,
  Search,
  Brain,
  Mic,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Award,
} from 'lucide-react';
import {
  queryQuestionBank,
  getDomainSubtopics,
} from '../../data/questionGenerator';
import { PracticeQuestion, QuestionDifficulty } from '../../types';
import { soundEffects } from '../../services/soundEffects';

interface VivaQuestionExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVivaQuestion: (question: {
    id: string;
    question: string;
    expectedKeyPoints: string[];
    idealAnswer: string;
    domain: string;
    difficulty: string;
  }) => void;
}

export const VivaQuestionExplorerModal: React.FC<VivaQuestionExplorerModalProps> = ({
  isOpen,
  onClose,
  onSelectVivaQuestion,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<'core_cs' | 'bca_exams' | 'web_dev' | 'dsa'>('core_cs');
  const [selectedDifficulty, setSelectedDifficulty] = useState<QuestionDifficulty | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  if (!isOpen) return null;

  const queryResult = queryQuestionBank({
    domain: selectedDomain,
    difficulty: selectedDifficulty,
    searchQuery,
    page: currentPage,
    pageSize: 8,
  });

  const handleLaunchViva = (q: PracticeQuestion) => {
    soundEffects.playTaskDone();

    const expectedPoints = q.solutionSteps && q.solutionSteps.length > 0
      ? q.solutionSteps.map((s) => s.replace(/^Step \d+:\s*/, ''))
      : [q.subtopic, 'Core fundamental definition', 'Time and space trade-offs'];

    const idealAnswer = `${q.statement} Answer: ${q.finalAnswer || 'Key architectural understanding required.'}`;

    onSelectVivaQuestion({
      id: q.id,
      question: q.title + ' — ' + q.statement,
      expectedKeyPoints: expectedPoints,
      idealAnswer: idealAnswer,
      domain: q.subtopic,
      difficulty: q.difficulty,
    });

    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xl animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-[#0C0A1A] border border-[#00F0FF]/30 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(0,240,255,0.2)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Rail */}
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00F0FF]/70 to-transparent pointer-events-none" />

        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between gap-3 bg-[#120F26]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00F0FF]/15 border border-[#00F0FF]/35 flex items-center justify-center text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.3)] shrink-0">
              <Brain size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
                <span>10,000+ University Viva Questions Explorer</span>
                <span className="px-2 py-0.5 rounded-full bg-[#00F0FF]/15 border border-[#00F0FF]/35 text-[10px] font-mono text-[#00F0FF] font-bold">
                  ORAL VIVA VOCE
                </span>
              </h2>
              <p className="text-xs text-[#AAA9C6]">
                Select any university examination viva topic to practice oral speech defense and get marked.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-[#1A1633] hover:bg-[#27214C] border border-white/10 flex items-center justify-center text-[#AAA9C6] hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Filters & Domain Selectors */}
        <div className="p-4 border-b border-white/5 bg-[#090714] space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search viva questions (e.g. Normalization, CPU scheduling, TCP, OOPs)..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#131122] border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#00F0FF]"
              />
            </div>

            {/* Difficulty Selector */}
            <div className="flex items-center gap-1 bg-[#131122] p-1 rounded-xl border border-white/10 shrink-0">
              {(['all', 'easy', 'medium', 'hard'] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    setSelectedDifficulty(d);
                    setCurrentPage(1);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                    selectedDifficulty === d
                      ? 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/40'
                      : 'text-[#AAA9C6] hover:text-white'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Academic Domain Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => {
                setSelectedDomain('core_cs');
                setCurrentPage(1);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedDomain === 'core_cs'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-[#151226] text-[#AAA9C6] hover:text-white border border-white/5'
              }`}
            >
              <BookOpen size={14} />
              <span>Core CS Viva (OS, DBMS, Networks, OOP)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedDomain('dsa');
                setCurrentPage(1);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedDomain === 'dsa'
                  ? 'bg-[#00FF9D]/20 text-[#00FF9D] border border-[#00FF9D]/40'
                  : 'bg-[#151226] text-[#AAA9C6] hover:text-white border border-white/5'
              }`}
            >
              <Sparkles size={14} />
              <span>DSA & Algorithms Oral Defense</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedDomain('bca_exams');
                setCurrentPage(1);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedDomain === 'bca_exams'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'bg-[#151226] text-[#AAA9C6] hover:text-white border border-white/5'
              }`}
            >
              <GraduationCap size={14} />
              <span>University Practical Exam Papers (Sem 1-6)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedDomain('web_dev');
                setCurrentPage(1);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedDomain === 'web_dev'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-[#151226] text-[#AAA9C6] hover:text-white border border-white/5'
              }`}
            >
              <Award size={14} />
              <span>Full-Stack & Capstone Project Defense</span>
            </button>
          </div>
        </div>

        {/* Questions List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {queryResult.questions.length === 0 ? (
            <div className="p-8 text-center text-slate-400 space-y-2">
              <p className="text-sm">No viva questions match the selected criteria.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDifficulty('all');
                }}
                className="text-xs text-[#00F0FF] underline"
              >
                Reset search filters
              </button>
            </div>
          ) : (
            queryResult.questions.map((q) => (
              <div
                key={q.id}
                className="p-4 rounded-2xl bg-[#131126] border border-white/10 hover:border-[#00F0FF]/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1.5 flex-1 pr-2">
                  <div className="flex items-center gap-2 text-[11px] text-[#00F0FF]">
                    <span className="font-semibold uppercase tracking-wider">{q.difficulty}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-purple-300">{q.subtopic}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#8E8A9E]">Sem Practical Viva</span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-[#00F0FF] transition-colors leading-snug">
                    {q.title}
                  </h4>
                  <p className="text-xs text-[#AAA9C6] line-clamp-2">
                    {q.statement}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleLaunchViva(q)}
                  className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#00F0FF]/15 hover:bg-[#00F0FF]/25 border border-[#00F0FF]/40 text-[#00F0FF] text-xs font-bold transition-all shadow-[0_0_12px_rgba(0,240,255,0.2)] shrink-0 cursor-pointer active:scale-95"
                >
                  <Mic size={14} />
                  <span>Start Oral Viva</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Modal Pagination Footer */}
        <div className="p-3 sm:p-4 border-t border-white/10 bg-[#090714] flex items-center justify-between text-xs text-[#AAA9C6]">
          <span className="font-mono">
            Page {queryResult.page} of {queryResult.totalPages} ({queryResult.totalMatches} matches)
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg bg-[#141126] border border-white/10 hover:bg-[#201C38] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              disabled={currentPage >= queryResult.totalPages}
              onClick={() => setCurrentPage((p) => Math.min(queryResult.totalPages, p + 1))}
              className="p-1.5 rounded-lg bg-[#141126] border border-white/10 hover:bg-[#201C38] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
