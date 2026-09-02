import React, { useState, useEffect } from 'react';
import { dbStorage } from '../../../lib/db';
import { PortfolioItem } from '../../../types';
import { FolderCheck, Award, CheckCircle2, Star, TrendingUp, Calendar, Download, Share2 } from 'lucide-react';

interface DebatePortfolioViewProps {
  moduleId: string;
}

export const DebatePortfolioView: React.FC<DebatePortfolioViewProps> = ({ moduleId }) => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);

  useEffect(() => {
    loadPortfolio();
  }, [moduleId]);

  const loadPortfolio = async () => {
    const allItems = await dbStorage.getPortfolio();
    setPortfolioItems(allItems.filter((i) => i.moduleId === moduleId));
  };

  const bestArtifacts = [
    {
      type: 'Best Debate Speech',
      title: 'Affirmative Speech on Autonomous AI Legal Liability',
      score: '9.5 / 10',
      badge: 'Gold Distinction',
      highlight: 'Integrated triple-redundancy engineering evidence and clear Claim-Evidence-Reasoning structure.'
    },
    {
      type: 'Best Rebuttal Execution',
      title: 'Rebuttal on Cloud Data Center Carbon Taxation',
      score: '9.0 / 10',
      badge: 'Excellence Award',
      highlight: 'Direct refutation of opponent cost claims using IEA data and energy subsidy frameworks.'
    },
    {
      type: 'Best Critical Thinking Report',
      title: 'Logical Fallacies Identification Challenge',
      score: '10 / 10',
      badge: 'Perfect Identification',
      highlight: 'Correctly identified Ad Hominem, Strawman, and False Dilemma across all 8 complex technical scenarios.'
    }
  ];

  const progressTimeline = [
    { date: '2026-07-26', milestone: 'Mastered CER Argumentation Blueprint', status: 'Completed' },
    { date: '2026-07-26', milestone: 'Completed Rebuttal Studio 6-Criterion Evaluation', status: 'Completed' },
    { date: '2026-07-26', milestone: 'Achieved 9/10 in AI Debate Simulator', status: 'Completed' },
    { date: '2026-07-26', milestone: 'Faculty Portfolio Approval & R26 Endorsement', status: 'Approved' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-[#D35400]">
            <FolderCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-[#E67E22] uppercase tracking-wider">
              Module 10 • Section 11
            </span>
            <h2 className="text-xl font-bold text-[#D35400] font-heading">
              Debate Student Portfolio
            </h2>
          </div>
        </div>
        <p className="text-xs text-[#2C3E50] leading-relaxed">
          Curated collection of your highest-rated debates, rebuttals, critical thinking reports, AI evaluations, faculty feedback, and progress timeline for placement readiness.
        </p>
      </div>

      {/* Best Debate Showcase Grid */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
        <div className="flex justify-between items-center border-b border-[#FAD7A0] pb-3">
          <h3 className="text-sm font-bold text-[#D35400] font-heading flex items-center gap-2">
            <Star className="w-4 h-4 text-[#E67E22]" />
            <span>Featured Best Debate Artifacts</span>
          </h3>

          <span className="text-[11px] font-bold text-[#D35400] bg-[#FFF8F0] px-2.5 py-1 rounded border border-[#FAD7A0]">
            Verified for R26 Credit
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bestArtifacts.map((art) => (
            <div key={art.type} className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-2">
              <span className="text-[10px] font-bold uppercase text-[#D35400] bg-white px-2 py-0.5 rounded border border-[#FAD7A0]">
                {art.type}
              </span>
              <h4 className="text-xs font-bold text-[#2C3E50]">{art.title}</h4>
              <p className="text-[11px] text-[#5D6D7E] leading-relaxed">{art.highlight}</p>

              <div className="flex justify-between items-center pt-2 border-t border-[#FAD7A0]/60">
                <span className="text-xs font-bold font-mono text-[#D35400]">{art.score}</span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  {art.badge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Faculty Endorsement & Progress Timeline Dual Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Faculty & AI Endorsement Summary */}
        <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-3">
          <h3 className="text-sm font-bold text-[#D35400] font-heading flex items-center gap-2">
            <Award className="w-4 h-4 text-[#E67E22]" />
            <span>AI Evaluation & Faculty Endorsement</span>
          </h3>

          <div className="p-3.5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-xs space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#2C3E50]">Evaluator: Gemini 2.5 AI Engine + Faculty Board</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Verified Excellent
              </span>
            </div>
            <p className="text-[11px] text-[#2C3E50] leading-relaxed italic font-serif">
              "The student exhibits exceptional argumentation prowess, fluent parliamentary delivery, and rapid logical fallacy detection. Highly recommended for campus placement group discussions and technical debate representation."
            </p>
          </div>
        </div>

        {/* Progress Timeline */}
        <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-3">
          <h3 className="text-sm font-bold text-[#D35400] font-heading flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#E67E22]" />
            <span>Debate Progress Timeline</span>
          </h3>

          <div className="space-y-2 text-xs">
            {progressTimeline.map((pt) => (
              <div key={pt.milestone} className="flex justify-between items-center p-2.5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-bold text-[#2C3E50]">{pt.milestone}</span>
                </div>
                <span className="text-[10px] font-mono text-[#E67E22]">{pt.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
