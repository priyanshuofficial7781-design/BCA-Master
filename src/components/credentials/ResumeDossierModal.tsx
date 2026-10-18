import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  FileText,
  Download,
  Printer,
  Upload,
  CheckCircle2,
  Sparkles,
  Trophy,
  Briefcase,
  GraduationCap,
  Layers,
  Code,
  ShieldCheck,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import { soundEffects } from '../../services/soundEffects';
import { generateResumePDF, generateRoadmapProgressPDF } from '../../utils/pdfGenerator';

interface ResumeDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeDossierModal: React.FC<ResumeDossierModalProps> = ({ isOpen, onClose }) => {
  const { data, overallCgpa, streakDays, importDataJSON, exportDataJSON } = useApp();
  const [activeTab, setActiveTab] = useState<'resume' | 'exampaper' | 'backup'>('resume');
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [pdfSuccessMessage, setPdfSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const completedProjects = data.projects.filter((p) => p.status === 'completed');
  const displayedProjects = completedProjects.length > 0 ? completedProjects : data.projects.slice(0, 3);
  const totalSolved = data.questionBankProgress?.masteredIds.length || 42;

  // Direct PDF Download Handler
  const handleDownloadResumePDF = () => {
    try {
      setIsDownloadingPDF(true);
      soundEffects.playLevelUp();
      generateResumePDF({
        name: data.profile.name,
        semester: data.profile.semester,
        college: data.profile.college,
        targetRole: data.profile.targetRole,
        cgpa: overallCgpa,
        streakDays: streakDays,
        projects: data.projects,
        dsaSolvedCount: totalSolved,
        subjects: data.subjects,
        primaryTrack: data.profile.primaryTrack,
      });
      setPdfSuccessMessage('Resume PDF downloaded successfully!');
      setTimeout(() => setPdfSuccessMessage(null), 3500);
    } catch (err) {
      console.error('Failed to generate resume PDF', err);
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  // Print handler
  const handlePrint = () => {
    soundEffects.playClick();
    window.print();
  };

  // Download Deployment index.html
  const handleDownloadIndexHtml = () => {
    soundEffects.playClick();
    const htmlContent = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
    <title>BCA Career Planner 3D – Plan, Learn, Build & Grow</title>
    <meta
      name="description"
      content="Interactive 3D career roadmap, daily habit heatmap, live DSA runner, and placement suite for BCA undergraduate students."
    />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="BCA Career Planner 3D – Plan, Learn, Build & Grow" />
    <meta
      property="og:description"
      content="Interactive 3D career roadmap, daily habit heatmap, live DSA runner, and placement suite for BCA undergraduate students."
    />
    <meta property="og:site_name" content="BCA Career Planner 3D" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="BCA Career Planner 3D – Plan, Learn, Build & Grow" />
    <meta
      name="twitter:description"
      content="Interactive 3D career roadmap, daily habit heatmap, live DSA runner, and placement suite for BCA undergraduate students."
    />
    <meta name="theme-color" content="#06050C" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="BCAPlanner3D" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="icon" type="image/svg+xml" href="/icon.svg" />

    <!-- Schema.org JSON-LD Structured Data -->
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "BCA Career Planner 3D",
        "applicationCategory": "EducationalApplication",
        "operatingSystem": "All",
        "description": "Comprehensive 3-year academic roadmap, 3D habit tracking matrix, DSA playground, and placement portal for BCA computer science students.",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      }
    </script>
    <script type="module" crossorigin src="/assets/index-EfbytuE8.js"></script>
    <link rel="stylesheet" crossorigin href="/assets/index-BVXDNv7b.css">
    <link rel="manifest" href="/manifest.webmanifest">
    <script id="vite-plugin-pwa:register-sw" src="/registerSW.js"></script>
  </head>
  <body style="margin: 0; background-color: #06050C; color: #F7F5FF;">
    <div id="root"></div>
  </body>
</html>`;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setPdfSuccessMessage('Deployment index.html downloaded successfully!');
    setTimeout(() => setPdfSuccessMessage(null), 3500);
  };

  // Download netlify.toml
  const handleDownloadNetlifyToml = () => {
    soundEffects.playClick();
    const tomlContent = `[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "SAMEORIGIN"
`;
    const blob = new Blob([tomlContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'netlify.toml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setPdfSuccessMessage('netlify.toml configuration downloaded successfully!');
    setTimeout(() => setPdfSuccessMessage(null), 3500);
  };

  // Download _redirects
  const handleDownloadRedirects = () => {
    soundEffects.playClick();
    const redirectsContent = `/*    /index.html   200\n`;
    const blob = new Blob([redirectsContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '_redirects';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setPdfSuccessMessage('_redirects file downloaded successfully!');
    setTimeout(() => setPdfSuccessMessage(null), 3500);
  };

  // Export JSON Backup
  const handleExportJSON = () => {
    soundEffects.playSuccess();
    exportDataJSON();
  };

  // Import JSON Backup
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const rawContent = event.target?.result as string;
        const res = importDataJSON(rawContent);
        if (res.success) {
          soundEffects.playLevelUp();
          setCopyFeedback(true);
          setTimeout(() => setCopyFeedback(false), 3000);
        } else {
          alert(res.error || 'Invalid backup file structure.');
        }
      } catch {
        alert('Invalid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xl animate-fadeIn">
      {/* Container */}
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-[#0C0A18] border border-[#B46CFF]/35 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(139,61,255,0.25)] overflow-hidden">
        {/* Top Header Rail */}
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00F0FF]/60 via-[#B46CFF]/80 to-transparent pointer-events-none" />

        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-[#B46CFF]/20 flex items-center justify-between gap-3 bg-[#100E24]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#8B3DFF] to-[#00F0FF] flex items-center justify-center text-white shadow-[0_0_15px_rgba(139,61,255,0.4)]">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
                <span>BCA Academic Dossier & Export Suite</span>
                <span className="px-2 py-0.5 rounded-full bg-[#8B3DFF]/25 border border-[#B46CFF]/35 text-[10px] font-mono text-[#00F0FF]">
                  PROD READY
                </span>
              </h2>
              <p className="text-xs text-[#AAA9C6]">
                One-click 1-page placement resume, university question revision paper & data backup
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadResumePDF}
              disabled={isDownloadingPDF}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#8B3DFF] via-[#A05CFF] to-[#00F0FF] hover:opacity-95 text-white text-xs font-bold shadow-[0_0_20px_rgba(139,61,255,0.45)] transition-all cursor-pointer border border-white/20 active:scale-95 disabled:opacity-50"
              title="Download high-resolution ATS-formatted PDF"
            >
              <Download size={14} className={isDownloadingPDF ? 'animate-bounce' : ''} />
              <span>{isDownloadingPDF ? 'Generating...' : 'Download PDF'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#181530] hover:bg-[#252048] text-white text-xs font-medium border border-white/10 transition-all cursor-pointer"
              title="Open browser print preview"
            >
              <Printer size={14} />
              <span>Print</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                onClose();
              }}
              className="w-9 h-9 rounded-xl bg-[#181530] hover:bg-[#252048] border border-white/10 flex items-center justify-center text-[#AAA9C6] hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-white/5 bg-[#090714]">
          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('resume');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'resume'
                ? 'bg-[#8B3DFF]/30 text-white border border-[#B46CFF]/45 shadow-[0_0_12px_rgba(180,108,255,0.3)]'
                : 'text-[#AAA9C6] hover:text-white'
            }`}
          >
            <Briefcase size={14} />
            <span>1-Page Placement Resume</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('exampaper');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'exampaper'
                ? 'bg-[#8B3DFF]/30 text-white border border-[#B46CFF]/45 shadow-[0_0_12px_rgba(180,108,255,0.3)]'
                : 'text-[#AAA9C6] hover:text-white'
            }`}
          >
            <BookOpen size={14} />
            <span>Semester Revision Sheet</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('backup');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'backup'
                ? 'bg-[#8B3DFF]/30 text-white border border-[#B46CFF]/45 shadow-[0_0_12px_rgba(180,108,255,0.3)]'
                : 'text-[#AAA9C6] hover:text-white'
            }`}
          >
            <Download size={14} />
            <span>Cloud & JSON Backup</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {activeTab === 'resume' && (
            <div className="space-y-4">
              {/* Controls bar inside tab */}
              {pdfSuccessMessage && (
                <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 text-xs flex items-center justify-between animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>{pdfSuccessMessage}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono">PDF READY</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 sm:p-3.5 rounded-2xl bg-[#141128] border border-[#B46CFF]/25 text-xs text-[#AAA9C6]">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-[#00F0FF] shrink-0" />
                  <span>Previewing verified student dossier for <strong>Semester {data.profile.semester}</strong></span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleDownloadResumePDF}
                    disabled={isDownloadingPDF}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#8B3DFF] to-[#00F0FF] hover:brightness-110 text-white font-bold transition-all cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.3)] disabled:opacity-50"
                  >
                    <Download size={13} className={isDownloadingPDF ? 'animate-bounce' : ''} />
                    <span>{isDownloadingPDF ? 'Exporting...' : 'Download Resume PDF'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#1C1835] hover:bg-[#28224D] border border-white/10 text-white font-medium transition-all cursor-pointer"
                  >
                    <Printer size={13} />
                    <span>Print</span>
                  </button>
                </div>
              </div>

              {/* Printable Resume Sheet Canvas */}
              <div
                id="printable-resume-canvas"
                className="p-6 sm:p-8 rounded-2xl bg-white text-gray-900 shadow-2xl font-sans space-y-5"
              >
                {/* Header */}
                <div className="border-b-2 border-gray-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 uppercase">
                      {data.profile.name || 'Student Candidate'}
                    </h1>
                    <p className="text-sm font-semibold text-purple-700 tracking-wide mt-0.5">
                      BCA Undergraduate • Semester {data.profile.semester} • Aspiring Software Engineer
                    </p>
                  </div>
                  <div className="text-xs text-gray-600 sm:text-right font-mono space-y-0.5">
                    <div>University Roll: <span className="font-bold text-gray-800">BCA-{data.profile.semester}026-X</span></div>
                    <div>Overall CGPA: <span className="font-bold text-purple-700">{overallCgpa.toFixed(2)} / 10.0</span></div>
                    <div>Daily Streak: <span className="font-bold text-gray-800">{streakDays} Consecutive Days</span></div>
                  </div>
                </div>

                {/* Academic Profile */}
                <div className="space-y-1">
                  <h3 className="text-xs font-black uppercase tracking-wider text-gray-700 border-b border-gray-300 pb-1">
                    Education & Academics
                  </h3>
                  <div className="flex justify-between items-baseline pt-1 text-xs">
                    <div>
                      <strong className="text-gray-900">Bachelor of Computer Applications (BCA)</strong> — Full-Time
                      <div className="text-gray-600 text-[11px]">Computer Science Core, Data Structures, Algorithms & Database Systems</div>
                    </div>
                    <div className="text-right text-gray-600 font-mono text-[11px]">2024 – 2027</div>
                  </div>
                </div>

                {/* Technical Skills Matrix */}
                <div className="space-y-1.5">
                  <h3 className="text-xs font-black uppercase tracking-wider text-gray-700 border-b border-gray-300 pb-1">
                    Technical Proficiencies
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div>
                      <strong className="text-gray-900">Languages:</strong> C++, Python, JavaScript, TypeScript, SQL, Java
                    </div>
                    <div>
                      <strong className="text-gray-900">Core CS:</strong> Data Structures, OOPs, DBMS, Operating Systems, Networks
                    </div>
                    <div>
                      <strong className="text-gray-900">Frameworks:</strong> React, Node.js, Express, Tailwind CSS, Vite
                    </div>
                    <div>
                      <strong className="text-gray-900">DSA Track:</strong> {totalSolved}+ Algorithmic Problems Mastered
                    </div>
                  </div>
                </div>

                {/* Verified Completed Projects */}
                <div className="space-y-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-gray-700 border-b border-gray-300 pb-1">
                    Selected Software Projects
                  </h3>
                  <div className="space-y-3 pt-1">
                    {displayedProjects.map((proj) => (
                      <div key={proj.id} className="text-xs space-y-0.5">
                        <div className="flex justify-between items-baseline">
                          <strong className="text-gray-900 text-sm font-bold">{proj.title}</strong>
                          <span className="text-[11px] font-mono font-medium text-purple-700 uppercase">
                            {proj.status === 'completed' ? 'Production Ready' : 'In Development'}
                          </span>
                        </div>
                        <p className="text-gray-600 text-xs leading-relaxed">{proj.description}</p>
                        <div className="text-[11px] text-gray-500 font-mono">
                          Tech Stack: {(proj.techStack || []).join(' • ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Verified Domain Credentials */}
                <div className="space-y-1 pt-1">
                  <h3 className="text-xs font-black uppercase tracking-wider text-gray-700 border-b border-gray-300 pb-1">
                    Academic Certifications & Badges
                  </h3>
                  <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                    <span className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded font-medium text-gray-800">
                      BCA Semester {data.profile.semester} Honors Rank
                    </span>
                    <span className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded font-medium text-gray-800">
                      C++ Data Structures Specialist
                    </span>
                    <span className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded font-medium text-gray-800">
                      Full-Stack Web Architect
                    </span>
                    <span className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded font-medium text-gray-800">
                      Database Design & Normalization (3NF)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'exampaper' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#AAA9C6] pb-1">
                <span>Semester {data.profile.semester} University End-Term Revision Sheet</span>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex items-center gap-1 text-[#00F0FF] font-bold hover:underline"
                >
                  <Printer size={13} />
                  <span>Print Exam Sheet</span>
                </button>
              </div>

              {/* Printable Question Paper Canvas */}
              <div className="p-6 sm:p-8 rounded-2xl bg-white text-gray-900 shadow-xl font-serif space-y-5">
                <div className="text-center border-b-2 border-gray-800 pb-3 space-y-1">
                  <h2 className="text-lg font-black tracking-tight uppercase text-gray-900 font-sans">
                    Bachelor of Computer Applications — Semester {data.profile.semester} Examination
                  </h2>
                  <p className="text-xs font-semibold text-gray-700 uppercase font-sans">
                    Paper: Data Structures & Core Computing Systems (BCA-301)
                  </p>
                  <div className="flex justify-between text-xs font-sans text-gray-600 pt-1">
                    <span>Time Allowed: 3 Hours</span>
                    <span>Candidate Name: {data.profile.name}</span>
                    <span>Max Marks: 100</span>
                  </div>
                </div>

                {/* Section A */}
                <div className="space-y-2 text-xs">
                  <h4 className="font-bold font-sans uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-0.5">
                    Section A — Conceptual Core (Answer All Questions • 5 × 4 = 20 Marks)
                  </h4>
                  <ol className="list-decimal pl-5 space-y-1 text-gray-700 leading-relaxed">
                    <li>Differentiate between array allocation in static stack vs dynamic heap memory.</li>
                    <li>Define Time and Space Complexity for QuickSort in average and worst cases.</li>
                    <li>Explain the mathematical condition for detecting cycles in a directed graph using Kahn’s Algorithm.</li>
                    <li>What is the difference between primary index, secondary index, and B+ Tree clustering?</li>
                    <li>State ACID properties and explain the role of Write-Ahead Logging (WAL).</li>
                  </ol>
                </div>

                {/* Section B */}
                <div className="space-y-2 text-xs">
                  <h4 className="font-bold font-sans uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-0.5">
                    Section B — Algorithmic Problem Solving (4 × 10 = 40 Marks)
                  </h4>
                  <ol className="list-decimal pl-5 space-y-1.5 text-gray-700 leading-relaxed" start={6}>
                    <li>Write an iterative C++ function to reverse a singly linked list in O(n) time and O(1) space.</li>
                    <li>Construct an AVL tree by sequentially inserting keys: 15, 20, 24, 10, 13, 7, 30, 36. Show rotations.</li>
                    <li>Implement Dijkstra’s single-source shortest path algorithm using a min-heap priority queue.</li>
                    <li>Describe the 0/1 Knapsack problem using dynamic programming with tabulation memoization.</li>
                  </ol>
                </div>

                {/* Section C */}
                <div className="space-y-2 text-xs">
                  <h4 className="font-bold font-sans uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-0.5">
                    Section C — System Design & Application (2 × 20 = 40 Marks)
                  </h4>
                  <ol className="list-decimal pl-5 space-y-1.5 text-gray-700 leading-relaxed" start={10}>
                    <li>Design an end-to-end relational schema for a University Placement Portal in Third Normal Form (3NF).</li>
                    <li>Explain Virtual Memory Management, Page Replacement Algorithms (FIFO, LRU, Optimal), and Thrashing.</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div className="p-5 rounded-3xl bg-gradient-to-br from-[#16132D] to-[#0D0B18] border border-[#B46CFF]/30 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#00F0FF]/20 border border-[#00F0FF]/30 flex items-center justify-center text-[#00F0FF]">
                    <Download size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Full JSON Data Backup & Portable Export</h3>
                    <p className="text-xs text-[#AAA9C6]">
                      Save all your study logs, streak progress, subject milestones, and project portfolio.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleExportJSON}
                    className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#8B3DFF] to-[#00F0FF] hover:opacity-95 text-white text-xs font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(139,61,255,0.4)] cursor-pointer"
                  >
                    <Download size={15} />
                    <span>Download JSON Backup</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-5 py-2.5 rounded-2xl bg-[#1C1835] hover:bg-[#28224D] border border-white/10 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Upload size={15} />
                    <span>Restore From File</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileImport}
                    className="hidden"
                  />
                </div>

                {copyFeedback && (
                  <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
                    <CheckCircle2 size={16} />
                    <span>Backup restored successfully! All academic records synchronized.</span>
                  </div>
                )}
              </div>

              {/* Netlify Production Deployment & HTML Bundle */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-[#14102C] via-[#0E0C20] to-[#070614] border border-[#00F0FF]/35 shadow-[0_16px_50px_rgba(0,0,0,0.8),0_0_25px_rgba(0,240,255,0.18)] space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#00F0FF] to-[#8B3DFF] flex items-center justify-center text-white shadow-[0_0_15px_rgba(0,240,255,0.4)] shrink-0">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>Netlify Deployment HTML & Config Suite</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30 text-[10px] font-mono">
                        DEPLOY READY
                      </span>
                    </h3>
                    <p className="text-xs text-[#AAA9C6]">
                      Download your pre-configured production index.html, netlify.toml, and SPA redirect rules.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={handleDownloadIndexHtml}
                    className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#00F0FF] to-[#8B3DFF] hover:brightness-110 active:scale-95 text-black font-bold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.35)] cursor-pointer"
                  >
                    <Download size={14} className="text-black" />
                    <span>Download Deployment index.html</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadNetlifyToml}
                    className="px-4 py-2.5 rounded-2xl bg-[#1C1835] hover:bg-[#28224D] border border-white/10 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Download size={14} />
                    <span>Download netlify.toml</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadRedirects}
                    className="px-4 py-2.5 rounded-2xl bg-[#1C1835] hover:bg-[#28224D] border border-white/10 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Download size={14} />
                    <span>Download _redirects</span>
                  </button>
                </div>
              </div>

              {/* Status details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-[#100E22] border border-white/5 space-y-1">
                  <span className="text-[10px] text-[#AAA9C6] uppercase font-bold tracking-wider">Local Persistence</span>
                  <div className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#00FF9D] animate-pulse" />
                    <span>Active In-Browser</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#100E22] border border-white/5 space-y-1">
                  <span className="text-[10px] text-[#AAA9C6] uppercase font-bold tracking-wider">SW Background Sync</span>
                  <div className="text-sm font-bold text-[#00F0FF] flex items-center gap-1.5">
                    <ShieldCheck size={14} />
                    <span>Auto Reconcile</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#100E22] border border-white/5 space-y-1">
                  <span className="text-[10px] text-[#AAA9C6] uppercase font-bold tracking-wider">Export Format</span>
                  <div className="text-sm font-bold text-[#B46CFF]">JSON & Printable PDF</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
