import React, { useState } from 'react';
import { Clock, Search, Filter, ShieldCheck, UserCheck, Layers, KeyRound, CheckCircle2, RefreshCw, FileText } from 'lucide-react';

export const ActivityLogsTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const logs = [
    {
      id: 'LOG-1001',
      timestamp: '2026-08-05 10:40:22',
      actor: 'Administrator',
      role: 'ADMIN',
      action: 'APPROVE_FACULTY',
      description: 'Approved faculty registration for Dr. V. Lakshmi (EMP-104 - Department of English).',
      category: 'User Governance',
      ip: '192.168.1.50'
    },
    {
      id: 'LOG-1002',
      timestamp: '2026-08-05 09:15:10',
      actor: 'Administrator',
      role: 'ADMIN',
      action: 'FACULTY_BATCH_ASSIGNED',
      description: 'Assigned CSE Section A & B lab scope to Faculty EMP-101 (Prof. S. R. Naidu).',
      category: 'Academic Structure',
      ip: '192.168.1.50'
    },
    {
      id: 'LOG-1003',
      timestamp: '2026-08-04 16:22:45',
      actor: 'Administrator',
      role: 'ADMIN',
      action: 'RESET_PASSWORD',
      description: 'Reset access password for student 26691A0501 (A. Sharma).',
      category: 'Security',
      ip: '192.168.1.50'
    },
    {
      id: 'LOG-1004',
      timestamp: '2026-08-04 14:05:00',
      actor: 'System Auto-Engine',
      role: 'SYSTEM',
      action: 'AI_RUBRIC_UPDATED',
      description: 'Updated R26 Module 1 Phonetics AI scoring threshold to version 2.4.',
      category: 'AI Engine',
      ip: '127.0.0.1'
    },
    {
      id: 'LOG-1005',
      timestamp: '2026-08-03 11:30:18',
      actor: 'Administrator',
      role: 'ADMIN',
      action: 'BATCH_CREATED',
      description: 'Created new Academic Batch Year: 2026-2030 (R26 Regulation Framework).',
      category: 'Academic Structure',
      ip: '192.168.1.50'
    }
  ];

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'ALL' || log.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 text-[#2C3E50]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D35400]">
            Audit Trail & Security Telemetry
          </span>
          <h2 className="text-xl font-black text-[#2C3E50] flex items-center gap-2">
            <Clock className="w-6 h-6 text-[#D35400]" />
            <span>Activity Logs Timeline</span>
          </h2>
          <p className="text-xs text-[#5D6D7E] mt-0.5">
            Immutable audit record of administrator actions, faculty assignments, credential changes, and system updates.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Logs refreshed from audit storage.')}
          className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-[#2C3E50] font-bold text-xs rounded-xl transition flex items-center gap-2 cursor-pointer border border-gray-200"
        >
          <RefreshCw className="w-4 h-4 text-[#D35400]" />
          <span>Refresh Timeline</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search activity logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          <span className="text-xs font-bold text-[#5D6D7E]">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="User Governance">User Governance</option>
            <option value="Academic Structure">Academic Structure</option>
            <option value="Security">Security</option>
            <option value="AI Engine">AI Engine</option>
          </select>
        </div>
      </div>

      {/* TIMELINE VIEW */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-6">
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
          {filteredLogs.map((log) => (
            <div key={log.id} className="relative flex items-start gap-4 group">
              {/* Timeline Bullet */}
              <div className="absolute -left-[1.65rem] top-1.5 w-5 h-5 rounded-full bg-white border-2 border-[#D35400] flex items-center justify-center shrink-0 group-hover:scale-125 transition">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D35400]" />
              </div>

              <div className="flex-1 bg-gray-50/80 p-4 rounded-xl border border-gray-200/80 hover:border-gray-300 transition space-y-1.5">
                <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-[#2C3E50]">{log.actor}</span>
                    <span className="px-2 py-0.5 bg-[#FFF8F0] text-[#D35400] border border-[#FAD7A0] rounded-md font-mono text-[10px] font-bold">
                      {log.action}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-gray-500">{log.timestamp}</span>
                </div>

                <p className="text-xs text-gray-700 leading-relaxed font-medium">{log.description}</p>

                <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between text-[10px] text-gray-500 font-semibold">
                  <span className="bg-gray-200/60 px-2 py-0.5 rounded-md text-gray-700">{log.category}</span>
                  <span className="font-mono">IP: {log.ip} • ID: {log.id}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
