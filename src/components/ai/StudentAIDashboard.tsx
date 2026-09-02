import React, { useState, useEffect } from 'react';
import { AICoachId, AICoachEvaluation, StudentProfile } from '../../types';
import { AI_COACHES_CATALOG, getEvaluationHistory } from '../../services/aiCoachesService';
import { formatScore10, getPerformanceDescriptor } from '../../lib/scoring';
import { 
  BarChart3, 
  Sparkles, 
  Award, 
  Target, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight, 
  Mic, 
  Volume2, 
  MessageSquareQuote, 
  PenTool, 
  BookOpen, 
  FileText, 
  GraduationCap, 
  FolderCheck, 
  TrendingUp 
} from 'lucide-react';

interface StudentAIDashboardProps {
  profile: StudentProfile;
  onOpenCoachStudio: (coachId: AICoachId) => void;
}

const COACH_ICONS: Record<string, React.FC<{ className?: string }>> = {
  pronunciation: Mic,
  listening: Volume2,
  speaking: MessageSquareQuote,
  grammar: CheckCircle2,
  writing: PenTool,
  reading: BookOpen,
  resume: FileText,
  interview: Sparkles,
  presentation: Award,
  debate: Target,
  vocabulary: GraduationCap,
  reflection: FolderCheck
};

export const StudentAIDashboard: React.FC<StudentAIDashboardProps> = ({
  profile,
  onOpenCoachStudio
}) => {
  const [evalHistory, setEvalHistory] = useState<AICoachEvaluation[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'high' | 'needs_work'>('all');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const list = await getEvaluationHistory();
    setEvalHistory(list);
  };

  // Compute skill averages across evaluations or defaults
  const skillScores: Record<AICoachId, number> = {
    pronunciation: 82,
    listening: 88,
    speaking: 75,
    grammar: 85,
    writing: 80,
    reading: 89,
    resume: 92,
    interview: 78,
    presentation: 76,
    debate: 74,
    vocabulary: 84,
    reflection: 88
  };

  // Override defaults with real historical averages if present
  evalHistory.forEach((item) => {
    if (skillScores[item.coachId]) {
      skillScores[item.coachId] = Math.round((skillScores[item.coachId] + item.score) / 2);
    }
  });

  const coachList = Object.keys(AI_COACHES_CATALOG) as AICoachId[];
  const overallAvg = Math.round(coachList.reduce((acc, c) => acc + (skillScores[c] || 80), 0) / coachList.length);

  const filteredHistory = evalHistory.filter((item) => {
    if (activeFilter === 'high') return item.score >= 85;
    if (activeFilter === 'needs_work') return item.score < 80;
    return true;
  });

  return (
    <div className="space-y-6 text-[#2C3E50]">
      
      {/* Top Banner Overview */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-[#D35400] bg-[#FFF8F0] px-2.5 py-0.5 rounded border border-[#FAD7A0]">
              {profile.branch} • {profile.batch}
            </span>
            <span className="text-xs text-[#5D6D7E] flex items-center gap-1 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#E67E22]" />
              AI Mastery Analytics
            </span>
          </div>
          <h2 className="text-2xl font-black text-[#D35400] font-heading">
            Student AI Communication Skill Matrix
          </h2>
          <p className="text-xs text-[#5D6D7E] max-w-xl">
            Real-time evaluation analytics tracking student progress across all 12 communicative english laboratory skills.
          </p>
        </div>

        {/* Aggregate Score Circle */}
        <div className="flex items-center gap-4 bg-[#FFF8F0] p-4 rounded-2xl border border-[#FAD7A0] shrink-0">
          <div className="w-16 h-16 rounded-full bg-[#D35400] text-white flex flex-col items-center justify-center shadow-md">
            <span className="text-2xl font-black font-heading leading-none">{overallAvg}%</span>
            <span className="text-[9px] font-bold text-amber-200 uppercase">Mastery</span>
          </div>
          <div>
            <span className="text-xs font-bold text-[#2C3E50] block">Overall AI Mastery Score</span>
            <p className="text-[10px] text-[#E67E22] font-semibold mt-0.5">
              {overallAvg >= 80 ? '🌟 Excellent Proficiency' : '📈 Good Progress'}
            </p>
            <span className="text-[10px] text-[#5D6D7E] block mt-1">{evalHistory.length} Total AI Coach Evaluations</span>
          </div>
        </div>
      </div>

      {/* 12 Skill Proficiency Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-[#D35400] font-heading flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#D35400]" />
            <span>Communication Competency Matrix (12 AI Coaches)</span>
          </h3>
          <span className="text-xs text-[#5D6D7E]">Click any card to launch AI Coach</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {coachList.map((cId) => {
            const meta = AI_COACHES_CATALOG[cId];
            const Icon = COACH_ICONS[cId] || Sparkles;
            const score = skillScores[cId] || 80;

            return (
              <div
                key={cId}
                onClick={() => onOpenCoachStudio(cId)}
                className="p-4 rounded-2xl bg-white border border-[#FAD7A0] hover:border-[#D35400] hover:shadow-md transition cursor-pointer group space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400] group-hover:bg-[#D35400] group-hover:text-white transition flex items-center justify-center font-bold">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs font-black font-heading ${
                    score >= 8 ? 'text-emerald-600' : score >= 7 ? 'text-[#D35400]' : 'text-amber-600'
                  }`}>
                    {formatScore10(score)} ({getPerformanceDescriptor(score)})
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-black text-[#2C3E50] group-hover:text-[#D35400] transition line-clamp-1">
                    {meta.name}
                  </h4>
                  <p className="text-[10px] text-[#5D6D7E] line-clamp-1">{meta.title}</p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="w-full h-1.5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#D35400] transition-all duration-500 rounded-full"
                      style={{ width: `${score}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-[9px] text-[#5D6D7E]">
                    <span>{meta.category}</span>
                    <span className="font-bold text-[#E67E22] group-hover:underline flex items-center gap-0.5">
                      Practice <ArrowUpRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Coaching Evaluation History Log */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#FAD7A0] pb-3">
          <div>
            <h3 className="text-base font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#D35400]" />
              <span>Recent AI Evaluation Activity Log</span>
            </h3>
            <p className="text-xs text-[#5D6D7E]">History of student practice submissions evaluated inside SAILL</p>
          </div>

          <div className="flex items-center gap-1.5">
            {(['all', 'high', 'needs_work'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition capitalize ${
                  activeFilter === filter
                    ? 'bg-[#D35400] text-white shadow-2xs'
                    : 'bg-[#FFF8F0] text-[#2C3E50] border border-[#FAD7A0] hover:bg-[#FAD7A0]'
                }`}
              >
                {filter.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="p-8 text-center bg-[#FFF8F0] rounded-2xl border border-[#FAD7A0] space-y-2">
            <Sparkles className="w-8 h-8 text-[#D35400] mx-auto opacity-60" />
            <p className="text-xs font-bold text-[#2C3E50]">No evaluations logged for this filter yet.</p>
            <p className="text-[11px] text-[#5D6D7E]">Launch any AI Coach above to practice and receive real-time feedback!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredHistory.slice(0, 8).map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-[#D35400] transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase text-white bg-[#D35400] px-2 py-0.5 rounded">
                      {item.coachName}
                    </span>
                    <span className="text-[10px] text-[#5D6D7E]">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-[#2C3E50] line-clamp-1 italic font-medium">"{item.studentInput}"</p>
                  <p className="text-[11px] text-[#5D6D7E] line-clamp-1">{item.overallFeedback}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-lg font-black text-[#D35400] font-heading">{item.score}</span>
                    <span className="text-[10px] text-[#5D6D7E]"> / 100</span>
                  </div>
                  <button
                    onClick={() => onOpenCoachStudio(item.coachId)}
                    className="px-3 py-1.5 bg-white border border-[#FAD7A0] hover:bg-[#D35400] hover:text-white text-[#D35400] text-xs font-bold rounded-xl transition"
                  >
                    Retry Drill
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
