import React, { useState } from 'react';
import { dbStorage } from '../lib/db';
import { getAICoachStatus } from '../services/ai';
import { 
  Settings, 
  Download, 
  Database, 
  Mic, 
  Sparkles, 
  RefreshCw, 
  ShieldCheck, 
  Trash2
} from 'lucide-react';

interface SettingsPageProps {
  isInstallable?: boolean;
  isInstalled?: boolean;
  onInstall?: () => void;
  onResetData: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  isInstallable,
  isInstalled,
  onInstall,
  onResetData
}) => {
  const [micTested, setMicTested] = useState(false);
  const [micMessage, setMicMessage] = useState<string | null>(null);

  const aiStatus = getAICoachStatus();

  const handleTestMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicTested(true);
      setMicMessage('✓ Microphone detected and working properly!');
      stream.getTracks().forEach((t) => t.stop());
    } catch {
      setMicTested(false);
      setMicMessage('❌ Microphone access denied or unavailable.');
    }
  };

  const handleExportJSON = async () => {
    const profile = await dbStorage.getProfile();
    const progress = await dbStorage.getProgressMap();
    const portfolio = await dbStorage.getPortfolio();

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ profile, progress, portfolio }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'SAILL_Lab_Data_Backup.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleClearData = async () => {
    if (confirm('Are you sure you want to reset all local lab progress and portfolio items in IndexedDB?')) {
      await dbStorage.clearAllData();
      onResetData();
      alert('IndexedDB reset successfully!');
    }
  };

  return (
    <div className="space-y-8 pb-12 text-[#2C3E50]">
      {/* Header */}
      <div className="srit-card p-6 sm:p-8 bg-white border border-[#FAD7A0]">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#D35400] text-white rounded-xl shadow-xs">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#D35400] font-heading">System & PWA Settings</h1>
            <p className="text-xs sm:text-sm text-[#5D6D7E]">
              PWA app installation, IndexedDB storage management, mic testing, and AI configuration
            </p>
          </div>
        </div>
      </div>

      {/* PWA Installation Card */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
        <h3 className="text-base font-bold text-[#D35400] flex items-center gap-2 border-b border-[#FAD7A0] pb-3 font-heading">
          <Download className="w-5 h-5 text-[#D35400]" />
          <span>Progressive Web App (PWA) Status</span>
        </h3>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#2C3E50] block">PWA Installation:</span>
            <span className="text-xs text-[#5D6D7E]">
              {isInstalled
                ? 'App is running in Standalone PWA mode.'
                : isInstallable
                ? 'App is ready for one-click installation on Android or Windows.'
                : 'PWA is loaded in browser window.'}
            </span>
          </div>

          {isInstallable && onInstall && (
            <button
              onClick={onInstall}
              className="px-4 py-2 bg-[#D35400] hover:bg-[#E67E22] text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Install PWA App</span>
            </button>
          )}
        </div>
      </div>

      {/* Microphone Test */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
        <h3 className="text-base font-bold text-[#D35400] flex items-center gap-2 border-b border-[#FAD7A0] pb-3 font-heading">
          <Mic className="w-5 h-5 text-[#D35400]" />
          <span>Microphone & Audio Hardware Test</span>
        </h3>

        <div className="space-y-3">
          <p className="text-xs text-[#5D6D7E]">
            Test your device microphone permissions to ensure seamless audio recording during Phonetics, Minimal Pairs, and JAM speech drills.
          </p>

          <button
            onClick={handleTestMic}
            className="px-4 py-2 bg-[#FFF8F0] border border-[#FAD7A0] hover:bg-[#FAD7A0] text-[#D35400] font-bold text-xs rounded-xl transition flex items-center gap-2"
          >
            <Mic className="w-4 h-4" />
            <span>Test Microphone Access</span>
          </button>

          {micMessage && (
            <p className={`text-xs font-bold ${micTested ? 'text-emerald-700' : 'text-red-700'}`}>
              {micMessage}
            </p>
          )}
        </div>
      </div>

      {/* Local Storage & Backup */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
        <h3 className="text-base font-bold text-[#D35400] flex items-center gap-2 border-b border-[#FAD7A0] pb-3 font-heading">
          <Database className="w-5 h-5 text-[#D35400]" />
          <span>IndexedDB Storage & Data Backup</span>
        </h3>

        <div className="space-y-3">
          <p className="text-xs text-[#5D6D7E]">
            All student recordings, progress marks, and portfolio drafts are safely stored locally in your browser's IndexedDB storage.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExportJSON}
              className="px-4 py-2 bg-[#D35400] hover:bg-[#E67E22] text-white font-bold text-xs rounded-xl transition flex items-center gap-2 shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Export Data Backup (JSON)</span>
            </button>

            <button
              onClick={handleClearData}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs rounded-xl transition flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Reset IndexedDB Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
