import React, { useState, useEffect } from 'react';
import { PortfolioItem } from '../types';
import { dbStorage } from '../lib/db';
import {
  FileText,
  CheckCircle,
  XCircle,
  RotateCcw,
  MessageSquare,
  Mic,
  Award,
  Filter,
  Search,
  Check,
  Send
} from 'lucide-react';

export const FacultyPortfolioReviewPage: React.FC = () => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    const items = await dbStorage.getPortfolio();
    setPortfolioItems(items);
    if (items.length > 0 && !selectedItem) {
      setSelectedItem(items[0]);
    }
  };

  const handleUpdateStatus = async (
    status: 'Approved' | 'Rejected' | 'Needs Revision'
  ) => {
    if (!selectedItem) return;

    const updatedItem: PortfolioItem = {
      ...selectedItem,
      status,
      teacherFeedback: feedbackText || selectedItem.teacherFeedback || 'Reviewed by Faculty In-Charge.',
      reviewedAt: new Date().toISOString(),
      reviewedBy: 'Dr. V. Lakshmi (Faculty)'
    };

    await dbStorage.savePortfolioItem(updatedItem);
    await loadPortfolio();

    setSelectedItem(updatedItem);
    setActionSuccess(`Portfolio submission status set to "${status}" successfully.`);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const filteredItems = portfolioItems.filter((item) => {
    const statusMatch =
      filterStatus === 'All' ||
      (filterStatus === 'Pending' && (!item.status || item.status === 'Pending')) ||
      item.status === filterStatus;

    const searchMatch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.moduleTitle.toLowerCase().includes(searchQuery.toLowerCase());

    return statusMatch && searchMatch;
  });

  return (
    <div className="space-y-8 pb-12 text-[#2C3E50]">
      {/* Header */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#D35400] text-white rounded-xl shadow-xs">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-serif text-[#2C3E50]">
              Faculty Student Portfolio Review Hub
            </h1>
            <p className="text-xs text-gray-600">
              Approve, reject, comment, or return student written submissions and audio voice recordings.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500">Filter Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 text-xs border border-gray-300 rounded-xl focus:border-[#D35400] outline-none font-bold bg-white"
          >
            <option value="All">All Submissions</option>
            <option value="Pending">Pending Review</option>
            <option value="Approved">Approved</option>
            <option value="Needs Revision">Needs Revision</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 bg-emerald-100 text-emerald-800 text-xs rounded-xl border border-emerald-300 flex items-center gap-2 font-bold">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Main Review Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Submissions List (1 col) */}
        <div className="srit-card p-5 bg-white border border-[#FAD7A0] space-y-4">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search portfolio work..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs border border-gray-300 rounded-xl focus:border-[#D35400] outline-none"
            />
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredItems.length === 0 ? (
              <p className="text-xs text-gray-500 py-6 text-center italic">
                No portfolio items match the current filter.
              </p>
            ) : (
              filteredItems.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedItem(item);
                      setFeedbackText(item.teacherFeedback || '');
                    }}
                    className={`p-3.5 rounded-xl border transition cursor-pointer space-y-1.5 ${
                      isSelected
                        ? 'bg-[#FFF8F0] border-[#D35400] shadow-xs'
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#D35400]">
                        {item.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'Needs Revision'
                            ? 'bg-amber-100 text-amber-800'
                            : item.status === 'Rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {item.status || 'Pending'}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-[#2C3E50] truncate">{item.title}</h3>
                    <p className="text-[11px] text-gray-500 truncate">{item.moduleTitle}</p>
                    <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1">
                      <span>Score: {item.score}%</span>
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Submission Details & Faculty Action Panel (2 cols) */}
        <div className="lg:col-span-2">
          {selectedItem ? (
            <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                <div>
                  <span className="text-xs font-bold text-[#D35400] uppercase tracking-wider">
                    {selectedItem.category} Work Submission
                  </span>
                  <h2 className="text-lg font-bold font-serif text-[#2C3E50]">
                    {selectedItem.title}
                  </h2>
                  <p className="text-xs text-gray-500">{selectedItem.moduleTitle}</p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-gray-400 block">
                    Submitted: {new Date(selectedItem.createdAt).toLocaleString()}
                  </span>
                  <span className="text-xs font-extrabold text-[#D35400]">
                    AI Evaluation Score: {selectedItem.score}%
                  </span>
                </div>
              </div>

              {/* Work Content Display */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Submitted Student Content
                </h4>

                {selectedItem.category === 'audio' ? (
                  <div className="space-y-3">
                    <p className="text-xs text-gray-700 italic">
                      "Audio voice recording submitted for phonetic and pronunciation analysis."
                    </p>
                    {selectedItem.content.startsWith('data:audio') ? (
                      <audio controls src={selectedItem.content} className="w-full" />
                    ) : (
                      <div className="p-3 bg-white border border-gray-300 rounded-lg text-xs font-mono">
                        {selectedItem.content}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-3.5 bg-white border border-gray-300 rounded-lg text-xs font-mono leading-relaxed whitespace-pre-wrap max-h-80 overflow-y-auto">
                    {selectedItem.content}
                  </div>
                )}
              </div>

              {/* Faculty Decision & Feedback Form */}
              <div className="p-5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-4">
                <h4 className="text-xs font-bold text-[#2C3E50] uppercase tracking-wider">
                  Faculty Review & Evaluation Action
                </h4>

                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">
                    Faculty Comment / Remarks
                  </label>
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Enter detailed teacher feedback, praise, or required revisions..."
                    className="w-full p-3 text-xs border border-gray-300 rounded-xl focus:border-[#D35400] outline-none min-h-[80px]"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => handleUpdateStatus('Approved')}
                    className="px-4 py-2.5 bg-[#27AE60] hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-xs"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve Portfolio</span>
                  </button>

                  <button
                    onClick={() => handleUpdateStatus('Needs Revision')}
                    className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-xs"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Return for Revision</span>
                  </button>

                  <button
                    onClick={() => handleUpdateStatus('Rejected')}
                    className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-xs"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject Submission</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="srit-card p-12 bg-white border border-[#FAD7A0] text-center text-gray-400 space-y-2">
              <FileText className="w-10 h-10 mx-auto text-gray-300" />
              <p className="text-xs font-semibold">Select a portfolio submission from the left panel to review.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
