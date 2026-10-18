import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Zap, CheckCircle2, XCircle, Award, RotateCw } from 'lucide-react';

interface QuickPracticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRACTICE_QUESTIONS = [
  {
    topic: 'C++ Pointers',
    q: 'What is the size of an integer pointer on a 64-bit operating system?',
    options: ['4 bytes', '8 bytes', '2 bytes', 'Depends on compiler flag only'],
    answer: 1,
    note: 'All memory pointers on a 64-bit architecture consume 8 bytes (64 bits).',
  },
  {
    topic: 'DSA Complexity',
    q: 'What is the time complexity of building a heap from an unsorted array of N elements?',
    options: ['O(N log N)', 'O(N)', 'O(log N)', 'O(N^2)'],
    answer: 1,
    note: 'Using the bottom-up heapify algorithm, building a heap takes mathematical linear O(N) time.',
  },
  {
    topic: 'Quantitative Aptitude',
    q: 'A train 120m long passes an electric pole in 6 seconds. What is the speed of the train in km/hr?',
    options: ['72 km/hr', '60 km/hr', '80 km/hr', '90 km/hr'],
    answer: 0,
    note: 'Speed = 120m / 6s = 20 m/s. Converting to km/hr: 20 * (18/5) = 72 km/hr.',
  },
  {
    topic: 'DBMS',
    q: 'Which SQL command is classified under Data Definition Language (DDL)?',
    options: ['INSERT', 'UPDATE', 'TRUNCATE', 'SELECT'],
    answer: 2,
    note: 'TRUNCATE is a DDL command that deallocates data pages directly without logging row deletions.',
  },
  {
    topic: 'Operating Systems',
    q: 'Which condition is NOT one of Coffman\'s four conditions for Deadlock?',
    options: ['Mutual Exclusion', 'Hold and Wait', 'Preemption Allowed', 'Circular Wait'],
    answer: 2,
    note: 'Coffman requires No Preemption. If preemption is allowed, deadlock cannot occur.',
  },
];

export const QuickPracticeModal: React.FC<QuickPracticeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { logStudySession } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const resetQuiz = () => {
    setCurrentIndex(0);
    setSelectedAnswers([]);
    setIsFinished(false);
  };

  const handleSelectOption = (idx: number) => {
    const updated = [...selectedAnswers];
    updated[currentIndex] = idx;
    setSelectedAnswers(updated);

    if (currentIndex < PRACTICE_QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
      // Auto log 15 minutes of study practice
      logStudySession('sub-cpp-dsa', 15, 'Completed Quick Practice Drill');
    }
  };

  const score = selectedAnswers.reduce((acc, ans, i) => {
    return ans === PRACTICE_QUESTIONS[i].answer ? acc + 1 : acc;
  }, 0);

  const currentQ = PRACTICE_QUESTIONS[currentIndex];

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        resetQuiz();
        onClose();
      }}
      title="Quick Practice Drill"
      subtitle="BCA Placement & Core CS High-Yield Questions"
      maxWidth="lg"
    >
      {!isFinished ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-purple-300 font-semibold bg-purple-500/15 px-2.5 py-1 rounded-full border border-purple-500/20">
              {currentQ.topic}
            </span>
            <span className="text-[#9E99AF] font-mono">
              Question {currentIndex + 1} of {PRACTICE_QUESTIONS.length}
            </span>
          </div>

          <h3 className="text-sm sm:text-base font-semibold text-white leading-relaxed">
            {currentQ.q}
          </h3>

          <div className="space-y-2 pt-2">
            {currentQ.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSelectOption(i)}
                className="w-full text-left p-3.5 rounded-xl bg-[#1A1629] border border-purple-500/15 hover:border-purple-500/40 hover:bg-[#201C33] text-xs text-[#D1CEE0] hover:text-white transition-all flex items-center gap-3 active:scale-[0.99]"
              >
                <span className="w-5 h-5 rounded-md bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0 font-bold text-[10px]">
                  {String.fromCharCode(65 + i)}
                </span>
                <span>{opt}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 mx-auto flex items-center justify-center text-white shadow-[0_0_25px_rgba(169,112,255,0.5)]">
            <Award size={32} />
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">Drill Completed!</h3>
            <p className="text-xs text-[#9E99AF] mt-1">
              Logged 15 minutes of practice time into your daily study tracker.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#1A1629] border border-purple-500/20 max-w-xs mx-auto">
            <div className="text-2xl font-bold text-purple-300 tabular-nums">
              {score} / {PRACTICE_QUESTIONS.length}
            </div>
            <div className="text-xs text-[#9E99AF]">
              {score >= 4 ? 'Excellent accuracy!' : 'Good effort! Review the solutions below.'}
            </div>
          </div>

          <div className="space-y-2 text-left max-h-56 overflow-y-auto pr-1">
            {PRACTICE_QUESTIONS.map((q, i) => {
              const userAns = selectedAnswers[i];
              const isCorrect = userAns === q.answer;
              return (
                <div key={i} className="p-2.5 rounded-xl bg-[#151221] border border-purple-500/15 text-xs">
                  <div className="flex items-center gap-2 mb-1">
                    {isCorrect ? (
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle size={14} className="text-rose-400 shrink-0" />
                    )}
                    <span className="font-semibold text-white truncate">{q.q}</span>
                  </div>
                  <p className="text-[11px] text-[#9E99AF] italic pl-5">{q.note}</p>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={resetQuiz}
              className="px-4 py-2 rounded-xl bg-[#201C33] text-purple-300 text-xs font-semibold hover:text-white flex items-center gap-1.5"
            >
              <RotateCw size={13} />
              <span>Retry Drill</span>
            </button>
            <button
              onClick={() => {
                resetQuiz();
                onClose();
              }}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};
