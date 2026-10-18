import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProjectItem } from '../../types';
import { Modal } from '../common/Modal';
import { ProgressBar } from '../common/ProgressBar';
import {
  FolderGit2,
  Plus,
  Github,
  ExternalLink,
  CheckCircle2,
  Circle,
  Calendar,
  Layers,
  Search,
  Trash2,
  Edit2,
} from 'lucide-react';

export const ProjectsView: React.FC = () => {
  const {
    data,
    addProject,
    updateProject,
    deleteProject,
    toggleProjectMilestone,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ProjectItem['status']>('planned');
  const [techStackInput, setTechStackInput] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [notes, setNotes] = useState('');

  const openNewProject = () => {
    setEditingProject(null);
    setTitle('');
    setDescription('');
    setStatus('planned');
    setTechStackInput('React, TypeScript, Tailwind');
    setGithubUrl('');
    setDemoUrl('');
    setTargetDate('');
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditProject = (p: ProjectItem) => {
    setEditingProject(p);
    setTitle(p.title);
    setDescription(p.description);
    setStatus(p.status);
    setTechStackInput(p.techStack.join(', '));
    setGithubUrl(p.githubUrl);
    setDemoUrl(p.demoUrl);
    setTargetDate(p.targetDate);
    setNotes(p.notes);
    setIsModalOpen(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const techArray = techStackInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingProject) {
      updateProject(editingProject.id, {
        title: title.trim(),
        description: description.trim(),
        status,
        techStack: techArray,
        githubUrl: githubUrl.trim(),
        demoUrl: demoUrl.trim(),
        targetDate,
        notes: notes.trim(),
      });
    } else {
      addProject({
        title: title.trim(),
        description: description.trim(),
        status,
        techStack: techArray,
        startDate: new Date().toISOString().split('T')[0],
        targetDate,
        githubUrl: githubUrl.trim(),
        demoUrl: demoUrl.trim(),
        notes: notes.trim(),
        milestones: [
          { id: 'm-init', title: 'System Architecture & Tech Stack Setup', completed: false },
          { id: 'm-core', title: 'Core Features & Logic Implementation', completed: false },
          { id: 'm-deploy', title: 'Testing, Deployment & Documentation', completed: false },
        ],
      });
    }

    setIsModalOpen(false);
  };

  const statusPills: Array<{ id: string; label: string }> = [
    { id: 'all', label: 'All Projects' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'planned', label: 'Planned' },
    { id: 'completed', label: 'Completed' },
    { id: 'idea', label: 'Ideas' },
    { id: 'archived', label: 'Archived' },
  ];

  const filteredProjects = data.projects.filter((p) => {
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-24 lg:pb-12 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#161424] border border-purple-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FolderGit2 size={18} className="text-purple-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Project Portfolio & Showcase
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#9E99AF]">
            Build practical, production-ready software to power your resume and technical interviews
          </p>
        </div>

        <button
          onClick={openNewProject}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(139,92,246,0.35)] flex items-center gap-1.5 self-start sm:self-auto transition-all active:scale-95"
        >
          <Plus size={15} />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3 p-4 rounded-2xl bg-[#161424] border border-purple-500/20">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9E99AF]" />
          <input
            type="text"
            placeholder="Search projects by title, tech stack (e.g. Python, React, Scikit-learn)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#1D192E] border border-purple-500/20 text-white placeholder-[#686378] text-xs sm:text-sm focus:outline-none focus:border-purple-400"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {statusPills.map((pill) => (
            <button
              key={pill.id}
              onClick={() => setStatusFilter(pill.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                statusFilter === pill.id
                  ? 'bg-purple-600 text-white font-semibold'
                  : 'bg-[#1D192E] text-[#9E99AF] hover:text-white border border-purple-500/15'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.map((p) => {
          const completedMilestones = p.milestones.filter((m) => m.completed).length;
          const milestonePercent =
            p.milestones.length > 0
              ? Math.round((completedMilestones / p.milestones.length) * 100)
              : 0;

          const statusBadgeColors = {
            idea: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
            planned: 'text-blue-300 bg-blue-500/10 border-blue-500/20',
            in_progress: 'text-purple-300 bg-purple-500/10 border-purple-500/20',
            completed: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
            archived: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
          };

          return (
            <div
              key={p.id}
              className="rounded-2xl bg-[#161424] border border-purple-500/20 hover:border-purple-500/40 p-5 hover:bg-[#1A1629] transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${
                      statusBadgeColors[p.status]
                    }`}
                  >
                    {p.status.replace('_', ' ')}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditProject(p)}
                      className="w-7 h-7 rounded-lg bg-[#201C33] hover:bg-[#2C2647] text-[#9E99AF] hover:text-white flex items-center justify-center transition-colors"
                      title="Edit project"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => deleteProject(p.id)}
                      className="w-7 h-7 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 flex items-center justify-center transition-colors"
                      title="Delete project"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white tracking-tight leading-snug">
                  {p.title}
                </h3>
                <p className="text-xs text-[#AAA5B6] mt-1.5 leading-relaxed line-clamp-2">
                  {p.description}
                </p>

                {/* Tech Stack Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {p.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-medium text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-md"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Milestones checklist */}
                <div className="mt-4 space-y-2 border-t border-purple-500/10 pt-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#9E99AF]">Milestones Checklist</span>
                    <span className="text-purple-300 font-bold tabular-nums">
                      {completedMilestones} / {p.milestones.length}
                    </span>
                  </div>

                  <ProgressBar progress={milestonePercent} height={5} />

                  <div className="space-y-1.5 mt-2">
                    {p.milestones.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => toggleProjectMilestone(p.id, m.id)}
                        className="cursor-pointer flex items-center gap-2 text-xs text-[#D1CEE0] hover:text-white transition-colors"
                      >
                        {m.completed ? (
                          <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                        ) : (
                          <Circle size={15} className="text-[#8E8A9C] shrink-0" />
                        )}
                        <span className={`truncate ${m.completed ? 'line-through text-[#7A7588]' : ''}`}>
                          {m.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Links Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-purple-500/10 text-xs">
                <span className="text-[#8E8A9C] text-[11px] flex items-center gap-1">
                  <Calendar size={12} /> Target: {p.targetDate || 'Flexible'}
                </span>

                <div className="flex items-center gap-2">
                  {p.githubUrl && (
                    <a
                      href={p.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-[#201C33] hover:bg-[#2C2647] text-[#9E99AF] hover:text-white transition-colors"
                      title="GitHub Repository"
                    >
                      <Github size={15} />
                    </a>
                  )}
                  {p.demoUrl && (
                    <a
                      href={p.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-[#201C33] hover:bg-[#2C2647] text-purple-300 hover:text-white transition-colors"
                      title="Live Demo"
                    >
                      <ExternalLink size={15} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? 'Edit Project' : 'Create New Project'}
        subtitle="Track technical architecture, repository links, and milestones"
      >
        <form onSubmit={handleSaveProject} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#AAA5B6] uppercase tracking-wider mb-1.5">
              Project Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Distributed Task Scheduler in C++"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1629] border border-purple-500/20 text-white text-sm focus:outline-none focus:border-purple-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#AAA5B6] uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="What problem does this project solve? What did you build?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#1A1629] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#AAA5B6] uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#1A1629] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400"
              >
                <option value="idea">Idea</option>
                <option value="planned">Planned</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#AAA5B6] uppercase tracking-wider mb-1.5">
                Target Date
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#1A1629] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#AAA5B6] uppercase tracking-wider mb-1.5">
              Tech Stack (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. React, Python, FastAPI, Docker"
              value={techStackInput}
              onChange={(e) => setTechStackInput(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#1A1629] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#AAA5B6] uppercase tracking-wider mb-1.5">
                GitHub Repo URL
              </label>
              <input
                type="url"
                placeholder="https://github.com/..."
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#1A1629] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#AAA5B6] uppercase tracking-wider mb-1.5">
                Live Demo URL
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#1A1629] border border-purple-500/20 text-white text-xs focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-purple-500/15">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-[#201C33] text-[#9E99AF] hover:text-white text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-sm"
            >
              Save Project
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
