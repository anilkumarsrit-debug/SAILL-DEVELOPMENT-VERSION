import React, { useState, useEffect } from 'react';
import { PenTool, Save, Clock, FileText, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { indexedDBStorage } from '../../../lib/db';

interface WritingTask {
  id: string;
  title: string;
  category: string;
  recipient: string;
  prompt: string;
  defaultSubject: string;
  defaultBody: string;
}

const WRITING_TASKS: WritingTask[] = [
  {
    id: 'internship_app',
    title: '1. Internship Application',
    category: 'Career Placement',
    recipient: 'HR Manager, Tech Corp',
    prompt: 'Draft a formal application email requesting a 2-month summer internship in Software Development at Tech Corp. Highlight your B.Tech CSE coursework and Python/Java mini-projects.',
    defaultSubject: '[Application] Summer Software Engineering Internship - Anil Kumar (264G1A0501)',
    defaultBody: 'Dear Hiring Manager,\n\nI am a First-Year B.Tech Computer Science & Engineering student at Srinivasa Ramanujan Institute of Technology (SRIT). I am writing to formally apply for the Summer Software Development Internship position at Tech Corp.\n\nDuring my academic coursework, I have gained strong foundational knowledge in Data Structures, Algorithms, and Object-Oriented Programming using Java and Python. Recently, I developed a campus navigation web application as part of our laboratory mini-project.\n\nI have attached my resume for your perusal and would welcome the opportunity to discuss how my skills align with your engineering team.\n\nThank you for your time and consideration.\n\nSincerely,\nAnil Kumar\nB.Tech CSE (Roll No: 264G1A0501)\nSrinivasa Ramanujan Institute of Technology\nPhone: +91 98765 43210 | Email: anil.cse26@srit.ac.in'
  },
  {
    id: 'job_app',
    title: '2. Job Application',
    category: 'Career Placement',
    recipient: 'Talent Acquisition Team, Global Systems',
    prompt: 'Draft a formal job application for a Graduate Engineer Trainee (GET) role. Emphasize your technical certifications, problem-solving mindset, and willingness to relocate.',
    defaultSubject: '[Application] Graduate Engineer Trainee Position - Roll No 264G1A0501',
    defaultBody: 'Dear Talent Acquisition Team,\n\nI am writing to express my enthusiastic interest in the Graduate Engineer Trainee (GET) position at Global Systems. As a graduating B.Tech CSE student at SRIT, I have consistently maintained a strong academic record and a passionate focus on cloud architecture and web technologies.\n\nI hold certifications in Python Programming and AWS Cloud Practitioner. My project experience has equipped me with practical hands-on skills in database design, REST APIs, and modern frontend frameworks.\n\nAttached are my updated resume and project portfolio link. I am eager to contribute to your engineering team and am ready to relocate as required.\n\nThank you for considering my application.\n\nRegards,\nAnil Kumar\nSRIT Anantapur'
  },
  {
    id: 'leave_req',
    title: '3. Leave Request',
    category: 'Academic Administration',
    recipient: 'Head of Department (HOD), CSE',
    prompt: 'Draft an On-Duty (OD) leave request to your HOD for 2 days to participate in a State Level Hackathon.',
    defaultSubject: '[Leave Request] On-Duty Permission for State Hackathon - 264G1A0501',
    defaultBody: 'Dear Dr. R. V. Sharma,\n\nI am writing to request On-Duty (OD) leave for two days, on July 28 and July 29, 2026, to participate in the State Level Smart India Hackathon taking place at JNTU Anantapur.\n\nOur team has been selected for the final prototype round. I have completed all my laboratory submissions for this week and will ensure I make up for any missed lecture material promptly.\n\nI have attached the official selection call letter for your kind verification.\n\nThank you for your support and encouragement.\n\nSincerely,\nAnil Kumar\nRoll No: 264G1A0501 | CSE Section A'
  },
  {
    id: 'project_sub',
    title: '4. Project Submission',
    category: 'Academic Coursework',
    recipient: 'Course Coordinator, Web Engineering',
    prompt: 'Submit your Phase-1 Web Development Lab project source code archive and technical report to your professor.',
    defaultSubject: '[Submission] Phase-1 Web App Documentation - Group 04 (CSE-A)',
    defaultBody: 'Dear Dr. Lakshmi,\n\nPlease find attached the source code zip file and comprehensive technical report for our Phase-1 Web Engineering Project titled "SRIT Smart Library Management System".\n\nGroup 04 Members:\n1. Anil Kumar (264G1A0501) - Lead Developer\n2. Priya Sharma (264G1A0502) - Database Architect\n\nAll source code has been tested and verified against the rubric requirements. We look forward to presenting our live demonstration during Friday\'s lab session.\n\nBest regards,\nGroup 04, B.Tech CSE-A'
  },
  {
    id: 'meeting_req',
    title: '5. Meeting Request',
    category: 'Faculty Guidance',
    recipient: 'Mini-Project Mentor',
    prompt: 'Request a 15-minute appointment with your project mentor to review your database ER diagram.',
    defaultSubject: '[Meeting Request] Mini-Project Database Schema Guidance - Anil Kumar',
    defaultBody: 'Dear Prof. S. Ramesh,\n\nOur group has completed the initial Entity-Relationship (ER) diagram for our Mini-Project. We would be grateful for 15 minutes of your guidance to review our database schema normalization.\n\nWould it be convenient for you to meet us during your office hours on Thursday between 3:00 PM and 4:00 PM?\n\nThank you for your time.\n\nRespectfully,\nAnil Kumar\nRoll No: 264G1A0501'
  },
  {
    id: 'faculty_comm',
    title: '6. Faculty Communication',
    category: 'Academic Inquiry',
    recipient: 'Communicative English Professor',
    prompt: 'Inquire about recommended reference textbooks and online practice portals for the upcoming R26 Lab assessment.',
    defaultSubject: '[Inquiry] R26 Lab Assessment Reference Materials - CSE-A',
    defaultBody: 'Dear Professor,\n\nI am writing on behalf of CSE Section A regarding our upcoming R26 Communicative English Lab internal assessment.\n\nCould you kindly share recommended reference textbooks or online portals for practicing advanced phonetics and interview STAR responses?\n\nThank you for your guidance.\n\nSincerely,\nAnil Kumar\nClass Representative, CSE-A'
  },
  {
    id: 'training_reg',
    title: '7. Training Registration',
    category: 'Skill Enhancement',
    recipient: 'Training & Placement Officer (TPO)',
    prompt: 'Register for the upcoming 3-day Corporate Soft Skills & Mock Interview Training Workshop organized by TPO.',
    defaultSubject: '[Registration] Corporate Soft Skills Workshop - Roll No 264G1A0501',
    defaultBody: 'Dear Training & Placement Officer,\n\nI would like to formally register for the upcoming 3-Day Corporate Soft Skills & Mock Interview Workshop scheduled from August 05 to August 07, 2026.\n\nMy details are as follows:\n- Name: Anil Kumar\n- Roll No: 264G1A0501\n- Branch: B.Tech CSE (Year I, Sec A)\n- Email: anil.cse26@srit.ac.in\n\nI have paid the registration fee online and attached the transaction receipt.\n\nThank you,\nAnil Kumar'
  },
  {
    id: 'placement_reg',
    title: '8. Placement Registration',
    category: 'Career Placement',
    recipient: 'Campus Recruitment Cell',
    prompt: 'Register your updated academic profile, SGPA, and resume link on the Campus Placement Cell portal.',
    defaultSubject: '[Placement Drive] Profile & Resume Registration - 264G1A0501',
    defaultBody: 'Dear Placement Officer,\n\nI have updated my academic profile, SGPA records, and technical certifications on the SRIT Placement Portal for the 2026 campus recruitment drive.\n\nAll verified mark sheets and my latest ATS-formatted resume have been uploaded to my profile dashboard.\n\nKindly confirm my eligibility registration.\n\nBest regards,\nAnil Kumar (264G1A0501)'
  },
  {
    id: 'thank_you',
    title: '9. Thank You Email',
    category: 'Professional Courtesy',
    recipient: 'Guest Speaker / Technical Interviewer',
    prompt: 'Send a formal thank-you email to an industry guest speaker after a campus workshop on Cloud Computing.',
    defaultSubject: 'Thank You for the Cloud Architecture Workshop - SRIT Students',
    defaultBody: 'Dear Mr. Vikram Verma,\n\nOn behalf of the first-year engineering students at SRIT, I would like to express our sincere gratitude for your insightful workshop on "Modern Cloud Architecture" held yesterday.\n\nYour practical demonstration of microservices and serverless deployment provided us with immense real-world context. We truly appreciate the time and guidance you shared with us.\n\nWe hope to stay connected on LinkedIn.\n\nWarm regards,\nAnil Kumar\nStudent Coordinator, SRIT Tech Club'
  },
  {
    id: 'follow_up',
    title: '10. Follow-up Email',
    category: 'Professional Correspondence',
    recipient: 'HR Recruiter, Tech Corp',
    prompt: 'Send a polite follow-up email 10 days after completing your technical interview round.',
    defaultSubject: 'Follow-up regarding Technical Interview Status - Anil Kumar',
    defaultBody: 'Dear Hiring Team,\n\nI hope this email finds you well.\n\nI am writing to follow up on my technical interview for the Software Engineering Internship position completed on July 15, 2026. I remains very excited about the opportunity to contribute to Tech Corp.\n\nCould you please let me know if there are any updates regarding the next steps in the selection process?\n\nThank you for your time and continued consideration.\n\nBest regards,\nAnil Kumar\nRoll No: 264G1A0501'
  }
];

interface ProfessionalEmailLabProps {
  onCompleteActivity: () => void;
  onProceedToReview?: (subject: string, body: string) => void;
}

export const ProfessionalEmailLab: React.FC<ProfessionalEmailLabProps> = ({
  onCompleteActivity,
  onProceedToReview
}) => {
  const [activeTaskId, setActiveTaskId] = useState<string>('internship_app');
  const [subject, setSubject] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const activeTask = WRITING_TASKS.find((t) => t.id === activeTaskId) || WRITING_TASKS[0];

  useEffect(() => {
    // Load default or saved draft for task
    const loadDraft = () => {
      try {
        const savedStr = localStorage.getItem(`email_draft_${activeTaskId}`);
        if (savedStr) {
          const saved = JSON.parse(savedStr);
          setSubject(saved.subject);
          setBody(saved.body);
        } else {
          setSubject(activeTask.defaultSubject);
          setBody(activeTask.defaultBody);
        }
      } catch (e) {
        console.error('Failed to load draft', e);
        setSubject(activeTask.defaultSubject);
        setBody(activeTask.defaultBody);
      }
      setIsSaved(false);
    };
    loadDraft();
  }, [activeTaskId]);

  const handleSaveDraft = () => {
    try {
      localStorage.setItem(`email_draft_${activeTaskId}`, JSON.stringify({ subject, body }));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    } catch (e) {
      console.error('Failed to save draft', e);
    }
  };

  // Metrics
  const words = body.trim() ? body.trim().split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(words / 200));

  return (
    <div className="space-y-6">
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
        {/* Header */}
        <div className="border-b border-[#FAD7A0] pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest bg-[#D35400] text-white px-2 py-0.5 rounded-md">
              Section 4
            </span>
            <span className="text-xs text-[#5D6D7E] font-bold">R26 Communicative English Laboratory</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
            <PenTool className="w-5 h-5 text-[#D35400]" />
            4. Professional Email Writing Lab
          </h2>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Draft, edit, and polish formal correspondence across 10 specialized academic and workplace tasks.
          </p>
        </div>

        {/* Task Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#D35400] uppercase tracking-wider block">
            Select Writing Task (10 Scenarios):
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {WRITING_TASKS.map((task) => {
              const isSelected = task.id === activeTaskId;
              return (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => setActiveTaskId(task.id)}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#D35400] text-white border-[#D35400] shadow-2xs'
                      : 'bg-white text-[#2C3E50] border-[#FAD7A0] hover:bg-[#FFF8F0]'
                  }`}
                >
                  <span className="text-[9px] uppercase font-bold opacity-80">{task.category}</span>
                  <span className="text-xs font-extrabold mt-1 leading-snug line-clamp-1">{task.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Writing Canvas & Prompt */}
        <div className="p-5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-[#FAD7A0] pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase text-[#D35400]">{activeTask.category}</span>
              <h3 className="text-sm font-extrabold text-[#2C3E50]">{activeTask.title}</h3>
              <p className="text-xs text-[#5D6D7E] mt-0.5">{activeTask.prompt}</p>
            </div>

            <div className="flex items-center gap-3 text-xs text-[#5D6D7E] shrink-0">
              <span className="flex items-center gap-1 font-mono">
                <FileText className="w-3.5 h-3.5 text-[#D35400]" /> {words} Words
              </span>
              <span className="flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-[#E67E22]" /> ~{readingTime} Min Read
              </span>
            </div>
          </div>

          {/* Composition Box */}
          <div className="bg-white p-4 rounded-xl border-2 border-[#FAD7A0] space-y-3 shadow-xs">
            {/* Recipient info */}
            <div className="flex items-center gap-2 text-xs border-b border-gray-100 pb-2">
              <span className="text-gray-400 font-bold w-16 shrink-0">To:</span>
              <span className="font-mono text-[#2C3E50] font-semibold">{activeTask.recipient}</span>
            </div>

            {/* Subject Input */}
            <div className="flex items-center gap-2 text-xs border-b border-gray-100 pb-2">
              <span className="text-gray-400 font-bold w-16 shrink-0">Subject:</span>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter formal subject line..."
                className="flex-1 font-mono text-[#2C3E50] font-bold focus:outline-none"
              />
            </div>

            {/* Email Body TextArea */}
            <div className="space-y-1">
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Type your formal email body here..."
                rows={12}
                className="w-full font-mono text-xs text-[#2C3E50] focus:outline-none leading-relaxed resize-y"
              />
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-4 py-2 bg-white border border-[#FAD7A0] hover:bg-gray-50 text-[#2C3E50] text-xs font-bold rounded-xl transition flex items-center gap-1.5"
              >
                <Save className="w-4 h-4 text-[#D35400]" />
                <span>Save Draft to IndexedDB</span>
              </button>
              {isSaved && (
                <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" /> Draft Saved!
                </span>
              )}
            </div>

            {onProceedToReview && (
              <button
                type="button"
                onClick={() => onProceedToReview(subject, body)}
                className="px-5 py-2.5 bg-[#D35400] hover:bg-[#B04300] text-white text-xs font-extrabold rounded-xl transition flex items-center gap-2 shadow-xs"
              >
                <Sparkles className="w-4 h-4" /> Send to AI Email Review Studio
              </button>
            )}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-[#FAD7A0]">
          <span className="text-xs text-[#5D6D7E]">
            Practice complaint and request emails next in Sections 5 & 6.
          </span>

          <button
            type="button"
            onClick={onCompleteActivity}
            className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#B04300] transition flex items-center gap-2"
          >
            Continue to Complaint Email Practice <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
