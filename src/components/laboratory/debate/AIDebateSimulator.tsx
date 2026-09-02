import React, { useState } from 'react';
import { DEBATE_TOPICS, DebateTopic, evaluateSimulatorSession, SimulatorRubricEvaluation } from '../../../services/ai/debateCoach';
import { AudioRecorder } from '../../practice/AudioRecorder';
import { Play, Clock, Award, Sparkles, Send, CheckCircle2, ArrowRight, RefreshCw, Bot, Shield } from 'lucide-react';

interface AIDebateSimulatorProps {
  onSaveWork?: (title: string, content: string) => void;
  onSaveRecording?: (title: string, audioUrl: string) => void;
}

export const AIDebateSimulator: React.FC<AIDebateSimulatorProps> = ({
  onSaveWork,
  onSaveRecording
}) => {
  const [step, setStep] = useState<number>(1); // 1 to 9
  const [selectedTopic, setSelectedTopic] = useState<DebateTopic>(DEBATE_TOPICS[0]);
  const [position, setPosition] = useState<'Affirmative' | 'Negative'>('Affirmative');

  // Simulator steps inputs
  const [prepNotes, setPrepNotes] = useState<string>('');
  const [openingStatement, setOpeningStatement] = useState<string>('');
  const [aiOpponentArgument, setAiOpponentArgument] = useState<string>('');
  const [studentRebuttal, setStudentRebuttal] = useState<string>('');
  const [aiCounterargument, setAiCounterargument] = useState<string>('');
  const [studentClosingStatement, setStudentClosingStatement] = useState<string>('');

  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [finalEvaluation, setFinalEvaluation] = useState<SimulatorRubricEvaluation | null>(null);

  // Workflow steps:
  // Step 1: Choose Topic
  // Step 2: Choose Position
  // Step 3: Preparation Timer
  // Step 4: Opening Statement
  // Step 5: AI Opponent Argument
  // Step 6: Student Rebuttal
  // Step 7: AI Counterargument
  // Step 8: Student Closing Statement
  // Step 9: Final AI Evaluation

  const handleNextStep = () => {
    if (step === 4 && !openingStatement.trim()) {
      alert('Please enter or record your opening statement before proceeding.');
      return;
    }

    if (step === 4) {
      // Generate AI Opponent Argument
      setAiOpponentArgument(
        `While my opponent asserts that ${selectedTopic.motion.substring(0, 45)}... we must emphasize that implementing such restrictions imposes crippling compliance costs on developing engineering teams and overlooks existing technical safety protocols.`
      );
    }

    if (step === 6 && !studentRebuttal.trim()) {
      alert('Please enter or record your rebuttal speech before proceeding.');
      return;
    }

    if (step === 6) {
      // Generate AI Counterargument
      setAiCounterargument(
        `The student's rebuttal claims that safety protocols offset compliance costs. However, empirical statistics demonstrate that regulatory approval timelines delay critical product launches by an average of 14 months.`
      );
    }

    if (step === 8 && !studentClosingStatement.trim()) {
      alert('Please enter or record your student closing statement before completing the debate simulation.');
      return;
    }

    if (step === 8) {
      // Run final 10-rubric evaluation
      setIsEvaluating(true);
      evaluateSimulatorSession({
        topic: selectedTopic,
        position,
        prepNotes,
        openingStatement,
        aiOpponentArgument,
        studentRebuttal,
        aiCounterargument,
        studentClosingStatement
      }).then((res) => {
        setFinalEvaluation(res);
        setIsEvaluating(false);
        setStep(9);

        if (onSaveWork) {
          onSaveWork(
            `AI Debate Simulator [${position}]: ${selectedTopic.motion.substring(0, 30)}...`,
            JSON.stringify(
              {
                topic: selectedTopic.motion,
                position,
                openingStatement,
                studentRebuttal,
                studentClosingStatement,
                evaluation: res
              },
              null,
              2
            )
          );
        }
      });
      return;
    }

    setStep((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-[#D35400]">
            <Play className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-[#E67E22] uppercase tracking-wider">
              Module 10 • Section 7
            </span>
            <h2 className="text-xl font-bold text-[#D35400] font-heading">
              AI Debate Simulator (9-Step Interactive Arena)
            </h2>
          </div>
        </div>
        <p className="text-xs text-[#2C3E50] leading-relaxed">
          Engage in a live turn-based debate simulation against an adaptive AI Opponent. Experience real-time counter-arguments, deliver opening and rebuttal speeches, and receive a comprehensive 10-rubric SAILL evaluation.
        </p>
      </div>

      {/* Progress Workflow Tracker */}
      <div className="srit-card p-4 bg-[#FFF8F0] border border-[#FAD7A0] space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-[#D35400]">
          <span>Simulator Step {step} of 9</span>
          <span>{Math.round((step / 9) * 100)}% Complete</span>
        </div>
        <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-[#FAD7A0]">
          <div
            className="h-full bg-[#D35400] transition-all duration-300"
            style={{ width: `${(step / 9) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* STEP 1: CHOOSE TOPIC */}
      {step === 1 && (
        <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
          <h3 className="text-base font-bold text-[#D35400] font-heading">Step 1: Choose Debate Motion</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {DEBATE_TOPICS.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTopic(t)}
                className={`p-4 rounded-xl border text-left transition space-y-1 ${
                  selectedTopic.id === t.id
                    ? 'bg-[#FFF8F0] border-[#D35400] text-[#D35400] font-bold shadow-2xs'
                    : 'bg-white border-[#FAD7A0] text-[#2C3E50] hover:border-[#E67E22]'
                }`}
              >
                <span className="text-[10px] uppercase font-mono text-[#E67E22] block">{t.category}</span>
                <p className="text-xs">{t.motion}</p>
              </button>
            ))}
          </div>

          <button
            onClick={handleNextStep}
            className="w-full py-3 bg-[#D35400] hover:bg-[#E67E22] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2"
          >
            <span>Proceed to Step 2: Select Position</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 2: CHOOSE POSITION */}
      {step === 2 && (
        <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
          <h3 className="text-base font-bold text-[#D35400] font-heading">Step 2: Choose Position Stance</h3>
          <p className="text-xs text-[#5D6D7E]">Motion: "{selectedTopic.motion}"</p>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setPosition('Affirmative')}
              className={`p-5 rounded-2xl border text-center transition ${
                position === 'Affirmative'
                  ? 'bg-[#27AE60] text-white border-[#27AE60] font-bold shadow-xs'
                  : 'bg-white text-[#2C3E50] border-[#FAD7A0] hover:bg-[#FFF8F0]'
              }`}
            >
              <span className="text-lg block mb-1">👍</span>
              <span className="text-sm font-bold block">Affirmative</span>
              <span className="text-[11px] block opacity-90">Support the Motion</span>
            </button>

            <button
              onClick={() => setPosition('Negative')}
              className={`p-5 rounded-2xl border text-center transition ${
                position === 'Negative'
                  ? 'bg-[#C0392B] text-white border-[#C0392B] font-bold shadow-xs'
                  : 'bg-white text-[#2C3E50] border-[#FAD7A0] hover:bg-[#FFF8F0]'
              }`}
            >
              <span className="text-lg block mb-1">👎</span>
              <span className="text-sm font-bold block">Negative</span>
              <span className="text-[11px] block opacity-90">Oppose the Motion</span>
            </button>
          </div>

          <button
            onClick={handleNextStep}
            className="w-full py-3 bg-[#D35400] hover:bg-[#E67E22] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2"
          >
            <span>Proceed to Step 3: Preparation Scratchpad</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 3: PREPARATION */}
      {step === 3 && (
        <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
          <h3 className="text-base font-bold text-[#D35400] font-heading">Step 3: Preparation & Notes Scratchpad</h3>
          <p className="text-xs text-[#5D6D7E]">Draft your key Claim, Evidence, and Reasoning points before opening the speech.</p>

          <textarea
            rows={4}
            placeholder="Draft your main speech arguments here..."
            value={prepNotes}
            onChange={(e) => setPrepNotes(e.target.value)}
            className="w-full p-3 bg-white border border-[#FAD7A0] rounded-xl text-xs text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
          />

          <button
            onClick={handleNextStep}
            className="w-full py-3 bg-[#D35400] hover:bg-[#E67E22] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2"
          >
            <span>Proceed to Step 4: Deliver Opening Statement</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 4: OPENING STATEMENT */}
      {step === 4 && (
        <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
          <h3 className="text-base font-bold text-[#D35400] font-heading">Step 4: Deliver Opening Statement</h3>
          <textarea
            rows={4}
            placeholder={`Deliver your 2-minute ${position} opening statement...`}
            value={openingStatement}
            onChange={(e) => setOpeningStatement(e.target.value)}
            className="w-full p-3 bg-white border border-[#FAD7A0] rounded-xl text-xs text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
          />
          <AudioRecorder />

          <button
            onClick={handleNextStep}
            className="w-full py-3 bg-[#D35400] hover:bg-[#E67E22] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2"
          >
            <span>Submit Opening & Trigger AI Opponent Argument</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 5: AI OPPONENT ARGUMENT */}
      {step === 5 && (
        <div className="srit-card p-6 bg-[#FFF8F0] border border-[#FAD7A0] space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#C0392B]">
            <Bot className="w-5 h-5 text-[#C0392B]" />
            <span>Step 5: AI Opponent Counter-Speech Received</span>
          </div>

          <div className="p-4 bg-white border border-[#FAD7A0] rounded-xl text-xs font-serif italic text-[#2C3E50] leading-relaxed">
            "{aiOpponentArgument}"
          </div>

          <button
            onClick={handleNextStep}
            className="w-full py-3 bg-[#D35400] hover:bg-[#E67E22] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2"
          >
            <span>Proceed to Step 6: Deliver Student Rebuttal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 6: STUDENT REBUTTAL */}
      {step === 6 && (
        <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
          <h3 className="text-base font-bold text-[#D35400] font-heading">Step 6: Deliver Student Rebuttal Speech</h3>
          <textarea
            rows={4}
            placeholder="Directly refute the AI opponent's claim regarding compliance costs..."
            value={studentRebuttal}
            onChange={(e) => setStudentRebuttal(e.target.value)}
            className="w-full p-3 bg-white border border-[#FAD7A0] rounded-xl text-xs text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
          />
          <AudioRecorder />

          <button
            onClick={handleNextStep}
            className="w-full py-3 bg-[#D35400] hover:bg-[#E67E22] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2"
          >
            <span>Submit Rebuttal & Trigger AI Counterargument</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 7: AI COUNTERARGUMENT */}
      {step === 7 && (
        <div className="srit-card p-6 bg-[#FFF8F0] border border-[#FAD7A0] space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#C0392B]">
            <Bot className="w-5 h-5 text-[#C0392B]" />
            <span>Step 7: AI Counterargument Received</span>
          </div>

          <div className="p-4 bg-white border border-[#FAD7A0] rounded-xl text-xs font-serif italic text-[#2C3E50] leading-relaxed">
            "{aiCounterargument}"
          </div>

          <button
            onClick={handleNextStep}
            className="w-full py-3 bg-[#D35400] hover:bg-[#E67E22] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2"
          >
            <span>Proceed to Step 8: Deliver Student Closing Statement</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 8: CLOSING STATEMENT */}
      {step === 8 && (
        <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
          <h3 className="text-base font-bold text-[#D35400] font-heading">Step 8: Deliver Final Student Closing Statement</h3>
          <textarea
            rows={4}
            placeholder="Synthesize key impacts and deliver your final persuasive closing..."
            value={studentClosingStatement}
            onChange={(e) => setStudentClosingStatement(e.target.value)}
            className="w-full p-3 bg-white border border-[#FAD7A0] rounded-xl text-xs text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
          />

          <button
            onClick={handleNextStep}
            disabled={isEvaluating}
            className="w-full py-3 bg-[#D35400] hover:bg-[#E67E22] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isEvaluating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Evaluating 10 Debate Rubrics...</span>
              </>
            ) : (
              <>
                <Award className="w-4 h-4" />
                <span>Complete Simulator & Generate 10-Rubric Evaluation</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* STEP 9: FINAL EVALUATION */}
      {step === 9 && finalEvaluation && (
        <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-[#D35400]" />
              <h3 className="text-lg font-bold text-[#D35400] font-heading">
                Final AI Debate Simulator Evaluation (SAILL 10-Mark Framework)
              </h3>
            </div>
            <div className="text-right">
              <span className="text-2xl font-extrabold text-[#D35400]">{finalEvaluation.totalScore} / 10</span>
              <span className="text-xs text-[#5D6D7E] block">{finalEvaluation.descriptor}</span>
            </div>
          </div>

          {/* 10 Rubrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {Object.entries(finalEvaluation.rubrics).map(([key, val]) => (
              <div key={key} className="p-2.5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-center">
                <span className="text-[10px] font-bold text-[#5D6D7E] uppercase block">{key}</span>
                <span className="text-sm font-bold text-[#D35400]">{val} / 10</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-[#2C3E50] leading-relaxed p-3 bg-[#FFF8F0] rounded-xl border border-[#FAD7A0]">
            {finalEvaluation.overallFeedback}
          </p>

          <button
            onClick={() => {
              setStep(1);
              setFinalEvaluation(null);
            }}
            className="w-full py-2.5 bg-[#D35400] hover:bg-[#E67E22] text-white text-xs font-bold rounded-xl transition"
          >
            Start New Debate Simulation
          </button>
        </div>
      )}
    </div>
  );
};
