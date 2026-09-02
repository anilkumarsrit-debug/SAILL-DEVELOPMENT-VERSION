import React, { useState, useEffect } from 'react';
import { WifiOff, ShieldCheck } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="bg-[#FFF8F0] border-b border-[#FAD7A0] px-4 py-2 text-[#D35400] text-xs flex items-center justify-center gap-2 font-semibold animate-in fade-in duration-200">
      <WifiOff className="w-4 h-4 text-[#D35400] shrink-0" />
      <span>Offline Mode — SAILL is operating from cached storage. Changes will sync when online.</span>
      <span className="hidden md:inline-flex items-center gap-1 text-[11px] bg-white text-[#D35400] px-2 py-0.5 rounded-md border border-[#F8C471]">
        <ShieldCheck className="w-3 h-3 text-[#E67E22]" />
        PWA Cache Active
      </span>
    </div>
  );
};

