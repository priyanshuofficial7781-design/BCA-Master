import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  QuestionDomain,
  QuestionDifficulty,
  PracticeQuestion,
} from '../../types';
import {
  queryQuestionBank,
  getDomainSubtopics,
  TOTAL_QUESTIONS_PER_DOMAIN,
  TOTAL_GLOBAL_QUESTIONS,
  getQuestionByIndex,
} from '../../data/questionGenerator';
import { ProgressBar } from '../common/ProgressBar';
import {
  Search,
  BookOpen,
  CheckCircle2,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Sparkles,
  Shuffle,
  Code2,
  Cpu,
  Globe,
  Calculator,
  GraduationCap,
  Award,
  ChevronLeft,
  ChevronRight,
  Filter,
  ArrowUpRight,
} from 'lucide-react';

const DOMAIN_TABS: {
  id: QuestionDomain;
  label: string;
  icon: React.ElementType;
  count: number;
  description: string;
  badgeColor: string;
}[] = [
  {
    id: 'dsa',
    label: 'Data Structures & Algorithms',
    icon: Code2,
    count: TOTAL_QUESTIONS_PER_DOMAIN.dsa,
    description: 'Arrays, Trees, Graphs, DP, Heap & Greedy Combinatorics',
    badgeColor: 'text-violet-400 border-violet-500/30 bg-violet-500/10',
  },
  {
    id: 'core_cs',
    label: 'Core Computer Science',
    icon: Cpu,
    count: TOTAL_QUESTIONS_PER_DOMAIN.core_cs,
    description: 'Operating Systems, DBMS Normalization, TCP/IP & OOP',
    badgeColor: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
  },
  {
    id: 'web_dev',
    label: 'Full-Stack Web Dev',
    icon: Globe,
    count: TOTAL_QUESTIONS_PER_DOMAIN.web_dev,
    description: 'React, TypeScript, Event Loop, REST Security & Architecture',
    badgeColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
  },
  {
    id: 'aptitude',
    label: 'Placement Aptitude',
    icon: Calculator,
    count: TOTAL_QUESTIONS_PER_DOMAIN.aptitude,
    description: 'Quantitative Work/Speed, Trains, Syllogisms & Logic',
    badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  },
  {
    id: 'bca_exams',
    label: 'BCA University Exams',
    icon: GraduationCap,
    count: TOTAL_QUESTIONS_PER_DOMAIN.bca_exams,
    description: 'Semester 1 to 6 Frequent Papers, Proofs & Viva Theory',
    badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
  },
];

export const MegaQuestionBankView: React.FC = () => {
  const { data, toggleMasteredQuestion, toggleBookmarkedQuestion } = useApp();

  const [activeDomain, setActiveDomain] = useState<QuestionDomain>('dsa');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<QuestionDifficulty | 'all'>('all');
  const [selectedSubtopic, setSelectedSubtopic] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [expandedQuestionIds, setExpandedQuestionIds] = useState<Record<string, boolean>>({});
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);

  // Subtopics for the active domain
  const subtopics = useMemo(() => getDomainSubtopics(activeDomain), [activeDomain]);

  // Reset pagination when filter criteria change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedSubtopic('all');
  }, [activeDomain]);

  // Mastered & bookmarked tracking
  const masteredIds = useMemo(
    () => new Set(data.questionBankProgress?.masteredIds || []),
    [data.questionBankProgress]
  );
  const bookmarkedIds = useMemo(
    () => new Set(data.questionBankProgress?.bookmarkedIds || []),
    [data.questionBankProgress]
  );

  // Query engine results
  const queryResult = useMemo(() => {
    return queryQuestionBank({
      domain: activeDomain,
      page: currentPage,
      pageSize: 12,
      searchQuery,
      difficulty: selectedDifficulty,
      subtopicFilter: selectedSubtopic,
    });
  }, [activeDomain, currentPage, searchQuery, selectedDifficulty, selectedSubtopic]);

  // Filter for only bookmarked if user enabled toggle
  const displayedQuestions = useMemo(() => {
    if (!onlyBookmarked) return queryResult.questions;
    return queryResult.questions.filter((q) => bookmarkedIds.has(q.id));
  }, [queryResult.questions, onlyBookmarked, bookmarkedIds]);

  // Toggle accordion expansion for solutions
  const toggleAccordion = (id: string) => {
    setExpandedQuestionIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Expand or collapse all visible solutions
  const toggleAllVisibleSolutions = (expand: boolean) => {
    const nextState: Record<string, boolean> = {};
    displayedQuestions.forEach((q) => {
      nextState[q.id] = expand;
    });
    setExpandedQuestionIds(nextState);
  };

  // Copy code snippet to clipboard
  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippetId(id);
    setTimeout(() => setCopiedSnippetId(null), 2500);
  };

  // Surprise Me / Random Question
  const handleSurpriseChallenge = () => {
    const randomIdx = Math.floor(Math.random() * (TOTAL_QUESTIONS_PER_DOMAIN[activeDomain] || 1000));
    const randomQ = getQuestionByIndex(activeDomain, randomIdx);
    setSearchQuery(randomQ.title.split(':')[0] || randomQ.subtopic);
    setExpandedQuestionIds({ [randomQ.id]: true });
  };

  const domainMasteredCount = displayedQuestions.filter((q) => masteredIds.has(q.id)).length;

  return (
    <div className="space-y-6 pb-24 lg:pb-12 animate-fadeIn max-w-6xl mx-auto">
      {/* Top Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#141024] via-[#1B1530] to-[#120F22] border border-violet-500/25 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-xl bg-violet-500/20 text-violet-300 border border-violet-500/30">
                <BookOpen className="w-5 h-5" />
              </span>
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-violet-400">
                10,000+ Algorithmic Practice Suite
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              BCA & Placement Question Bank
            </h1>
            <p className="text-sm text-[#A59FB5] mt-1 max-w-2xl">
              Deterministic, comprehensive question repository across DSA, Core CS, Full-Stack,
              Aptitude, and University Exams with step-by-step walkthroughs.
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex items-center gap-3">
            <div className="p-3.5 rounded-2xl bg-[#0F0D1A]/80 border border-violet-500/20 backdrop-blur-md text-right">
              <div className="text-[11px] text-[#9A94AD] uppercase tracking-wider font-semibold">
                Total Solvable Qs
              </div>
              <div className="text-xl font-bold font-mono text-white">
                {TOTAL_GLOBAL_QUESTIONS.toLocaleString()}+
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0F0D1A]/80 border border-emerald-500/20 backdrop-blur-md text-right">
              <div className="text-[11px] text-[#9A94AD] uppercase tracking-wider font-semibold">
                Mastered
              </div>
              <div className="text-xl font-bold font-mono text-emerald-400">
                {masteredIds.size}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Domain Category Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {DOMAIN_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeDomain === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveDomain(tab.id)}
              className={`p-3.5 rounded-2xl text-left transition-all border flex flex-col justify-between cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-b from-[#221B3C] to-[#171329] border-violet-500/50 shadow-[0_0_20px_rgba(139,92,246,0.25)] text-white'
                  : 'bg-[#12101D] border-purple-500/10 hover:border-purple-500/30 text-[#AAA4BD] hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`p-2 rounded-xl border ${
                    isActive
                      ? 'bg-violet-500/20 text-violet-300 border-violet-500/40'
                      : 'bg-white/5 text-[#8E88A1] border-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </span>
                <span className="text-[11px] font-mono font-bold text-[#A7A1B8]">
                  {tab.count.toLocaleString()}
                </span>
              </div>
              <div>
                <h4 className="text-xs font-bold leading-snug">{tab.label}</h4>
                <p className="text-[10px] text-[#7A748C] truncate mt-0.5">{tab.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Search, Filter & Quick Action Toolbar */}
      <div className="p-4 rounded-2xl bg-[#12101D] border border-purple-500/15 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Instant Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8C869E] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${TOTAL_QUESTIONS_PER_DOMAIN[activeDomain].toLocaleString()} questions by keyword, topic, or concept...`}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#181427] border border-purple-500/20 focus:border-violet-500/60 text-white placeholder-[#787289] text-xs outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8C869E] hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Action Buttons: Surprise Me, Bookmarks, Expand All */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSurpriseChallenge}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Surprise Challenge</span>
            </button>

            <button
              onClick={() => setOnlyBookmarked(!onlyBookmarked)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-colors cursor-pointer ${
                onlyBookmarked
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-[#181427] text-[#9A94AD] border-purple-500/20 hover:text-white'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Bookmarked ({bookmarkedIds.size})</span>
            </button>

            <button
              onClick={() => toggleAllVisibleSolutions(true)}
              className="px-2.5 py-2 rounded-xl bg-[#181427] text-[#9A94AD] hover:text-white border border-purple-500/20 text-xs transition-colors cursor-pointer"
            >
              Expand All
            </button>

            <button
              onClick={() => toggleAllVisibleSolutions(false)}
              className="px-2.5 py-2 rounded-xl bg-[#181427] text-[#9A94AD] hover:text-white border border-purple-500/20 text-xs transition-colors cursor-pointer"
            >
              Collapse
            </button>
          </div>
        </div>

        {/* Difficulty & Subtopic Filtering Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-purple-500/10 text-xs">
          {/* Difficulty Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-[#88829A] font-medium text-[11px] mr-1">Difficulty:</span>
            {(['all', 'easy', 'medium', 'hard'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium capitalize transition-colors cursor-pointer ${
                  selectedDifficulty === diff
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'bg-[#181427] text-[#9A94AD] hover:text-white'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          {/* Subtopic Filter Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[#88829A] font-medium text-[11px]">Subtopic:</span>
            <select
              value={selectedSubtopic}
              onChange={(e) => setSelectedSubtopic(e.target.value)}
              className="px-3 py-1 rounded-lg bg-[#181427] text-white border border-purple-500/20 text-[11px] outline-none cursor-pointer max-w-[220px] truncate"
            >
              <option value="all">All Subtopics ({subtopics.length})</option>
              {subtopics.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Query Status Bar */}
      <div className="flex items-center justify-between text-xs text-[#8E88A1] px-1 font-mono">
        <div>
          Showing{' '}
          <strong className="text-white">
            {displayedQuestions.length > 0 ? (currentPage - 1) * 12 + 1 : 0}–
            {Math.min(currentPage * 12, queryResult.totalMatches)}
          </strong>{' '}
          of <strong className="text-white">{queryResult.totalMatches.toLocaleString()}</strong>{' '}
          matching questions in {DOMAIN_TABS.find((t) => t.id === activeDomain)?.label}
        </div>
        <div className="text-[11px]">
          Page {currentPage} of {queryResult.totalPages}
        </div>
      </div>

      {/* Study Sheet Questions List */}
      {displayedQuestions.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#12101D] border border-purple-500/15">
          <BookOpen className="w-10 h-10 text-violet-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-bold text-white mb-1">No Questions Found</h3>
          <p className="text-xs text-[#9E98AD] max-w-sm mx-auto mb-4">
            No questions matched your active search or filter criteria. Try resetting filters or
            switching subtopics.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDifficulty('all');
              setSelectedSubtopic('all');
              setOnlyBookmarked(false);
            }}
            className="px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-semibold"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedQuestions.map((q) => {
            const isExpanded = !!expandedQuestionIds[q.id];
            const isMastered = masteredIds.has(q.id);
            const isBookmarked = bookmarkedIds.has(q.id);

            return (
              <div
                key={q.id}
                className={`p-5 rounded-3xl transition-all border ${
                  isMastered
                    ? 'bg-[#11161F]/80 border-emerald-500/30'
                    : 'bg-[#13111F] border-purple-500/15 hover:border-purple-500/35'
                }`}
              >
                {/* Question Header & Meta */}
                <div className="flex flex-wrap items-start justify-between gap-3 mb-2.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-mono text-[11px] text-violet-400 font-semibold">
                      #{q.id}
                    </span>
                    <span className="text-[#6A647B]" aria-hidden="true">
                      ·
                    </span>
                    <span className="text-xs text-[#AAA4BE] font-medium">{q.subtopic}</span>
                    <span className="text-[#6A647B]" aria-hidden="true">
                      ·
                    </span>
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                        q.difficulty === 'easy'
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25'
                          : q.difficulty === 'medium'
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/25'
                          : 'bg-rose-500/15 text-rose-300 border border-rose-500/25'
                      }`}
                    >
                      {q.difficulty}
                    </span>
                  </div>

                  {/* Bookmark and Mastered Controls */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => toggleBookmarkedQuestion(q.id)}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        isBookmarked
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-white/5 text-[#888299] border-white/5 hover:text-white'
                      }`}
                      title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
                    >
                      <Bookmark className="w-3.5 h-3.5" fill={isBookmarked ? 'currentColor' : 'none'} />
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleMasteredQuestion(q.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                        isMastered
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                          : 'bg-[#1A1629] text-[#9A94AD] border-purple-500/20 hover:text-white hover:border-violet-500/40'
                      }`}
                    >
                      <CheckCircle2
                        className={`w-3.5 h-3.5 ${
                          isMastered ? 'text-emerald-400' : 'text-[#7D7791]'
                        }`}
                      />
                      <span>{isMastered ? 'Mastered' : 'Mark Done'}</span>
                    </button>
                  </div>
                </div>

                {/* Question Title & Statement */}
                <h3 className="text-sm sm:text-base font-bold text-white mb-2 leading-snug">
                  {q.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#C4BFD3] leading-relaxed mb-3">
                  {q.statement}
                </p>

                {/* Code Snippet Box with Copy Button (if present) */}
                {q.codeSnippet && (
                  <div className="relative my-3 rounded-2xl bg-[#090710] border border-violet-500/20 p-3.5 overflow-x-auto">
                    <div className="flex items-center justify-between text-[11px] text-[#7A748C] font-mono mb-2 pb-1.5 border-b border-white/5">
                      <span>Implementation / Test Context</span>
                      <button
                        onClick={() => handleCopyCode(q.id, q.codeSnippet!)}
                        className="flex items-center gap-1 text-violet-300 hover:text-white transition-colors cursor-pointer"
                      >
                        {copiedSnippetId === q.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Code</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="text-xs font-mono text-purple-200 leading-relaxed overflow-x-auto">
                      <code>{q.codeSnippet}</code>
                    </pre>
                  </div>
                )}

                {/* Solution Accordion Toggle */}
                <div className="mt-3 pt-3 border-t border-purple-500/10 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => toggleAccordion(q.id)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-violet-300 hover:text-violet-200 transition-colors cursor-pointer"
                  >
                    <span>{isExpanded ? 'Hide Solution Steps' : 'Reveal Solution & Proof'}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  <div className="flex items-center gap-2 text-[11px] text-[#868098] font-mono">
                    {q.timeComplexity && <span>Time: {q.timeComplexity}</span>}
                    {q.spaceComplexity && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>Space: {q.spaceComplexity}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Expandable Solution Content */}
                {isExpanded && (
                  <div className="mt-3.5 p-4 rounded-2xl bg-[#0D0B16] border border-violet-500/20 space-y-3 animate-fadeIn">
                    <div className="text-xs font-bold text-violet-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                      <span>Step-by-Step Analytical Walkthrough:</span>
                    </div>

                    <ul className="space-y-1.5 text-xs text-[#CDC8DC] pl-1">
                      {q.solutionSteps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2 leading-relaxed">
                          <span className="text-violet-400 font-bold shrink-0">{idx + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="p-3 rounded-xl bg-violet-950/30 border border-violet-500/30 text-xs">
                      <strong className="text-white">Conclusion / Answer Key:</strong>{' '}
                      <span className="text-violet-200">{q.finalAnswer}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controller */}
      {queryResult.totalPages > 1 && (
        <div className="p-4 rounded-2xl bg-[#12101D] border border-purple-500/15 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-[#8E88A1]">
            Page <strong className="text-white">{currentPage}</strong> of{' '}
            <strong className="text-white">{queryResult.totalPages}</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="px-3 py-1.5 rounded-xl bg-[#181427] text-white disabled:opacity-40 text-xs font-medium border border-purple-500/20 flex items-center gap-1 hover:border-violet-500/40 transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {/* Jump buttons */}
            <div className="hidden sm:flex items-center gap-1 text-xs">
              {[1, 2, 3].map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-8 h-8 rounded-lg font-mono font-medium transition-colors ${
                    currentPage === p
                      ? 'bg-violet-600 text-white'
                      : 'bg-[#181427] text-[#9A94AD] hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
              {queryResult.totalPages > 4 && <span className="text-[#6C667E] px-1">...</span>}
              {queryResult.totalPages > 3 && (
                <button
                  onClick={() => setCurrentPage(queryResult.totalPages)}
                  className={`w-8 h-8 rounded-lg font-mono font-medium transition-colors ${
                    currentPage === queryResult.totalPages
                      ? 'bg-violet-600 text-white'
                      : 'bg-[#181427] text-[#9A94AD] hover:text-white'
                  }`}
                >
                  {queryResult.totalPages}
                </button>
              )}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(queryResult.totalPages, p + 1))}
              disabled={currentPage >= queryResult.totalPages}
              className="px-3 py-1.5 rounded-xl bg-[#181427] text-white disabled:opacity-40 text-xs font-medium border border-purple-500/20 flex items-center gap-1 hover:border-violet-500/40 transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
