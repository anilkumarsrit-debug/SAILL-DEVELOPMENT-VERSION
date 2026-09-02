import React, { useState, useEffect } from 'react';
import { Award, FileText, Download, CheckCircle2, Trash2, FolderOpen } from 'lucide-react';
import { dbStorage } from '../../../lib/db';
import { PortfolioItem } from '../../../types';

export const InterviewPortfolioShowcase: React.FC = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const loadPortfolio = async () => {
    const records = await dbStorage.getPortfolioItems('professional-writing');
    setItems(records);
    if (records.length > 0) {
      setSelectedItem(records[0]);
    }
  };

  useEffect(() => {
    loadPortfolio();
  }, []);

  const handleExportPortfolio = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(items, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `SRIT_SAILL_Module6_Interview_Portfolio.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
        <div className="border-b border-[#FAD7A0] pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest bg-[#D35400] text-white px-2 py-0.5 rounded-md">
                Activity 10
              </span>
              <span className="text-xs text-[#5D6D7E] font-bold">R26 Communicative English Laboratory</span>
            </div>
            <h2 className="text-lg font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-[#D35400]" />
              10. Module 6 Student Laboratory Portfolio
            </h2>
            <p className="text-xs text-[#5D6D7E] mt-1">
              Centralized repository of all saved HR simulation responses, STAR workshop stories, AI mock interview report cards, and reflection notes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportPortfolio}
              disabled={items.length === 0}
              className="px-4 py-2 bg-[#2C3E50] text-[#FAD7A0] text-xs font-bold rounded-xl hover:bg-[#1A252F] transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" /> Export Portfolio JSON
            </button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="p-8 text-center bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-2">
            <FolderOpen className="w-10 h-10 text-[#D35400] mx-auto opacity-40" />
            <h3 className="text-xs font-bold text-[#2C3E50]">No Portfolio Entries Recorded Yet</h3>
            <p className="text-[11px] text-[#5D6D7E]">
              Complete activities in Module 6 (HR Simulation, STAR Workshop, or AI Mock Interview) and click "Save to Portfolio" to build your record.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* List Sidebar */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#2C3E50] block">Saved Portfolio Artifacts ({items.length}):</span>
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                {items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedItem(item)}
                    className={`w-full p-3 rounded-xl border text-left transition flex flex-col space-y-1 ${
                      selectedItem?.id === item.id
                        ? 'bg-[#2C3E50] text-white border-[#2C3E50]'
                        : 'bg-[#FFF8F0] text-[#2C3E50] border-[#FAD7A0] hover:bg-[#FAD7A0]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-extrabold text-[#D35400]">
                        {item.category}
                      </span>
                      {item.score && (
                        <span className="text-[10px] font-bold bg-[#D35400]/20 text-[#D35400] px-2 py-0.5 rounded-md">
                          Score: {item.score}%
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-extrabold truncate">{item.title}</h4>
                    <span className="text-[10px] opacity-70">
                      {new Date(item.createdAt).toLocaleDateString('en-IN')}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Item Detail Display */}
            <div className="md:col-span-2 p-5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-4">
              {selectedItem ? (
                <>
                  <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-3">
                    <div>
                      <span className="text-[10px] uppercase font-black text-[#D35400] block">
                        {selectedItem.category} Artifact
                      </span>
                      <h3 className="text-sm font-extrabold text-[#2C3E50] font-heading">
                        {selectedItem.title}
                      </h3>
                    </div>

                    {selectedItem.score && (
                      <div className="bg-white border border-[#FAD7A0] px-3 py-1.5 rounded-xl text-center">
                        <span className="text-[10px] text-[#5D6D7E] block font-bold">SAILL Score</span>
                        <span className="text-sm font-black text-[#D35400]">{selectedItem.score}%</span>
                      </div>
                    )}
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-[#FAD7A0] text-xs text-[#2C3E50] leading-relaxed whitespace-pre-wrap font-sans max-h-[300px] overflow-y-auto">
                    {selectedItem.content}
                  </div>
                </>
              ) : (
                <p className="text-xs text-[#5D6D7E]">Select an item from the sidebar to view details.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
