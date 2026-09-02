import React from 'react';
import { BookMarked, Clock, CheckCircle2, ArrowRight, FileText, User, Tag, Sparkles, MessageSquare } from 'lucide-react';

interface ReadingLabNotebookProps {
  onCompleteActivity: () => void;
}

export const ReadingLabNotebook: React.FC<ReadingLabNotebookProps> = ({ onCompleteActivity }) => {
  const notebookEntries = [
    {
      id: 'entry-1',
      date: new Date().toLocaleDateString(),
      activity: 'Section 3: Article Reading Lab',
      passageTitle: 'Generative AI and Large Language Model Optimization',
      score: '9.6 / 10',
      vocabLearned: ['LoRA', 'RAG', 'Quantization'],
      facultyComment: 'Excellent comprehension of vector database retrieval and token optimization.'
    },
    {
      id: 'entry-2',
      date: new Date().toLocaleDateString(),
      activity: 'Section 8: Speed Reading Studio',
      passageTitle: 'Kubernetes Container Orchestration Architecture',
      score: '280 WPM (100% Comprehension)',
      vocabLearned: ['Orchestration', 'Heterogeneous', 'Declarative'],
      facultyComment: 'High reading speed with complete factual accuracy.'
    },
    {
      id: 'entry-3',
      date: new Date().toLocaleDateString(),
      activity: 'Section 10: Comparative Reading Lab',
      passageTitle: 'Cloud Centralization vs. Edge Computing',
      score: '9.8 / 10',
      vocabLearned: ['Sovereignty', 'Heterogeneous', 'Monopoly'],
      facultyComment: 'Outstanding comparative argumentation analysis.'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
        {/* Header */}
        <div className="border-b border-[#FAD7A0] pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest bg-[#D35400] text-white px-2 py-0.5 rounded-md">
              Section 13
            </span>
            <span className="text-xs text-[#5D6D7E] font-bold">R26 Communicative English Laboratory</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-[#D35400]" />
            13. Digital Laboratory Notebook (Automated Log History)
          </h2>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Permanent record of completed reading exercises, vocabulary acquisition, speed metrics, AI evaluation, faculty reviews, and version history.
          </p>
        </div>

        {/* Notebook Entries List */}
        <div className="space-y-4">
          {notebookEntries.map((entry) => (
            <div key={entry.id} className="p-5 bg-[#FFF8F0] border-2 border-[#FAD7A0] rounded-2xl space-y-3 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#FAD7A0] pb-2">
                <div className="flex items-center gap-2">
                  <span className="bg-[#D35400] text-white font-bold px-2 py-0.5 rounded-md text-[10px] uppercase">
                    {entry.activity}
                  </span>
                  <span className="font-extrabold text-[#2C3E50]">{entry.passageTitle}</span>
                </div>
                <div className="flex items-center gap-2 text-[#5D6D7E]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{entry.date}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-white rounded-xl border border-[#FAD7A0]">
                  <span className="font-bold text-[#D35400] block text-[10px] uppercase">Evaluation Score</span>
                  <span className="font-black text-[#2C3E50] text-sm">{entry.score}</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#FAD7A0]">
                  <span className="font-bold text-[#D35400] block text-[10px] uppercase">Vocabulary Acquisition</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {entry.vocabLearned.map((v, i) => (
                      <span key={i} className="bg-[#FFF8F0] text-[#D35400] border border-[#FAD7A0] px-1.5 py-0.5 rounded-md font-mono text-[10px]">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#FAD7A0]">
                  <span className="font-bold text-[#D35400] block text-[10px] uppercase">Faculty Evaluation</span>
                  <p className="text-[#2C3E50]">{entry.facultyComment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Navigation */}
        <div className="flex justify-end pt-4 border-t border-[#FAD7A0]">
          <button
            type="button"
            onClick={onCompleteActivity}
            className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#E67E22] transition flex items-center gap-2"
          >
            <span>Proceed to Section 14: Portfolio Showcase</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
