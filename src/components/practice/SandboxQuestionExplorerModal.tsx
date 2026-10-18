import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Code2,
  CheckCircle2,
  Sparkles,
  Zap,
  ArrowRight,
  Filter,
  Layers,
  ChevronLeft,
  ChevronRight,
  Terminal,
} from 'lucide-react';
import {
  queryQuestionBank,
  getDomainSubtopics,
} from '../../data/questionGenerator';
import { PracticeQuestion, QuestionDifficulty, QuestionDomain } from '../../types';
import { soundEffects } from '../../services/soundEffects';

interface SandboxQuestionExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProblem: (problem: {
    id: string;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    category: string;
    description: string;
    defaultInputs: string;
    codeSnippets: {
      cpp: string;
      python: string;
      java: string;
      javascript: string;
    };
    testCases: Array<{
      input: string;
      expected: string;
      description: string;
    }>;
  }) => void;
}

export const SandboxQuestionExplorerModal: React.FC<SandboxQuestionExplorerModalProps> = ({
  isOpen,
  onClose,
  onSelectProblem,
}) => {
  const [selectedDomain, setSelectedDomain] = useState<QuestionDomain>('dsa');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<QuestionDifficulty | 'all'>('all');
  const [selectedSubtopic, setSelectedSubtopic] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  if (!isOpen) return null;

  const currentSubtopics = getDomainSubtopics(selectedDomain);

  const queryResult = queryQuestionBank({
    domain: selectedDomain,
    subtopicFilter: selectedSubtopic,
    difficulty: selectedDifficulty,
    searchQuery,
    page: currentPage,
    pageSize: 10,
  });

  const handleChooseQuestion = (q: PracticeQuestion) => {
    soundEffects.playTaskDone();

    // Map the selected PracticeQuestion to a full multi-language Sandbox Problem Preset
    const diffMap: Record<string, 'Easy' | 'Medium' | 'Hard'> = {
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard',
    };

    const problem = {
      id: q.id,
      title: q.title,
      difficulty: diffMap[q.difficulty] || 'Medium',
      category: q.subtopic,
      description: q.statement,
      defaultInputs: q.statement.slice(0, 80),
      codeSnippets: {
        cpp: `// ${q.title}\n// Category: ${q.subtopic} | Time: ${q.timeComplexity} | Space: ${q.spaceComplexity}\n#include <iostream>\n#include <vector>\n#include <algorithm>\n\nusing namespace std;\n\nvoid solve() {\n    // Implementation logic\n    cout << "Solved: ${q.title}" << endl;\n}\n\nint main() {\n    solve();\n    return 0;\n}`,
        python: `# ${q.title}\n# Category: ${q.subtopic} | Time: ${q.timeComplexity} | Space: ${q.spaceComplexity}\n\ndef solve():\n    print("Executing ${q.title}")\n    return True\n\nif __name__ == '__main__':\n    solve()\n`,
        java: `// ${q.title}\n// Category: ${q.subtopic}\npublic class Solution {\n    public static void main(String[] args) {\n        System.out.println("Executing: ${q.title}");\n    }\n}`,
        javascript: q.codeSnippet || `// ${q.title}\nconsole.log("Running algorithmic solution for ${q.title}");\n`,
      },
      testCases: [
        {
          input: 'Sample Test Case 1',
          expected: 'Optimal Return',
          description: q.solutionSteps[0] || 'Standard verification case',
        },
        {
          input: 'Sample Test Case 2 (Edge Case)',
          expected: 'Handled Bounds',
          description: q.solutionSteps[1] || 'Boundary edge test case',
        },
      ],
    };

    onSelectProblem(problem);
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
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-[#0D0B1C] border border-[#00FF9D]/30 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(0,255,157,0.2)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Rail */}
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00FF9D]/70 to-transparent pointer-events-none" />

        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between gap-3 bg-[#131026]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00FF9D]/15 border border-[#00FF9D]/35 flex items-center justify-center text-[#00FF9D] shadow-[0_0_15px_rgba(0,255,157,0.3)] shrink-0">
              <Terminal size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
                <span>10,000+ Sandbox Problem Bank</span>
                <span className="px-2 py-0.5 rounded-full bg-[#00FF9D]/15 border border-[#00FF9D]/35 text-[10px] font-mono text-[#00FF9D] font-bold">
                  {queryResult.domainTotal.toLocaleString()}+ QUESTIONS
                </span>
              </h2>
              <p className="text-xs text-[#AAA9C6]">
                Filter by technical domain and algorithmic patterns. Load multi-language templates directly into the live compiler.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-[#1B1734] hover:bg-[#28224D] border border-white/10 flex items-center justify-center text-[#AAA9C6] hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Domain Tabs Bar */}
        <div className="flex items-center gap-1.5 px-4 pt-3 pb-2 bg-[#0E0C1F] border-b border-white/5 overflow-x-auto scrollbar-none">
          {[
            { id: 'dsa', label: '1. DSA & Algorithms (2.5k)', badge: 'LeetCode' },
            { id: 'core_cs', label: '2. Core CS (OS/DBMS/Networks)', badge: 'Theory' },
            { id: 'web_dev', label: '3. Web & Fullstack (2.5k)', badge: 'JS/TS' },
            { id: 'bca_exams', label: '4. BCA Semester Practicals', badge: 'University' },
          ].map((tab) => {
            const isSelected = selectedDomain === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  setSelectedDomain(tab.id as QuestionDomain);
                  setSelectedSubtopic('all');
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-[#00FF9D]/20 text-[#00FF9D] border border-[#00FF9D]/40 shadow-[0_0_12px_rgba(0,255,157,0.25)]'
                    : 'bg-[#151228] text-[#AAA9C6] hover:text-white border border-white/5'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Filters & Search Bar */}
        <div className="p-4 border-b border-white/5 bg-[#090716] space-y-3">
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
                placeholder="Search by algorithm, problem name, or data structure..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#131122] border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#00FF9D]"
              />
            </div>

            {/* Difficulty Filter */}
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
                      ? 'bg-[#00FF9D]/20 text-[#00FF9D] border border-[#00FF9D]/40'
                      : 'text-[#AAA9C6] hover:text-white'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Subtopic Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => {
                setSelectedSubtopic('all');
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedSubtopic === 'all'
                  ? 'bg-purple-600/30 text-white border border-purple-500/40'
                  : 'bg-[#151228] text-[#AAA9C6] hover:text-white border border-white/5'
              }`}
            >
              All Topics
            </button>
            {currentSubtopics.map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => {
                  setSelectedSubtopic(sub);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  selectedSubtopic === sub
                    ? 'bg-purple-600/30 text-white border border-purple-500/40'
                    : 'bg-[#151228] text-[#AAA9C6] hover:text-white border border-white/5'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* Questions List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {queryResult.questions.length === 0 ? (
            <div className="p-8 text-center text-slate-400 space-y-2">
              <p className="text-sm">No algorithmic problems match the current filter criteria.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDifficulty('all');
                  setSelectedSubtopic('all');
                }}
                className="text-xs text-[#00FF9D] underline"
              >
                Reset search filters
              </button>
            </div>
          ) : (
            queryResult.questions.map((q) => (
              <div
                key={q.id}
                className="p-4 rounded-2xl bg-[#141126] border border-white/10 hover:border-[#00FF9D]/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1 flex-1 pr-2">
                  <div className="flex items-center gap-2 text-[11px] text-[#00FF9D]">
                    <span className="font-semibold uppercase tracking-wider">{q.difficulty}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-purple-300">{q.subtopic}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#AAA9C6] font-mono">Time: {q.timeComplexity}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-[#00FF9D] transition-colors">
                    {q.title}
                  </h4>
                  <p className="text-xs text-[#AAA9C6] line-clamp-2">
                    {q.statement}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleChooseQuestion(q)}
                  className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#00FF9D]/15 hover:bg-[#00FF9D]/25 border border-[#00FF9D]/40 text-[#00FF9D] text-xs font-bold transition-all shadow-[0_0_12px_rgba(0,255,157,0.2)] shrink-0 cursor-pointer active:scale-95"
                >
                  <span>Load in Sandbox</span>
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
