# Production Release: Authentication, Video Autoplay Fix & LeetCode/GitHub Integration

A pre-release update introducing Firebase Authentication with Google Sign-In and guest mode, fixing video playback on the Video Hub to require explicit user play instead of autoplaying, and embedding LeetCode and GitHub developer profile and streak trackers into the Placement Hub and Student Dossier.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following product decisions were confirmed during the interactive clarification:

- **Confirmed Decision 1 (Authentication Mode)**: Full Firebase Authentication with Google Sign-In (`signInWithPopup`), seamless guest/demo mode fallback, persistent cloud profile linking, and real-time auth state synchronization.
- **Confirmed Decision 2 (Video Player Autoplay)**: Video Hub player loads in a quiet, non-autoplay state showing video thumbnail, duration, syllabus metadata, and a high-visibility "Play Lecture" button to prevent disruptive auto-streaming.
- **Confirmed Decision 3 (LeetCode & GitHub Integration)**: A dedicated **Developer Profiles & Placement Showcase** inside both the **Placement Preparation View** and **Student Profile / Resume Dossier**, tracking LeetCode problems (Easy/Medium/Hard, contest rating, streak) and GitHub statistics (repos, stars, live demo links).

---

### 1. Overview & Core Concept

1. **Authentication & Google Sign-In**:
   - Provide frictionless 1-click Google Sign-In via Firebase Auth.
   - Support instant guest mode for quick evaluation without forcing login walls.
   - Display active user avatar, email, and sign-out controls in the top header and profile settings.
   - Synchronize student bookmarks, study velocity, and task checklists with authenticated user sessions.

2. **Video Hub Autoplay Remediation**:
   - Eliminate involuntary video playback and audio triggers when switching to the Video Hub.
   - Implement an interactive theater stage with video thumbnail, syllabus details, and an intentional "Click to Play" action.
   - Ensure PiP float mode only activates when a video is actively being watched.

3. **LeetCode & GitHub Developer Profile Tracker**:
   - In **Placement & DSA View**: Add a dedicated "Developer Profiles" tab/section displaying LeetCode problem distribution (Easy, Medium, Hard), contest rating, daily streak, and GitHub repositories with direct links.
   - In **Resume Dossier & Profile Settings**: Allow students to configure their LeetCode and GitHub handles, with live sync to the downloadable 1-page ATS resume.

---

### 2. User Experience & Visual Design

#### Key User Flows:
1. *Authentication & Sign-In Flow*:
   - User clicks **"Sign In with Google"** in the top header or settings drawer.
   - Standard Google OAuth popup authenticates the user.
   - Header instantly transitions to the student's Google profile picture, name, and authenticated status pill.
   - User can seamlessly sign out or continue as guest at any time.

2. *Video Lectures Flow (No Autoplay)*:
   - User navigates to the **Video Lectures** tab.
   - Theater displays the selected lecture in a clean, quiet poster state with lecture duration, syllabus semester, and channel name.
   - Video only streams when the user presses **"Play Lecture"**.

3. *LeetCode & GitHub Tracker Flow*:
   - User opens the **Placement** tab and selects **"LeetCode & GitHub Profiles"**.
   - User views interactive metric cards: LeetCode problems solved (with visual breakdown bar), contest rating, and GitHub showcase.
   - User can update their handles and problem counts directly in-place or via Profile Settings.

---

### 3. Technical Architecture & File Changes

```
┌────────────────────────────────────────────────────────────────────────┐
│                              AppContext                                │
│   • currentUser (Firebase User | null)                                 │
│   • isGuest (boolean)                                                  │
│   • signInWithGoogle(), signOutUser(), continueAsGuest()               │
│   • leetcodeProfile, githubProfile state                               │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         ▼                          ▼                          ▼
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│  AuthHeaderWidget│       │ VideoLecturesView│       │  PlacementView   │
│ • Google Avatar  │       │ • Thumbnail Card │       │ • LeetCode Stats │
│ • Sign In / Out  │       │ • Click-to-Play  │       │ • GitHub Repos   │
│ • Guest toggle   │       │ • No Autoplay    │       │ • Streak Counter │
└──────────────────┘       └──────────────────┘       └──────────────────┘
```

#### Files to Create / Modify:
1. `src/services/firebase.ts`: Initialize Firebase App, Auth instance, and Google Auth Provider with guest fallback.
2. `src/context/AppContext.tsx`: Add Firebase Auth listener (`onAuthStateChanged`), user profile state, and LeetCode/GitHub profile fields.
3. `src/components/common/Header.tsx`: Integrate Google Sign-In button, user avatar chip, and dropdown menu.
4. `src/components/video/VideoLecturesView.tsx`: Replace `autoplay=1` with an interactive poster preview and intentional play trigger.
5. `src/components/placement/PlacementView.tsx`: Add dedicated LeetCode & GitHub developer profile card section with stats and repository showcase.
6. `src/components/profile/ProfileSettingsModal.tsx`: Add LeetCode and GitHub handle inputs with instant preview.
7. `src/components/credentials/ResumeDossierModal.tsx`: Display connected LeetCode and GitHub links on the ATS 1-page resume.

---

### 4. Implementation Steps & Verification

1. **Firebase Setup**: Show Firebase setup UI if not already provisioned, install dependencies, and configure client auth service.
2. **Video Autoplay Fix**: Update `VideoLecturesView.tsx` with a poster card and explicit play state.
3. **Developer Profiles**: Enhance `types/index.ts`, `PlacementView.tsx`, and `ResumeDossierModal.tsx` with LeetCode and GitHub tracking.
4. **Build Verification**: Run `compile_applet` and `lint_applet` to confirm 100% clean compilation.
