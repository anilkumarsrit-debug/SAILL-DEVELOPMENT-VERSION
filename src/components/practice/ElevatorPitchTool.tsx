import React, { useState } from 'react';
import { AudioRecorder } from './AudioRecorder';
import { Presentation, Sparkles } from 'lucide-react';

interface ElevatorPitchToolProps {
  onSaveWork?: (title: string, audioDataUrl: string) => void;
}

export const ElevatorPitchTool: React.FC<ElevatorPitchToolProps> = ({ onSaveWork }) => {
  const [name, setName] = useState('First-Year Engineering Student');
  const [branch, setBranch] = useState('Computer Science & Engineering (R26)');
  const [projectHighlight, setProjectHighlight] = useState('built an offline-first PWA for language training and automated IoT energy monitor');
  const [goal, setGoal] = useState('securing a software development internship at an innovative tech firm');

  const pitchScript = `Hello! I am ${name}, a First-Year student pursuing ${branch} at SRIT. I am passionate about AI and software systems. Recently, I ${projectHighlight}. I am eager to apply my problem-solving skills toward ${goal}.`;

  return (
    <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-700 pb-4">
        <div className="p-2 bg-indigo-600/20 border border-indigo-500/40 rounded-xl">
          <Presentation className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">30-Second Engineering Elevator Pitch</h3>
          <p className="text-xs text-slate-400">Assemble a high-impact personal pitch for campus recruiters</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name & Roll No:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Engineering Branch:</label>
          <input
            type="text"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Key Project Achievement:</label>
          <input
            type="text"
            value={projectHighlight}
            onChange={(e) => setProjectHighlight(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Target Career Goal:</label>
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
          />
        </div>
      </div>

      <div className="bg-slate-900/90 border border-indigo-800/60 p-4 rounded-xl">
        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-1">Generated 30-Second Script:</span>
        <p className="text-sm font-medium text-slate-100 leading-relaxed italic">"{pitchScript}"</p>
      </div>

      <div>
        <span className="block text-xs font-semibold text-slate-300 mb-2">Record Live Elevator Pitch Speech:</span>
        <AudioRecorder
          targetSampleText={pitchScript}
          onRecordingComplete={(dataUrl) => {
            if (onSaveWork) onSaveWork('Elevator Pitch Audio', dataUrl);
          }}
        />
      </div>
    </div>
  );
};
