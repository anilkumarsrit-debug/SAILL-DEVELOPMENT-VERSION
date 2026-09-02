import React from 'react';
import { Download, X } from 'lucide-react';

interface PWAInstallBannerProps {
  onInstall: () => void;
  onDismiss: () => void;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({ onInstall, onDismiss }) => {
  return (
    <div className="bg-[#FFF8F0] border-b border-[#FAD7A0] px-4 py-2.5 text-[#2C3E50] text-xs flex flex-wrap items-center justify-between gap-3 shadow-xs">
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 bg-[#D35400] text-white rounded-lg shrink-0">
          <Download className="w-4 h-4" />
        </div>
        <div>
          <span className="font-extrabold text-[#D35400]">Install SAILL PWA App</span>
          <span className="text-[#5D6D7E] hidden sm:inline"> — Get fast offline access & full-screen Communicative English Lab experience on Android & Windows!</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onInstall}
          className="px-3.5 py-1.5 bg-[#D35400] hover:bg-[#E67E22] text-white text-xs font-extrabold rounded-lg shadow-xs transition flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install Now</span>
        </button>
        <button
          onClick={onDismiss}
          className="p-1 text-[#5D6D7E] hover:text-[#D35400] rounded-md transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
