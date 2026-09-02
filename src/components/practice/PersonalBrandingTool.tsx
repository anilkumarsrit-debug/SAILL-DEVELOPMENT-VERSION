import React, { useState } from 'react';
import { Globe, CheckCircle2, Award } from 'lucide-react';

interface PersonalBrandingToolProps {
  onSaveWork?: (title: string, content: string) => void;
}

export const PersonalBrandingTool: React.FC<PersonalBrandingToolProps> = ({ onSaveWork }) => {
  const [headline, setHeadline] = useState('Computer Science Undergrad @ SRIT | React & Python Developer | Aspiring SDE');
  const [bio, setBio] = useState(
    'Driven First-Year Engineering student pursuing R26 Communicative English Lab excellence. Passionate about full-stack web applications, algorithms, and AI tools. Looking forward to campus placement opportunities in software development.'
  );

  const [githubUrl, setGithubUrl] = useState('https://github.com/student264G1A0501');
  const [linkedinUrl, setLinkedinUrl] = useState('https://linkedin.com/in/student-srit');
  const [brandScore, setBrandScore] = useState<number | null>(null);

  const calculateBrandScore = () => {
    let score = 50;
    if (headline.length > 30) score += 20;
    if (bio.length > 80) score += 15;
    if (githubUrl.includes('github.com')) score += 10;
    if (linkedinUrl.includes('linkedin.com')) score += 5;
    setBrandScore(score);

    if (onSaveWork) {
      onSaveWork('LinkedIn & Personal Branding Profile', JSON.stringify({ headline, bio, githubUrl, linkedinUrl }));
    }
  };

  return (
    <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-700 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600/20 border border-indigo-500/40 rounded-xl">
            <Globe className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">LinkedIn & Digital Personal Branding</h3>
            <p className="text-xs text-slate-400">Optimize professional online presence for engineering recruiters</p>
          </div>
        </div>

        <button
          onClick={calculateBrandScore}
          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition"
        >
          Calculate Brand Score & Save
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">LinkedIn Professional Headline:</label>
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">About Summary / Bio Paragraph:</label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub Portfolio Link:</label>
            <input
              type="text"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-indigo-300"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">LinkedIn Profile Link:</label>
            <input
              type="text"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-indigo-300"
            />
          </div>
        </div>
      </div>

      {brandScore !== null && (
        <div className="bg-slate-900/90 border border-emerald-800/60 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold text-white">Engineering Digital Brand Score:</span>
          </div>
          <span className="text-xl font-black text-emerald-400">{brandScore} / 100</span>
        </div>
      )}
    </div>
  );
};
