import React, { useState } from 'react';
import { AudioRecorder } from './AudioRecorder';
import { evaluateInterviewResponse, InterviewFeedback } from '../../services/ai';
import { Briefcase, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatScore10, getPerformanceDescriptor } from '../../lib/scoring';

const COMMON_QUESTIONS = [
  { id: 'q1', title: 'Tell me about yourself and why you selected Engineering.', category: 'HR' as const },
  { id: 'q2', title: 'Describe a difficult technical bug or project obstacle you encountered and how you solved it.', category: 'Technical' as const },
  { id: 'q3', title: 'Give an example of a team conflict during a hackathon or lab project and how you handled it.', category: 'Behavioral' as const },
  { id: 'q4', title: 'Why do you want to join our company as a Software Engineering intern?', category: 'HR' as const }
];

interface STARInterviewToolProps {
  onSaveWork?: (title: string, content: string, feedback: InterviewFeedback) => void;
}

export const STARInterviewTool: React.FC<STARInterviewToolProps> = ({ onSaveWork }) => {
  const [selectedQuestion, setSelectedQuestion] = useState(COMMON_QUESTIONS[1]);
  const [situation, setSituation] = useState('During our First-Year Engineering R26 web lab project, our team database connection failed right before final code evaluation.');
  const [task, setTask] = useState('As backend coordinator, I was responsible for restoring database connectivity and optimizing query latency.');
  const [action, setAction] = useState('I debugged the connection pool parameters in Node.js, enabled local caching, and re-tested API endpoints using Postman within 25 minutes.');
  const [result, setResult] = useState('The system successfully passed all test cases, handling 50 concurrent student requests with zero errors, securing 100% marks.');

  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);

  const handleEvaluate = async () => {
    setIsAnalyzing(true);
    try {
      const fullResponseText = `Situation: ${situation}\nTask: ${task}\nAction: ${action}\nResult: ${result}`;
      const res = await evaluateInterviewResponse({
        questionTitle: selectedQuestion.title,
        category: selectedQuestion.category,
        studentResponse: fullResponseText
      });
      setFeedback(res);
      if (onSaveWork) {
        onSaveWork(`Interview Response: ${selectedQuestion.title}`, fullResponseText, res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 border-b border-slate-700/80 pb-4 mb-5">
          <div className="p-2 bg-indigo-600/20 border border-indigo-500/40 rounded-xl">
            <Briefcase className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">STAR Method Interview Builder</h3>
            <p className="text-xs text-slate-400">Structure behavioral and technical answers using Situation, Task, Action, and Result</p>
          </div>
        </div>

        {/* Question Selector */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-300 mb-2">Select Interview Prompt:</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {COMMON_QUESTIONS.map((q) => (
              <button
                key={q.id}
                onClick={() => {
                  setSelectedQuestion(q);
                  setFeedback(null);
                }}
                className={`p-3 text-left rounded-xl border text-xs font-medium transition ${
                  selectedQuestion.id === q.id
                    ? 'bg-indigo-950/70 border-indigo-500 text-white'
                    : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:border-slate-600'
                }`}
              >
                <span className="text-[10px] font-bold uppercase text-indigo-400 block mb-1">[{q.category}]</span>
                <span>{q.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* STAR Form Inputs */}
        <div className="space-y-3 mb-6">
          <div>
            <label className="block text-xs font-bold text-indigo-300 mb-1">S - Situation (Context & Background):</label>
            <textarea
              rows={2}
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-indigo-300 mb-1">T - Task (Your Specific Goal or Challenge):</label>
            <textarea
              rows={2}
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-indigo-300 mb-1">A - Action (Engineering Steps YOU Took):</label>
            <textarea
              rows={3}
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-indigo-300 mb-1">R - Result (Quantifiable Outcomes & Achievements):</label>
            <textarea
              rows={2}
              value={result}
              onChange={(e) => setResult(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Voice Recording Option */}
        <div className="mb-6">
          <span className="block text-xs font-semibold text-slate-300 mb-2">Record Spoken Audio Response (Optional):</span>
          <AudioRecorder onRecordingComplete={(url) => setRecordedAudioUrl(url)} />
        </div>

        <button
          onClick={handleEvaluate}
          disabled={isAnalyzing}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2"
        >
          {isAnalyzing ? <Sparkles className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>Evaluate STAR Response with AI Interview Coach</span>
        </button>
      </div>

      {/* Feedback Panel */}
      {feedback && (
        <div className="bg-slate-800/90 border border-indigo-500/50 rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <h4 className="text-base font-bold text-white">AI Interview Coach Score</h4>
            <span className="text-xl font-black text-emerald-400">
              {formatScore10(feedback.score)} ({getPerformanceDescriptor(feedback.score)})
            </span>
          </div>

          <p className="text-xs text-slate-200 bg-slate-900/60 p-3.5 rounded-xl border border-slate-700">
            {feedback.overallFeedback}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className={`p-2.5 rounded-lg border ${feedback.starMethodAnalysis.situationPresent ? 'bg-emerald-950/40 border-emerald-700 text-emerald-300' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>
              Situation: {feedback.starMethodAnalysis.situationPresent ? '✓ Included' : 'Missing'}
            </div>
            <div className={`p-2.5 rounded-lg border ${feedback.starMethodAnalysis.taskPresent ? 'bg-emerald-950/40 border-emerald-700 text-emerald-300' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>
              Task: {feedback.starMethodAnalysis.taskPresent ? '✓ Included' : 'Missing'}
            </div>
            <div className={`p-2.5 rounded-lg border ${feedback.starMethodAnalysis.actionPresent ? 'bg-emerald-950/40 border-emerald-700 text-emerald-300' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>
              Action: {feedback.starMethodAnalysis.actionPresent ? '✓ Included' : 'Missing'}
            </div>
            <div className={`p-2.5 rounded-lg border ${feedback.starMethodAnalysis.resultPresent ? 'bg-emerald-950/40 border-emerald-700 text-emerald-300' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>
              Result: {feedback.starMethodAnalysis.resultPresent ? '✓ Included' : 'Missing'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
