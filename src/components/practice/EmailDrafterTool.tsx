import React, { useState } from 'react';
import { checkGrammarAndTone, GrammarFeedback } from '../../services/ai';
import { Mail, Sparkles, Send, CheckCircle2, Copy, FileText, AlertCircle } from 'lucide-react';

interface EmailDrafterToolProps {
  onSaveWork?: (title: string, textContent: string, feedback: GrammarFeedback) => void;
}

export const EmailDrafterTool: React.FC<EmailDrafterToolProps> = ({ onSaveWork }) => {
  const [recipient, setRecipient] = useState('Dr. A. Sharma, Head of Department (CSE)');
  const [subject, setSubject] = useState('[Internship Request] Summer Research Internship Application - CSE 1st Year');
  const [body, setBody] = useState(
    `Dear Dr. Sharma,

I hope this email finds you well.

I am writing to formally request approval for a 4-week Summer Research Internship in Applied Artificial Intelligence. As a first-year Computer Science Engineering student (Roll No: 264G1A0501), I have completed coursework in Data Structures and Python.

Key Highlights of my preparation:
• Built a Python-based machine learning model for data classification.
• Maintained a 9.2 CGPA in First-Year Engineering R26 syllabus modules.

I have attached my updated engineering resume and project abstract for your kind review. Thank you for your time and guidance.

Sincerely,
First-Year Engineering Student
Roll No: 264G1A0501 | Section CSE-A
SRIT Ananthapuramu`
  );

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<GrammarFeedback | null>(null);
  const [copied, setCopied] = useState(false);

  const handleAnalyzeEmail = async () => {
    setIsAnalyzing(true);
    try {
      const fullText = `Subject: ${subject}\n\n${body}`;
      const result = await checkGrammarAndTone({
        text: fullText,
        contextType: 'Email'
      });
      setFeedback(result);
      if (onSaveWork) {
        onSaveWork(`Email Draft: ${subject.substring(0, 30)}...`, fullText, result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopy = () => {
    const fullText = `To: ${recipient}\nSubject: ${subject}\n\n${body}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-700/80 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600/20 border border-indigo-500/40 rounded-xl">
              <Mail className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Interactive Corporate Email Editor</h3>
              <p className="text-xs text-slate-400">Practice formal tone, subject lines, and structured formatting</p>
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold rounded-lg transition flex items-center gap-1.5"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Email'}</span>
          </button>
        </div>

        {/* Email Fields */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">To / Recipient:</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Subject Line (Specific & Actionable):</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-indigo-300 font-medium focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Body:</label>
            <textarea
              rows={10}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed font-sans"
            />
          </div>
        </div>

        <button
          onClick={handleAnalyzeEmail}
          disabled={isAnalyzing}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-indigo-500/20 transition flex items-center justify-center gap-2"
        >
          {isAnalyzing ? <Sparkles className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          <span>Analyze Email Tone & Save Draft</span>
        </button>
      </div>

      {/* AI Analysis Feedback */}
      {feedback && (
        <div className="bg-slate-800/90 border border-indigo-500/50 rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>AI Writing Coach Feedback</span>
            </h4>
            <span className="text-sm font-black text-emerald-400">Score: {feedback.score}%</span>
          </div>

          <p className="text-xs text-slate-300 bg-slate-900/60 p-3.5 rounded-xl border border-slate-700">
            {feedback.overallFeedback}
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700">
              <span className="text-slate-400 block mb-0.5">Formality Score</span>
              <span className="font-bold text-indigo-300">{feedback.formalityScorePercent}% Formal</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700">
              <span className="text-slate-400 block mb-0.5">Readability Standard</span>
              <span className="font-bold text-indigo-300">{feedback.readabilityGradeLevel}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
