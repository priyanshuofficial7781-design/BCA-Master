import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Award,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  HelpCircle,
  RotateCcw,
  BookOpen,
  GraduationCap,
  Briefcase,
  ChevronRight,
  TrendingUp,
  Brain,
  MessageSquare,
} from 'lucide-react';
import { soundEffects } from '../../services/soundEffects';
import { geminiService, VivaEvaluationResult } from '../../services/geminiService';
import { VivaQuestionExplorerModal } from './VivaQuestionExplorerModal';

interface VivaQuestion {
  id: string;
  category: 'oops' | 'dbms' | 'os' | 'networks' | 'capstone' | 'dsa';
  question: string;
  expectedKeyPoints: string[];
  idealAnswer: string;
  difficulty: 'Foundation' | 'Moderate' | 'Advanced';
}

interface VivaTrack {
  id: string;
  name: string;
  examinerName: string;
  examinerTitle: string;
  description: string;
  icon: string;
  questions: VivaQuestion[];
}

const VIVA_TRACKS: VivaTrack[] = [
  {
    id: 'university-practical',
    name: 'University Practical Exam Viva',
    examinerName: 'Prof. K. Sharma',
    examinerTitle: 'Senior BCA Academic Dean & External Examiner',
    description: 'BCA semester practical lab viva covering C++ OOPs, DBMS queries, OS scheduling, and Data Structures.',
    icon: 'GraduationCap',
    questions: [
      {
        id: 'univ-1',
        category: 'oops',
        question: 'Explain the difference between a Virtual Function and a Pure Virtual Function in C++. What happens if a derived class does not override a pure virtual function?',
        expectedKeyPoints: [
          'Virtual function has a default body; pure virtual function has no definition in base class and ends with = 0',
          'Pure virtual function turns the class into an Abstract Class',
          'Cannot instantiate objects of an abstract class',
          'If derived class does not override, it remains abstract and cannot be instantiated',
        ],
        idealAnswer:
          'A virtual function has a definition in the base class and provides runtime polymorphism via dynamic dispatch (vtable). A pure virtual function has no definition in the base class (declared with = 0) and makes the class abstract. If a derived class does not override it, the derived class also becomes abstract and cannot be instantiated.',
        difficulty: 'Moderate',
      },
      {
        id: 'univ-2',
        category: 'dbms',
        question: 'What are ACID properties in Database Management Systems? Explain how Transaction Atomicity is guaranteed during a system crash.',
        expectedKeyPoints: [
          'A: Atomicity (All or nothing), C: Consistency (valid states), I: Isolation (concurrent independence), D: Durability (committed persistence)',
          'Atomicity uses write-ahead logging (WAL) and undo-logs',
          'If crash occurs before commit, database rolls back uncommitted changes using the log',
        ],
        idealAnswer:
          'ACID stands for Atomicity, Consistency, Isolation, and Durability. Atomicity ensures all operations of a transaction execute completely, or none at all. It is guaranteed using Write-Ahead Logging (WAL) and undo/redo logs, where any uncommitted transactions active during a crash are rolled back to the last consistent checkpoint.',
        difficulty: 'Foundation',
      },
      {
        id: 'univ-3',
        category: 'os',
        question: 'What is the fundamental difference between a Semaphore and a Mutex? Can a Mutex be unlocked by a thread that did not lock it?',
        expectedKeyPoints: [
          'Mutex is a locking mechanism with ownership; Semaphore is a signaling mechanism',
          'Counting vs binary semaphores',
          'Mutex has strict thread ownership: ONLY the thread that locked the mutex can unlock it',
          'A semaphore can be signaled/unlocked by any thread',
        ],
        idealAnswer:
          'A Mutex is an ownership-based locking mechanism: only the thread that acquired the mutex has the permission to release it. A Semaphore is a signaling mechanism where any thread can signal (V operation) to wake up waiting threads (P operation). Therefore, a mutex cannot be unlocked by another thread, while a semaphore can.',
        difficulty: 'Advanced',
      },
      {
        id: 'univ-4',
        category: 'networks',
        question: 'Explain the TCP 3-Way Handshake protocol. Why are 2 packets not sufficient for establishing a reliable bidirectional connection?',
        expectedKeyPoints: [
          'Step 1: SYN (Client to Server with Seq X)',
          'Step 2: SYN-ACK (Server to Client with Ack X+1, Seq Y)',
          'Step 3: ACK (Client to Server with Ack Y+1)',
          'Two packets cannot confirm that the client received the server’s initial sequence number',
          'Prevents duplicate stale connection requests from tying up server resources',
        ],
        idealAnswer:
          'The 3-way handshake involves SYN (client sends initial seq X), SYN-ACK (server acknowledges X+1 and sends seq Y), and ACK (client acknowledges Y+1). Two packets are insufficient because both sides must reliably synchronize and confirm their initial sequence numbers in both directions, and avoid stale duplicate connection requests.',
        difficulty: 'Moderate',
      },
    ],
  },
  {
    id: 'campus-placement',
    name: 'Campus Placement Technical Interview',
    examinerName: 'Ayesha Khan',
    examinerTitle: 'Staff Engineering Lead & Campus Hiring Panel',
    description: 'High-frequency technical screening questions asked by TCS Digital, Infosys, and Product tech companies.',
    icon: 'Briefcase',
    questions: [
      {
        id: 'place-1',
        category: 'dsa',
        question: 'How does an unordered_map (Hash Table) achieve O(1) average lookup time, and under what conditions does it degrade to O(N)? How do modern implementations mitigate this?',
        expectedKeyPoints: [
          'Hash function maps keys to buckets via modulo index',
          'Collision resolution using separate chaining or open addressing',
          'Degrades to O(N) when all keys hash to the same bucket (hash collisions)',
          'Mitigation: Good uniform hash functions (MurmurHash), dynamic rehashing when load factor exceeds threshold, and Red-Black trees for buckets (Java 8+)',
        ],
        idealAnswer:
          'An unordered_map uses a hash function to map keys directly into bucket array indices, giving O(1) average lookup. It degrades to O(N) when severe hash collisions occur and all elements fall into a single bucket. Modern implementations mitigate this by dynamic rehashing when the load factor exceeds 0.75, and converting linked list buckets to balanced Red-Black trees when bucket length exceeds 8.',
        difficulty: 'Advanced',
      },
      {
        id: 'place-2',
        category: 'dbms',
        question: 'Compare B-Tree indexes versus Hash indexes in PostgreSQL/MySQL. Which index type would you choose for range queries (e.g., WHERE age BETWEEN 20 AND 30) and why?',
        expectedKeyPoints: [
          'B-Trees keep data sorted in balanced tree structure; Hash indexes use key hashes',
          'Hash index only supports point equality lookups (WHERE age = 25) in O(1)',
          'B-Tree supports range queries, sorting, and inequalities in O(log N)',
          'Choose B-Tree for BETWEEN range queries because leaf nodes are linked in sequential order',
        ],
        idealAnswer:
          'B-Tree indexes maintain data in sorted balanced hierarchical order with sequentially linked leaf nodes, making them ideal for range queries (BETWEEN, <, >) in O(log N) time. Hash indexes only support exact equality matches via hash tables and cannot perform range scans. Therefore, B-Tree is required for range queries.',
        difficulty: 'Moderate',
      },
    ],
  },
  {
    id: 'capstone-defense',
    name: 'Capstone Project Defense & Viva',
    examinerName: 'Dr. M. Ramanathan',
    examinerTitle: 'University Capstone Review Board Chairman',
    description: 'Defend software architecture, database normalization, concurrency, and security choices of your final year projects.',
    icon: 'Award',
    questions: [
      {
        id: 'cap-1',
        category: 'capstone',
        question: 'Explain how you normalized your database schema to Third Normal Form (3NF). Can you give an example of transitive dependency that you eliminated?',
        expectedKeyPoints: [
          '1NF: Atomic values, unique rows',
          '2NF: 1NF + no partial functional dependency on composite primary key',
          '3NF: 2NF + no transitive dependency (non-key attribute depending on another non-key attribute)',
          'Example: Student -> DeptID -> DeptName; DeptName must be split into separate Department table',
        ],
        idealAnswer:
          'Third Normal Form requires the schema to be in 2NF and have no transitive functional dependencies, meaning every non-prime attribute must depend directly on the primary key, not another non-prime attribute. For example, if an Order table had CustomerID and CustomerCity, CustomerCity transitively depends on CustomerID; eliminating this required extracting Customer into its own table.',
        difficulty: 'Moderate',
      },
      {
        id: 'cap-2',
        category: 'capstone',
        question: 'How did you handle user authentication and session security in your project? What precautions protect against Cross-Site Scripting (XSS) and SQL Injection?',
        expectedKeyPoints: [
          'JWT or secure session tokens stored in HttpOnly, SameSite cookies',
          'Password hashing with salted bcrypt/argon2',
          'SQL injection prevented using parameterized queries and ORM prepared statements',
          'XSS prevented via input sanitization and context-aware output encoding',
        ],
        idealAnswer:
          'Authentication is handled using cryptographically salted password hashes (bcrypt) and signed JWT tokens stored in HttpOnly, Secure, SameSite cookies to mitigate token theft. SQL injection is eliminated using parameterized prepared statements, and XSS is prevented by sanitizing inputs and escaping dynamic outputs in the frontend DOM.',
        difficulty: 'Advanced',
      },
    ],
  },
];

export const TechVivaSimulatorView: React.FC = () => {
  const { data } = useApp();

  const [selectedTrackId, setSelectedTrackId] = useState<string>('university-practical');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [studentAnswer, setStudentAnswer] = useState<string>('');

  // Voice Recognition State
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  // Examiner Speech Synthesis Voice
  const [examinerVoiceEnabled, setExaminerVoiceEnabled] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Evaluation & Results State
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<VivaEvaluationResult | null>(null);
  const [sessionScores, setSessionScores] = useState<number[]>([]);
  const [isQuestionBankOpen, setIsQuestionBankOpen] = useState<boolean>(false);
  const [customVivaQuestion, setCustomVivaQuestion] = useState<VivaQuestion | null>(null);

  const activeTrack = VIVA_TRACKS.find((t) => t.id === selectedTrackId) || VIVA_TRACKS[0];
  const activeQuestion = customVivaQuestion || activeTrack.questions[currentQuestionIdx] || activeTrack.questions[0];

  const handleSelectVivaQuestion = (q: {
    id: string;
    question: string;
    expectedKeyPoints: string[];
    idealAnswer: string;
    domain: string;
    difficulty: string;
  }) => {
    const newQ: VivaQuestion = {
      id: q.id,
      category: 'dbms',
      question: q.question,
      expectedKeyPoints: q.expectedKeyPoints,
      idealAnswer: q.idealAnswer,
      difficulty: q.difficulty === 'hard' ? 'Advanced' : q.difficulty === 'medium' ? 'Moderate' : 'Foundation',
    };
    setCustomVivaQuestion(newQ);
    setStudentAnswer('');
    setEvaluation(null);
  };

  // Initialize Speech Recognition (Web Speech API)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            transcript += event.results[i][0].transcript;
          }
          setStudentAnswer((prev) => (prev ? prev + ' ' + transcript : transcript));
        };

        recognition.onerror = (e: any) => {
          console.warn('Speech recognition event:', e.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  // Voice Examiner speaking the question when question changes
  useEffect(() => {
    setStudentAnswer('');
    setEvaluation(null);

    if (examinerVoiceEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(activeQuestion.question);
      utterance.rate = 1.0;
      utterance.pitch = 0.95;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      // Speak question
      window.speechSynthesis.speak(utterance);
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentQuestionIdx, selectedTrackId]);

  // Toggle Microphone
  const toggleListening = () => {
    if (!speechSupported || !recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      soundEffects.playClick();
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        soundEffects.playClick();
      } catch (err) {
        console.warn('Speech recognition already active', err);
      }
    }
  };

  // Re-read question aloud
  const handleReadQuestionAloud = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(activeQuestion.question);
      utterance.rate = 1.0;
      utterance.pitch = 0.95;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Evaluate Answer via Gemini or Built-in Semantic Evaluator
  const handleSubmitVivaAnswer = async () => {
    if (!studentAnswer.trim()) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    soundEffects.playClick();
    setIsEvaluating(true);

    try {
      const result = await geminiService.evaluateVivaAnswer({
        track: activeTrack.name,
        question: activeQuestion.question,
        studentAnswer: studentAnswer.trim(),
        expectedKeyPoints: activeQuestion.expectedKeyPoints,
        idealAnswer: activeQuestion.idealAnswer,
      });

      setEvaluation(result);
      setSessionScores((prev) => [...prev, result.score]);

      if (result.score >= 8.5) {
        soundEffects.playLevelUp();
      } else {
        soundEffects.playTaskDone();
      }
    } catch (err) {
      console.error('Failed to evaluate viva answer', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    soundEffects.playClick();
    if (currentQuestionIdx < activeTrack.questions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      setCurrentQuestionIdx(0);
    }
  };

  const averageScore =
    sessionScores.length > 0
      ? (sessionScores.reduce((a, b) => a + b, 0) / sessionScores.length).toFixed(1)
      : '0.0';

  return (
    <div className="space-y-6 pb-24 lg:pb-12 animate-fadeIn max-w-5xl mx-auto select-none">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-br from-[#181335] via-[#100E22] to-[#0A0818] border border-[#B46CFF]/30 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00F0FF]/60 via-[#B46CFF]/70 to-transparent pointer-events-none" />

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-[#8B3DFF]/25 border border-[#B46CFF]/40 text-[#00F0FF] shadow-[0_0_15px_rgba(139,61,255,0.4)]">
              <Brain size={20} />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>AI Technical Viva & Voice Debrief</span>
                <span className="px-2 py-0.5 rounded-full bg-[#00F0FF]/20 text-[#00F0FF] text-[10px] font-mono font-bold border border-[#00F0FF]/30">
                  VOICE AI
                </span>
              </h2>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-[#AAA9C6] leading-relaxed">
            Simulate viva-voce exams with real university professors. Speak your answers aloud via microphone and receive deep rubric evaluations.
          </p>
        </div>

        {/* Live Scorecard Metrics & 10k Explorer Button */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => setIsQuestionBankOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-[#00F0FF]/15 hover:bg-[#00F0FF]/25 border border-[#00F0FF]/40 text-[#00F0FF] text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)] cursor-pointer"
            title="Browse 10,000+ university viva voce exam questions"
          >
            <Brain size={15} />
            <span>10k+ Viva Explorer</span>
          </button>

          <div className="p-2.5 px-4 rounded-2xl bg-[#141126] border border-purple-500/20 text-center">
            <span className="text-[10px] text-[#AAA9C6] uppercase font-bold block">Viva Average</span>
            <span className="text-xl font-black font-mono text-[#00FF9D]">{averageScore} / 10</span>
          </div>

          <div className="p-2.5 px-4 rounded-2xl bg-[#141126] border border-purple-500/20 text-center">
            <span className="text-[10px] text-[#AAA9C6] uppercase font-bold block">Evaluated</span>
            <span className="text-xl font-black font-mono text-white">{sessionScores.length} Qs</span>
          </div>
        </div>
      </div>

      {/* 3 Track Presets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {VIVA_TRACKS.map((track) => {
          const isSelected = track.id === selectedTrackId;
          return (
            <button
              key={track.id}
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setSelectedTrackId(track.id);
                setCurrentQuestionIdx(0);
              }}
              className={`p-4 rounded-3xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between gap-3 ${
                isSelected
                  ? 'bg-gradient-to-br from-[#1C163A] to-[#100E26] border-[#00F0FF] shadow-[0_0_25px_rgba(0,240,255,0.3)] ring-1 ring-[#00F0FF]'
                  : 'bg-[#12101F] border-white/10 hover:border-white/20'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#8B3DFF]/25 border border-[#B46CFF]/35 text-[10px] font-bold text-[#00F0FF] uppercase tracking-wider">
                    {track.questions.length} Questions
                  </span>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-[#00F0FF] text-[#06050C] flex items-center justify-center text-[10px] font-black">
                      ✓
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-white mb-0.5">{track.name}</h3>
                <p className="text-[11px] text-[#AAA9C6] line-clamp-2">{track.description}</p>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-purple-300">
                <span className="font-semibold">{track.examinerName}</span>
                <span className="text-[10px] text-[#AAA9C6]">Examiner</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Examiner Persona & Question Podium */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#181335] via-[#100E22] to-[#0A0818] border border-[#B46CFF]/35 shadow-[0_16px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl space-y-5 relative overflow-hidden">
        {/* Examiner Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#8B3DFF] to-[#00F0FF] p-0.5 shadow-[0_0_15px_rgba(139,61,255,0.4)]">
                <div className="w-full h-full rounded-2xl bg-[#0E0C1C] flex items-center justify-center text-white font-black text-sm">
                  {activeTrack.examinerName.split(' ').map((n) => n[0]).join('')}
                </div>
              </div>
              {isSpeaking && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#00FF9D] animate-ping" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">{activeTrack.examinerName}</h4>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-purple-500/20 text-[#B46CFF] font-medium">
                  {activeTrack.examinerTitle}
                </span>
              </div>
              <p className="text-xs text-[#AAA9C6] flex items-center gap-1.5 mt-0.5">
                <span>Question {currentQuestionIdx + 1} of {activeTrack.questions.length}</span>
                <span>•</span>
                <span className="text-[#00F0FF] font-semibold">{activeQuestion.difficulty} Tier</span>
              </p>
            </div>
          </div>

          {/* Voice Controls for Examiner */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReadQuestionAloud}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1C182E] hover:bg-[#282245] border border-purple-500/25 text-[#00F0FF] text-xs font-semibold transition-all cursor-pointer"
              title="Have the professor read the question again"
            >
              <Volume2 size={14} className={isSpeaking ? 'animate-pulse text-[#00FF9D]' : ''} />
              <span className="hidden sm:inline">{isSpeaking ? 'Speaking...' : 'Repeat Question'}</span>
            </button>

            <button
              type="button"
              onClick={() => setExaminerVoiceEnabled(!examinerVoiceEnabled)}
              className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                examinerVoiceEnabled
                  ? 'bg-purple-600/20 border-purple-500/40 text-purple-300'
                  : 'bg-[#181528] border-white/10 text-gray-500'
              }`}
              title={examinerVoiceEnabled ? 'Examiner voice enabled' : 'Examiner voice muted'}
            >
              {examinerVoiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
          </div>
        </div>

        {/* Question Text Podium */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0E0C1C] border border-[#B46CFF]/30 space-y-2">
          <span className="text-[10px] text-[#00F0FF] uppercase font-mono font-bold tracking-wider block">
            VIVA QUESTION PROMPT
          </span>
          <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
            "{activeQuestion.question}"
          </p>
        </div>

        {/* Student Answer Input (Microphone + Text) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-[#AAA9C6]">
            <span className="font-semibold flex items-center gap-1.5">
              <MessageSquare size={14} className="text-[#00F0FF]" />
              <span>Your Spoken or Written Answer:</span>
            </span>

            {speechSupported && (
              <span className="text-[11px] text-purple-300">
                {isListening ? 'Listening via microphone...' : 'Click mic to speak aloud'}
              </span>
            )}
          </div>

          <div className="relative">
            <textarea
              rows={4}
              value={studentAnswer}
              onChange={(e) => setStudentAnswer(e.target.value)}
              placeholder="Speak aloud using the microphone or type your technical explanation here (mention definitions, time complexities, and trade-offs)..."
              className="w-full p-4 rounded-2xl bg-[#0E0C1C] border border-purple-500/25 text-white text-xs sm:text-sm focus:outline-none focus:border-[#00F0FF] leading-relaxed resize-none selection:bg-[#8B3DFF]/40"
            />

            {/* Mic Floating Action Button */}
            {speechSupported && (
              <button
                type="button"
                onClick={toggleListening}
                className={`absolute right-3 bottom-3 p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                  isListening
                    ? 'bg-rose-600 text-white border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.6)] animate-pulse'
                    : 'bg-[#1C182E] hover:bg-[#282245] text-purple-300 hover:text-white border-purple-500/30'
                }`}
                title={isListening ? 'Stop listening' : 'Start microphone speech-to-text'}
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                <span className="text-xs font-bold font-mono">
                  {isListening ? 'Recording' : 'Voice Input'}
                </span>
              </button>
            )}
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setStudentAnswer('');
                setEvaluation(null);
              }}
              className="flex items-center gap-1 text-xs text-[#AAA9C6] hover:text-white transition-colors"
            >
              <RotateCcw size={12} />
              <span>Clear Answer</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSubmitVivaAnswer}
                disabled={isEvaluating || !studentAnswer.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#8B3DFF] via-[#A855F7] to-[#00F0FF] text-white font-bold text-xs hover:brightness-110 active:scale-95 shadow-[0_0_20px_rgba(139,61,255,0.5)] transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles size={14} className={isEvaluating ? 'animate-spin' : ''} />
                <span>{isEvaluating ? 'Evaluating with Examiner...' : 'Submit Answer for Marks'}</span>
              </button>

              <button
                type="button"
                onClick={handleNextQuestion}
                className="flex items-center gap-1 px-4 py-2.5 rounded-2xl bg-[#1C182E] hover:bg-[#282245] border border-white/10 text-white text-xs font-semibold transition-all cursor-pointer"
              >
                <span>Next Question</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* AI Evaluation & Debrief Card */}
        {evaluation && (
          <div className="p-5 rounded-3xl bg-[#0E0C1C] border border-[#00FF9D]/40 shadow-[0_10px_35px_rgba(0,255,157,0.15)] space-y-4 animate-fadeIn">
            {/* Score & Verdict Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-[#00FF9D]/10 via-[#00F0FF]/10 to-transparent border border-[#00FF9D]/30">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#00FF9D]/20 border border-[#00FF9D]/40 flex items-center justify-center text-[#00FF9D] font-black text-lg font-mono">
                  {evaluation.score}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-white">Score: {evaluation.score} / 10 Marks</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                      {evaluation.verdict}
                    </span>
                  </div>
                  <p className="text-xs text-[#AAA9C6] mt-0.5">
                    Evaluated against university academic viva criteria
                  </p>
                </div>
              </div>

              <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 size={16} />
                <span>Marks recorded in running session average</span>
              </div>
            </div>

            {/* Examiner's Verbal Remark */}
            <div className="p-4 rounded-2xl bg-[#141126] border border-white/5 space-y-1">
              <span className="text-[10px] text-[#00F0FF] uppercase font-mono font-bold tracking-wider block">
                EXAMINER'S VERBAL REMARK
              </span>
              <p className="text-xs sm:text-sm text-white italic leading-relaxed">
                "{evaluation.examinerFeedback}"
              </p>
            </div>

            {/* Strengths & Missing Concepts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Concepts Grasped */}
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-2">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 size={14} />
                  <span>Key Concepts You Articulated</span>
                </span>
                <ul className="space-y-1 text-xs text-emerald-200/90">
                  {evaluation.strengths.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Crucial Missing Technical Points */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-2">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <AlertCircle size={14} />
                  <span>Crucial Keywords to Add for Full Marks</span>
                </span>
                <ul className="space-y-1 text-xs text-amber-200/90">
                  {evaluation.missingConcepts.length > 0 ? (
                    evaluation.missingConcepts.map((m, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{m}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-emerald-300">All major university key points covered!</li>
                  )}
                </ul>
              </div>
            </div>

            {/* University Standard Model Answer */}
            <div className="p-4 rounded-2xl bg-[#141126] border border-[#B46CFF]/25 space-y-1.5">
              <span className="text-xs font-bold text-[#B46CFF] flex items-center gap-1.5">
                <BookOpen size={14} />
                <span>University Standard Model Answer</span>
              </span>
              <p className="text-xs text-[#AAA9C6] leading-relaxed">
                {evaluation.idealAnswer}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 10,000+ University Viva Questions Explorer Modal */}
      <VivaQuestionExplorerModal
        isOpen={isQuestionBankOpen}
        onClose={() => setIsQuestionBankOpen(false)}
        onSelectVivaQuestion={handleSelectVivaQuestion}
      />
    </div>
  );
};
