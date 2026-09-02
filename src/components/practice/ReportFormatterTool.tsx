import React, { useState } from 'react';
import { FileSpreadsheet, Save, Printer } from 'lucide-react';

interface ReportFormatterToolProps {
  onSaveWork?: (title: string, content: string) => void;
}

export const ReportFormatterTool: React.FC<ReportFormatterToolProps> = ({ onSaveWork }) => {
  const [reportTitle, setReportTitle] = useState('Feasibility Study on Solar Photovoltaic Panel Efficiency in Semi-Arid Climates');
  const [author, setAuthor] = useState('First-Year Engineering Student (Roll: 264G1A0501)');
  const [abstractText, setAbstractText] = useState(
    'This report investigates the electrical efficiency degradation of polycrystalline solar photovoltaic panels under dust accumulation and high operating temperatures in semi-arid regions. Experimental measurements indicated a 14% drop in output power over 30 days without cleaning.'
  );
  const [methodology, setMethodology] = useState(
    'A 100W polycrystalline solar module was monitored using micro-sensors measuring open-circuit voltage (Voc), short-circuit current (Isc), ambient temperature, and dust thickness over a 4-week trial at SRIT lab facilities.'
  );
  const [conclusion, setConclusion] = useState(
    'Regular bi-weekly automated water-wash cycles restore electrical output efficiency to 98.2% of rated capacity, proving cost-effective for regional solar power installations.'
  );

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    const fullReport = JSON.stringify({ reportTitle, author, abstractText, methodology, conclusion }, null, 2);
    if (onSaveWork) {
      onSaveWork(`Lab Report: ${reportTitle}`, fullReport);
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-700 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600/20 border border-indigo-500/40 rounded-xl">
            <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Technical Report & Abstract Formatter</h3>
            <p className="text-xs text-slate-400">Structure engineering lab reports following IEEE standards</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition"
        >
          {isSaved ? 'Saved to Portfolio!' : 'Save Report'}
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Report Title:</label>
            <input
              type="text"
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Author & Roll No:</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-indigo-300 mb-1">1. Executive Summary / Abstract:</label>
          <textarea
            rows={3}
            value={abstractText}
            onChange={(e) => setAbstractText(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-indigo-300 mb-1">2. Experimental Methodology:</label>
          <textarea
            rows={3}
            value={methodology}
            onChange={(e) => setMethodology(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-indigo-300 mb-1">3. Conclusion & Engineering Recommendations:</label>
          <textarea
            rows={3}
            value={conclusion}
            onChange={(e) => setConclusion(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
};
