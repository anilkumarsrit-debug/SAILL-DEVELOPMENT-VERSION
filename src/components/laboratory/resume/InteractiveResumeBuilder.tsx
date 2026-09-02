import React, { useState, useEffect } from 'react';
import { User, Briefcase, GraduationCap, Code, Sparkles, Award, FileText, CheckCircle2, RotateCcw, Save, Eye, ArrowRight, BookOpen, Layers, Phone, Mail, MapPin, Globe, Linkedin, Github } from 'lucide-react';

interface ResumeData {
  personalInfo: {
    fullName: string;
    rollNumber: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
  };
  careerObjective: string;
  education: {
    degree: string;
    institution: string;
    duration: string;
    cgpa: string;
  }[];
  technicalSkills: {
    languages: string;
    frameworks: string;
    tools: string;
    concepts: string;
  };
  softSkills: string;
  projects: {
    title: string;
    techStack: string;
    description: string;
  }[];
  internships: {
    company: string;
    role: string;
    duration: string;
    description: string;
  }[];
  certifications: string;
  achievements: string;
  workExperience: string;
  languages: string;
  hobbies: string;
  references: string;
  declaration: string;
}

const defaultResumeData: ResumeData = {
  personalInfo: {
    fullName: 'Anil Kumar',
    rollNumber: '264G1A0501',
    email: 'anilkumar.264g1a0501@srit.ac.in',
    phone: '+91 98765 43210',
    location: 'Anantapur, Andhra Pradesh, India',
    linkedin: 'linkedin.com/in/anil-kumar-srit',
    github: 'github.com/anilkumar-srit'
  },
  careerObjective: 'First-Year B.Tech Computer Science Engineering student at Srinivasa Ramanujan Institute of Technology (SRIT) with a strong foundation in Data Structures, Java, and Python. Seeking a Software Engineering Internship to contribute to scalable web applications and refine problem-solving skills.',
  education: [
    {
      degree: 'B.Tech in Computer Science & Engineering (R26 Syllabus)',
      institution: 'Srinivasa Ramanujan Institute of Technology (SRIT), Anantapur',
      duration: '2026 - 2030 (Expected)',
      cgpa: '9.4 / 10.0 (Semester I)'
    },
    {
      degree: 'Intermediate (MPC - Mathematics, Physics, Chemistry)',
      institution: 'Sri Chaitanya Junior College, Anantapur',
      duration: '2024 - 2026',
      cgpa: '96.2%'
    }
  ],
  technicalSkills: {
    languages: 'Java, Python, C, C++, HTML5, CSS3, JavaScript (ES6+)',
    frameworks: 'React.js, Node.js, Express.js, Tailwind CSS',
    tools: 'Git, GitHub, VS Code, Linux CLI, Postman, MySQL',
    concepts: 'Data Structures & Algorithms, OOPs, Web Development, DBMS'
  },
  softSkills: 'Technical Communication, Problem Solving, Agile Collaboration, Time Management, Critical Thinking',
  projects: [
    {
      title: 'SRIT Campus Facilities Management Portal',
      techStack: 'React.js, Node.js, Express, MySQL',
      description: 'Engineered a full-stack facility feedback application used by 300+ campus students. Optimized database query performance by 30% using indexed SQL views.'
    },
    {
      title: 'Interactive Python Data Structure Visualizer',
      techStack: 'Python, Tkinter, Data Structures',
      description: 'Developed an offline GUI desktop tool to visualize stack, queue, and binary search tree operations step-by-step for First-Year C.S. lab practice.'
    }
  ],
  internships: [
    {
      company: 'Tech Solutions India (Virtual Internship)',
      role: 'Web Development Intern',
      duration: 'May 2026 - June 2026',
      description: 'Assisted in building responsive landing page components in React and optimized CSS rendering speed.'
    }
  ],
  certifications: 'NPTEL Online Certification in Programming in Java (Elite Grade), Coursera Python for Everybody Specialization',
  achievements: 'First Prize in Annual SRIT Hackathon 2026 (Web Category), 2nd Rank in District Level Mathematics Olympiad',
  workExperience: 'Peer Tutor for C Programming Laboratory at SRIT CSE Department',
  languages: 'English (Professional Proficiency), Telugu (Native), Hindi (Conversational)',
  hobbies: 'Competitive Coding on LeetCode/CodeChef, Technical Blogging, Chess',
  references: 'Dr. R. V. Sharma, Head of Department (CSE), SRIT Anantapur. Email: hod.cse@srit.ac.in',
  declaration: 'I hereby declare that all the information provided above is true and correct to the best of my knowledge and belief.'
};

interface InteractiveResumeBuilderProps {
  onCompleteActivity: () => void;
}

export const InteractiveResumeBuilder: React.FC<InteractiveResumeBuilderProps> = ({ onCompleteActivity }) => {
  const [data, setData] = useState<ResumeData>(() => {
    try {
      const saved = localStorage.getItem('srit_resume_builder_data');
      return saved ? JSON.parse(saved) : defaultResumeData;
    } catch {
      return defaultResumeData;
    }
  });

  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [activeSection, setActiveSection] = useState<string>('personal');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Auto-save effect
  useEffect(() => {
    try {
      localStorage.setItem('srit_resume_builder_data', JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save resume data', e);
    }
  }, [data]);

  const handleManualSave = () => {
    try {
      localStorage.setItem('srit_resume_builder_data', JSON.stringify(data));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetSection = (sectionKey: string) => {
    if (confirm(`Reset ${sectionKey} section to default values?`)) {
      if (sectionKey === 'personal') {
        setData((prev) => ({ ...prev, personalInfo: defaultResumeData.personalInfo }));
      } else if (sectionKey === 'objective') {
        setData((prev) => ({ ...prev, careerObjective: defaultResumeData.careerObjective }));
      } else if (sectionKey === 'skills') {
        setData((prev) => ({ ...prev, technicalSkills: defaultResumeData.technicalSkills, softSkills: defaultResumeData.softSkills }));
      } else if (sectionKey === 'projects') {
        setData((prev) => ({ ...prev, projects: defaultResumeData.projects }));
      } else {
        setData(defaultResumeData);
      }
    }
  };

  const formSections = [
    { id: 'personal', label: '1. Personal Info', icon: User },
    { id: 'objective', label: '2. Career Objective', icon: FileText },
    { id: 'education', label: '3. Education', icon: GraduationCap },
    { id: 'skills', label: '4. Tech & Soft Skills', icon: Code },
    { id: 'projects', label: '5. Projects', icon: Layers },
    { id: 'internships', label: '6. Internships & Work', icon: Briefcase },
    { id: 'certs', label: '7. Certifications & Honors', icon: Award },
    { id: 'misc', label: '8. Languages, Hobbies & Declaration', icon: BookOpen }
  ];

  return (
    <div className="space-y-6">
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#FAD7A0] pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest bg-[#D35400] text-white px-2 py-0.5 rounded-md">
                Section 3
              </span>
              <span className="text-xs text-[#5D6D7E] font-bold">R26 Communicative English Laboratory</span>
            </div>
            <h2 className="text-xl font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#D35400]" />
              3. Interactive ATS Resume Builder
            </h2>
            <p className="text-xs text-[#5D6D7E] mt-1">
              Fill in all 14 mandatory sections, preview real-time ATS single-column output, auto-save your progress, and export clean drafts.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleManualSave}
              className="px-3.5 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaved ? 'Saved!' : 'Save Resume'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleResetSection('all')}
              className="px-3 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-200 transition flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* View Switcher Bar (Editor vs Live Preview) */}
        <div className="flex items-center justify-between bg-[#FFF8F0] p-2 rounded-2xl border border-[#FAD7A0]">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'editor'
                  ? 'bg-[#D35400] text-white shadow-2xs'
                  : 'bg-white text-[#2C3E50] border border-[#FAD7A0] hover:bg-[#FAD7A0]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Form Editor (14 Sections)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'preview'
                  ? 'bg-[#D35400] text-white shadow-2xs'
                  : 'bg-white text-[#2C3E50] border border-[#FAD7A0] hover:bg-[#FAD7A0]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live ATS Document Preview</span>
            </button>
          </div>

          <span className="text-[11px] text-[#D35400] font-extrabold hidden md:inline-block pr-2">
            Status: Auto-saved to Local Storage
          </span>
        </div>

        {/* Form Editor View */}
        {activeTab === 'editor' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Section Sub-Tabs */}
            <div className="flex flex-wrap gap-1.5 border-b border-[#FAD7A0] pb-3">
              {formSections.map((sec) => {
                const IconComp = sec.icon;
                const isCurrent = activeSection === sec.id;

                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => setActiveSection(sec.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      isCurrent
                        ? 'bg-[#D35400] text-white shadow-2xs'
                        : 'bg-white text-[#2C3E50] border border-[#FAD7A0] hover:bg-[#FFF8F0]'
                    }`}
                  >
                    <IconComp className="w-3.5 h-3.5" />
                    <span>{sec.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Section 1: Personal Info */}
            {activeSection === 'personal' && (
              <div className="space-y-4 bg-[#FFF8F0] p-5 rounded-2xl border border-[#FAD7A0]">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-[#2C3E50] flex items-center gap-2">
                    <User className="w-4 h-4 text-[#D35400]" /> Personal Information
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleResetSection('personal')}
                    className="text-[10px] text-gray-500 underline hover:text-[#D35400]"
                  >
                    Reset Section
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-extrabold text-[#2C3E50] block mb-1">Full Candidate Name</label>
                    <input
                      type="text"
                      value={data.personalInfo.fullName}
                      onChange={(e) =>
                        setData({
                          ...data,
                          personalInfo: { ...data.personalInfo, fullName: e.target.value }
                        })
                      }
                      className="w-full text-xs p-2.5 rounded-xl border border-[#FAD7A0] bg-white focus:outline-none focus:border-[#D35400]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-[#2C3E50] block mb-1">SRIT Roll Number</label>
                    <input
                      type="text"
                      value={data.personalInfo.rollNumber}
                      onChange={(e) =>
                        setData({
                          ...data,
                          personalInfo: { ...data.personalInfo, rollNumber: e.target.value }
                        })
                      }
                      className="w-full text-xs p-2.5 rounded-xl border border-[#FAD7A0] bg-white focus:outline-none focus:border-[#D35400]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-[#2C3E50] block mb-1">Official / College Email</label>
                    <input
                      type="email"
                      value={data.personalInfo.email}
                      onChange={(e) =>
                        setData({
                          ...data,
                          personalInfo: { ...data.personalInfo, email: e.target.value }
                        })
                      }
                      className="w-full text-xs p-2.5 rounded-xl border border-[#FAD7A0] bg-white focus:outline-none focus:border-[#D35400]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-[#2C3E50] block mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={data.personalInfo.phone}
                      onChange={(e) =>
                        setData({
                          ...data,
                          personalInfo: { ...data.personalInfo, phone: e.target.value }
                        })
                      }
                      className="w-full text-xs p-2.5 rounded-xl border border-[#FAD7A0] bg-white focus:outline-none focus:border-[#D35400]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-[#2C3E50] block mb-1">LinkedIn Profile URL</label>
                    <input
                      type="text"
                      value={data.personalInfo.linkedin}
                      onChange={(e) =>
                        setData({
                          ...data,
                          personalInfo: { ...data.personalInfo, linkedin: e.target.value }
                        })
                      }
                      className="w-full text-xs p-2.5 rounded-xl border border-[#FAD7A0] bg-white focus:outline-none focus:border-[#D35400]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-[#2C3E50] block mb-1">GitHub / Portfolio URL</label>
                    <input
                      type="text"
                      value={data.personalInfo.github}
                      onChange={(e) =>
                        setData({
                          ...data,
                          personalInfo: { ...data.personalInfo, github: e.target.value }
                        })
                      }
                      className="w-full text-xs p-2.5 rounded-xl border border-[#FAD7A0] bg-white focus:outline-none focus:border-[#D35400]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Section 2: Career Objective */}
            {activeSection === 'objective' && (
              <div className="space-y-4 bg-[#FFF8F0] p-5 rounded-2xl border border-[#FAD7A0]">
                <h3 className="text-sm font-extrabold text-[#2C3E50] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#D35400]" /> Career Objective
                </h3>
                <div>
                  <label className="text-xs font-bold text-[#2C3E50] block mb-1">
                    Concise Professional Statement (2-3 Sentences)
                  </label>
                  <textarea
                    rows={4}
                    value={data.careerObjective}
                    onChange={(e) => setData({ ...data, careerObjective: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-[#FAD7A0] bg-white focus:outline-none focus:border-[#D35400]"
                  />
                </div>
              </div>
            )}

            {/* Section 3: Education */}
            {activeSection === 'education' && (
              <div className="space-y-4 bg-[#FFF8F0] p-5 rounded-2xl border border-[#FAD7A0]">
                <h3 className="text-sm font-extrabold text-[#2C3E50] flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#D35400]" /> Academic Qualifications
                </h3>
                {data.education.map((edu, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-xl border border-[#FAD7A0] space-y-3">
                    <span className="text-[10px] font-black uppercase text-[#D35400]">Entry {idx + 1}</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Degree / Class"
                        value={edu.degree}
                        onChange={(e) => {
                          const newEdu = [...data.education];
                          newEdu[idx].degree = e.target.value;
                          setData({ ...data, education: newEdu });
                        }}
                        className="text-xs p-2 rounded-lg border border-[#FAD7A0]"
                      />
                      <input
                        type="text"
                        placeholder="Institution / College Name"
                        value={edu.institution}
                        onChange={(e) => {
                          const newEdu = [...data.education];
                          newEdu[idx].institution = e.target.value;
                          setData({ ...data, education: newEdu });
                        }}
                        className="text-xs p-2 rounded-lg border border-[#FAD7A0]"
                      />
                      <input
                        type="text"
                        placeholder="Year / Duration"
                        value={edu.duration}
                        onChange={(e) => {
                          const newEdu = [...data.education];
                          newEdu[idx].duration = e.target.value;
                          setData({ ...data, education: newEdu });
                        }}
                        className="text-xs p-2 rounded-lg border border-[#FAD7A0]"
                      />
                      <input
                        type="text"
                        placeholder="CGPA / Percentage"
                        value={edu.cgpa}
                        onChange={(e) => {
                          const newEdu = [...data.education];
                          newEdu[idx].cgpa = e.target.value;
                          setData({ ...data, education: newEdu });
                        }}
                        className="text-xs p-2 rounded-lg border border-[#FAD7A0]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Section 4: Technical & Soft Skills */}
            {activeSection === 'skills' && (
              <div className="space-y-4 bg-[#FFF8F0] p-5 rounded-2xl border border-[#FAD7A0]">
                <h3 className="text-sm font-extrabold text-[#2C3E50] flex items-center gap-2">
                  <Code className="w-4 h-4 text-[#D35400]" /> Technical & Soft Skill Categorization
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-[#2C3E50] block mb-1">Programming Languages</label>
                    <input
                      type="text"
                      value={data.technicalSkills.languages}
                      onChange={(e) =>
                        setData({
                          ...data,
                          technicalSkills: { ...data.technicalSkills, languages: e.target.value }
                        })
                      }
                      className="w-full text-xs p-2.5 rounded-xl border border-[#FAD7A0] bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#2C3E50] block mb-1">Frameworks & Libraries</label>
                    <input
                      type="text"
                      value={data.technicalSkills.frameworks}
                      onChange={(e) =>
                        setData({
                          ...data,
                          technicalSkills: { ...data.technicalSkills, frameworks: e.target.value }
                        })
                      }
                      className="w-full text-xs p-2.5 rounded-xl border border-[#FAD7A0] bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#2C3E50] block mb-1">Tools & Platforms</label>
                    <input
                      type="text"
                      value={data.technicalSkills.tools}
                      onChange={(e) =>
                        setData({
                          ...data,
                          technicalSkills: { ...data.technicalSkills, tools: e.target.value }
                        })
                      }
                      className="w-full text-xs p-2.5 rounded-xl border border-[#FAD7A0] bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#2C3E50] block mb-1">Soft Skills & Communication</label>
                    <input
                      type="text"
                      value={data.softSkills}
                      onChange={(e) => setData({ ...data, softSkills: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-[#FAD7A0] bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Section 5: Projects */}
            {activeSection === 'projects' && (
              <div className="space-y-4 bg-[#FFF8F0] p-5 rounded-2xl border border-[#FAD7A0]">
                <h3 className="text-sm font-extrabold text-[#2C3E50] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#D35400]" /> Engineering Projects
                </h3>

                {data.projects.map((proj, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-xl border border-[#FAD7A0] space-y-3">
                    <span className="text-[10px] font-black uppercase text-[#D35400]">Project {idx + 1}</span>
                    <input
                      type="text"
                      placeholder="Project Title"
                      value={proj.title}
                      onChange={(e) => {
                        const newP = [...data.projects];
                        newP[idx].title = e.target.value;
                        setData({ ...data, projects: newP });
                      }}
                      className="w-full text-xs p-2 rounded-lg border border-[#FAD7A0]"
                    />
                    <input
                      type="text"
                      placeholder="Tech Stack Used"
                      value={proj.techStack}
                      onChange={(e) => {
                        const newP = [...data.projects];
                        newP[idx].techStack = e.target.value;
                        setData({ ...data, projects: newP });
                      }}
                      className="w-full text-xs p-2 rounded-lg border border-[#FAD7A0]"
                    />
                    <textarea
                      rows={2}
                      placeholder="Action Bullet Point Description (Quantified Impact)"
                      value={proj.description}
                      onChange={(e) => {
                        const newP = [...data.projects];
                        newP[idx].description = e.target.value;
                        setData({ ...data, projects: newP });
                      }}
                      className="w-full text-xs p-2 rounded-lg border border-[#FAD7A0]"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Section 6: Internships */}
            {activeSection === 'internships' && (
              <div className="space-y-4 bg-[#FFF8F0] p-5 rounded-2xl border border-[#FAD7A0]">
                <h3 className="text-sm font-extrabold text-[#2C3E50] flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#D35400]" /> Internships & Experience
                </h3>
                {data.internships.map((intern, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-xl border border-[#FAD7A0] space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Company"
                        value={intern.company}
                        onChange={(e) => {
                          const newI = [...data.internships];
                          newI[idx].company = e.target.value;
                          setData({ ...data, internships: newI });
                        }}
                        className="text-xs p-2 rounded-lg border border-[#FAD7A0]"
                      />
                      <input
                        type="text"
                        placeholder="Role"
                        value={intern.role}
                        onChange={(e) => {
                          const newI = [...data.internships];
                          newI[idx].role = e.target.value;
                          setData({ ...data, internships: newI });
                        }}
                        className="text-xs p-2 rounded-lg border border-[#FAD7A0]"
                      />
                      <input
                        type="text"
                        placeholder="Duration"
                        value={intern.duration}
                        onChange={(e) => {
                          const newI = [...data.internships];
                          newI[idx].duration = e.target.value;
                          setData({ ...data, internships: newI });
                        }}
                        className="text-xs p-2 rounded-lg border border-[#FAD7A0]"
                      />
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Key Responsibilities & Achievements"
                      value={intern.description}
                      onChange={(e) => {
                        const newI = [...data.internships];
                        newI[idx].description = e.target.value;
                        setData({ ...data, internships: newI });
                      }}
                      className="w-full text-xs p-2 rounded-lg border border-[#FAD7A0]"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Section 7: Certifications */}
            {activeSection === 'certs' && (
              <div className="space-y-4 bg-[#FFF8F0] p-5 rounded-2xl border border-[#FAD7A0]">
                <h3 className="text-sm font-extrabold text-[#2C3E50] flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#D35400]" /> Certifications & Honors
                </h3>

                <div>
                  <label className="text-xs font-bold text-[#2C3E50] block mb-1">Certifications (NPTEL, Coursera, Oracle, RedHat)</label>
                  <textarea
                    rows={2}
                    value={data.certifications}
                    onChange={(e) => setData({ ...data, certifications: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#FAD7A0] bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#2C3E50] block mb-1">Academic & Extra-curricular Achievements</label>
                  <textarea
                    rows={2}
                    value={data.achievements}
                    onChange={(e) => setData({ ...data, achievements: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#FAD7A0] bg-white"
                  />
                </div>
              </div>
            )}

            {/* Section 8: Misc */}
            {activeSection === 'misc' && (
              <div className="space-y-4 bg-[#FFF8F0] p-5 rounded-2xl border border-[#FAD7A0]">
                <h3 className="text-sm font-extrabold text-[#2C3E50] flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#D35400]" /> Languages, Hobbies & Declaration
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#2C3E50] block mb-1">Languages Known</label>
                    <input
                      type="text"
                      value={data.languages}
                      onChange={(e) => setData({ ...data, languages: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-[#FAD7A0] bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#2C3E50] block mb-1">Hobbies & Technical Interests</label>
                    <input
                      type="text"
                      value={data.hobbies}
                      onChange={(e) => setData({ ...data, hobbies: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-[#FAD7A0] bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#2C3E50] block mb-1">Academic Declaration Statement</label>
                  <textarea
                    rows={2}
                    value={data.declaration}
                    onChange={(e) => setData({ ...data, declaration: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#FAD7A0] bg-white"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Live ATS Document Preview View */}
        {activeTab === 'preview' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-6 bg-white border-2 border-[#2C3E50] rounded-2xl shadow-md font-sans space-y-4 max-w-4xl mx-auto text-[#2C3E50]">
              {/* Header */}
              <div className="text-center border-b-2 border-[#2C3E50] pb-3 space-y-1">
                <h1 className="text-2xl font-black uppercase tracking-wider text-[#2C3E50]">
                  {data.personalInfo.fullName}
                </h1>
                <p className="text-xs font-bold text-gray-700">
                  SRIT Roll No: {data.personalInfo.rollNumber} | {data.personalInfo.location}
                </p>
                <p className="text-xs text-gray-600 flex flex-wrap justify-center gap-3 font-mono pt-1">
                  <span>{data.personalInfo.email}</span>
                  <span>•</span>
                  <span>{data.personalInfo.phone}</span>
                  <span>•</span>
                  <span>{data.personalInfo.linkedin}</span>
                  <span>•</span>
                  <span>{data.personalInfo.github}</span>
                </p>
              </div>

              {/* Career Objective */}
              <div className="space-y-1">
                <h2 className="text-xs font-black uppercase tracking-widest text-[#D35400] border-b border-gray-300 pb-0.5">
                  CAREER OBJECTIVE
                </h2>
                <p className="text-xs leading-relaxed text-[#2C3E50]">{data.careerObjective}</p>
              </div>

              {/* Education */}
              <div className="space-y-1.5">
                <h2 className="text-xs font-black uppercase tracking-widest text-[#D35400] border-b border-gray-300 pb-0.5">
                  EDUCATION
                </h2>
                {data.education.map((edu, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between text-xs">
                    <div>
                      <p className="font-bold">{edu.degree}</p>
                      <p className="text-gray-600 italic text-[11px]">{edu.institution}</p>
                    </div>
                    <div className="text-right sm:shrink-0 text-[11px]">
                      <span className="font-mono font-bold">{edu.cgpa}</span>
                      <span className="block text-gray-500">{edu.duration}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Technical Skills */}
              <div className="space-y-1">
                <h2 className="text-xs font-black uppercase tracking-widest text-[#D35400] border-b border-gray-300 pb-0.5">
                  TECHNICAL SKILLS
                </h2>
                <ul className="text-xs space-y-0.5 font-mono">
                  <li><strong>Languages:</strong> {data.technicalSkills.languages}</li>
                  <li><strong>Frameworks:</strong> {data.technicalSkills.frameworks}</li>
                  <li><strong>Tools & OS:</strong> {data.technicalSkills.tools}</li>
                  <li><strong>Core Concepts:</strong> {data.technicalSkills.concepts}</li>
                  <li><strong>Soft Skills:</strong> {data.softSkills}</li>
                </ul>
              </div>

              {/* Projects */}
              <div className="space-y-1.5">
                <h2 className="text-xs font-black uppercase tracking-widest text-[#D35400] border-b border-gray-300 pb-0.5">
                  KEY ENGINEERING PROJECTS
                </h2>
                {data.projects.map((proj, idx) => (
                  <div key={idx} className="text-xs space-y-0.5">
                    <div className="flex justify-between font-bold">
                      <span>{proj.title}</span>
                      <span className="font-mono text-gray-600 font-normal">[{proj.techStack}]</span>
                    </div>
                    <p className="text-[#2C3E50] pl-2 border-l-2 border-[#D35400]">{proj.description}</p>
                  </div>
                ))}
              </div>

              {/* Certifications & Achievements */}
              <div className="space-y-1">
                <h2 className="text-xs font-black uppercase tracking-widest text-[#D35400] border-b border-gray-300 pb-0.5">
                  HONORS & CERTIFICATIONS
                </h2>
                <p className="text-xs">• {data.certifications}</p>
                <p className="text-xs">• {data.achievements}</p>
              </div>

              {/* Declaration */}
              <div className="pt-2 text-[10px] text-gray-500 border-t border-gray-200 flex justify-between items-end">
                <p className="italic">{data.declaration}</p>
                <div className="text-right">
                  <p className="font-bold text-[#2C3E50]">{data.personalInfo.fullName}</p>
                  <p className="text-[9px]">SRIT Anantapur</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex justify-end pt-4 border-t border-[#FAD7A0]">
          <button
            type="button"
            onClick={onCompleteActivity}
            className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#E67E22] transition flex items-center gap-2"
          >
            <span>Proceed to Section 4: Action Verb Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
