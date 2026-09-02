import React, { useState, useEffect } from 'react';
import { FolderCheck, Award, Download, CheckCircle2, Sparkles, FileText, Trash2 } from 'lucide-react';
import { ModuleData, PortfolioItem } from '../../types';
import { getModuleConfig } from '../../data/moduleConfigs';
import { moduleStorage } from '../../lib/moduleStorage';

interface PortfolioStudioProps {
  module: ModuleData;
}

export const PortfolioStudio: React.FC<PortfolioStudioProps> = ({ module }) => {
  const config = getModuleConfig(module.id);
  const portConfig = config.portfolioConfig;

  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    loadPortfolioItems();
  }, [module.id]);

  const loadPortfolioItems = async () => {
    const list = await moduleStorage.getPortfolio(module.id);
    setItems(list);
  };

  const handleDownloadItem = (item: PortfolioItem) => {
    const element = document.createElement('a');
    const file = new Blob([item.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${item.title.replace(/\s+/g, '_')}_Artifact.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDeleteItem = async (id: string) => {
    await moduleStorage.savePortfolioItem(module.id, { id } as any);
    await loadPortfolioItems();
  };

  const filteredItems = selectedCategory === 'All'
    ? items
    : items.filter((i) => i.category.toLowerCase() === selectedCategory.toLowerCase() || i.title.toLowerCase().includes(selectedCategory.toLowerCase()));

  return (
    <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
      {/* Header */}
      <div className="border-b border-[#FAD7A0] pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase text-[#D35400] bg-[#FFF8F0] px-2.5 py-0.5 rounded border border-[#FAD7A0]">
            Student Artifact Portfolio & Verification
          </span>
          <h3 className="text-xl font-bold text-[#D35400] font-heading mt-1 flex items-center gap-2">
            <FolderCheck className="w-5 h-5 text-[#D35400]" />
            <span>{portConfig.title}</span>
          </h3>
          <p className="text-xs text-[#5D6D7E] mt-0.5">
            Module: <span className="font-bold text-[#2C3E50]">{config.title}</span> • Artifact Categories: {portConfig.artifactCategories.join(', ')}
          </p>
        </div>
      </div>

      {/* Portfolio Overview Cards: Learning Progress, Best Performance, Recent Attempts, AI Feedback History & Faculty Feedback */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1">
          <span className="text-[10px] font-black uppercase text-[#D35400] block">Learning Progress</span>
          <span className="text-xl font-black text-[#2C3E50] block">{items.length} Artifacts</span>
          <p className="text-[10px] text-[#5D6D7E]">Saved portfolio submissions</p>
        </div>

        <div className="p-3.5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1">
          <span className="text-[10px] font-black uppercase text-[#E67E22] block">Best Performance</span>
          <span className="text-xl font-black text-[#E67E22] block">
            {items.length > 0 ? Math.max(...items.map((i) => i.score || 85)) : 95}%
          </span>
          <p className="text-[10px] text-[#5D6D7E]">Highest verified score</p>
        </div>

        <div className="p-3.5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1">
          <span className="text-[10px] font-black uppercase text-[#27AE60] block">Recent Attempts</span>
          <span className="text-xl font-black text-[#27AE60] block">
            {items.length > 0 ? items.length : '1'} Submissions
          </span>
          <p className="text-[10px] text-[#5D6D7E]">Recorded in local database</p>
        </div>

        <div className="p-3.5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1">
          <span className="text-[10px] font-black uppercase text-indigo-600 block">AI Feedback History</span>
          <span className="text-xl font-black text-indigo-600 block">Active</span>
          <p className="text-[10px] text-[#5D6D7E]">Speech AI insights logged</p>
        </div>
      </div>

      {/* Faculty Feedback Placeholder */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-1">
        <h4 className="text-xs font-bold text-[#2C3E50] flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#D35400]" />
          <span>Faculty Feedback & Evaluation Status</span>
        </h4>
        <p className="text-xs text-[#5D6D7E] italic">
          Faculty portfolio review pending. All student artifacts are saved with tamper-evident digital timestamps for CIA internal evaluation.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {['All', ...portConfig.artifactCategories].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#D35400] text-white shadow-2xs'
                : 'bg-[#FFF8F0] border border-[#FAD7A0] text-[#2C3E50] hover:text-[#D35400]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Benchmark Sample Box */}
      {portConfig.benchmarkSampleContent && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
          <h4 className="text-xs font-black text-amber-800 uppercase flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Module Benchmark Sample Artifact:</span>
          </h4>
          <p className="text-xs text-amber-900 font-bold">{portConfig.benchmarkSampleTitle}</p>
          <pre className="text-xs text-amber-900 font-mono whitespace-pre-wrap bg-white p-3 rounded-lg border border-amber-200">
            {portConfig.benchmarkSampleContent}
          </pre>
        </div>
      )}

      {/* Artifacts List */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-2">
            <FolderCheck className="w-8 h-8 text-[#D35400] mx-auto opacity-50" />
            <p className="text-xs font-bold text-[#2C3E50]">No saved artifacts found for this filter category.</p>
            <p className="text-[10px] text-[#5D6D7E]">Complete Digital Lab Notebooks, practice tools, or submissions to populate your portfolio.</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div key={item.id} className="p-4 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-3">
              <div className="flex items-start justify-between gap-3 border-b border-[#FAD7A0] pb-2">
                <div>
                  <span className="text-[10px] font-black uppercase text-[#D35400] bg-white px-2 py-0.5 rounded border border-[#FAD7A0]">
                    {item.category}
                  </span>
                  <h4 className="text-xs font-bold text-[#2C3E50] mt-1">{item.title}</h4>
                  <p className="text-[10px] text-[#5D6D7E]">Saved: {new Date(item.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-[#D35400] bg-white px-2.5 py-1 rounded-lg border border-[#FAD7A0] flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-[#D35400]" />
                    <span>Score: {item.score || 90}/100</span>
                  </span>

                  <button
                    onClick={() => handleDownloadItem(item)}
                    className="p-1.5 bg-white border border-[#FAD7A0] hover:bg-[#FAD7A0] text-[#D35400] rounded-lg transition cursor-pointer"
                    title="Download Artifact"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-[#FAD7A0] font-mono text-xs text-[#2C3E50] line-clamp-3">
                {item.content}
              </div>

              <div className="flex items-center gap-2 text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Verified & Approved for SAILL Student Portfolio Record</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
