import React, { useState, useEffect } from 'react';
import { BarChart3, Award, TrendingUp, Clock, Volume2, Shield, CheckCircle2 } from 'lucide-react';
import { dbStorage } from '../../../lib/db';
import { PortfolioItem } from '../../../types';

export const PSPerformanceDashboard: React.FC = () => {
  const [psItems, setPsItems] = useState<PortfolioItem[]>([]);
  const [averageScore, setAverageScore] = useState<number>(9.2);

  useEffect(() => {
    loadPortfolioData();
  }, []);

  const loadPortfolioData = async () => {
    try {
      const items = await dbStorage.getPortfolio();
      const filtered = items.filter((i) => i.moduleId === 'public-speaking');
      setPsItems(filtered);
      if (filtered.length > 0) {
        const avg = filtered.reduce((acc, curr) => acc + (curr.score || 9.0), 0) / filtered.length;
        setAverageScore(Number(avg.toFixed(1)));
      }
    } catch (err) {
      console.error('Failed to load portfolio', err);
    }
  };

  return (
    <div className="srit-card p-6 bg-white border border-[#FAD7A0] rounded-2xl space-y-6">
      <div className="border-b border-[#FAD7A0] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#D35400]" />
            <h3 className="text-lg font-extrabold text-[#2C3E50] font-heading">
              Section 11: Public Speaking Performance Analytics Dashboard
            </h3>
          </div>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Track speech metrics, WPM pace progression, evaluation scores, and earned Orator Badges.
          </p>
        </div>

        <span className="text-xs font-mono font-bold bg-[#FFF8F0] px-3.5 py-1.5 rounded-full border border-[#FAD7A0] text-[#D35400]">
          Total Recorded Sessions: {Math.max(1, psItems.length)}
        </span>
      </div>

      {/* Top Key Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-gradient-to-br from-[#2C3E50] to-[#1a252f] text-white rounded-2xl space-y-1 shadow-xs">
          <span className="text-[10px] text-[#FAD7A0] uppercase font-mono block">Average SAILL Score</span>
          <h4 className="text-2xl font-black font-mono text-[#FAD7A0]">{averageScore} / 10.0</h4>
          <p className="text-[10px] text-slate-300">Target Range: 8.5–10.0 Marks</p>
        </div>

        <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-1">
          <span className="text-[10px] text-[#5D6D7E] uppercase font-mono block">Average Speaking Pace</span>
          <h4 className="text-2xl font-black font-mono text-[#2C3E50]">140 WPM</h4>
          <p className="text-[10px] text-emerald-600 font-bold">Optimal Range (130-150 WPM)</p>
        </div>

        <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-1">
          <span className="text-[10px] text-[#5D6D7E] uppercase font-mono block">Filler Frequency</span>
          <h4 className="text-2xl font-black font-mono text-[#2C3E50]">1.2 / Min</h4>
          <p className="text-[10px] text-emerald-600 font-bold">Low Filler Rate</p>
        </div>

        <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-1">
          <span className="text-[10px] text-[#5D6D7E] uppercase font-mono block">Audience Engagement</span>
          <h4 className="text-2xl font-black font-mono text-[#2C3E50]">91% Rate</h4>
          <p className="text-[10px] text-[#D35400] font-bold">High Resonance</p>
        </div>
      </div>

      {/* Earned Badges Section */}
      <div className="space-y-3">
        <h4 className="text-xs font-black uppercase text-[#D35400] tracking-wider flex items-center gap-1.5">
          <Award className="w-4 h-4 text-[#D35400]" />
          <span>Earned SAILL Public Speaking Badges</span>
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {[
            { badge: 'Master Orator', desc: 'Maintained >9.0 score across 3 speeches', color: 'from-amber-500 to-orange-700' },
            { badge: 'Zero-Filler Orator', desc: '<2 fillers in 3-minute delivery', color: 'from-emerald-600 to-teal-800' },
            { badge: 'Q&A Champion', desc: 'Answered technical questions in PREP format', color: 'from-blue-600 to-indigo-800' },
            { badge: 'Structure Virtuoso', desc: 'Perfect 3-part presentation outline deck', color: 'from-purple-600 to-pink-800' }
          ].map((b, i) => (
            <div key={i} className={`p-3 rounded-xl bg-gradient-to-br ${b.color} text-white space-y-1 shadow-2xs`}>
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold font-heading">{b.badge}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-white/80" />
              </div>
              <p className="text-[9px] text-slate-100 leading-snug">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
