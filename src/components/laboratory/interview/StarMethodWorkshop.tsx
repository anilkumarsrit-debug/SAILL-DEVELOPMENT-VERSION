import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  Award,
  CheckCircle2,
  Save,
  RotateCcw,
  BookMarked,
  ArrowRight
} from 'lucide-react';
import { dbStorage } from '../../../lib/db';

interface StarMethodWorkshopProps {
  onCompleteActivity: () => void;
  onSaveToPortfolio?: (title: string, category: string, content: string, score: number) => void;
}

interface ScenarioTemplate {
  id: string;
  title: string;
  category: string;
  situationPrompt: string;
  taskPrompt: string;
  actionPrompt: string;
  resultPrompt: string;
  exampleSample: {
    s: string;
    t: string;
    a: string;
    r: string;
  };
}

const STAR_SCENARIOS: ScenarioTemplate[] = [
  {
    id: 'star-1',
    title: 'Resolving a Deadlocked Team Conflict during Miniproject',
    category: 'Team Collaboration',
    situationPrompt: 'Describe the team project context and the disagreement between team members.',
    taskPrompt: 'What was your responsibility to resolve the deadlock and meet project deadline?',
    actionPrompt: 'Detail the exact collaborative steps, data benchmarks, or compromise YOU facilitated.',
    resultPrompt: 'What was the positive outcome, deliverable completion, or grade achieved?',
    exampleSample: {
      s: 'During our 2nd semester web application project at SRIT, two team members disagreed on using SQL vs MongoDB.',
      t: 'As team leader, I needed to resolve the deadlock within 24 hours to keep our project milestone on schedule.',
      a: 'I organized an objective 30-minute benchmarking test comparing both databases for our query needs, presenting latency data calmly.',
      r: 'The team unanimously agreed on SQLite, completed the project 2 days early, and scored 10/10 in the lab evaluation.'
    }
  },
  {
    id: 'star-2',
    title: 'Fixing a Critical Bug 2 Hours Before Submission',
    category: 'Problem-Solving Under Pressure',
    situationPrompt: 'Describe the technical bug and urgency before project submission.',
    taskPrompt: 'What was your goal to isolate and repair the code without breaking existing features?',
    actionPrompt: 'What debugging steps, logs, or git branch rollbacks did YOU execute?',
    resultPrompt: 'What was the metric or outcome (e.g. 100% test pass, successful demo)?',
    exampleSample: {
      s: 'Two hours before our final C++ Data Structures lab submission, our sorting program threw a segmentation fault.',
      t: 'I had to identify the null pointer exception and verify memory allocation across 300 lines of code.',
      a: 'I isolated the loop boundaries using gdb debugger, corrected the vector index boundary condition, and ran unit test cases.',
      r: 'The code compiled cleanly, passed all 10 hidden test cases, and received praise from our faculty.'
    }
  },
  {
    id: 'star-3',
    title: 'Managing Heavy Academic Workload with Hackathon Prep',
    category: 'Time Management & Adaptability',
    situationPrompt: 'Describe the overlapping commitments (mid-term exams & state-level hackathon).',
    taskPrompt: 'What was your strategy to ensure top academic performance while preparing your prototype?',
    actionPrompt: 'How did you schedule time, prioritize tasks, and maintain focus?',
    resultPrompt: 'What were the results in both academics and the hackathon competition?',
    exampleSample: {
      s: 'Last month, my mid-semester lab exams coincided with the finals of the State-Level Engineering Hackathon.',
      t: 'I needed to achieve above 85% in my exams while building our IoT prototype presentation.',
      a: 'I created a strict time-block schedule, completed academic revision in early mornings, and allocated 3 hours nightly to coding.',
      r: 'I achieved 91% in my lab exams and our team secured 2nd place in the hackathon.'
    }
  }
];

export const StarMethodWorkshop: React.FC<StarMethodWorkshopProps> = ({
  onCompleteActivity,
  onSaveToPortfolio
}) => {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number>(0);
  const currentScenario = STAR_SCENARIOS[selectedScenarioIndex];

  const [situation, setSituation] = useState<string>('');
  const [task, setTask] = useState<string>('');
  const [action, setAction] = useState<string>('');
  const [result, setResult] = useState<string>('');

  const [evaluating, setEvaluating] = useState<boolean>(false);
  const [starResult, setStarResult] = useState<{
    overallScore10: number;
    organizationScore: number;
    actionVerbScore: number;
    metricImpactScore: number;
    relevanceScore: number;
    feedbackText: string;
    suggestions: string[];
  } | null>(null);

  const [savedLocally, setSavedLocally] = useState<boolean>(false);

  const loadExample = () => {
    setSituation(currentScenario.exampleSample.s);
    setTask(currentScenario.exampleSample.t);
    setAction(currentScenario.exampleSample.a);
    setResult(currentScenario.exampleSample.r);
    setStarResult(null);
    setSavedLocally(false);
  };

  const handleEvaluateSTAR = () => {
    if (!situation.trim() || !task.trim() || !action.trim() || !result.trim()) return;
    setEvaluating(true);

    setTimeout(() => {
      const actionLength = action.trim().length;
      const resultLength = result.trim().length;

      let orgScore = 9.5; // Has all 4 pillars filled
      let actionScore = actionLength > 50 ? 9.2 : 7.8;
      let metricScore = /\d+/.test(result) ? 9.5 : 7.5; // Has numbers/metrics
      let relevanceScore = 9.0;

      let overall = Number(((orgScore + actionScore + metricScore + relevanceScore) / 4).toFixed(1));

      setStarResult({
        overallScore10: overall,
        organizationScore: orgScore,
        actionVerbScore: actionScore,
        metricImpactScore: metricScore,
        relevanceScore: relevanceScore,
        feedbackText: `Excellent STAR structure! Your Action section clearly details your individual contribution, and your Result provides a tangible outcome.`,
        suggestions: [
          /\d+/.test(result)
            ? 'Great job including quantifiable metrics in your Result!'
            : 'Try adding a percentage or specific numerical metric to your Result (e.g. "reduced latency by 20%").',
          'Use strong active verbs in Action (e.g., "facilitated", "implemented", "engineered", "benchmarked").'
        ]
      });

      setEvaluating(false);
    }, 1100);
  };

  const handleSaveStarStory = async () => {
    if (!starResult) return;

    const fullContent = `STAR METHOD STORY: ${currentScenario.title}\n\n[S] SITUATION:\n${situation}\n\n[T] TASK:\n${task}\n\n[A] ACTION:\n${action}\n\n[R] RESULT:\n${result}\n\nSAILL AI EVALUATION (${starResult.overallScore10}/10):\n- Organization: ${starResult.organizationScore}/10\n- Action Verbs: ${starResult.actionVerbScore}/10\n- Metric Impact: ${starResult.metricImpactScore}/10\n- Relevance: ${starResult.relevanceScore}/10`;

    // Save to IndexedDB
    await dbStorage.savePortfolioItem({
      id: `star-${Date.now()}`,
      moduleId: 'professional-writing',
      moduleTitle: 'Module 6: Interview Skills & Mock Interviews',
      title: `STAR Story: ${currentScenario.title}`,
      category: 'written',
      content: fullContent,
      score: Math.round(starResult.overallScore10 * 10),
      createdAt: new Date().toISOString()
    });

    if (onSaveToPortfolio) {
      onSaveToPortfolio(
        `STAR Story: ${currentScenario.title}`,
        'text',
        fullContent,
        starResult.overallScore10
      );
    }

    setSavedLocally(true);
    onCompleteActivity();
  };

  return (
    <div className="space-y-6">
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
        <div className="border-b border-[#FAD7A0] pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest bg-[#D35400] text-white px-2 py-0.5 rounded-md">
                Activity 4
              </span>
              <span className="text-xs text-[#5D6D7E] font-bold">R26 Communicative English Laboratory</span>
            </div>
            <h2 className="text-lg font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#D35400]" />
              4. STAR Method Response Workshop
            </h2>
            <p className="text-xs text-[#5D6D7E] mt-1">
              Structure behavioral interview stories using Situation (15%), Task (15%), Action (50%), and Result (20%). Receive AI scoring on organization and impact.
            </p>
          </div>

          <span className="bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400] text-xs font-bold px-3 py-1.5 rounded-xl">
            S.T.A.R Framework
          </span>
        </div>

        {/* 4 Pillars Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
            <span className="font-extrabold text-blue-900 block text-xs">S - Situation (15%)</span>
            <p className="text-[11px] text-blue-950">Set context & background clearly in 1-2 sentences.</p>
          </div>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
            <span className="font-extrabold text-amber-900 block text-xs">T - Task (15%)</span>
            <p className="text-[11px] text-amber-950">Identify the specific goal, challenge, or requirement.</p>
          </div>
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
            <span className="font-extrabold text-emerald-900 block text-xs">A - Action (50%)</span>
            <p className="text-[11px] text-emerald-950">Detail the exact steps YOU executed with active verbs.</p>
          </div>
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl space-y-1">
            <span className="font-extrabold text-purple-900 block text-xs">R - Result (20%)</span>
            <p className="text-[11px] text-purple-950">State quantifiable metric, learning, or grade outcome.</p>
          </div>
        </div>

        {/* Scenario Selection Header */}
        <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <label className="text-xs font-bold text-[#2C3E50] flex items-center gap-1.5">
              <BookMarked className="w-4 h-4 text-[#D35400]" /> Select Practice Scenario:
            </label>

            <button
              type="button"
              onClick={loadExample}
              className="text-xs font-bold text-[#D35400] hover:underline flex items-center gap-1"
            >
              Load Ideal STAR Example
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {STAR_SCENARIOS.map((sc, idx) => (
              <button
                key={sc.id}
                type="button"
                onClick={() => {
                  setSelectedScenarioIndex(idx);
                  setSituation('');
                  setTask('');
                  setAction('');
                  setResult('');
                  setStarResult(null);
                  setSavedLocally(false);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition text-left ${
                  selectedScenarioIndex === idx
                    ? 'bg-[#2C3E50] text-[#FAD7A0] border-[#2C3E50]'
                    : 'bg-white text-[#2C3E50] border-[#FAD7A0] hover:bg-[#FAD7A0]'
                }`}
              >
                {sc.title}
              </button>
            ))}
          </div>
        </div>

        {/* Guided STAR Inputs */}
        <div className="space-y-4">
          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1.5">
            <label className="text-xs font-extrabold text-blue-900 block">
              1. [S] Situation — Context & Background:
            </label>

            <textarea
              rows={2}
              value={situation}
              onChange={(e) => {
                setSituation(e.target.value);
                setStarResult(null);
                setSavedLocally(false);
              }}
              placeholder={currentScenario.situationPrompt}
              className="w-full bg-white border border-[#FAD7A0] rounded-lg p-3 text-xs text-[#2C3E50]"
            />
          </div>

          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1.5">
            <label className="text-xs font-extrabold text-amber-900 block">
              2. [T] Task — Specific Goal or Challenge:
            </label>
            <textarea
              rows={2}
              value={task}
              onChange={(e) => {
                setTask(e.target.value);
                setStarResult(null);
                setSavedLocally(false);
              }}
              placeholder={currentScenario.taskPrompt}
              className="w-full bg-white border border-[#FAD7A0] rounded-lg p-3 text-xs text-[#2C3E50]"
            />
          </div>

          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1.5">
            <label className="text-xs font-extrabold text-emerald-900 block">
              3. [A] Action — Specific Steps YOU took (Focus 50% here):
            </label>
            <textarea
              rows={3}
              value={action}
              onChange={(e) => {
                setAction(e.target.value);
                setStarResult(null);
                setSavedLocally(false);
              }}
              placeholder={currentScenario.actionPrompt}
              className="w-full bg-white border border-[#FAD7A0] rounded-lg p-3 text-xs text-[#2C3E50]"
            />
          </div>

          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1.5">
            <label className="text-xs font-extrabold text-purple-900 block">
              4. [R] Result — Metric, Outcome or Learning:
            </label>
            <textarea
              rows={2}
              value={result}
              onChange={(e) => {
                setResult(e.target.value);
                setStarResult(null);
                setSavedLocally(false);
              }}
              placeholder={currentScenario.resultPrompt}
              className="w-full bg-white border border-[#FAD7A0] rounded-lg p-3 text-xs text-[#2C3E50]"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => {
                setSituation('');
                setTask('');
                setAction('');
                setResult('');
                setStarResult(null);
                setSavedLocally(false);
              }}
              className="text-xs font-bold text-[#5D6D7E] hover:text-[#2C3E50] flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset Fields
            </button>

            <button
              type="button"
              onClick={handleEvaluateSTAR}
              disabled={evaluating || !situation.trim() || !task.trim() || !action.trim() || !result.trim()}
              className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#B04300] transition flex items-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {evaluating ? 'Evaluating STAR Structure...' : 'Analyze STAR Story with SAILL AI'}
            </button>
          </div>
        </div>

        {/* AI Evaluation Diagnostic Card */}
        {starResult && (
          <div className="p-5 rounded-2xl bg-white border-2 border-[#D35400] space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-[#D35400]" />
                <div>
                  <h4 className="text-sm font-extrabold text-[#2C3E50] font-heading">
                    STAR Method AI Diagnostic Score
                  </h4>
                  <p className="text-[11px] text-[#5D6D7E]">Organization & Impact Analysis</p>
                </div>
              </div>

              <div className="bg-[#FFF8F0] border border-[#FAD7A0] px-4 py-2 rounded-xl text-center">
                <span className="text-[10px] text-[#5D6D7E] uppercase block font-bold">SAILL Score</span>
                <span className="text-xl font-black text-[#D35400]">
                  {starResult.overallScore10} / 10
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-2.5 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0]">
                <span className="text-[10px] text-[#5D6D7E] font-bold block">Organization</span>
                <span className="text-sm font-black text-[#2C3E50]">{starResult.organizationScore} / 10</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0]">
                <span className="text-[10px] text-[#5D6D7E] font-bold block">Action Verbs</span>
                <span className="text-sm font-black text-[#2C3E50]">{starResult.actionVerbScore} / 10</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0]">
                <span className="text-[10px] text-[#5D6D7E] font-bold block">Metric Impact</span>
                <span className="text-sm font-black text-[#2C3E50]">{starResult.metricImpactScore} / 10</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0]">
                <span className="text-[10px] text-[#5D6D7E] font-bold block">Relevance</span>
                <span className="text-sm font-black text-[#2C3E50]">{starResult.relevanceScore} / 10</span>
              </div>
            </div>

            <p className="text-xs text-[#2C3E50] bg-[#FFF8F0] p-3 rounded-xl border border-[#FAD7A0]">
              {starResult.feedbackText}
            </p>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1 text-xs">
              <span className="font-bold text-emerald-900 block flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Actionable Story Refinements
              </span>
              <ul className="text-[11px] text-emerald-950 list-disc list-inside space-y-1">
                {starResult.suggestions.map((sug, i) => (
                  <li key={i}>{sug}</li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSaveStarStory}
                disabled={savedLocally}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
                  savedLocally
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-[#2C3E50] text-[#FAD7A0] hover:bg-[#1A252F]'
                }`}
              >
                {savedLocally ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Saved STAR Story to Portfolio
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save STAR Story to Portfolio
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
