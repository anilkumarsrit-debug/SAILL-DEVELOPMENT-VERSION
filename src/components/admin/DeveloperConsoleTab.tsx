import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Terminal,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  User,
  Tag,
  Paperclip,
  Image as ImageIcon,
  Music,
  FileCode2,
  Sparkles,
  Layers,
  ChevronDown,
  X,
  History,
  Shield,
  Activity,
  Cpu,
  Bookmark,
  CheckSquare,
  ArrowUpRight,
  Eye,
  GraduationCap
} from 'lucide-react';
import { FacultyDashboardReviewMode } from '../faculty/FacultyDashboardReviewMode';
import { StudentDashboardReviewMode } from '../student/StudentDashboardReviewMode';
import {
  DevelopmentReviewService,
  ReviewObservation,
  ObservationCategory,
  ObservationPriority,
  ObservationStatus,
  ObservationAttachment,
  VERSION_RELEASES
} from '../../services/DevelopmentReviewService';
import { PlatformInitializationService } from '../../services/PlatformInitializationService';

const CATEGORIES: ObservationCategory[] = [
  'Pedagogy',
  'UI/UX',
  'AI Evaluation',
  'Assessment',
  'Audio',
  'Faculty',
  'Student',
  'Administrator',
  'Performance',
  'Security',
  'Bug',
  'Enhancement',
  'Feature Request'
];

const PRIORITIES: ObservationPriority[] = ['Critical', 'High', 'Medium', 'Low'];
const STATUSES: ObservationStatus[] = ['Open', 'In Progress', 'Under Review', 'Completed', 'Closed'];

export const DeveloperConsoleTab: React.FC = () => {
  const [observations, setObservations] = useState<ReviewObservation[]>([]);
  const [stats, setStats] = useState(DevelopmentReviewService.getDashboardStats());
  const [activeView, setActiveView] = useState<'review_center' | 'version_history' | 'faculty_preview' | 'student_preview'>('review_center');

  // Filters
  const [selectedJourney, setSelectedJourney] = useState<string>('ALL');
  const [selectedPhase, setSelectedPhase] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [editingObservation, setEditingObservation] = useState<ReviewObservation | null>(null);
  const [viewingObservation, setViewingObservation] = useState<ReviewObservation | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    journey: string;
    phase: string;
    unit: string;
    activity: string;
    title: string;
    description: string;
    category: ObservationCategory;
    priority: ObservationPriority;
    status: ObservationStatus;
    assignedTo: string;
    softwareVersion: string;
    attachments: ObservationAttachment[];
  }>({
    journey: 'Journey 1: R26 Communicative English Lab',
    phase: 'Phase A: Speech Sound Foundations',
    unit: 'Unit 1: IPA Explorer',
    activity: 'Interactive IPA Chart Practice',
    title: '',
    description: '',
    category: 'Pedagogy',
    priority: 'Medium',
    status: 'Open',
    assignedTo: 'Lead AI Engineer',
    softwareVersion: 'v1.2.0-A',
    attachments: []
  });

  // Mock Attachment File Input
  const [attachmentName, setAttachmentName] = useState<string>('');
  const [attachmentType, setAttachmentType] = useState<'image' | 'audio' | 'pdf'>('image');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const list = DevelopmentReviewService.filterObservations({
      journey: selectedJourney,
      phase: selectedPhase,
      category: selectedCategory,
      priority: selectedPriority,
      status: selectedStatus,
      keyword: searchKeyword
    });
    setObservations(list);
    setStats(DevelopmentReviewService.getDashboardStats());
  };

  useEffect(() => {
    loadData();
  }, [selectedJourney, selectedPhase, selectedCategory, selectedPriority, selectedStatus, searchKeyword]);

  const handleOpenCreate = () => {
    setEditingObservation(null);
    setFormData({
      journey: 'Journey 1: R26 Communicative English Lab',
      phase: 'Phase A: Speech Sound Foundations',
      unit: 'Unit 1: IPA Explorer',
      activity: 'Interactive IPA Chart Practice',
      title: '',
      description: '',
      category: 'Pedagogy',
      priority: 'Medium',
      status: 'Open',
      assignedTo: 'Pedagogy Review Team',
      softwareVersion: 'v1.2.0-A',
      attachments: [
        { id: 'att-mock-1', name: 'observation_waveform_spec.png', type: 'image', size: '1.1 MB' }
      ]
    });
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (obs: ReviewObservation) => {
    setEditingObservation(obs);
    setFormData({
      journey: obs.journey,
      phase: obs.phase,
      unit: obs.unit,
      activity: obs.activity,
      title: obs.title,
      description: obs.description,
      category: obs.category,
      priority: obs.priority,
      status: obs.status,
      assignedTo: obs.assignedTo,
      softwareVersion: obs.softwareVersion,
      attachments: [...obs.attachments]
    });
    setIsCreateModalOpen(true);
  };

  const handleSaveObservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Please fill out the Observation Title and Detailed Description.');
      return;
    }

    if (editingObservation) {
      DevelopmentReviewService.updateObservation(editingObservation.id, formData);
    } else {
      DevelopmentReviewService.createObservation(formData);
    }

    setIsCreateModalOpen(false);
    loadData();
  };

  const handleDeleteObservation = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete observation '${title}' (${id})?`)) {
      DevelopmentReviewService.deleteObservation(id);
      loadData();
    }
  };

  const handleAddMockAttachment = () => {
    if (!attachmentName.trim()) return;
    const newAtt: ObservationAttachment = {
      id: `att-${Date.now()}`,
      name: attachmentName.trim(),
      type: attachmentType,
      size: attachmentType === 'pdf' ? '820 KB' : attachmentType === 'audio' ? '2.4 MB' : '1.5 MB'
    };
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, newAtt]
    }));
    setAttachmentName('');
  };

  const handleRemoveAttachment = (attId: string) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((a) => a.id !== attId)
    }));
  };

  const handleQuickStatusChange = (obsId: string, newStatus: ObservationStatus) => {
    DevelopmentReviewService.updateObservation(obsId, { status: newStatus });
    loadData();
  };

  const getPriorityBadgeClass = (priority: ObservationPriority) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-300 font-extrabold animate-pulse';
      case 'High':
        return 'bg-amber-100 text-amber-800 border-amber-300 font-bold';
      case 'Medium':
        return 'bg-blue-100 text-blue-800 border-blue-300 font-bold';
      case 'Low':
        return 'bg-gray-100 text-gray-700 border-gray-300 font-semibold';
    }
  };

  const getStatusBadgeClass = (status: ObservationStatus) => {
    switch (status) {
      case 'Open':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Under Review':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Closed':
        return 'bg-gray-100 text-gray-600 border-gray-300';
    }
  };

  return (
    <div className="space-y-6 text-[#2C3E50]">
      {/* DEVELOPER CONSOLE TOP TOOLBAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border-2 border-[#FAD7A0] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#2C3E50] text-[#FAD7A0] rounded-xl shadow-md border border-[#34495E]">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400] text-[10px] font-black uppercase tracking-wider rounded">
                Bootstrap Administrator Tool
              </span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                v1.2.0-A Active
              </span>
            </div>
            <h2 className="text-lg font-black text-[#2C3E50] font-serif tracking-tight">
              Developer Console & Development Review Center
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          <button
            type="button"
            onClick={() => setActiveView('review_center')}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeView === 'review_center'
                ? 'bg-[#2C3E50] text-[#FAD7A0] shadow-md'
                : 'bg-gray-100 text-[#5D6D7E] hover:bg-gray-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Review Center Workspace</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('student_preview')}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-2 border ${
              activeView === 'student_preview'
                ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                : 'bg-blue-50 text-blue-900 border-blue-300 hover:bg-blue-100'
            }`}
          >
            <Eye className="w-4 h-4 text-blue-700" />
            <span>STUDENT DASHBOARD PREVIEW</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('faculty_preview')}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-2 border ${
              activeView === 'faculty_preview'
                ? 'bg-amber-600 text-white border-amber-500 shadow-md'
                : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
            }`}
          >
            <Eye className="w-4 h-4 text-amber-700" />
            <span>FACULTY DASHBOARD PREVIEW</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('version_history')}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeView === 'version_history'
                ? 'bg-[#2C3E50] text-[#FAD7A0] shadow-md'
                : 'bg-gray-100 text-[#5D6D7E] hover:bg-gray-200'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Version Releases</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Developer Reset: Reset Platform Initialization Engine (PIE)? This will clear the setup status and restart the Initial Platform Setup Wizard.')) {
                PlatformInitializationService.resetPlatformInitialization();
                window.location.reload();
              }
            }}
            title="Internal Developer Reset for PIE Setup Wizard"
            className="px-3 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-red-600" />
            <span className="hidden md:inline">PIE Dev Reset</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-gradient-to-r from-[#D35400] to-[#E67E22] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md hover:brightness-110 active:scale-95 transition flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Observation</span>
          </button>
        </div>
      </div>

      {/* DASHBOARD STATS SUMMARY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
        <div className="p-3.5 bg-white rounded-xl border border-gray-200 shadow-xs text-center space-y-1">
          <p className="text-[10px] font-extrabold uppercase text-gray-500 tracking-wider">Total Issues</p>
          <p className="text-xl font-black text-[#2C3E50] font-mono">{stats.totalIssues}</p>
        </div>

        <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200 shadow-xs text-center space-y-1">
          <p className="text-[10px] font-extrabold uppercase text-amber-800 tracking-wider">Open</p>
          <p className="text-xl font-black text-amber-700 font-mono">{stats.open}</p>
        </div>

        <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-200 shadow-xs text-center space-y-1">
          <p className="text-[10px] font-extrabold uppercase text-blue-800 tracking-wider">In Progress</p>
          <p className="text-xl font-black text-blue-700 font-mono">{stats.inProgress}</p>
        </div>

        <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 shadow-xs text-center space-y-1">
          <p className="text-[10px] font-extrabold uppercase text-emerald-800 tracking-wider">Resolved</p>
          <p className="text-xl font-black text-emerald-700 font-mono">{stats.resolved}</p>
        </div>

        <div className="p-3.5 bg-red-50/80 rounded-xl border border-red-200 shadow-xs text-center space-y-1">
          <p className="text-[10px] font-extrabold uppercase text-red-800 tracking-wider">Critical</p>
          <p className="text-xl font-black text-red-600 font-mono">{stats.critical}</p>
        </div>

        <div className="p-3.5 bg-orange-50/70 rounded-xl border border-orange-200 shadow-xs text-center space-y-1">
          <p className="text-[10px] font-extrabold uppercase text-orange-800 tracking-wider">Pedagogy</p>
          <p className="text-xl font-black text-[#D35400] font-mono">{stats.pedagogical}</p>
        </div>

        <div className="p-3.5 bg-purple-50/70 rounded-xl border border-purple-200 shadow-xs text-center space-y-1">
          <p className="text-[10px] font-extrabold uppercase text-purple-800 tracking-wider">UI / UX</p>
          <p className="text-xl font-black text-purple-700 font-mono">{stats.ui}</p>
        </div>

        <div className="p-3.5 bg-indigo-50/70 rounded-xl border border-indigo-200 shadow-xs text-center space-y-1">
          <p className="text-[10px] font-extrabold uppercase text-indigo-800 tracking-wider">AI Eval</p>
          <p className="text-xl font-black text-indigo-700 font-mono">{stats.ai}</p>
        </div>

        <div className="p-3.5 bg-teal-50/70 rounded-xl border border-teal-200 shadow-xs text-center space-y-1">
          <p className="text-[10px] font-extrabold uppercase text-teal-800 tracking-wider">Feature Req</p>
          <p className="text-xl font-black text-teal-700 font-mono">{stats.featureRequests}</p>
        </div>
      </div>

      {activeView === 'student_preview' ? (
        <StudentDashboardReviewMode onExitReviewMode={() => setActiveView('review_center')} />
      ) : activeView === 'faculty_preview' ? (
        <FacultyDashboardReviewMode onExitReviewMode={() => setActiveView('review_center')} />
      ) : activeView === 'review_center' ? (
        <>
          {/* REVIEW MODE LAUNCH CARDS GRID (SDRM-01 & FDRM-01) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* STUDENT DASHBOARD PREVIEW BANNER (SDRM-01) */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-700 to-slate-800 text-white p-4 rounded-2xl shadow-md border border-blue-300/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/10 rounded-xl border border-white/20 shrink-0">
                  <GraduationCap className="w-6 h-6 text-blue-200" />
                </div>
                <div>
                  <span className="px-2 py-0.5 bg-blue-200 text-blue-950 font-black text-[10px] uppercase tracking-wider rounded">
                    SDRM-01 FEATURE
                  </span>
                  <h3 className="font-extrabold text-sm text-white font-serif mt-0.5">
                    SAILL Student Dashboard Review Mode
                  </h3>
                  <p className="text-xs text-blue-100 font-medium">
                    Preview the Student Dashboard & Learning Journey UI/UX without creating a student account.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveView('student_preview')}
                className="px-4 py-2.5 bg-white text-blue-950 hover:bg-blue-50 font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer shrink-0 border border-blue-200"
              >
                <Eye className="w-4 h-4 text-blue-800" />
                <span>Launch Student Preview</span>
              </button>
            </div>

            {/* FACULTY DASHBOARD PREVIEW BANNER (FDRM-01) */}
            <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white p-4 rounded-2xl shadow-md border border-amber-300/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/10 rounded-xl border border-white/20 shrink-0">
                  <GraduationCap className="w-6 h-6 text-amber-200" />
                </div>
                <div>
                  <span className="px-2 py-0.5 bg-amber-200 text-amber-950 font-black text-[10px] uppercase tracking-wider rounded">
                    FDRM-01 FEATURE
                  </span>
                  <h3 className="font-extrabold text-sm text-white font-serif mt-0.5">
                    SAILL Faculty Dashboard Review Mode
                  </h3>
                  <p className="text-xs text-amber-100 font-medium">
                    Review the Faculty Incharge UI/UX without creating a faculty account.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveView('faculty_preview')}
                className="px-4 py-2.5 bg-white text-amber-950 hover:bg-amber-50 font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer shrink-0 border border-amber-200"
              >
                <Eye className="w-4 h-4 text-amber-800" />
                <span>Launch Faculty Preview</span>
              </button>
            </div>
          </div>

          {/* SEARCH & FILTERS BAR */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#D35400] uppercase tracking-wider">
              <Filter className="w-4 h-4" />
              <span>Review Workspace Search & Filter Controls</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
              {/* Keyword Search */}
              <div className="lg:col-span-2 relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="Search observation title, ID, assignee..."
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#2C3E50] outline-none focus:ring-2 focus:ring-[#D35400] focus:bg-white transition"
                />
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#2C3E50] font-medium outline-none focus:ring-2 focus:ring-[#D35400]"
                >
                  <option value="ALL">All Categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority Filter */}
              <div>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#2C3E50] font-medium outline-none focus:ring-2 focus:ring-[#D35400]"
                >
                  <option value="ALL">All Priorities</option>
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#2C3E50] font-medium outline-none focus:ring-2 focus:ring-[#D35400]"
                >
                  <option value="ALL">All Statuses</option>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reset Filters */}
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedJourney('ALL');
                    setSelectedPhase('ALL');
                    setSelectedCategory('ALL');
                    setSelectedPriority('ALL');
                    setSelectedStatus('ALL');
                    setSearchKeyword('');
                  }}
                  className="w-full py-2 px-3 bg-gray-100 hover:bg-gray-200 text-[#5D6D7E] text-xs font-bold rounded-xl transition"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* OBSERVATIONS TABLE LIST */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#2C3E50] text-[#FAD7A0] text-[11px] font-black uppercase tracking-wider border-b border-[#34495E]">
                    <th className="p-3.5">ID / Date</th>
                    <th className="p-3.5">Observation Title & Context</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Priority</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Assigned To</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 text-xs">
                  {observations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-500">
                        <p className="font-bold text-sm">No review observations matched your query.</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Try adjusting search keywords or clearing active filters.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    observations.map((obs) => (
                      <tr key={obs.id} className="hover:bg-gray-50/80 transition">
                        {/* ID / DATE */}
                        <td className="p-3.5 align-top font-mono font-bold text-[#2C3E50] whitespace-nowrap">
                          <div>{obs.id}</div>
                          <div className="text-[10px] font-sans font-normal text-gray-400">
                            {new Date(obs.dateCreated).toLocaleDateString()}
                          </div>
                          {obs.attachments.length > 0 && (
                            <div className="inline-flex items-center gap-1 text-[10px] text-[#D35400] font-bold mt-1">
                              <Paperclip className="w-3 h-3" />
                              <span>{obs.attachments.length}</span>
                            </div>
                          )}
                        </td>

                        {/* TITLE & CONTEXT */}
                        <td className="p-3.5 align-top max-w-md">
                          <button
                            onClick={() => setViewingObservation(obs)}
                            className="font-bold text-[#2C3E50] hover:text-[#D35400] text-left transition block"
                          >
                            {obs.title}
                          </button>
                          <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">{obs.description}</p>

                          <div className="flex flex-wrap items-center gap-1.5 mt-2 text-[10px]">
                            <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-medium">
                              {obs.phase}
                            </span>
                            <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-medium">
                              {obs.unit}
                            </span>
                          </div>
                        </td>

                        {/* CATEGORY */}
                        <td className="p-3.5 align-top">
                          <span className="inline-block px-2.5 py-1 bg-orange-50 text-[#D35400] border border-[#FAD7A0] font-extrabold rounded-md text-[10px] uppercase tracking-wider">
                            {obs.category}
                          </span>
                        </td>

                        {/* PRIORITY */}
                        <td className="p-3.5 align-top">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider border ${getPriorityBadgeClass(
                              obs.priority
                            )}`}
                          >
                            {obs.priority}
                          </span>
                        </td>

                        {/* STATUS SELECT */}
                        <td className="p-3.5 align-top">
                          <select
                            value={obs.status}
                            onChange={(e) =>
                              handleQuickStatusChange(obs.id, e.target.value as ObservationStatus)
                            }
                            className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md border outline-none cursor-pointer ${getStatusBadgeClass(
                              obs.status
                            )}`}
                          >
                            {STATUSES.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* ASSIGNED TO */}
                        <td className="p-3.5 align-top font-medium text-gray-700 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-gray-400" />
                            <span>{obs.assignedTo}</span>
                          </div>
                          <div className="text-[10px] font-mono text-gray-400 mt-0.5">
                            Ver: {obs.softwareVersion}
                          </div>
                        </td>

                        {/* ACTIONS */}
                        <td className="p-3.5 align-top text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => setViewingObservation(obs)}
                              className="p-1.5 text-gray-500 hover:text-[#D35400] hover:bg-orange-50 rounded-lg transition"
                              title="View Full Details"
                            >
                              <FileText className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenEdit(obs)}
                              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Edit Observation"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteObservation(obs.id, obs.title)}
                              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Delete Observation"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* VERSION HISTORY VIEW */
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-[#D35400]" />
              <h3 className="text-base font-black text-[#2C3E50] font-serif">
                Software Version Release Log & Completed Observations
              </h3>
            </div>
            <p className="text-xs text-[#5D6D7E] leading-relaxed">
              Every resolved pedagogy observation, audio fix, and UI/UX refinement is linked directly to platform version releases for complete institutional governance.
            </p>

            <div className="space-y-6 pt-2">
              {VERSION_RELEASES.map((rel) => {
                const linkedObs = DevelopmentReviewService.getAllObservations().filter((o) =>
                  rel.linkedObservationIds.includes(o.id)
                );

                return (
                  <div
                    key={rel.version}
                    className="p-5 bg-[#FFF8F0]/40 rounded-2xl border-2 border-[#FAD7A0] space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#FAD7A0]/60 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 bg-[#D35400] text-white text-[11px] font-black rounded-md font-mono">
                            {rel.version}
                          </span>
                          <h4 className="text-sm font-black text-[#2C3E50]">{rel.releaseName}</h4>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{rel.description}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-md border border-emerald-300">
                          {rel.status.replace('_', ' ')}
                        </span>
                        <div className="text-[10px] text-gray-400 font-mono mt-1">
                          Released: {rel.releaseDate}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-[11px] font-bold text-[#D35400] uppercase tracking-wider mb-2">
                        Linked Review Observations ({linkedObs.length})
                      </h5>
                      <div className="space-y-2">
                        {linkedObs.map((lo) => (
                          <div
                            key={lo.id}
                            className="p-3 bg-white rounded-xl border border-gray-200 text-xs flex items-start justify-between gap-3"
                          >
                            <div>
                              <span className="font-mono font-bold text-[#2C3E50] mr-2">{lo.id}</span>
                              <span className="font-bold text-gray-800">{lo.title}</span>
                              <div className="text-[11px] text-gray-500 mt-0.5">{lo.description}</div>
                            </div>

                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded border shrink-0 ${getStatusBadgeClass(
                                lo.status
                              )}`}
                            >
                              {lo.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT OBSERVATION MODAL */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F2C38]/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-white rounded-3xl border-2 border-[#FAD7A0] shadow-2xl overflow-hidden my-8"
            >
              <div className="p-5 bg-gradient-to-r from-[#2C3E50] to-[#34495E] text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-[#FAD7A0]" />
                  <h3 className="text-base font-black text-[#FAD7A0] font-serif">
                    {editingObservation ? 'Edit Review Observation' : 'Log New Development Review Observation'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-1 text-gray-300 hover:text-white rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveObservation} className="p-6 space-y-4 text-xs">
                {/* Title */}
                <div className="space-y-1">
                  <label className="font-bold text-[#2C3E50] uppercase tracking-wider">
                    Observation Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Phonetics Audio Latency on Fast Sound Switching"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#2C3E50] outline-none focus:ring-2 focus:ring-[#D35400] font-medium"
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="font-bold text-[#2C3E50] uppercase tracking-wider">
                    Detailed Description / Pedagogical Notes <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe observation context, empirical findings, or suggested enhancements..."
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#2C3E50] outline-none focus:ring-2 focus:ring-[#D35400]"
                    required
                  />
                </div>

                {/* Grid Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Category */}
                  <div>
                    <label className="font-bold text-[#2C3E50] uppercase tracking-wider block mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value as ObservationCategory })
                      }
                      className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#D35400]"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="font-bold text-[#2C3E50] uppercase tracking-wider block mb-1">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData({ ...formData, priority: e.target.value as ObservationPriority })
                      }
                      className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#D35400]"
                    >
                      {PRIORITIES.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="font-bold text-[#2C3E50] uppercase tracking-wider block mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value as ObservationStatus })
                      }
                      className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#D35400]"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Context Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#2C3E50] uppercase tracking-wider block mb-1">
                      Journey / Module Context
                    </label>
                    <input
                      type="text"
                      value={formData.journey}
                      onChange={(e) => setFormData({ ...formData, journey: e.target.value })}
                      className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#2C3E50] uppercase tracking-wider block mb-1">
                      Phase
                    </label>
                    <input
                      type="text"
                      value={formData.phase}
                      onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
                      className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#2C3E50] uppercase tracking-wider block mb-1">
                      Assigned To
                    </label>
                    <input
                      type="text"
                      value={formData.assignedTo}
                      onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                      className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#2C3E50] uppercase tracking-wider block mb-1">
                      Target Software Version
                    </label>
                    <input
                      type="text"
                      value={formData.softwareVersion}
                      onChange={(e) => setFormData({ ...formData, softwareVersion: e.target.value })}
                      className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                    />
                  </div>
                </div>

                {/* ATTACHMENT PLACEHOLDERS SECTION */}
                <div className="p-3.5 bg-[#FFF8F0] rounded-xl border border-[#FAD7A0] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[#D35400] uppercase tracking-wider flex items-center gap-1.5">
                      <Paperclip className="w-3.5 h-3.5" />
                      Observation Attachments Placeholder (Image / Audio / PDF)
                    </span>
                    <span className="text-[10px] text-gray-400">Placeholder UI (No Backend Storage)</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={attachmentName}
                      onChange={(e) => setAttachmentName(e.target.value)}
                      placeholder="e.g. waveform_spectrum_capture.png"
                      className="flex-1 p-2 bg-white border border-gray-200 rounded-lg text-xs outline-none"
                    />
                    <select
                      value={attachmentType}
                      onChange={(e) =>
                        setAttachmentType(e.target.value as 'image' | 'audio' | 'pdf')
                      }
                      className="p-2 bg-white border border-gray-200 rounded-lg text-xs outline-none"
                    >
                      <option value="image">Image</option>
                      <option value="audio">Audio</option>
                      <option value="pdf">PDF</option>
                    </select>
                    <button
                      type="button"
                      onClick={handleAddMockAttachment}
                      className="px-3 py-2 bg-[#2C3E50] text-[#FAD7A0] font-bold rounded-lg hover:bg-[#34495E]"
                    >
                      Attach
                    </button>
                  </div>

                  {formData.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {formData.attachments.map((att) => (
                        <div
                          key={att.id}
                          className="px-2.5 py-1 bg-white rounded-lg border border-gray-200 flex items-center gap-2 text-[11px]"
                        >
                          {att.type === 'image' && <ImageIcon className="w-3.5 h-3.5 text-blue-500" />}
                          {att.type === 'audio' && <Music className="w-3.5 h-3.5 text-purple-500" />}
                          {att.type === 'pdf' && <FileText className="w-3.5 h-3.5 text-red-500" />}
                          <span className="font-medium text-gray-700">{att.name}</span>
                          <span className="text-[10px] text-gray-400">({att.size})</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveAttachment(att.id)}
                            className="text-gray-400 hover:text-red-500 ml-1"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#D35400] hover:bg-[#E67E22] text-white font-black uppercase tracking-wider rounded-xl shadow-md"
                  >
                    Save Observation
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* VIEW OBSERVATION DETAIL MODAL */}
      <AnimatePresence>
        {viewingObservation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F2C38]/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-white rounded-3xl border-2 border-[#FAD7A0] shadow-2xl overflow-hidden my-8"
            >
              <div className="p-5 bg-[#2C3E50] text-white flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs text-[#FAD7A0] font-bold">
                    {viewingObservation.id}
                  </span>
                  <h3 className="text-base font-black text-white font-serif">{viewingObservation.title}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setViewingObservation(null)}
                  className="p-1 text-gray-300 hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 bg-orange-50 text-[#D35400] border border-[#FAD7A0] font-extrabold rounded-md text-[10px] uppercase">
                    {viewingObservation.category}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-md text-[10px] uppercase border ${getPriorityBadgeClass(
                      viewingObservation.priority
                    )}`}
                  >
                    Priority: {viewingObservation.priority}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-md text-[10px] uppercase border ${getStatusBadgeClass(
                      viewingObservation.status
                    )}`}
                  >
                    Status: {viewingObservation.status}
                  </span>
                </div>

                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200">
                  <h4 className="font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Detailed Observation Text
                  </h4>
                  <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                    {viewingObservation.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-gray-400 block font-bold uppercase">Journey:</span>
                    <span className="font-semibold text-gray-800">{viewingObservation.journey}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-bold uppercase">Phase:</span>
                    <span className="font-semibold text-gray-800">{viewingObservation.phase}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-bold uppercase">Assigned To:</span>
                    <span className="font-semibold text-gray-800">{viewingObservation.assignedTo}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-bold uppercase">Software Version:</span>
                    <span className="font-mono font-bold text-[#D35400]">
                      {viewingObservation.softwareVersion}
                    </span>
                  </div>
                </div>

                {viewingObservation.attachments.length > 0 && (
                  <div className="p-3 bg-[#FFF8F0] rounded-xl border border-[#FAD7A0]">
                    <span className="font-bold text-[#D35400] uppercase block mb-2">
                      Attached Materials ({viewingObservation.attachments.length})
                    </span>
                    <div className="space-y-1.5">
                      {viewingObservation.attachments.map((att) => (
                        <div
                          key={att.id}
                          className="p-2 bg-white rounded-lg border border-gray-200 flex items-center gap-2 text-xs"
                        >
                          {att.type === 'image' && <ImageIcon className="w-4 h-4 text-blue-500" />}
                          {att.type === 'audio' && <Music className="w-4 h-4 text-purple-500" />}
                          {att.type === 'pdf' && <FileText className="w-4 h-4 text-red-500" />}
                          <span className="font-medium text-gray-800">{att.name}</span>
                          <span className="text-[10px] text-gray-400 font-mono">({att.size})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
