import React, { useState, useEffect } from 'react';
import { StudentProfile, Badge } from '../types';
import { dbStorage } from '../lib/db';
import { User, Award, Edit3, Save, Flame, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';

interface StudentProfilePageProps {
  profile: StudentProfile;
  onProfileUpdate: (updated: StudentProfile) => void;
}

export const StudentProfilePage: React.FC<StudentProfilePageProps> = ({
  profile,
  onProfileUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [rollNo, setRollNo] = useState(profile.rollNo);
  const [branch, setBranch] = useState(profile.branch);
  const [section, setSection] = useState(profile.section);
  const [targetGoal, setTargetGoal] = useState(profile.targetGoal);
  const [bio, setBio] = useState(profile.bio || '');

  const [badges, setBadges] = useState<Badge[]>([]);

  useEffect(() => {
    dbStorage.getBadges().then(setBadges);
  }, []);

  const handleSaveProfile = async () => {
    const updated: StudentProfile = {
      ...profile,
      name,
      rollNo,
      branch,
      section,
      targetGoal,
      bio
    };
    onProfileUpdate(updated);
    await dbStorage.saveProfile(updated);
    setIsEditing(false);
    alert('Student profile updated in local IndexedDB!');
  };

  return (
    <div className="space-y-8 pb-12 text-[#2C3E50]">
      {/* Student ID Card Banner */}
      <div className="srit-card p-6 sm:p-8 bg-white border border-[#FAD7A0] relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-[#D35400] p-0.5 shadow-xs shrink-0">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-full h-full object-cover rounded-[14px]"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-[#D35400] bg-[#FFF8F0] px-2.5 py-0.5 rounded border border-[#FAD7A0]">
                  {profile.rollNo}
                </span>
                <span className="text-xs font-bold text-[#E67E22] bg-[#FFF8F0] px-2 py-0.5 rounded border border-[#FAD7A0]">
                  R26 Regulations
                </span>
              </div>
              <h1 className="text-2xl font-black text-[#2C3E50] font-heading">{profile.name}</h1>
              <p className="text-xs text-[#5D6D7E]">{profile.branch} • Section {profile.section}</p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-[#FFF8F0] border border-[#FAD7A0] hover:bg-[#FAD7A0] text-[#D35400] text-xs font-bold rounded-xl transition flex items-center gap-1.5 shrink-0"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
          </button>
        </div>
      </div>

      {/* Edit Profile Form or Details */}
      {isEditing ? (
        <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
          <h3 className="text-base font-bold text-[#D35400] border-b border-[#FAD7A0] pb-3 font-heading">Edit Student Details</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#5D6D7E] mb-1">Student Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-[#FAD7A0] rounded-lg px-3 py-2 text-xs text-[#2C3E50]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#5D6D7E] mb-1">Roll Number:</label>
              <input
                type="text"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                className="w-full bg-white border border-[#FAD7A0] rounded-lg px-3 py-2 text-xs text-[#2C3E50]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#5D6D7E] mb-1">Academic Program:</label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full bg-white border border-[#FAD7A0] rounded-lg px-3 py-2 text-xs text-[#2C3E50]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#5D6D7E] mb-1">Section:</label>
              <input
                type="text"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-full bg-white border border-[#FAD7A0] rounded-lg px-3 py-2 text-xs text-[#2C3E50]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5D6D7E] mb-1">Target Goal:</label>
            <input
              type="text"
              value={targetGoal}
              onChange={(e) => setTargetGoal(e.target.value)}
              className="w-full bg-white border border-[#FAD7A0] rounded-lg px-3 py-2 text-xs text-[#2C3E50]"
            />
          </div>

          <button
            onClick={handleSaveProfile}
            className="px-5 py-2.5 bg-[#D35400] hover:bg-[#E67E22] text-white text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Changes</span>
          </button>
        </div>
      ) : (
        <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
          <h3 className="text-base font-bold text-[#D35400] border-b border-[#FAD7A0] pb-3 font-heading">Academic Profile Overview</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-[#FFF8F0] rounded-xl border border-[#FAD7A0]">
              <span className="text-[#5D6D7E] block font-medium">Institution:</span>
              <strong className="text-[#2C3E50] text-xs">Srinivasa Ramanujan Institute of Technology (Autonomous)</strong>
            </div>
            <div className="p-3 bg-[#FFF8F0] rounded-xl border border-[#FAD7A0]">
              <span className="text-[#5D6D7E] block font-medium">System Role (Read-Only):</span>
              <strong className="text-[#D35400] text-xs font-black uppercase tracking-wide">
                {localStorage.getItem('saill_active_role')?.toUpperCase() === 'ADMINISTRATOR'
                  ? 'Administrator'
                  : localStorage.getItem('saill_active_role')?.toUpperCase() === 'FACULTY_INCHARGE' || localStorage.getItem('saill_active_role')?.toUpperCase() === 'FACULTY'
                  ? 'Faculty Incharge'
                  : 'Student'}
              </strong>
            </div>
            <div className="p-3 bg-[#FFF8F0] rounded-xl border border-[#FAD7A0]">
              <span className="text-[#5D6D7E] block font-medium">Regulation:</span>
              <strong className="text-[#D35400]">R26 Communicative English Laboratory Syllabus</strong>
            </div>
            <div className="p-3 bg-[#FFF8F0] rounded-xl border border-[#FAD7A0]">
              <span className="text-[#5D6D7E] block font-medium">Target Placement Goal:</span>
              <strong className="text-[#2C3E50]">{profile.targetGoal}</strong>
            </div>
            <div className="p-3 bg-[#FFF8F0] rounded-xl border border-[#FAD7A0]">
              <span className="text-[#5D6D7E] block font-medium">Faculty Incharge:</span>
              <strong className="text-[#D35400] text-xs font-bold block">
                {profile.assignedFacultyName &&
                !profile.assignedFacultyName.includes('No Faculty') &&
                !profile.assignedFacultyName.includes('Not Assigned')
                  ? profile.assignedFacultyName
                  : 'Not Assigned'}
              </strong>
              {(!profile.assignedFacultyName ||
                profile.assignedFacultyName.includes('No Faculty') ||
                profile.assignedFacultyName.includes('Not Assigned')) && (
                <span className="text-[10px] text-amber-700 italic block mt-0.5">
                  No Faculty Incharge has been assigned yet.
                </span>
              )}
            </div>

            <div className="p-3 bg-[#FFF8F0] rounded-xl border border-[#FAD7A0]">
              <span className="text-[#5D6D7E] block font-medium">Academic Owner:</span>
              <strong className="text-[#2C3E50]">Humanities & Sciences (English / Communicative English)</strong>
            </div>

            <div className="p-3 bg-[#FFF8F0] rounded-xl border border-[#FAD7A0]">
              <span className="text-[#5D6D7E] block font-medium">Enrolled Program & Section:</span>
              <strong className="text-[#2C3E50]">
                {profile.branch || profile.department || 'Civil Engineering'} • Section {profile.section || 'A'}
              </strong>
            </div>

            <div className="p-3 bg-[#FFF8F0] rounded-xl border border-[#FAD7A0]">
              <span className="text-[#5D6D7E] block font-medium">XP Level:</span>
              <strong className="text-[#D35400]">Level {profile.level} ({profile.xp} XP)</strong>
            </div>
          </div>
        </div>
      )}

      {/* Badges Section */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
        <h3 className="text-base font-bold text-[#D35400] border-b border-[#FAD7A0] pb-3 font-heading flex items-center gap-2">
          <Award className="w-5 h-5 text-[#D35400]" />
          <span>Earned Micro-Credentials & Badges</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-3 rounded-xl border text-center space-y-1 transition ${
                badge.unlocked
                  ? 'bg-[#FFF8F0] border-[#FAD7A0] text-[#2C3E50]'
                  : 'bg-white border-gray-200 text-gray-400 opacity-60'
              }`}
            >
              <Award className={`w-6 h-6 mx-auto ${badge.unlocked ? 'text-[#D35400]' : 'text-gray-300'}`} />
              <h4 className="text-[11px] font-bold leading-tight">{badge.title}</h4>
              <p className="text-[9px] text-[#5D6D7E]">{badge.category}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
