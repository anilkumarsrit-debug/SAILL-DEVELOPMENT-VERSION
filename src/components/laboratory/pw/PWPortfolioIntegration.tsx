import React, { useState, useEffect } from 'react';
import { FolderCheck, FileText } from 'lucide-react';
import { dbStorage } from '../../../lib/db';
import { PortfolioItem } from '../../../types';
import { PWAudioPlaceholder } from './PWAudioPlaceholder';

interface PWPortfolioIntegrationProps {
  studentId: string;
}

export const PWPortfolioIntegration: React.FC<PWPortfolioIntegrationProps> = ({ studentId }) => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [activeItem, setActiveItem] = useState<PortfolioItem | null>(null);

  useEffect(() => {
    async function loadPortfolio() {
      try {
        const data = await dbStorage.getPortfolio();
        setItems(data);
        if (data.length > 0) {
          setActiveItem(data[0]);
        }
      } catch (err) {
        console.error('Failed to load portfolio items:', err);
      }
    }
    loadPortfolio();
  }, [studentId]);

  const filteredItems = selectedFilter === 'All'
    ? items
    : items.filter((i) => i.category === selectedFilter || i.moduleId === selectedFilter);

  return (
    <div className="space-y-6">
      <PWAudioPlaceholder
        category="Completion"
        title="Portfolio Integration Instructions"
        transcript="Your best evaluated writing artifacts are automatically archived in your SAILL Professional Showcase Portfolio. You can export or present these during placement interviews."
      />

      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#FAD7A0] pb-4">
          <div>
            <h3 className="text-lg font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
              <FolderCheck className="w-5 h-5 text-[#D35400]" /> SAILL Student Professional Portfolio Showcase
            </h3>
            <p className="text-xs text-[#5D6D7E]">
              Archived best writing samples across Module 1–6 for career placement.
            </p>
          </div>

          <span className="bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400] text-xs font-bold px-3 py-1.5 rounded-xl">
            {items.length} Artifacts Saved
          </span>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {['All', 'text', 'resume', 'report', 'written', 'reflection'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                selectedFilter === cat
                  ? 'bg-[#D35400] text-white border-[#D35400]'
                  : 'bg-[#FFF8F0] border-[#FAD7A0] text-[#2C3E50] hover:bg-[#FAD7A0]'
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Content Viewer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Artifacts List */}
          <div className="space-y-2 md:col-span-1 max-h-96 overflow-y-auto pr-1">
            {filteredItems.length === 0 ? (
              <p className="text-xs text-[#5D6D7E] italic p-4 text-center bg-[#FFF8F0] rounded-xl border border-[#FAD7A0]">
                No portfolio items saved for this filter yet. Complete writing activities and click "Add to Portfolio".
              </p>
            ) : (
              filteredItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveItem(item)}
                  className={`w-full text-left p-3 rounded-xl border transition flex flex-col gap-1 ${
                    activeItem?.id === item.id
                      ? 'bg-[#D35400] text-white border-[#D35400]'
                      : 'bg-[#FFF8F0] border-[#FAD7A0] text-[#2C3E50] hover:border-[#D35400]'
                  }`}
                >
                  <span className="text-xs font-bold line-clamp-1">{item.title}</span>
                  <div className="flex items-center justify-between text-[10px] opacity-80">
                    <span className="uppercase">{item.category}</span>
                    <span className="font-bold">Score: {item.score} / 100</span>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Selected Artifact Preview Pane */}
          <div className="md:col-span-2 p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-3 min-h-[250px]">
            {activeItem ? (
              <>
                <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-2">
                  <div>
                    <h4 className="text-sm font-bold text-[#2C3E50]">{activeItem.title}</h4>
                    <span className="text-[10px] text-[#5D6D7E]">Saved on: {new Date(activeItem.createdAt).toLocaleDateString()}</span>
                  </div>
                  <span className="bg-white border border-[#FAD7A0] text-[#D35400] text-xs font-extrabold px-3 py-1 rounded-lg">
                    {activeItem.score} / 100 Points
                  </span>
                </div>

                <pre className="text-xs text-[#2C3E50] whitespace-pre-wrap font-sans bg-white p-3 rounded-lg border border-[#FAD7A0] leading-relaxed max-h-80 overflow-y-auto">
                  {activeItem.content}
                </pre>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-8 text-[#5D6D7E]">
                <FileText className="w-8 h-8 text-[#D35400] mb-2 opacity-60" />
                <p className="text-xs">Select an artifact from the list to preview content.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
