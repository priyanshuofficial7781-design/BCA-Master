import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProgressBar } from '../common/ProgressBar';
import {
  Shield,
  Brain,
  CheckCircle2,
  Circle,
  Terminal,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';

export const SpecializationsView: React.FC = () => {
  const { data, toggleLearningPathStep } = useApp();

  const [activeTrack, setActiveTrack] = useState<'cyber' | 'aiml'>('cyber');

  const cyberSteps = data.cybersecurityPath;
  const aimlSteps = data.aimlPath;

  const currentSteps = activeTrack === 'cyber' ? cyberSteps : aimlSteps;
  const completedCount = currentSteps.filter((s) => s.completed).length;
  const progressPercent =
    currentSteps.length > 0 ? Math.round((completedCount / currentSteps.length) * 100) : 0;

  return (
    <div className="space-y-6 pb-24 lg:pb-12 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#161424] border border-purple-500/20">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Specialization Learning Paths
          </h2>
          <p className="text-xs sm:text-sm text-[#9E99AF]">
            Industry-aligned deep dive roadmaps in Cybersecurity & Artificial Intelligence
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div>
            <div className="text-[11px] text-[#9E99AF]">Track Progress</div>
            <div className="text-lg font-bold text-white tabular-nums">
              {completedCount} / {currentSteps.length} Phases ({progressPercent}%)
            </div>
          </div>
          <div className="w-24 sm:w-28">
            <ProgressBar progress={progressPercent} height={7} />
          </div>
        </div>
      </div>

      {/* Track Selector Tabs */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setActiveTrack('cyber')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeTrack === 'cyber'
              ? 'bg-gradient-to-r from-rose-950/40 to-[#1D172A] border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.15)]'
              : 'bg-[#161424] border-purple-500/15 text-[#9E99AF] hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <Shield size={18} />
            </div>
            <h3 className="text-sm font-bold text-white">Cybersecurity Defense</h3>
          </div>
          <p className="text-xs text-[#9E99AF]">
            Networking, Linux, Python Tools, OWASP Top 10, SOC SIEM & Lab Exercises
          </p>
        </button>

        <button
          onClick={() => setActiveTrack('aiml')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeTrack === 'aiml'
              ? 'bg-gradient-to-r from-purple-950/40 to-[#1D172A] border-purple-500/40 shadow-[0_0_20px_rgba(169,112,255,0.15)]'
              : 'bg-[#161424] border-purple-500/15 text-[#9E99AF] hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Brain size={18} />
            </div>
            <h3 className="text-sm font-bold text-white">AI & Machine Learning</h3>
          </div>
          <p className="text-xs text-[#9E99AF]">
            Math for ML, NumPy/Pandas, Scikit-learn, Neural Nets, RAG & LLMs
          </p>
        </button>
      </div>

      {/* Path Phases List */}
      <div className="space-y-4">
        {currentSteps.map((step, idx) => {
          return (
            <div
              key={step.id}
              className={`rounded-2xl border p-5 transition-all ${
                step.completed
                  ? 'bg-[#141220] border-purple-500/15'
                  : 'bg-[#161424] border-purple-500/20 hover:border-purple-500/35'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => toggleLearningPathStep(activeTrack, step.id)}
                    className="mt-0.5 text-purple-400 hover:text-purple-300 transition-colors shrink-0"
                    title={step.completed ? 'Mark incomplete' : 'Mark completed'}
                  >
                    {step.completed ? (
                      <CheckCircle2 size={22} className="text-emerald-400 fill-emerald-400/20" />
                    ) : (
                      <Circle size={22} className="text-[#9E99AF] hover:text-purple-400" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-purple-300 bg-purple-500/15 px-2 py-0.5 rounded-full">
                        {step.phase}
                      </span>
                      <span className="text-[11px] text-[#9E99AF]">
                        Step {idx + 1} of {currentSteps.length}
                      </span>
                    </div>
                    <h4
                      className={`text-base font-bold mt-1 ${
                        step.completed ? 'line-through text-[#8E8A9C]' : 'text-white'
                      }`}
                    >
                      {step.title}
                    </h4>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleLearningPathStep(activeTrack, step.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold self-start sm:self-auto transition-colors ${
                    step.completed
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25'
                      : 'bg-[#201C33] text-purple-300 hover:bg-purple-600 hover:text-white border border-purple-500/20'
                  }`}
                >
                  {step.completed ? 'Completed' : 'Mark Complete'}
                </button>
              </div>

              <p className="text-xs text-[#AAA5B6] leading-relaxed mb-3.5">
                {step.description}
              </p>

              {/* Topics Pills */}
              <div className="mb-3.5">
                <span className="text-[10px] font-semibold text-[#8E8A9C] uppercase tracking-wider block mb-1.5">
                  Core Topics Covered
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {step.topics.map((topic, i) => (
                    <span
                      key={i}
                      className="text-[11px] text-purple-200 bg-[#1F1B30] border border-purple-500/15 px-2.5 py-1 rounded-lg"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Safe Practical Lab / Exercise */}
              <div className="p-3.5 rounded-xl bg-[#1A1629] border border-purple-500/20 flex items-start gap-2.5">
                <Terminal size={16} className="text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider block">
                    Hands-On Practical Lab / Exercise:
                  </span>
                  <p className="text-xs text-white mt-0.5 leading-relaxed font-mono">
                    {step.practicalExercise}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
