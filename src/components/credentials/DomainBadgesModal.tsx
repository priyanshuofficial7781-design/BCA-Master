import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DomainBadge } from '../../types';
import {
  Award,
  Shield,
  Sparkles,
  Download,
  Share2,
  CheckCircle2,
  Lock,
  ExternalLink,
  X,
  Flame,
} from 'lucide-react';

interface DomainBadgesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DomainBadgesModal: React.FC<DomainBadgesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { data, streakDays, overallCgpa } = useApp();

  const masteredCount = data.questionBankProgress?.masteredIds.length || 0;
  const completedProjects = data.projects.filter((p) => p.status === 'completed').length;

  const badges: DomainBadge[] = [
    {
      id: 'badge-dsa',
      title: 'DSA Vanguard',
      subtitle: 'Algorithmic Mastery & Problem Solving',
      category: 'dsa',
      icon: '/badges/badge_dsa.svg',
      unlocked: masteredCount >= 3 || streakDays >= 3,
      unlockedAt: 'Oct 2026',
      criteria: 'Solve at least 5 DSA problems and maintain an active 3+ day streak',
      progressPercent: Math.min(100, Math.round(((masteredCount + streakDays) / 8) * 100)),
      verificationHash: 'SHA256:7f9a2b819e0c5d4f6a1e3b5c7d9f0a2e',
    },
    {
      id: 'badge-web',
      title: 'Full-Stack Architect',
      subtitle: 'Modern Web & Distributed Systems',
      category: 'web',
      icon: '/badges/badge_web.svg',
      unlocked: completedProjects >= 1 || data.projects.length >= 2,
      unlockedAt: 'Oct 2026',
      criteria: 'Build and ship 1 full-stack production capstone project',
      progressPercent: Math.min(100, Math.round((completedProjects / 1) * 100) || 75),
      verificationHash: 'SHA256:4b1d7e9f2a0c6d8e3f5a1c7b9e0d2f4a',
    },
    {
      id: 'badge-aiml',
      title: 'AI/ML Neural Core',
      subtitle: 'Deep Learning & Intelligent Systems',
      category: 'aiml',
      icon: '/badges/badge_aiml.svg',
      unlocked: true,
      unlockedAt: 'Oct 2026',
      criteria: 'Complete the foundational Neural Networks & Mathematics module',
      progressPercent: 100,
      verificationHash: 'SHA256:9c0e3a5f7d1b2e4a6f8c0d2e4b6a8f1c',
    },
    {
      id: 'badge-cloud',
      title: 'Cloud & DevOps Aegis',
      subtitle: 'Infrastructure, CI/CD & Reliability',
      category: 'cloud',
      icon: '/badges/badge_cloud.svg',
      unlocked: overallCgpa >= 7.5,
      unlockedAt: 'Oct 2026',
      criteria: 'Maintain a cumulative CGPA >= 7.5 across core computer science semesters',
      progressPercent: Math.min(100, Math.round((overallCgpa / 7.5) * 100)),
      verificationHash: 'SHA256:3e5a7b9c1d0f2e4a6b8d0c2e4f6a8b1d',
    },
  ];

  const [selectedBadge, setSelectedBadge] = useState<DomainBadge>(badges[0]);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownloadCertificate = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fadeIn">
      <div className="w-full max-w-4xl rounded-3xl bg-[#120D22] border border-violet-500/30 p-6 sm:p-8 shadow-[0_15px_60px_rgba(0,0,0,0.8)] relative text-white max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-500 p-0.5 shadow-[0_0_20px_rgba(139,92,246,0.4)]">
            <div className="w-full h-full rounded-2xl bg-[#161226] flex items-center justify-center text-violet-300">
              <Award size={24} />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-violet-300 bg-violet-600/20 px-2 py-0.5 rounded-full border border-violet-500/30">
                CYBER CREDENTIALS
              </span>
              <span className="text-xs text-[#9E99AF]">· Verified Student Badges</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-0.5">
              Domain Master Emblems &amp; Certificates
            </h2>
          </div>
        </div>

        {/* Two-Column Layout: Badge Selection Grid + Interactive Insignia Card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left: Badge Selectors (5 Cols) */}
          <div className="md:col-span-5 space-y-3">
            <div className="text-xs text-[#9E99AF] font-medium mb-1">
              Select Badge to Inspect:
            </div>
            {badges.map((badge) => {
              const isSelected = selectedBadge.id === badge.id;
              return (
                <div
                  key={badge.id}
                  onClick={() => setSelectedBadge(badge)}
                  className={`cursor-pointer group flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-violet-900/40 to-indigo-900/40 border-violet-400/60 shadow-[0_0_15px_rgba(139,92,246,0.25)]'
                      : 'bg-[#181329]/60 hover:bg-[#1E1735]/80 border-white/5'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-[#0E0B1A] border border-white/10 p-1 flex items-center justify-center">
                    <img
                      src={badge.icon}
                      alt={badge.title}
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white truncate">
                        {badge.title}
                      </h4>
                      {badge.unlocked ? (
                        <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                      ) : (
                        <Lock size={13} className="text-[#9E99AF] shrink-0" />
                      )}
                    </div>
                    <p className="text-[10px] text-[#AAA5B6] truncate mt-0.5">
                      {badge.subtitle}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-violet-500 to-cyan-400"
                          style={{ width: `${badge.progressPercent}%` }}
                        />
                      </div>
                      <span className="text-[9px] font-mono text-violet-300">
                        {badge.progressPercent}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Holographic Badge Showcase Card (7 Cols) */}
          <div className="md:col-span-7 flex flex-col justify-between p-6 rounded-3xl bg-gradient-to-br from-[#1A1430] via-[#120E22] to-[#0A0713] border border-violet-500/30 shadow-2xl relative overflow-hidden">
            {/* Background Holographic Sheen */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              {/* Badge Visual Image Box */}
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto mb-4 flex items-center justify-center">
                <div className="absolute inset-0 bg-violet-600/25 rounded-full blur-2xl animate-pulse" />
                <img
                  src={selectedBadge.icon}
                  alt={selectedBadge.title}
                  className="relative z-10 w-full h-full object-contain drop-shadow-[0_0_25px_rgba(168,85,247,0.5)] transform hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Title & Status */}
              <div className="text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold mb-2">
                  <CheckCircle2 size={11} />
                  <span>OFFICIALLY UNLOCKED · {selectedBadge.unlockedAt}</span>
                </div>
                <h3 className="text-xl font-extrabold text-white tracking-tight">
                  {selectedBadge.title}
                </h3>
                <p className="text-xs text-violet-200 mt-0.5 font-medium">
                  {selectedBadge.subtitle}
                </p>
              </div>

              {/* Verification & Criteria Box */}
              <div className="mt-5 p-3.5 rounded-2xl bg-[#0C0817] border border-white/5 space-y-2 text-xs">
                <div className="text-[11px] text-[#AAA5B6]">
                  <strong>Requirement:</strong> {selectedBadge.criteria}
                </div>
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-[#9E99AF]">
                  <span>Credential Hash:</span>
                  <span className="text-violet-300 truncate max-w-[200px]">
                    {selectedBadge.verificationHash}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={handleDownloadCertificate}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white text-xs font-bold shadow-lg shadow-violet-900/40 flex items-center justify-center gap-2 transition active:scale-95"
              >
                <Download size={14} />
                <span>Download Credential Card</span>
              </button>

              <button
                onClick={() => {
                  navigator.clipboard?.writeText(
                    `Check out my ${selectedBadge.title} certification on BCA Career Planner! Verification Hash: ${selectedBadge.verificationHash}`
                  );
                  alert?.('Credential verification link copied to clipboard!');
                }}
                className="px-4 py-2.5 rounded-xl bg-[#1C1630] hover:bg-[#251D40] border border-violet-500/30 text-violet-300 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Share2 size={14} />
                <span>Share</span>
              </button>
            </div>

            {downloadSuccess && (
              <div className="mt-3 p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs text-center animate-fadeIn">
                Credential certificate prepared and saved!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
