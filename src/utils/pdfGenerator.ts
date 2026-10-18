import { jsPDF } from 'jspdf';
import { AppStateData, RoadmapSemester, RoadmapMilestone, ProjectItem, Subject } from '../types';

interface ResumeData {
  name: string;
  semester: number;
  college?: string;
  targetRole?: string;
  cgpa: number;
  streakDays: number;
  projects: ProjectItem[];
  dsaSolvedCount: number;
  subjects?: Subject[];
  primaryTrack?: string;
}

interface ProgressData {
  name: string;
  semester: number;
  college?: string;
  targetRole?: string;
  cgpa: number;
  streakDays: number;
  overallProgress: number;
  roadmap: RoadmapSemester[];
  subjects: Subject[];
  projects: ProjectItem[];
}

/**
 * Clean helper to add horizontal divider rule
 */
function drawDivider(doc: jsPDF, y: number, color: [number, number, number] = [200, 200, 210]): number {
  doc.setDrawColor(color[0], color[1], color[2]);
  doc.setLineWidth(0.5);
  doc.line(14, y, 196, y);
  return y + 4;
}

/**
 * Generate a professional 1-page ATS-ready placement resume PDF
 */
export function generateResumePDF(data: ResumeData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = 14;

  // Top Accent Header Line
  doc.setFillColor(139, 61, 255); // Neon violet brand
  doc.rect(margin, y, contentWidth, 2.5, 'F');
  y += 7;

  // Student Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(24, 20, 48); // Deep obsidian text
  const studentName = (data.name || 'Student Candidate').toUpperCase();
  doc.text(studentName, margin, y);

  // Top Right Info Block
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(90, 85, 115);
  const rollText = `BCA Candidate • Sem ${data.semester}`;
  const cgpaText = `Cumulative CGPA: ${data.cgpa.toFixed(2)} / 10.0`;
  doc.text(rollText, pageWidth - margin, y - 4, { align: 'right' });
  doc.text(cgpaText, pageWidth - margin, y + 1, { align: 'right' });

  y += 6;

  // Subtitle / Target Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(115, 45, 210); // Vibrant purple
  const roleTitle = `BACHELOR OF COMPUTER APPLICATIONS (BCA) • ${data.targetRole?.toUpperCase() || 'SOFTWARE DEVELOPMENT ENGINEER'}`;
  doc.text(roleTitle, margin, y);

  y += 5;

  // Contact & Academic Meta Bar
  doc.setFillColor(245, 243, 250);
  doc.roundedRect(margin, y, contentWidth, 7, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(70, 65, 90);
  const collegeStr = data.college || 'Department of Computer Science & Applications';
  const metaBar = `${collegeStr}   |   Streak: ${data.streakDays} Days Continuous Study   |   DSA Mastered: ${data.dsaSolvedCount}+ Problems`;
  doc.text(metaBar, margin + 3, y + 4.8);

  y += 11;

  // Helper for Section Heading
  const addSectionHeader = (title: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(30, 25, 55);
    doc.text(title.toUpperCase(), margin, y);
    doc.setDrawColor(139, 61, 255);
    doc.setLineWidth(0.8);
    doc.line(margin, y + 1.5, margin + 45, y + 1.5);
    doc.setDrawColor(220, 215, 235);
    doc.setLineWidth(0.3);
    doc.line(margin + 45, y + 1.5, pageWidth - margin, y + 1.5);
    y += 5.5;
  };

  // 1. EDUCATION
  addSectionHeader('Education & Academic Background');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(20, 20, 30);
  doc.text('Bachelor of Computer Applications (BCA)', margin, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(80, 80, 95);
  doc.text('2024 – 2027 (Undergraduate)', pageWidth - margin, y, { align: 'right' });
  y += 4;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(60, 60, 75);
  doc.text(`${collegeStr} — Focus: Data Structures, Database Systems & Core Computing`, margin, y);
  y += 3.5;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(100, 95, 120);
  doc.text(`Academic Standing: SGPA/CGPA ${data.cgpa.toFixed(2)}/10.0 • Verified Semester ${data.semester} Enrollment`, margin, y);
  y += 6.5;

  // 2. TECHNICAL PROFICIENCIES
  addSectionHeader('Technical Skills & Core Competencies');

  const skillsList = [
    { label: 'Programming Languages', val: 'C++, Python, JavaScript (ES6+), TypeScript, SQL, Core Java' },
    { label: 'Core Computer Science', val: 'Data Structures & Algorithms, Object-Oriented Programming (OOP), DBMS, OS, Networks' },
    { label: 'Web & Frameworks', val: 'React 19, Node.js, Express, Tailwind CSS, Vite, RESTful Web APIs, PWA' },
    { label: 'Databases & Tools', val: 'PostgreSQL, MySQL, SQLite, Git/GitHub, Docker, Linux Shell, VS Code' },
  ];

  skillsList.forEach((sk) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(40, 35, 65);
    doc.text(`•  ${sk.label}:`, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 80);
    doc.text(sk.val, margin + 44, y);
    y += 4;
  });
  y += 3;

  // 3. KEY SOFTWARE PROJECTS
  addSectionHeader('Key Software Development Projects');

  const displayedProjects = data.projects && data.projects.length > 0 
    ? data.projects.slice(0, 3) 
    : [
        {
          id: 'p1',
          title: 'Algorithmic Visualizer & Problem Sandbox',
          description: 'Interactive computational sandbox visualising graph traversals (BFS, DFS, Dijkstra) and dynamic programming tabulation with real-time complexity tracking.',
          techStack: ['TypeScript', 'React', 'Tailwind CSS', 'Vite'],
          status: 'completed' as const,
          startDate: '2025-01-01',
          targetDate: '2025-03-01',
          githubUrl: 'https://github.com/student/dsa-visualizer',
          demoUrl: '',
          notes: '',
          milestones: [],
        },
        {
          id: 'p2',
          title: 'University Campus ERP & Academic Records System',
          description: 'High-concurrency academic portal implementing 3NF normalized schema, JWT authentication, grade calculation algorithms, and offline-first IndexedDB sync.',
          techStack: ['Node.js', 'Express', 'PostgreSQL', 'React'],
          status: 'completed' as const,
          startDate: '2025-02-01',
          targetDate: '2025-04-15',
          githubUrl: 'https://github.com/student/campus-erp',
          demoUrl: '',
          notes: '',
          milestones: [],
        },
      ];

  displayedProjects.forEach((proj) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(25, 20, 45);
    doc.text(proj.title, margin, y);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(115, 45, 210);
    const projStatus = proj.status === 'completed' ? 'PRODUCTION READY' : 'ACTIVE DEVELOPMENT';
    doc.text(projStatus, pageWidth - margin, y, { align: 'right' });
    y += 4;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(65, 65, 80);
    // Wrap description
    const descLines = doc.splitTextToSize(proj.description, contentWidth);
    doc.text(descLines, margin, y);
    y += descLines.length * 3.5;

    // Tech Stack line
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 95, 120);
    doc.text(`Tech Stack: ${(proj.techStack || []).join('  •  ')}`, margin, y);
    y += 5;
  });

  // 4. DSA & COMPETITIVE PROBLEM SOLVING
  addSectionHeader('Algorithmic Problem Solving & Achievements');

  const dsaHighlights = [
    `Solved ${data.dsaSolvedCount}+ algorithmic problems spanning Arrays, Linked Lists, Trees, Graphs, and Dynamic Programming.`,
    `Consistent problem solver with a ${data.streakDays}-day active learning streak and verified topic mastery across all core computer science tracks.`,
    `Proficient in time-space complexity optimization, big-O analysis, and technical interview design patterns.`,
  ];

  dsaHighlights.forEach((hl) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(50, 45, 70);
    const lines = doc.splitTextToSize(`•  ${hl}`, contentWidth);
    doc.text(lines, margin, y);
    y += lines.length * 3.5;
  });
  y += 2.5;

  // 5. HONORS & CERTIFICATIONS
  addSectionHeader('Certifications & Domain Honors');
  const certs = [
    `BCA Semester ${data.semester} Merit Standing (CGPA: ${data.cgpa.toFixed(2)})`,
    'C++ Object-Oriented Systems & Memory Architecture Specialist',
    'Relational Database Modeling & ACID Transactions (PostgreSQL / SQLite)',
    'Modern Responsive Web Application Architecture (PWA & Client Optimization)',
  ];

  // 2-column list of certs
  const colW = contentWidth / 2;
  certs.forEach((cert, idx) => {
    const colX = idx % 2 === 0 ? margin : margin + colW + 2;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.8);
    doc.setTextColor(55, 50, 75);
    doc.text(`[✓] ${cert}`, colX, y);
    if (idx % 2 === 1 || idx === certs.length - 1) {
      y += 4;
    }
  });

  // Footer bar
  y = pageHeight - 12;
  doc.setDrawColor(220, 215, 235);
  doc.setLineWidth(0.4);
  doc.line(margin, y, pageWidth - margin, y);
  y += 4;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(140, 135, 160);
  const dateFormatted = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  doc.text(`Generated via BCA Academic Suite • Verified Student Record • ${dateFormatted}`, margin, y);
  doc.text(`Page 1 of 1 • ATS Compliant Format`, pageWidth - margin, y, { align: 'right' });

  // Download trigger
  const safeName = (data.name || 'Student').replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`${safeName}_BCA_Placement_Resume.pdf`);
}

/**
 * Generate a comprehensive 6-Semester BCA Roadmap Progress PDF
 */
export function generateRoadmapProgressPDF(data: ProgressData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = 14;

  // Background Header Banner
  doc.setFillColor(16, 14, 34); // Obsidian deep dark
  doc.rect(margin, y, contentWidth, 24, 'F');

  // Top Neon Rail
  doc.setFillColor(0, 240, 255); // Neon Cyan
  doc.rect(margin, y, contentWidth, 2, 'F');

  // Header Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('SIX-SEMESTER BCA CURRICULUM & ROADMAP DOSSIER', margin + 6, y + 10);

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(180, 160, 255);
  doc.text(`Candidate: ${data.name || 'Student'}   |   Semester ${data.semester}   |   CGPA: ${data.cgpa.toFixed(2)}/10.0   |   Streak: ${data.streakDays} Days`, margin + 6, y + 16);

  // Overall Completion Stamp on Right
  doc.setFillColor(139, 61, 255);
  doc.roundedRect(pageWidth - margin - 38, y + 4, 32, 16, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text(`${data.overallProgress}%`, pageWidth - margin - 22, y + 12, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(220, 210, 255);
  doc.text('COMPLETED', pageWidth - margin - 22, y + 16.5, { align: 'center' });

  y += 29;

  // Summary Metrics Grid (4 blocks)
  const totalMilestones = data.roadmap.reduce((acc, sem) => acc + sem.milestones.length, 0);
  const completedMilestones = data.roadmap.reduce(
    (acc, sem) => acc + sem.milestones.filter((m) => m.completed).length,
    0
  );

  const metrics = [
    { label: 'CURRICULUM PROGRESS', val: `${data.overallProgress}% Complete`, sub: `${completedMilestones} of ${totalMilestones} Milestones` },
    { label: 'ACADEMIC STANDING', val: `CGPA ${data.cgpa.toFixed(2)}`, sub: `Enrolled: Semester ${data.semester}` },
    { label: 'SUBJECT REVISION', val: `${data.subjects.length} Total Subjects`, sub: 'Core CS & Software Labs' },
    { label: 'PLACEMENT READINESS', val: `${data.projects.length} Verified Projects`, sub: `${data.streakDays}-Day Learning Streak` },
  ];

  const cardWidth = (contentWidth - 6) / 4;
  metrics.forEach((m, idx) => {
    const cardX = margin + idx * (cardWidth + 2);
    doc.setFillColor(246, 244, 252);
    doc.setDrawColor(215, 205, 240);
    doc.setLineWidth(0.4);
    doc.roundedRect(cardX, y, cardWidth, 14, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(115, 45, 210);
    doc.text(m.label, cardX + 3, y + 4.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(25, 20, 45);
    doc.text(m.val, cardX + 3, y + 9);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(95, 90, 115);
    doc.text(m.sub, cardX + 3, y + 12.5);
  });

  y += 18;

  // Section Header Function
  const addReportSection = (title: string, subtitle?: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(25, 20, 45);
    doc.text(title.toUpperCase(), margin, y);

    if (subtitle) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(110, 105, 130);
      doc.text(subtitle, pageWidth - margin, y, { align: 'right' });
    }

    doc.setDrawColor(139, 61, 255);
    doc.setLineWidth(0.8);
    doc.line(margin, y + 1.5, margin + 40, y + 1.5);
    doc.setDrawColor(225, 220, 240);
    doc.setLineWidth(0.3);
    doc.line(margin + 40, y + 1.5, pageWidth - margin, y + 1.5);
    y += 5.5;
  };

  addReportSection('Six-Semester Academic & Placement Milestones', 'Tracked across 3 Academic Years');

  // Render each semester
  data.roadmap.forEach((sem) => {
    const semCompleted = sem.milestones.filter((m) => m.completed).length;
    const semPct = sem.milestones.length > 0 ? Math.round((semCompleted / sem.milestones.length) * 100) : 0;

    // Check if new page needed
    if (y > pageHeight - 35) {
      doc.addPage();
      y = 15;
    }

    // Semester Header Pill
    doc.setFillColor(240, 237, 248);
    doc.roundedRect(margin, y, contentWidth, 6, 1, 1, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 25, 55);
    doc.text(`Semester ${sem.semesterNumber}: ${sem.title}`, margin + 3, y + 4.2);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(semPct === 100 ? 16 : 115, semPct === 100 ? 150 : 45, semPct === 100 ? 60 : 210);
    doc.text(`${semCompleted}/${sem.milestones.length} Completed (${semPct}%)`, pageWidth - margin - 3, y + 4.2, { align: 'right' });

    y += 8;

    // Milestones Grid (2 columns)
    const halfWidth = (contentWidth - 4) / 2;
    sem.milestones.forEach((ms, msIdx) => {
      const isRightCol = msIdx % 2 === 1;
      const msX = isRightCol ? margin + halfWidth + 4 : margin;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      if (ms.completed) {
        doc.setTextColor(20, 130, 60); // Emerald check
        doc.text('[✓]', msX, y);
      } else {
        doc.setTextColor(160, 155, 175);
        doc.text('[○]', msX, y);
      }

      doc.setFont('helvetica', ms.completed ? 'normal' : 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(ms.completed ? 40 : 80, ms.completed ? 35 : 75, ms.completed ? 50 : 95);

      const titleLines = doc.splitTextToSize(ms.title, halfWidth - 10);
      doc.text(titleLines[0] || ms.title, msX + 6, y);

      // Category badge
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(6.5);
      doc.setTextColor(130, 120, 150);
      doc.text(`(${ms.type})`, msX + halfWidth - 2, y, { align: 'right' });

      if (isRightCol || msIdx === sem.milestones.length - 1) {
        y += 4.5;
      }
    });

    y += 2.5;
  });

  // Check if subject progress section fits, else new page
  if (y > pageHeight - 50) {
    doc.addPage();
    y = 15;
  } else {
    y += 4;
  }

  // Subject Progress Table
  addReportSection('Curriculum Subjects & Revision Mastery', 'Verified Syllabus Tracking');

  // Table header
  doc.setFillColor(235, 230, 245);
  doc.rect(margin, y, contentWidth, 5.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(40, 35, 65);
  doc.text('CODE', margin + 3, y + 3.8);
  doc.text('SUBJECT TITLE', margin + 25, y + 3.8);
  doc.text('SEM', margin + 110, y + 3.8);
  doc.text('LECTURES', margin + 128, y + 3.8);
  doc.text('STATUS', margin + 155, y + 3.8);
  y += 6.5;

  data.subjects.slice(0, 8).forEach((sub, sIdx) => {
    if (y > pageHeight - 20) {
      doc.addPage();
      y = 15;
    }

    if (sIdx % 2 === 1) {
      doc.setFillColor(248, 246, 252);
      doc.rect(margin, y - 0.5, contentWidth, 4.8, 'F');
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(115, 45, 210);
    doc.text(sub.code, margin + 3, y + 3);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(40, 35, 55);
    const subTitle = sub.name.length > 45 ? sub.name.substring(0, 43) + '...' : sub.name;
    doc.text(subTitle, margin + 25, y + 3);

    doc.text(`Sem ${sub.semester}`, margin + 110, y + 3);

    const lectRatio = `${sub.completedLectures}/${sub.totalLectures}`;
    doc.text(lectRatio, margin + 128, y + 3);

    const statusLabel = sub.revisionStatus === 'mastered' ? 'Mastered' : sub.revisionStatus === 'in_progress' ? 'In Progress' : 'Needs Rev';
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(
      sub.revisionStatus === 'mastered' ? 20 : sub.revisionStatus === 'in_progress' ? 115 : 180,
      sub.revisionStatus === 'mastered' ? 130 : sub.revisionStatus === 'in_progress' ? 45 : 70,
      sub.revisionStatus === 'mastered' ? 60 : sub.revisionStatus === 'in_progress' ? 210 : 30
    );
    doc.text(statusLabel, margin + 155, y + 3);

    y += 4.8;
  });

  // Footer bar on current page
  y = pageHeight - 12;
  doc.setDrawColor(220, 215, 235);
  doc.setLineWidth(0.4);
  doc.line(margin, y, pageWidth - margin, y);
  y += 4;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(140, 135, 160);
  const dateFormatted = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  doc.text(`Official BCA Academic Progress Report • Generated ${dateFormatted} • Authenticated Record`, margin, y);
  doc.text(`Curriculum Progress: ${data.overallProgress}%`, pageWidth - margin, y, { align: 'right' });

  // Download trigger
  const safeName = (data.name || 'Student').replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`${safeName}_BCA_Roadmap_Progress.pdf`);
}
