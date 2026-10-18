import React, { createContext, useContext, useEffect, useState, useMemo, useRef } from 'react';
import { backgroundSyncService } from '../services/backgroundSyncService';
import {
  AppStateData,
  UserProfile,
  PlannerTask,
  Subject,
  RoadmapMilestone,
  ProjectItem,
  DSATopic,
  AptitudeTopic,
  InternshipApplication,
  MockInterviewRecord,
  StudyLogEntry,
  GradeLetter,
  CourseGrade,
  SemesterGradeRecord,
  PomodoroSession,
  AppTheme,
  LeetCodeStats,
  GitHubStats,
} from '../types';
import { INITIAL_APP_DATA, getTodayString } from '../data/initialData';
import {
  auth,
  signInWithGoogle as fbSignInWithGoogle,
  signInGuest as fbSignInGuest,
  logOut as fbLogOut,
  onAuthStateChanged,
  User,
  saveUserProfileToCloud,
  getUserProfileFromCloud,
} from '../services/firebase';

export type NavigationTab =
  | 'home'
  | 'planner'
  | 'code-sandbox'
  | 'viva-lab'
  | 'video-lectures'
  | 'pomodoro'
  | 'study-rooms'
  | 'learn'
  | 'practice-bank'
  | 'capstone'
  | 'specializations'
  | 'projects'
  | 'placement'
  | 'analytics'
  | 'settings';

export interface ActiveVideoState {
  videoId: string | null;
  title: string;
  channel?: string;
  category?: string;
  isPiP: boolean;
  isOpen: boolean;
}

const GRADE_POINTS: Record<GradeLetter, number> = {
  O: 10,
  'A+': 9,
  A: 8,
  'B+': 7,
  B: 6,
  C: 5,
  P: 4,
  F: 0,
};

interface AppContextValue {
  data: AppStateData;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedSubjectId: string | null;
  setSelectedSubjectId: (id: string | null) => void;
  // Firebase Authentication
  currentUser: User | null;
  authLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInGuest: () => Promise<void>;
  signOutUser: () => Promise<void>;
  // Developer Profiles (LeetCode & GitHub)
  updateLeetCodeStats: (stats: Partial<LeetCodeStats>) => void;
  updateGitHubStats: (stats: Partial<GitHubStats>) => void;
  // Theme
  theme: AppTheme;
  toggleTheme: () => void;
  // User Profile
  updateProfile: (updates: Partial<UserProfile>) => void;
  // Planner Tasks
  addTask: (task: Omit<PlannerTask, 'id'>) => string;
  updateTask: (id: string, updates: Partial<PlannerTask>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  // Study Logging
  logStudySession: (subjectId: string, durationMinutes: number, notes?: string) => void;
  // Subjects & Lectures
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  incrementSubjectLecture: (subjectId: string, count?: number) => void;
  toggleSubjectModule: (subjectId: string, moduleId: string) => void;
  addSubjectModule: (subjectId: string, title: string, lectureCount: number) => void;
  // Roadmap
  toggleRoadmapMilestone: (semNumber: number, milestoneId: string) => void;
  addRoadmapMilestone: (semNumber: number, milestone: { title: string; type: RoadmapMilestone['type'] }) => void;
  // Specializations
  toggleLearningPathStep: (track: 'cyber' | 'aiml', stepId: string) => void;
  // Projects
  addProject: (project: Omit<ProjectItem, 'id'>) => string;
  updateProject: (id: string, updates: Partial<ProjectItem>) => void;
  deleteProject: (id: string) => void;
  toggleProjectMilestone: (projectId: string, milestoneId: string) => void;
  // Placement & DSA
  updateDsaTopic: (id: string, updates: Partial<DSATopic>) => void;
  updateAptitudeTopic: (id: string, updates: Partial<AptitudeTopic>) => void;
  addApplication: (app: Omit<InternshipApplication, 'id'>) => void;
  updateApplication: (id: string, updates: Partial<InternshipApplication>) => void;
  deleteApplication: (id: string) => void;
  addMockInterview: (mock: Omit<MockInterviewRecord, 'id'>) => void;
  togglePlacementChecklist: (id: string) => void;
  // Pomodoro Focus
  logPomodoroSession: (session: Omit<PomodoroSession, 'id'>) => void;
  // Grades & SGPA/CGPA
  updateCourseGrade: (semNumber: number, courseId: string, grade: GradeLetter) => void;
  addCustomCourse: (semNumber: number, course: { code: string; name: string; credits: number; grade: GradeLetter }) => void;
  deleteCourse: (semNumber: number, courseId: string) => void;
  updateTargetCgpa: (cgpa: number) => void;
  // 10k Question Bank Mastery & Bookmarks
  toggleMasteredQuestion: (id: string) => void;
  toggleBookmarkedQuestion: (id: string) => void;
  // YouTube Video Player & Floating PiP
  videoState: ActiveVideoState;
  openVideo: (videoId: string, title: string, channel?: string, category?: string) => void;
  closeVideo: () => void;
  togglePiP: () => void;
  setPiP: (pip: boolean) => void;
  // Backup, Restore & Baseline Controls
  exportDataJSON: () => void;
  importDataJSON: (jsonString: string) => { success: boolean; error?: string };
  resetToDefaults: () => void;
  resetTodayProgressToZero: () => void;
  // Computed metrics
  streakDays: number;
  overallRoadmapProgress: number;
  overallSubjectProgress: number;
  todayPlannedMinutes: number;
  todayCompletedMinutes: number;
  todayTasksSummary: { total: number; completed: number };
  todayPomodoroMinutes: number;
  overallCgpa: number;
  totalXp: number;
  userLevel: number;
}

const STORAGE_KEY = 'bca_career_planner_state_v4_zero_baseline';

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppStateData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.version && parsed.subjects && parsed.tasks) {
          return {
            ...INITIAL_APP_DATA,
            ...parsed,
            semesterGrades: parsed.semesterGrades || INITIAL_APP_DATA.semesterGrades,
            targetCgpa: parsed.targetCgpa ?? INITIAL_APP_DATA.targetCgpa,
            pomodoroSessions: parsed.pomodoroSessions || [],
            questionBankProgress: parsed.questionBankProgress || { masteredIds: [], bookmarkedIds: [] },
          } as AppStateData;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved state, using default zero baseline data', e);
    }
    return INITIAL_APP_DATA;
  });

  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);

  // YouTube Video Player & Floating Picture-in-Picture State
  const [videoState, setVideoState] = useState<ActiveVideoState>({
    videoId: 'kJQP7kiw5Fk', // Default preloaded BCA C++ & DSA Masterclass
    title: 'C++ Complete Course for Beginners to Advanced (BCA Syllabus)',
    channel: 'FreeCodeCamp / University CS',
    category: 'C++ & OOPs',
    isPiP: false,
    isOpen: false,
  });

  const openVideo = (videoId: string, title: string, channel = 'University CS', category = 'Curriculum') => {
    setVideoState({
      videoId,
      title,
      channel,
      category,
      isPiP: false,
      isOpen: true,
    });
  };

  const closeVideo = () => {
    setVideoState((prev) => ({
      ...prev,
      isOpen: false,
      isPiP: false,
      videoId: null,
    }));
  };

  const togglePiP = () => {
    setVideoState((prev) => ({
      ...prev,
      isPiP: !prev.isPiP,
    }));
  };

  const setPiP = (pip: boolean) => {
    setVideoState((prev) => ({
      ...prev,
      isPiP: pip,
    }));
  };

  // Firebase Auth State & Cloud Sync
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
      if (user && !user.isAnonymous) {
        if (user.displayName) {
          setData((prev) => ({
            ...prev,
            profile: {
              ...prev.profile,
              name: prev.profile.name === 'Candidate' || !prev.profile.name ? (user.displayName || 'Candidate') : prev.profile.name,
            },
          }));
        }
        try {
          const cloudProfile = await getUserProfileFromCloud(user.uid);
          if (cloudProfile) {
            setData((prev) => ({
              ...prev,
              profile: { ...prev.profile, ...cloudProfile },
            }));
          } else {
            saveUserProfileToCloud(user.uid, data.profile);
          }
        } catch (e) {
          console.warn('Cloud sync skipped:', e);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Auto-sync updated profile (including LeetCode and GitHub stats) to Firestore
  useEffect(() => {
    if (currentUser && !currentUser.isAnonymous && data.profile) {
      saveUserProfileToCloud(currentUser.uid, data.profile);
    }
  }, [currentUser, data.profile]);

  const signInWithGoogle = async () => {
    try {
      const user = await fbSignInWithGoogle();
      if (user.displayName) {
        setData((prev) => ({
          ...prev,
          profile: { ...prev.profile, name: user.displayName || prev.profile.name },
        }));
      }
    } catch (err) {
      console.error('Google sign in error:', err);
      throw err;
    }
  };

  const signInGuest = async () => {
    try {
      await fbSignInGuest();
    } catch (err) {
      console.error('Guest sign in error:', err);
      throw err;
    }
  };

  const signOutUser = async () => {
    try {
      await fbLogOut();
    } catch (err) {
      console.error('Logout error:', err);
      throw err;
    }
  };

  const updateLeetCodeStats = (stats: Partial<LeetCodeStats>) => {
    setData((prev) => {
      const existing: LeetCodeStats = prev.profile.leetcodeStats || {
        username: prev.profile.leetcodeHandle || '',
        totalSolved: 0,
        easySolved: 0,
        mediumSolved: 0,
        hardSolved: 0,
        streakDays: 0,
      };
      return {
        ...prev,
        profile: {
          ...prev.profile,
          leetcodeHandle: stats.username || prev.profile.leetcodeHandle,
          leetcodeStats: { ...existing, ...stats },
        },
      };
    });
  };

  const updateGitHubStats = (stats: Partial<GitHubStats>) => {
    setData((prev) => {
      const existing: GitHubStats = prev.profile.githubStats || {
        username: prev.profile.githubHandle || '',
        repoCount: 0,
        starCount: 0,
        commitStreakDays: 0,
        topRepoName: '',
        topRepoUrl: '',
        profileUrl: '',
      };
      return {
        ...prev,
        profile: {
          ...prev.profile,
          githubHandle: stats.username || prev.profile.githubHandle,
          githubStats: { ...existing, ...stats },
        },
      };
    });
  };

  const isFirstMount = useRef(true);

  // Sync to localStorage and record mutations with Background Sync Service
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      if (!isFirstMount.current) {
        backgroundSyncService.recordMutation('DATA_STATE_UPDATED', {
          version: data.version,
          timestamp: Date.now(),
        });
      } else {
        isFirstMount.current = false;
      }
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  }, [data]);

  // Listen for background sync reconciliation events from Service Worker
  useEffect(() => {
    const handleReconciledSync = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.version && parsed.subjects) {
            setData((prev) => ({
              ...prev,
              ...parsed,
            }));
          }
        }
      } catch (err) {
        console.warn('Failed to parse reconciled state after background sync', err);
      }
    };

    window.addEventListener('bca-data-synchronized', handleReconciledSync);
    return () => {
      window.removeEventListener('bca-data-synchronized', handleReconciledSync);
    };
  }, []);

  // Synchronize active theme with document attribute & class for High-Contrast Light vs Cyberpunk
  const activeTheme: AppTheme = data.profile.theme === 'light' ? 'light' : 'cyberpunk';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', activeTheme);
    if (activeTheme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  }, [activeTheme]);

  const toggleTheme = () => {
    const nextTheme: AppTheme = activeTheme === 'light' ? 'cyberpunk' : 'light';
    updateProfile({ theme: nextTheme });
  };

  // Profile operations
  const updateProfile = (updates: Partial<UserProfile>) => {
    setData((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...updates },
    }));
  };

  // Planner Task operations
  const addTask = (task: Omit<PlannerTask, 'id'>): string => {
    const id = `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newTask: PlannerTask = { ...task, id };
    setData((prev) => ({
      ...prev,
      tasks: [newTask, ...prev.tasks],
    }));
    return id;
  };

  const updateTask = (id: string, updates: Partial<PlannerTask>) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
  };

  const deleteTask = (id: string) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== id),
    }));
  };

  const toggleTaskComplete = (id: string) => {
    const today = getTodayString(0);
    setData((prev) => {
      let taskSubjectId = '';
      let taskDuration = 30;
      let willBeCompleted = false;

      const newTasks = prev.tasks.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === 'completed' ? 'todo' : 'completed';
          willBeCompleted = nextStatus === 'completed';
          taskSubjectId = t.subjectId;
          taskDuration = t.durationMinutes;
          return {
            ...t,
            status: nextStatus as PlannerTask['status'],
            completedAt: willBeCompleted ? new Date().toISOString() : undefined,
          };
        }
        return t;
      });

      let updatedLogs = [...prev.studyLogs];
      if (willBeCompleted && taskSubjectId) {
        updatedLogs.push({
          id: `log-${Date.now()}`,
          date: today,
          subjectId: taskSubjectId,
          durationMinutes: taskDuration,
          notes: 'Completed scheduled planner session',
        });
      }

      return {
        ...prev,
        tasks: newTasks,
        studyLogs: updatedLogs,
      };
    });
  };

  // Study Logging
  const logStudySession = (subjectId: string, durationMinutes: number, notes?: string) => {
    const today = getTodayString(0);
    const newEntry: StudyLogEntry = {
      id: `log-${Date.now()}`,
      date: today,
      subjectId,
      durationMinutes,
      notes: notes || 'Logged self study session',
    };

    setData((prev) => ({
      ...prev,
      studyLogs: [...prev.studyLogs, newEntry],
      subjects: prev.subjects.map((sub) =>
        sub.id === subjectId ? { ...sub, lastStudied: today } : sub
      ),
    }));
  };

  // Subjects & Lectures
  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setData((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
  };

  const incrementSubjectLecture = (subjectId: string, count: number = 1) => {
    const today = getTodayString(0);
    setData((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) => {
        if (s.id === subjectId) {
          const nextCount = Math.max(0, Math.min(s.totalLectures, s.completedLectures + count));
          const nextStatus =
            nextCount === s.totalLectures
              ? 'mastered'
              : nextCount > 0
              ? 'in_progress'
              : 'needs_revision';
          return {
            ...s,
            completedLectures: nextCount,
            revisionStatus: nextStatus,
            lastStudied: today,
          };
        }
        return s;
      }),
    }));
  };

  const toggleSubjectModule = (subjectId: string, moduleId: string) => {
    setData((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) => {
        if (s.id === subjectId) {
          const updatedModules = s.modules.map((m) => {
            if (m.id === moduleId) {
              return { ...m, completed: !m.completed };
            }
            return m;
          });
          const allCompleted = updatedModules.length > 0 && updatedModules.every((m) => m.completed);
          return {
            ...s,
            modules: updatedModules,
            revisionStatus: allCompleted ? 'mastered' : s.revisionStatus,
          };
        }
        return s;
      }),
    }));
  };

  const addSubjectModule = (subjectId: string, title: string, lectureCount: number) => {
    setData((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) => {
        if (s.id === subjectId) {
          const newModule = {
            id: `m-${Date.now()}`,
            title,
            completed: false,
            lectureCount,
            practiceDone: false,
          };
          return {
            ...s,
            modules: [...s.modules, newModule],
            totalLectures: s.totalLectures + lectureCount,
          };
        }
        return s;
      }),
    }));
  };

  // Roadmap
  const toggleRoadmapMilestone = (semNumber: number, milestoneId: string) => {
    setData((prev) => ({
      ...prev,
      roadmap: prev.roadmap.map((sem) => {
        if (sem.semesterNumber === semNumber) {
          return {
            ...sem,
            milestones: sem.milestones.map((m) =>
              m.id === milestoneId ? { ...m, completed: !m.completed } : m
            ),
          };
        }
        return sem;
      }),
    }));
  };

  const addRoadmapMilestone = (
    semNumber: number,
    milestone: { title: string; type: RoadmapMilestone['type'] }
  ) => {
    setData((prev) => ({
      ...prev,
      roadmap: prev.roadmap.map((sem) => {
        if (sem.semesterNumber === semNumber) {
          const newM: RoadmapMilestone = {
            id: `rm-${Date.now()}`,
            title: milestone.title,
            type: milestone.type,
            completed: false,
          };
          return { ...sem, milestones: [...sem.milestones, newM] };
        }
        return sem;
      }),
    }));
  };

  // Specializations
  const toggleLearningPathStep = (track: 'cyber' | 'aiml', stepId: string) => {
    setData((prev) => {
      const key = track === 'cyber' ? 'cybersecurityPath' : 'aimlPath';
      return {
        ...prev,
        [key]: prev[key].map((step) =>
          step.id === stepId ? { ...step, completed: !step.completed } : step
        ),
      };
    });
  };

  // Projects
  const addProject = (project: Omit<ProjectItem, 'id'>): string => {
    const id = `proj-${Date.now()}`;
    const newProj: ProjectItem = { ...project, id };
    setData((prev) => ({
      ...prev,
      projects: [newProj, ...prev.projects],
    }));
    return id;
  };

  const updateProject = (id: string, updates: Partial<ProjectItem>) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  };

  const deleteProject = (id: string) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  };

  const toggleProjectMilestone = (projectId: string, milestoneId: string) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => {
        if (p.id === projectId) {
          const updatedMs = p.milestones.map((m) =>
            m.id === milestoneId ? { ...m, completed: !m.completed } : m
          );
          const allDone = updatedMs.length > 0 && updatedMs.every((m) => m.completed);
          return {
            ...p,
            milestones: updatedMs,
            status: allDone ? 'completed' : p.status === 'idea' ? 'in_progress' : p.status,
          };
        }
        return p;
      }),
    }));
  };

  // DSA & Aptitude
  const updateDsaTopic = (id: string, updates: Partial<DSATopic>) => {
    setData((prev) => ({
      ...prev,
      dsaTopics: prev.dsaTopics.map((d) => (d.id === id ? { ...d, ...updates } : d)),
    }));
  };

  const updateAptitudeTopic = (id: string, updates: Partial<AptitudeTopic>) => {
    setData((prev) => ({
      ...prev,
      aptitudeTopics: prev.aptitudeTopics.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    }));
  };

  const addApplication = (app: Omit<InternshipApplication, 'id'>) => {
    const id = `app-${Date.now()}`;
    setData((prev) => ({
      ...prev,
      applications: [{ ...app, id }, ...prev.applications],
    }));
  };

  const updateApplication = (id: string, updates: Partial<InternshipApplication>) => {
    setData((prev) => ({
      ...prev,
      applications: prev.applications.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    }));
  };

  const deleteApplication = (id: string) => {
    setData((prev) => ({
      ...prev,
      applications: prev.applications.filter((a) => a.id !== id),
    }));
  };

  const addMockInterview = (mock: Omit<MockInterviewRecord, 'id'>) => {
    const id = `mock-${Date.now()}`;
    setData((prev) => ({
      ...prev,
      mockInterviews: [{ ...mock, id }, ...prev.mockInterviews],
    }));
  };

  const togglePlacementChecklist = (id: string) => {
    setData((prev) => ({
      ...prev,
      placementChecklist: prev.placementChecklist.map((c) =>
        c.id === id ? { ...c, completed: !c.completed } : c
      ),
    }));
  };

  // Pomodoro Focus Logging
  const logPomodoroSession = (session: Omit<PomodoroSession, 'id'>) => {
    const newSession: PomodoroSession = {
      ...session,
      id: `pomo-${Date.now()}`,
    };
    setData((prev) => {
      const updated = {
        ...prev,
        pomodoroSessions: [newSession, ...(prev.pomodoroSessions || [])],
      };
      if (session.mode === 'work' && session.durationMinutes > 0) {
        updated.studyLogs = [
          ...prev.studyLogs,
          {
            id: `log-pomo-${Date.now()}`,
            date: session.date,
            subjectId: session.subjectId || 'sub-cpp-dsa',
            durationMinutes: session.durationMinutes,
            notes: 'Completed Pomodoro Focus Session',
          },
        ];
      }
      return updated;
    });
  };

  // Grades & SGPA/CGPA calculations
  const calculateSgpa = (courses: CourseGrade[]): { sgpa: number; totalCredits: number } => {
    let totalCredits = 0;
    let totalWeightedPoints = 0;
    courses.forEach((c) => {
      totalCredits += c.credits;
      totalWeightedPoints += c.credits * c.gradePoint;
    });
    const sgpa = totalCredits > 0 ? Number((totalWeightedPoints / totalCredits).toFixed(2)) : 0;
    return { sgpa, totalCredits };
  };

  const updateCourseGrade = (semNumber: number, courseId: string, grade: GradeLetter) => {
    setData((prev) => ({
      ...prev,
      semesterGrades: prev.semesterGrades.map((sem) => {
        if (sem.semesterNumber === semNumber) {
          const updatedCourses = sem.courses.map((c) =>
            c.id === courseId
              ? { ...c, grade, gradePoint: GRADE_POINTS[grade] }
              : c
          );
          const { sgpa, totalCredits } = calculateSgpa(updatedCourses);
          return {
            ...sem,
            courses: updatedCourses,
            sgpa,
            totalCredits,
          };
        }
        return sem;
      }),
    }));
  };

  const addCustomCourse = (
    semNumber: number,
    course: { code: string; name: string; credits: number; grade: GradeLetter }
  ) => {
    const id = `crs-${Date.now()}`;
    const newCourse: CourseGrade = {
      id,
      code: course.code,
      name: course.name,
      credits: course.credits,
      grade: course.grade,
      gradePoint: GRADE_POINTS[course.grade],
    };

    setData((prev) => ({
      ...prev,
      semesterGrades: prev.semesterGrades.map((sem) => {
        if (sem.semesterNumber === semNumber) {
          const updatedCourses = [...sem.courses, newCourse];
          const { sgpa, totalCredits } = calculateSgpa(updatedCourses);
          return {
            ...sem,
            courses: updatedCourses,
            sgpa,
            totalCredits,
          };
        }
        return sem;
      }),
    }));
  };

  const deleteCourse = (semNumber: number, courseId: string) => {
    setData((prev) => ({
      ...prev,
      semesterGrades: prev.semesterGrades.map((sem) => {
        if (sem.semesterNumber === semNumber) {
          const updatedCourses = sem.courses.filter((c) => c.id !== courseId);
          const { sgpa, totalCredits } = calculateSgpa(updatedCourses);
          return {
            ...sem,
            courses: updatedCourses,
            sgpa,
            totalCredits,
          };
        }
        return sem;
      }),
    }));
  };

  const updateTargetCgpa = (cgpa: number) => {
    setData((prev) => ({
      ...prev,
      targetCgpa: cgpa,
    }));
  };

  const toggleMasteredQuestion = (id: string) => {
    setData((prev) => {
      const cur = prev.questionBankProgress?.masteredIds || [];
      const isMastered = cur.includes(id);
      const updated = isMastered ? cur.filter((qId) => qId !== id) : [...cur, id];
      return {
        ...prev,
        questionBankProgress: {
          masteredIds: updated,
          bookmarkedIds: prev.questionBankProgress?.bookmarkedIds || [],
        },
      };
    });
  };

  const toggleBookmarkedQuestion = (id: string) => {
    setData((prev) => {
      const cur = prev.questionBankProgress?.bookmarkedIds || [];
      const isBookmarked = cur.includes(id);
      const updated = isBookmarked ? cur.filter((qId) => qId !== id) : [...cur, id];
      return {
        ...prev,
        questionBankProgress: {
          masteredIds: prev.questionBankProgress?.masteredIds || [],
          bookmarkedIds: updated,
        },
      };
    });
  };

  // Export JSON backup
  const exportDataJSON = () => {
    try {
      const backupPayload = {
        ...data,
        exportedAt: new Date().toISOString(),
        backupSummary: {
          appName: 'BCA Career Planner',
          studentName: data.profile.name,
          currentSemester: data.profile.semester,
          totalTasks: data.tasks.length,
          totalStudyLogs: data.studyLogs.length,
          totalSubjects: data.subjects.length,
          totalPomodoroSessions: (data.pomodoroSessions || []).length,
          totalMasteredQuestions: (data.questionBankProgress?.masteredIds || []).length,
          overallCgpa: overallCgpa,
        },
      };
      const jsonStr = JSON.stringify(backupPayload, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const safeName = (data.profile.name || 'student').toLowerCase().replace(/\s+/g, '_');
      a.download = `bca_backup_${safeName}_${getTodayString(0)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed', err);
    }
  };

  // Import JSON backup
  const importDataJSON = (jsonString: string): { success: boolean; error?: string } => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.profile || !Array.isArray(parsed.subjects) || !Array.isArray(parsed.tasks)) {
        return { success: false, error: 'Invalid backup structure. Required fields missing.' };
      }
      setData(parsed as AppStateData);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'JSON parsing error.' };
    }
  };

  // Reset all to pristine defaults
  const resetToDefaults = () => {
    localStorage.removeItem(STORAGE_KEY);
    setData(INITIAL_APP_DATA);
  };

  // Reset today's progress to 0 (so users can immediately experience daily gradual increase)
  const resetTodayProgressToZero = () => {
    const today = getTodayString(0);
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.date === today ? { ...t, status: 'todo' as const, completedAt: undefined } : t)),
      studyLogs: prev.studyLogs.filter((log) => log.date !== today),
      pomodoroSessions: (prev.pomodoroSessions || []).filter((s) => s.date !== today),
      subjects: prev.subjects.map((sub) => ({ ...sub, completedLectures: 0 })),
    }));
  };

  // Computed Metrics
  const streakDays = useMemo(() => {
    const studyDates = new Set(data.studyLogs.map((log) => log.date));
    let streak = 0;
    const checkDate = new Date();

    const todayStr = checkDate.toISOString().split('T')[0];
    if (studyDates.has(todayStr)) {
      streak = 1;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (studyDates.has(dateStr)) {
        streak += 1;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  }, [data.studyLogs]);

  const overallRoadmapProgress = useMemo(() => {
    let total = 0;
    let completed = 0;
    data.roadmap.forEach((sem) => {
      sem.milestones.forEach((m) => {
        total += 1;
        if (m.completed) completed += 1;
      });
    });
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }, [data.roadmap]);

  const overallSubjectProgress = useMemo(() => {
    let totalLectures = 0;
    let completedLectures = 0;
    data.subjects.forEach((sub) => {
      totalLectures += sub.totalLectures;
      completedLectures += sub.completedLectures;
    });
    return totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0;
  }, [data.subjects]);

  const todayTasks = useMemo(() => {
    const today = getTodayString(0);
    return data.tasks.filter((t) => t.date === today);
  }, [data.tasks]);

  const todayPlannedMinutes = useMemo(() => {
    return todayTasks.reduce((acc, t) => acc + t.durationMinutes, 0);
  }, [todayTasks]);

  const todayCompletedMinutes = useMemo(() => {
    const today = getTodayString(0);
    const loggedMinutes = data.studyLogs
      .filter((l) => l.date === today)
      .reduce((acc, l) => acc + l.durationMinutes, 0);

    const taskMinutes = todayTasks
      .filter((t) => t.status === 'completed')
      .reduce((acc, t) => acc + t.durationMinutes, 0);

    return Math.max(loggedMinutes, taskMinutes);
  }, [todayTasks, data.studyLogs]);

  const todayTasksSummary = useMemo(() => {
    const total = todayTasks.length;
    const completed = todayTasks.filter((t) => t.status === 'completed').length;
    return { total, completed };
  }, [todayTasks]);

  const todayPomodoroMinutes = useMemo(() => {
    const today = getTodayString(0);
    return (data.pomodoroSessions || [])
      .filter((s) => s.date === today && s.mode === 'work')
      .reduce((sum, s) => sum + s.durationMinutes, 0);
  }, [data.pomodoroSessions]);

  const overallCgpa = useMemo(() => {
    let totalCredits = 0;
    let totalWeightedPoints = 0;
    (data.semesterGrades || []).forEach((sem) => {
      if (sem.sgpa > 0) {
        totalCredits += sem.totalCredits;
        totalWeightedPoints += sem.totalCredits * sem.sgpa;
      }
    });
    return totalCredits > 0 ? Number((totalWeightedPoints / totalCredits).toFixed(2)) : 0;
  }, [data.semesterGrades]);

  const totalXp = useMemo(() => {
    const completedTasksCount = data.tasks.filter((t) => t.status === 'completed').length;
    const completedLecturesCount = data.subjects.reduce((sum, s) => sum + s.completedLectures, 0);
    const dsaSolvedCount = data.dsaTopics.reduce(
      (sum, t) => sum + t.solvedEasy + t.solvedMedium + t.solvedHard,
      0
    );
    const aptitudeSolvedCount = data.aptitudeTopics.reduce((sum, t) => sum + t.solved, 0);
    const completedMilestonesCount = data.roadmap.reduce(
      (sum, sem) => sum + sem.milestones.filter((m) => m.completed).length,
      0
    );

    return (
      completedTasksCount * 50 +
      completedLecturesCount * 40 +
      dsaSolvedCount * 30 +
      aptitudeSolvedCount * 20 +
      completedMilestonesCount * 60 +
      streakDays * 100
    );
  }, [data, streakDays]);

  const userLevel = useMemo(() => {
    return Math.floor(totalXp / 300) + 1;
  }, [totalXp]);

  const value = {
    data,
    activeTab,
    setActiveTab,
    selectedSubjectId,
    setSelectedSubjectId,
    updateProfile,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    logStudySession,
    updateSubject,
    incrementSubjectLecture,
    toggleSubjectModule,
    addSubjectModule,
    toggleRoadmapMilestone,
    addRoadmapMilestone,
    toggleLearningPathStep,
    addProject,
    updateProject,
    deleteProject,
    toggleProjectMilestone,
    updateDsaTopic,
    updateAptitudeTopic,
    addApplication,
    updateApplication,
    deleteApplication,
    addMockInterview,
    togglePlacementChecklist,
    logPomodoroSession,
    updateCourseGrade,
    addCustomCourse,
    deleteCourse,
    updateTargetCgpa,
    toggleMasteredQuestion,
    toggleBookmarkedQuestion,
    exportDataJSON,
    importDataJSON,
    resetToDefaults,
    resetTodayProgressToZero,
    streakDays,
    overallRoadmapProgress,
    overallSubjectProgress,
    todayPlannedMinutes,
    todayCompletedMinutes,
    todayTasksSummary,
    todayPomodoroMinutes,
    overallCgpa,
    totalXp,
    userLevel,
    theme: activeTheme,
    toggleTheme,
    // Firebase Authentication
    currentUser,
    authLoading,
    signInWithGoogle,
    signInGuest,
    signOutUser,
    // Developer Profiles
    updateLeetCodeStats,
    updateGitHubStats,
    // YouTube Video Player & Floating PiP
    videoState,
    openVideo,
    closeVideo,
    togglePiP,
    setPiP,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
