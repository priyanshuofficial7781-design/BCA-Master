import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CollageTodaysPlan } from './CollageTodaysPlan';
import { CollageActivityMilestone } from './CollageActivityMilestone';
import { HabitOrbitalSphereWidget } from './HabitOrbitalSphereWidget';
import { DailyHabitTracker } from './DailyHabitTracker';
import { Orbit, Calendar, Sparkles, Binary, FileText, ArrowRight, ShieldCheck, Terminal, Brain, Youtube, Play, MonitorPlay } from 'lucide-react';
import { soundEffects } from '../../services/soundEffects';

interface HomeDashboardProps {
  onOpenAddTask: () => void;
  onOpenQuickPractice: () => void;
  onOpenSubjectDetail?: (subjectId: string) => void;
  onOpenBadges?: () => void;
  onOpenResume?: () => void;
  onOpenDsaVisualizer?: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onOpenAddTask,
  onOpenQuickPractice,
  onOpenSubjectDetail,
  onOpenBadges,
  onOpenResume,
  onOpenDsaVisualizer,
}) => {
  const { setActiveTab, openVideo, setPiP } = useApp();
  const [active3DView, setActive3DView] = useState<'orbital' | 'heatmap'>('orbital');

  return (
    <div className="space-y-6 pb-24 lg:pb-12 animate-fadeIn max-w-5xl w-full mx-auto select-none">
      {/* 1. Interactive 3D Showcase (Three.js WebGL): Orbital Discipline Core / 30-Day Activity Matrix */}
      <div className="space-y-3">
        {/* Switcher bar between 3D Orbital Model and 3D Activity Matrix */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-[#8B3DFF]/20 text-[#B46CFF] border border-[#8B3DFF]/30 shadow-[0_0_12px_rgba(139,61,255,0.3)]">
              <Sparkles size={14} />
            </span>
            <span className="text-xs font-black tracking-wider uppercase text-white">
              Interactive 3D Discipline Center
            </span>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#100E22] border border-[#B46CFF]/25 shadow-inner">
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setActive3DView('orbital');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                active3DView === 'orbital'
                  ? 'bg-gradient-to-r from-[#8B3DFF] to-[#4D79FF] text-white shadow-[0_0_15px_rgba(139,61,255,0.45)]'
                  : 'text-[#AAA9C6] hover:text-white'
              }`}
            >
              <Orbit size={13} />
              <span>3D Orbital Core</span>
            </button>
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setActive3DView('heatmap');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                active3DView === 'heatmap'
                  ? 'bg-gradient-to-r from-[#8B3DFF] to-[#4D79FF] text-white shadow-[0_0_15px_rgba(139,61,255,0.45)]'
                  : 'text-[#AAA9C6] hover:text-white'
              }`}
            >
              <Calendar size={13} />
              <span>3D Activity Matrix</span>
            </button>
          </div>
        </div>

        {/* 3D WebGL Canvas Render */}
        {active3DView === 'orbital' ? (
          <HabitOrbitalSphereWidget
            onOpenQuestionBank={() => {
              soundEffects.playClick();
              setActiveTab('practice-bank');
            }}
            onOpenPomodoro={() => {
              soundEffects.playClick();
              setActiveTab('pomodoro');
            }}
          />
        ) : (
          <DailyHabitTracker
            onOpenAddTask={onOpenAddTask}
            onOpenPomodoro={() => {
              soundEffects.playClick();
              setActiveTab('pomodoro');
            }}
            onOpenAnalytics={() => {
              soundEffects.playClick();
              setActiveTab('analytics');
            }}
          />
        )}
      </div>

      {/* Pre-Deployment Mega Feature Strip: Code Sandbox, Viva Lab, DSA Visualizer & Resume */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Multi-Language Code Sandbox */}
        <div
          onClick={() => {
            soundEffects.playClick();
            setActiveTab('code-sandbox');
          }}
          className="group cursor-pointer p-4 rounded-3xl bg-gradient-to-br from-[#16132D] via-[#100E22] to-[#0A0816] border border-[#00FF9D]/30 hover:border-[#00FF9D]/60 transition-all shadow-[0_12px_35px_rgba(0,0,0,0.6)] backdrop-blur-xl flex flex-col justify-between gap-3 relative overflow-hidden"
        >
          <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00FF9D]/70 to-transparent pointer-events-none" />
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-[#00FF9D]/15 border border-[#00FF9D]/35 flex items-center justify-center text-[#00FF9D] shrink-0 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(0,255,157,0.25)]">
              <Terminal size={20} />
            </div>
            <span className="px-1.5 py-0.2 rounded bg-[#00FF9D]/20 text-[9px] font-mono text-[#00FF9D] font-bold">
              10K+ QS
            </span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-[#00FF9D] transition-colors truncate">
              Live Code Sandbox
            </h4>
            <p className="text-[11px] text-[#AAA9C6] line-clamp-2 mt-0.5">
              10,000+ Questions bank, multi-lang compiler & Big-O
            </p>
          </div>
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-[#00FF9D] font-bold">
            <span>Launch Compiler</span>
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: AI Technical Viva & Voice Lab */}
        <div
          onClick={() => {
            soundEffects.playClick();
            setActiveTab('viva-lab');
          }}
          className="group cursor-pointer p-4 rounded-3xl bg-gradient-to-br from-[#16132D] via-[#100E22] to-[#0A0816] border border-[#00F0FF]/30 hover:border-[#00F0FF]/60 transition-all shadow-[0_12px_35px_rgba(0,0,0,0.6)] backdrop-blur-xl flex flex-col justify-between gap-3 relative overflow-hidden"
        >
          <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00F0FF]/70 to-transparent pointer-events-none" />
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-[#00F0FF]/15 border border-[#00F0FF]/35 flex items-center justify-center text-[#00F0FF] shrink-0 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(0,240,255,0.25)]">
              <Brain size={20} />
            </div>
            <span className="px-1.5 py-0.2 rounded bg-[#00F0FF]/20 text-[9px] font-mono text-[#00F0FF] font-bold">
              VOICE VIVA
            </span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-[#00F0FF] transition-colors truncate">
              AI Tech Viva Lab
            </h4>
            <p className="text-[11px] text-[#AAA9C6] line-clamp-2 mt-0.5">
              10,000+ Oral viva voce questions with university rubric
            </p>
          </div>
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-[#00F0FF] font-bold">
            <span>Practice Viva</span>
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Interactive DSA Visualizer */}
        <div
          onClick={() => {
            soundEffects.playClick();
            onOpenDsaVisualizer?.();
          }}
          className="group cursor-pointer p-4 rounded-3xl bg-gradient-to-br from-[#16132D] via-[#100E22] to-[#0A0816] border border-[#B46CFF]/30 hover:border-[#B46CFF]/60 transition-all shadow-[0_12px_35px_rgba(0,0,0,0.6)] backdrop-blur-xl flex flex-col justify-between gap-3 relative overflow-hidden"
        >
          <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#B46CFF]/70 to-transparent pointer-events-none" />
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-[#8B3DFF]/15 border border-[#B46CFF]/35 flex items-center justify-center text-[#B46CFF] shrink-0 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(180,108,255,0.25)]">
              <Binary size={20} />
            </div>
            <span className="px-1.5 py-0.2 rounded bg-[#8B3DFF]/20 text-[9px] font-mono text-[#B46CFF] font-bold">
              MEMORY
            </span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-[#B46CFF] transition-colors truncate">
              DSA Visualizer
            </h4>
            <p className="text-[11px] text-[#AAA9C6] line-clamp-2 mt-0.5">
              Step-by-step memory pointer graphs & logic
            </p>
          </div>
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-[#B46CFF] font-bold">
            <span>Visualize DSA</span>
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 4: 1-Page Placement Resume & Data Export */}
        <div
          onClick={() => {
            soundEffects.playClick();
            onOpenResume?.();
          }}
          className="group cursor-pointer p-4 rounded-3xl bg-gradient-to-br from-[#16132D] via-[#100E22] to-[#0A0816] border border-[#FF2E93]/30 hover:border-[#FF2E93]/60 transition-all shadow-[0_12px_35px_rgba(0,0,0,0.6)] backdrop-blur-xl flex flex-col justify-between gap-3 relative overflow-hidden"
        >
          <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#FF2E93]/70 to-transparent pointer-events-none" />
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-[#FF2E93]/15 border border-[#FF2E93]/35 flex items-center justify-center text-[#FF2E93] shrink-0 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,46,147,0.25)]">
              <FileText size={20} />
            </div>
            <span className="px-1.5 py-0.2 rounded bg-[#FF2E93]/20 text-[9px] font-mono text-[#FF2E93] font-bold">
              PDF/EXPORT
            </span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-[#FF2E93] transition-colors truncate">
              Resume Dossier
            </h4>
            <p className="text-[11px] text-[#AAA9C6] line-clamp-2 mt-0.5">
              ATS-ready placement resume & PDF download
            </p>
          </div>
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-[#FF2E93] font-bold">
            <span>Export PDF</span>
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Featured In-App YouTube Study Theater Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#170E2E] via-[#120F24] to-[#0B0918] border border-rose-500/25 shadow-[0_12px_35px_rgba(0,0,0,0.6)] relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#FF0033]/70 to-transparent pointer-events-none" />
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/35 flex items-center justify-center text-[#FF0033] shadow-[0_0_20px_rgba(255,0,51,0.25)] shrink-0">
            <Youtube size={26} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-white tracking-tight">
                In-App YouTube Study Player & Picture-in-Picture
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-[#FF4D6D] border border-rose-500/30 text-[10px] font-mono font-bold">
                NEW
              </span>
            </div>
            <p className="text-xs text-[#AAA9C6] mt-0.5">
              Watch curated BCA university lectures side-by-side or minimize to persistent floating PiP while coding.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              openVideo(
                'kJQP7kiw5Fk',
                'C++ Complete Course for Beginners to Advanced (BCA Syllabus)',
                'FreeCodeCamp / University CS',
                'C++ & OOPs'
              );
              setPiP(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 text-xs font-bold transition-all cursor-pointer"
            title="Start playback in floating Picture-in-Picture window"
          >
            <MonitorPlay size={14} className="text-cyan-400" />
            <span>Launch PiP</span>
          </button>
          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('video-lectures');
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF0033] to-[#FF4D6D] text-white text-xs font-black hover:brightness-110 shadow-[0_0_18px_rgba(255,0,51,0.4)] transition-all cursor-pointer"
          >
            <Play size={13} className="fill-white" />
            <span>Open Video Hub</span>
          </button>
        </div>
      </div>

      {/* 3. Today's Plan: Interactive Study Task Checklist with Subject Icons & Progress */}
      <CollageTodaysPlan
        onOpenAddTask={onOpenAddTask}
        onOpenPlanner={() => {
          soundEffects.playClick();
          setActiveTab('planner');
        }}
      />


      {/* 5. Weekly Study Activity Chart & Next Upcoming Task / Academic Module */}
      <CollageActivityMilestone
        onOpenPomodoro={() => {
          soundEffects.playClick();
          setActiveTab('pomodoro');
        }}
        onOpenLearningHub={() => {
          soundEffects.playClick();
          setActiveTab('learn');
        }}
        onOpenAnalytics={() => {
          soundEffects.playClick();
          setActiveTab('analytics');
        }}
      />
    </div>
  );
};
