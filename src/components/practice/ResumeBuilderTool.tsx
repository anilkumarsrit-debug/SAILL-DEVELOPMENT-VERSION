import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Printer, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  User, 
  Target, 
  Code, 
  Layers, 
  Briefcase, 
  Award,
  Sparkles,
  RotateCcw,
  Save,
  ChevronDown
} from 'lucide-react';

interface ResumeBuilderToolProps {
  onSaveWork?: (title: string, content: string) => void;
}

export interface ContactInfo {
  fullName: string;
  rollNo: string;
  email: string;
  phone: string;
  degree: string;
  college: string;
  cgpa: string;
  location: string;
  linkedin: string;
  github: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  role: string;
  techStack: string;
  description: string;
}

export interface InternshipItem {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface ResumeDataState {
  enabledSections: string[]; // List of section types currently enabled
  contact: ContactInfo;
  objective: string;
  technicalSkills: string[];
  softSkills: string[];
  projects: ProjectItem[];
  internships: InternshipItem[];
  certifications: string[];
  achievements: string[];
}

const SECTION_DEFINITIONS = [
  { id: 'contact', title: '1. Contact & Academic Info', icon: User },
  { id: 'objective', title: '2. Career Objective', icon: Target },
  { id: 'skills', title: '3. Technical & Soft Skills', icon: Code },
  { id: 'projects', title: '4. Projects', icon: Layers },
  { id: 'internships', title: '5. Internships', icon: Briefcase },
  { id: 'certifications', title: '6. Certifications & Achievements', icon: Award }
];

const INITIAL_RESUME_DATA: ResumeDataState = {
  enabledSections: ['contact', 'objective', 'skills', 'projects', 'internships', 'certifications'],
  contact: {
    fullName: 'Anil Kumar',
    rollNo: '264G1A0501',
    email: 'student.cse26@srit.ac.in',
    phone: '+91 98765 43210',
    degree: 'B.Tech in Computer Science & Engineering (R26)',
    college: 'Srinivasa Ramanujan Institute of Technology (SRIT)',
    cgpa: '9.2 / 10.0',
    location: 'Anantapur, Andhra Pradesh',
    linkedin: 'linkedin.com/in/student-cse-srit',
    github: 'github.com/student-cse-srit'
  },
  objective: 'First-Year B.Tech Computer Science Engineering student at SRIT with a solid foundation in C, Data Structures, and Python. Seeking a technical internship to apply algorithmic problem-solving and modern web engineering skills to high-impact projects.',
  technicalSkills: ['C Programming', 'Data Structures', 'Python', 'React.js', 'HTML5/CSS3', 'Git/GitHub', 'SQL'],
  softSkills: ['Technical Communication', 'Team Collaboration', 'Problem Solving', 'Time Management'],
  projects: [
    {
      id: 'p-1',
      title: 'SAILL - AI Language Laboratory PWA',
      role: 'Lead Developer',
      techStack: 'React, TypeScript, IndexedDB, Tailwind CSS',
      description: 'Engineered an offline-first Progressive Web Application with 10 interactive modules for 500+ engineering students under JNTUA R26 Communicative English curriculum.'
    },
    {
      id: 'p-2',
      title: 'Smart Campus Facility Management System',
      role: 'Full-Stack Contributor',
      techStack: 'Python, Flask, MySQL',
      description: 'Developed an automated issue tracking dashboard for campus infrastructure, streamlining grievance resolution by 35%.'
    }
  ],
  internships: [
    {
      id: 'i-1',
      company: 'Tech Solutions India (Virtual)',
      role: 'Web Development Intern',
      duration: 'May 2026 - June 2026',
      description: 'Built responsive UI components using React and optimized web asset rendering speeds across desktop and mobile viewports.'
    }
  ],
  certifications: [
    'NPTEL Online Certification in Programming in Java (Elite)',
    'Coursera Python for Everybody Specialization',
    'HackerRank Problem Solving (Intermediate) Certificate'
  ],
  achievements: [
    'First Prize in Annual SRIT Hackathon 2026 (Web Category)',
    'Ranked in Top 5% in District Level Mathematics Olympiad'
  ]
};

const STORAGE_KEY = 'srit_ats_resume_builder_v3_data';

export const ResumeBuilderTool: React.FC<ResumeBuilderToolProps> = ({ onSaveWork }) => {
  const [resumeData, setResumeData] = useState<ResumeDataState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_RESUME_DATA,
          ...parsed,
          contact: { ...INITIAL_RESUME_DATA.contact, ...(parsed.contact || {}) },
          enabledSections: parsed.enabledSections || INITIAL_RESUME_DATA.enabledSections
        };
      }
    } catch (e) {
      console.warn('Failed to load saved resume builder state', e);
    }
    return INITIAL_RESUME_DATA;
  });

  const [selectedSectionToAdd, setSelectedSectionToAdd] = useState<string>('contact');
  const [newSkill, setNewSkill] = useState('');
  const [newSoftSkill, setNewSoftSkill] = useState('');
  const [newCert, setNewCert] = useState('');
  const [newAchievement, setNewAchievement] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [activeMessage, setActiveMessage] = useState<string | null>(null);

  // Auto-persist changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
    } catch (e) {
      console.error('Failed to auto-save resume builder state', e);
    }
  }, [resumeData]);

  // Section Add / Remove Handlers
  const handleAddSection = () => {
    if (!resumeData.enabledSections.includes(selectedSectionToAdd)) {
      setResumeData(prev => ({
        ...prev,
        enabledSections: [...prev.enabledSections, selectedSectionToAdd]
      }));
      const foundDef = SECTION_DEFINITIONS.find(s => s.id === selectedSectionToAdd);
      setActiveMessage(`Added "${foundDef?.title || selectedSectionToAdd}" section`);
      setTimeout(() => setActiveMessage(null), 2500);
    } else {
      setActiveMessage(`"${SECTION_DEFINITIONS.find(s => s.id === selectedSectionToAdd)?.title}" is already active`);
      setTimeout(() => setActiveMessage(null), 2500);
    }
  };

  const handleRemoveSection = (sectionId: string) => {
    setResumeData(prev => ({
      ...prev,
      enabledSections: prev.enabledSections.filter(id => id !== sectionId)
    }));
    const foundDef = SECTION_DEFINITIONS.find(s => s.id === sectionId);
    setActiveMessage(`Removed "${foundDef?.title || sectionId}" section`);
    setTimeout(() => setActiveMessage(null), 2500);
  };

  // Contact Field Update
  const updateContact = (field: keyof ContactInfo, val: string) => {
    setResumeData(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: val }
    }));
  };

  // Skill Handlers
  const handleAddTechSkill = () => {
    if (newSkill.trim() && !resumeData.technicalSkills.includes(newSkill.trim())) {
      setResumeData(prev => ({
        ...prev,
        technicalSkills: [...prev.technicalSkills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveTechSkill = (skill: string) => {
    setResumeData(prev => ({
      ...prev,
      technicalSkills: prev.technicalSkills.filter(s => s !== skill)
    }));
  };

  const handleAddSoftSkill = () => {
    if (newSoftSkill.trim() && !resumeData.softSkills.includes(newSoftSkill.trim())) {
      setResumeData(prev => ({
        ...prev,
        softSkills: [...prev.softSkills, newSoftSkill.trim()]
      }));
      setNewSoftSkill('');
    }
  };

  const handleRemoveSoftSkill = (skill: string) => {
    setResumeData(prev => ({
      ...prev,
      softSkills: prev.softSkills.filter(s => s !== skill)
    }));
  };

  // Project Handlers
  const handleAddProject = () => {
    const newProj: ProjectItem = {
      id: `p-${Date.now()}`,
      title: 'New Engineering Project',
      role: 'Project Contributor',
      techStack: 'Python / Java / Web',
      description: 'Describe the problem statement, engineering methodology, and measurable outcome achieved.'
    };
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, newProj]
    }));
  };

  const handleUpdateProject = (id: string, field: keyof ProjectItem, val: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, [field]: val } : p)
    }));
  };

  const handleRemoveProject = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id)
    }));
  };

  // Internship Handlers
  const handleAddInternship = () => {
    const newIntern: InternshipItem = {
      id: `i-${Date.now()}`,
      company: 'Organization / Company Name',
      role: 'Graduate Trainee / Intern',
      duration: 'Duration (e.g., June 2026 - July 2026)',
      description: 'Outlined key development tasks, frameworks utilized, and contributions to production modules.'
    };
    setResumeData(prev => ({
      ...prev,
      internships: [...prev.internships, newIntern]
    }));
  };

  const handleUpdateInternship = (id: string, field: keyof InternshipItem, val: string) => {
    setResumeData(prev => ({
      ...prev,
      internships: prev.internships.map(i => i.id === id ? { ...i, [field]: val } : i)
    }));
  };

  const handleRemoveInternship = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      internships: prev.internships.filter(i => i.id !== id)
    }));
  };

  // Certifications & Achievements Handlers
  const handleAddCert = () => {
    if (newCert.trim()) {
      setResumeData(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCert.trim()]
      }));
      setNewCert('');
    }
  };

  const handleRemoveCert = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const handleAddAchievement = () => {
    if (newAchievement.trim()) {
      setResumeData(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()]
      }));
      setNewAchievement('');
    }
  };

  const handleRemoveAchievement = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveToPortfolio = () => {
    const resumeString = JSON.stringify(resumeData, null, 2);
    if (onSaveWork) {
      onSaveWork(`ATS Resume: ${resumeData.contact.fullName}`, resumeString);
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleResetToDefault = () => {
    if (window.confirm('Reset ATS Resume to default template? Any unsaved edits will be refreshed.')) {
      setResumeData(INITIAL_RESUME_DATA);
      setActiveMessage('Reset to standard template');
      setTimeout(() => setActiveMessage(null), 2500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-md">
                Interactive Tool
              </span>
              <span className="text-xs text-slate-400 font-medium">ATS Compliant Layout Engine</span>
            </div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              <span>ATS Resume Builder Form</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Add, edit, and arrange 6 standard resume sections. Changes reflect instantly in the ATS-compliant preview.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSaveToPortfolio}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isSaved ? 'Saved to Portfolio!' : 'Save Resume'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={handleResetToDefault}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition flex items-center gap-1"
              title="Reset to default template"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Status Notification */}
        {activeMessage && (
          <div className="mt-3 p-2 bg-indigo-950/80 border border-indigo-700/60 rounded-lg text-xs text-indigo-200 flex items-center gap-2 animate-in fade-in duration-150">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{activeMessage}</span>
          </div>
        )}
      </div>

      {/* Main Grid: Form Editor & Real-Time ATS Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form Editor (6 Columns) */}
        <div className="lg:col-span-6 space-y-5">
          
          {/* Dynamic Section Adder Toolbar */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-indigo-400 tracking-wider flex items-center gap-1.5">
                <Plus className="w-4 h-4" /> Add / Manage Resume Sections
              </span>
              <span className="text-[11px] text-slate-400">
                {resumeData.enabledSections.length} of 6 Sections Active
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <select
                  value={selectedSectionToAdd}
                  onChange={(e) => setSelectedSectionToAdd(e.target.value)}
                  className="w-full appearance-none bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 pr-8 font-medium"
                >
                  {SECTION_DEFINITIONS.map(def => {
                    const isEnabled = resumeData.enabledSections.includes(def.id);
                    return (
                      <option key={def.id} value={def.id}>
                        {def.title} {isEnabled ? '✓ (Active)' : '+ (Available)'}
                      </option>
                    );
                  })}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>

              <button
                type="button"
                onClick={handleAddSection}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>

            {/* Quick Section Toggle Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {SECTION_DEFINITIONS.map(def => {
                const isEnabled = resumeData.enabledSections.includes(def.id);
                return (
                  <button
                    key={def.id}
                    type="button"
                    onClick={() => {
                      if (isEnabled) {
                        handleRemoveSection(def.id);
                      } else {
                        setResumeData(prev => ({ ...prev, enabledSections: [...prev.enabledSections, def.id] }));
                        setActiveMessage(`Added "${def.title}" section`);
                        setTimeout(() => setActiveMessage(null), 2500);
                      }
                    }}
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1 border ${
                      isEnabled
                        ? 'bg-indigo-950/80 border-indigo-600/80 text-indigo-200'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600'
                    }`}
                  >
                    <span>{isEnabled ? '✓' : '+'}</span>
                    <span>{def.title.replace(/^\d+\.\s*/, '')}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 1: Contact & Academic Info */}
          {resumeData.enabledSections.includes('contact') && (
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-md space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-2.5">
                <h4 className="text-xs font-bold uppercase text-indigo-400 tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-400" />
                  <span>1. Contact & Academic Info</span>
                </h4>
                <button
                  type="button"
                  onClick={() => handleRemoveSection('contact')}
                  className="text-slate-400 hover:text-rose-400 transition p-1"
                  title="Remove this section"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={resumeData.contact.fullName}
                    onChange={(e) => updateContact('fullName', e.target.value)}
                    placeholder="Candidate Name"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Roll Number</label>
                  <input
                    type="text"
                    value={resumeData.contact.rollNo}
                    onChange={(e) => updateContact('rollNo', e.target.value)}
                    placeholder="e.g. 264G1A0501"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={resumeData.contact.email}
                    onChange={(e) => updateContact('email', e.target.value)}
                    placeholder="Official / College Email"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={resumeData.contact.phone}
                    onChange={(e) => updateContact('phone', e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Degree & Branch</label>
                  <input
                    type="text"
                    value={resumeData.contact.degree}
                    onChange={(e) => updateContact('degree', e.target.value)}
                    placeholder="B.Tech in Computer Science & Engineering"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">College / Institution</label>
                  <input
                    type="text"
                    value={resumeData.contact.college}
                    onChange={(e) => updateContact('college', e.target.value)}
                    placeholder="Srinivasa Ramanujan Institute of Technology (SRIT)"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">CGPA / Percentage</label>
                  <input
                    type="text"
                    value={resumeData.contact.cgpa}
                    onChange={(e) => updateContact('cgpa', e.target.value)}
                    placeholder="9.2 / 10.0"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Location / City</label>
                  <input
                    type="text"
                    value={resumeData.contact.location}
                    onChange={(e) => updateContact('location', e.target.value)}
                    placeholder="Anantapur, Andhra Pradesh"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">LinkedIn / GitHub</label>
                  <input
                    type="text"
                    value={resumeData.contact.linkedin}
                    onChange={(e) => updateContact('linkedin', e.target.value)}
                    placeholder="linkedin.com/in/username"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: Career Objective */}
          {resumeData.enabledSections.includes('objective') && (
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-md space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-2.5">
                <h4 className="text-xs font-bold uppercase text-indigo-400 tracking-wider flex items-center gap-2">
                  <Target className="w-4 h-4 text-indigo-400" />
                  <span>2. Career Objective</span>
                </h4>
                <button
                  type="button"
                  onClick={() => handleRemoveSection('objective')}
                  className="text-slate-400 hover:text-rose-400 transition p-1"
                  title="Remove this section"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Professional Objective Statement (2-3 Sentences)
                </label>
                <textarea
                  rows={3}
                  value={resumeData.objective}
                  onChange={(e) => setResumeData(prev => ({ ...prev, objective: e.target.value }))}
                  placeholder="State your domain, core technical competencies, and the value you bring to the engineering organization."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-white focus:border-indigo-500 focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* SECTION 3: Technical & Soft Skills */}
          {resumeData.enabledSections.includes('skills') && (
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-md space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-2.5">
                <h4 className="text-xs font-bold uppercase text-indigo-400 tracking-wider flex items-center gap-2">
                  <Code className="w-4 h-4 text-indigo-400" />
                  <span>3. Technical & Soft Skills</span>
                </h4>
                <button
                  type="button"
                  onClick={() => handleRemoveSection('skills')}
                  className="text-slate-400 hover:text-rose-400 transition p-1"
                  title="Remove this section"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Technical Skills Sub-Section */}
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-slate-300 block">Technical Skills & Languages</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTechSkill())}
                    placeholder="Add technical skill (e.g. Java, Docker, Git)"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddTechSkill}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {resumeData.technicalSkills.map((s, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-900 border border-slate-700 text-slate-200 text-xs px-2.5 py-1 rounded-md flex items-center gap-1.5"
                    >
                      <span>{s}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTechSkill(s)}
                        className="text-slate-400 hover:text-rose-400 text-sm font-bold leading-none"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Soft Skills Sub-Section */}
              <div className="space-y-2 pt-2 border-t border-slate-700/60">
                <label className="text-[11px] font-semibold text-slate-300 block">Soft & Communication Skills</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSoftSkill}
                    onChange={(e) => setNewSoftSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSoftSkill())}
                    placeholder="Add soft skill (e.g. Critical Thinking, Public Speaking)"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddSoftSkill}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {resumeData.softSkills.map((s, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-900 border border-slate-700 text-indigo-200 text-xs px-2.5 py-1 rounded-md flex items-center gap-1.5"
                    >
                      <span>{s}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSoftSkill(s)}
                        className="text-slate-400 hover:text-rose-400 text-sm font-bold leading-none"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: Projects */}
          {resumeData.enabledSections.includes('projects') && (
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-md space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-2.5">
                <h4 className="text-xs font-bold uppercase text-indigo-400 tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <span>4. Projects ({resumeData.projects.length})</span>
                </h4>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAddProject}
                    className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Project</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveSection('projects')}
                    className="text-slate-400 hover:text-rose-400 transition p-1"
                    title="Remove this section"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {resumeData.projects.map((proj, idx) => (
                  <div key={proj.id} className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">
                        Project #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveProject(proj.id)}
                        className="text-slate-400 hover:text-rose-400 text-xs flex items-center gap-1 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => handleUpdateProject(proj.id, 'title', e.target.value)}
                        placeholder="Project Title"
                        className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={proj.role}
                        onChange={(e) => handleUpdateProject(proj.id, 'role', e.target.value)}
                        placeholder="Role (e.g. Lead Developer)"
                        className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    <input
                      type="text"
                      value={proj.techStack}
                      onChange={(e) => handleUpdateProject(proj.id, 'techStack', e.target.value)}
                      placeholder="Tech Stack (e.g. React, TypeScript, MySQL)"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                    />

                    <textarea
                      rows={2}
                      value={proj.description}
                      onChange={(e) => handleUpdateProject(proj.id, 'description', e.target.value)}
                      placeholder="Bullet point description of problem, method, and measurable impact."
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none leading-relaxed"
                    />
                  </div>
                ))}

                {resumeData.projects.length === 0 && (
                  <div className="text-center py-4 border border-dashed border-slate-700 rounded-xl">
                    <p className="text-xs text-slate-400">No projects added yet.</p>
                    <button
                      type="button"
                      onClick={handleAddProject}
                      className="mt-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold"
                    >
                      + Add First Project
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECTION 5: Internships */}
          {resumeData.enabledSections.includes('internships') && (
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-md space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-2.5">
                <h4 className="text-xs font-bold uppercase text-indigo-400 tracking-wider flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-400" />
                  <span>5. Internships ({resumeData.internships.length})</span>
                </h4>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAddInternship}
                    className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Internship</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveSection('internships')}
                    className="text-slate-400 hover:text-rose-400 transition p-1"
                    title="Remove this section"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {resumeData.internships.map((intern, idx) => (
                  <div key={intern.id} className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">
                        Internship #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveInternship(intern.id)}
                        className="text-slate-400 hover:text-rose-400 text-xs flex items-center gap-1 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={intern.company}
                        onChange={(e) => handleUpdateInternship(intern.id, 'company', e.target.value)}
                        placeholder="Company / Organization"
                        className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={intern.role}
                        onChange={(e) => handleUpdateInternship(intern.id, 'role', e.target.value)}
                        placeholder="Role / Title (e.g. Intern)"
                        className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    <input
                      type="text"
                      value={intern.duration}
                      onChange={(e) => handleUpdateInternship(intern.id, 'duration', e.target.value)}
                      placeholder="Duration (e.g. May 2026 - June 2026)"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                    />

                    <textarea
                      rows={2}
                      value={intern.description}
                      onChange={(e) => handleUpdateInternship(intern.id, 'description', e.target.value)}
                      placeholder="Key contributions, frameworks used, and deliverables achieved."
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none leading-relaxed"
                    />
                  </div>
                ))}

                {resumeData.internships.length === 0 && (
                  <div className="text-center py-4 border border-dashed border-slate-700 rounded-xl">
                    <p className="text-xs text-slate-400">No internships added yet.</p>
                    <button
                      type="button"
                      onClick={handleAddInternship}
                      className="mt-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold"
                    >
                      + Add First Internship
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECTION 6: Certifications & Achievements */}
          {resumeData.enabledSections.includes('certifications') && (
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-md space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-2.5">
                <h4 className="text-xs font-bold uppercase text-indigo-400 tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-400" />
                  <span>6. Certifications & Achievements</span>
                </h4>
                <button
                  type="button"
                  onClick={() => handleRemoveSection('certifications')}
                  className="text-slate-400 hover:text-rose-400 transition p-1"
                  title="Remove this section"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Certifications Sub-list */}
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-slate-300 block">Certifications & Courses</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCert}
                    onChange={(e) => setNewCert(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCert())}
                    placeholder="Add certification (e.g. NPTEL Programming in Java)"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddCert}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold"
                  >
                    Add
                  </button>
                </div>

                <ul className="space-y-1.5 pt-1">
                  {resumeData.certifications.map((c, idx) => (
                    <li
                      key={idx}
                      className="bg-slate-900 border border-slate-700/80 text-slate-200 text-xs px-3 py-1.5 rounded-lg flex items-center justify-between gap-2"
                    >
                      <span className="truncate">• {c}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCert(idx)}
                        className="text-slate-400 hover:text-rose-400 transition shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Achievements Sub-list */}
              <div className="space-y-2 pt-2 border-t border-slate-700/60">
                <label className="text-[11px] font-semibold text-slate-300 block">Honors & Hackathon Achievements</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newAchievement}
                    onChange={(e) => setNewAchievement(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAchievement())}
                    placeholder="Add achievement (e.g. 1st Place SRIT Hackathon)"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddAchievement}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold"
                  >
                    Add
                  </button>
                </div>

                <ul className="space-y-1.5 pt-1">
                  {resumeData.achievements.map((a, idx) => (
                    <li
                      key={idx}
                      className="bg-slate-900 border border-slate-700/80 text-amber-200 text-xs px-3 py-1.5 rounded-lg flex items-center justify-between gap-2"
                    >
                      <span className="truncate">• {a}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAchievement(idx)}
                        className="text-slate-400 hover:text-rose-400 transition shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: ATS Live Printable Resume Preview (6 Columns) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-3 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span>ATS Live Single-Column Preview</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">100% compliant with standard Applicant Tracking Systems</p>
                </div>
                <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-700/60 px-2 py-0.5 rounded-md font-bold">
                  ATS Score: 96/100
                </span>
              </div>

              {/* White Document Container (ATS Standard Formatting) */}
              <div className="bg-white text-slate-900 p-7 rounded-xl shadow-inner font-sans text-xs space-y-4 max-h-[750px] overflow-y-auto border border-slate-300">
                
                {/* 1. Contact & Academic Header */}
                {resumeData.enabledSections.includes('contact') && (
                  <div className="text-center border-b-2 border-slate-800 pb-3">
                    <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900">
                      {resumeData.contact.fullName || 'Candidate Name'}
                    </h2>
                    <p className="text-[11px] text-slate-700 font-semibold mt-1">
                      Roll No: {resumeData.contact.rollNo || '264G1A0501'} • {resumeData.contact.degree}
                    </p>
                    <p className="text-[10px] text-slate-600 mt-0.5">
                      {resumeData.contact.college} • CGPA: {resumeData.contact.cgpa}
                    </p>
                    <p className="text-[10px] text-slate-600 mt-0.5">
                      {resumeData.contact.email} | {resumeData.contact.phone} | {resumeData.contact.location}
                    </p>
                    {resumeData.contact.linkedin && (
                      <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
                        {resumeData.contact.linkedin}
                      </p>
                    )}
                  </div>
                )}

                {/* 2. Career Objective */}
                {resumeData.enabledSections.includes('objective') && resumeData.objective && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wide text-slate-900 border-b border-slate-300 pb-1 mb-1.5">
                      Career Objective
                    </h3>
                    <p className="text-slate-700 leading-relaxed text-[11px]">
                      {resumeData.objective}
                    </p>
                  </div>
                )}

                {/* 3. Technical & Soft Skills */}
                {resumeData.enabledSections.includes('skills') && (resumeData.technicalSkills.length > 0 || resumeData.softSkills.length > 0) && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wide text-slate-900 border-b border-slate-300 pb-1 mb-1.5">
                      Technical & Soft Skills
                    </h3>
                    {resumeData.technicalSkills.length > 0 && (
                      <p className="text-slate-800 text-[11px] leading-relaxed">
                        <strong className="font-semibold text-slate-900">Technical Competencies:</strong> {resumeData.technicalSkills.join(' • ')}
                      </p>
                    )}
                    {resumeData.softSkills.length > 0 && (
                      <p className="text-slate-800 text-[11px] leading-relaxed mt-1">
                        <strong className="font-semibold text-slate-900">Professional Skills:</strong> {resumeData.softSkills.join(' • ')}
                      </p>
                    )}
                  </div>
                )}

                {/* 4. Projects */}
                {resumeData.enabledSections.includes('projects') && resumeData.projects.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wide text-slate-900 border-b border-slate-300 pb-1 mb-1.5">
                      Engineering Projects
                    </h3>
                    <div className="space-y-2.5">
                      {resumeData.projects.map((p) => (
                        <div key={p.id}>
                          <div className="flex justify-between items-baseline font-bold text-slate-900 text-[11px]">
                            <span>{p.title}</span>
                            <span className="italic font-medium text-[10px] text-slate-600">{p.role}</span>
                          </div>
                          {p.techStack && (
                            <p className="text-[10px] font-semibold text-indigo-900">
                              Tech Stack: {p.techStack}
                            </p>
                          )}
                          <p className="text-slate-700 leading-normal text-[10px] mt-0.5">
                            {p.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. Internships */}
                {resumeData.enabledSections.includes('internships') && resumeData.internships.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wide text-slate-900 border-b border-slate-300 pb-1 mb-1.5">
                      Internships & Practical Training
                    </h3>
                    <div className="space-y-2.5">
                      {resumeData.internships.map((i) => (
                        <div key={i.id}>
                          <div className="flex justify-between items-baseline font-bold text-slate-900 text-[11px]">
                            <span>{i.company}</span>
                            <span className="font-medium text-[10px] text-slate-600">{i.duration}</span>
                          </div>
                          <p className="text-[10px] font-semibold text-slate-800 italic">
                            Role: {i.role}
                          </p>
                          <p className="text-slate-700 leading-normal text-[10px] mt-0.5">
                            {i.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. Certifications & Achievements */}
                {resumeData.enabledSections.includes('certifications') && (resumeData.certifications.length > 0 || resumeData.achievements.length > 0) && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wide text-slate-900 border-b border-slate-300 pb-1 mb-1.5">
                      Certifications & Achievements
                    </h3>
                    {resumeData.certifications.length > 0 && (
                      <div className="mb-1.5">
                        <strong className="text-[10px] font-bold text-slate-900 uppercase block mb-0.5">Certifications:</strong>
                        <ul className="list-disc pl-4 space-y-0.5 text-[10px] text-slate-700">
                          {resumeData.certifications.map((c, idx) => (
                            <li key={idx}>{c}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {resumeData.achievements.length > 0 && (
                      <div>
                        <strong className="text-[10px] font-bold text-slate-900 uppercase block mb-0.5">Honors & Awards:</strong>
                        <ul className="list-disc pl-4 space-y-0.5 text-[10px] text-slate-700">
                          {resumeData.achievements.map((a, idx) => (
                            <li key={idx}>{a}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
