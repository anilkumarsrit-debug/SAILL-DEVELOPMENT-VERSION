import React, { useState } from 'react';
import { FileText, Sparkles, FolderCheck, Printer, CheckCircle2, AlertCircle } from 'lucide-react';
import { evaluateDocument, WritingFeedback } from '../../../services/ai/writingCoach';
import { PWAudioPlaceholder } from './PWAudioPlaceholder';

interface PWResumeBuilderProps {
  onCompleteActivity: () => void;
  onSaveToPortfolio: (title: string, category: string, content: string, score: number) => void;
}

export const PWResumeBuilder: React.FC<PWResumeBuilderProps> = ({
  onCompleteActivity,
  onSaveToPortfolio
}) => {
  const [fullName, setFullName] = useState('Rahul V. Verma');
  const [contactInfo, setContactInfo] = useState('Roll No: 26SR1A0501 | rahul.v@srit.ac.in | +91 9876543210 | Anantapur, AP | github.com/rahulverma | linkedin.com/in/rahulverma-srit');
  const [summary, setSummary] = useState('First-Year Computer Science & Engineering student at SRIT with strong foundations in Python, Data Structures, and Web Development. Passionate about building scalable cloud apps and AI-powered learning tools.');
  const [education, setEducation] = useState('B.Tech in Computer Science & Engineering | Srinivasa Ramanujan Institute of Technology (SRIT)\nBatch: 2026 - 2030 | Semester 1 GPA: 9.2/10.0');
  const [skills, setSkills] = useState('Programming: Python, Java, C++, JavaScript/TypeScript\nWeb & Cloud: React.js, Tailwind CSS, Node.js, Git, SQLite\nCore Competencies: Problem Solving, Technical Writing, Teamwork');
  const [projects, setProjects] = useState('• Engineered a native Android campus navigation mobile app using Java & SQLite, reducing new student navigation delays by 40%.\n• Developed an AI-powered writing assistant web tool for SAILL lab using React and Gemini API endpoints.\n• Built an IoT soil moisture monitoring sensor node utilizing ESP32 microcontrollers.');
  const [certifications, setCertifications] = useState('• Google Cloud Cybersecurity Certificate\n• NPTEL Online Certification - Programming in Java (Elite)');
  const [achievements, setAchievements] = useState('• Secured 1st Rank in SRIT First-Year Technical Coding Competition (2026)\n• Class Representative (CSE-A) & Active Member of IEEE Student Branch');

  const [evalResult, setEvalResult] = useState<WritingFeedback | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [savedToPortfolio, setSavedToPortfolio] = useState(false);

  const handleEvaluate = async () => {
    setIsAnalyzing(true);
    const resumeText = `NAME: ${fullName}\nCONTACT: ${contactInfo}\n\nSUMMARY:\n${summary}\n\nEDUCATION:\n${education}\n\nTECHNICAL SKILLS:\n${skills}\n\nPROJECTS:\n${projects}\n\nCERTIFICATIONS:\n${certifications}\n\nACHIEVEMENTS:\n${achievements}`;

    try {
      const res = await evaluateDocument({
        documentType: 'Engineering Resume',
        content: resumeText,
        titleOrSubject: `${fullName} - Engineering Resume`
      });
      setEvalResult(res);
      if (res.score10 >= 6.0) {
        onCompleteActivity();
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSavePortfolio = () => {
    if (!evalResult) return;
    const resumeText = `${fullName}\n${contactInfo}\n\nSummary:\n${summary}\n\nEducation:\n${education}\n\nSkills:\n${skills}\n\nProjects:\n${projects}\n\nCertifications:\n${certifications}\n\nAchievements:\n${achievements}`;
    onSaveToPortfolio(`ATS Resume: ${fullName}`, 'Engineering Resume', resumeText, evalResult.score10);
    setSavedToPortfolio(true);
  };

  return (
    <div className="space-y-6">
      <PWAudioPlaceholder
        category="Instructions"
        title="ATS Engineering Resume Builder Instructions"
        transcript="Build a clean, single-column ATS-friendly engineering resume. Complete your personal details, summary, SRIT education, core technical skills, and project bullets starting with active verbs."
      />

      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
        <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-3">
          <h3 className="text-base font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#D35400]" /> ATS-Compliant Resume Formatter
          </h3>
          <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-md font-bold">
            95% ATS Compatibility Standard
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#2C3E50] mb-1">Full Name:</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-2.5 text-xs font-bold text-[#2C3E50]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2C3E50] mb-1">Contact & Profile Links:</label>
            <input
              type="text"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-2.5 text-xs text-[#2C3E50]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#2C3E50] mb-1">Professional Summary / Career Objective:</label>
          <textarea
            rows={3}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-2.5 text-xs text-[#2C3E50]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#2C3E50] mb-1">Education Details (SRIT):</label>
            <textarea
              rows={3}
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-2.5 text-xs text-[#2C3E50]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2C3E50] mb-1">Technical & Soft Skills:</label>
            <textarea
              rows={3}
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-2.5 text-xs text-[#2C3E50]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#2C3E50] mb-1">
            Engineering Projects (Action Verb + Task + Impact Formula):
          </label>
          <textarea
            rows={5}
            value={projects}
            onChange={(e) => setProjects(e.target.value)}
            className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-3 text-xs sm:text-sm text-[#2C3E50] leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#2C3E50] mb-1">Certifications & Online Courses:</label>
            <textarea
              rows={3}
              value={certifications}
              onChange={(e) => setCertifications(e.target.value)}
              className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-2.5 text-xs text-[#2C3E50]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2C3E50] mb-1">Co-Curricular Achievements & Honors:</label>
            <textarea
              rows={3}
              value={achievements}
              onChange={(e) => setAchievements(e.target.value)}
              className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-2.5 text-xs text-[#2C3E50]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#FAD7A0]">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 border border-[#FAD7A0] text-[#5D6D7E] text-xs font-bold rounded-xl hover:bg-[#FFF8F0] flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" /> Print / Export PDF
          </button>

          <button
            type="button"
            onClick={handleEvaluate}
            disabled={isAnalyzing}
            className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#B04300] transition flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Evaluate Resume & ATS Score (10 Marks)
          </button>
        </div>
      </div>

      {evalResult && (
        <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-2">
            <div>
              <h4 className="font-bold text-[#2C3E50]">ATS Resume Scorecard</h4>
              <span className="text-xs text-emerald-700 font-bold">ATS Parsing Accuracy: {evalResult.atsCompatibilityPercent}%</span>
            </div>
            <span className="text-2xl font-black text-[#D35400]">{evalResult.score10} / 10</span>
          </div>

          <p className="text-xs text-[#5D6D7E]">{evalResult.overallFeedback}</p>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleSavePortfolio}
              disabled={savedToPortfolio}
              className="px-4 py-2 border border-[#FAD7A0] text-[#D35400] text-xs font-bold rounded-xl hover:bg-[#FFF8F0]"
            >
              <FolderCheck className="w-4 h-4 inline mr-1" />
              {savedToPortfolio ? 'Saved to Portfolio' : 'Add to Portfolio'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
