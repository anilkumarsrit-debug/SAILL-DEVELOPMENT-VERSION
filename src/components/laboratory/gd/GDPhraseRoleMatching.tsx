import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  Award,
  ArrowRight,
  RotateCcw,
  Sparkles,
  HelpCircle,
  BookOpen,
  MessageSquare,
  ShieldCheck,
  Check,
  ListOrdered
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { dbStorage } from '../../../lib/db';

interface RoleCategory {
  id: string;
  role: string;
  badgeColor: string;
  definition: string;
  targetPhraseId: string;
}

interface PhraseItem {
  id: string;
  text: string;
  roleId: string;
  explanation: string;
}

interface SituationItem {
  id: string;
  scenario: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    feedback: string;
  }[];
}

const ROLES_DATA: RoleCategory[] = [
  {
    id: 'initiator',
    role: 'Initiator',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    definition: 'Opens the discussion, frames the topic scope, and invites group participation.',
    targetPhraseId: 'p-init'
  },
  {
    id: 'supporting',
    role: 'Supporting Participant',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    definition: 'Validates a peer\'s argument with evidence, consensus, and positive reinforcement.',
    targetPhraseId: 'p-supp'
  },
  {
    id: 'contributor',
    role: 'Idea Contributor',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    definition: 'Introduces new technical data points, dimensions, or creative solutions.',
    targetPhraseId: 'p-cont'
  },
  {
    id: 'disagreer',
    role: 'Polite Disagreer',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    definition: 'Presents an opposing viewpoint diplomatically without aggression or confrontation.',
    targetPhraseId: 'p-dis'
  },
  {
    id: 'expander',
    role: 'Perspective Expander',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    definition: 'Broadens the analysis into ethical, social, financial, or user-centric dimensions.',
    targetPhraseId: 'p-exp'
  },
  {
    id: 'mediator',
    role: 'Mediator',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
    definition: 'De-escalates friction and bridges divergent viewpoints into mutual middle ground.',
    targetPhraseId: 'p-med'
  },
  {
    id: 'redirector',
    role: 'Discussion Redirector',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-200',
    definition: 'Politely steers the conversation away from tangents back to the primary agenda.',
    targetPhraseId: 'p-red'
  },
  {
    id: 'summariser',
    role: 'Summariser',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    definition: 'Consolidates multi-faceted discussions into a structured midway or periodic recap.',
    targetPhraseId: 'p-sum'
  },
  {
    id: 'concluder',
    role: 'Concluder',
    badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    definition: 'Formulates the group\'s final consensus, trade-offs, and actionable conclusions.',
    targetPhraseId: 'p-con'
  }
];

const PHRASES_DATA: PhraseItem[] = [
  {
    id: 'p-init',
    text: '"Good morning peers, let us begin the discussion by defining the core scope of today\'s topic before examining its specific dimensions..."',
    roleId: 'initiator',
    explanation: 'The Initiator establishes topic boundaries and invites group collaboration right from the beginning.'
  },
  {
    id: 'p-supp',
    text: '"I completely agree with the point raised by my peer regarding system scalability, and the empirical data strongly supports that view..."',
    roleId: 'supporting',
    explanation: 'A Supporting Participant validates a peer\'s argument with evidence and positive reinforcement.'
  },
  {
    id: 'p-cont',
    text: '"I would like to contribute another perspective regarding cloud infrastructure costs and automated telemetry monitoring..."',
    roleId: 'contributor',
    explanation: 'An Idea Contributor introduces fresh technical data, angles, or practical considerations.'
  },
  {
    id: 'p-dis',
    text: '"I understand your point regarding cost reduction, but I see the issue differently because of operational safety constraints..."',
    roleId: 'disagreer',
    explanation: 'A Polite Disagreer uses respectful phrasing ("I understand... but I see it differently...") to challenge an argument diplomatically.'
  },
  {
    id: 'p-exp',
    text: '"Could we also consider this issue from the perspective of rural end-users who have limited network bandwidth?"',
    roleId: 'expander',
    explanation: 'A Perspective Expander widens the discussion into ethical, user-centric, or social impact dimensions.'
  },
  {
    id: 'p-med',
    text: '"We seem to have two different viewpoints here on deployment speed versus security auditing. Perhaps we can balance both with automated pipelines."',
    roleId: 'mediator',
    explanation: 'A Mediator resolves conflict between opposing ideas and helps build mutual consensus.'
  },
  {
    id: 'p-red',
    text: '"While that personal anecdote is interesting, we are moving slightly away from the main issue. Could we return to our core discussion on algorithm fairness?"',
    roleId: 'redirector',
    explanation: 'A Discussion Redirector brings off-topic or tangential comments back to the central problem.'
  },
  {
    id: 'p-sum',
    text: '"To summarise the key points discussed so far across technical feasibility and economic viability..."',
    roleId: 'summariser',
    explanation: 'A Summariser synthesizes the conversation midway to consolidate key arguments.'
  },
  {
    id: 'p-con',
    text: '"Before our allocated time concludes, I would like to highlight our group\'s final consensus and recommended implementation roadmap..."',
    roleId: 'concluder',
    explanation: 'A Concluder synthesizes overall group findings into actionable final takeaways before time expires.'
  }
];

const SITUATIONS_DATA: SituationItem[] = [
  {
    id: 'sit-1',
    scenario: 'Two participants are disagreeing strongly, speaking over each other, and the discussion is becoming confrontational.',
    options: [
      {
        id: 'sit-1-a',
        text: 'Please stop shouting; neither of your arguments makes any logical sense.',
        isCorrect: false,
        feedback: 'Aggressive or dismissive language increases group tension and lowers communication scores.'
      },
      {
        id: 'sit-1-b',
        text: 'We seem to have two distinct viewpoints here. Let us examine the merits of both so we can find a balanced middle ground.',
        isCorrect: true,
        feedback: 'Mediating and acknowledging both sides de-escalates conflict and establishes psychological safety.'
      },
      {
        id: 'sit-1-c',
        text: 'I vote with whichever participant spoke louder and faster.',
        isCorrect: false,
        feedback: 'A GD is a collaborative assessment, not a popularity contest or volume competition.'
      },
      {
        id: 'sit-1-d',
        text: 'Let us completely abandon this topic since we cannot agree.',
        isCorrect: false,
        feedback: 'Abandoning the agenda shows an inability to work through complex engineering trade-offs.'
      }
    ]
  },
  {
    id: 'sit-2',
    scenario: 'The moderator introduces the topic, but no participant speaks, resulting in an awkward prolonged silence.',
    options: [
      {
        id: 'sit-2-a',
        text: 'Good morning everyone. I\'d like to initiate our discussion by framing the key opportunities and challenges before us today.',
        isCorrect: true,
        feedback: 'Taking the initiative to frame the scope displays leadership and collaborative readiness.'
      },
      {
        id: 'sit-2-b',
        text: 'Why is everyone silent? Someone else should speak first so I can critique them.',
        isCorrect: false,
        feedback: 'Calling out peers negatively damages group morale and reflects poor team dynamics.'
      },
      {
        id: 'sit-2-c',
        text: 'I will now speak for the entire 10 minutes so no one else has to talk.',
        isCorrect: false,
        feedback: 'Monopolizing the GD time is penalized heavily by evaluators.'
      },
      {
        id: 'sit-2-d',
        text: 'This topic is too difficult for our group, so we should ask for a replacement.',
        isCorrect: false,
        feedback: 'Asking to change the topic reflects lack of adaptability and preparation.'
      }
    ]
  },
  {
    id: 'sit-3',
    scenario: 'A quiet participant has not contributed for several minutes despite having relevant domain knowledge.',
    options: [
      {
        id: 'sit-3-a',
        text: 'You have been completely silent, so you will receive zero marks from the evaluator.',
        isCorrect: false,
        feedback: 'Publicly shaming peers violates GD etiquette and harms teamwork scores.'
      },
      {
        id: 'sit-3-b',
        text: 'We haven\'t heard your perspective yet on the software architecture aspect. Would you like to share your thoughts?',
        isCorrect: true,
        feedback: 'Actively inviting quieter members to speak displays inclusive leadership and emotional intelligence.'
      },
      {
        id: 'sit-3-c',
        text: 'Since one member is quiet, the rest of us will use their speaking time for ourselves.',
        isCorrect: false,
        feedback: 'Ignoring quiet peers overlooks valuable collective input.'
      },
      {
        id: 'sit-3-d',
        text: 'Moderator, please force this candidate to speak right now.',
        isCorrect: false,
        feedback: 'Participants must manage group dynamics themselves rather than appealing to the moderator.'
      }
    ]
  },
  {
    id: 'sit-4',
    scenario: 'A participant starts discussing unrelated personal stories, moving far away from the core technical topic.',
    options: [
      {
        id: 'sit-4-a',
        text: 'Your personal story is completely useless and wasting our time.',
        isCorrect: false,
        feedback: 'Blunt insults violate professional courtesy.'
      },
      {
        id: 'sit-4-b',
        text: 'That is an interesting observation, but to ensure we cover our primary agenda within our time limit, could we return to the core question of scalability?',
        isCorrect: true,
        feedback: 'Polite redirection acknowledges the speaker briefly while firmly guiding the discussion back to the agenda.'
      },
      {
        id: 'sit-4-c',
        text: 'Let us all start sharing personal stories as well.',
        isCorrect: false,
        feedback: 'Drifting off-topic as a whole group results in poor performance scores for everyone.'
      },
      {
        id: 'sit-4-d',
        text: 'Interrupt them loudly and shout the original topic name.',
        isCorrect: false,
        feedback: 'Aggressive interruption is unacceptable in professional GDs.'
      }
    ]
  },
  {
    id: 'sit-5',
    scenario: 'Another participant abruptly cuts you off mid-sentence while you are presenting an important statistical finding.',
    options: [
      {
        id: 'sit-5-a',
        text: 'Raise your voice and shout louder until they back down.',
        isCorrect: false,
        feedback: 'Shouting matches in GDs lead to negative marks for both participants.'
      },
      {
        id: 'sit-5-b',
        text: 'Could I please complete my point on system reliability before we move to the next topic?',
        isCorrect: true,
        feedback: 'Assertive, polite boundary-setting allows you to retain your speaking turn without displaying hostility.'
      },
      {
        id: 'sit-5-c',
        text: 'Give up completely and stay silent for the rest of the session.',
        isCorrect: false,
        feedback: 'Passive withdrawal prevents you from demonstrating your communication competence.'
      },
      {
        id: 'sit-5-d',
        text: 'Complain directly to the evaluator mid-discussion.',
        isCorrect: false,
        feedback: 'The moderator observes group autonomy; handle conversational turns among peers.'
      }
    ]
  },
  {
    id: 'sit-6',
    scenario: 'A peer presents a strong argument regarding cost optimization, but completely overlooks data security risks.',
    options: [
      {
        id: 'sit-6-a',
        text: 'Your cost analysis is completely flawed and shows you don\'t understand technology.',
        isCorrect: false,
        feedback: 'Attacking the person rather than addressing the idea damages professional rapport.'
      },
      {
        id: 'sit-6-b',
        text: 'I appreciate the focus on cost efficiency; however, if we examine data compliance and cybersecurity mandates, we must also factor in risk mitigation.',
        isCorrect: true,
        feedback: 'Diplomatic rebuttal ("I appreciate X; however, if we examine Y...") builds upon ideas constructively.'
      },
      {
        id: 'sit-6-c',
        text: 'Cost is completely irrelevant in engineering projects.',
        isCorrect: false,
        feedback: 'Dismissing financial realities demonstrates poor multi-dimensional thinking.'
      },
      {
        id: 'sit-6-d',
        text: 'Blindly agree with everything without bringing up security at all.',
        isCorrect: false,
        feedback: 'Failing to introduce critical missing perspectives prevents you from scoring as a contributor.'
      }
    ]
  },
  {
    id: 'sit-7',
    scenario: 'The 10-minute discussion has only 60 seconds remaining, and several divergent viewpoints have been explored.',
    options: [
      {
        id: 'sit-7-a',
        text: 'Let me introduce an entirely new 5-point theory right now.',
        isCorrect: false,
        feedback: 'Introducing new topics in the final minute disrupts group closure.'
      },
      {
        id: 'sit-7-b',
        text: 'As our time draws to a close, let us synthesize the key points we\'ve explored and present our group\'s consensus and recommendations.',
        isCorrect: true,
        feedback: 'A timely concluding summary pulls together divergent perspectives into unified, actionable recommendations.'
      },
      {
        id: 'sit-7-c',
        text: 'Let us take a vote on who won the debate.',
        isCorrect: false,
        feedback: 'A GD is a collaborative discussion, not a competitive debate with a single individual winner.'
      },
      {
        id: 'sit-7-d',
        text: 'There is no point in concluding because we did not agree on everything.',
        isCorrect: false,
        feedback: 'Even with divergent views, summarizing the agreed trade-offs displays strong analytical synthesis.'
      }
    ]
  }
];

interface GDPhraseRoleMatchingProps {
  onProceedToBrainstorming?: () => void;
  onActivityCompleted?: () => void;
}

export const GDPhraseRoleMatching: React.FC<GDPhraseRoleMatchingProps> = ({
  onProceedToBrainstorming,
  onActivityCompleted
}) => {
  // Part 1 State: Matches mapping phraseId -> roleId
  const [selectedMatches, setSelectedMatches] = useState<Record<string, string>>({});
  const [selectedPhraseId, setSelectedPhraseId] = useState<string | null>(null);

  // Part 2 State: Selected situation answers situationId -> optionId
  const [situationAnswers, setSituationAnswers] = useState<Record<string, string>>({});

  // Submission & Scoring State
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [matchingScore, setMatchingScore] = useState<number>(0);
  const [situationScore, setSituationScore] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [maxScore, setMaxScore] = useState<number>(16);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load prior submission if available
  useEffect(() => {
    loadSavedProgress();
  }, []);

  const loadSavedProgress = async () => {
    try {
      const items = await dbStorage.getPortfolioItems('group-discussion');
      const matchingRecord = items.find((i) => i.id === 'm4-act1-phrase-matching' || i.title.includes('Phrase & Role Matching'));
      if (matchingRecord && matchingRecord.score !== undefined) {
        setIsSubmitted(true);
        setIsCompleted(true);
        setTotalScore(matchingRecord.score);
      }
    } catch {
      // ignore
    }
  };

  // Part 1 Interaction: Select phrase then role
  const handleSelectPhrase = (phraseId: string) => {
    if (isSubmitted) return;
    setErrorMessage(null);
    setSelectedPhraseId(phraseId === selectedPhraseId ? null : phraseId);
  };

  const handleSelectRole = (roleId: string) => {
    if (isSubmitted) return;
    setErrorMessage(null);
    if (!selectedPhraseId) {
      setErrorMessage('Please select a GD phrase first, then click a role to pair them.');
      return;
    }

    // Assign match
    setSelectedMatches((prev) => ({
      ...prev,
      [selectedPhraseId]: roleId
    }));
    setSelectedPhraseId(null);
  };

  const handleRemoveMatch = (phraseId: string) => {
    if (isSubmitted) return;
    setSelectedMatches((prev) => {
      const copy = { ...prev };
      delete copy[phraseId];
      return copy;
    });
  };

  // Part 2 Interaction: Select situation option
  const handleSelectSituationOption = (sitId: string, optId: string) => {
    if (isSubmitted) return;
    setErrorMessage(null);
    setSituationAnswers((prev) => ({
      ...prev,
      [sitId]: optId
    }));
  };

  // Reset entire activity
  const handleReset = () => {
    setSelectedMatches({});
    setSelectedPhraseId(null);
    setSituationAnswers({});
    setIsSubmitted(false);
    setMatchingScore(0);
    setSituationScore(0);
    setTotalScore(0);
    setIsCompleted(false);
    setErrorMessage(null);
  };

  // Validate & Submit
  const handleSubmitMatching = async () => {
    setErrorMessage(null);

    // Check if all Part 1 phrases are matched
    const matchedCount = Object.keys(selectedMatches).length;
    if (matchedCount < PHRASES_DATA.length) {
      setErrorMessage(`Please pair all ${PHRASES_DATA.length} phrases with their corresponding participant roles in Part 1 (Currently matched: ${matchedCount}/${PHRASES_DATA.length}).`);
      return;
    }

    // Check if all Part 2 situations are answered
    const answeredSitCount = Object.keys(situationAnswers).length;
    if (answeredSitCount < SITUATIONS_DATA.length) {
      setErrorMessage(`Please answer all ${SITUATIONS_DATA.length} situational questions in Part 2 before submitting (Currently answered: ${answeredSitCount}/${SITUATIONS_DATA.length}).`);
      return;
    }

    // Calculate Part 1 Score (out of 9)
    let p1Correct = 0;
    PHRASES_DATA.forEach((p) => {
      if (selectedMatches[p.id] === p.roleId) {
        p1Correct++;
      }
    });

    // Calculate Part 2 Score (out of 7)
    let p2Correct = 0;
    SITUATIONS_DATA.forEach((sit) => {
      const chosenOptId = situationAnswers[sit.id];
      const opt = sit.options.find((o) => o.id === chosenOptId);
      if (opt && opt.isCorrect) {
        p2Correct++;
      }
    });

    const combinedTotal = p1Correct + p2Correct;
    const totalPossible = PHRASES_DATA.length + SITUATIONS_DATA.length; // 16

    setMatchingScore(p1Correct);
    setSituationScore(p2Correct);
    setTotalScore(combinedTotal);
    setMaxScore(totalPossible);
    setIsSubmitted(true);
    setIsCompleted(true);

    // Save to IndexedDB persistence
    setIsSaving(true);
    try {
      await dbStorage.savePortfolioItem({
        id: 'm4-act1-phrase-matching',
        moduleId: 'group-discussion',
        moduleTitle: 'Group Discussion Techniques',
        title: 'Module 4 • Activity 1: GD Phrase & Participant Role Matching',
        category: 'written',
        content: `GD Matching Activity Assessment:\n- Part 1 Role & Purpose Matches: ${p1Correct}/${PHRASES_DATA.length}\n- Part 2 Situational Decision Accuracy: ${p2Correct}/${SITUATIONS_DATA.length}\n- Total Accuracy: ${combinedTotal}/${totalPossible} (${Math.round((combinedTotal / totalPossible) * 100)}%)`,
        score: Math.round((combinedTotal / totalPossible) * 10 * 10) / 10,
        createdAt: new Date().toISOString()
      });

      confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
      if (onActivityCompleted) {
        onActivityCompleted();
      }
    } catch (err) {
      console.error('Failed saving matching score:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const getPerformanceBadge = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage >= 85) {
      return { label: 'Excellent Mastery (Distinction)', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    }
    if (percentage >= 65) {
      return { label: 'Good Competency (Proficient)', color: 'bg-amber-100 text-amber-800 border-amber-300' };
    }
    return { label: 'Needs Practice (Review Explanations)', color: 'bg-rose-100 text-rose-800 border-rose-300' };
  };

  return (
    <div className="srit-card p-6 bg-white border border-[#FAD7A0] rounded-2xl space-y-8 text-[#2C3E50]">
      {/* Activity Header */}
      <div className="border-b border-[#FAD7A0] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D35400] bg-[#FFF8F0] px-2.5 py-1 rounded-md border border-[#FAD7A0]">
              Activity 1 of 2
            </span>
            <h3 className="text-xl font-black text-[#2C3E50] font-heading">
              GD Phrase & Participant Role Matching
            </h3>
          </div>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Identify the right language, functional communicative purposes, and diplomatic interventions for different roles and situations in a Group Discussion.
          </p>
        </div>

        {isSubmitted && (
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-extrabold rounded-xl flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Activity Completed ✓</span>
            </span>
          </div>
        )}
      </div>

      {/* Learning Objectives Box */}
      <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-xs space-y-2">
        <h4 className="font-extrabold text-[#D35400] uppercase text-[11px] flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-[#D35400]" />
          <span>Core Communicative Objectives</span>
        </h4>
        <p className="text-gray-700 leading-relaxed">
          Master how participants structure spoken arguments in professional campus GDs: how to initiate clearly, validate peers with evidence, introduce technical viewpoints, disagree diplomatically without causing conflict, expand dimensions, mediate arguments, redirect tangents, summarise midway, and deliver an impactful final conclusion.
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-3.5 bg-rose-50 border border-rose-300 text-rose-800 rounded-xl text-xs font-bold flex items-center gap-2">
          <XCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* =================================================== */}
      {/* PART 1: GD PHRASE & ROLE PAIRING (9 ROLES)         */}
      {/* =================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-gray-200">
          <div>
            <h4 className="text-sm font-black text-[#2C3E50] uppercase tracking-wide flex items-center gap-2">
              <ListOrdered className="w-4 h-4 text-[#D35400]" />
              <span>Part 1: Match Spoken GD Phrases with Participant Roles</span>
            </h4>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Click a Spoken Phrase below, then click its corresponding Participant Role card to form a pair.
            </p>
          </div>
          <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg">
            Matched: {Object.keys(selectedMatches).length} / {PHRASES_DATA.length}
          </span>
        </div>

        {/* Instructions banner */}
        {!isSubmitted && (
          <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl text-[11px] text-blue-900 flex items-center justify-between">
            <span>
              {selectedPhraseId
                ? '👉 Now click the corresponding Participant Role on the right to lock in the match.'
                : '👉 Click any phrase on the left to begin pairing.'}
            </span>
            {selectedPhraseId && (
              <button
                onClick={() => setSelectedPhraseId(null)}
                className="text-xs text-blue-700 underline font-bold"
              >
                Cancel Selection
              </button>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Column A: Spoken Phrases */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#D35400]" />
              <span>Spoken GD Phrases</span>
            </h5>

            <div className="space-y-2.5">
              {PHRASES_DATA.map((p) => {
                const matchedRoleId = selectedMatches[p.id];
                const matchedRole = ROLES_DATA.find((r) => r.id === matchedRoleId);
                const isSelected = selectedPhraseId === p.id;
                const isCorrect = isSubmitted && matchedRoleId === p.roleId;
                const isWrong = isSubmitted && matchedRoleId && matchedRoleId !== p.roleId;

                return (
                  <div
                    key={p.id}
                    onClick={() => handleSelectPhrase(p.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer text-xs space-y-2 ${
                      isSelected
                        ? 'border-[#D35400] bg-[#FFF8F0] ring-2 ring-[#D35400]/30 shadow-xs'
                        : isCorrect
                        ? 'border-emerald-300 bg-emerald-50/50'
                        : isWrong
                        ? 'border-rose-300 bg-rose-50/50'
                        : matchedRole
                        ? 'border-indigo-200 bg-indigo-50/40'
                        : 'border-gray-200 bg-white hover:border-amber-300 hover:bg-[#FFF8F0]/30'
                    }`}
                  >
                    <p className="font-serif italic text-gray-800 leading-relaxed font-medium">
                      {p.text}
                    </p>

                    {/* Matched Role Tag */}
                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      {matchedRole ? (
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-gray-500">Paired Role:</span>
                          <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] border ${matchedRole.badgeColor}`}>
                            {matchedRole.role}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Not matched yet</span>
                      )}

                      {!isSubmitted && matchedRole && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveMatch(p.id);
                          }}
                          className="text-[10px] text-rose-600 hover:underline font-bold"
                        >
                          Unpair
                        </button>
                      )}

                      {/* Post-submission feedback */}
                      {isSubmitted && (
                        <div className="flex items-center gap-1 font-bold text-[11px]">
                          {isCorrect ? (
                            <span className="text-emerald-700 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Correct Match
                            </span>
                          ) : (
                            <span className="text-rose-700 flex items-center gap-1">
                              <XCircle className="w-3.5 h-3.5" /> Correct: {ROLES_DATA.find((r) => r.id === p.roleId)?.role}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Explanation if wrong */}
                    {isWrong && (
                      <p className="text-[11px] text-rose-800 bg-rose-100/60 p-2 rounded-md font-sans">
                        <strong>Rationale:</strong> {p.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column B: Participant Roles */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D35400]" />
              <span>Participant Roles & Functions</span>
            </h5>

            <div className="space-y-2.5">
              {ROLES_DATA.map((r) => {
                // Find how many phrases matched this role
                const matchedPhraseIds = Object.entries(selectedMatches)
                  .filter(([_, rId]) => rId === r.id)
                  .map(([pId]) => pId);

                return (
                  <div
                    key={r.id}
                    onClick={() => handleSelectRole(r.id)}
                    className={`p-3 rounded-xl border transition-all text-xs space-y-1.5 cursor-pointer ${
                      selectedPhraseId
                        ? 'hover:border-[#D35400] hover:bg-[#FFF8F0] border-gray-300'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-extrabold border ${r.badgeColor}`}>
                        {r.role}
                      </span>
                      {matchedPhraseIds.length > 0 && (
                        <span className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-bold">
                          {matchedPhraseIds.length} paired
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-600 leading-snug">
                      {r.definition}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* =================================================== */}
      {/* PART 2: SITUATION-BASED MATCHING (7 SCENARIOS)      */}
      {/* =================================================== */}
      <div className="space-y-5 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between pb-2 border-b border-gray-200">
          <div>
            <h4 className="text-sm font-black text-[#2C3E50] uppercase tracking-wide flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D35400]" />
              <span>Part 2: GD Situational Decision Scenarios</span>
            </h4>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Choose the most professional, diplomatic, and effective spoken intervention for each real-world GD scenario.
            </p>
          </div>
          <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg">
            Answered: {Object.keys(situationAnswers).length} / {SITUATIONS_DATA.length}
          </span>
        </div>

        <div className="space-y-4">
          {SITUATIONS_DATA.map((sit, sIdx) => {
            const chosenOptId = situationAnswers[sit.id];
            const isAnswered = !!chosenOptId;

            return (
              <div
                key={sit.id}
                className="p-4 bg-[#FFF8F0]/40 border border-[#FAD7A0]/70 rounded-xl space-y-3 text-xs"
              >
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#D35400] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {sIdx + 1}
                  </span>
                  <div>
                    <h5 className="font-bold text-[#2C3E50] text-xs">
                      Scenario {sIdx + 1}:
                    </h5>
                    <p className="text-gray-700 mt-0.5">{sit.scenario}</p>
                  </div>
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-7">
                  {sit.options.map((opt) => {
                    const isSelected = chosenOptId === opt.id;
                    const showCorrect = isSubmitted && opt.isCorrect;
                    const showWrong = isSubmitted && isSelected && !opt.isCorrect;

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectSituationOption(sit.id, opt.id)}
                        disabled={isSubmitted}
                        className={`p-3 rounded-xl border text-left text-xs transition-all flex flex-col justify-between cursor-pointer ${
                          showCorrect
                            ? 'border-emerald-400 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-300'
                            : showWrong
                            ? 'border-rose-400 bg-rose-50 text-rose-950'
                            : isSelected
                            ? 'border-[#D35400] bg-[#FFF8F0] font-bold text-[#2C3E50] shadow-xs'
                            : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] font-bold mt-0.5 shrink-0 ${
                            isSelected ? 'bg-[#D35400] text-white border-[#D35400]' : 'border-gray-300 text-gray-500'
                          }`}>
                            {opt.id.slice(-1).toUpperCase()}
                          </span>
                          <span className="leading-snug">{opt.text}</span>
                        </div>

                        {/* Post-submission rationale */}
                        {isSubmitted && isSelected && (
                          <div className={`mt-2 pt-1.5 border-t text-[11px] font-normal ${
                            opt.isCorrect ? 'border-emerald-200 text-emerald-800' : 'border-rose-200 text-rose-800'
                          }`}>
                            <strong>{opt.isCorrect ? '✓ Explanation:' : '✗ Correction:'}</strong> {opt.feedback}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =================================================== */}
      {/* SUBMISSION / EVALUATION SUMMARY                    */}
      {/* =================================================== */}
      {isSubmitted && (
        <div className="p-5 bg-gradient-to-r from-[#FFF8F0] via-white to-[#FFF8F0] border-2 border-[#D35400]/40 rounded-2xl space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#FAD7A0] pb-3">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D35400]">
                Assessment Results
              </span>
              <h4 className="text-lg font-black text-[#2C3E50] font-heading">
                Performance Evaluation Summary
              </h4>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[10px] text-gray-500 uppercase font-bold">Accuracy Score</p>
                <p className="text-2xl font-black text-[#D35400]">
                  {totalScore} / {maxScore} <span className="text-xs text-gray-600 font-normal">({Math.round((totalScore / maxScore) * 100)}%)</span>
                </p>
              </div>
              <span className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border ${getPerformanceBadge(totalScore, maxScore).color}`}>
                {getPerformanceBadge(totalScore, maxScore).label}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-white border border-gray-200 rounded-xl">
              <span className="text-gray-500 font-bold block text-[10px] uppercase">Part 1: Phrase & Role Pairing</span>
              <p className="text-base font-black text-[#2C3E50] mt-0.5">
                {matchingScore} / {PHRASES_DATA.length} Correct Matches
              </p>
              <p className="text-[11px] text-gray-600 mt-1">
                Evaluates your understanding of communicative purposes and linguistic markers in group settings.
              </p>
            </div>

            <div className="p-3 bg-white border border-gray-200 rounded-xl">
              <span className="text-gray-500 font-bold block text-[10px] uppercase">Part 2: Situational Decision Making</span>
              <p className="text-base font-black text-[#2C3E50] mt-0.5">
                {situationScore} / {SITUATIONS_DATA.length} Correct Decisions
              </p>
              <p className="text-[11px] text-gray-600 mt-1">
                Assesses your ability to apply diplomatic mediation, polite redirection, and inclusive interventions.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-gray-200">
        <div>
          {isSubmitted && (
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Matching Activity</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {!isSubmitted ? (
            <button
              onClick={handleSubmitMatching}
              disabled={isSaving}
              className="px-6 py-2.5 bg-[#D35400] hover:bg-[#E67E22] text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSaving ? 'Submitting & Saving...' : 'Submit & Evaluate Matching'}</span>
            </button>
          ) : (
            onProceedToBrainstorming && (
              <button
                onClick={onProceedToBrainstorming}
                className="px-6 py-2.5 bg-[#D35400] hover:bg-[#E67E22] text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <span>Proceed to Activity 2: GD Brainstorming & Point Builder</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};
