import React, { useState } from 'react';
import {
  Linkedin,
  Camera,
  Sparkles,
  Save,
  CheckCircle2,
  Copy,
  ExternalLink,
  Award,
  BookOpen,
  FolderGit2,
  UserCheck,
  Zap,
  Globe
} from 'lucide-react';
import { EtiquetteBrandingCoach } from '../../../services/ai/etiquetteBrandingCoach';
import { dbStorage } from '../../../lib/db';

export const LinkedInProfileBuilder: React.FC<{
  onSaveWorkToPortfolio?: (title: string, content: string) => void;
}> = ({ onSaveWorkToPortfolio }) => {
  const [profileData, setProfileData] = useState({
    customUrl: 'linkedin.com/in/student-name-srit',
    headline: 'B.Tech Computer Science & Engineering Student @ SRIT | Python & AI Specialist | Building IoT Systems',
    about: 'Passionate B.Tech Computer Science student at Srinivasa Ramanujan Institute of Technology (SRIT) specializing in intelligent software solutions and cloud architecture. Dedicated to building reliable, high-performance applications while applying IEEE engineering standards.',
    education: 'Bachelor of Technology (B.Tech) - Computer Science & Engineering, Srinivasa Ramanujan Institute of Technology (2023 - 2027)',
    projects: 'SRIT R26 Communicative English & AI Laboratory Platform, IoT Smart Grid Sensor Node',
    skills: 'Java, Python, React.js, IEEE Technical Writing, Professional Netiquette, Team Leadership',
    certifications: 'IEEE Student Member, AWS Academy Cloud Foundations, SRIT R26 Laboratory Excellence',
    experience: 'Software Engineering Intern @ TechSolutions (Summer 2025)',
    achievements: 'First Prize - SRIT Technical Symposium CodeFest 2025',
    volunteerWork: 'Student Coordinator - SRIT NSS Community Science Awareness Drive',
    featured: 'B.Tech Capstone Technical Project Report (PDF), Presentation Deck on Smart Grid Systems'
  });

  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [activeAiSection, setActiveAiSection] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string>('');

  const photoChecklist = [
    { label: 'High-resolution photo with clear lighting on face', checked: true },
    { label: 'Neutral, clutter-free or campus background', checked: true },
    { label: 'Formal or business casual attire (collared shirt/blazer)', checked: true },
    { label: 'Warm, approachable professional smile', checked: true },
    { label: 'Framed from shoulders up (face occupies 60% of frame)', checked: true }
  ];

  const handleGenerateAiSuggestions = (section: 'headline' | 'about' | 'skills' | 'projects') => {
    setActiveAiSection(section);
    const suggestions = EtiquetteBrandingCoach.generateLinkedInSuggestions(section, {
      branch: 'Computer Science & Engineering',
      specialization: 'Software Architecture & AI',
      coreStrengths: ['Problem Solving', 'IEEE Technical Writing'],
      careerValues: ['Innovation', 'Integrity'],
      targetRole: 'Software Engineer',
      keyProjects: 'Smart Grid IoT Monitoring'
    });

    if (typeof suggestions[0] === 'string') {
      setAiSuggestions(suggestions as string[]);
    } else {
      setAiSuggestions(suggestions.map((s: any) => `${s.title}: ${s.description}`));
    }
  };

  const handleApplySuggestion = (text: string) => {
    if (activeAiSection === 'headline') {
      setProfileData((prev) => ({ ...prev, headline: text }));
    } else if (activeAiSection === 'about') {
      setProfileData((prev) => ({ ...prev, about: text }));
    } else if (activeAiSection === 'skills') {
      setProfileData((prev) => ({ ...prev, skills: `${prev.skills}, ${text}` }));
    } else if (activeAiSection === 'projects') {
      setProfileData((prev) => ({ ...prev, projects: `${prev.projects}\n• ${text}` }));
    }
    setAiSuggestions([]);
    setActiveAiSection(null);
  };

  const handleSaveProfile = async () => {
    setSaveStatus('Saving LinkedIn Profile Draft to IndexedDB...');

    const fullContent = `LINKEDIN PROFILE DRAFT - SRIT R26
Custom URL: ${profileData.customUrl}
Headline: ${profileData.headline}
About:
${profileData.about}

Education: ${profileData.education}
Projects: ${profileData.projects}
Skills: ${profileData.skills}
Certifications: ${profileData.certifications}
Experience: ${profileData.experience}
Achievements: ${profileData.achievements}
Volunteer Work: ${profileData.volunteerWork}
Featured Section: ${profileData.featured}`;

    await dbStorage.savePortfolioItem({
      id: `linkedin-profile-${Date.now()}`,
      moduleId: 'etiquette-branding',
      moduleTitle: 'Etiquette, Netiquette & Personal Branding',
      title: 'LinkedIn Profile Optimization Draft',
      category: 'written',
      content: fullContent,
      score: 95,
      createdAt: new Date().toISOString()
    });

    if (onSaveWorkToPortfolio) {
      onSaveWorkToPortfolio('LinkedIn Profile Draft', fullContent);
    }

    setSaveStatus('LinkedIn Profile successfully saved to Portfolio & IndexedDB!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
        <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-blue-600">
              <Linkedin className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#D35400] font-heading">
                4. LinkedIn Profile Builder (R26 Syllabus)
              </h2>
              <p className="text-xs text-[#2C3E50]">
                Build and optimize all 12 core sections of your professional LinkedIn presence with real-time AI assistance.
              </p>
            </div>
          </div>

          <button
            onClick={handleSaveProfile}
            className="px-4 py-2 bg-[#D35400] text-white rounded-xl text-xs font-bold hover:bg-[#B94600] transition flex items-center gap-2 shadow-2xs"
          >
            <Save className="w-4 h-4" />
            Save Profile Draft
          </button>
        </div>

        {saveStatus && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{saveStatus}</span>
          </div>
        )}

        {/* Section 1: Photo Guidelines Card */}
        <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-[#D35400]">
            <Camera className="w-5 h-5 text-[#D35400]" />
            <h3 className="text-xs font-bold uppercase tracking-wider font-heading">
              1. Professional Profile Photo Standards
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-white rounded-lg border border-gray-200 space-y-2">
              <span className="text-xs font-bold text-[#D35400]">Profile Picture Checklist:</span>
              <ul className="space-y-1.5 text-xs text-[#2C3E50]">
                {photoChecklist.map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
              <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-blue-600" />
                Custom LinkedIn URL Setup:
              </span>
              <p className="text-xs text-blue-950">
                A clean custom URL makes your profile easily scannable on resume headers and email signatures.
              </p>
              <input
                type="text"
                value={profileData.customUrl}
                onChange={(e) => setProfileData({ ...profileData, customUrl: e.target.value })}
                className="w-full p-2 bg-white border border-blue-300 rounded text-xs font-mono text-blue-900"
              />
            </div>
          </div>
        </div>

        {/* LinkedIn Sections Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Headline */}
          <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#D35400]">2. Professional Headline</label>
              <button
                onClick={() => handleGenerateAiSuggestions('headline')}
                className="text-[10px] font-bold text-[#D35400] bg-[#FFF8F0] px-2 py-1 rounded border border-[#FAD7A0] flex items-center gap-1 hover:bg-[#FAD7A0]"
              >
                <Sparkles className="w-3 h-3" />
                AI Headline Ideas
              </button>
            </div>
            <textarea
              value={profileData.headline}
              onChange={(e) => setProfileData({ ...profileData, headline: e.target.value })}
              rows={2}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-[#D35400]"
            />
          </div>

          {/* About Section */}
          <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#D35400]">3. About Section (Summary)</label>
              <button
                onClick={() => handleGenerateAiSuggestions('about')}
                className="text-[10px] font-bold text-[#D35400] bg-[#FFF8F0] px-2 py-1 rounded border border-[#FAD7A0] flex items-center gap-1 hover:bg-[#FAD7A0]"
              >
                <Sparkles className="w-3 h-3" />
                AI About Summary
              </button>
            </div>
            <textarea
              value={profileData.about}
              onChange={(e) => setProfileData({ ...profileData, about: e.target.value })}
              rows={3}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-[#D35400]"
            />
          </div>

          {/* Education */}
          <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-2">
            <label className="text-xs font-bold text-[#D35400]">4. Education</label>
            <input
              type="text"
              value={profileData.education}
              onChange={(e) => setProfileData({ ...profileData, education: e.target.value })}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-xs"
            />
          </div>

          {/* Projects */}
          <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#D35400]">5. Projects</label>
              <button
                onClick={() => handleGenerateAiSuggestions('projects')}
                className="text-[10px] font-bold text-[#D35400] bg-[#FFF8F0] px-2 py-1 rounded border border-[#FAD7A0] flex items-center gap-1 hover:bg-[#FAD7A0]"
              >
                <Sparkles className="w-3 h-3" />
                AI Project Ideas
              </button>
            </div>
            <input
              type="text"
              value={profileData.projects}
              onChange={(e) => setProfileData({ ...profileData, projects: e.target.value })}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-xs"
            />
          </div>

          {/* Skills */}
          <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#D35400]">6. Skills & Endorsements</label>
              <button
                onClick={() => handleGenerateAiSuggestions('skills')}
                className="text-[10px] font-bold text-[#D35400] bg-[#FFF8F0] px-2 py-1 rounded border border-[#FAD7A0] flex items-center gap-1 hover:bg-[#FAD7A0]"
              >
                <Sparkles className="w-3 h-3" />
                AI Skill Recs
              </button>
            </div>
            <input
              type="text"
              value={profileData.skills}
              onChange={(e) => setProfileData({ ...profileData, skills: e.target.value })}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-xs"
            />
          </div>

          {/* Certifications */}
          <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-2">
            <label className="text-xs font-bold text-[#D35400]">7. Licenses & Certifications</label>
            <input
              type="text"
              value={profileData.certifications}
              onChange={(e) => setProfileData({ ...profileData, certifications: e.target.value })}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-xs"
            />
          </div>

          {/* Experience */}
          <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-2">
            <label className="text-xs font-bold text-[#D35400]">8. Experience & Internships</label>
            <input
              type="text"
              value={profileData.experience}
              onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-xs"
            />
          </div>

          {/* Achievements */}
          <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-2">
            <label className="text-xs font-bold text-[#D35400]">9. Honors & Achievements</label>
            <input
              type="text"
              value={profileData.achievements}
              onChange={(e) => setProfileData({ ...profileData, achievements: e.target.value })}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-xs"
            />
          </div>

          {/* Volunteer Work */}
          <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-2">
            <label className="text-xs font-bold text-[#D35400]">10. Volunteer Experience</label>
            <input
              type="text"
              value={profileData.volunteerWork}
              onChange={(e) => setProfileData({ ...profileData, volunteerWork: e.target.value })}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-xs"
            />
          </div>

          {/* Featured Section */}
          <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-2">
            <label className="text-xs font-bold text-[#D35400]">11. Featured Content & Documents</label>
            <input
              type="text"
              value={profileData.featured}
              onChange={(e) => setProfileData({ ...profileData, featured: e.target.value })}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-xs"
            />
          </div>
        </div>

        {/* AI Suggestions Modal Box */}
        {aiSuggestions.length > 0 && (
          <div className="p-4 bg-[#FFF8F0] border border-[#D35400] rounded-xl space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-2">
              <span className="text-xs font-bold text-[#D35400] font-heading flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#E67E22]" />
                AI Generated Suggestions ({activeAiSection?.toUpperCase()}):
              </span>
              <button
                onClick={() => setAiSuggestions([])}
                className="text-[10px] text-gray-500 font-bold hover:text-[#D35400]"
              >
                Close
              </button>
            </div>

            <div className="space-y-2">
              {aiSuggestions.map((sug, i) => (
                <div key={i} className="p-3 bg-white border border-gray-200 rounded-lg space-y-2 text-xs">
                  <p className="text-[#2C3E50] leading-relaxed whitespace-pre-wrap">{sug}</p>
                  <button
                    onClick={() => handleApplySuggestion(sug)}
                    className="px-3 py-1 bg-[#D35400] text-white rounded text-[10px] font-bold hover:bg-[#B94600] transition flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    Apply To Profile
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
