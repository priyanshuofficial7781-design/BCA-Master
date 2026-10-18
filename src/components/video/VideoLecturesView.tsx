import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Play,
  Maximize2,
  Minimize2,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  Terminal,
  Brain,
  Sparkles,
  Clock,
  Youtube,
  Plus,
  Share2,
  Layers,
  Code2,
  Database,
  Cpu,
  Network,
  Globe,
  Award,
} from 'lucide-react';
import { soundEffects } from '../../services/soundEffects';

interface CuratedLecture {
  id: string;
  videoId: string;
  title: string;
  channel: string;
  category: 'cpp' | 'dsa' | 'dbms' | 'os' | 'networks' | 'web';
  duration: string;
  semester: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  topics: string[];
}

const CURATED_LECTURES: CuratedLecture[] = [
  // C++ & Object-Oriented Programming
  {
    id: 'cpp-1',
    videoId: 'kJQP7kiw5Fk',
    title: 'C++ Complete Course for Beginners to Advanced (BCA Syllabus)',
    channel: 'FreeCodeCamp / University CS',
    category: 'cpp',
    duration: '4h 15m',
    semester: 'Semester 1 & 2',
    difficulty: 'Beginner',
    description: 'Master core C++ pointers, references, memory management, classes, inheritance, and standard template library (STL).',
    topics: ['Pointers', 'Classes', 'Polymorphism', 'STL Vector', 'Memory'],
  },
  {
    id: 'cpp-2',
    videoId: 'vLnPwxZdW4Y',
    title: 'C++ OOPs Deep Dive - Inheritance, Encapsulation & Virtual Functions',
    channel: 'Programming with Mosh',
    category: 'cpp',
    duration: '1h 48m',
    semester: 'Semester 2',
    difficulty: 'Intermediate',
    description: 'Clear architectural explanation of Object-Oriented design patterns and virtual table mechanics in C++.',
    topics: ['OOPs', 'Virtual Functions', 'Abstraction', 'Constructors'],
  },
  // Data Structures & Algorithms
  {
    id: 'dsa-1',
    videoId: 'RBSGKlAnoiM',
    title: 'Data Structures and Algorithms in C++ - Complete University Course',
    channel: 'CS Dojo / MIT OCW',
    category: 'dsa',
    duration: '5h 30m',
    semester: 'Semester 3',
    difficulty: 'Intermediate',
    description: 'Arrays, Linked Lists, Stacks, Queues, Binary Trees, and asymptotic Big-O time and space complexity.',
    topics: ['Arrays', 'Linked Lists', 'Stacks', 'Recursion', 'Big-O'],
  },
  {
    id: 'dsa-2',
    videoId: '0IAPZzGSbME',
    title: 'Binary Trees & Binary Search Trees Traversal Complete Masterclass',
    channel: 'Striver / Take U Forward',
    category: 'dsa',
    duration: '2h 10m',
    semester: 'Semester 3',
    difficulty: 'Intermediate',
    description: 'In-order, Pre-order, Post-order DFS traversals, BFS Level-order, and Lowest Common Ancestor algorithms.',
    topics: ['Trees', 'BST', 'DFS', 'BFS', 'Lowest Common Ancestor'],
  },
  {
    id: 'dsa-3',
    videoId: 'tWVWeAqZ0WU',
    title: 'Dynamic Programming - Learn to Solve Algorithmic DP Problems',
    channel: 'FreeCodeCamp',
    category: 'dsa',
    duration: '5h 05m',
    semester: 'Semester 4',
    difficulty: 'Advanced',
    description: 'Memoization, tabulation, 0/1 Knapsack, Longest Common Subsequence, and Coin Change bottom-up states.',
    topics: ['Dynamic Programming', 'Knapsack', 'LCS', 'Tabulation'],
  },
  // DBMS & SQL
  {
    id: 'dbms-1',
    videoId: 'HXV3zeRR3h4',
    title: 'SQL Tutorial - Full Database Course for University BCA Students',
    channel: 'Mike Dane / Giraffe Academy',
    category: 'dbms',
    duration: '4h 20m',
    semester: 'Semester 3',
    difficulty: 'Beginner',
    description: 'Relational database schema creation, table constraints, SQL joins, aggregate queries, and subqueries.',
    topics: ['SQL', 'Joins', 'Group By', 'Foreign Keys', 'DDL/DML'],
  },
  {
    id: 'dbms-2',
    videoId: 'ztHopE5Wnpc',
    title: 'Database Normalization Masterclass - 1NF, 2NF, 3NF & BCNF',
    channel: 'Knowledge Gate / Dr. Sanchit',
    category: 'dbms',
    duration: '1h 35m',
    semester: 'Semester 3',
    difficulty: 'Intermediate',
    description: 'Functional dependencies, prime attributes, candidate keys, and step-by-step lossless relational decomposition.',
    topics: ['1NF', '2NF', '3NF', 'BCNF', 'Functional Dependencies'],
  },
  {
    id: 'dbms-3',
    videoId: 'BPHAr4QGGVE',
    title: 'Transactions, ACID Properties & Concurrency Control in DBMS',
    channel: 'NPTEL University Lectures',
    category: 'dbms',
    duration: '1h 50m',
    semester: 'Semester 4',
    difficulty: 'Advanced',
    description: 'Atomicity, Consistency, Isolation, Durability, serializability schedules, and two-phase locking protocols.',
    topics: ['ACID', 'Transactions', 'Two-Phase Locking', 'Serializability'],
  },
  // Operating Systems
  {
    id: 'os-1',
    videoId: '26QPDBe-NB8',
    title: 'Operating Systems - Core Concepts and Architectural Foundations',
    channel: 'Neso Academy',
    category: 'os',
    duration: '3h 45m',
    semester: 'Semester 4',
    difficulty: 'Intermediate',
    description: 'Kernel architectures, system calls, process state lifecycles, PCB structures, and inter-process communication.',
    topics: ['Process States', 'System Calls', 'Kernel', 'IPC'],
  },
  {
    id: 'os-2',
    videoId: 'bkSWJJZNgf8',
    title: 'CPU Scheduling Algorithms - FCFS, SJF, Round Robin & Priority',
    channel: 'Gate Smashers',
    category: 'os',
    duration: '1h 25m',
    semester: 'Semester 4',
    difficulty: 'Intermediate',
    description: 'Preemptive vs Non-preemptive scheduling, Gantt chart construction, waiting time, and turnaround time math.',
    topics: ['CPU Scheduling', 'Round Robin', 'FCFS', 'Gantt Charts'],
  },
  {
    id: 'os-3',
    videoId: 'rW_dQ4uUuhE',
    title: 'Process Synchronization, Semaphores & Deadlock Avoidance',
    channel: 'Neso Academy',
    category: 'os',
    duration: '2h 15m',
    semester: 'Semester 4',
    difficulty: 'Advanced',
    description: 'Critical section problem, Peterson algorithm, mutex locks, counting semaphores, and Banker algorithm.',
    topics: ['Semaphores', 'Deadlocks', 'Critical Section', 'Banker Algorithm'],
  },
  // Computer Networks
  {
    id: 'cn-1',
    videoId: 'IPvYjXCsTg8',
    title: 'Computer Networking Course - OSI 7 Layer Model & TCP/IP Protocol Suite',
    channel: 'FreeCodeCamp',
    category: 'networks',
    duration: '4h 07m',
    semester: 'Semester 5',
    difficulty: 'Intermediate',
    description: 'Physical, Data Link, Network, Transport, and Application layers, packet encapsulation, and IP routing.',
    topics: ['OSI Model', 'TCP/IP', 'Ethernet', 'Routing', 'DNS/HTTP'],
  },
  {
    id: 'cn-2',
    videoId: 'qiQR5rTSshw',
    title: 'IP Addressing, Subnetting & CIDR Math for University Exams',
    channel: 'NetworkChuck',
    category: 'networks',
    duration: '1h 15m',
    semester: 'Semester 5',
    difficulty: 'Intermediate',
    description: 'IPv4 binary math, subnet masks, slash notation, network vs broadcast addresses, and VLSM design.',
    topics: ['Subnetting', 'CIDR', 'IPv4', 'VLSM', 'Network Masks'],
  },
  // Full-Stack Web Development
  {
    id: 'web-1',
    videoId: 'G3e-cpL7ofc',
    title: 'HTML & CSS Full Course - Modern Responsive Web Development',
    channel: 'SuperSimpleDev',
    category: 'web',
    duration: '6h 30m',
    semester: 'Semester 3 & 4',
    difficulty: 'Beginner',
    description: 'Semantic HTML5, CSS Flexbox, Grid systems, responsive media queries, and accessible UI layout.',
    topics: ['HTML5', 'CSS Flexbox', 'CSS Grid', 'Responsive Design'],
  },
  {
    id: 'web-2',
    videoId: 'W6NZfCO5SIk',
    title: 'JavaScript Tutorial for Beginners - Complete DOM & ES6 Crash Course',
    channel: 'Programming with Mosh',
    category: 'web',
    duration: '1h 40m',
    semester: 'Semester 4',
    difficulty: 'Beginner',
    description: 'Variables, arrow functions, DOM manipulation, arrays, event listeners, promises, and async/await.',
    topics: ['ES6', 'DOM Manipulation', 'Async/Await', 'Events'],
  },
  {
    id: 'web-3',
    videoId: 'bMknfKXIFA8',
    title: 'React.js Complete Tutorial for University Web Projects',
    channel: 'FreeCodeCamp',
    category: 'web',
    duration: '3h 55m',
    semester: 'Semester 5 & 6',
    difficulty: 'Intermediate',
    description: 'Components, JSX, useState, useEffect, context API, custom hooks, and full-stack API integration.',
    topics: ['React', 'Hooks', 'Components', 'Context API', 'State'],
  },
];

const CATEGORY_TABS: Array<{ id: CuratedLecture['category'] | 'all'; label: string; icon: React.ReactNode }> = [
  { id: 'all', label: 'All Lectures', icon: <Layers size={16} /> },
  { id: 'cpp', label: 'C++ & OOPs', icon: <Code2 size={16} /> },
  { id: 'dsa', label: 'DSA & Algorithms', icon: <Terminal size={16} /> },
  { id: 'dbms', label: 'DBMS & SQL', icon: <Database size={16} /> },
  { id: 'os', label: 'Operating Systems', icon: <Cpu size={16} /> },
  { id: 'networks', label: 'Computer Networks', icon: <Network size={16} /> },
  { id: 'web', label: 'Full-Stack Web', icon: <Globe size={16} /> },
];

export const VideoLecturesView: React.FC = () => {
  const { videoState, openVideo, setPiP, setActiveTab, logStudySession } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CuratedLecture['category'] | 'all'>('all');
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);

  // Active Lecture State (defaults to current videoState or first lecture)
  const [activeLecture, setActiveLecture] = useState<CuratedLecture>(() => {
    if (videoState.videoId) {
      const match = CURATED_LECTURES.find((l) => l.videoId === videoState.videoId);
      if (match) return match;
    }
    return CURATED_LECTURES[0];
  });

  // Timestamped Notes Scratchpad with localStorage persistence
  const [lectureNotes, setLectureNotes] = useState<string>(() => {
    return localStorage.getItem(`bca_notes_${activeLecture.videoId}`) || '';
  });
  const [savedNotesFeedback, setSavedNotesFeedback] = useState(false);
  const [completedFeedback, setCompletedFeedback] = useState(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Sync active lecture when videoState videoId changes externally
  useEffect(() => {
    if (videoState.videoId && videoState.videoId !== activeLecture.videoId) {
      const match = CURATED_LECTURES.find((l) => l.videoId === videoState.videoId);
      if (match) {
        setActiveLecture(match);
      } else {
        setActiveLecture({
          id: `custom-${videoState.videoId}`,
          videoId: videoState.videoId,
          title: videoState.title || 'Custom Video Lecture',
          channel: videoState.channel || 'YouTube Video',
          category: 'cpp',
          duration: 'Custom',
          semester: 'All Semesters',
          difficulty: 'Intermediate',
          description: 'Loaded via custom YouTube URL / Video ID.',
          topics: ['Lecture', 'Custom'],
        });
      }
    }
  }, [videoState.videoId]);

  // Load notes when activeLecture changes
  useEffect(() => {
    const saved = localStorage.getItem(`bca_notes_${activeLecture.videoId}`) || '';
    setLectureNotes(saved);
  }, [activeLecture.videoId]);

  // Extract YouTube Video ID from standard formats:
  // 1. https://www.youtube.com/watch?v=VIDEO_ID
  // 2. https://youtu.be/VIDEO_ID
  // 3. https://www.youtube.com/embed/VIDEO_ID
  // 4. Raw 11-char video ID (e.g. kJQP7kiw5Fk)
  const extractVideoId = (input: string): string | null => {
    const trimmed = input.trim();
    if (!trimmed) return null;
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return trimmed;
    }
    const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : null;
  };

  const handleLoadCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setUrlError(null);
    const vid = extractVideoId(customUrlInput);
    if (!vid) {
      setUrlError('Please enter a valid YouTube video URL or 11-character Video ID.');
      return;
    }

    soundEffects.playClick();
    const customItem: CuratedLecture = {
      id: `custom-${vid}`,
      videoId: vid,
      title: 'Custom YouTube Lecture',
      channel: 'External YouTube Stream',
      category: 'cpp',
      duration: 'Online Video',
      semester: 'Current Studies',
      difficulty: 'Intermediate',
      description: 'Streamed directly into the BCA study environment.',
      topics: ['Custom Lecture'],
    };

    setActiveLecture(customItem);
    openVideo(vid, customItem.title, customItem.channel, 'Custom Lecture');
    setIsPlaying(false);
    setCustomUrlInput('');
  };

  const handleSelectLecture = (lec: CuratedLecture) => {
    soundEffects.playClick();
    setActiveLecture(lec);
    openVideo(lec.videoId, lec.title, lec.channel, lec.category);
    setIsPlaying(false);
  };

  const handleSaveNotes = () => {
    localStorage.setItem(`bca_notes_${activeLecture.videoId}`, lectureNotes);
    soundEffects.playClick();
    setSavedNotesFeedback(true);
    setTimeout(() => setSavedNotesFeedback(false), 2000);
  };

  const handleMarkCompleted = () => {
    soundEffects.playLevelUp();
    logStudySession('sub-dsa', 45, `Watched lecture: ${activeLecture.title}`);
    setCompletedFeedback(true);
    setTimeout(() => setCompletedFeedback(false), 3000);
  };

  const handleFloatPiP = () => {
    soundEffects.playClick();
    openVideo(activeLecture.videoId, activeLecture.title, activeLecture.channel, activeLecture.category);
    setPiP(true);
  };

  // Filter lectures based on search query and category
  const filteredLectures = CURATED_LECTURES.filter((lec) => {
    const matchesCategory = selectedCategory === 'all' || lec.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      lec.title.toLowerCase().includes(q) ||
      lec.channel.toLowerCase().includes(q) ||
      lec.description.toLowerCase().includes(q) ||
      lec.topics.some((t) => t.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#17122E] via-[#100E24] to-[#0A0818] border border-[#00F0FF]/30 shadow-[0_12px_40px_rgba(0,0,0,0.6)] relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00F0FF]/70 to-transparent pointer-events-none" />

        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF0033] to-[#FF5500] flex items-center justify-center text-white shadow-[0_0_25px_rgba(255,0,51,0.4)] shrink-0">
            <Youtube size={26} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>BCA Video Lectures & Study Theater</span>
              <span className="px-2 py-0.5 rounded-full bg-[#00F0FF]/15 border border-[#00F0FF]/35 text-[10px] font-mono text-[#00F0FF] font-bold">
                IN-APP YOUTUBE
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-[#AAA9C6] mt-0.5">
              Watch curated university lectures, take synchronized notes, or float Picture-in-Picture while coding.
            </p>
          </div>
        </div>

        {/* Global PiP Switch Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleFloatPiP}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00F0FF]/15 hover:bg-[#00F0FF]/25 border border-[#00F0FF]/40 text-[#00F0FF] text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)] cursor-pointer"
            title="Pop out video into persistent floating corner player"
          >
            <Maximize2 size={14} />
            <span>Float Picture-in-Picture</span>
          </button>
        </div>
      </div>

      {/* Main Theater Stage (Two-Zone Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Stage (65% / 8 Cols): YouTube Player & Video Actions */}
        <div className="lg:col-span-8 space-y-4">
          {/* 16:9 Video Embed Container */}
          <div className="relative aspect-video w-full rounded-3xl overflow-hidden bg-black border border-purple-500/25 shadow-[0_15px_50px_rgba(0,0,0,0.85)]">
            {isPlaying ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeLecture.videoId}?autoplay=1&enablejsapi=1&rel=0&modestbranding=1`}
                title={activeLecture.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div
                onClick={() => {
                  soundEffects.playClick();
                  setIsPlaying(true);
                }}
                className="group relative w-full h-full cursor-pointer flex items-center justify-center overflow-hidden bg-[#0A0818]"
                role="button"
                tabIndex={0}
                aria-label={`Play lecture: ${activeLecture.title}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    soundEffects.playClick();
                    setIsPlaying(true);
                  }
                }}
              >
                <img
                  src={`https://img.youtube.com/vi/${activeLecture.videoId}/hqdefault.jpg`}
                  alt={activeLecture.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0818] via-black/40 to-black/20" />

                {/* Central Play Badge */}
                <div className="absolute flex flex-col items-center gap-2.5">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#FF0033] to-[#FF4D6D] text-white flex items-center justify-center shadow-[0_0_35px_rgba(255,0,51,0.6)] group-hover:scale-110 group-active:scale-95 transition-all">
                    <Play size={30} className="translate-x-1 fill-white" />
                  </div>
                  <span className="px-3.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-white text-xs font-bold border border-white/20 tracking-wide group-hover:border-[#00F0FF] group-hover:text-[#00F0FF] transition-colors shadow-lg">
                    Click to Play Lecture
                  </span>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-4 right-4 px-2.5 py-1 rounded-xl bg-black/80 backdrop-blur-md text-xs font-mono font-semibold text-white border border-white/10 flex items-center gap-1.5">
                  <Clock size={12} className="text-cyan-400" />
                  <span>{activeLecture.duration}</span>
                </div>
              </div>
            )}
          </div>

          {/* Active Video Info & Quick Actions */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#131122] border border-purple-500/20 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-[#00F0FF] font-medium">
                  <span>{activeLecture.channel}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#AAA9C6]">{activeLecture.duration}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-purple-300">{activeLecture.semester}</span>
                </div>
                <h2 className="text-lg font-bold text-white leading-snug">
                  {activeLecture.title}
                </h2>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleMarkCompleted}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    completedFeedback
                      ? 'bg-emerald-500/25 border-emerald-500/50 text-emerald-300'
                      : 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                  }`}
                >
                  <CheckCircle2 size={14} />
                  <span>{completedFeedback ? 'Progress Logged!' : 'Mark Watched (+25 XP)'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleFloatPiP}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1A162D] hover:bg-[#252042] border border-white/10 text-white text-xs font-medium transition-colors cursor-pointer"
                  title="Float into Picture-in-Picture window"
                >
                  <Minimize2 size={13} className="text-[#00F0FF]" />
                  <span className="hidden sm:inline">Mini PiP</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-[#AAA9C6] leading-relaxed">
              {activeLecture.description}
            </p>

            {/* Quick Practice Bridges */}
            <div className="pt-2 border-t border-white/5 flex flex-wrap items-center gap-3">
              <span className="text-[11px] text-[#8E8A9E] font-medium">Practice concepts:</span>
              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  setActiveTab('code-sandbox');
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#00FF9D]/10 hover:bg-[#00FF9D]/20 border border-[#00FF9D]/30 text-[#00FF9D] text-[11px] font-bold transition-all"
              >
                <Terminal size={12} />
                <span>Open in Code Sandbox</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  setActiveTab('viva-lab');
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#00F0FF]/10 hover:bg-[#00F0FF]/20 border border-[#00F0FF]/30 text-[#00F0FF] text-[11px] font-bold transition-all"
              >
                <Brain size={12} />
                <span>Practice Oral Viva</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Stage (35% / 4 Cols): Synchronized Notes & Lecture Curriculum */}
        <div className="lg:col-span-4 space-y-4">
          {/* Lecture Notes Scratchpad */}
          <div className="p-4 rounded-2xl bg-[#131122] border border-purple-500/20 space-y-3 flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-[#B46CFF]" />
                <h3 className="text-sm font-bold text-white">Lecture Notes</h3>
              </div>
              <button
                type="button"
                onClick={handleSaveNotes}
                className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-all ${
                  savedNotesFeedback
                    ? 'bg-emerald-500/25 text-emerald-300'
                    : 'text-[#00F0FF] hover:bg-[#00F0FF]/15'
                }`}
              >
                {savedNotesFeedback ? 'Saved ✓' : 'Save Notes'}
              </button>
            </div>

            <textarea
              value={lectureNotes}
              onChange={(e) => setLectureNotes(e.target.value)}
              placeholder="Jot down formulas, code notes, interview pointers, and professor timestamps..."
              className="w-full h-36 p-3 rounded-xl bg-[#090714] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F0FF] resize-none font-mono leading-relaxed"
            />
            <div className="flex items-center justify-between text-[10px] text-[#8E8A9E]">
              <span>Autosaves to local profile</span>
              <span>{lectureNotes.length} characters</span>
            </div>
          </div>

          {/* Custom YouTube URL Loader Card */}
          <div className="p-4 rounded-2xl bg-[#131122] border border-purple-500/20 space-y-2.5">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Youtube size={14} className="text-rose-500" />
              <span>Load Any YouTube Video</span>
            </h4>
            <form onSubmit={handleLoadCustomUrl} className="space-y-2">
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  placeholder="Paste URL or 11-char Video ID..."
                  className="flex-1 px-3 py-1.5 rounded-xl bg-[#090714] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
                >
                  Play
                </button>
              </div>
              {urlError && <p className="text-[11px] text-rose-400">{urlError}</p>}
            </form>
          </div>
        </div>
      </div>

      {/* Search Bar & Category Filter Bar */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* YouTube Video Search Bar */}
          <div className="relative flex-1 max-w-lg">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E8A9E]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search lectures (e.g., Binary Trees, Normalization, CPU Scheduling)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#131122] border border-purple-500/25 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#00F0FF] shadow-inner"
            />
          </div>

          <div className="text-xs text-[#AAA9C6] flex items-center gap-1.5 self-end sm:self-center font-mono">
            <span>Showing</span>
            <strong className="text-white">{filteredLectures.length}</strong>
            <span>of {CURATED_LECTURES.length} university lectures</span>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORY_TABS.map((tab) => {
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  setSelectedCategory(tab.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/40 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                    : 'bg-[#141224] text-[#AAA9C6] hover:text-white border border-white/5'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Curated Lectures Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLectures.map((lec) => {
          const isCurrent = activeLecture.videoId === lec.videoId;
          return (
            <div
              key={lec.id}
              onClick={() => handleSelectLecture(lec)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between gap-3 group ${
                isCurrent
                  ? 'bg-gradient-to-br from-[#1C1738] to-[#100E26] border-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.25)] ring-1 ring-[#00F0FF]'
                  : 'bg-[#121020] border-purple-500/15 hover:border-purple-500/40 hover:bg-[#18152B]'
              }`}
            >
              {/* Thumbnail / Header Preview with Play Overlay */}
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black/60 border border-white/5">
                <img
                  src={`https://img.youtube.com/vi/${lec.videoId}/hqdefault.jpg`}
                  alt={lec.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play size={18} className="translate-x-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white">
                  {lec.duration}
                </span>
              </div>

              {/* Title & Metadata (Clean zero-pill format) */}
              <div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#00F0FF] font-medium mb-1">
                  <span>{lec.channel}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#8E8A9E]">{lec.semester}</span>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-[#00F0FF] transition-colors line-clamp-2 leading-snug">
                  {lec.title}
                </h4>
                <p className="text-xs text-[#AAA9C6] line-clamp-2 mt-1">
                  {lec.description}
                </p>
              </div>

              {/* Bottom Topic Tags & Action */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-[11px] text-purple-300/80 font-mono">
                  {lec.difficulty}
                </span>
                <span className="text-xs font-bold text-[#00F0FF] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>{isCurrent ? 'Now Playing' : 'Watch Lecture'}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
