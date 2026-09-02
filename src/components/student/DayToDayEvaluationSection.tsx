import React, { useState, useEffect } from 'react';
import { StudentProfile, FacultyModuleScore } from '../../types';
import { R26_MODULES } from '../../data/modulesData';
import { FacultyEvaluationService } from '../../services/FacultyEvaluationService';
import { EvaluationPdfService } from '../../services/EvaluationPdfService';
import {
  Award,
  Download,
  CheckCircle2,
  Clock,
  UserCheck,
  FileCheck2,
  Sparkles,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Info,
  Calendar,
  Layers
} from 'lucide-react';

interface DayToDayEvaluationSectionProps {
  profile: StudentProfile;
  onOpenModule?: (moduleId: string) => void;
}

export const DayToDayEvaluationSection: React.FC<DayToDayEvaluationSectionProps> = ({
  profile,
  onOpenModule
}) => {
  const [facultyScores, setFacultyScores] = useState<FacultyModuleScore[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const tenModules = R26_MODULES.slice(0, 10);

  useEffect(() => {
    loadScores();
  }, [profile.rollNo]);

  const loadScores = async () => {
    setLoading(true);
    try {
      const scores = await FacultyEvaluationService.getScoresForStudent(profile.rollNo);
      setFacultyScores(scores);
    } catch (err) {
      console.error('Error loading student faculty scores:', err);
    } finally {
      setLoading(false);
    }
  };

  const scoreMap = new Map<string, FacultyModuleScore>();
  facultyScores.forEach((s) => scoreMap.set(s.moduleId, s));

  // Compute Total Score (out of 100) and Average Score (Total ÷ 10)
  let totalFacultyScore = 0;
  let evaluatedCount = 0;

  tenModules.forEach((m) => {
    const s = scoreMap.get(m.id);
    if (s && typeof s.score === 'number') {
      totalFacultyScore += s.score;
      evaluatedCount++;
    }
  });

  const averageFacultyScore = Number((totalFacultyScore / 10).toFixed(2));
  const completionPercentage = Math.round((evaluatedCount / 10) * 100);

  const handleDownloadPdf = () => {
    EvaluationPdfService.generateStudentEvaluationPdf(profile, facultyScores);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <section className="srit-card p-6 sm:p-8 bg-white border-2 border-[#FAD7A0] rounded-2xl shadow-sm space-y-6">
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#FAD7A0]/60">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-[#D35400] rounded-full text-[11px] font-black uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>R26 Day-to-Day Continuous Evaluation</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#2C3E50] font-heading flex items-center gap-2">
            <span>Day-to-Day Module Evaluation</span>
          </h2>
          <p className="text-xs text-[#5D6D7E] mt-0.5 max-w-2xl">
            Official continuous laboratory assessment for all 10 syllabus modules evaluated directly by your assigned Faculty Incharge.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="px-4 py-2.5 bg-[#D35400] hover:bg-[#E67E22] text-white font-bold text-xs rounded-xl transition flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Evaluation Record (PDF)</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Day-to-Day Module Evaluation Record PDF generated and downloaded successfully!</span>
        </div>
      )}

      {/* TOP SUMMARY METRICS SCOREBOARD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TOTAL SCORE */}
        <div className="p-4 bg-gradient-to-br from-[#FFF8F0] to-white border border-[#FAD7A0] rounded-2xl shadow-2xs space-y-1">
          <span className="text-[10px] font-black text-[#5D6D7E] uppercase tracking-wider block">
            Total Score (All 10 Modules)
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-[#D35400] font-mono">{totalFacultyScore}</span>
            <span className="text-sm font-bold text-gray-400">/ 100</span>
          </div>
          <p className="text-[11px] text-[#5D6D7E] font-medium">
            Sum of module-wise faculty marks
          </p>
        </div>

        {/* AVERAGE SCORE */}
        <div className="p-4 bg-gradient-to-br from-emerald-50/50 to-white border border-emerald-200 rounded-2xl shadow-2xs space-y-1">
          <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider block">
            Average Score (Total ÷ 10)
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-emerald-700 font-mono">{averageFacultyScore}</span>
            <span className="text-sm font-bold text-gray-400">/ 10</span>
          </div>
          <p className="text-[11px] text-emerald-700 font-medium">
            Formula: {totalFacultyScore} ÷ 10 = {averageFacultyScore}
          </p>
        </div>

        {/* EVALUATED MODULES COUNT */}
        <div className="p-4 bg-gradient-to-br from-blue-50/50 to-white border border-blue-200 rounded-2xl shadow-2xs space-y-1">
          <span className="text-[10px] font-black text-blue-800 uppercase tracking-wider block">
            Evaluation Progress
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-blue-700 font-mono">{evaluatedCount}</span>
            <span className="text-sm font-bold text-gray-400">/ 10 Modules</span>
          </div>
          <div className="w-full bg-blue-100 h-1.5 rounded-full overflow-hidden mt-1">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* FACULTY INCHARGE */}
        <div className="p-4 bg-gradient-to-br from-indigo-50/50 to-white border border-indigo-200 rounded-2xl shadow-2xs space-y-1 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-black text-indigo-800 uppercase tracking-wider block">
              Faculty Evaluator
            </span>
            <h4 className="font-extrabold text-xs text-[#2C3E50] mt-0.5 truncate">
              {profile.assignedFacultyName || 'Dr. V. Lakshmi'}
            </h4>
            <p className="text-[10px] text-[#5D6D7E] truncate">
              Humanities & Sciences (English)
            </p>
          </div>
          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded-md w-fit flex items-center gap-1">
            <UserCheck className="w-3 h-3 text-indigo-600" />
            <span>Class Faculty Incharge</span>
          </span>
        </div>
      </div>

      {/* NOTICE REGARDING FACULTY SCORES */}
      <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl flex items-start gap-2.5 text-xs text-[#2C3E50]">
        <Info className="w-4 h-4 text-[#D35400] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-[#D35400] font-bold">Academic Assessment Standard:</strong> Only Faculty-assigned marks are recorded in the official Day-to-Day Continuous Evaluation Record. Automated AI speech metrics serve strictly as diagnostic lab practice guides.
        </div>
      </div>

      {/* MODULE-WISE SCORE GRID (ALL 10 MODULES) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-[#2C3E50] uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#D35400]" />
            <span>Module-Wise Faculty Scores (Module 1 – 10)</span>
          </h3>
          <span className="text-xs text-gray-500">
            Total Max Marks: <strong>100</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {tenModules.map((mod, index) => {
            const scoreRec = scoreMap.get(mod.id);
            const hasScore = scoreRec && typeof scoreRec.score === 'number';
            const score = hasScore ? scoreRec.score : null;
            const desc = hasScore ? FacultyEvaluationService.getScoreDescriptor(scoreRec.score) : null;

            return (
              <div
                key={mod.id}
                onClick={() => onOpenModule && onOpenModule(mod.id)}
                className={`p-4 rounded-xl border transition-all ${
                  hasScore
                    ? 'bg-white border-[#FAD7A0] hover:border-[#D35400] shadow-2xs'
                    : 'bg-gray-50/70 border-gray-200'
                } ${onOpenModule ? 'cursor-pointer group' : ''}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400] text-[10px] font-black rounded-sm uppercase tracking-wider">
                        Module {index + 1}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 font-mono">
                        {mod.code}
                      </span>
                    </div>

                    <h4 className={`text-xs font-bold ${hasScore ? 'text-[#2C3E50] group-hover:text-[#D35400]' : 'text-gray-600'} transition truncate`}>
                      {mod.title}
                    </h4>

                    {hasScore ? (
                      <div className="space-y-1 pt-1">
                        <p className="text-[11px] text-gray-600 line-clamp-1 italic">
                          "{scoreRec.remarks || 'Satisfactory lab execution & phonetics.'}"
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400">
                          <span>Evaluated by: <strong>{scoreRec.facultyName}</strong></span>
                          <span>•</span>
                          <span>{new Date(scoreRec.evaluatedAt).toLocaleDateString('en-IN')}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[11px] text-gray-400 italic pt-1">
                        Pending Faculty Evaluation
                      </p>
                    )}
                  </div>

                  {/* SCORE BADGE */}
                  <div className="shrink-0 text-right space-y-1">
                    <div
                      className={`px-3 py-1.5 rounded-xl border text-center font-mono ${
                        hasScore
                          ? 'bg-orange-50 border-[#D35400]/40 text-[#D35400]'
                          : 'bg-gray-100 border-gray-300 text-gray-400'
                      }`}
                    >
                      <span className="text-base font-black">
                        {hasScore ? `${score}` : '—'}
                      </span>
                      <span className="text-[10px] font-bold block text-gray-500">
                        / 10
                      </span>
                    </div>

                    {hasScore && desc && (
                      <span className={`inline-block text-[9px] font-extrabold px-1.5 py-0.5 rounded-sm border ${desc.badgeBg} ${desc.color}`}>
                        {desc.label}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CALCULATION FOOTNOTE */}
      <div className="pt-3 border-t border-[#FAD7A0]/60 flex flex-col sm:flex-row items-center justify-between text-xs text-[#5D6D7E] gap-2">
        <span>
          Current Academic Standing: <strong className="text-[#2C3E50]">{averageFacultyScore >= 8.5 ? 'Distinction' : averageFacultyScore >= 7 ? 'First Class' : averageFacultyScore >= 5 ? 'Pass' : 'In Progress'}</strong>
        </span>
        <span className="font-mono text-[11px]">
          Average Score = ({totalFacultyScore} / 10) = <strong>{averageFacultyScore} / 10</strong>
        </span>
      </div>
    </section>
  );
};
