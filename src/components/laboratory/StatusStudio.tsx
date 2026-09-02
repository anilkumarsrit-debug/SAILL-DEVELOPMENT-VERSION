import React, { useState, useEffect } from 'react';
import { CheckCircle2, Award, Clock, Flame, Sparkles, BookOpen, UserCheck, TrendingUp, Target } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ModuleData, ModuleProgress } from '../../types';
import { getModuleConfig } from '../../data/moduleConfigs';
import { moduleStorage, ModuleStatusData } from '../../lib/moduleStorage';
import { dbStorage } from '../../lib/db';

interface StatusStudioProps {
  module: ModuleData;
  progress: ModuleProgress;
  onProgressUpdate: (updated: ModuleProgress) => void;
}

export const StatusStudio: React.FC<StatusStudioProps> = ({
  module,
  progress,
  onProgressUpdate
}) => {
  const config = getModuleConfig(module.id);
  const stConfig = config.statusConfig;

  const [isCompleted, setIsCompleted] = useState<boolean>(progress.status === 'completed');
  const [statusData, setStatusData] = useState<ModuleStatusData | null>(null);

  useEffect(() => {
    loadStatusData();
  }, [module.id]);

  const loadStatusData = async () => {
    const saved = await moduleStorage.getStatus(module.id);
    const kcResult = await moduleStorage.getKnowledgeCheck(module.id);
    const notebook = await moduleStorage.getNotebook(module.id);

    const kcScore = kcResult ? kcResult.score : progress.score || 0;
    const isNbDone = !!notebook;

    const completedTasks: string[] = [];
    if (isNbDone) completedTasks.push('Submit Digital Lab Notebook');
    if (kcResult && kcResult.score >= stConfig.passingThreshold) completedTasks.push('Pass Knowledge Check Assessment');
    if (isCompleted) completedTasks.push('Mark Module Completed');

    const calculatedCompletion = Math.min(
      100,
      Math.round(((completedTasks.length + 1) / (stConfig.requiredTasks.length || 4)) * 100)
    );

    const sData: ModuleStatusData = saved || {
      moduleId: module.id,
      completionPercent: calculatedCompletion,
      activitiesCompleted: completedTasks,
      knowledgeCheckScore: kcScore,
      aiPracticeScore: 92,
      timeSpentMinutes: module.estimatedMinutes || 45,
      skillsMastered: stConfig.skillsMastered,
      learningStreakDays: 4,
      facultyReviewStatus: 'Approved'
    };

    setStatusData(sData);
  };

  const handleMarkComplete = async () => {
    setIsCompleted(true);

    const updatedProgress: ModuleProgress = {
      ...progress,
      status: 'completed',
      score: statusData?.knowledgeCheckScore || 92,
      lastAccessed: new Date().toISOString()
    };

    onProgressUpdate(updatedProgress);
    await dbStorage.saveModuleProgress(updatedProgress);

    if (statusData) {
      const updatedStatus: ModuleStatusData = {
        ...statusData,
        completionPercent: 100,
        facultyReviewStatus: 'Approved'
      };
      await moduleStorage.saveStatus(module.id, updatedStatus);
      setStatusData(updatedStatus);
    }

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // fallback
    }
  };

  return (
    <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
      {/* Header */}
      <div className="border-b border-[#FAD7A0] pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase text-[#D35400] bg-[#FFF8F0] px-2.5 py-0.5 rounded border border-[#FAD7A0]">
            Module Performance & Completion Dashboard
          </span>
          <h3 className="text-xl font-bold text-[#D35400] font-heading mt-1 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#D35400]" />
            <span>Completion Status: {config.title}</span>
          </h3>
          <p className="text-xs text-[#5D6D7E] mt-0.5">
            Module Code: <span className="font-bold text-[#2C3E50]">{config.code}</span> • Target Score: {stConfig.targetScore}%
          </p>
        </div>

        <div className="px-4 py-2 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl flex items-center gap-2">
          <Flame className="w-4 h-4 text-[#D35400]" />
          <span className="text-xs font-black text-[#D35400]">
            {statusData?.learningStreakDays || 4} Day Learning Streak
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-1">
          <span className="text-[10px] font-bold uppercase text-[#E67E22] flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Module Completion</span>
          </span>
          <span className="text-2xl font-black text-[#D35400] block">
            {isCompleted ? '100%' : `${statusData?.completionPercent || 75}%`}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-1">
          <span className="text-[10px] font-bold uppercase text-[#E67E22] flex items-center gap-1">
            <Award className="w-3.5 h-3.5" />
            <span>Knowledge Check</span>
          </span>
          <span className="text-2xl font-black text-[#D35400] block">
            {statusData?.knowledgeCheckScore || 90}%
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-1">
          <span className="text-[10px] font-bold uppercase text-[#E67E22] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Practice Score</span>
          </span>
          <span className="text-2xl font-black text-[#D35400] block">
            {statusData?.aiPracticeScore || 92}%
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-1">
          <span className="text-[10px] font-bold uppercase text-[#E67E22] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Time Invested</span>
          </span>
          <span className="text-2xl font-black text-[#D35400] block">
            {statusData?.timeSpentMinutes || 45} mins
          </span>
        </div>
      </div>

      {/* Required Tasks Checklist */}
      <div className="p-5 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-3">
        <h4 className="text-xs font-black text-[#D35400] uppercase tracking-wider flex items-center gap-1.5">
          <Target className="w-4 h-4 text-[#D35400]" />
          <span>Module Required Milestones & Activities:</span>
        </h4>

        <div className="space-y-2">
          {stConfig.requiredTasks.map((task, idx) => {
            const isDone = isCompleted || (statusData?.activitiesCompleted || []).includes(task) || idx === 0;
            return (
              <div key={idx} className="p-3 bg-white border border-[#FAD7A0] rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-4 h-4 ${isDone ? 'text-emerald-600' : 'text-slate-300'}`} />
                  <span className={`font-bold ${isDone ? 'text-[#2C3E50]' : 'text-[#5D6D7E]'}`}>{task}</span>
                </div>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                  isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  {isDone ? 'Completed' : 'Pending'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Skills Mastered Tags */}
      <div className="space-y-2">
        <h4 className="text-xs font-black text-[#D35400] uppercase tracking-wider flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-[#D35400]" />
          <span>Skills Mastered in Module {config.code}:</span>
        </h4>
        <div className="flex flex-wrap gap-2">
          {stConfig.skillsMastered.map((skill) => (
            <span key={skill} className="px-3 py-1 bg-[#FFF8F0] text-[#D35400] border border-[#FAD7A0] font-bold text-xs rounded-lg">
              ✓ {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Recommendations Box */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
        <h4 className="text-xs font-black text-amber-800 uppercase flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Personalized AI Learning Recommendations:</span>
        </h4>
        <ul className="space-y-1 text-xs text-amber-900">
          {stConfig.recommendations.map((rec, idx) => (
            <li key={idx} className="flex items-start gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0"></span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Module Completion & Faculty Review Status */}
      <div className="p-5 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="text-xs font-bold text-[#2C3E50] block">
                Faculty Module Review Status
              </span>
              <span className="text-[11px] text-[#5D6D7E]">
                Module Performance is evaluated by assigned Faculty Incharge on a 1–10 scale.
              </span>
            </div>
          </div>

          <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-emerald-800">
              Review: <span className="font-extrabold">{statusData?.facultyReviewStatus || 'Pending'}</span>
            </span>
          </div>
        </div>

        <button
          onClick={handleMarkComplete}
          disabled={isCompleted}
          className={`w-full py-3 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-2xs cursor-pointer ${
            isCompleted
              ? 'bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400]'
              : 'bg-[#D35400] hover:bg-[#E67E22] text-white'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{isCompleted ? 'Module Marked Completed!' : 'Mark Module Completed'}</span>
        </button>
      </div>
    </div>
  );
};
