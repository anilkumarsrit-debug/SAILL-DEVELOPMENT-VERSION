import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { Announcement, NotificationPriority } from '../../types/notification';
import {
  Megaphone,
  Plus,
  Search,
  Filter,
  Calendar,
  UserCheck,
  ShieldCheck,
  X,
  Sparkles,
  Trash2,
  CheckCircle2
} from 'lucide-react';

export const AnnouncementCenter: React.FC = () => {
  const { announcements, addAnnouncement, deleteAnnouncement, activeRole } = useNotifications();

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [audienceFilter, setAudienceFilter] = useState<string>('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPriority, setNewPriority] = useState<NotificationPriority>('medium');
  const [newTargetAudience, setNewTargetAudience] = useState<'ALL' | 'STUDENT' | 'FACULTY'>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const roleUpper = (activeRole || 'STUDENT').toString().toUpperCase();
  const isAdmin = roleUpper === 'ADMINISTRATOR';
  const isFaculty = roleUpper === 'FACULTY_INCHARGE' || roleUpper === 'FACULTY';

  const canCreate = isAdmin || isFaculty;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    addAnnouncement({
      title: newTitle.trim(),
      description: newDescription.trim(),
      priority: newPriority,
      targetAudience: newTargetAudience,
      authorRole: isAdmin ? 'ADMINISTRATOR' : 'FACULTY_INCHARGE',
      authorName: isAdmin ? 'Dr. M. Venkata Subbaiah (Admin)' : 'Faculty Incharge'
    });

    setToastMessage('Institutional Announcement posted successfully!');
    setNewTitle('');
    setNewDescription('');
    setShowCreateModal(false);

    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredAnnouncements = announcements.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.authorName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority = priorityFilter === 'ALL' || item.priority === priorityFilter;
    const matchesAudience = audienceFilter === 'ALL' || item.targetAudience === audienceFilter;

    return matchesSearch && matchesPriority && matchesAudience;
  });

  const getPriorityBadge = (priority: NotificationPriority) => {
    switch (priority) {
      case 'high':
        return (
          <span className="px-2.5 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-extrabold rounded-full border border-rose-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
            HIGH PRIORITY
          </span>
        );
      case 'medium':
        return (
          <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full border border-amber-200">
            MEDIUM PRIORITY
          </span>
        );
      case 'low':
      default:
        return (
          <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-medium rounded-full border border-blue-200">
            GENERAL NOTICE
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 text-[#2C3E50] select-none">
      {/* Title Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#FAD7A0]/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[11px] font-bold mb-1">
            <Megaphone className="w-3.5 h-3.5" />
            <span>Official Institutional Bulletins</span>
          </div>
          <h2 className="text-xl font-extrabold font-serif text-[#2C3E50]">Announcement Center</h2>
          <p className="text-xs text-gray-500">
            Academic circulars, laboratory updates, and SAILL institutional notices
          </p>
        </div>

        {canCreate && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 bg-[#D35400] hover:bg-[#E67E22] text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Announcement</span>
          </button>
        )}
      </div>

      {toastMessage && (
        <div className="p-4 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-[#FAD7A0]/70 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search announcements by title, keyword, or author..."
            className="w-full pl-9 pr-4 py-2 bg-[#FFF8F0]/50 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-[#D35400] outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1 bg-gray-50 p-1 border border-gray-200 rounded-xl text-xs">
            <span className="text-[10px] font-bold text-gray-500 px-2 uppercase">Priority:</span>
            {['ALL', 'high', 'medium', 'low'].map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] capitalize cursor-pointer transition ${
                  priorityFilter === p
                    ? 'bg-[#2C3E50] text-[#FAD7A0]'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-gray-50 p-1 border border-gray-200 rounded-xl text-xs">
            <span className="text-[10px] font-bold text-gray-500 px-2 uppercase">Audience:</span>
            {['ALL', 'STUDENT', 'FACULTY'].map((aud) => (
              <button
                key={aud}
                onClick={() => setAudienceFilter(aud)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] capitalize cursor-pointer transition ${
                  audienceFilter === aud
                    ? 'bg-[#D35400] text-white'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                {aud}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-[#FAD7A0]/70 shadow-xs text-center space-y-2 text-gray-400">
            <Megaphone className="w-10 h-10 mx-auto stroke-1" />
            <h3 className="font-bold text-sm text-gray-600">No Announcements Found</h3>
            <p className="text-xs text-gray-500">Try clearing search terms or selecting a different filter.</p>
          </div>
        ) : (
          filteredAnnouncements.map((ann) => (
            <div
              key={ann.id}
              className="bg-white p-6 rounded-2xl border border-[#FAD7A0]/70 shadow-xs hover:border-[#D35400] transition-all space-y-3 relative group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {getPriorityBadge(ann.priority)}

                  <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-bold rounded-full font-mono">
                    Audience: {ann.targetAudience}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>{ann.createdDate}</span>
                  </span>

                  {canCreate && (
                    <button
                      onClick={() => deleteAnnouncement(ann.id)}
                      className="text-gray-400 hover:text-rose-600 p-1 rounded transition opacity-0 group-hover:opacity-100"
                      title="Delete announcement"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <h3 className="font-extrabold text-base text-[#2C3E50] font-serif">{ann.title}</h3>

              <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                {ann.description}
              </p>

              <div className="pt-2 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-gray-600">
                  {ann.authorRole === 'ADMINISTRATOR' ? (
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  ) : (
                    <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                  )}
                  <span className="font-bold">{ann.authorName}</span>
                </div>

                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                  Verified Official Notice
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Create Announcement */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-[#FAD7A0] shadow-2xl p-6 space-y-4 text-[#2C3E50] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-[#D35400]" />
                <h3 className="font-bold text-base font-serif">Post New Announcement</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. CIA-1 Assessment Schedule & Lab Guidelines"
                  className="w-full p-2.5 bg-[#FFF8F0]/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D35400] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={4}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Provide full details of the academic circular or notice..."
                  className="w-full p-2.5 bg-[#FFF8F0]/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D35400] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Priority Level</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as NotificationPriority)}
                    className="w-full p-2.5 bg-[#FFF8F0]/50 border border-gray-300 rounded-xl font-bold cursor-pointer outline-none"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">General Notice (Low)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Target Audience</label>
                  <select
                    value={newTargetAudience}
                    onChange={(e) => setNewTargetAudience(e.target.value as any)}
                    className="w-full p-2.5 bg-[#FFF8F0]/50 border border-gray-300 rounded-xl font-bold cursor-pointer outline-none"
                  >
                    <option value="ALL">All Users</option>
                    <option value="STUDENT">Students Only</option>
                    <option value="FACULTY">Faculty Only</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D35400] hover:bg-[#E67E22] text-white font-bold rounded-xl transition shadow-xs"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
