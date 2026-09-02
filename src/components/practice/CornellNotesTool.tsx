import React, { useState } from 'react';
import { Headphones, BookOpen, Save, Play, CheckCircle2 } from 'lucide-react';

interface CornellNotesToolProps {
  onSaveWork?: (title: string, content: string) => void;
}

export const CornellNotesTool: React.FC<CornellNotesToolProps> = ({ onSaveWork }) => {
  const [topicTitle, setTopicTitle] = useState('Lecture: Quantum Computing Encryption vs RSA Standards');
  const [cues, setCues] = useState(`• Quantum Supremacy
• Qubits vs Classical Bits
• Shor's Algorithm
• Lattice-Based Cryptography`);

  const [notes, setNotes] = useState(`1. Classical RSA cryptography relies on the difficulty of factoring large prime numbers.
2. Shor's Algorithm running on a fault-tolerant quantum computer can factor prime numbers in polynomial time (O(n³)), effectively breaking RSA-2048 encryption.
3. Quantum Key Distribution (QKD) uses quantum physics principles (Heisenberg Uncertainty) to detect eavesdropping instantly.
4. Post-Quantum Cryptography (PQC) standards are now being deployed by NIST for future data protection.`);

  const [summary, setSummary] = useState(
    'Quantum computing poses a structural threat to traditional RSA encryption via Shor\'s Algorithm. Engineering defense relies on adopting Post-Quantum Cryptography (PQC) and Quantum Key Distribution (QKD).'
  );

  const [isSaved, setIsSaved] = useState(false);

  const playTTSLecture = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(notes);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSave = () => {
    const fullNotes = JSON.stringify({ topicTitle, cues, notes, summary }, null, 2);
    if (onSaveWork) {
      onSaveWork(`Cornell Notes: ${topicTitle}`, fullNotes);
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-700 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600/20 border border-indigo-500/40 rounded-xl">
            <BookOpen className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Cornell 3-Column Note-Taking Studio</h3>
            <p className="text-xs text-slate-400">Organize active listening lecture notes into Cues, Notes, and Summary</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={playTTSLecture}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Listen Passage</span>
          </button>
          <button
            onClick={handleSave}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaved ? 'Saved!' : 'Save Notes'}</span>
          </button>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Lecture Topic / Title:</label>
        <input
          type="text"
          value={topicTitle}
          onChange={(e) => setTopicTitle(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* 2 Column Layout for Cues & Main Notes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 bg-slate-900/80 border border-slate-700 p-4 rounded-xl">
          <label className="block text-xs font-bold text-indigo-300 mb-2">Cues & Keywords (30% Left Column):</label>
          <textarea
            rows={10}
            value={cues}
            onChange={(e) => setCues(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-indigo-200 font-mono focus:outline-none focus:border-indigo-500 leading-relaxed"
          />
        </div>

        <div className="md:col-span-2 bg-slate-900/80 border border-slate-700 p-4 rounded-xl">
          <label className="block text-xs font-bold text-indigo-300 mb-2">Main Lecture Notes (70% Right Column):</label>
          <textarea
            rows={10}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
          />
        </div>
      </div>

      {/* Bottom Summary Row */}
      <div className="bg-slate-900/80 border border-slate-700 p-4 rounded-xl">
        <label className="block text-xs font-bold text-emerald-400 mb-2">Summary Section (Bottom Synthesis):</label>
        <textarea
          rows={3}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 leading-relaxed"
        />
      </div>
    </div>
  );
};
