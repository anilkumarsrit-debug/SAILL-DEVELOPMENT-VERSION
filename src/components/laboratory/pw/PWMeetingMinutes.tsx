import React, { useState } from 'react';
import { ClipboardList, Sparkles, Plus, Trash2, FolderCheck } from 'lucide-react';
import { evaluateDocument, WritingFeedback } from '../../../services/ai/writingCoach';
import { PWAudioPlaceholder } from './PWAudioPlaceholder';

interface ActionItem {
  id: string;
  task: string;
  owner: string;
  deadline: string;
}

interface PWMeetingMinutesProps {
  onCompleteActivity: () => void;
  onSaveToPortfolio: (title: string, category: string, content: string, score: number) => void;
}

export const PWMeetingMinutes: React.FC<PWMeetingMinutesProps> = ({
  onCompleteActivity,
  onSaveToPortfolio
}) => {
  const [meetingTitle, setMeetingTitle] = useState('B.Tech Mini-Project Architecture Review & Sprint 1 Standup');
  const [dateLocation, setDateLocation] = useState('October 10, 2026 | 3:00 PM - 4:00 PM | SRIT AI Lab 2');
  const [attendees, setAttendees] = useState('Dr. S. Sharma (Faculty Guide), Rahul Verma (Team Lead), Ananya P. (Backend), Vikram S. (UI/UX)');
  const [agenda, setAgenda] = useState('1. Finalize database schema\n2. Review UI wireframes for student portal\n3. Assign sprint 1 coding deliverables');
  const [decisions, setDecisions] = useState('• Approved PostgreSQL database schema with IndexedDB offline sync.\n• Standardized on Tailwind CSS and React 18 for frontend.\n• Next review meeting scheduled for next Friday at 3:00 PM.');

  const [actionItems, setActionItems] = useState<ActionItem[]>([
    { id: '1', task: 'Design database schema & migration script', owner: 'Rahul V.', deadline: 'Oct 14' },
    { id: '2', task: 'Build responsive student login interface', owner: 'Vikram S.', deadline: 'Oct 16' },
    { id: '3', task: 'Integrate Gemini API endpoints for writing coach', owner: 'Ananya P.', deadline: 'Oct 18' }
  ]);

  const [evalResult, setEvalResult] = useState<WritingFeedback | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [savedToPortfolio, setSavedToPortfolio] = useState(false);

  const addActionItem = () => {
    setActionItems([
      ...actionItems,
      { id: Date.now().toString(), task: '', owner: '', deadline: '' }
    ]);
  };

  const removeActionItem = (id: string) => {
    setActionItems(actionItems.filter((item) => item.id !== id));
  };

  const updateActionItem = (id: string, field: keyof ActionItem, val: string) => {
    setActionItems(
      actionItems.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  const handleEvaluate = async () => {
    setIsAnalyzing(true);
    const actionItemsFormatted = actionItems.map((i) => `• [Task]: ${i.task} | [Owner]: ${i.owner} | [Deadline]: ${i.deadline}`).join('\n');
    const fullMoM = `MEETING MINUTES (MoM)\nTitle: ${meetingTitle}\nDate/Time/Location: ${dateLocation}\nAttendees: ${attendees}\n\nAGENDA:\n${agenda}\n\nKEY DECISIONS MADE:\n${decisions}\n\nACTION ITEMS MATRIX:\n${actionItemsFormatted}`;

    try {
      const res = await evaluateDocument({
        documentType: 'Meeting Minutes',
        content: fullMoM,
        titleOrSubject: meetingTitle
      });
      setEvalResult(res);
      if (res.score10 >= 6.0) {
        onCompleteActivity();
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSavePortfolio = () => {
    if (!evalResult) return;
    const actionItemsFormatted = actionItems.map((i) => `• ${i.task} (Owner: ${i.owner}, Deadline: ${i.deadline})`).join('\n');
    const fullMoM = `MoM: ${meetingTitle}\nDate: ${dateLocation}\nAttendees: ${attendees}\n\nAgenda:\n${agenda}\n\nDecisions:\n${decisions}\n\nAction Items:\n${actionItemsFormatted}`;
    onSaveToPortfolio(`Meeting Minutes: ${meetingTitle}`, 'Meeting Minutes', fullMoM, evalResult.score10);
    setSavedToPortfolio(true);
  };

  return (
    <div className="space-y-6">
      <PWAudioPlaceholder
        category="Instructions"
        title="Meeting Minutes (MoM) Builder Instructions"
        transcript="Transform raw meeting discussions into a structured Minutes of Meeting (MoM) document. Define attendees, agenda items, key consensus decisions, and an actionable task matrix with owners and deadlines."
      />

      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
        <h3 className="text-base font-extrabold text-[#2C3E50] font-heading flex items-center gap-2 border-b border-[#FAD7A0] pb-3">
          <ClipboardList className="w-5 h-5 text-[#D35400]" /> Minutes of Meeting (MoM) Formatter
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#2C3E50] mb-1">Meeting Title:</label>
            <input
              type="text"
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-2.5 text-xs font-bold text-[#2C3E50]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2C3E50] mb-1">Date, Time & Location:</label>
            <input
              type="text"
              value={dateLocation}
              onChange={(e) => setDateLocation(e.target.value)}
              className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-2.5 text-xs text-[#2C3E50]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#2C3E50] mb-1">Attendees & Faculty Lead:</label>
          <input
            type="text"
            value={attendees}
            onChange={(e) => setAttendees(e.target.value)}
            className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-2.5 text-xs text-[#2C3E50]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#2C3E50] mb-1">Agenda Items Discussed:</label>
            <textarea
              rows={4}
              value={agenda}
              onChange={(e) => setAgenda(e.target.value)}
              className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-3 text-xs text-[#2C3E50]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2C3E50] mb-1">Key Decisions Made:</label>
            <textarea
              rows={4}
              value={decisions}
              onChange={(e) => setDecisions(e.target.value)}
              className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-3 text-xs text-[#2C3E50]"
            />
          </div>
        </div>

        {/* Action Items Matrix Table */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-extrabold text-[#D35400] uppercase">
              Action Items Matrix (Tasks, Owners & Deadlines):
            </label>
            <button
              type="button"
              onClick={addActionItem}
              className="px-3 py-1 bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400] text-xs font-bold rounded-lg flex items-center gap-1 hover:bg-[#FAD7A0]"
            >
              <Plus className="w-3.5 h-3.5" /> Add Action Item
            </button>
          </div>

          <div className="space-y-2">
            {actionItems.map((item, idx) => (
              <div key={item.id} className="flex items-center gap-2 bg-[#FFF8F0] p-2 rounded-xl border border-[#FAD7A0]">
                <input
                  type="text"
                  placeholder="Task description"
                  value={item.task}
                  onChange={(e) => updateActionItem(item.id, 'task', e.target.value)}
                  className="flex-1 bg-white border border-[#FAD7A0] rounded-lg px-2.5 py-1.5 text-xs text-[#2C3E50]"
                />
                <input
                  type="text"
                  placeholder="Owner"
                  value={item.owner}
                  onChange={(e) => updateActionItem(item.id, 'owner', e.target.value)}
                  className="w-28 bg-white border border-[#FAD7A0] rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#2C3E50]"
                />
                <input
                  type="text"
                  placeholder="Deadline"
                  value={item.deadline}
                  onChange={(e) => updateActionItem(item.id, 'deadline', e.target.value)}
                  className="w-24 bg-white border border-[#FAD7A0] rounded-lg px-2.5 py-1.5 text-xs text-[#2C3E50]"
                />
                {actionItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeActionItem(item.id)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-[#FAD7A0]">
          <button
            type="button"
            onClick={handleEvaluate}
            disabled={isAnalyzing}
            className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#B04300] transition flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Evaluate MoM (10 Marks)
          </button>
        </div>
      </div>

      {evalResult && (
        <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-2">
            <h4 className="font-bold text-[#2C3E50]">Meeting Minutes Score</h4>
            <span className="text-2xl font-black text-[#D35400]">{evalResult.score10} / 10</span>
          </div>
          <p className="text-xs text-[#5D6D7E]">{evalResult.overallFeedback}</p>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleSavePortfolio}
              disabled={savedToPortfolio}
              className="px-4 py-2 border border-[#FAD7A0] text-[#D35400] text-xs font-bold rounded-xl hover:bg-[#FFF8F0]"
            >
              <FolderCheck className="w-4 h-4 inline mr-1" />
              {savedToPortfolio ? 'Saved to Portfolio' : 'Add to Portfolio'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
