import React, { useState } from 'react';
import {
  Settings,
  User,
  Key,
  Bell,
  Sun,
  Moon,
  ShieldAlert,
  CheckCircle2,
  Lock,
  Save
} from 'lucide-react';

interface FacultySettingsTabProps {
  facultyName: string;
  employeeId: string;
  department: string;
}

export const FacultySettingsTab: React.FC<FacultySettingsTabProps> = ({
  facultyName,
  employeeId,
  department
}) => {
  const [profileForm, setProfileForm] = useState({
    name: facultyName,
    employeeId: employeeId,
    department: department,
    email: 'v.lakshmi@srit.ac.in',
    mobile: '+91 98765 43210'
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    dailyDigest: true,
    audioSubmissions: true
  });

  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess('Faculty profile details updated successfully.');
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New password and confirm password do not match.');
      return;
    }
    setSaveSuccess('Password updated successfully.');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  return (
    <div className="space-y-6 text-[#2C3E50]">
      {/* Title Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#FAD7A0]/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2C3E50] text-[#FAD7A0] rounded-full text-[11px] font-bold mb-1">
            <Settings className="w-3.5 h-3.5" />
            <span>Faculty Preferences & Credentials</span>
          </div>
          <h2 className="text-xl font-extrabold font-serif text-[#2C3E50]">Faculty Settings</h2>
          <p className="text-xs text-gray-500">Manage account details, password, and notification preferences</p>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* Security Restrictions Banner */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 space-y-1">
          <p className="font-bold">Restricted Faculty Governance Scope</p>
          <p>
            Role changes, academic section re-assignments, and global SAILL platform configurations are managed exclusively by the Administrator.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Faculty Profile Settings */}
        <div className="bg-white p-6 rounded-2xl border border-[#FAD7A0]/70 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b text-sm font-bold text-[#2C3E50]">
            <User className="w-4 h-4 text-[#D35400]" />
            <span>Faculty Personal Profile</span>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Faculty Name</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full p-2.5 bg-[#FFF8F0]/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D35400] outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Employee ID (Locked)</label>
              <input
                type="text"
                disabled
                value={profileForm.employeeId}
                className="w-full p-2.5 bg-gray-100 border border-gray-300 rounded-xl font-mono text-gray-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Department</label>
              <input
                type="text"
                value={profileForm.department}
                onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                className="w-full p-2.5 bg-[#FFF8F0]/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D35400] outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full p-2.5 bg-[#FFF8F0]/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D35400] outline-none"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-[#D35400] hover:bg-[#E67E22] text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer mt-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile Changes</span>
            </button>
          </form>
        </div>

        {/* Section 2: Password Management */}
        <div className="bg-white p-6 rounded-2xl border border-[#FAD7A0]/70 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b text-sm font-bold text-[#2C3E50]">
            <Key className="w-4 h-4 text-[#D35400]" />
            <span>Update Account Password</span>
          </div>

          <form onSubmit={handleSavePassword} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Current Password</label>
              <input
                type="password"
                required
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full p-2.5 bg-[#FFF8F0]/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D35400] outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                required
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                placeholder="Enter new password"
                className="w-full p-2.5 bg-[#FFF8F0]/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D35400] outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                placeholder="Re-enter new password"
                className="w-full p-2.5 bg-[#FFF8F0]/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D35400] outline-none"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-[#2C3E50] hover:bg-[#34495E] text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer mt-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Update Password</span>
            </button>
          </form>
        </div>

        {/* Section 3: Notification Preferences */}
        <div className="bg-white p-6 rounded-2xl border border-[#FAD7A0]/70 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b text-sm font-bold text-[#2C3E50]">
            <Bell className="w-4 h-4 text-[#D35400]" />
            <span>Notification Preferences</span>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 bg-[#FFF8F0]/60 rounded-xl border border-[#FAD7A0]/50 cursor-pointer">
              <span className="font-bold text-[#2C3E50]">Email Activity Alerts</span>
              <input
                type="checkbox"
                checked={notifications.emailAlerts}
                onChange={(e) => setNotifications({ ...notifications, emailAlerts: e.target.checked })}
                className="w-4 h-4 accent-[#D35400] cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-[#FFF8F0]/60 rounded-xl border border-[#FAD7A0]/50 cursor-pointer">
              <span className="font-bold text-[#2C3E50]">Daily Assessment Digest</span>
              <input
                type="checkbox"
                checked={notifications.dailyDigest}
                onChange={(e) => setNotifications({ ...notifications, dailyDigest: e.target.checked })}
                className="w-4 h-4 accent-[#D35400] cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-[#FFF8F0]/60 rounded-xl border border-[#FAD7A0]/50 cursor-pointer">
              <span className="font-bold text-[#2C3E50]">Audio Submission Alerts</span>
              <input
                type="checkbox"
                checked={notifications.audioSubmissions}
                onChange={(e) => setNotifications({ ...notifications, audioSubmissions: e.target.checked })}
                className="w-4 h-4 accent-[#D35400] cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Section 4: Theme Preference */}
        <div className="bg-white p-6 rounded-2xl border border-[#FAD7A0]/70 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b text-sm font-bold text-[#2C3E50]">
            <Sun className="w-4 h-4 text-[#D35400]" />
            <span>Theme Preference</span>
          </div>

          <div className="flex gap-3 text-xs">
            <button
              onClick={() => setThemeMode('light')}
              className={`flex-1 py-3 px-4 rounded-xl font-bold border transition flex items-center justify-center gap-2 cursor-pointer ${
                themeMode === 'light'
                  ? 'bg-[#D35400] text-white border-[#D35400]'
                  : 'bg-gray-50 text-gray-700 border-gray-200'
              }`}
            >
              <Sun className="w-4 h-4" />
              <span>Light Theme</span>
            </button>

            <button
              onClick={() => setThemeMode('dark')}
              className={`flex-1 py-3 px-4 rounded-xl font-bold border transition flex items-center justify-center gap-2 cursor-pointer ${
                themeMode === 'dark'
                  ? 'bg-[#2C3E50] text-[#FAD7A0] border-[#2C3E50]'
                  : 'bg-gray-50 text-gray-700 border-gray-200'
              }`}
            >
              <Moon className="w-4 h-4" />
              <span>Dark Theme</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
