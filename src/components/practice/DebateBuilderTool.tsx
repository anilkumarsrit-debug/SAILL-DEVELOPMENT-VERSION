import React, { useState } from 'react';
import { AudioRecorder } from './AudioRecorder';
import { Scale, Sparkles, CheckCircle2 } from 'lucide-react';

interface DebateBuilderToolProps {
  onSaveWork?: (title: string, content: string) => void;
}

export const DebateBuilderTool: React.FC<DebateBuilderToolProps> = ({ onSaveWork }) => {
  const [motion, setMotion] = useState('This House believes that Autonomous AI Systems should be held legally liable for engineering failures.');
  const [stance, setStance] = useState<'Affirmative' | 'Negative'>('Affirmative');
  const [claim, setClaim] = useState('Holding autonomous AI systems and their deploying corporations legally liable enforces strict engineering safety compliance.');
  const [reason, setReason] = useState('Without strict legal liability, tech organizations prioritize rapid deployment over thorough software testing and verification protocols.');
  const [evidence, setEvidence] = useState('In autonomous vehicular testing, mandatory liability frameworks forced manufacturers to implement triple-redundant sensor fail-safes, reducing system accidents by 40%.');

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    const data = JSON.stringify({ motion, stance, claim, reason, evidence }, null, 2);
    if (onSaveWork) {
      onSaveWork(`Debate Motion: ${motion.substring(0, 30)}...`, data);
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-700 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600/20 border border-indigo-500/40 rounded-xl">
            <Scale className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">CRE Debate Argument Builder</h3>
            <p className="text-xs text-slate-400">Construct arguments using Claim, Reason, and Verifiable Evidence</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition"
        >
          {isSaved ? 'Saved to Portfolio!' : 'Save Argument'}
        </button>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Debate Motion Statement:</label>
        <p className="p-3 bg-slate-900 border border-indigo-800/50 rounded-xl text-sm font-bold text-white mb-3">{motion}</p>

        <div className="flex gap-3">
          <button
            onClick={() => setStance('Affirmative')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold border transition ${
              stance === 'Affirmative' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-900 text-slate-400 border-slate-700'
            }`}
          >
            Affirmative (FOR Motion)
          </button>
          <button
            onClick={() => setStance('Negative')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold border transition ${
              stance === 'Negative' ? 'bg-rose-600 text-white border-rose-500' : 'bg-slate-900 text-slate-400 border-slate-700'
            }`}
          >
            Negative (AGAINST Motion)
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-indigo-300 mb-1">1. Claim (Your Core Assertion):</label>
          <textarea
            rows={2}
            value={claim}
            onChange={(e) => setClaim(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-indigo-300 mb-1">2. Reason (Logical Explanation of Why):</label>
          <textarea
            rows={2}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-indigo-300 mb-1">3. Evidence (Concrete Data or Case Study):</label>
          <textarea
            rows={2}
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <div>
        <span className="block text-xs font-semibold text-slate-300 mb-2">Record 90-Second Opening Debate Speech:</span>
        <AudioRecorder />
      </div>
    </div>
  );
};
