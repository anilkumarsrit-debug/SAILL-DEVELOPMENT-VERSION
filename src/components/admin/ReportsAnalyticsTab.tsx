import React from 'react';
import { BarChart3, FileSpreadsheet, Sparkles, AlertCircle, Clock, ArrowRight, Download, Layers } from 'lucide-react';

export const ReportsAnalyticsTab: React.FC = () => {
  return (
    <div className="space-y-6 text-[#2C3E50]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D35400]">
            Institutional Analytics & Export Engine
          </span>
          <h2 className="text-xl font-black text-[#2C3E50] flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#D35400]" />
            <span>Reports and Analytics</span>
          </h2>
          <p className="text-xs text-[#5D6D7E] mt-0.5">
            Institutional CO-PO Mapping, NAAC/NBA compliance exports, student progress metrics.
          </p>
        </div>

        <div className="px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-600" />
          <span>Roadmap v3.3 Feature</span>
        </div>
      </div>

      {/* PROMINENT PLACEHOLDER NOTICE CARD */}
      <div className="p-8 bg-gradient-to-br from-[#FFF8F0] via-white to-amber-50/50 border-2 border-[#FAD7A0] rounded-2xl shadow-sm text-center space-y-4 max-w-3xl mx-auto my-8">
        <div className="w-16 h-16 bg-[#D35400] text-[#FAD7A0] rounded-2xl flex items-center justify-center mx-auto shadow-md border-2 border-[#FAD7A0]/40">
          <BarChart3 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 bg-[#D35400] text-white rounded-full text-[11px] font-black uppercase tracking-wider">
            Reports and Analytics
          </span>
          <h3 className="text-2xl font-black text-[#2C3E50] font-serif">
            This module will be implemented in a future update.
          </h3>
          <p className="text-xs text-gray-600 max-w-xl mx-auto leading-relaxed">
            The automated reporting suite is scheduled for deployment in the upcoming SRIT R26 academic release. It will feature direct CSV/PDF exports for CO-PO attainment matrices and NBA accreditation audits.
          </p>
        </div>
      </div>

      {/* MOCK PREVIEW CARDS FOR VISUAL CRAFT */}
      <div className="space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-[#5D6D7E]">
          Upcoming Analytics Modules Preview
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-2xs opacity-80 hover:opacity-100 transition space-y-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 w-fit border border-blue-100">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-[#2C3E50]">CO-PO Attainment Matrix</h4>
            <p className="text-xs text-gray-500">
              Direct mapping of student speech scores against Course Outcomes CO1-CO6 and Program Outcomes PO9-PO10.
            </p>
            <div className="pt-2 flex items-center justify-between text-[11px] font-bold text-gray-400">
              <span>PDF / Excel Export</span>
              <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">In Development</span>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-2xs opacity-80 hover:opacity-100 transition space-y-3">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 w-fit border border-purple-100">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-[#2C3E50]">Section-wise Performance Breakdown</h4>
            <p className="text-xs text-gray-500">
              Comparative analysis across CSE, ECE, EEE, ME, and CE sections for departmental faculty evaluation.
            </p>
            <div className="pt-2 flex items-center justify-between text-[11px] font-bold text-gray-400">
              <span>Interactive Charts</span>
              <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">In Development</span>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-2xs opacity-80 hover:opacity-100 transition space-y-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 w-fit border border-emerald-100">
              <Download className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-[#2C3E50]">NAAC / NBA Accreditation Audit Log</h4>
            <p className="text-xs text-gray-500">
              One-click compliance packet generation containing student practice audio evidence and AI rubric logs.
            </p>
            <div className="pt-2 flex items-center justify-between text-[11px] font-bold text-gray-400">
              <span>Zip Archive Export</span>
              <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">In Development</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
