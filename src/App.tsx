/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { Sidebar } from './components/common/Sidebar';
import { MoreMenuDrawer } from './components/common/MoreMenuDrawer';
import { NotificationsModal } from './components/common/NotificationsModal';
import { TaskModal } from './components/planner/TaskModal';
import { SubjectDetailModal } from './components/learning/SubjectDetailModal';
import { QuickPracticeModal } from './components/dashboard/QuickPracticeModal';
import { ProfileSettingsModal } from './components/profile/ProfileSettingsModal';

// Views
import { HomeDashboard } from './components/dashboard/HomeDashboard';
import { PlannerView } from './components/planner/PlannerView';
import { LearningHubView } from './components/learning/LearningHubView';
import { CodeSandboxView } from './components/practice/CodeSandboxView';
import { TechVivaSimulatorView } from './components/learning/TechVivaSimulatorView';
import { VideoLecturesView } from './components/video/VideoLecturesView';
import { FloatingPiPPlayer } from './components/video/FloatingPiPPlayer';
import { SpecializationsView } from './components/specializations/SpecializationsView';
import { ProjectsView } from './components/projects/ProjectsView';
import { PlacementView } from './components/placement/PlacementView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { PomodoroFocusView } from './components/pomodoro/PomodoroFocusView';
import { CapstoneStudioView } from './components/projects/CapstoneStudioView';
import { MegaQuestionBankView } from './components/practice/MegaQuestionBankView';
import { PeerStudyRoomView } from './components/collaborative/PeerStudyRoomView';
import { DomainBadgesModal } from './components/credentials/DomainBadgesModal';
import { ResumeDossierModal } from './components/credentials/ResumeDossierModal';
import { DsaVisualizerModal } from './components/practice/DsaVisualizerModal';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { SplashScreen } from './components/welcome/SplashScreen';
import { OnboardingScreen } from './components/welcome/OnboardingScreen';
import { AIChatDrawer } from './components/ai/AIChatDrawer';
import { Sparkles } from 'lucide-react';
import { soundEffects } from './services/soundEffects';

const MainAppContent: React.FC = () => {
  const { activeTab, setActiveTab, selectedSubjectId, setSelectedSubjectId, data, updateProfile } = useApp();

  // Mandatory App State Machine: SPLASH → ONBOARDING → DASHBOARD
  // App startup state is ALWAYS 'splash', never auto-redirecting to dashboard
  const [appMode, setAppMode] = useState<'splash' | 'onboarding' | 'dashboard'>('splash');

  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isQuickPracticeOpen, setIsQuickPracticeOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isBadgesModalOpen, setIsBadgesModalOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isDsaVisualizerOpen, setIsDsaVisualizerOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [aiInitialQuery, setAiInitialQuery] = useState<string | undefined>(undefined);

  const handleOpenAIChat = (query?: string) => {
    setAiInitialQuery(query);
    setIsAIChatOpen(true);
  };

  const handleResetProfile = () => {
    updateProfile({
      name: 'Student',
      semester: 3,
      onboardingCompleted: false,
      dailyStudyTargetHours: 3.5,
    });
    setAppMode('onboarding');
  };

  // 1. Mandatory Splash Screen View
  if (appMode === 'splash') {
    return (
      <SplashScreen
        onGetStarted={() => setAppMode('onboarding')}
        onContinue={() => setAppMode('dashboard')}
        onResetProfile={handleResetProfile}
      />
    );
  }

  // 2. Multi-step Onboarding Flow
  if (appMode === 'onboarding') {
    return (
      <OnboardingScreen
        onComplete={() => setAppMode('dashboard')}
        onSkip={() => setAppMode('dashboard')}
      />
    );
  }

  // 3. Home Dashboard & Full BCA Suite
  return (
    <div className={`min-h-screen ${data.profile.theme === 'light' ? 'bg-[#F4F6FC] text-[#0E0A24]' : 'bg-[#070711] text-[#F7F5FF]'} flex flex-col lg:flex-row transition-colors duration-200`}>
      {/* Desktop Navigation Sidebar */}
      <Sidebar
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenBadges={() => setIsBadgesModalOpen(true)}
        onOpenResume={() => setIsResumeOpen(true)}
        onReturnToWelcome={() => setAppMode('splash')}
        onOpenAIChat={handleOpenAIChat}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Header */}
        <Header
          onOpenAddTask={() => setIsAddTaskOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenBadges={() => setIsBadgesModalOpen(true)}
          onOpenResume={() => setIsResumeOpen(true)}
          onOpenDsaVisualizer={() => setIsDsaVisualizerOpen(true)}
          onReturnToWelcome={() => setAppMode('splash')}
          onOpenAIChat={handleOpenAIChat}
        />

        {/* Dynamic Route View Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          {activeTab === 'home' && (
            <HomeDashboard
              onOpenAddTask={() => setIsAddTaskOpen(true)}
              onOpenQuickPractice={() => setIsQuickPracticeOpen(true)}
              onOpenSubjectDetail={(id) => setSelectedSubjectId(id)}
              onOpenBadges={() => setIsBadgesModalOpen(true)}
              onOpenResume={() => setIsResumeOpen(true)}
              onOpenDsaVisualizer={() => setIsDsaVisualizerOpen(true)}
            />
          )}

          {activeTab === 'planner' && <PlannerView />}

          {activeTab === 'code-sandbox' && (
            <CodeSandboxView onOpenAIChat={handleOpenAIChat} />
          )}

          {activeTab === 'viva-lab' && <TechVivaSimulatorView />}

          {activeTab === 'video-lectures' && <VideoLecturesView />}

          {activeTab === 'pomodoro' && <PomodoroFocusView />}

          {activeTab === 'study-rooms' && <PeerStudyRoomView />}

          {activeTab === 'practice-bank' && <MegaQuestionBankView />}

          {activeTab === 'capstone' && <CapstoneStudioView />}

          {activeTab === 'learn' && <LearningHubView />}

          {activeTab === 'specializations' && <SpecializationsView />}

          {activeTab === 'projects' && <ProjectsView />}

          {activeTab === 'placement' && <PlacementView />}

          {activeTab === 'analytics' && <AnalyticsView />}
        </main>

        {/* Mobile Bottom Navigation Bar with Center Add Button */}
        <BottomNav
          onOpenMoreMenu={() => setIsMoreMenuOpen(true)}
          onOpenAddTask={() => setIsAddTaskOpen(true)}
        />
      </div>

      {/* Floating Modals & Drawers */}
      <MoreMenuDrawer
        isOpen={isMoreMenuOpen}
        onClose={() => setIsMoreMenuOpen(false)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenResume={() => setIsResumeOpen(true)}
        onReturnToWelcome={() => setAppMode('splash')}
        onOpenAIChat={handleOpenAIChat}
      />

      <TaskModal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
      />

      <SubjectDetailModal
        isOpen={Boolean(selectedSubjectId)}
        onClose={() => setSelectedSubjectId(null)}
        subjectId={selectedSubjectId}
      />

      <QuickPracticeModal
        isOpen={isQuickPracticeOpen}
        onClose={() => setIsQuickPracticeOpen(false)}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onOpenTask={() => {
          setIsNotificationsOpen(false);
          setIsAddTaskOpen(true);
        }}
      />

      <ProfileSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onRevisitOnboarding={() => setAppMode('onboarding')}
        onReturnToWelcome={() => setAppMode('splash')}
      />

      <DomainBadgesModal
        isOpen={isBadgesModalOpen}
        onClose={() => setIsBadgesModalOpen(false)}
      />

      <ResumeDossierModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />

      <DsaVisualizerModal
        isOpen={isDsaVisualizerOpen}
        onClose={() => setIsDsaVisualizerOpen(false)}
      />

      {/* Floating Cyberpunk AI Study Assistant Trigger Button */}
      <button
        type="button"
        onClick={() => {
          soundEffects.playClick();
          handleOpenAIChat();
        }}
        className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40 flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-full bg-gradient-to-r from-[#8B3DFF] via-[#A855F7] to-[#00F0FF] text-white font-black text-xs sm:text-sm shadow-[0_0_25px_rgba(139,61,255,0.6)] hover:shadow-[0_0_40px_rgba(0,240,255,0.85)] hover:scale-105 active:scale-95 transition-all cursor-pointer group"
        title="Ask AI: Google Gemini 3.8 Flash & ChatGPT-4o Coding Coach"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
        </span>
        <Sparkles size={16} className="text-white group-hover:rotate-12 transition-transform" />
        <span className="tracking-wide">Ask AI</span>
        <span className="hidden sm:inline text-[10px] bg-black/30 px-1.5 py-0.5 rounded-full border border-white/20 font-mono text-[#00F0FF]">
          Gemini · ChatGPT
        </span>
      </button>

      {/* Interactive AI Chat Drawer (Gemini & ChatGPT) */}
      <AIChatDrawer
        isOpen={isAIChatOpen}
        onClose={() => {
          setIsAIChatOpen(false);
          setAiInitialQuery(undefined);
        }}
        initialQuery={aiInitialQuery}
        onRunInCodeSandbox={(codeSnippet, lang) => {
          setActiveTab('code-sandbox');
        }}
      />

      {/* Floating Picture-in-Picture YouTube Player */}
      <FloatingPiPPlayer />

      {/* Ambient Offline & Background Sync Indicator */}
      <OfflineIndicator />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
