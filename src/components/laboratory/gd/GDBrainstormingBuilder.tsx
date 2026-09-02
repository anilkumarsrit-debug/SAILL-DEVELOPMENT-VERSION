import React, { useState, useEffect } from 'react';
import {
  PenTool,
  CheckCircle2,
  AlertCircle,
  Save,
  ArrowRight,
  ArrowLeft,
  FileText,
  Copy,
  Check,
  Sparkles,
  BookOpen,
  HelpCircle,
  Lightbulb,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { dbStorage } from '../../../lib/db';

export interface BrainstormScenarioData {
  id: string;
  topic: string;
  category: string;
  context: string;
  suggestedDimensions: string[];
}

export interface StudentScenarioResponse {
  position: string;
  keyPoints: string;
  exampleEvidence: string;
  howToPresent: string;
  submittedAt?: string;
}

const GD_SCENARIOS: BrainstormScenarioData[] = [
  {
    id: 'sc-1',
    topic: 'Should Artificial Intelligence replace some human jobs in core engineering?',
    category: 'Core Engineering & Technology',
    context:
      'With rapid advancements in generative AI, automated CAD/CAM modeling, and algorithm-driven structural analysis, routine engineering calculations and drafting tasks can now be automated. Examine the trade-offs between augmented engineering productivity, ethical design oversight, and workforce transitions.',
    suggestedDimensions: [
      'Automation of routine vs creative problem-solving',
      'Safety and legal liability in mission-critical systems',
      'Upskilling engineers to become AI orchestrators',
      'Cost reduction vs human intuition'
    ]
  },
  {
    id: 'sc-2',
    topic: 'Is work-from-home better than working from the office for young engineering professionals?',
    category: 'Workplace Culture & Professional Development',
    context:
      'Remote work provides flexibility, zero commute stress, and global project access. However, in-office environments offer spontaneous peer mentoring, hands-on laboratory access, and faster social integration for fresh graduates entering the corporate world.',
    suggestedDimensions: [
      'Learning curve and organic peer mentorship',
      'Physical hardware and lab testing requirements',
      'Work-life balance vs isolation',
      'Hybrid operational models'
    ]
  },
  {
    id: 'sc-3',
    topic: 'Should engineering students be required to learn communication and soft skills along with technical subjects?',
    category: 'Curriculum & Holistic Employability',
    context:
      'While technical competence forms the backbone of engineering solutions, industry recruiters report that engineers frequently struggle with cross-functional teamwork, client presentations, conflict negotiation, and executive briefings.',
    suggestedDimensions: [
      'Bridging technical algorithms with business value',
      'Placement drive selection criteria',
      'Global multidisciplinary team collaboration',
      'Project management and leadership readiness'
    ]
  }
];

interface GDBrainstormingBuilderProps {
  onProceedToNext?: () => void;
  onActivityCompleted?: () => void;
}

export const GDBrainstormingBuilder: React.FC<GDBrainstormingBuilderProps> = ({
  onProceedToNext,
  onActivityCompleted
}) => {
  // Current active scenario index (0, 1, 2, or 3 for Review screen)
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState<number>(0);

  // Student Responses for the 3 scenarios
  const [responses, setResponses] = useState<Record<string, StudentScenarioResponse>>({
    'sc-1': { position: '', keyPoints: '', exampleEvidence: '', howToPresent: '' },
    'sc-2': { position: '', keyPoints: '', exampleEvidence: '', howToPresent: '' },
    'sc-3': { position: '', keyPoints: '', exampleEvidence: '', howToPresent: '' }
  });

  // Track submission status per scenario
  const [submittedScenarios, setSubmittedScenarios] = useState<Record<string, boolean>>({
    'sc-1': false,
    'sc-2': false,
    'sc-3': false
  });

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isAllCompleted, setIsAllCompleted] = useState<boolean>(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState<boolean>(false);

  // Load existing responses from IndexedDB on mount
  useEffect(() => {
    loadSavedBrainstormingNotes();
  }, []);

  const loadSavedBrainstormingNotes = async () => {
    try {
      const items = await dbStorage.getPortfolioItems('group-discussion');
      const savedItem = items.find(
        (i) => i.id === 'm4-act2-gd-brainstorming' || i.title.includes('GD Brainstorming & Point Builder')
      );

      if (savedItem && savedItem.content) {
        try {
          const parsed = JSON.parse(savedItem.content);
          if (parsed && typeof parsed === 'object') {
            setResponses((prev) => ({
              ...prev,
              ...parsed
            }));
            const completedMap: Record<string, boolean> = {};
            GD_SCENARIOS.forEach((sc) => {
              const resp = parsed[sc.id];
              if (resp && resp.position && resp.keyPoints && resp.exampleEvidence && resp.howToPresent) {
                completedMap[sc.id] = true;
              }
            });
            setSubmittedScenarios(completedMap);
            if (completedMap['sc-1'] && completedMap['sc-2'] && completedMap['sc-3']) {
              setIsAllCompleted(true);
            }
          }
        } catch {
          // fallback string
        }
      }
    } catch (err) {
      console.error('Failed loading saved brainstorming notes:', err);
    }
  };

  const currentScenario = GD_SCENARIOS[currentScenarioIndex];
  const currentResponse = currentScenario ? responses[currentScenario.id] : null;

  const handleInputChange = (field: keyof StudentScenarioResponse, value: string) => {
    if (!currentScenario) return;
    setValidationError(null);
    setSaveSuccessMsg(null);
    setResponses((prev) => ({
      ...prev,
      [currentScenario.id]: {
        ...prev[currentScenario.id],
        [field]: value
      }
    }));
  };

  // Validate and submit current scenario
  const handleSubmitCurrentScenario = async () => {
    if (!currentScenario || !currentResponse) return;
    setValidationError(null);
    setSaveSuccessMsg(null);

    // Validation: All 4 fields must be filled
    if (!currentResponse.position.trim()) {
      setValidationError('Please complete "My Position" before continuing.');
      return;
    }
    if (!currentResponse.keyPoints.trim()) {
      setValidationError('Please write your "Key Points" before continuing.');
      return;
    }
    if (!currentResponse.exampleEvidence.trim()) {
      setValidationError('Please provide an "Example / Evidence" before continuing.');
      return;
    }
    if (!currentResponse.howToPresent.trim()) {
      setValidationError('Please write "How I Would Present It" using diplomatic GD language.');
      return;
    }

    setIsSaving(true);
    try {
      const updatedSubmitted = {
        ...submittedScenarios,
        [currentScenario.id]: true
      };
      setSubmittedScenarios(updatedSubmitted);

      // Save to IndexedDB
      await dbStorage.savePortfolioItem({
        id: 'm4-act2-gd-brainstorming',
        moduleId: 'group-discussion',
        moduleTitle: 'Group Discussion Techniques',
        title: 'Module 4 • Activity 2: GD Brainstorming & Point Builder Notes',
        category: 'written',
        content: JSON.stringify(responses),
        score: 10,
        createdAt: new Date().toISOString()
      });

      setSaveSuccessMsg(`Scenario ${currentScenarioIndex + 1} saved successfully!`);

      // Check if this was the last scenario
      if (currentScenarioIndex < GD_SCENARIOS.length - 1) {
        setTimeout(() => {
          setSaveSuccessMsg(null);
          setCurrentScenarioIndex((prev) => prev + 1);
        }, 600);
      } else {
        // All 3 completed!
        setIsAllCompleted(true);
        setCurrentScenarioIndex(3); // Go to master review screen
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
        if (onActivityCompleted) {
          onActivityCompleted();
        }
      }
    } catch (err) {
      console.error('Failed saving scenario response:', err);
      setValidationError('Failed to save your notes to the database. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyToClipboard = () => {
    let summaryText = `SRIT SAILL LAB — GROUP DISCUSSION PREPARATION NOTES\n=======================================================\n\n`;
    GD_SCENARIOS.forEach((sc, idx) => {
      const resp = responses[sc.id];
      summaryText += `SCENARIO ${idx + 1}: ${sc.topic}\n`;
      summaryText += `-------------------------------------------------------\n`;
      summaryText += `1. MY POSITION:\n${resp.position || 'N/A'}\n\n`;
      summaryText += `2. KEY POINTS:\n${resp.keyPoints || 'N/A'}\n\n`;
      summaryText += `3. EXAMPLE / EVIDENCE:\n${resp.exampleEvidence || 'N/A'}\n\n`;
      summaryText += `4. HOW I WOULD PRESENT IT:\n${resp.howToPresent || 'N/A'}\n\n\n`;
    });

    navigator.clipboard.writeText(summaryText);
    setCopiedToClipboard(true);
    setTimeout(() => setCopiedToClipboard(false), 3000);
  };

  return (
    <div className="srit-card p-6 bg-white border border-[#FAD7A0] rounded-2xl space-y-8 text-[#2C3E50]">
      {/* Header */}
      <div className="border-b border-[#FAD7A0] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D35400] bg-[#FFF8F0] px-2.5 py-1 rounded-md border border-[#FAD7A0]">
              Activity 2 of 2
            </span>
            <h3 className="text-xl font-black text-[#2C3E50] font-heading">
              GD Brainstorming & Point Builder
            </h3>
          </div>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Prepare your arguments, evidence, and presentation approach before participating in an actual Group Discussion.
          </p>
        </div>

        {isAllCompleted && (
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-extrabold rounded-xl flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Activity Completed ✓</span>
            </span>
          </div>
        )}
      </div>

      {/* Structured Writing Workspace Notice */}
      <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-xs space-y-1.5">
        <div className="flex items-center gap-2 text-amber-900 font-extrabold uppercase text-[11px]">
          <Lightbulb className="w-4 h-4 text-[#D35400]" />
          <span>Objective Idea Workshop (No AI Scoring Applied)</span>
        </div>
        <p className="text-gray-700 leading-relaxed text-[11px]">
          This is a self-paced, rigorous argument structuring module. You must complete all <strong>3 GD scenarios</strong> to build your comprehensive placement GD dossier. Your notes will be securely preserved in your SAILL Laboratory Portfolio.
        </p>
      </div>

      {/* Stepper Navigation */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-gray-100">
        {GD_SCENARIOS.map((sc, idx) => {
          const isCurrent = currentScenarioIndex === idx;
          const isDone = submittedScenarios[sc.id];

          return (
            <button
              key={sc.id}
              type="button"
              onClick={() => setCurrentScenarioIndex(idx)}
              className={`flex-1 min-w-[140px] p-2.5 rounded-xl border text-left text-xs transition-all flex items-center gap-2 cursor-pointer ${
                isCurrent
                  ? 'border-[#D35400] bg-[#FFF8F0] ring-2 ring-[#D35400]/20 font-bold text-[#2C3E50]'
                  : isDone
                  ? 'border-emerald-300 bg-emerald-50/50 text-emerald-900'
                  : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                isDone
                  ? 'bg-emerald-600 text-white'
                  : isCurrent
                  ? 'bg-[#D35400] text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}>
                {isDone ? '✓' : idx + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-bold">Scenario {idx + 1}</p>
                <p className="truncate text-[10px] text-gray-500">{sc.category.split('&')[0]}</p>
              </div>
            </button>
          );
        })}

        {/* Master Review Tab */}
        <button
          type="button"
          onClick={() => {
            if (isAllCompleted || (submittedScenarios['sc-1'] && submittedScenarios['sc-2'] && submittedScenarios['sc-3'])) {
              setCurrentScenarioIndex(3);
            }
          }}
          disabled={!isAllCompleted && !(submittedScenarios['sc-1'] && submittedScenarios['sc-2'] && submittedScenarios['sc-3'])}
          className={`flex-1 min-w-[140px] p-2.5 rounded-xl border text-left text-xs transition-all flex items-center gap-2 ${
            currentScenarioIndex === 3
              ? 'border-[#D35400] bg-[#FFF8F0] ring-2 ring-[#D35400]/20 font-bold text-[#2C3E50]'
              : isAllCompleted
              ? 'border-indigo-300 bg-indigo-50/50 text-indigo-900 cursor-pointer'
              : 'border-gray-200 bg-gray-50 text-gray-400 opacity-60 cursor-not-allowed'
          }`}
        >
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
            currentScenarioIndex === 3 ? 'bg-[#D35400] text-white' : 'bg-indigo-600 text-white'
          }`}>
            ★
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-bold">Master Review</p>
            <p className="truncate text-[10px] text-gray-500">All 3 Dossiers</p>
          </div>
        </button>
      </div>

      {/* Validation / Success Messages */}
      {validationError && (
        <div className="p-3 bg-rose-50 border border-rose-300 text-rose-800 rounded-xl text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{validationError}</span>
        </div>
      )}

      {saveSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* SCENARIO WRITING VIEW (0, 1, 2) */}
      {currentScenarioIndex < 3 && currentScenario && currentResponse && (
        <div className="space-y-6">
          {/* Topic Briefing Card */}
          <div className="p-5 bg-gradient-to-r from-[#2C3E50] to-[#1a252f] text-white rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#FAD7A0] bg-white/10 px-2 py-0.5 rounded border border-white/10">
                Scenario {currentScenarioIndex + 1} of 3 • {currentScenario.category}
              </span>
              {submittedScenarios[currentScenario.id] && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-bold">
                  ✓ Saved
                </span>
              )}
            </div>

            <h4 className="text-base font-extrabold font-heading text-white">
              "{currentScenario.topic}"
            </h4>

            <p className="text-xs text-slate-300 leading-relaxed">
              {currentScenario.context}
            </p>

            <div className="pt-2 border-t border-white/10 flex flex-wrap gap-1.5 text-[10px]">
              <span className="text-gray-400 font-bold">Recommended Analysis Angles:</span>
              {currentScenario.suggestedDimensions.map((dim, dIdx) => (
                <span key={dIdx} className="px-2 py-0.5 bg-white/10 text-[#FAD7A0] rounded-md">
                  • {dim}
                </span>
              ))}
            </div>
          </div>

          {/* 4 Structured Input Boxes */}
          <div className="space-y-4">
            {/* Field 1: My Position */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#2C3E50] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#D35400] text-white text-[10px] font-bold flex items-center justify-center">
                    1
                  </span>
                  <span>My Position (Clear Stance & Core Thesis)</span>
                  <span className="text-rose-500">*</span>
                </span>
                <span className="text-[10px] text-gray-500 font-normal">State what you think about this topic clearly</span>
              </label>
              <textarea
                value={currentResponse.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                rows={3}
                placeholder="What do you think about this topic? State your clear stance. e.g., 'I believe AI will augment engineering productivity rather than completely replace skilled engineers, provided professionals upskill into orchestration and system-level validation...'"
                className="w-full p-3 bg-[#FFF8F0]/40 border border-gray-300 rounded-xl text-xs text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:border-transparent outline-none"
              />
            </div>

            {/* Field 2: Key Points */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#2C3E50] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#D35400] text-white text-[10px] font-bold flex items-center justify-center">
                    2
                  </span>
                  <span>Key Points (2–4 Structured Arguments)</span>
                  <span className="text-rose-500">*</span>
                </span>
                <span className="text-[10px] text-gray-500 font-normal">Logical points you would make during the discussion</span>
              </label>
              <textarea
                value={currentResponse.keyPoints}
                onChange={(e) => handleInputChange('keyPoints', e.target.value)}
                rows={3}
                placeholder="Write 2–4 important points you would like to make during the GD. e.g.:
1. Routine, repetitive tasks (e.g. standard boilerplate coding, draft calculations) will be automated.
2. High-level architectural decision-making, ethical safety auditing, and edge-case debugging remain distinctly human.
3. Cost savings from automation can be redirected into innovation and experimental R&D."
                className="w-full p-3 bg-[#FFF8F0]/40 border border-gray-300 rounded-xl text-xs text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:border-transparent outline-none"
              />
            </div>

            {/* Field 3: Example / Evidence */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#2C3E50] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#D35400] text-white text-[10px] font-bold flex items-center justify-center">
                    3
                  </span>
                  <span>Example / Evidence (Real-World Situation, Fact, or Case)</span>
                  <span className="text-rose-500">*</span>
                </span>
                <span className="text-[10px] text-gray-500 font-normal">Grounds your argument in empirical reality</span>
              </label>
              <textarea
                value={currentResponse.exampleEvidence}
                onChange={(e) => handleInputChange('exampleEvidence', e.target.value)}
                rows={3}
                placeholder="Write an example, situation, fact, or experience that could support your point. e.g., 'In civil engineering, AI models can simulate 10,000 earthquake load scenarios in minutes, but licensed structural engineers are legally mandated to sign off on building code compliance and safety margins.'"
                className="w-full p-3 bg-[#FFF8F0]/40 border border-gray-300 rounded-xl text-xs text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:border-transparent outline-none"
              />
            </div>

            {/* Field 4: How I Would Present It */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#2C3E50] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#D35400] text-white text-[10px] font-bold flex items-center justify-center">
                    4
                  </span>
                  <span>How I Would Present It (Spoken Phrasing & Delivery Approach)</span>
                  <span className="text-rose-500">*</span>
                </span>
                <span className="text-[10px] text-gray-500 font-normal">Use formal introductory and transition phrases</span>
              </label>
              <textarea
                value={currentResponse.howToPresent}
                onChange={(e) => handleInputChange('howToPresent', e.target.value)}
                rows={3}
                placeholder="Write how you would introduce or explain one of your points during the GD using diplomatic GD language. e.g., 'I would like to contribute another dimension to what my peers have stated. While automation accelerates initial computation, human engineers remain irreplaceable for liability and ethical judgment. For instance, in structural design...'"
                className="w-full p-3 bg-[#FFF8F0]/40 border border-gray-300 rounded-xl text-xs text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Stepper Navigation Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-gray-200">
            <div>
              {currentScenarioIndex > 0 && (
                <button
                  type="button"
                  onClick={() => setCurrentScenarioIndex((prev) => prev - 1)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous Scenario</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSubmitCurrentScenario}
                disabled={isSaving}
                className="px-6 py-2.5 bg-[#D35400] hover:bg-[#E67E22] text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>
                  {isSaving
                    ? 'Saving...'
                    : currentScenarioIndex === GD_SCENARIOS.length - 1
                    ? 'Submit & Complete All Scenarios'
                    : `Save & Continue to Scenario ${currentScenarioIndex + 2} →`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MASTER REVIEW VIEW (Index 3) */}
      {currentScenarioIndex === 3 && (
        <div className="space-y-6">
          <div className="p-5 bg-[#FFF8F0] border-2 border-[#D35400]/40 rounded-2xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D35400]">
                  Master Portfolio Artifact
                </span>
                <h4 className="text-lg font-black text-[#2C3E50] font-heading">
                  Your GD Preparation Notes & Argument Dossiers
                </h4>
                <p className="text-xs text-gray-600 mt-0.5">
                  Review your synthesized points across all 3 engineering scenarios. These structured notes serve as your quick-reference sheet during live GD rounds.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyToClipboard}
                  className="px-3.5 py-2 bg-white border border-[#FAD7A0] text-[#D35400] hover:bg-[#FFF8F0] text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  {copiedToClipboard ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedToClipboard ? 'Copied to Clipboard!' : 'Copy All Notes'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Dossiers for all 3 Scenarios */}
          <div className="space-y-5">
            {GD_SCENARIOS.map((sc, idx) => {
              const resp = responses[sc.id];

              return (
                <div
                  key={sc.id}
                  className="p-5 bg-white border border-[#FAD7A0] rounded-xl space-y-4 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-2.5">
                    <div>
                      <span className="text-[10px] font-bold text-[#D35400] uppercase tracking-wide">
                        Scenario {idx + 1} • {sc.category}
                      </span>
                      <h5 className="font-extrabold text-[#2C3E50] text-sm mt-0.5">
                        "{sc.topic}"
                      </h5>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentScenarioIndex(idx)}
                      className="text-xs text-[#D35400] hover:underline font-bold"
                    >
                      Edit Notes
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {/* Box 1 */}
                    <div className="p-3 bg-[#FFF8F0]/50 rounded-lg border border-amber-100 space-y-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase block">1. My Position</span>
                      <p className="text-gray-800 italic">"{resp.position || 'No stance recorded.'}"</p>
                    </div>

                    {/* Box 2 */}
                    <div className="p-3 bg-[#FFF8F0]/50 rounded-lg border border-amber-100 space-y-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase block">2. Key Points</span>
                      <p className="text-gray-800 whitespace-pre-line">{resp.keyPoints || 'No points recorded.'}</p>
                    </div>

                    {/* Box 3 */}
                    <div className="p-3 bg-[#FFF8F0]/50 rounded-lg border border-amber-100 space-y-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase block">3. Example / Evidence</span>
                      <p className="text-gray-800">{resp.exampleEvidence || 'No evidence recorded.'}</p>
                    </div>

                    {/* Box 4 */}
                    <div className="p-3 bg-[#FFF8F0]/50 rounded-lg border border-amber-100 space-y-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase block">4. How I Would Present It</span>
                      <p className="text-[#D35400] font-serif italic">"{resp.howToPresent || 'No spoken phrasing recorded.'}"</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Master Review Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setCurrentScenarioIndex(0)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Scenario 1</span>
            </button>

            {onProceedToNext && (
              <button
                type="button"
                onClick={onProceedToNext}
                className="px-6 py-2.5 bg-[#D35400] hover:bg-[#E67E22] text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <span>Proceed to Section 4: Video & Case Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
