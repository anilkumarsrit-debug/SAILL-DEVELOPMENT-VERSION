import React, { useState } from 'react';
import { Shield, Building2, Sliders, RefreshCw, Save, CheckCircle2, AlertTriangle } from 'lucide-react';
import { dbStorage } from '../../lib/db';
import { ConfirmationModal } from './ConfirmationModal';

export const AdminSettingsTab: React.FC = () => {
  const [instName, setInstName] = useState('Srinivasa Ramanujan Institute of Technology (Autonomous)');
  const [labTitle, setLabTitle] = useState('SAILL R26 Communicative English Laboratory');
  const [regulation, setRegulation] = useState('R26 Academic Regulations');
  const [requireApproval, setRequireApproval] = useState(true);
  const [autoMapping, setAutoMapping] = useState(true);
  const [saveToast, setSaveToast] = useState(false);

  const [resetModal, setResetModal] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleResetDatabase = async () => {
    try {
      await dbStorage.clearAllTestInstitutionalData();
      setResetModal(false);
      window.location.reload();
    } catch {
      alert('Failed to reset system database.');
    }
  };

  return (
    <div className="space-y-6 text-[#2C3E50] max-w-4xl">
      {saveToast && (
        <div className="p-3 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Institutional System Settings updated successfully.</span>
        </div>
      )}

      {/* Institutional Parameters Card */}
      <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
          <Building2 className="w-5 h-5 text-[#D35400]" />
          <div>
            <h3 className="text-base font-bold text-[#2C3E50]">Institutional Parameters</h3>
            <p className="text-xs text-[#5D6D7E]">General institution details rendered across lab interfaces.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase mb-1">
              Institution / College Name
            </label>
            <input
              type="text"
              required
              value={instName}
              onChange={(e) => setInstName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase mb-1">
              Laboratory Title & Subheading
            </label>
            <input
              type="text"
              required
              value={labTitle}
              onChange={(e) => setLabTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase mb-1">
              Academic Regulation Framework
            </label>
            <input
              type="text"
              required
              value={regulation}
              onChange={(e) => setRegulation(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
            />
          </div>
        </div>

        {/* Security & Access Policies */}
        <div className="pt-4 border-t border-gray-100 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#2C3E50]">
            <Sliders className="w-4 h-4 text-[#D35400]" />
            <span>Security & Access Control Policies</span>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer">
              <input
                type="checkbox"
                checked={requireApproval}
                onChange={(e) => setRequireApproval(e.target.checked)}
                className="rounded text-[#D35400] focus:ring-[#D35400]"
              />
              <div>
                <div className="text-xs font-bold text-[#2C3E50]">Mandatory Admin Approval for Faculty Registration</div>
                <p className="text-[11px] text-[#5D6D7E]">Require Administrator verification before granting lab portal access.</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer">
              <input
                type="checkbox"
                checked={autoMapping}
                onChange={(e) => setAutoMapping(e.target.checked)}
                className="rounded text-[#D35400] focus:ring-[#D35400]"
              />
              <div>
                <div className="text-xs font-bold text-[#2C3E50]">Enable Automatic Student Mapping Engine</div>
                <p className="text-[11px] text-[#5D6D7E]">Map enrolled students dynamically based on Branch, Semester, and Section attributes.</p>
              </div>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end pt-3">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#D35400] hover:bg-[#E67E22] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>

      {/* Database Maintenance Zone */}
      <div className="bg-rose-50/60 p-6 rounded-2xl border border-rose-200 space-y-3">
        <div className="flex items-center gap-2.5 text-rose-800">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
          <h3 className="font-bold text-base">Danger Zone: Database & Cache Maintenance</h3>
        </div>
        <p className="text-xs text-rose-700 leading-relaxed">
          Reset local cache and restore default institutional structure seed data. This will reset local storage entries.
        </p>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => setResetModal(true)}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition flex items-center gap-2 cursor-pointer shadow-md"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Local Database Cache</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={resetModal}
        title="Reset Local System Database?"
        message="This will clear all local storage caches and reload default institutional seed structures. Proceed with caution."
        onConfirm={handleResetDatabase}
        onCancel={() => setResetModal(false)}
      />
    </div>
  );
};
