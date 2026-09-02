import React, { useState } from 'react';
import { FileText, Sparkles, RotateCcw, FolderCheck, CheckCircle2 } from 'lucide-react';
import { evaluateDocument, WritingFeedback } from '../../../services/ai/writingCoach';
import { PWAudioPlaceholder } from './PWAudioPlaceholder';

interface PWFormalLetterProps {
  onCompleteActivity: () => void;
  onSaveToPortfolio: (title: string, category: string, content: string, score: number) => void;
}

export interface LetterScenario {
  id: string;
  title: string;
  recipientTitle: string;
  defaultSubject: string;
  scenarioBrief: string;
  sampleBody: string;
}

const LETTER_SCENARIOS: LetterScenario[] = [
  {
    id: 'noc-internship',
    title: '1. No Objection Certificate (NOC) Request for Internship',
    recipientTitle: 'The Principal / Dean Academics, SRIT Anantapur',
    defaultSubject: 'Application for No Objection Certificate (NOC) for Summer Industrial Internship',
    scenarioBrief: 'Draft a formal letter to the Principal requesting an official NOC for a 6-week summer internship at BHEL / Infosys.',
    sampleBody: 'I am writing to respectfully request a No Objection Certificate (NOC) to pursue a 6-week summer internship at BHEL from May 15 to June 30, 2026. The internship will provide valuable practical exposure to industrial power systems, complementing my academic curriculum.'
  },
  {
    id: 'sponsorship',
    title: '2. Sponsorship Application for Technical Symposium',
    recipientTitle: 'The Managing Director, Tech Solutions Pvt Ltd',
    defaultSubject: 'Proposal for Corporate Sponsorship - SRIT Annual National Tech Symposium 2026',
    scenarioBrief: 'Formally request corporate sponsorship for the SRIT National Student Engineering Symposium.',
    sampleBody: 'On behalf of the SRIT Student Technical Association, I write to invite Tech Solutions Pvt Ltd as our Title Sponsor for Innovate 2026. With over 1,500 engineering delegates participating across South India, this symposium offers prime brand visibility.'
  },
  {
    id: 'permission-hod',
    title: '3. Special Permission Letter to HOD for Lab Access',
    recipientTitle: 'The Head of Department, Department of CSE, SRIT',
    defaultSubject: 'Permission Request for After-Hours Access to AI Research Laboratory',
    scenarioBrief: 'Request permission from HOD for late-evening lab access to train machine learning models for an upcoming hackathon.',
    sampleBody: 'We respectfully request permission to access the High-Performance Computing Lab between 5:00 PM and 8:00 PM from Monday to Thursday. Our team requires specialized GPU hardware to train deep learning models for the National AI Competition.'
  },
  {
    id: 'formal-appeal',
    title: '4. Formal Academic Grievance & Re-evaluation Appeal',
    recipientTitle: 'The Controller of Examinations, SRIT Anantapur',
    defaultSubject: 'Request for Answer Script Re-evaluation - Mid-Semester Examination (Roll 26SR1A0501)',
    scenarioBrief: 'Submit a formal appeal for answer script re-evaluation following institutional protocols.',
    sampleBody: 'I am writing to formally submit an application for the re-evaluation of my Mid-Semester Communicative English Laboratory answer script. I have paid the required fee and attached the payment receipt herewith.'
  }
];

export const PWFormalLetter: React.FC<PWFormalLetterProps> = ({
  onCompleteActivity,
  onSaveToPortfolio
}) => {
  const [selectedId, setSelectedId] = useState<string>(LETTER_SCENARIOS[0].id);
  const currentScenario = LETTER_SCENARIOS.find((s) => s.id === selectedId) || LETTER_SCENARIOS[0];

  const [senderAddress, setSenderAddress] = useState('First-Year Student, Roll No: 26SR1A0501\nDepartment of Computer Science & Engineering\nSrinivasa Ramanujan Institute of Technology (SRIT)\nAnantapur, Andhra Pradesh');
  const [dateText, setDateText] = useState(new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }));
  const [recipientAddress, setRecipientAddress] = useState(currentScenario.recipientTitle);
  const [subject, setSubject] = useState(currentScenario.defaultSubject);
  const [letterBody, setLetterBody] = useState(currentScenario.sampleBody);

  const [evalResult, setEvalResult] = useState<WritingFeedback | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [savedToPortfolio, setSavedToPortfolio] = useState(false);

  const handleSelectScenario = (id: string) => {
    setSelectedId(id);
    const scen = LETTER_SCENARIOS.find((s) => s.id === id);
    if (scen) {
      setRecipientAddress(scen.recipientTitle);
      setSubject(scen.defaultSubject);
      setLetterBody(scen.sampleBody);
      setEvalResult(null);
      setSavedToPortfolio(false);
    }
  };

  const handleEvaluate = async () => {
    setIsAnalyzing(true);
    const fullLetter = `SENDER:\n${senderAddress}\n\nDATE: ${dateText}\n\nRECIPIENT:\n${recipientAddress}\n\nSUBJECT: ${subject}\n\nRespected Sir/Madam,\n\n${letterBody}\n\nThanking you.\n\nYours faithfully,\nFirst-Year Engineering Student\nSRIT Anantapur`;

    try {
      const res = await evaluateDocument({
        documentType: 'Formal Letter',
        content: fullLetter,
        titleOrSubject: subject,
        recipientOrRole: recipientAddress
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
    setLetterBody(currentScenario.sampleBody);
    setEvalResult(null);
    setSavedToPortfolio(false);
  };

  const handleSaveToPortfolio = () => {
    if (!evalResult) return;
    const fullLetter = `${senderAddress}\n\nDate: ${dateText}\n\nTo,\n${recipientAddress}\n\nSubject: ${subject}\n\nRespected Sir/Madam,\n\n${letterBody}\n\nThanking you,\n\nYours faithfully,\nSRIT Student`;
    onSaveToPortfolio(`Formal Letter: ${currentScenario.title}`, 'Formal Letter', fullLetter, evalResult.score10);
    setSavedToPortfolio(true);
  };

  return (
    <div className="space-y-6">
      <PWAudioPlaceholder
        category="Instructions"
        title="Formal Letter Writing Activity Instructions"
        transcript="Draft formal institutional letters following standard block alignment formats. Ensure sender credentials, date, recipient designation, subject, polite salutation, body paragraphs, and formal closure are precise."
      />

      {/* Scenario Selector */}
      <div className="srit-card p-5 bg-white border border-[#FAD7A0]">
        <label className="block text-xs font-bold text-[#D35400] uppercase tracking-wider mb-2">
          Select Formal Administrative Letter Scenario:
        </label>
        <select
          value={selectedId}
          onChange={(e) => handleSelectScenario(e.target.value)}
          className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-3 text-xs sm:text-sm font-bold text-[#2C3E50] focus:outline-none focus:border-[#D35400]"
        >
          {LETTER_SCENARIOS.map((scen) => (
            <option key={scen.id} value={scen.id}>
              {scen.title}
            </option>
          ))}
        </select>

        <div className="mt-3 p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-xs text-[#5D6D7E]">
          <strong className="text-[#2C3E50]">Scenario Brief:</strong> {currentScenario.scenarioBrief}
        </div>
      </div>

      {/* Letter Editor */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
        <h3 className="text-base font-extrabold text-[#2C3E50] font-heading flex items-center gap-2 border-b border-[#FAD7A0] pb-3">
          <FileText className="w-5 h-5 text-[#D35400]" /> Formal Block-Format Letter Builder
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#2C3E50] mb-1">1. From (Sender Address & Roll No):</label>
            <textarea
              rows={3}
              value={senderAddress}
              onChange={(e) => setSenderAddress(e.target.value)}
              className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-2.5 text-xs text-[#2C3E50]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2C3E50] mb-1">2. Date & To (Recipient Designation):</label>
            <input
              type="text"
              value={dateText}
              onChange={(e) => setDateText(e.target.value)}
              className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-2.5 text-xs text-[#2C3E50] mb-2"
            />
            <input
              type="text"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-2.5 text-xs font-bold text-[#2C3E50]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#2C3E50] mb-1">3. Subject Line:</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-2.5 text-xs font-bold text-[#2C3E50]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#2C3E50] mb-1">4. Letter Body (Context, Justification & Request):</label>
          <textarea
            rows={8}
            value={letterBody}
            onChange={(e) => setLetterBody(e.target.value)}
            className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-3 text-xs sm:text-sm text-[#2C3E50] focus:outline-none focus:border-[#D35400] leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#FAD7A0]">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 border border-[#FAD7A0] text-[#5D6D7E] text-xs font-bold rounded-xl hover:bg-[#FFF8F0]"
          >
            <RotateCcw className="w-3.5 h-3.5 inline mr-1" /> Reset
          </button>

          <button
            type="button"
            onClick={handleEvaluate}
            disabled={isAnalyzing || letterBody.length < 10}
            className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#B04300] transition flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Evaluate Letter (10 Marks)
          </button>
        </div>
      </div>

      {/* AI Evaluation */}
      {evalResult && (
        <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-3">
            <h3 className="text-lg font-bold text-[#2C3E50]">Formal Letter Evaluation</h3>
            <span className="text-2xl font-black text-[#D35400]">{evalResult.score10} / 10 Marks</span>
          </div>

          <p className="text-xs text-[#5D6D7E]">{evalResult.overallFeedback}</p>

          <div className="flex justify-end pt-3">
            <button
              type="button"
              onClick={handleSaveToPortfolio}
              disabled={savedToPortfolio}
              className="px-5 py-2 bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400] text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-[#FAD7A0]"
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
