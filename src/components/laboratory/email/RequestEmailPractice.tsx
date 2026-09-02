import React, { useState } from 'react';
import { Mail, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

interface RequestScenario {
  id: string;
  title: string;
  category: string;
  recipient: string;
  context: string;
  sampleSubject: string;
  sampleBody: string;
}

const REQUEST_SCENARIOS: RequestScenario[] = [
  {
    id: 'certificate_req',
    title: '1. Certificate Request',
    category: 'Academic Records',
    recipient: 'Academic Section, SRIT',
    context: 'Requesting issuance of an official Course Completion Certificate for Python Programming Lab.',
    sampleSubject: '[Request] Python Lab Course Completion Certificate - Roll No 264G1A0501',
    sampleBody: 'Dear Academic Officer,\n\nI have successfully completed the Python Programming Laboratory coursework for the 2026 academic term with a grade of A+.\n\nCould you kindly issue my official Lab Completion Certificate at your earliest convenience?\n\nThank you for your support.\n\nSincerely,\nAnil Kumar (264G1A0501)\nB.Tech CSE-A'
  },
  {
    id: 'recommendation_letter',
    title: '2. Letter of Recommendation',
    category: 'Higher Studies & Internships',
    recipient: 'Head of Department / Senior Professor',
    context: 'Requesting a Letter of Recommendation (LOR) for a competitive research internship application.',
    sampleSubject: '[LOR Request] Recommendation Letter for Summer Research Internship - Anil Kumar',
    sampleBody: 'Dear Dr. R. V. Sharma,\n\nI am applying for the National AI Summer Research Internship at IISc Bangalore. As I have achieved an A+ grade in your Data Structures course and served as lead developer for our lab project, I would be deeply honored if you could provide a Letter of Recommendation.\n\nI have attached my updated resume, draft statement of purpose, and the official LOR form link.\n\nThank you for your guidance.\n\nRespectfully yours,\nAnil Kumar (264G1A0501)'
  },
  {
    id: 'internship_permission',
    title: '3. Internship Permission',
    category: 'T&P Cell',
    recipient: 'Training & Placement Officer',
    context: 'Requesting a No Objection Certificate (NOC) for pursuing a 2-month summer internship.',
    sampleSubject: '[NOC Request] Permission for Summer Internship - Anil Kumar (CSE)',
    sampleBody: 'Dear Placement Officer,\n\nI have received an offer for a 2-month summer internship in Web Development at Tech Corp starting July 01, 2026.\n\nKindly issue a No Objection Certificate (NOC) from SRIT to facilitate company onboarding.\n\nAttached is the official internship offer letter.\n\nThank you,\nAnil Kumar (264G1A0501)'
  },
  {
    id: 'meeting_request',
    title: '4. Mentor Meeting Request',
    category: 'Faculty Advisory',
    recipient: 'Faculty Mentor',
    context: 'Requesting a brief 10-minute meeting to discuss election of elective subjects for Semester 2.',
    sampleSubject: '[Meeting Request] Academic Guidance on Semester 2 Electives - 264G1A0501',
    sampleBody: 'Dear Prof. Ramesh,\n\nI would appreciate a brief 10-minute meeting during your office hours tomorrow to seek your advice regarding elective course selection for Semester 2.\n\nPlease let me know if Thursday at 3:30 PM suits your schedule.\n\nRegards,\nAnil Kumar'
  },
  {
    id: 'deadline_ext',
    title: '5. Deadline Extension',
    category: 'Academic Submissions',
    recipient: 'Course Instructor',
    context: 'Requesting a 2-day extension for the Mini-Project report due to illness (medical certificate attached).',
    sampleSubject: '[Extension Request] Mini-Project Report Submission - Group 04',
    sampleBody: 'Dear Dr. Lakshmi,\n\nDue to severe fever over the past two days, I was unable to complete our group\'s final report section for the Web Engineering Mini-Project.\n\nWould it be possible to grant our group a 2-day submission extension until Saturday, July 28? I have attached my medical certificate.\n\nThank you for your understanding.\n\nSincerely,\nAnil Kumar'
  },
  {
    id: 'bonafide_cert',
    title: '6. Bonafide Certificate',
    category: 'Administrative Section',
    recipient: 'Principal Office / Administrative Section',
    context: 'Requesting a Bonafide Student Certificate for applying for an external bank education loan.',
    sampleSubject: '[Request] Bonafide Student Certificate for Education Loan - 264G1A0501',
    sampleBody: 'Dear Administrative Officer,\n\nI am applying for an education loan for my B.Tech degree studies at SRIT. The bank requires an official Bonafide Student Certificate.\n\nKindly issue the certificate at your earliest convenience.\n\nDetails:\n- Name: Anil Kumar\n- Roll No: 264G1A0501\n- Branch: B.Tech CSE (Year I)\n\nThank you,\nAnil Kumar'
  },
  {
    id: 'permission_req',
    title: '7. Permission Request',
    category: 'Campus Activities',
    recipient: 'Convener, Tech Fest Committee',
    context: 'Requesting permission to use the SRIT Central Auditorium for an AI Club workshop.',
    sampleSubject: '[Permission Request] Central Auditorium Booking for AI Workshop',
    sampleBody: 'Dear Convener,\n\nThe SRIT AI Club would like to request permission to use the Central Auditorium on August 10, 2026, from 2:00 PM to 5:00 PM for conducting a hands-on Machine Learning workshop.\n\nWe will ensure all AV equipment and seating are maintained in perfect order.\n\nThank you for your approval.\n\nWarm regards,\nAnil Kumar\nStudent Lead, SRIT AI Club'
  }
];

interface RequestEmailPracticeProps {
  onCompleteActivity: () => void;
}

export const RequestEmailPractice: React.FC<RequestEmailPracticeProps> = ({ onCompleteActivity }) => {
  const [selectedId, setSelectedId] = useState<string>('certificate_req');
  const [subject, setSubject] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [evaluation, setEvaluation] = useState<{
    grammar: number;
    tone: number;
    politeness: number;
    organization: number;
    overall: number;
    suggestions: string[];
  } | null>(null);

  const activeScenario = REQUEST_SCENARIOS.find((s) => s.id === selectedId) || REQUEST_SCENARIOS[0];

  const handleSelectScenario = (id: string) => {
    setSelectedId(id);
    const sc = REQUEST_SCENARIOS.find((s) => s.id === id);
    if (sc) {
      setSubject(sc.sampleSubject);
      setBody(sc.sampleBody);
    }
    setEvaluation(null);
  };

  const evaluateRequest = () => {
    if (!body.trim()) return;

    let grammar = 9;
    let tone = 9;
    let politeness = 9;
    let organization = 9;
    const suggestions: string[] = [];

    if (/could you|would it be|kindly|please/i.test(body)) {
      politeness = 10;
    } else {
      politeness = 7;
      suggestions.push('Include polite request openers like "Could you kindly..." or "I would be grateful if..."');
    }

    if (/sincerely|regards|thank you/i.test(body)) {
      tone = 10;
    } else {
      tone = 7;
      suggestions.push('End with a formal sign-off ("Sincerely", "Warm regards").');
    }

    if (body.split('\n\n').length >= 2) {
      organization = 10;
    } else {
      organization = 7;
      suggestions.push('Structure your email into distinct paragraphs (Opening statement, Details, Call-to-action).');
    }

    const overall = Math.round((grammar + tone + politeness + organization) / 4);

    if (suggestions.length === 0) {
      suggestions.push('Flawless request email! Excellent politeness, structured organization, and appropriate tone.');
    }

    setEvaluation({
      grammar,
      tone,
      politeness,
      organization,
      overall,
      suggestions
    });
  };

  return (
    <div className="space-y-6">
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
        {/* Header */}
        <div className="border-b border-[#FAD7A0] pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest bg-[#D35400] text-white px-2 py-0.5 rounded-md">
              Section 6
            </span>
            <span className="text-xs text-[#5D6D7E] font-bold">R26 Communicative English Laboratory</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#D35400]" />
            6. Formal Request Email Practice
          </h2>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Practice writing polite academic and administrative requests for certificates, letters of recommendation, permissions, and extensions.
          </p>
        </div>

        {/* Scenario Buttons */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#D35400] uppercase tracking-wider block">
            Select Formal Request Scenario (7 Core Types):
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {REQUEST_SCENARIOS.map((sc) => {
              const isSelected = sc.id === selectedId;
              return (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => handleSelectScenario(sc.id)}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#D35400] text-white border-[#D35400] shadow-2xs'
                      : 'bg-white text-[#2C3E50] border-[#FAD7A0] hover:bg-[#FFF8F0]'
                  }`}
                >
                  <span className="text-[9px] uppercase font-bold opacity-80">{sc.category}</span>
                  <span className="text-xs font-bold mt-1 leading-snug">{sc.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Editor Box */}
        <div className="p-5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-4">
          <div className="space-y-1 border-b border-[#FAD7A0] pb-3">
            <span className="text-[10px] font-bold uppercase text-[#D35400]">{activeScenario.category}</span>
            <h3 className="text-sm font-extrabold text-[#2C3E50]">{activeScenario.title}</h3>
            <p className="text-xs text-[#5D6D7E]">{activeScenario.context}</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#FAD7A0] space-y-3 font-mono text-xs">
            <div>
              <span className="text-gray-400 font-sans block text-[10px] font-bold">To: {activeScenario.recipient}</span>
            </div>
            <div>
              <span className="text-gray-400 font-sans block text-[10px] font-bold">Subject:</span>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full font-bold text-[#2C3E50] border-b border-gray-200 pb-1 focus:outline-none focus:border-[#D35400]"
              />
            </div>
            <div>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={8}
                className="w-full text-xs text-[#2C3E50] focus:outline-none leading-relaxed resize-y"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={evaluateRequest}
            className="px-6 py-2.5 bg-[#D35400] hover:bg-[#B04300] text-white text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-xs"
          >
            <Sparkles className="w-4 h-4" /> Evaluate Request Politeness & Quality
          </button>
        </div>

        {/* Evaluation Output */}
        {evaluation && (
          <div className="p-5 bg-white border-2 border-[#FAD7A0] rounded-2xl space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h4 className="text-sm font-bold text-[#2C3E50] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Request Email Evaluation
              </h4>
              <span className="text-base font-black text-[#D35400] bg-[#FFF8F0] px-3 py-1 rounded-xl border border-[#FAD7A0]">
                {evaluation.overall} / 10 Marks
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-[10px] text-gray-500 font-bold block uppercase">Grammar</span>
                <span className="text-base font-bold text-[#2C3E50]">{evaluation.grammar} / 10</span>
              </div>
              <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-[10px] text-gray-500 font-bold block uppercase">Tone</span>
                <span className="text-base font-bold text-[#2C3E50]">{evaluation.tone} / 10</span>
              </div>
              <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-[10px] text-gray-500 font-bold block uppercase">Politeness</span>
                <span className="text-base font-bold text-[#2C3E50]">{evaluation.politeness} / 10</span>
              </div>
              <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-[10px] text-gray-500 font-bold block uppercase">Organization</span>
                <span className="text-base font-bold text-[#2C3E50]">{evaluation.organization} / 10</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#D35400] uppercase">Suggestions & Guidance:</span>
              <ul className="space-y-1 text-xs text-[#5D6D7E]">
                {evaluation.suggestions.map((f, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E67E22]" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-[#FAD7A0]">
          <span className="text-xs text-[#5D6D7E]">
            Proceed to full 10-parameter AI evaluation in Section 7.
          </span>

          <button
            type="button"
            onClick={onCompleteActivity}
            className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#B04300] transition flex items-center gap-2"
          >
            Continue to AI Email Review Studio <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
