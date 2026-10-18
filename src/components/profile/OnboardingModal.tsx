import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Sparkles, ArrowRight, ShieldCheck, Check } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { data, updateProfile } = useApp();

  const [step, setStep] = useState(1);
  const [name, setName] = useState(data.profile.name || '');
  const [semester, setSemester] = useState(data.profile.semester || 3);
  const [targetRole, setTargetRole] = useState(data.profile.targetRole || 'Full Stack & Software Engineer');
  const [dailyHours, setDailyHours] = useState(data.profile.dailyStudyTargetHours || 3.5);
  const [primaryTrack, setPrimaryTrack] = useState(data.profile.primaryTrack || 'swe');

  const handleFinish = () => {
    updateProfile({
      name: name.trim() || 'Student',
      semester: Number(semester) as any,
      targetRole: targetRole.trim(),
      dailyStudyTargetHours: Number(dailyHours),
      primaryTrack,
      onboardingCompleted: true,
    });
    onClose();
  };

  const handleSkip = () => {
    updateProfile({ onboardingCompleted: true });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleSkip}
      title="Welcome to BCA Career Planner"
      subtitle="Your premium companion for BCA academic excellence & placement readiness"
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Step Indicator */}
        <div className="flex items-center gap-2">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1 rounded-full transition-colors ${
                s <= step ? 'bg-purple-500 shadow-[0_0_8px_#a970ff]' : 'bg-[#201C33]'
              }`}
            />
          ))}
        </div>

        {step === 1 ? (
          <div className="space-y-4 animate-fadeIn">
            <div className="text-center py-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 mx-auto flex items-center justify-center text-white shadow-[0_0_20px_rgba(169,112,255,0.4)] mb-2">
                <Sparkles size={24} />
              </div>
              <h3 className="text-base font-bold text-white">Let's Personalize Your Plan</h3>
              <p className="text-xs text-[#9E99AF]">What should we call you and where are you in your BCA?</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#AAA5B6] mb-1">Your Name</label>
              <input
                type="text"
                placeholder="e.g. Priyanshu"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1629] border border-purple-500/20 text-white text-sm focus:outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#AAA5B6] mb-1">Current BCA Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value) as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1629] border border-purple-500/20 text-white text-sm focus:outline-none focus:border-purple-400"
              >
                <option value={1}>Semester 1 (1st Year) — Basics & C</option>
                <option value={2}>Semester 2 (1st Year) — OOPs & Web</option>
                <option value={3}>Semester 3 (2nd Year) — C++ & DSA</option>
                <option value={4}>Semester 4 (2nd Year) — OS, CN & Python</option>
                <option value={5}>Semester 5 (3rd Year) — Projects & Drives</option>
                <option value={6}>Semester 6 (3rd Year) — Capstone & Career</option>
              </select>
            </div>

            <div className="flex justify-between items-center pt-3">
              <button
                type="button"
                onClick={handleSkip}
                className="text-xs text-[#9E99AF] hover:text-white"
              >
                Skip for now
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <span>Continue</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-fadeIn">
            <div className="text-center py-2">
              <h3 className="text-base font-bold text-white">Daily Targets & Goal Track</h3>
              <p className="text-xs text-[#9E99AF]">Align your daily study schedule with your dream tech role</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#AAA5B6] mb-1">Target Career Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Full Stack Developer, AI Engineer, Cyber Analyst"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1629] border border-purple-500/20 text-white text-sm focus:outline-none focus:border-purple-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#AAA5B6] mb-1">Daily Study Target</label>
                <select
                  value={dailyHours}
                  onChange={(e) => setDailyHours(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#1A1629] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400"
                >
                  <option value={2}>2 hours / day</option>
                  <option value={3}>3 hours / day</option>
                  <option value={3.5}>3.5 hours / day</option>
                  <option value={4}>4 hours / day</option>
                  <option value={5}>5 hours / day</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#AAA5B6] mb-1">Focus Specialization</label>
                <select
                  value={primaryTrack}
                  onChange={(e) => setPrimaryTrack(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[#1A1629] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400"
                >
                  <option value="swe">DSA & Software Eng</option>
                  <option value="aiml">AI & Machine Learning</option>
                  <option value="cyber">Cybersecurity</option>
                  <option value="fullstack">Web & Full Stack</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-[#9E99AF] hover:text-white"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-[0_0_15px_rgba(139,92,246,0.4)]"
              >
                <Check size={14} />
                <span>Launch Planner</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
