import React, { useState } from 'react';
import { Award, Star, Download, Save, CheckCircle2, Sparkles, Layers, ArrowRight, Share2, Check } from 'lucide-react';

interface ReadingPortfolioShowcaseProps {
  onSaveToPortfolio?: (item: any) => void;
}

export const ReadingPortfolioShowcase: React.FC<ReadingPortfolioShowcaseProps> = ({ onSaveToPortfolio }) => {
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const portfolioArtifact = {
    moduleTitle: 'Module 9: Reading Comprehension & Critical Thinking',
    studentGrade: '9.2 / 10 (Excellent)',
    bestSummary:
      'Generative AI models require quantization and RAG vector search to balance operational latency and enterprise data privacy.',
    bestComparativeAnalysis:
      'Centralized cloud offers supreme scale and 99.999% SLAs, whereas decentralized edge computing preserves data sovereignty and reduces sub-millisecond robotics latency.',
    topWpm: '280 WPM with 100% Comprehension Accuracy',
    facultyFeedback: 'Outstanding critical reading and analytical breakdown. Recommended for R26 Honors Portfolio.'
  };

  const handleSavePortfolio = () => {
    if (onSaveToPortfolio) {
      onSaveToPortfolio({
        title: portfolioArtifact.moduleTitle,
        category: 'Reading Comprehension',
        score: portfolioArtifact.studentGrade,
        summary: portfolioArtifact.bestSummary,
        savedAt: new Date().toLocaleDateString()
      });
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
        {/* Header */}
        <div className="border-b border-[#FAD7A0] pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest bg-[#D35400] text-white px-2 py-0.5 rounded-md">
              Section 14
            </span>
            <span className="text-xs text-[#5D6D7E] font-bold">R26 Communicative English Laboratory</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
            <Award className="w-5 h-5 text-[#D35400]" />
            14. Student Portfolio Showcase & Artifact Export
          </h2>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Curate and store your highest-scoring reading comprehension summaries, speed benchmarks, and critical synthesis artifacts in your official SAILL Portfolio.
          </p>
        </div>

        {/* Portfolio Showcase Card */}
        <div className="p-6 bg-linear-to-br from-[#FFF8F0] via-white to-[#FFF8F0] border-2 border-[#D35400] rounded-2xl space-y-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-3">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-[#D35400] fill-current" />
              <h3 className="text-base font-extrabold text-[#2C3E50]">{portfolioArtifact.moduleTitle}</h3>
            </div>
            <span className="bg-[#D35400] text-white font-black text-xs px-3 py-1 rounded-xl">
              {portfolioArtifact.studentGrade}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-white rounded-xl border border-[#FAD7A0] space-y-1">
              <span className="font-extrabold text-[#D35400] block text-[10px] uppercase">Best Technical Summary</span>
              <p className="text-[#2C3E50] font-mono leading-relaxed">{portfolioArtifact.bestSummary}</p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#FAD7A0] space-y-1">
              <span className="font-extrabold text-[#D35400] block text-[10px] uppercase">Best Comparative Synthesis</span>
              <p className="text-[#2C3E50] font-mono leading-relaxed">{portfolioArtifact.bestComparativeAnalysis}</p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#FAD7A0] space-y-1">
              <span className="font-extrabold text-[#D35400] block text-[10px] uppercase">Speed Reading Milestone</span>
              <p className="text-[#2C3E50] font-bold">{portfolioArtifact.topWpm}</p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#FAD7A0] space-y-1">
              <span className="font-extrabold text-[#D35400] block text-[10px] uppercase">Faculty Certificate Endorsement</span>
              <p className="text-[#2C3E50] font-semibold">{portfolioArtifact.facultyFeedback}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-[#FAD7A0]">
            <button
              type="button"
              onClick={handleSavePortfolio}
              className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#E67E22] transition flex items-center gap-2"
            >
              {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{isSaved ? 'Artifact Exported to SAILL Portfolio!' : 'Save Artifact to SAILL Portfolio'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
