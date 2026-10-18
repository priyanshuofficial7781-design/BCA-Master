import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  GraduationCap,
  Clock,
  Calendar,
  Briefcase,
  Code,
  Binary,
  Layers,
  Cpu,
  Shield,
  BookOpen,
  Target,
  Trophy,
} from 'lucide-react';
import { SemesterNumber, SpecializationTrack } from '../../types';

interface OnboardingScreenProps {
  onComplete: () => void;
  onSkip: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onComplete,
  onSkip,
}) => {
  const { data, updateProfile } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState(data.profile.name || '');
  const [semester, setSemester] = useState<SemesterNumber>(data.profile.semester || 3);
  const [selectedGoal, setSelectedGoal] = useState<string>('placement');
  const [dailyHours, setDailyHours] = useState<number>(data.profile.dailyStudyTargetHours || 3.5);
  const [studyDaysPerWeek, setStudyDaysPerWeek] = useState<number>(6);
  const [targetRole, setTargetRole] = useState<string>(
    data.profile.targetRole || 'Full Stack & Software Engineer'
  );
  const [primaryTrack, setPrimaryTrack] = useState<SpecializationTrack>(
    data.profile.primaryTrack || 'swe'
  );

  // Step 3 Priorities
  const [priorities, setPriorities] = useState<string[]>([
    'cpp_dsa',
    'university_subjects',
    'projects_placements',
  ]);

  const togglePriority = (id: string) => {
    setPriorities((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const weeklyHoursTarget = Math.round(dailyHours * studyDaysPerWeek);

  const handleFinish = () => {
    updateProfile({
      name: name.trim() || 'Student',
      semester,
      targetRole: targetRole.trim(),
      dailyStudyTargetHours: Number(dailyHours),
      weeklyStudyTargetHours: weeklyHoursTarget,
      primaryTrack,
      onboardingCompleted: true,
    });
    onComplete();
  };

  const handleSkipNow = () => {
    updateProfile({
      name: name.trim() || 'Student',
      semester,
      onboardingCompleted: true,
    });
    onSkip();
  };

  const goalsList = [
    {
      id: 'placement',
      title: 'Campus Placement in Tech',
      desc: 'Crack Tier-1 & MNC campus drives with DSA, Aptitude & system rounds',
      icon: <Briefcase className="text-[#B46CFF]" size={20} />,
      track: 'swe' as SpecializationTrack,
    },
    {
      id: 'cgpa',
      title: '9.0+ University Distinction',
      desc: 'Master university syllabus, pass semester exams with top SGPA/CGPA',
      icon: <Trophy className="text-[#55E6B0]" size={20} />,
      track: 'swe' as SpecializationTrack,
    },
    {
      id: 'fullstack',
      title: 'Full-Stack Software Engineer',
      desc: 'Build enterprise web/mobile apps, Git portfolios & capstone projects',
      icon: <Code className="text-[#4D79FF]" size={20} />,
      track: 'fullstack' as SpecializationTrack,
    },
    {
      id: 'aiml',
      title: 'AI & Data Science Specialist',
      desc: 'Master Python, Machine Learning models & intelligent computing',
      icon: <Cpu className="text-[#E45BFF]" size={20} />,
      track: 'aiml' as SpecializationTrack,
    },
  ];

  const priorityItems = [
    {
      id: 'cpp_dsa',
      title: 'C++ / DSA',
      desc: 'Arrays, Trees, Graphs, Dynamic Programming & LeetCode sheets',
      icon: <Binary size={18} className="text-[#8B3DFF]" />,
    },
    {
      id: 'aptitude',
      title: 'Aptitude & Reasoning',
      desc: 'Quantitative, logical & verbal practice for campus screening',
      icon: <Target size={18} className="text-[#4D79FF]" />,
    },
    {
      id: 'maths',
      title: 'Mathematics & Discrete Structures',
      desc: 'Calculus, linear algebra, graph theory & discrete logic',
      icon: <Layers size={18} className="text-[#55E6B0]" />,
    },
    {
      id: 'python',
      title: 'Python & Data Analysis',
      desc: 'Object-oriented Python, NumPy, Pandas and automation tools',
      icon: <Code size={18} className="text-[#B46CFF]" />,
    },
    {
      id: 'cyber',
      title: 'Cybersecurity & Networks',
      desc: 'Network protocols, OSI layers, ethical hacking labs & defense',
      icon: <Shield size={18} className="text-[#E45BFF]" />,
    },
    {
      id: 'aiml_topic',
      title: 'AI / Machine Learning',
      desc: 'Neural networks, computer vision, NLP & model pipelines',
      icon: <Cpu size={18} className="text-[#55E6B0]" />,
    },
    {
      id: 'university_subjects',
      title: 'University Core Subjects',
      desc: 'Operating Systems, DBMS Normalization, Software Engineering',
      icon: <BookOpen size={18} className="text-[#4D79FF]" />,
    },
    {
      id: 'projects_placements',
      title: 'Projects & Placements',
      desc: 'Portfolio builds, GitHub repositories, resume checkpoints & mock interviews',
      icon: <Briefcase size={18} className="text-[#8B3DFF]" />,
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#070711] text-[#F7F5FF] flex flex-col justify-between items-center px-4 py-8 relative overflow-x-hidden">
      {/* Background Lighting */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[500px] rounded-full bg-gradient-to-b from-[#8B3DFF]/20 via-[#4D79FF]/10 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-[#B46CFF]/15 blur-[120px] pointer-events-none" />

      {/* Header Container */}
      <header className="w-full max-w-2xl flex items-center justify-between pb-4 border-b border-[#8B3DFF]/15 z-10">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#8B3DFF] to-[#4D79FF] flex items-center justify-center text-white shadow-[0_0_15px_rgba(139,61,255,0.4)]">
            <GraduationCap size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">BCA Career Planner</h2>
            <p className="text-[11px] text-[#AAA9C6]">Personalized Student Setup</p>
          </div>
        </div>

        {/* Skip For Now Button */}
        <button
          type="button"
          onClick={handleSkipNow}
          className="text-xs font-semibold text-[#AAA9C6] hover:text-white px-3 py-1.5 rounded-lg hover:bg-[#15162B] transition-colors"
        >
          Skip for now
        </button>
      </header>

      {/* Main Form Content */}
      <main className="w-full max-w-2xl my-auto py-6 z-10">
        {/* Progress Stepper Bar */}
        <div className="mb-6 space-y-2">
          <div className="flex justify-between text-xs font-medium text-[#AAA9C6]">
            <span className={step >= 1 ? 'text-[#B46CFF] font-semibold' : ''}>
              1. Welcome & Semester
            </span>
            <span className={step >= 2 ? 'text-[#B46CFF] font-semibold' : ''}>
              2. Study Availability
            </span>
            <span className={step >= 3 ? 'text-[#B46CFF] font-semibold' : ''}>
              3. Learning Priorities
            </span>
          </div>

          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  s <= step
                    ? 'bg-gradient-to-r from-[#8B3DFF] to-[#4D79FF] shadow-[0_0_8px_#8B3DFF]'
                    : 'bg-[#15162B]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: Welcome, Name, Semester & Primary Goal */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome to your BCA Roadmap
              </h1>
              <p className="text-xs sm:text-sm text-[#AAA9C6] mt-1">
                Let's tailor your curriculum, task milestones, and study schedule.
              </p>
            </div>

            {/* Student Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#AAA9C6]">
                Your Name
              </label>
              <input
                type="text"
                placeholder="e.g. Priyanshu Barman"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[#15162B] border border-[#8B3DFF]/30 text-white placeholder-[#AAA9C6]/50 focus:outline-none focus:border-[#B46CFF] focus:ring-1 focus:ring-[#B46CFF] text-sm"
              />
            </div>

            {/* Current Semester Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#AAA9C6]">
                Current BCA Semester (1 to 6)
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {([1, 2, 3, 4, 5, 6] as SemesterNumber[]).map((sem) => (
                  <button
                    key={sem}
                    type="button"
                    onClick={() => setSemester(sem)}
                    className={`p-3 rounded-2xl flex flex-col items-center justify-center border transition-all ${
                      semester === sem
                        ? 'bg-gradient-to-b from-[#8B3DFF]/30 to-[#4D79FF]/20 border-[#B46CFF] text-white shadow-[0_0_15px_rgba(139,61,255,0.4)]'
                        : 'bg-[#15162B] border-[#8B3DFF]/20 text-[#AAA9C6] hover:border-[#8B3DFF]/40 hover:text-white'
                    }`}
                  >
                    <span className="text-lg font-bold">Sem {sem}</span>
                    <span className="text-[10px] opacity-75">
                      {sem <= 2 ? 'Year 1' : sem <= 4 ? 'Year 2' : 'Year 3'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Learning Goals */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#AAA9C6]">
                Primary Learning Goal
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {goalsList.map((g) => {
                  const isSelected = selectedGoal === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => {
                        setSelectedGoal(g.id);
                        setPrimaryTrack(g.track);
                      }}
                      className={`p-3.5 rounded-2xl text-left border transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'bg-[#1D1B39] border-[#B46CFF] shadow-[0_0_15px_rgba(139,61,255,0.35)]'
                          : 'bg-[#15162B] border-[#8B3DFF]/20 hover:border-[#8B3DFF]/40'
                      }`}
                    >
                      <div className="p-2 rounded-xl bg-[#0D1020] border border-[#8B3DFF]/20 shrink-0">
                        {g.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs sm:text-sm font-bold text-white">{g.title}</h4>
                          {isSelected && <Check size={14} className="text-[#55E6B0]" />}
                        </div>
                        <p className="text-[11px] text-[#AAA9C6] mt-0.5 line-clamp-2">{g.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Study Availability & Targets */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Study Availability & Targets
              </h1>
              <p className="text-xs sm:text-sm text-[#AAA9C6] mt-1">
                Configure realistic daily study targets to power your habit streak and task planner.
              </p>
            </div>

            {/* Daily Hours Slider & Presets */}
            <div className="p-5 rounded-3xl bg-[#15162B] border border-[#8B3DFF]/25 space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-[#B46CFF]" />
                  <span className="text-xs font-semibold uppercase text-[#AAA9C6]">
                    Daily Study Target
                  </span>
                </div>
                <div className="text-xl font-extrabold text-white font-mono tabular-nums">
                  {dailyHours} hrs / day
                </div>
              </div>

              {/* Preset buttons */}
              <div className="grid grid-cols-4 gap-2">
                {[1.5, 2.5, 3.5, 5.0].map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setDailyHours(h)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      dailyHours === h
                        ? 'bg-[#8B3DFF] border-white/20 text-white shadow-[0_0_10px_rgba(139,61,255,0.5)]'
                        : 'bg-[#0D1020] border-[#8B3DFF]/20 text-[#AAA9C6] hover:text-white'
                    }`}
                  >
                    {h} hrs
                  </button>
                ))}
              </div>

              {/* Slider */}
              <input
                type="range"
                min="1"
                max="8"
                step="0.5"
                value={dailyHours}
                onChange={(e) => setDailyHours(parseFloat(e.target.value))}
                className="w-full accent-[#8B3DFF] cursor-pointer"
              />
            </div>

            {/* Weekly Target Configuration */}
            <div className="p-5 rounded-3xl bg-[#15162B] border border-[#8B3DFF]/25 space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-[#4D79FF]" />
                  <span className="text-xs font-semibold uppercase text-[#AAA9C6]">
                    Active Study Days Per Week
                  </span>
                </div>
                <div className="text-lg font-bold text-white">{studyDaysPerWeek} Days</div>
              </div>

              <div className="flex items-center gap-2">
                {[5, 6, 7].map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setStudyDaysPerWeek(days)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      studyDaysPerWeek === days
                        ? 'bg-[#4D79FF] border-white/20 text-white'
                        : 'bg-[#0D1020] border-[#8B3DFF]/20 text-[#AAA9C6] hover:text-white'
                    }`}
                  >
                    {days} Days / Week
                  </button>
                ))}
              </div>

              <div className="pt-2 border-t border-[#8B3DFF]/15 flex items-center justify-between text-xs">
                <span className="text-[#AAA9C6]">Weekly Commitment Target:</span>
                <span className="font-bold text-[#55E6B0] font-mono tabular-nums">
                  ~{weeklyHoursTarget} hours / week
                </span>
              </div>
            </div>

            {/* Target Career Role */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#AAA9C6]">
                Target Career Role
              </label>
              <input
                type="text"
                placeholder="e.g. Full Stack & Software Engineer"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[#15162B] border border-[#8B3DFF]/30 text-white placeholder-[#AAA9C6]/50 focus:outline-none focus:border-[#B46CFF] text-sm"
              />
            </div>
          </div>
        )}

        {/* STEP 3: Learning Priorities Selectable Cards */}
        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Select Your Learning Priorities
              </h1>
              <p className="text-xs sm:text-sm text-[#AAA9C6] mt-1">
                Choose the domains you want prioritized in your Home Dashboard, 10k Question Bank, and study reminders.
              </p>
            </div>

            {/* Priorities Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
              {priorityItems.map((item) => {
                const isSelected = priorities.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => togglePriority(item.id)}
                    className={`p-3.5 rounded-2xl text-left border transition-all flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-[#1D1B39] border-[#B46CFF] shadow-[0_0_15px_rgba(139,61,255,0.3)]'
                        : 'bg-[#15162B] border-[#8B3DFF]/20 hover:border-[#8B3DFF]/40'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-[#0D1020] border border-[#8B3DFF]/20 shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs sm:text-sm font-bold text-white">{item.title}</h4>
                        <div
                          className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                            isSelected
                              ? 'bg-[#8B3DFF] border-[#B46CFF] text-white'
                              : 'border-[#AAA9C6]/40'
                          }`}
                        >
                          {isSelected && <Check size={11} strokeWidth={3} />}
                        </div>
                      </div>
                      <p className="text-[11px] text-[#AAA9C6] mt-0.5 line-clamp-2">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Footer Navigation Bar */}
      <footer className="w-full max-w-2xl pt-4 border-t border-[#8B3DFF]/15 flex items-center justify-between z-10">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => (s - 1) as any)}
            className="px-4 py-2.5 rounded-xl bg-[#15162B] border border-[#8B3DFF]/30 text-xs font-semibold text-[#AAA9C6] hover:text-white flex items-center gap-2 hover:bg-[#1D1B39] transition-all cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Back</span>
          </button>
        ) : (
          <div />
        )}

        {step < 3 ? (
          <button
            type="button"
            onClick={() => setStep((s) => (s + 1) as any)}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#8B3DFF] to-[#4D79FF] text-xs sm:text-sm font-bold text-white flex items-center gap-2 shadow-[0_0_20px_rgba(139,61,255,0.4)] hover:shadow-[0_0_25px_rgba(139,61,255,0.6)] cursor-pointer"
          >
            <span>Continue</span>
            <ArrowRight size={15} />
          </button>
        ) : (
          /* Final "Continue to Dashboard" button */
          <button
            type="button"
            onClick={handleFinish}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#8B3DFF] via-[#A855F7] to-[#4D79FF] text-xs sm:text-sm font-bold text-white flex items-center gap-2 shadow-[0_0_25px_rgba(139,61,255,0.5)] hover:shadow-[0_0_35px_rgba(139,61,255,0.7)] cursor-pointer border border-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Continue to Dashboard</span>
            <ArrowRight size={16} strokeWidth={2.5} />
          </button>
        )}
      </footer>
    </div>
  );
};
