import React, { useState } from 'react';
import { Calendar, RotateCw, Sparkles, CheckCircle2, XCircle } from 'lucide-react';

interface QuestionItem {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
}

const QUESTIONS_DATABASE: QuestionItem[] = [
  {
    topic: 'C++ & Memory Management',
    question: "What is the output or behavior when `delete[] ptr;` is called on an array allocated via `new int[10];`?",
    options: [
      'It deallocates the entire contiguous memory block safely.',
      'It causes undefined behavior because square brackets are invalid in delete.',
      'It only deletes the first element `ptr[0]`.',
      'It throws a bad_alloc runtime exception.',
    ],
    correctIndex: 0,
    explanation: 'In C++, `delete[]` correctly invokes destructors and releases the contiguous heap buffer allocated with `new[]`.',
  },
  {
    topic: 'Data Structures & Algorithms',
    question: "What is the worst-case time complexity of searching for an element in an un-balanced Binary Search Tree (BST)?",
    options: ['O(log N)', 'O(N)', 'O(1)', 'O(N log N)'],
    correctIndex: 1,
    explanation: 'When a BST degenerates into a skewed tree (e.g. sorted inserts), its height equals N, making lookup O(N). Balanced trees like AVL or Red-Black guarantee O(log N).',
  },
  {
    topic: 'Operating Systems (BCA Core)',
    question: "Which scheduling algorithm is non-preemptive and may suffer from the 'Convoy Effect'?",
    options: ['Round Robin (RR)', 'Shortest Remaining Time First (SRTF)', 'First-Come, First-Served (FCFS)', 'Priority Preemptive'],
    correctIndex: 2,
    explanation: 'In FCFS, if a CPU-intensive process arrives first, all shorter I/O-bound processes queue behind it, creating the convoy effect.',
  },
  {
    topic: 'Database Management Systems',
    question: "Which normal form eliminates partial dependency on a composite primary key?",
    options: ['First Normal Form (1NF)', 'Second Normal Form (2NF)', 'Third Normal Form (3NF)', 'BCNF'],
    correctIndex: 1,
    explanation: '2NF requires 1NF and guarantees that every non-prime attribute is fully functionally dependent on the entire candidate key.',
  },
];

export const DailyQuestionCard: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQ = QUESTIONS_DATABASE[currentIndex];

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setCurrentIndex((prev) => (prev + 1) % QUESTIONS_DATABASE.length);
  };

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
  };

  return (
    <div className="rounded-2xl bg-[#161424] border border-purple-500/20 p-5 shadow-[0_4px_25px_rgba(0,0,0,0.4)]">
      {/* Header matching Screenshot 1 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-purple-400" />
          <h3 className="text-sm font-semibold text-white">Question of the Day</h3>
          <span className="text-[10px] text-purple-300 font-medium px-2 py-0.5 rounded-full bg-purple-500/15">
            {currentQ.topic}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleNextQuestion}
            className="w-8 h-8 rounded-full bg-[#201C33] hover:bg-[#2A2444] text-[#9E99AF] hover:text-white flex items-center justify-center transition-colors"
            title="Next Question"
            aria-label="Next Question"
          >
            <RotateCw size={14} />
          </button>
          <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center shadow-[0_0_10px_rgba(169,112,255,0.4)]">
            <Sparkles size={14} />
          </div>
        </div>
      </div>

      {/* Question prompt */}
      <p className="text-sm font-medium text-white leading-relaxed mb-4">
        {currentQ.question}
      </p>

      {/* Multiple-choice options */}
      <div className="space-y-2">
        {currentQ.options.map((option, idx) => {
          let styleClass =
            'bg-[#1D192E] border-purple-500/15 text-[#D1CEE0] hover:bg-[#25203B] hover:border-purple-500/35';

          if (isAnswered) {
            if (idx === currentQ.correctIndex) {
              styleClass =
                'bg-emerald-950/40 border-emerald-500/50 text-emerald-200 font-medium shadow-[0_0_15px_rgba(16,185,129,0.2)]';
            } else if (idx === selectedOption) {
              styleClass = 'bg-rose-950/40 border-rose-500/50 text-rose-200';
            } else {
              styleClass = 'opacity-50 border-transparent';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={isAnswered}
              className={`w-full text-left p-3 rounded-xl border text-xs leading-snug transition-all flex items-start gap-2.5 ${styleClass}`}
            >
              <span className="w-5 h-5 rounded-md bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="flex-1">{option}</span>
              {isAnswered && idx === currentQ.correctIndex && (
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
              )}
              {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && (
                <XCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback & Explanation */}
      {isAnswered && (
        <div className="mt-3.5 p-3 rounded-xl bg-[#201C33] border border-purple-500/20 text-xs text-purple-200 leading-relaxed animate-fadeIn">
          <span className="font-semibold text-white">
            {selectedOption === currentQ.correctIndex ? 'Correct! ' : 'Not quite. '}
          </span>
          {currentQ.explanation}
        </div>
      )}

      {/* Manage Interview Stress card matching Screenshot 1 */}
      <div className="mt-4 pt-4 border-t border-purple-500/15 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-white tracking-tight">
            Manage Interview Stress
          </h4>
          <p className="text-[11px] text-[#9E99AF] mt-0.5">
            Techniques to stay calm and structured during technical rounds
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-purple-500/15 text-purple-300 text-xs font-semibold border border-purple-500/20 shrink-0">
          Mindset
        </div>
      </div>
    </div>
  );
};
