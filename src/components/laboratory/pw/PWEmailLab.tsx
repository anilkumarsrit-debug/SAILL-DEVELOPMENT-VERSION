import React, { useState } from 'react';
import { Mail, Sparkles, Save, RotateCcw, CheckCircle2, Award, FolderCheck, Send, FileText } from 'lucide-react';
import { evaluateDocument, WritingFeedback } from '../../../services/ai/writingCoach';
import { PWAudioPlaceholder } from './PWAudioPlaceholder';

interface PWEmailLabProps {
  onCompleteActivity: () => void;
  onSaveToPortfolio: (title: string, category: string, content: string, score: number) => void;
}

export interface EmailTask {
  id: string;
  title: string;
  recipient: string;
  defaultSubject: string;
  scenario: string;
  samplePrompt: string;
}

const EMAIL_TASKS: EmailTask[] = [
  {
    id: 'internship',
    title: '1. Internship Application',
    recipient: 'hr@techcorp.com / Hiring Manager',
    defaultSubject: '[Application] Summer Software Engineering Internship - First Year SRIT',
    scenario: 'Apply for a 2-month summer internship at TechCorp, highlighting your Python mini-projects and academic records at SRIT.',
    samplePrompt: 'Dear HR Team, I am writing to formally apply for the Summer Engineering Internship...'
  },
  {
    id: 'leave-od',
    title: '2. Leave / On-Duty (OD) Permission Request',
    recipient: 'hod.cse@srit.ac.in / Dr. M. Standard',
    defaultSubject: '[OD Request] Permission for State Level Hackathon - Roll No 26SR1A0501',
    scenario: 'Request 2 days On-Duty (OD) permission from HOD to represent SRIT at a State-level Technical Hackathon.',
    samplePrompt: 'Respected HOD Sir, I request permission to attend the State Hackathon from Oct 12-14...'
  },
  {
    id: 'recommendation',
    title: '3. Request for Recommendation Letter',
    recipient: 'prof.kumar@srit.ac.in / Project Supervisor',
    defaultSubject: '[Recommendation Request] Academic Reference for Global Summer School - Roll 26SR1A0501',
    scenario: 'Politely ask your Computer Science professor for a letter of recommendation for an international research program.',
    samplePrompt: 'Dear Professor Kumar, I am writing to humbly request a letter of recommendation...'
  },
  {
    id: 'thank-you',
    title: '4. Post-Interview Thank You Email',
    recipient: 'recruiter@cognizant.com',
    defaultSubject: 'Thank You - Software Development Placement Interview (Roll No 26SR1A0501)',
    scenario: 'Send a professional follow-up thank you email within 24 hours of completing your campus placement interview.',
    samplePrompt: 'Dear Selection Committee, Thank you for taking time to discuss the Software Developer position...'
  },
  {
    id: 'complaint',
    title: '5. Technical Complaint & Support Escalation',
    recipient: 'support.lab@srit.ac.in / IT Admin',
    defaultSubject: '[Lab Ticket #402] MATLAB License & Server Connectivity Issue in Lab 3',
    scenario: 'Formally report an ongoing hardware or network issue in the campus computer lab affecting project work.',
    samplePrompt: 'Dear IT Support Team, I am writing to report a recurring software license error in Lab 3...'
  },
  {
    id: 'meeting-invitation',
    title: '6. Technical Meeting / Project Review Invite',
    recipient: 'team-lead@srit.ac.in / Project Group Members',
    defaultSubject: '[Meeting Request] B.Tech Mini-Project Sprint Review & Architecture Finalization',
    scenario: 'Invite team members and faculty guide to an upcoming technical milestone review meeting.',
    samplePrompt: 'Dear Team, You are invited to our sprint review meeting on Friday at 3:00 PM in Lab 2...'
  },
  {
    id: 'follow-up',
    title: '7. Application Status Follow-Up',
    recipient: 'admissions@university.edu / HR Specialist',
    defaultSubject: '[Follow-Up] Application Status Enquiry - Student Research Fellowship (Ref #982)',
    scenario: 'Follow up politely on an application submitted 3 weeks ago without sounding demanding.',
    samplePrompt: 'Dear Admissions Officer, I hope this email finds you well. I am following up on my application...'
  },
  {
    id: 'hr-communication',
    title: '8. HR Policy & Joining Confirmation',
    recipient: 'campus.hr@tcs.com',
    defaultSubject: '[Confirmation] Acceptance of Campus Offer & Document Verification Query',
    scenario: 'Formally accept a campus offer letter and inquire about document submission timelines.',
    samplePrompt: 'Dear HR Team, I am pleased to accept the offer of employment as Graduate Engineer Trainee...'
  },
  {
    id: 'placement-reg',
    title: '9. Campus Placement Registration Query',
    recipient: 'placement@srit.ac.in / Training & Placement Officer',
    defaultSubject: '[Placement Query] Profile Verification & Backlog NOC Clarification - Roll 26SR1A0501',
    scenario: 'Contact the SRIT Placement Cell regarding eligibility verification for upcoming campus placement drives.',
    samplePrompt: 'Dear TPO Sir/Madam, I am writing to clarify my placement portal eligibility status...'
  },
  {
    id: 'faculty-comm',
    title: '10. Academic Project Guidance Enquiry',
    recipient: 'faculty.guide@srit.ac.in',
    defaultSubject: '[Project Guidance] Appointment Request for AI Lab Topic Approval - CSE A',
    scenario: 'Request an appointment during faculty office hours to discuss your proposed B.Tech project abstract.',
    samplePrompt: 'Dear Dr. Sharma, I would appreciate 15 minutes during your office hours to review our project abstract...'
  }
];

export const PWEmailLab: React.FC<PWEmailLabProps> = ({
  onCompleteActivity,
  onSaveToPortfolio
}) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string>(EMAIL_TASKS[0].id);
  const currentTask = EMAIL_TASKS.find((t) => t.id === selectedTaskId) || EMAIL_TASKS[0];

  const [recipient, setRecipient] = useState(currentTask.recipient);
  const [subject, setSubject] = useState(currentTask.defaultSubject);
  const [salutation, setSalutation] = useState('Dear Sir / Madam,');
  const [bodyText, setBodyText] = useState(currentTask.samplePrompt);
  const [signOff, setSignOff] = useState('Sincerely,\nFirst-Year B.Tech Student\nSRIT College of Engineering');

  const [evalResult, setEvalResult] = useState<WritingFeedback | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [savedToPortfolio, setSavedToPortfolio] = useState(false);

  const handleSelectTask = (taskId: string) => {
    setSelectedTaskId(taskId);
    const task = EMAIL_TASKS.find((t) => t.id === taskId);
    if (task) {
      setRecipient(task.recipient);
      setSubject(task.defaultSubject);
      setBodyText(task.samplePrompt);
      setEvalResult(null);
      setSavedToPortfolio(false);
    }
  };

  const handleRunEvaluation = async () => {
    setIsAnalyzing(true);
    const fullEmailContent = `${salutation}\n\n${bodyText}\n\n${signOff}`;
    try {
      const res = await evaluateDocument({
        documentType: 'Professional Email',
        content: fullEmailContent,
        titleOrSubject: subject,
        recipientOrRole: recipient,
        scenarioTask: currentTask.title
      });
      setEvalResult(res);
      if (res.score10 >= 6.0) {
        onCompleteActivity();
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setBodyText(currentTask.samplePrompt);
    setSubject(currentTask.defaultSubject);
    setEvalResult(null);
    setSavedToPortfolio(false);
  };

  const handleSavePortfolio = () => {
    if (!evalResult) return;
    const fullContent = `Recipient: ${recipient}\nSubject: ${subject}\n\n${salutation}\n\n${bodyText}\n\n${signOff}`;
    onSaveToPortfolio(`Professional Email: ${currentTask.title}`, 'Professional Email', fullContent, evalResult.score10);
    setSavedToPortfolio(true);
  };

  return (
    <div className="space-y-6">
      <PWAudioPlaceholder
        category="Instructions"
        title="Professional Email Writing Lab Instructions"
        transcript="Select a real-world communication task from the dropdown. Craft your formal subject line, salutation, clear body paragraphs, and professional sign-off. Submit for automated SAILL 10-Mark rubric evaluation."
      />

      {/* Task Selector Bar */}
      <div className="srit-card p-5 bg-white border border-[#FAD7A0]">
        <label className="block text-xs font-bold text-[#D35400] uppercase tracking-wider mb-2">
          Select Workplace / Academic Email Scenario (10 Tasks):
        </label>
        <select
          value={selectedTaskId}
          onChange={(e) => handleSelectTask(e.target.value)}
          className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-3 text-xs sm:text-sm font-bold text-[#2C3E50] focus:outline-none focus:border-[#D35400] shadow-2xs"
        >
          {EMAIL_TASKS.map((task) => (
            <option key={task.id} value={task.id}>
              {task.title}
            </option>
          ))}
        </select>

        <div className="mt-3 p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-xs text-[#5D6D7E]">
          <strong className="text-[#2C3E50]">Scenario Brief:</strong> {currentTask.scenario}
        </div>
      </div>

      {/* Email Editor Card */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
        <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-3">
          <h3 className="text-base font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#D35400]" /> Formal Email Composition Window
          </h3>
          <span className="text-[11px] bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400] px-2.5 py-1 rounded-lg font-bold">
            SAILL R26 Blueprint
          </span>
        </div>

        {/* Recipient & Subject */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#2C3E50] mb-1">To (Recipient Address / Title):</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl px-3 py-2 text-xs font-medium text-[#2C3E50] focus:outline-none focus:border-[#D35400]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2C3E50] mb-1">Subject Line (Actionable & Specific):</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl px-3 py-2 text-xs font-bold text-[#2C3E50] focus:outline-none focus:border-[#D35400]"
            />
          </div>
        </div>

        {/* Salutation */}
        <div>
          <label className="block text-xs font-bold text-[#2C3E50] mb-1">Formal Salutation:</label>
          <input
            type="text"
            value={salutation}
            onChange={(e) => setSalutation(e.target.value)}
            className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl px-3 py-2 text-xs font-semibold text-[#2C3E50] focus:outline-none focus:border-[#D35400]"
          />
        </div>

        {/* Body Text Editor */}
        <div>
          <label className="block text-xs font-bold text-[#2C3E50] mb-1">Email Body Content (5 Cs Principles):</label>
          <textarea
            rows={7}
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            placeholder="Write clear, concise, and courteous body paragraphs..."
            className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-3 text-xs sm:text-sm text-[#2C3E50] focus:outline-none focus:border-[#D35400] font-sans leading-relaxed shadow-2xs"
          />
        </div>

        {/* Sign-off */}
        <div>
          <label className="block text-xs font-bold text-[#2C3E50] mb-1">Formal Sign-off & Credentials:</label>
          <textarea
            rows={3}
            value={signOff}
            onChange={(e) => setSignOff(e.target.value)}
            className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-2.5 text-xs font-medium text-[#2C3E50] focus:outline-none focus:border-[#D35400]"
          />
        </div>

        {/* Control Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#FAD7A0]">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 border border-[#FAD7A0] text-[#5D6D7E] text-xs font-bold rounded-xl hover:bg-[#FFF8F0] transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Email
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleRunEvaluation}
              disabled={isAnalyzing || bodyText.length < 10}
              className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#B04300] transition flex items-center gap-2 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" /> Evaluating Email...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Evaluate Email (10 Marks)
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* AI Evaluation Report Card */}
      {evalResult && (
        <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#FAD7A0] pb-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#D35400] bg-[#FFF8F0] border border-[#FAD7A0] px-3 py-1 rounded-md">
                SAILL AI Assessment
              </span>
              <h3 className="text-xl font-extrabold text-[#2C3E50] font-heading mt-1">
                Email Evaluation Scorecard
              </h3>
            </div>

            <div className="bg-[#FFF8F0] border border-[#FAD7A0] px-5 py-3 rounded-2xl text-center">
              <span className="text-3xl font-black text-[#D35400] block">{evalResult.score10} / 10</span>
              <span className="text-[10px] text-[#5D6D7E] font-bold uppercase">{evalResult.performanceLevel}</span>
            </div>
          </div>

          {/* Rubric Breakdown Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-center">
              <span className="text-xs text-[#5D6D7E] font-bold block">Structure</span>
              <span className="text-lg font-black text-[#2C3E50]">{evalResult.rubric.contentStructure} / 2.0</span>
            </div>
            <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-center">
              <span className="text-xs text-[#5D6D7E] font-bold block">Vocabulary</span>
              <span className="text-lg font-black text-[#2C3E50]">{evalResult.rubric.vocabularyActionVerbs} / 2.0</span>
            </div>
            <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-center">
              <span className="text-xs text-[#5D6D7E] font-bold block">Grammar</span>
              <span className="text-lg font-black text-[#2C3E50]">{evalResult.rubric.grammarMechanics} / 2.0</span>
            </div>
            <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-center">
              <span className="text-xs text-[#5D6D7E] font-bold block">Tone</span>
              <span className="text-lg font-black text-[#2C3E50]">{evalResult.rubric.toneProfessionalism} / 2.0</span>
            </div>
            <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-center">
              <span className="text-xs text-[#5D6D7E] font-bold block">Clarity</span>
              <span className="text-lg font-black text-[#2C3E50]">{evalResult.rubric.clarityConciseness} / 2.0</span>
            </div>
          </div>

          {/* Feedback & Strengths */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <h4 className="text-xs font-extrabold uppercase text-emerald-900 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Key Strengths
              </h4>
              <ul className="space-y-1.5 text-xs text-emerald-800">
                {evalResult.strengths.map((s, idx) => (
                  <li key={idx}>• {s}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <h4 className="text-xs font-extrabold uppercase text-amber-900 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" /> Actionable Improvements
              </h4>
              <ul className="space-y-1.5 text-xs text-amber-800">
                {evalResult.improvements.map((imp, idx) => (
                  <li key={idx}>• {imp}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Polished Draft Preview */}
          {evalResult.improvedVersion && (
            <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl">
              <h4 className="text-xs font-bold text-[#D35400] uppercase mb-2 flex items-center gap-1.5">
                <FileText className="w-4 h-4" /> AI Polished Email Suggestion
              </h4>
              <pre className="text-xs text-[#2C3E50] whitespace-pre-wrap font-sans bg-white p-3 rounded-lg border border-[#FAD7A0]">
                {evalResult.improvedVersion}
              </pre>
            </div>
          )}

          {/* Portfolio Action */}
          <div className="flex items-center justify-between pt-4 border-t border-[#FAD7A0]">
            <span className="text-xs text-[#5D6D7E]">
              {savedToPortfolio ? '✓ Saved to SAILL Student Portfolio' : 'Save this evaluated email to your portfolio'}
            </span>

            <button
              type="button"
              onClick={handleSavePortfolio}
              disabled={savedToPortfolio}
              className={`px-5 py-2 text-xs font-bold rounded-xl border transition flex items-center gap-2 ${
                savedToPortfolio
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                  : 'bg-white border-[#FAD7A0] text-[#D35400] hover:bg-[#FFF8F0]'
              }`}
            >
              <FolderCheck className="w-4 h-4" />
              {savedToPortfolio ? 'Saved to Portfolio' : 'Add to Portfolio'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
