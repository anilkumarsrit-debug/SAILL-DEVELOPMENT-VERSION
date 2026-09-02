import React, { useState } from 'react';
import { Building2, Layers, BookOpen } from 'lucide-react';
import { AcademicStructureManager } from './AcademicStructureManager';
import { FacultyAssignmentManager } from './FacultyAssignmentManager';
import { BatchManagementTab } from '../BatchManagementTab';

export const AcademicManagerTab: React.FC = () => {
  const [mode, setMode] = useState<'structure' | 'batches' | 'assignments'>('structure');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleShowToast = (type: 'success' | 'error', text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="space-y-6 text-[#2C3E50]">
      {toast && (
        <div
          className={`p-3 rounded-xl text-xs font-bold flex items-center justify-between shadow-md ${
            toast.type === 'success'
              ? 'bg-emerald-50 border border-emerald-300 text-emerald-800'
              : 'bg-rose-50 border border-rose-300 text-rose-800'
          }`}
        >
          <span>{toast.text}</span>
          <button onClick={() => setToast(null)} className="text-gray-400 hover:text-gray-600">
            ×
          </button>
        </div>
      )}

      {/* Tab Switcher for Academic Sub-Modules */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D35400]">
            Academic Governance & Institutional Hierarchy
          </span>
          <h2 className="text-xl font-black text-[#2C3E50]">Academic Management Center</h2>
          <p className="text-xs text-[#5D6D7E] mt-0.5">
            Configure institutional departments, branches, academic years, sections, active academic batches, and faculty scope mappings.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center p-1 bg-gray-100 rounded-xl border border-gray-200">
          <button
            type="button"
            onClick={() => setMode('structure')}
            className={`px-3 py-2 rounded-lg font-extrabold text-xs transition flex items-center gap-2 cursor-pointer ${
              mode === 'structure'
                ? 'bg-[#2C3E50] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#2C3E50]'
            }`}
          >
            <Building2 className="w-4 h-4 text-[#FAD7A0]" />
            <span>Academic Structure</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('batches')}
            className={`px-3 py-2 rounded-lg font-extrabold text-xs transition flex items-center gap-2 cursor-pointer ${
              mode === 'batches'
                ? 'bg-[#2C3E50] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#2C3E50]'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#FAD7A0]" />
            <span>Classes</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('assignments')}
            className={`px-3 py-2 rounded-lg font-extrabold text-xs transition flex items-center gap-2 cursor-pointer ${
              mode === 'assignments'
                ? 'bg-[#2C3E50] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#2C3E50]'
            }`}
          >
            <Layers className="w-4 h-4 text-[#FAD7A0]" />
            <span>Faculty Scope Assignments</span>
          </button>
        </div>
      </div>

      {/* Render selected sub-manager */}
      {mode === 'structure' && <AcademicStructureManager />}
      {mode === 'batches' && <BatchManagementTab onShowToast={handleShowToast} />}
      {mode === 'assignments' && <FacultyAssignmentManager />}
    </div>
  );
};
