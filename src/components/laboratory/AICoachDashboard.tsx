import React from 'react';
import {
  Bot,
  Sparkles,
  Award,
  CheckCircle2,
  Target,
  Clock,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Compass,
  Star,
  Zap,
  Trophy,
  ShieldCheck,
  RotateCcw,
  Volume2
} from 'lucide-react';
import {
  AICoachGuidance,
  ProfileClassification,
  AchievementBadge
} from '../../types/aiCoach';

interface AICoachDashboardProps {
  guidance: AICoachGuidance;
  targetText?: string;
  onSelectPracticeWord?: (word: string) => void;
  onSelectNextActivity?: () => void;
  className?: string;
}

export const AICoachDashboard: React.FC<AICoachDashboardProps> = ({
  guidance,
  targetText = 'Communication',
  onSelectPracticeWord,
  onSelectNextActivity,
  className = ''
}) => {
  const {
    learningProfile,
    coachMessage,
    strengths,
    weakAreas,
    todayLearningPlan,
    smartRecommendations,
    estimatedPracticeTime,
    motivationalMessage,
    suggestedNextActivity,
    badges
  } = guidance;

  // Helper for Profile Classification Pills
  const getClassificationStyle = (status: ProfileClassification) => {
    switch (status) {
      case 'Excellent':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'Very Good':
        return 'bg-teal-100 text-teal-900 border-teal-300';
      case 'Good':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Needs Improvement':
      default:
        return 'bg-rose-100 text-rose-900 border-rose-300';
    }
  };

  // Helper icon renderer for achievement badges
  const renderBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Award':
        return <Award className="w-5 h-5" />;
      case 'Compass':
        return <Compass className="w-5 h-5" />;
      case 'Star':
        return <Star className="w-5 h-5" />;
      case 'Zap':
        return <Zap className="w-5 h-5" />;
      case 'Trophy':
      default:
        return <Trophy className="w-5 h-5" />;
    }
  };

  const profileSkillList = [
    { key: 'pronunciation', label: 'Pronunciation Accuracy', value: learningProfile.pronunciation },
    { key: 'wordStress', label: 'Word Stress & Accent', value: learningProfile.wordStress },
    { key: 'syllableAccuracy', label: 'Syllable Segmentation', value: learningProfile.syllableAccuracy },
    { key: 'vowelAccuracy', label: 'Vowel Sound Accuracy', value: learningProfile.vowelAccuracy },
    { key: 'consonantAccuracy', label: 'Consonant Sound Precision', value: learningProfile.consonantAccuracy },
    { key: 'fluency', label: 'Speech Fluency & Flow', value: learningProfile.fluency },
    { key: 'clarity', label: 'Intelligibility & Clarity', value: learningProfile.clarity },
    { key: 'speakingPace', label: 'Speaking Pace & Rhythm', value: learningProfile.speakingPace },
    { key: 'confidence', label: 'Vocal Confidence', value: learningProfile.confidence }
  ] as const;

  return (
    <div className={`space-y-6 animate-fadeIn ${className}`}>
      {/* HEADER COACH BANNER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#2C3E50] via-[#34495E] to-[#2C3E50] text-white shadow-md space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Bot className="w-48 h-48 text-[#FAD7A0]" />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#D35400] text-white rounded-2xl shadow-sm">
              <Bot className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-[#FAD7A0] text-[#2C3E50] text-[10px] font-black uppercase tracking-wider rounded-md font-mono">
                  Personalised AI Learning Coach
                </span>
                <span className="px-2.5 py-0.5 bg-white/20 text-white text-[10px] font-bold uppercase rounded-md font-mono">
                  SAILL Adaptive Engine
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black font-heading mt-1">
                Your Spoken English Learning Plan
              </h3>
            </div>
          </div>

          <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-right shrink-0">
            <span className="text-[10px] font-mono uppercase text-[#FAD7A0] block font-bold">Est. Daily Practice</span>
            <span className="text-sm font-black font-mono text-white">{estimatedPracticeTime || '10 minutes'}</span>
          </div>
        </div>

        {/* Coach Personal Message */}
        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2 relative z-10">
          <div className="flex items-center gap-2 text-[#FAD7A0] text-xs font-black uppercase font-heading tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>AI Coach Feedback for "{targetText}"</span>
          </div>
          <p className="text-sm sm:text-base font-semibold leading-relaxed text-gray-100">
            "{coachMessage}"
          </p>
        </div>
      </div>

      {/* STUDENT LEARNING PROFILE (9 SKILL AREAS) */}
      <div className="p-6 rounded-3xl bg-white border-2 border-[#FAD7A0] shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-3">
          <div>
            <h4 className="text-base font-black text-[#2C3E50] font-heading flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#D35400]" />
              <span>Student Spoken Skill Learning Profile</span>
            </h4>
            <p className="text-xs text-[#5D6D7E]">
              Evaluated across 9 core speech metrics classified by SAILL AI Engine.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[#D35400] bg-[#FFF8F0] px-3 py-1 rounded-xl border border-[#FAD7A0]">
            9 Core Metrics
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {profileSkillList.map((skill) => (
            <div
              key={skill.key}
              className="p-3.5 rounded-2xl bg-[#FFF8F0]/60 border border-[#FAD7A0] flex items-center justify-between gap-2 shadow-2xs hover:border-[#D35400] transition"
            >
              <span className="text-xs font-extrabold text-[#2C3E50]">{skill.label}</span>
              <span className={`px-2.5 py-1 text-[11px] font-black font-mono rounded-xl border ${getClassificationStyle(skill.value)}`}>
                {skill.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* TODAY'S LEARNING PLAN */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#FFF8F0] via-white to-[#FFF8F0] border-2 border-[#D35400] shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#D35400] text-white rounded-xl shadow-2xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-[#D35400] font-mono tracking-wider">
                Daily Adaptive Strategy
              </span>
              <h4 className="text-lg font-black text-[#2C3E50] font-heading">
                Today's Personalised Learning Plan
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold font-mono text-[#D35400] bg-white px-3 py-1 rounded-xl border border-[#FAD7A0]">
            <Clock className="w-3.5 h-3.5" />
            <span>{todayLearningPlan.estimatedPracticeTime}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Practice Focus & Rule */}
          <div className="p-4 rounded-2xl bg-white border border-[#FAD7A0] space-y-3">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#5D6D7E] uppercase font-mono block">Primary Practice Focus</span>
              <p className="text-sm font-black text-[#2C3E50] font-heading">{todayLearningPlan.practiceFocus}</p>
            </div>

            <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1">
              <span className="text-[10px] font-extrabold text-[#D35400] uppercase font-mono block flex items-center gap-1">
                <Target className="w-3.5 h-3.5" />
                <span>Recommended Phonetic Rule</span>
              </span>
              <p className="text-xs font-medium text-[#2C3E50] italic leading-relaxed">
                "{todayLearningPlan.recommendedRule}"
              </p>
            </div>
          </div>

          {/* Expected Outcome */}
          <div className="p-4 rounded-2xl bg-white border border-[#FAD7A0] flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#5D6D7E] uppercase font-mono block">Expected Learning Outcome</span>
              <p className="text-xs font-bold text-[#2C3E50] leading-relaxed">
                {todayLearningPlan.expectedLearningOutcome}
              </p>
            </div>

            <div className="pt-2 border-t border-[#FAD7A0]/50 flex items-center justify-between text-xs">
              <span className="font-mono text-[#5D6D7E] font-bold">Suggested Scope:</span>
              <span className="font-mono text-[#D35400] font-black">Multi-Syllable Words</span>
            </div>
          </div>
        </div>
      </div>

      {/* SMART RECOMMENDATIONS & STRENGTHS/WEAK AREAS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Smart Recommended Words (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white border-2 border-[#FAD7A0] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-3">
            <h4 className="text-sm font-black text-[#2C3E50] font-heading uppercase tracking-wider flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-[#D35400]" />
              <span>Smart Practice Recommendations</span>
            </h4>
            <span className="text-[11px] text-[#5D6D7E] font-mono font-bold">3-5 Tailored Words</span>
          </div>

          <p className="text-xs text-[#5D6D7E] leading-relaxed">
            These words are phonetically matched to target your specific weak areas and accelerate stress mastery:
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {smartRecommendations.map((word, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectPracticeWord?.(word)}
                className="px-4 py-2 bg-[#FFF8F0] hover:bg-[#D35400] hover:text-white border border-[#FAD7A0] text-[#2C3E50] font-mono text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-2xs group"
              >
                <span>{word}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D35400] group-hover:text-white transition" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Strengths vs Weak Areas (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white border-2 border-[#FAD7A0] shadow-sm space-y-4">
          <h4 className="text-sm font-black text-[#2C3E50] font-heading uppercase tracking-wider flex items-center gap-2 border-b border-[#FAD7A0] pb-3">
            <TrendingUp className="w-4 h-4 text-[#D35400]" />
            <span>Strengths & Focus Areas</span>
          </h4>

          <div className="space-y-3">
            {/* Strengths */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-emerald-800 font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Top Strengths</span>
              </span>
              <ul className="space-y-1 text-xs text-[#2C3E50]">
                {strengths.map((str, i) => (
                  <li key={i} className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg font-medium">
                    {str}
                  </li>
                ))}
              </ul>
            </div>

            {/* Weak Areas */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-amber-800 font-mono flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-amber-600" />
                <span>Refinement Targets</span>
              </span>
              <ul className="space-y-1 text-xs text-[#2C3E50]">
                {weakAreas.map((weak, i) => (
                  <li key={i} className="p-2 bg-amber-50 border border-amber-200 rounded-lg font-medium">
                    {weak}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* MOTIVATIONAL BANNER & NEXT ACTIVITY BUTTON */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#FFF8F0] via-white to-[#FFF8F0] border-2 border-[#FAD7A0] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <span className="text-[10px] font-black uppercase text-[#D35400] font-mono tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Coach Inspiration</span>
          </span>
          <p className="text-sm font-extrabold text-[#2C3E50] leading-relaxed">
            "{motivationalMessage}"
          </p>
          <span className="text-xs font-mono font-bold text-[#5D6D7E] block pt-1">
            Suggested Next Exercise: {suggestedNextActivity}
          </span>
        </div>

        {onSelectNextActivity && (
          <button
            type="button"
            onClick={onSelectNextActivity}
            className="px-6 py-3 bg-[#D35400] text-white hover:bg-[#E67E22] font-black text-xs rounded-xl transition flex items-center gap-2 shadow-2xs cursor-pointer shrink-0 self-stretch sm:self-auto justify-center"
          >
            <span>Proceed to Next Activity</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* NON-COMPETITIVE ACHIEVEMENT BADGES */}
      <div className="p-6 rounded-3xl bg-white border-2 border-[#FAD7A0] shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#FFF8F0] text-[#D35400] rounded-xl border border-[#FAD7A0]">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-black text-[#2C3E50] font-heading">
                Non-Competitive Achievement Badges
              </h4>
              <p className="text-xs text-[#5D6D7E]">
                Personal milestones unlocked through practice and effort.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-[#D35400] bg-[#FFF8F0] px-3 py-1 rounded-xl border border-[#FAD7A0]">
            {badges.filter((b) => b.unlocked).length} / {badges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border transition flex flex-col items-center text-center space-y-2 ${
                badge.unlocked
                  ? 'bg-gradient-to-b from-[#FFF8F0] to-white border-[#D35400] shadow-2xs'
                  : 'bg-gray-50 border-gray-200 opacity-60'
              }`}
            >
              <div
                className={`p-3 rounded-2xl border ${
                  badge.unlocked
                    ? 'bg-[#D35400] text-white border-[#E67E22] shadow-2xs'
                    : 'bg-gray-200 text-gray-500 border-gray-300'
                }`}
              >
                {renderBadgeIcon(badge.iconName)}
              </div>

              <div className="space-y-0.5">
                <span className="text-xs font-black text-[#2C3E50] font-heading block">
                  {badge.title}
                </span>
                <span className="text-[10px] font-bold font-mono text-[#D35400] block">
                  {badge.level} Badge
                </span>
                <p className="text-[10px] text-[#5D6D7E] leading-tight pt-1">
                  {badge.description}
                </p>
              </div>

              <span
                className={`mt-auto px-2 py-0.5 text-[9px] font-black font-mono uppercase rounded ${
                  badge.unlocked
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {badge.unlocked ? 'Unlocked' : 'Locked'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
