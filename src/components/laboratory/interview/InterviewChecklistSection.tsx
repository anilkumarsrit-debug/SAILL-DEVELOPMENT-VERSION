import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, ArrowRight, Sparkles, RefreshCw, Award } from 'lucide-react';

interface ChecklistItem {
  id: string;
  label: string;
  category: 'Preparation' | 'Presence' | 'Delivery';
  description: string;
  tip: string;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'dress',
    label: 'Professional Dress',
    category: 'Preparation',
    description: 'Clean, formal attire suitable for campus placements (formal shirt, trousers/skirt, polished shoes).',
    tip: 'Ensure neutral colors and neat grooming to project immediate professionalism.'
  },
  {
    id: 'resume',
    label: 'Resume Ready',
    category: 'Preparation',
    description: 'Updated copy of resume with verified project details and technical skills.',
    tip: 'Be ready to explain any bullet point on your resume within 30 seconds.'
  },
  {
    id: 'company',
    label: 'Company Research',
    category: 'Preparation',
    description: 'Thorough knowledge of the target company, products, recent news, and culture.',
    tip: 'Mention a specific company product or value during your answer to "Why us?".'
  },
  {
    id: 'confidence',
    label: 'Confidence',
    category: 'Presence',
    description: 'Self-assured composure, deep breathing, and positive mindset before answering.',
    tip: 'Pause for 2 seconds before speaking to organize your thoughts calmly.'
  },
  {
    id: 'greeting',
    label: 'Greeting',
    category: 'Presence',
    description: 'Warm, respectful professional greeting ("Good morning, Sir/Madam").',
    tip: 'Smile slightly while greeting to build instant rapport with the panel.'
  },
  {
    id: 'eye_contact',
    label: 'Eye Contact',
    category: 'Presence',
    description: 'Consistent, direct eye contact with the interviewer or camera lens.',
    tip: 'Maintain 70-80% eye contact throughout your response without staring continuously.'
  },
  {
    id: 'positive_attitude',
    label: 'Positive Attitude',
    category: 'Presence',
    description: 'Constructive language, enthusiasm, and optimistic problem-solving stance.',
    tip: 'Reframe failures as valuable learning experiences.'
  },
  {
    id: 'voice_clarity',
    label: 'Voice Clarity',
    category: 'Delivery',
    description: 'Clear articulation, appropriate volume, pace (130-150 WPM), and pleasant tone.',
    tip: 'Articulate word endings clearly and avoid trailing off into a whisper.'
  },
  {
    id: 'time_mgmt',
    label: 'Time Management',
    category: 'Delivery',
    description: 'Concise, structured answers kept within 60-90 seconds per question.',
    tip: 'Use STAR structure to avoid rambling or repeating points.'
  }
];

interface InterviewChecklistSectionProps {
  onCompleteActivity: () => void;
}

export const InterviewChecklistSection: React.FC<InterviewChecklistSectionProps> = ({ onCompleteActivity }) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem('interview_readiness_checklist');
      if (saved) {
        setCheckedItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load checklist', e);
    }
  }, []);

  const toggleItem = (id: string) => {
    const updated = { ...checkedItems, [id]: !checkedItems[id] };
    setCheckedItems(updated);
    try {
      localStorage.setItem('interview_readiness_checklist', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save checklist', e);
    }
  };

  const resetChecklist = () => {
    setCheckedItems({});
    try {
      localStorage.removeItem('interview_readiness_checklist');
    } catch (e) {
      console.error('Failed to reset checklist', e);
    }
  };

  const completedCount = CHECKLIST_ITEMS.filter((item) => checkedItems[item.id]).length;
  const progressPercent = Math.round((completedCount / CHECKLIST_ITEMS.length) * 100);

  return (
    <div className="space-y-6">
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
        {/* Section Header */}
        <div className="border-b border-[#FAD7A0] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest bg-[#D35400] text-white px-2 py-0.5 rounded-md">
                Section 2
              </span>
              <span className="text-xs text-[#5D6D7E] font-bold">R26 Communicative English Laboratory</span>
            </div>
            <h2 className="text-lg font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#D35400]" />
              2. Interview Readiness Checklist
            </h2>
            <p className="text-xs text-[#5D6D7E] mt-1">
              Verify your physical, mental, and verbal preparation before attempting mock interviews.
            </p>
          </div>

          <div className="bg-[#FFF8F0] p-4 rounded-2xl border border-[#FAD7A0] text-center min-w-[180px] shrink-0 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#D35400] block">Readiness Score</span>
            <div className="text-2xl font-black text-[#2C3E50]">{progressPercent}%</div>
            <p className="text-[10px] text-[#5D6D7E]">{completedCount} of {CHECKLIST_ITEMS.length} items ready</p>
            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mt-1">
              <div
                className="bg-[#D35400] h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Readiness Level Indicator */}
        {progressPercent === 100 ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-3 text-emerald-900">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wide">Interview Ready!</h4>
                <p className="text-xs text-emerald-800">You have completed all 9 readiness checkpoints. You are fully prepared for the HR round.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={resetChecklist}
              className="text-xs text-emerald-700 hover:underline flex items-center gap-1 font-bold shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        ) : (
          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-[#D35400] shrink-0" />
              <p className="text-xs text-[#2C3E50]">
                Mark each item complete as you prepare. Aim for 100% readiness before entering the AI Mock Interview Studio.
              </p>
            </div>
            {completedCount > 0 && (
              <button
                type="button"
                onClick={resetChecklist}
                className="text-xs text-[#D35400] hover:underline flex items-center gap-1 font-bold shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset
              </button>
            )}
          </div>
        )}

        {/* Checklist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CHECKLIST_ITEMS.map((item) => {
            const isChecked = !!checkedItems[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between gap-3 ${
                  isChecked
                    ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 shadow-xs'
                    : 'bg-white border-[#FAD7A0] hover:border-[#D35400] hover:bg-[#FFF8F0]'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#2C3E50]/10 text-[#2C3E50]">
                        {item.category}
                      </span>
                    </div>
                    {isChecked ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-300 shrink-0" />
                    )}
                  </div>

                  <h3 className={`text-xs font-black ${isChecked ? 'text-emerald-950 line-through' : 'text-[#2C3E50]'}`}>
                    {item.label}
                  </h3>

                  <p className="text-[11px] text-[#5D6D7E] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-100 text-[10px] text-[#D35400] italic">
                  💡 {item.tip}
                </div>
              </div>
            );
          })}
        </div>

        {/* Next Step Trigger */}
        <div className="flex items-center justify-between pt-4 border-t border-[#FAD7A0]">
          <span className="text-xs text-[#5D6D7E]">
            {completedCount === CHECKLIST_ITEMS.length
              ? 'Checklist complete! Proceed to HR Round Simulation.'
              : 'Complete items to ensure full interview readiness.'}
          </span>

          <button
            type="button"
            onClick={onCompleteActivity}
            className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#B04300] transition flex items-center gap-2"
          >
            Continue to HR Round Simulation <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
