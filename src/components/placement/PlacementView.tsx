import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InternshipApplication, MockInterviewRecord } from '../../types';
import { Modal } from '../common/Modal';
import { ProgressBar } from '../common/ProgressBar';
import {
  Briefcase,
  Plus,
  Code2,
  Brain,
  FileCheck2,
  Building,
  CheckCircle2,
  Circle,
  ExternalLink,
  Award,
  Sparkles,
  Trash2,
  Download,
  Flame,
  Star,
  GitBranch,
  Edit3,
  Share2,
  Copy,
  Check,
  TrendingUp,
  Zap,
  Target,
} from 'lucide-react';
import { generateResumePDF } from '../../utils/pdfGenerator';
import { soundEffects } from '../../services/soundEffects';

export const PlacementView: React.FC = () => {
  const {
    data,
    overallCgpa,
    streakDays,
    updateDsaTopic,
    updateAptitudeTopic,
    addApplication,
    deleteApplication,
    addMockInterview,
    togglePlacementChecklist,
    updateLeetCodeStats,
    updateGitHubStats,
    updateProfile,
  } = useApp();

  const [activeSection, setActiveSection] = useState<'profiles' | 'dsa' | 'aptitude' | 'applications' | 'mock' | 'checklist'>('profiles');
  const [isDownloadingResume, setIsDownloadingResume] = useState(false);
  const [copiedProfileSummary, setCopiedProfileSummary] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  // LeetCode & GitHub Stats Fallbacks
  const lcStats = data.profile.leetcodeStats || {
    username: data.profile.leetcodeHandle || 'bca_coder_pro',
    ranking: 142580,
    totalSolved: 148,
    easySolved: 82,
    mediumSolved: 54,
    hardSolved: 12,
    streakDays: 14,
    contestRating: 1640,
  };

  const ghStats = data.profile.githubStats || {
    username: data.profile.githubHandle || 'bca-student-dev',
    repoCount: 16,
    starCount: 28,
    commitStreakDays: 19,
    topRepoName: 'fullstack-bca-capstone',
    topRepoUrl: 'https://github.com',
    profileUrl: 'https://github.com',
  };

  // Temp form states for developer profile modal
  const [formLcUser, setFormLcUser] = useState(lcStats.username);
  const [formLcEasy, setFormLcEasy] = useState(lcStats.easySolved);
  const [formLcMed, setFormLcMed] = useState(lcStats.mediumSolved);
  const [formLcHard, setFormLcHard] = useState(lcStats.hardSolved);
  const [formLcStreak, setFormLcStreak] = useState(lcStats.streakDays);
  const [formLcRating, setFormLcRating] = useState(lcStats.contestRating || 1640);
  const [formGhUser, setFormGhUser] = useState(ghStats.username);
  const [formGhRepos, setFormGhRepos] = useState(ghStats.repoCount);
  const [formGhStars, setFormGhStars] = useState(ghStats.starCount);
  const [formGhStreak, setFormGhStreak] = useState(ghStats.commitStreakDays);
  const [formGhTopRepo, setFormGhTopRepo] = useState(ghStats.topRepoName);

  // Application modal state
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [appCompany, setAppCompany] = useState('');
  const [appRole, setAppRole] = useState('');
  const [appStatus, setAppStatus] = useState<InternshipApplication['status']>('applied');
  const [appPackage, setAppPackage] = useState('');
  const [appLink, setAppLink] = useState('');
  const [appNotes, setAppNotes] = useState('');

  // Mock interview modal state
  const [isMockModalOpen, setIsMockModalOpen] = useState(false);
  const [mockRole, setMockRole] = useState('Junior Software Engineer');
  const [mockCompanyType, setMockCompanyType] = useState('Product-based Tech');
  const [mockScore, setMockScore] = useState(8);
  const [mockStrengths, setMockStrengths] = useState('');
  const [mockAreas, setMockAreas] = useState('');
  const [mockQuestions, setMockQuestions] = useState('');

  const totalDsaSolved = data.dsaTopics.reduce(
    (acc, t) => acc + t.solvedEasy + t.solvedMedium + t.solvedHard,
    0
  );
  const totalDsaTarget = data.dsaTopics.reduce((acc, t) => acc + t.totalQuestions, 0);

  const totalAptitudeSolved = data.aptitudeTopics.reduce((acc, t) => acc + t.solved, 0);
  const totalAptitudeTarget = data.aptitudeTopics.reduce((acc, t) => acc + t.target, 0);

  const handleSaveApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appCompany.trim() || !appRole.trim()) return;

    addApplication({
      company: appCompany.trim(),
      role: appRole.trim(),
      status: appStatus,
      appliedDate: new Date().toISOString().split('T')[0],
      packageLPA: appPackage.trim() || undefined,
      link: appLink.trim() || undefined,
      notes: appNotes.trim() || undefined,
    });

    setAppCompany('');
    setAppRole('');
    setAppPackage('');
    setAppLink('');
    setAppNotes('');
    setIsAppModalOpen(false);
  };

  const handleSaveMock = (e: React.FormEvent) => {
    e.preventDefault();
    addMockInterview({
      date: new Date().toISOString().split('T')[0],
      role: mockRole,
      companyType: mockCompanyType,
      scoreOutOf10: Number(mockScore),
      strengths: mockStrengths.trim(),
      areasToImprove: mockAreas.trim(),
      questions: mockQuestions.trim(),
    });

    setMockStrengths('');
    setMockAreas('');
    setMockQuestions('');
    setIsMockModalOpen(false);
  };

  const handleDownloadResume = () => {
    try {
      setIsDownloadingResume(true);
      soundEffects.playLevelUp();
      generateResumePDF({
        name: data.profile.name,
        semester: data.profile.semester,
        college: data.profile.college,
        targetRole: data.profile.targetRole,
        cgpa: overallCgpa,
        streakDays: streakDays,
        projects: data.projects,
        dsaSolvedCount: totalDsaSolved,
        subjects: data.subjects,
        primaryTrack: data.profile.primaryTrack,
      });
    } catch (err) {
      console.error('Failed to download resume PDF', err);
    } finally {
      setIsDownloadingResume(false);
    }
  };

  const handleQuickAddLeetCode = (difficulty: 'easy' | 'medium' | 'hard') => {
    soundEffects.playLevelUp();
    const newEasy = difficulty === 'easy' ? lcStats.easySolved + 1 : lcStats.easySolved;
    const newMed = difficulty === 'medium' ? lcStats.mediumSolved + 1 : lcStats.mediumSolved;
    const newHard = difficulty === 'hard' ? lcStats.hardSolved + 1 : lcStats.hardSolved;
    const newTotal = newEasy + newMed + newHard;
    updateLeetCodeStats({
      username: lcStats.username,
      totalSolved: newTotal,
      easySolved: newEasy,
      mediumSolved: newMed,
      hardSolved: newHard,
      streakDays: lcStats.streakDays + 1,
    });
  };

  const handleQuickAddGitHubRepo = () => {
    soundEffects.playClick();
    updateGitHubStats({
      repoCount: ghStats.repoCount + 1,
    });
  };

  const handleQuickAddGitHubStreak = () => {
    soundEffects.playLevelUp();
    updateGitHubStats({
      commitStreakDays: ghStats.commitStreakDays + 1,
    });
  };

  const handleCopyProfileSummary = () => {
    const summary = `🚀 BCA Placement Candidate: ${data.profile.name} | Role: ${data.profile.targetRole}\n⚡ LeetCode: ${lcStats.totalSolved} Solved (${lcStats.streakDays}d Streak, ${lcStats.contestRating || 1640} Rating) -> https://leetcode.com/u/${lcStats.username}\n💻 GitHub: ${ghStats.repoCount} Repos (${ghStats.commitStreakDays}d Streak, ★ ${ghStats.starCount}) -> https://github.com/${ghStats.username}`;
    navigator.clipboard.writeText(summary);
    soundEffects.playClick();
    setCopiedProfileSummary(true);
    setTimeout(() => setCopiedProfileSummary(false), 2500);
  };

  const handleSaveDeveloperProfiles = (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playClick();
    const total = Number(formLcEasy) + Number(formLcMed) + Number(formLcHard);
    updateLeetCodeStats({
      username: formLcUser.trim() || 'bca_coder_pro',
      totalSolved: total,
      easySolved: Number(formLcEasy),
      mediumSolved: Number(formLcMed),
      hardSolved: Number(formLcHard),
      streakDays: Number(formLcStreak),
      contestRating: Number(formLcRating),
    });
    updateGitHubStats({
      username: formGhUser.trim() || 'bca-student-dev',
      repoCount: Number(formGhRepos),
      starCount: Number(formGhStars),
      commitStreakDays: Number(formGhStreak),
      topRepoName: formGhTopRepo.trim() || 'fullstack-bca-capstone',
    });
    updateProfile({
      leetcodeHandle: formLcUser.trim(),
      githubHandle: formGhUser.trim(),
    });
    setIsEditProfileModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-24 lg:pb-12 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#161424] border border-purple-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Briefcase size={18} className="text-purple-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Placement & Career Command Center
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#9E99AF]">
            DSA sheets, aptitude mastery, mock interview debriefs, and internship trackers
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#1D192E] border border-purple-500/15 text-center">
            <span className="text-[10px] text-[#9E99AF] block">DSA Solved</span>
            <span className="text-base font-bold text-purple-300 tabular-nums">
              {totalDsaSolved} / {totalDsaTarget}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#1D192E] border border-[#FFA116]/30 text-center">
            <span className="text-[10px] text-[#FFA116] block font-semibold">LeetCode</span>
            <span className="text-base font-bold text-white tabular-nums flex items-center justify-center gap-1">
              <span>{lcStats.totalSolved}</span>
              <span className="text-[10px] text-amber-400 font-mono">({lcStats.streakDays}d 🔥)</span>
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#1D192E] border border-[#00F0FF]/30 text-center">
            <span className="text-[10px] text-[#00F0FF] block font-semibold">GitHub</span>
            <span className="text-base font-bold text-white tabular-nums flex items-center justify-center gap-1">
              <span>{ghStats.repoCount} repos</span>
              <span className="text-[10px] text-emerald-400 font-mono">({ghStats.commitStreakDays}d)</span>
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#1D192E] border border-purple-500/15 text-center">
            <span className="text-[10px] text-[#9E99AF] block">Applications</span>
            <span className="text-base font-bold text-emerald-300 tabular-nums">
              {data.applications.length}
            </span>
          </div>
          <button
            type="button"
            onClick={handleDownloadResume}
            disabled={isDownloadingResume}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-[#8B3DFF] to-[#00F0FF] hover:brightness-110 active:scale-95 text-white text-xs font-bold shadow-[0_0_15px_rgba(139,61,255,0.4)] transition-all cursor-pointer border border-white/20 disabled:opacity-50"
            title="Download ATS-ready 1-Page Placement Resume PDF"
          >
            <Download size={14} className={isDownloadingResume ? 'animate-bounce' : ''} />
            <span>{isDownloadingResume ? 'Exporting...' : 'Download Resume PDF'}</span>
          </button>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none p-1.5 rounded-2xl bg-[#161424] border border-purple-500/20">
        {[
          { id: 'profiles', label: 'LeetCode & GitHub Profiles', icon: <Code2 size={14} /> },
          { id: 'dsa', label: 'DSA Topic Sheet', icon: <Code2 size={14} /> },
          { id: 'aptitude', label: 'Aptitude Drills', icon: <Brain size={14} /> },
          { id: 'applications', label: 'Applications', icon: <Building size={14} /> },
          { id: 'mock', label: 'Mock Interviews', icon: <Award size={14} /> },
          { id: 'checklist', label: 'Resume & CS Checklist', icon: <FileCheck2 size={14} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as any)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeSection === tab.id
                ? 'bg-gradient-to-r from-purple-600 to-[#8B3DFF] text-white font-semibold shadow-sm'
                : 'text-[#9E99AF] hover:text-white hover:bg-[#1D192E]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 0. Dedicated LeetCode & GitHub Developer Dossier */}
      {activeSection === 'profiles' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Quick Recruiter Summary Bar */}
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#17122C] via-[#100E26] to-[#0D1526] border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00FF9D] animate-pulse" />
                <h3 className="text-base font-black text-white tracking-tight">
                  Placement & Coding Profile Dossier
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#00F0FF]/15 border border-[#00F0FF]/30 text-[10px] font-mono text-[#00F0FF] font-bold">
                  LIVE TRACKER
                </span>
              </div>
              <p className="text-xs text-[#AAA9C6]">
                Curate your competitive programming handle, problem counts, commit streaks, and verified GitHub repos.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopyProfileSummary}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/35 text-purple-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
                title="Copy formatted profile summary for recruiters"
              >
                {copiedProfileSummary ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copiedProfileSummary ? 'Copied to Clipboard!' : 'Share Dossier'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  setFormLcUser(lcStats.username);
                  setFormLcEasy(lcStats.easySolved);
                  setFormLcMed(lcStats.mediumSolved);
                  setFormLcHard(lcStats.hardSolved);
                  setFormLcStreak(lcStats.streakDays);
                  setFormLcRating(lcStats.contestRating || 1640);
                  setFormGhUser(ghStats.username);
                  setFormGhRepos(ghStats.repoCount);
                  setFormGhStars(ghStats.starCount);
                  setFormGhStreak(ghStats.commitStreakDays);
                  setFormGhTopRepo(ghStats.topRepoName);
                  setIsEditProfileModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#00F0FF]/15 hover:bg-[#00F0FF]/25 border border-[#00F0FF]/35 text-[#00F0FF] text-xs font-bold transition-all shadow-[0_0_12px_rgba(0,240,255,0.2)] cursor-pointer"
              >
                <Edit3 size={14} />
                <span>Edit Portfolios & Stats</span>
              </button>
            </div>
          </div>

          {/* Cards Grid: LeetCode & GitHub */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LeetCode Card */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#141224] border border-[#FFA116]/35 relative overflow-hidden flex flex-col justify-between space-y-5 shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#FFA116]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#FFA116]/20 border border-[#FFA116]/40 flex items-center justify-center text-[#FFA116] shadow-[0_0_15px_rgba(255,161,22,0.3)]">
                      <Code2 size={22} />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-white flex items-center gap-2">
                        <span>LeetCode Profile</span>
                        <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/30">
                          PRO
                        </span>
                      </h4>
                      <a
                        href={`https://leetcode.com/u/${lcStats.username}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-mono text-purple-300 hover:text-white flex items-center gap-1 transition-colors"
                      >
                        <span>@{lcStats.username}</span>
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/35 text-amber-300 text-xs font-bold shadow-sm">
                    <Flame size={14} className="text-amber-400 fill-amber-400 animate-pulse" />
                    <span>{lcStats.streakDays}d Streak</span>
                  </div>
                </div>

                {/* Big Metric Display */}
                <div className="grid grid-cols-3 gap-2.5 pt-1">
                  <div className="p-3 rounded-2xl bg-[#1C1832] border border-white/5 text-center">
                    <span className="text-[10px] text-[#AAA9C6] block font-semibold">Total Solved</span>
                    <span className="text-xl font-black text-white tabular-nums">
                      {lcStats.totalSolved}
                    </span>
                    <span className="text-[9px] text-[#AAA9C6] block">problems</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#1C1832] border border-white/5 text-center">
                    <span className="text-[10px] text-[#AAA9C6] block font-semibold">Contest Rating</span>
                    <span className="text-xl font-black text-[#FFA116] tabular-nums font-mono">
                      {lcStats.contestRating || 1640}
                    </span>
                    <span className="text-[9px] text-amber-400/80 block">Knight Tier</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#1C1832] border border-white/5 text-center">
                    <span className="text-[10px] text-[#AAA9C6] block font-semibold">Global Rank</span>
                    <span className="text-base font-black text-purple-300 tabular-nums font-mono mt-0.5 block">
                      #{(lcStats.ranking || 142580).toLocaleString()}
                    </span>
                    <span className="text-[9px] text-emerald-400 block font-semibold">Top 8.5%</span>
                  </div>
                </div>

                {/* Problem Difficulty Breakdown with Progress Meters */}
                <div className="space-y-3 pt-2">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span>Easy Problems</span>
                      </span>
                      <span className="font-mono text-white text-xs font-bold">
                        {lcStats.easySolved} <span className="text-[#AAA9C6] font-normal">/ 150</span>
                      </span>
                    </div>
                    <div className="h-2 w-full bg-[#1C1832] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.round((lcStats.easySolved / 150) * 100))}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-amber-400 font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        <span>Medium Problems (Tier-1 Focus)</span>
                      </span>
                      <span className="font-mono text-white text-xs font-bold">
                        {lcStats.mediumSolved} <span className="text-[#AAA9C6] font-normal">/ 200</span>
                      </span>
                    </div>
                    <div className="h-2 w-full bg-[#1C1832] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.round((lcStats.mediumSolved / 200) * 100))}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-rose-400 font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-400" />
                        <span>Hard Problems (FAANG Bar)</span>
                      </span>
                      <span className="font-mono text-white text-xs font-bold">
                        {lcStats.hardSolved} <span className="text-[#AAA9C6] font-normal">/ 50</span>
                      </span>
                    </div>
                    <div className="h-2 w-full bg-[#1C1832] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.round((lcStats.hardSolved / 50) * 100))}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Problem Logging Buttons */}
              <div className="pt-3 border-t border-white/10 space-y-2">
                <span className="text-[11px] font-bold text-[#AAA9C6] block">
                  Quick Log Solved Problem (Live Increment):
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickAddLeetCode('easy')}
                    className="py-1.5 px-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span>+1 Easy</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickAddLeetCode('medium')}
                    className="py-1.5 px-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span>+1 Medium</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickAddLeetCode('hard')}
                    className="py-1.5 px-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span>+1 Hard</span>
                  </button>
                </div>
              </div>
            </div>

            {/* GitHub Card */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#141224] border border-[#00F0FF]/35 relative overflow-hidden flex flex-col justify-between space-y-5 shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#00F0FF]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#00F0FF]/20 border border-[#00F0FF]/40 flex items-center justify-center text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                      <GitBranch size={22} />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-white flex items-center gap-2">
                        <span>GitHub Portfolio</span>
                        <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-400/10 px-1.5 py-0.5 rounded border border-cyan-400/30">
                          VERIFIED
                        </span>
                      </h4>
                      <a
                        href={`https://github.com/${ghStats.username}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-mono text-cyan-300 hover:text-white flex items-center gap-1 transition-colors"
                      >
                        <span>@{ghStats.username}</span>
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 text-xs font-bold shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{ghStats.commitStreakDays}d Green Streak</span>
                  </div>
                </div>

                {/* Big Metric Display */}
                <div className="grid grid-cols-3 gap-2.5 pt-1">
                  <div className="p-3 rounded-2xl bg-[#1C1832] border border-white/5 text-center">
                    <span className="text-[10px] text-[#AAA9C6] block font-semibold">Public Repos</span>
                    <span className="text-xl font-black text-white tabular-nums">
                      {ghStats.repoCount}
                    </span>
                    <span className="text-[9px] text-[#AAA9C6] block">repositories</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#1C1832] border border-white/5 text-center">
                    <span className="text-[10px] text-[#AAA9C6] block font-semibold">Total Stars</span>
                    <span className="text-xl font-black text-amber-300 tabular-nums flex items-center justify-center gap-1">
                      <Star size={14} className="fill-amber-300" />
                      <span>{ghStats.starCount}</span>
                    </span>
                    <span className="text-[9px] text-amber-400/80 block">earned</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#1C1832] border border-white/5 text-center">
                    <span className="text-[10px] text-[#AAA9C6] block font-semibold">Commit Cadence</span>
                    <span className="text-base font-black text-emerald-400 tabular-nums font-mono mt-0.5 block">
                      Active
                    </span>
                    <span className="text-[9px] text-cyan-300 block font-semibold">Daily Push</span>
                  </div>
                </div>

                {/* Pinned Featured Project Card */}
                <div className="p-4 rounded-2xl bg-[#18142C] border border-[#00F0FF]/25 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star size={13} className="text-amber-400 fill-amber-400" />
                      <span className="text-xs font-bold text-white font-mono">
                        {ghStats.topRepoName}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-[#00F0FF]/15 text-[10px] font-mono text-[#00F0FF] font-bold">
                      BCA Capstone
                    </span>
                  </div>

                  <p className="text-[11px] text-[#AAA9C6] leading-relaxed">
                    Full-stack responsive production system built with TypeScript, React, Vite, and cloud database architecture.
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-purple-300">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#3178C6]" /> TypeScript
                      </span>
                      <span>·</span>
                      <span className="text-emerald-400">Public Repo</span>
                    </div>
                    <a
                      href={`https://github.com/${ghStats.username}/${ghStats.topRepoName}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-[#00F0FF] hover:underline font-bold flex items-center gap-1"
                    >
                      <span>Explore</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Quick GitHub Action Buttons */}
              <div className="pt-3 border-t border-white/10 space-y-2">
                <span className="text-[11px] font-bold text-[#AAA9C6] block">
                  Quick Portfolio Milestones (Live Increment):
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleQuickAddGitHubRepo}
                    className="py-1.5 px-3 rounded-xl bg-[#00F0FF]/10 hover:bg-[#00F0FF]/20 border border-[#00F0FF]/30 text-[#00F0FF] text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>+1 Repo Published</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleQuickAddGitHubStreak}
                    className="py-1.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Flame size={12} className="text-emerald-400" />
                    <span>+1 Day Commit Streak</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 1. DSA Topic Sheet */}
      {activeSection === 'dsa' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">DSA Practice by Topic</h3>
            <span className="text-xs text-purple-300">
              Total Solved: {totalDsaSolved} problems
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {data.dsaTopics.map((topic) => {
              const totalTopicSolved = topic.solvedEasy + topic.solvedMedium + topic.solvedHard;
              const percent = Math.min(100, Math.round((totalTopicSolved / topic.totalQuestions) * 100));

              return (
                <div
                  key={topic.id}
                  className="p-4 rounded-2xl bg-[#161424] border border-purple-500/20 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">{topic.name}</h4>
                    <span className="text-xs font-semibold text-purple-300 tabular-nums">
                      {totalTopicSolved} / {topic.totalQuestions} ({percent}%)
                    </span>
                  </div>

                  <ProgressBar progress={percent} height={6} />

                  <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <span className="text-[10px] text-emerald-400 block font-semibold">Easy</span>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <button
                          onClick={() =>
                            updateDsaTopic(topic.id, { solvedEasy: Math.max(0, topic.solvedEasy - 1) })
                          }
                          className="w-5 h-5 rounded bg-[#201C33] text-white hover:bg-emerald-600"
                        >
                          -
                        </button>
                        <span className="font-bold text-white tabular-nums px-1">{topic.solvedEasy}</span>
                        <button
                          onClick={() =>
                            updateDsaTopic(topic.id, { solvedEasy: topic.solvedEasy + 1 })
                          }
                          className="w-5 h-5 rounded bg-[#201C33] text-white hover:bg-emerald-600"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <span className="text-[10px] text-amber-400 block font-semibold">Medium</span>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <button
                          onClick={() =>
                            updateDsaTopic(topic.id, { solvedMedium: Math.max(0, topic.solvedMedium - 1) })
                          }
                          className="w-5 h-5 rounded bg-[#201C33] text-white hover:bg-amber-600"
                        >
                          -
                        </button>
                        <span className="font-bold text-white tabular-nums px-1">{topic.solvedMedium}</span>
                        <button
                          onClick={() =>
                            updateDsaTopic(topic.id, { solvedMedium: topic.solvedMedium + 1 })
                          }
                          className="w-5 h-5 rounded bg-[#201C33] text-white hover:bg-amber-600"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                      <span className="text-[10px] text-rose-400 block font-semibold">Hard</span>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <button
                          onClick={() =>
                            updateDsaTopic(topic.id, { solvedHard: Math.max(0, topic.solvedHard - 1) })
                          }
                          className="w-5 h-5 rounded bg-[#201C33] text-white hover:bg-rose-600"
                        >
                          -
                        </button>
                        <span className="font-bold text-white tabular-nums px-1">{topic.solvedHard}</span>
                        <button
                          onClick={() =>
                            updateDsaTopic(topic.id, { solvedHard: topic.solvedHard + 1 })
                          }
                          className="w-5 h-5 rounded bg-[#201C33] text-white hover:bg-rose-600"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {topic.notes && (
                    <p className="text-[11px] text-[#9E99AF] italic truncate">{topic.notes}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Aptitude Drills */}
      {activeSection === 'aptitude' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Quantitative & Logical Aptitude</h3>
            <span className="text-xs text-purple-300">
              Total Solved: {totalAptitudeSolved} / {totalAptitudeTarget} questions
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {data.aptitudeTopics.map((apt) => {
              const percent = Math.min(100, Math.round((apt.solved / apt.target) * 100));
              return (
                <div key={apt.id} className="p-4 rounded-2xl bg-[#161424] border border-purple-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">{apt.name}</h4>
                    <span className="text-xs font-semibold text-purple-300 tabular-nums">
                      {apt.solved} / {apt.target} ({percent}%)
                    </span>
                  </div>

                  <ProgressBar progress={percent} height={6} />

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() =>
                        updateAptitudeTopic(apt.id, { solved: Math.max(0, apt.solved - 1) })
                      }
                      className="px-2.5 py-1 rounded-lg bg-[#201C33] text-xs font-bold text-[#9E99AF] hover:text-white"
                    >
                      -1
                    </button>
                    <button
                      onClick={() => updateAptitudeTopic(apt.id, { solved: apt.solved + 1 })}
                      className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white flex items-center gap-1"
                    >
                      <Plus size={12} /> <span>+1 Question</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Applications Tracker */}
      {activeSection === 'applications' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Internships & Campus Drives</h3>
            <button
              onClick={() => setIsAppModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1"
            >
              <Plus size={14} /> <span>Track New Company</span>
            </button>
          </div>

          <div className="space-y-3">
            {data.applications.map((app) => {
              const statusStyles = {
                applied: 'text-blue-300 bg-blue-500/10 border-blue-500/20',
                oa_cleared: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
                interview: 'text-purple-300 bg-purple-500/10 border-purple-500/20',
                offer: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
                rejected: 'text-rose-300 bg-rose-500/10 border-rose-500/20',
              };

              return (
                <div
                  key={app.id}
                  className="p-4 rounded-2xl bg-[#161424] border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-white">{app.company}</h4>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${
                          statusStyles[app.status]
                        }`}
                      >
                        {app.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#9E99AF]">
                      <span className="text-purple-300">{app.role}</span>
                      {app.packageLPA && <span>· Package: {app.packageLPA}</span>}
                      <span>· Applied: {app.appliedDate}</span>
                    </div>

                    {app.notes && <p className="text-xs text-[#AAA5B6] mt-1">{app.notes}</p>}
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {app.link && (
                      <a
                        href={app.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-[#201C33] text-[#9E99AF] hover:text-white"
                        title="Application Portal"
                      >
                        <ExternalLink size={15} />
                      </a>
                    )}
                    <button
                      onClick={() => deleteApplication(app.id)}
                      className="p-2 rounded-lg bg-rose-500/10 text-rose-300 hover:bg-rose-500/20"
                      title="Delete entry"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Mock Interviews */}
      {activeSection === 'mock' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Mock Interview Logs & Feedback</h3>
            <button
              onClick={() => setIsMockModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1"
            >
              <Plus size={14} /> <span>Log Mock Interview</span>
            </button>
          </div>

          <div className="space-y-3">
            {data.mockInterviews.map((mock) => (
              <div
                key={mock.id}
                className="p-5 rounded-2xl bg-[#161424] border border-purple-500/20 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-bold text-white">{mock.role}</h4>
                    <span className="text-xs text-[#9E99AF]">
                      {mock.companyType} · {mock.date}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-purple-300 tabular-nums">
                      {mock.scoreOutOf10}/10
                    </span>
                    <span className="text-[10px] text-[#9E99AF] block">Rating</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <span className="font-bold text-emerald-400 block mb-1">Strengths Demonstrated</span>
                    <p className="text-emerald-200/90 leading-relaxed">{mock.strengths}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <span className="font-bold text-amber-400 block mb-1">Areas for Improvement</span>
                    <p className="text-amber-200/90 leading-relaxed">{mock.areasToImprove}</p>
                  </div>
                </div>

                {mock.questions && (
                  <div className="p-3 rounded-xl bg-[#1A1629] border border-purple-500/10 text-xs">
                    <span className="font-bold text-purple-300 block mb-1">Questions Asked</span>
                    <p className="text-white font-mono leading-relaxed">{mock.questions}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Resume & CS Core Checklist */}
      {activeSection === 'checklist' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Quick Resume Download Banner */}
          <div className="relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#181335] via-[#120F24] to-[#0A0815] border border-[#B46CFF]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8B3DFF] to-[#00F0FF] flex items-center justify-center text-white shrink-0 shadow-[0_0_15px_rgba(139,61,255,0.4)]">
                <FileCheck2 size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>ATS-Compliant 1-Page Placement Resume</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30 text-[10px] font-mono">PDF EXPORT</span>
                </h4>
                <p className="text-xs text-[#AAA9C6]">
                  Instant professional download formatted with your verified BCA projects, CGPA & DSA stats
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownloadResume}
              disabled={isDownloadingResume}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#8B3DFF] to-[#00F0FF] hover:brightness-110 active:scale-95 text-white text-xs font-bold shadow-[0_0_15px_rgba(139,61,255,0.4)] transition-all cursor-pointer border border-white/20 shrink-0 disabled:opacity-50"
            >
              <Download size={14} className={isDownloadingResume ? 'animate-bounce' : ''} />
              <span>{isDownloadingResume ? 'Generating PDF...' : 'Download Resume PDF'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Interview Readiness Checklist</h3>
            <span className="text-xs text-purple-300">
              {data.placementChecklist.filter((c) => c.completed).length} of{' '}
              {data.placementChecklist.length} Ready
            </span>
          </div>

          <div className="space-y-2.5">
            {data.placementChecklist.map((item) => (
              <div
                key={item.id}
                onClick={() => togglePlacementChecklist(item.id)}
                className={`cursor-pointer flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                  item.completed
                    ? 'bg-[#151221]/70 border-purple-500/10'
                    : 'bg-[#161424] border-purple-500/20 hover:border-purple-500/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.completed ? (
                    <CheckCircle2 size={20} className="text-emerald-400 fill-emerald-400/20 shrink-0" />
                  ) : (
                    <Circle size={20} className="text-[#9E99AF] shrink-0" />
                  )}
                  <span
                    className={`text-xs sm:text-sm font-medium ${
                      item.completed ? 'line-through text-[#878296]' : 'text-white'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>

                <span className="text-[10px] uppercase font-bold text-purple-300 bg-purple-500/15 px-2 py-0.5 rounded">
                  {item.category.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Application Modal */}
      <Modal
        isOpen={isAppModalOpen}
        onClose={() => setIsAppModalOpen(false)}
        title="Track Job / Internship Application"
        subtitle="Record your application to campus drives or off-campus portals"
      >
        <form onSubmit={handleSaveApp} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#AAA5B6] mb-1">Company *</label>
              <input
                type="text"
                required
                placeholder="e.g. Wipro, Infosys, Amazon"
                value={appCompany}
                onChange={(e) => setAppCompany(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#1A1629] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#AAA5B6] mb-1">Role *</label>
              <input
                type="text"
                required
                placeholder="e.g. SDE Intern"
                value={appRole}
                onChange={(e) => setAppRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#1A1629] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#AAA5B6] mb-1">Status</label>
              <select
                value={appStatus}
                onChange={(e) => setAppStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#1A1629] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400"
              >
                <option value="applied">Applied</option>
                <option value="oa_cleared">OA Cleared</option>
                <option value="interview">Interview Scheduled</option>
                <option value="offer">Offered</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#AAA5B6] mb-1">Package (LPA)</label>
              <input
                type="text"
                placeholder="e.g. 6.5 LPA"
                value={appPackage}
                onChange={(e) => setAppPackage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#1A1629] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#AAA5B6] mb-1">Portal / Link</label>
            <input
              type="url"
              placeholder="https://careers..."
              value={appLink}
              onChange={(e) => setAppLink(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#1A1629] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#AAA5B6] mb-1">Notes</label>
            <textarea
              rows={2}
              placeholder="Referral name, test date, or questions asked..."
              value={appNotes}
              onChange={(e) => setAppNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#1A1629] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400 resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-purple-500/15">
            <button
              type="button"
              onClick={() => setIsAppModalOpen(false)}
              className="px-3.5 py-1.5 rounded-xl bg-[#201C33] text-xs text-[#9E99AF]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-semibold"
            >
              Save Application
            </button>
          </div>
        </form>
      </Modal>

      {/* Mock Interview Modal */}
      <Modal
        isOpen={isMockModalOpen}
        onClose={() => setIsMockModalOpen(false)}
        title="Record Mock Interview Debrief"
        subtitle="Reflect on technical performance and identify growth areas"
      >
        <form onSubmit={handleSaveMock} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#AAA5B6] mb-1">Role</label>
              <input
                type="text"
                required
                value={mockRole}
                onChange={(e) => setMockRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#1A1629] border border-purple-500/20 text-white text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#AAA5B6] mb-1">Score (/10)</label>
              <input
                type="number"
                min={1}
                max={10}
                value={mockScore}
                onChange={(e) => setMockScore(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#1A1629] border border-purple-500/20 text-white text-xs focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#AAA5B6] mb-1">Strengths</label>
            <textarea
              rows={2}
              required
              placeholder="What went well? Solid explanation of OOPs, clean code..."
              value={mockStrengths}
              onChange={(e) => setMockStrengths(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#1A1629] border border-purple-500/20 text-white text-xs focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#AAA5B6] mb-1">Areas for Improvement</label>
            <textarea
              rows={2}
              required
              placeholder="What needs work? Pointer edge cases, faster complexity analysis..."
              value={mockAreas}
              onChange={(e) => setMockAreas(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#1A1629] border border-purple-500/20 text-white text-xs focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#AAA5B6] mb-1">Questions Asked</label>
            <input
              type="text"
              placeholder="e.g. Reverse linked list, ACID properties, TCP vs UDP"
              value={mockQuestions}
              onChange={(e) => setMockQuestions(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#1A1629] border border-purple-500/20 text-white text-xs focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-purple-500/15">
            <button
              type="button"
              onClick={() => setIsMockModalOpen(false)}
              className="px-3.5 py-1.5 rounded-xl bg-[#201C33] text-xs text-[#9E99AF]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-semibold"
            >
              Save Record
            </button>
          </div>
        </form>
      </Modal>

      {/* Developer Portfolios (LeetCode & GitHub) Edit Modal */}
      <Modal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        title="Edit LeetCode & GitHub Developer Profiles"
        subtitle="Update your usernames, solved counts, rankings, and public repository metrics"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveDeveloperProfiles} className="space-y-5">
          {/* LeetCode Section */}
          <div className="p-4 rounded-2xl bg-[#17142A] border border-[#FFA116]/30 space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Code2 size={14} className="text-[#FFA116]" />
              <span className="text-[#FFA116]">LeetCode Profile & Problem Counts</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#AAA9C6] mb-1">
                  LeetCode Username
                </label>
                <input
                  type="text"
                  required
                  value={formLcUser}
                  onChange={(e) => setFormLcUser(e.target.value)}
                  placeholder="e.g. bca_coder_pro"
                  className="w-full px-3 py-2 rounded-xl bg-[#120F22] border border-white/10 text-white text-xs focus:outline-none focus:border-[#FFA116]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#AAA9C6] mb-1">
                  Contest Rating
                </label>
                <input
                  type="number"
                  value={formLcRating}
                  onChange={(e) => setFormLcRating(Number(e.target.value))}
                  placeholder="e.g. 1640"
                  className="w-full px-3 py-2 rounded-xl bg-[#120F22] border border-white/10 text-white text-xs focus:outline-none focus:border-[#FFA116] font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="block text-[10px] font-semibold text-emerald-400 mb-1">
                  Easy Solved
                </label>
                <input
                  type="number"
                  min="0"
                  value={formLcEasy}
                  onChange={(e) => setFormLcEasy(Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded-xl bg-[#120F22] border border-emerald-500/30 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-amber-400 mb-1">
                  Med Solved
                </label>
                <input
                  type="number"
                  min="0"
                  value={formLcMed}
                  onChange={(e) => setFormLcMed(Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded-xl bg-[#120F22] border border-amber-500/30 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-rose-400 mb-1">
                  Hard Solved
                </label>
                <input
                  type="number"
                  min="0"
                  value={formLcHard}
                  onChange={(e) => setFormLcHard(Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded-xl bg-[#120F22] border border-rose-500/30 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-amber-300 mb-1">
                  Streak Days
                </label>
                <input
                  type="number"
                  min="0"
                  value={formLcStreak}
                  onChange={(e) => setFormLcStreak(Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded-xl bg-[#120F22] border border-amber-500/30 text-white text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* GitHub Section */}
          <div className="p-4 rounded-2xl bg-[#17142A] border border-[#00F0FF]/30 space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <GitBranch size={14} className="text-[#00F0FF]" />
              <span className="text-[#00F0FF]">GitHub Open Source Portfolio</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#AAA9C6] mb-1">
                  GitHub Username
                </label>
                <input
                  type="text"
                  required
                  value={formGhUser}
                  onChange={(e) => setFormGhUser(e.target.value)}
                  placeholder="e.g. bca-student-dev"
                  className="w-full px-3 py-2 rounded-xl bg-[#120F22] border border-white/10 text-white text-xs focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#AAA9C6] mb-1">
                  Featured Top Capstone Repo Name
                </label>
                <input
                  type="text"
                  value={formGhTopRepo}
                  onChange={(e) => setFormGhTopRepo(e.target.value)}
                  placeholder="e.g. fullstack-bca-capstone"
                  className="w-full px-3 py-2 rounded-xl bg-[#120F22] border border-white/10 text-white text-xs focus:outline-none focus:border-[#00F0FF] font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] font-semibold text-white mb-1">
                  Public Repos
                </label>
                <input
                  type="number"
                  min="0"
                  value={formGhRepos}
                  onChange={(e) => setFormGhRepos(Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded-xl bg-[#120F22] border border-white/10 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-amber-300 mb-1">
                  Star Count
                </label>
                <input
                  type="number"
                  min="0"
                  value={formGhStars}
                  onChange={(e) => setFormGhStars(Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded-xl bg-[#120F22] border border-white/10 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-emerald-400 mb-1">
                  Commit Streak (d)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formGhStreak}
                  onChange={(e) => setFormGhStreak(Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded-xl bg-[#120F22] border border-white/10 text-white text-xs font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-purple-500/20">
            <button
              type="button"
              onClick={() => setIsEditProfileModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-[#201C33] text-xs text-[#AAA9C6] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-[#8B3DFF] to-[#00F0FF] text-white text-xs font-bold shadow-md hover:brightness-110 transition-all cursor-pointer"
            >
              Save Developer Profiles
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
