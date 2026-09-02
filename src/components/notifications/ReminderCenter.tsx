import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { Reminder, NotificationPriority, NotificationCategory } from '../../types/notification';
import { Page } from '../../types';
import {
  Clock,
  CheckSquare,
  Square,
  Plus,
  Calendar,
  AlertCircle,
  X,
  Trash2,
  ExternalLink
} from 'lucide-react';

interface ReminderCenterProps {
  onNavigate?: (page: Page) => void;
}

export const ReminderCenter: React.FC<ReminderCenterProps> = ({ onNavigate }) => {
  const { reminders, toggleReminder, addReminder, deleteReminder } = useNotifications();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newPriority, setNewPriority] = useState<NotificationPriority>('medium');
  const [newCategory, setNewCategory] = useState<NotificationCategory>('Reminder');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addReminder(newTitle.trim(), newDesc.trim(), newDueDate || 'Upcoming', newPriority, newCategory);
    setNewTitle('');
    setNewDesc('');
    setNewDueDate('');
    setShowAddModal(false);
  };

  const activeReminders = reminders.filter((r) => !r.isCompleted);
  const completedReminders = reminders.filter((r) => r.isCompleted);

  const getPriorityStyle = (priority: NotificationPriority) => {
    switch (priority) {
      case 'high':
        return 'border-l-4 border-l-rose-500 bg-rose-50/50';
      case 'medium':
        return 'border-l-4 border-l-amber-500 bg-amber-50/50';
      case 'low':
      default:
        return 'border-l-4 border-l-blue-500 bg-blue-50/50';
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-[#FAD7A0]/70 shadow-xs space-y-5 text-[#2C3E50] select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-indigo-100 text-indigo-700 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-[#2C3E50] font-serif">Academic Task Reminders</h3>
            <p className="text-xs text-gray-500">Track deadlines, practice goals & laboratory submissions</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3 py-1.5 bg-[#2C3E50] hover:bg-[#34495E] text-[#FAD7A0] font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Active Tasks List */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Pending Tasks ({activeReminders.length})
        </h4>

        {activeReminders.length === 0 ? (
          <div className="p-6 text-center text-xs text-gray-500 bg-gray-50 rounded-xl border border-gray-200">
            🎉 All catch-up tasks completed! Enjoy your practice.
          </div>
        ) : (
          activeReminders.map((rem) => (
            <div
              key={rem.id}
              className={`p-4 rounded-xl border border-gray-200 ${getPriorityStyle(
                rem.priority
              )} flex items-start justify-between gap-3 hover:shadow-2xs transition group`}
            >
              <div className="flex items-start gap-3 flex-1">
                <button
                  onClick={() => toggleReminder(rem.id)}
                  className="mt-0.5 text-gray-400 hover:text-emerald-600 transition cursor-pointer"
                  title="Mark task as complete"
                >
                  <Square className="w-5 h-5" />
                </button>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-xs text-[#2C3E50]">{rem.title}</span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[9px] font-bold rounded-md uppercase font-mono">
                      {rem.category}
                    </span>
                  </div>
                  {rem.description && <p className="text-xs text-gray-600">{rem.description}</p>}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-gray-200">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span>{rem.dueDate}</span>
                </span>

                {rem.linkPage && onNavigate && (
                  <button
                    onClick={() => onNavigate(rem.linkPage!)}
                    className="p-1 text-[#D35400] hover:bg-amber-100 rounded transition"
                    title="Go to section"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => deleteReminder(rem.id)}
                  className="p-1 text-gray-400 hover:text-rose-600 rounded opacity-0 group-hover:opacity-100 transition"
                  title="Delete reminder"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Completed Tasks List */}
      {completedReminders.length > 0 && (
        <div className="space-y-2 pt-3 border-t border-gray-100">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Completed Tasks ({completedReminders.length})
          </h4>
          <div className="space-y-2">
            {completedReminders.map((rem) => (
              <div
                key={rem.id}
                className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between gap-3 text-gray-400 text-xs line-through"
              >
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleReminder(rem.id)}
                    className="text-emerald-600 cursor-pointer"
                  >
                    <CheckSquare className="w-4 h-4" />
                  </button>
                  <span>{rem.title}</span>
                </div>
                <button
                  onClick={() => deleteReminder(rem.id)}
                  className="hover:text-rose-600 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Add Custom Reminder */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl border border-[#FAD7A0] shadow-2xl p-6 space-y-4 text-[#2C3E50]">
            <div className="flex items-center justify-between pb-3 border-b">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-base font-serif">Add Academic Goal / Reminder</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Complete 5 speech drills before Friday"
                  className="w-full p-2.5 bg-[#FFF8F0]/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Description (Optional)</label>
                <input
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Additional notes or lab reference..."
                  className="w-full p-2.5 bg-[#FFF8F0]/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Due Date</label>
                  <input
                    type="text"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    placeholder="e.g. Feb 22, 2026"
                    className="w-full p-2.5 bg-[#FFF8F0]/50 border border-gray-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as NotificationPriority)}
                    className="w-full p-2.5 bg-[#FFF8F0]/50 border border-gray-300 rounded-xl font-bold cursor-pointer outline-none"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-xs"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
