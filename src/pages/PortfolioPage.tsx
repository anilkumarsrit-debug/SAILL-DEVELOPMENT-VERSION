import React, { useState, useEffect } from 'react';
import { PortfolioItem, RecordingItem, StudentProfile } from '../types';
import { dbStorage } from '../lib/db';
import { FolderCheck, Mic, FileText, Trash2, Printer } from 'lucide-react';
import { formatScore10, getPerformanceDescriptor } from '../lib/scoring';

interface PortfolioPageProps {
  profile: StudentProfile;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({ profile }) => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [recordings, setRecordings] = useState<RecordingItem[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'written' | 'recordings'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const pList = await dbStorage.getPortfolio();
    const rList = await dbStorage.getRecordings();
    setPortfolioItems(pList);
    setRecordings(rList);
  };

  const handleDeleteWritten = async (id: string) => {
    if (confirm('Delete this saved portfolio submission?')) {
      await dbStorage.deletePortfolioItem(id);
      await loadData();
    }
  };

  const handleDeleteRecording = async (id: string) => {
    if (confirm('Delete this audio recording?')) {
      await dbStorage.deleteRecording(id);
      await loadData();
    }
  };

  const handlePrintRecordSummary = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-12 text-[#2C3E50]">
      {/* Header */}
      <div className="srit-card p-6 sm:p-8 bg-white border border-[#FAD7A0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#D35400] text-white rounded-xl shadow-xs">
            <FolderCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#D35400] font-heading">Student Lab Portfolio</h1>
            <p className="text-xs sm:text-sm text-[#5D6D7E]">
              Saved written lab assignments, audio recordings, and ATS resume drafts
            </p>
          </div>
        </div>

        <button
          onClick={handlePrintRecordSummary}
          className="px-4 py-2.5 bg-[#D35400] hover:bg-[#E67E22] text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2 shrink-0"
        >
          <Printer className="w-4 h-4" />
          <span>Print SRIT Lab Record</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#FAD7A0] pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'all' ? 'bg-[#D35400] text-white' : 'bg-[#FFF8F0] text-[#5D6D7E] border border-[#FAD7A0]'
          }`}
        >
          All Artifacts ({portfolioItems.length + recordings.length})
        </button>
        <button
          onClick={() => setActiveTab('written')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'written' ? 'bg-[#D35400] text-white' : 'bg-[#FFF8F0] text-[#5D6D7E] border border-[#FAD7A0]'
          }`}
        >
          Written Reports & Resumes ({portfolioItems.length})
        </button>
        <button
          onClick={() => setActiveTab('recordings')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'recordings' ? 'bg-[#D35400] text-white' : 'bg-[#FFF8F0] text-[#5D6D7E] border border-[#FAD7A0]'
          }`}
        >
          Voice Recordings ({recordings.length})
        </button>
      </div>

      {/* Content List */}
      <div className="space-y-4">
        {(activeTab === 'all' || activeTab === 'written') &&
          portfolioItems.map((item) => (
            <div key={item.id} className="srit-card p-5 bg-white border border-[#FAD7A0] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#D35400]" />
                  <span className="text-xs font-bold text-[#D35400]">{item.moduleTitle}</span>
                </div>
                <button
                  onClick={() => handleDeleteWritten(item.id)}
                  className="p-1.5 text-[#5D6D7E] hover:text-red-600 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-sm font-bold text-[#2C3E50]">{item.title}</h3>
              <p className="text-xs text-[#5D6D7E] leading-relaxed bg-[#FFF8F0] p-3 rounded-xl border border-[#FAD7A0] whitespace-pre-wrap font-mono">
                {item.content}
              </p>

              <div className="text-[10px] text-[#5D6D7E] flex items-center justify-between pt-1">
                <span>Submitted: {new Date(item.createdAt).toLocaleDateString()}</span>
                <span className="font-bold text-[#D35400]">
                  Score: {formatScore10(item.score)} ({getPerformanceDescriptor(item.score)})
                </span>
              </div>
            </div>
          ))}

        {(activeTab === 'all' || activeTab === 'recordings') &&
          recordings.map((rec) => (
            <div key={rec.id} className="srit-card p-5 bg-white border border-[#FAD7A0] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4 text-[#E67E22]" />
                  <span className="text-xs font-bold text-[#D35400]">{rec.moduleTitle}</span>
                </div>
                <button
                  onClick={() => handleDeleteRecording(rec.id)}
                  className="p-1.5 text-[#5D6D7E] hover:text-red-600 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-sm font-bold text-[#2C3E50]">{rec.title}</h3>

              <audio controls src={rec.audioDataUrl} className="w-full h-10 rounded-lg" />

              <div className="text-[10px] text-[#5D6D7E] flex items-center justify-between pt-1">
                <span>Recorded: {new Date(rec.createdAt).toLocaleDateString()}</span>
                <span className="font-bold text-[#D35400]">
                  Score: {formatScore10(rec.score)} ({getPerformanceDescriptor(rec.score)})
                </span>
              </div>
            </div>
          ))}

        {portfolioItems.length === 0 && recordings.length === 0 && (
          <div className="srit-card p-8 text-center text-[#5D6D7E] space-y-2 bg-white border border-[#FAD7A0]">
            <FolderCheck className="w-8 h-8 text-[#D35400] mx-auto" />
            <p className="text-sm font-bold text-[#2C3E50]">No Saved Portfolio Submissions Yet</p>
            <p className="text-xs">Complete practice tools or voice recordings in any module to build your SRIT Lab Record.</p>
          </div>
        )}
      </div>
    </div>
  );
};
