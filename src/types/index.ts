export type SemesterNumber = 1 | 2 | 3 | 4 | 5 | 6;

export type SpecializationTrack = 'swe' | 'aiml' | 'cyber' | 'fullstack';

export type AppTheme = 'cyberpunk' | 'light';

export interface LeetCodeStats {
  username: string;
  ranking?: number;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  streakDays: number;
  contestRating?: number;
}

export interface GitHubStats {
  username: string;
  repoCount: number;
  starCount: number;
  commitStreakDays: number;
  topRepoName: string;
  topRepoUrl: string;
  profileUrl: string;
}

export interface UserProfile {
  name: string;
  semester: SemesterNumber;
  college: string;
  targetRole: string;
  dailyStudyTargetHours: number;
  weeklyStudyTargetHours: number;
  primaryTrack: SpecializationTrack;
  onboardingCompleted: boolean;
  theme: AppTheme;
  reducedMotion: boolean;
  // LeetCode & GitHub integrations
  leetcodeHandle?: string;
  leetcodeStats?: LeetCodeStats;
  githubHandle?: string;
  githubStats?: GitHubStats;
}

export interface PlannerTask {
  id: string;
  title: string;
  subjectId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  durationMinutes: number;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'completed' | 'rescheduled' | 'skipped';
  notes: string;
  completedAt?: string;
}

export interface SubjectModule {
  id: string;
  title: string;
  completed: boolean;
  lectureCount: number;
  practiceDone: boolean;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  semester: SemesterNumber;
  category: 'core' | 'math' | 'programming' | 'specialization' | 'soft_skills';
  totalLectures: number;
  completedLectures: number;
  revisionStatus: 'needs_revision' | 'in_progress' | 'mastered';
  notes: string;
  lastStudied?: string;
  modules: SubjectModule[];
}

export interface RoadmapMilestone {
  id: string;
  title: string;
  type: 'academic' | 'technical' | 'project' | 'placement' | 'revision';
  completed: boolean;
  notes?: string;
}

export interface RoadmapSemester {
  semesterNumber: SemesterNumber;
  academicYear: 1 | 2 | 3;
  title: string;
  focus: string;
  milestones: RoadmapMilestone[];
}

export interface LearningPathStep {
  id: string;
  phase: string;
  title: string;
  description: string;
  prerequisites: string[];
  topics: string[];
  practicalExercise: string;
  completed: boolean;
  notes?: string;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  status: 'idea' | 'planned' | 'in_progress' | 'completed' | 'archived';
  techStack: string[];
  milestones: ProjectMilestone[];
  startDate: string;
  targetDate: string;
  githubUrl: string;
  demoUrl: string;
  notes: string;
}

export interface DSATopic {
  id: string;
  name: string;
  totalQuestions: number;
  solvedEasy: number;
  solvedMedium: number;
  solvedHard: number;
  notes: string;
}

export interface AptitudeTopic {
  id: string;
  name: string;
  solved: number;
  target: number;
}

export interface InternshipApplication {
  id: string;
  company: string;
  role: string;
  status: 'applied' | 'oa_cleared' | 'interview' | 'offer' | 'rejected';
  appliedDate: string;
  packageLPA?: string;
  link?: string;
  notes?: string;
}

export interface MockInterviewRecord {
  id: string;
  date: string;
  role: string;
  companyType: string;
  scoreOutOf10: number;
  strengths: string;
  areasToImprove: string;
  questions: string;
}

export interface PlacementChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  category: 'resume' | 'portfolio' | 'core_cs';
}

export interface StudyLogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  subjectId: string;
  durationMinutes: number;
  notes: string;
}

export type GradeLetter = 'O' | 'A+' | 'A' | 'B+' | 'B' | 'C' | 'P' | 'F';

export interface CourseGrade {
  id: string;
  code: string;
  name: string;
  credits: number;
  grade: GradeLetter;
  gradePoint: number;
}

export interface SemesterGradeRecord {
  semesterNumber: SemesterNumber;
  courses: CourseGrade[];
  sgpa: number;
  totalCredits: number;
}

export interface PomodoroSession {
  id: string;
  date: string; // YYYY-MM-DD
  durationMinutes: number;
  mode: 'work' | 'short_break' | 'long_break';
  subjectId?: string;
  completedAt: string;
}

export type QuestionDomain = 'dsa' | 'core_cs' | 'web_dev' | 'aptitude' | 'bca_exams';

export type QuestionDifficulty = 'easy' | 'medium' | 'hard' | 'campus_drive';

export interface PracticeQuestion {
  id: string;
  domain: QuestionDomain;
  subtopic: string;
  difficulty: QuestionDifficulty;
  title: string;
  statement: string;
  codeSnippet?: string;
  solutionSteps: string[];
  finalAnswer: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  tags: string[];
}

export interface QuestionBankProgress {
  masteredIds: string[];
  bookmarkedIds: string[];
}

export interface WhiteboardStroke {
  id: string;
  tool: 'pen' | 'highlighter' | 'eraser' | 'rect' | 'arrow' | 'text';
  points: { x: number; y: number }[];
  color: string;
  width: number;
  text?: string;
}

export interface RoomParticipant {
  id: string;
  name: string;
  avatarColor: string;
  isHost: boolean;
  status: 'focusing' | 'discussing' | 'taking_break';
  streak: number;
}

export interface RoomMessage {
  id: string;
  senderName: string;
  senderColor: string;
  text: string;
  timestamp: string;
  reactions?: { emoji: string; count: number }[];
}

export interface StudyRoom {
  id: string;
  name: string;
  track: string;
  topic: string;
  hostName: string;
  activeCount: number;
  participants: RoomParticipant[];
  pomodoroSprint: {
    active: boolean;
    minutesRemaining: number;
    totalMinutes: number;
    isBreak: boolean;
  };
  isLocked: boolean;
  codePad: string;
  messages: RoomMessage[];
  strokes: WhiteboardStroke[];
}

export interface DomainBadge {
  id: string;
  title: string;
  subtitle: string;
  category: 'dsa' | 'web' | 'aiml' | 'cloud';
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  criteria: string;
  progressPercent: number;
  verificationHash: string;
}

export interface AppStateData {
  version: string;
  profile: UserProfile;
  tasks: PlannerTask[];
  subjects: Subject[];
  roadmap: RoadmapSemester[];
  cybersecurityPath: LearningPathStep[];
  aimlPath: LearningPathStep[];
  projects: ProjectItem[];
  dsaTopics: DSATopic[];
  aptitudeTopics: AptitudeTopic[];
  applications: InternshipApplication[];
  mockInterviews: MockInterviewRecord[];
  placementChecklist: PlacementChecklistItem[];
  studyLogs: StudyLogEntry[];
  semesterGrades: SemesterGradeRecord[];
  targetCgpa: number;
  pomodoroSessions: PomodoroSession[];
  questionBankProgress?: QuestionBankProgress;
  studyRooms?: StudyRoom[];
  unlockedBadgeIds?: string[];
}


