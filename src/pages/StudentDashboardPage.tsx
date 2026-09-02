import React, { useState, useEffect } from 'react';
import { Page, StudentProfile, ModuleProgress, RecordingItem, PortfolioItem } from '../types';
import { R26_MODULES } from '../data/modulesData';
import { useNotifications } from '../context/NotificationContext';
import { ModuleReleaseService } from '../services/ModuleReleaseService';
import { DayToDayEvaluationSection } from '../components/student/DayToDayEvaluationSection';
import {
  GraduationCap,
  Flame,
  Award,
  BookOpen,
  Play,
  CheckCircle2,
  Lock,
  Sparkles,
  Clock,
  ArrowRight,
  Bookmark,
  Target,
  Bot,
  Zap,
  TrendingUp,
  FileText,
  FolderCheck,
  PenTool,
  BookMarked,
  Bell,
  CheckSquare,
  Square,
  ChevronRight,
  Mic,
  Star,
  UserCheck,
  Building2,
  Layers,
  Check,
  AlertCircle,
  X
} from 'lucide-react';

interface StudentDashboardPageProps {
  profile: StudentProfile;
  progressMap: Record<string, ModuleProgress>;
  recordings: RecordingItem[];
  portfolioItems: PortfolioItem[];
  onNavigate: (page: Page) => void;
  onOpenModule: (moduleId: string) => void;
}

interface LearningGoal {
  id: string;
  title: string;
  estimatedTime: string;
  category: string;
  completed: boolean;
}

export const StudentDashboardPage: React.FC<StudentDashboardPageProps> = ({
  profile,
  progressMap,
  recordings,
  portfolioItems,
  onNavigate,
  onOpenModule
}) => {
  const { notifications, unreadCount, aiCoachMessages } = useNotifications();

  // Bookmarking state for modules
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({});

  // Daily learning goals state
  const [goals, setGoals] = useState<LearningGoal[]>([
    {
      id: 'g1',
      title: 'Practice 10 Words in Phonetics Lab',
      estimatedTime: '10 mins',
      category: 'Phonetics',
      completed: true
    },
    {
      id: 'g2',
      title: 'Complete Knowledge Check in Active Module',
      estimatedTime: '10 mins',
      category: 'Assessment',
      completed: true
    },
    {
      id: 'g3',
      title: 'Record Accent Activity for AI Evaluation',
      estimatedTime: '10 mins',
      category: 'Speaking',
      completed: false
    }
  ]);

  const toggleGoal = (id: string) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g))
    );
  };

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Time-based personalized greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const [releaseSync, setReleaseSync] = useState(0);

  useEffect(() => {
    if (profile) {
      ModuleReleaseService.syncWithIndexedDB(profile).then(() => {
        setReleaseSync((prev) => prev + 1);
      });
    }
  }, [profile]);

  // Toast notice state for locked module clicks
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  useEffect(() => {
    if (toastNotice) {
      const timer = setTimeout(() => setToastNotice(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastNotice]);

  // Find current active module for "Continue Learning"
  const completedCount = (Object.values(progressMap) as ModuleProgress[]).filter(
    (p) => p.status === 'completed'
  ).length;
  const totalModules = R26_MODULES.length;
  const overallPercentage = Math.round((completedCount / totalModules) * 100);

  // Filter released modules ONLY for active module selection
  const releasedModules = R26_MODULES.filter((m) =>
    m.id === 'pronunciation' || ModuleReleaseService.isModuleReleased(profile, m.id)
  );

  const inProgressModuleId = Object.keys(progressMap).find((id) => {
    const prog = progressMap[id];
    return prog && prog.status === 'in_progress' && (id === 'pronunciation' || ModuleReleaseService.isModuleReleased(profile, id));
  });

  const activeModule =
    (inProgressModuleId && releasedModules.find((m) => m.id === inProgressModuleId)) ||
    releasedModules.find((m) => {
      const prog = progressMap[m.id];
      return !prog || prog.status !== 'completed';
    }) ||
    releasedModules[0] ||
    R26_MODULES[0];

  const activeModProgress = progressMap[activeModule.id] || {
    status: 'not_started',
    completedTabs: [],
    score: 0
  };

  const noDemoModules = ['pronunciation', 'listening', 'spoken-english', 'group-discussion', 'public-speaking', 'professional-writing', 'professional-email'];
  const totalTabs = noDemoModules.includes(activeModule.id) ? 10 : 11;
  const completedTabsCount = (activeModProgress.completedTabs || []).filter(
    (t: string) => t !== 'record' && (!noDemoModules.includes(activeModule.id) || t !== 'demo')
  ).length;
  const activeCompletionPercent =
    activeModProgress.status === 'completed'
      ? 100
      : Math.min(100, Math.round((completedTabsCount / totalTabs) * 100));

  const estimatedMinutesLeft = Math.max(
    5,
    Math.round(activeModule.estimatedMinutes * (1 - activeCompletionPercent / 100))
  );

  const completedGoalsCount = goals.filter((g) => g.completed).length;

  return (
    <div className="space-y-8 pb-12 text-[#2C3E50]">
      {/* ==================================================== */}
      {/* 1. WELCOME SECTION (GREETING & STUDENT OVERVIEW)      */}
      {/* ==================================================== */}
      <div className="srit-card p-6 sm:p-7 bg-gradient-to-r from-white via-[#FFF8F0] to-white border border-[#FAD7A0] relative overflow-hidden shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-extrabold uppercase tracking-wider text-[#D35400] bg-[#FFF8F0] border border-[#FAD7A0] px-2.5 py-0.5 rounded-md">
                SRIT AI Language Laboratory
              </span>
              <span className="text-[#5D6D7E] font-medium">
                Autonomous Syllabus R26
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#2C3E50] font-heading">
              {getGreeting()}, {profile.name}!
            </h1>

            {/* Academic Student Metadata Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="px-2.5 py-1 bg-white border border-[#FAD7A0] rounded-lg font-mono font-bold text-[#D35400] shadow-2xs">
                Roll No: {profile.rollNo}
              </span>
              <span className="px-2.5 py-1 bg-white border border-[#FAD7A0] rounded-lg font-semibold text-[#2C3E50] shadow-2xs">
                Branch: <strong className="text-indigo-900">{profile.branch || profile.department || 'CSE'}</strong>
              </span>
              <span className="px-2.5 py-1 bg-white border border-[#FAD7A0] rounded-lg font-semibold text-[#2C3E50] shadow-2xs">
                Class: <strong className="text-emerald-800">{profile.semester || 'Semester I'} • Section {profile.section || 'A'}</strong>
              </span>
              <span className="px-2.5 py-1 bg-white border border-[#FAD7A0] rounded-lg font-semibold text-[#2C3E50] shadow-2xs flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-[#D35400]" />
                <span>Faculty Incharge:</span>
                <strong className="text-[#D35400]">
                  {profile.assignedFacultyName &&
                  !profile.assignedFacultyName.includes('No Faculty') &&
                  !profile.assignedFacultyName.includes('Not Assigned')
                    ? profile.assignedFacultyName
                    : 'Dr. V. Lakshmi'}
                </strong>
              </span>
            </div>
          </div>

          {/* Gamification & Progress Badges */}
          <div className="flex items-center gap-4 bg-white border border-[#FAD7A0] p-3.5 rounded-2xl shrink-0 shadow-2xs">
            <div className="text-center px-3">
              <span className="text-2xl font-black text-[#D35400] block">{profile.xp}</span>
              <span className="text-[10px] text-[#5D6D7E] font-extrabold uppercase tracking-wider">Total XP</span>
            </div>
            <div className="h-8 w-px bg-[#FAD7A0]"></div>
            <div className="text-center px-3">
              <span className="text-2xl font-black text-[#E67E22] flex items-center justify-center gap-0.5">
                <Flame className="w-5 h-5 text-[#E67E22] fill-current" />
                {profile.streakDays}
              </span>
              <span className="text-[10px] text-[#5D6D7E] font-extrabold uppercase tracking-wider">Day Streak</span>
            </div>
          </div>
        </div>

        {/* Global Syllabus Progress Bar */}
        <div className="mt-5 pt-4 border-t border-[#FAD7A0]/70">
          <div className="flex items-center justify-between text-xs font-extrabold mb-1.5">
            <span className="text-[#2C3E50] flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-[#D35400]" />
              <span>Overall Laboratory Progress</span>
            </span>
            <span className="text-[#D35400]">
              {completedCount} of {totalModules} Modules Completed ({overallPercentage}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-white rounded-full overflow-hidden border border-[#FAD7A0]">
            <div
              className="h-full bg-gradient-to-r from-[#D35400] to-[#E67E22] transition-all duration-500 rounded-full"
              style={{ width: `${overallPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 2. PRIMARY LEARNING HERO GRID (CONTINUE & GOALS)    */}
      {/* ==================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CONTINUE LEARNING (Primary Hero Action Card - 2 Columns) */}
        <div className="lg:col-span-2 srit-card p-6 sm:p-8 bg-white border-2 border-[#D35400] relative overflow-hidden shadow-md flex flex-col justify-between">
          <div className="absolute -right-12 -top-12 w-40 h-40 bg-[#FFF8F0] rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-[#D35400] text-white text-xs font-black uppercase tracking-widest rounded-md shadow-2xs">
                  Active Learning Focus
                </span>
                <span className="text-xs font-extrabold text-[#E67E22] bg-[#FFF8F0] border border-[#FAD7A0] px-2.5 py-0.5 rounded-md">
                  {activeModule.code}
                </span>
              </div>
              <span className="text-xs font-bold text-[#5D6D7E] flex items-center gap-1 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-lg">
                <Clock className="w-3.5 h-3.5 text-[#E67E22]" />
                Est. {estimatedMinutesLeft} mins remaining
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-[#2C3E50] font-heading">
                {activeModule.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#5D6D7E] line-clamp-2 leading-relaxed">
                {activeModule.shortDesc}
              </p>
            </div>

            {/* Current Activity Highlight */}
            <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-[#D35400] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 fill-[#D35400]" />
                  Current Activity Step:
                </span>
                <span className="font-bold text-[#2C3E50]">
                  {completedTabsCount + 1} of {totalTabs} Steps
                </span>
              </div>
              <p className="text-xs font-extrabold text-[#2C3E50]">
                {completedTabsCount === 0
                  ? 'Step 1: Module Overview & Objectives'
                  : completedTabsCount === 1
                  ? 'Step 2: Core Phonetic Concepts & Audio Practice'
                  : completedTabsCount === 2
                  ? 'Step 3: Interactive Practice & Exercises'
                  : completedTabsCount === 3
                  ? 'Step 4: Reflection & Self-Assessment'
                  : completedTabsCount === 4
                  ? 'Step 5: Voice Recording & AI Evaluation'
                  : completedTabsCount === 5
                  ? 'Step 6: Digital Portfolio Submission'
                  : 'Step 7: Final Knowledge Check & Certification'}
              </p>
            </div>

            {/* Module Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-extrabold">
                <span className="text-[#5D6D7E]">Module Completion</span>
                <span className="text-[#D35400]">{activeCompletionPercent}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden border border-[#FAD7A0]">
                <div
                  className="h-full bg-[#D35400] rounded-full transition-all duration-500"
                  style={{ width: `${activeCompletionPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Primary Call to Action Button */}
          <div className="pt-6 mt-6 border-t border-[#FAD7A0] flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-2 text-xs text-[#5D6D7E]">
              <Sparkles className="w-4 h-4 text-[#E67E22]" />
              <span>AI Speech Analytics & Voice Practice Ready</span>
            </div>

            <button
              onClick={() => onOpenModule(activeModule.id)}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#D35400] hover:bg-[#E67E22] text-white font-extrabold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-3 cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D35400]"
            >
              <span>Continue Learning</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* TODAY'S LEARNING GOAL CARD (1 Column) */}
        <div className="srit-card p-6 bg-white border border-[#FAD7A0] flex flex-col justify-between space-y-4 shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#FAD7A0]/70 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-[#D35400]">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#2C3E50] font-heading">
                    Today's Learning Goal
                  </h3>
                  <p className="text-[11px] text-[#5D6D7E]">Daily recommended lab quota</p>
                </div>
              </div>

              <span className="text-[10px] font-black uppercase tracking-wider bg-[#FFF8F0] text-[#D35400] border border-[#FAD7A0] px-2 py-0.5 rounded-sm">
                30 Mins Goal
              </span>
            </div>

            {/* Progress Summary */}
            <div className="flex items-center justify-between text-xs font-bold pt-1">
              <span className="text-[#5D6D7E]">Goal Progress</span>
              <span className="text-[#D35400]">
                {completedGoalsCount} of {goals.length} Completed
              </span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden border border-[#FAD7A0]">
              <div
                className="h-full bg-[#27AE60] rounded-full transition-all duration-300"
                style={{ width: `${(completedGoalsCount / goals.length) * 100}%` }}
              ></div>
            </div>

            {/* Checklist items */}
            <div className="space-y-2.5 pt-2">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    goal.completed
                      ? 'bg-green-50/60 border-green-200 text-green-900'
                      : 'bg-white border-gray-200 hover:border-[#D35400] text-[#2C3E50]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {goal.completed ? (
                      <CheckSquare className="w-4 h-4 text-green-600 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-400 shrink-0" />
                    )}
                    <span
                      className={`text-xs font-semibold ${
                        goal.completed ? 'line-through text-gray-500' : ''
                      }`}
                    >
                      {goal.title}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold text-gray-500 shrink-0 bg-white/80 px-1.5 py-0.5 rounded border border-gray-200">
                    {goal.estimatedTime}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#FAD7A0]/70 text-[11px] text-[#5D6D7E] flex items-center justify-between">
            <span>Keep your streak active!</span>
            <span className="font-extrabold text-[#D35400]">🔥 {profile.streakDays} Day Streak</span>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 3. AI COACH SUMMARY & NOTIFICATIONS GRID             */}
      {/* ==================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI COACH SUMMARY CARD (2 Columns) */}
        <div className="lg:col-span-2 bg-gradient-to-br from-[#2C3E50] via-[#34495E] to-[#1A252F] text-white p-6 sm:p-7 rounded-2xl shadow-md space-y-5 relative overflow-hidden select-none border-2 border-[#FAD7A0]/40">
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-[#D35400]/20 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-r from-[#D35400] to-[#E67E22] text-white rounded-xl shadow-md">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-lg font-serif tracking-wide text-[#FAD7A0]">
                    AI Speech Practice Coach
                  </h3>
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-200 border border-amber-400/30 text-[10px] font-bold rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    Interactive Diagnostic Guidance
                  </span>
                </div>
                <p className="text-xs text-gray-300">
                  Phonetics, intonation, and syllable cadence feedback for continuous improvement
                </p>
              </div>
            </div>
          </div>

          {/* AI Insights Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-xl space-y-2">
              <span className="text-[10px] font-extrabold text-[#FAD7A0] uppercase tracking-wider block">
                Today's Speech Focus
              </span>
              <p className="text-xs text-gray-200 leading-relaxed">
                Focus on vowel clarity and stress patterns in {activeModule.title} — practice syllable articulation in multi-syllable terms.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-xl space-y-2">
              <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-wider block">
                Practice Insight
              </span>
              <p className="text-xs text-gray-200 leading-relaxed">
                Regular daily practice drills in the speech lab significantly improve articulation precision, intonation cadence, and communicative confidence.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-xl flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-extrabold text-emerald-300 uppercase tracking-wider block">
                  Recommended Activity
                </span>
                <p className="text-xs text-gray-200 leading-relaxed mt-1">
                  Complete your audio recording and reflection journal for {activeModule.title}.
                </p>
              </div>

              <button
                onClick={() => onNavigate('practice')}
                className="w-full py-2 px-3 bg-[#D35400] hover:bg-[#E67E22] text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Open Practice Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Status Bar */}
          <div className="pt-2 flex items-center justify-between text-[11px] text-gray-300 border-t border-white/10">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>AI Speech Evaluation Engine Ready</span>
            </span>
            <span className="text-[10px] text-[#FAD7A0] font-semibold">Autonomous Laboratory Standard</span>
          </div>
        </div>

        {/* LATEST NOTIFICATIONS CARD (1 Column) */}
        <div className="srit-card p-6 bg-white border border-[#FAD7A0] flex flex-col justify-between space-y-4 shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#FAD7A0]/70 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-[#D35400]">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#2C3E50] font-heading">
                    Latest Notifications
                  </h3>
                  <p className="text-[11px] text-[#5D6D7E]">Lab updates & notices</p>
                </div>
              </div>

              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-red-100 text-red-700 font-extrabold text-[10px] rounded-full">
                  {unreadCount} Unread
                </span>
              )}
            </div>

            {/* Notification items */}
            <div className="space-y-2.5">
              {notifications.slice(0, 3).map((notif) => (
                <div
                  key={notif.id}
                  className="p-3 bg-[#FFF8F0]/60 border border-[#FAD7A0]/60 rounded-xl space-y-1 hover:border-[#D35400] transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#D35400] uppercase">
                      {notif.category}
                    </span>
                    <span className="text-[9px] text-gray-400">{notif.createdDate}</span>
                  </div>
                  <p className="text-xs font-bold text-[#2C3E50]">{notif.title}</p>
                  <p className="text-[11px] text-[#5D6D7E] line-clamp-2">{notif.message}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('announcements')}
            className="w-full py-2 bg-[#FFF8F0] hover:bg-[#FAD7A0] text-[#D35400] hover:text-[#2C3E50] font-bold text-xs rounded-xl border border-[#FAD7A0] transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>View All Notices</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 3.5 DAY-TO-DAY CONTINUOUS MODULE EVALUATION SECTION */}
      {/* ==================================================== */}
      <DayToDayEvaluationSection profile={profile} onOpenModule={onOpenModule} />

      {/* ==================================================== */}
      {/* 4. LEARNING JOURNEY (VISUAL MODULE PROGRESSION)     */}
      {/* ==================================================== */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-[#D35400] font-heading flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-[#D35400]" />
              <span>Learning Journey (R26 Module Progression)</span>
            </h2>
            <p className="text-xs text-[#5D6D7E]">
              Vertical roadmap showing completed, active, unlocked, and upcoming syllabus modules
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-[#5D6D7E] bg-white border border-[#FAD7A0] px-3 py-1.5 rounded-xl shadow-2xs">
            <span>Syllabus Status:</span>
            <span className="text-[#D35400] font-extrabold">{completedCount} Completed</span>
            <span className="text-gray-300">•</span>
            <span className="text-indigo-600 font-extrabold">{totalModules - completedCount} In Progress / Upcoming</span>
          </div>
        </div>

        {/* Timeline Roadmap Layout */}
        <div className="space-y-4 relative before:absolute before:inset-0 before:left-6 before:md:left-8 before:w-1 before:bg-[#FAD7A0] before:z-0">
          {R26_MODULES.map((mod, index) => {
            const accessInfo = ModuleReleaseService.getModuleAccessInfo(
              profile,
              mod.id,
              progressMap[mod.id]
            );

            const isLocked = !accessInfo.isAccessible;
            const isCompleted = accessInfo.state === 'COMPLETED';
            const isActiveModule = mod.id === activeModule.id && accessInfo.isAccessible;

            const modProgress = progressMap[mod.id] || {
              status: 'not_started',
              completedTabs: [],
              score: 0
            };
            const modTotalTabs = (mod.id === 'pronunciation' || mod.id === 'listening' || mod.id === 'spoken-english' || mod.id === 'group-discussion') ? 11 : 12;
            const completedTabsCount = modProgress.completedTabs?.length || 0;
            const completionPercent = isCompleted
              ? 100
              : isLocked
              ? 0
              : Math.min(100, Math.round((completedTabsCount / modTotalTabs) * 100));

            const handleModuleClick = (e: React.MouseEvent) => {
              e.preventDefault();
              e.stopPropagation();
              if (accessInfo.isAccessible) {
                onOpenModule(mod.id);
              } else {
                setToastNotice(`Module ${index + 1} (${mod.title}) is locked. Complete Module 1 and wait for Faculty release.`);
              }
            };

            return (
              <div
                key={mod.id}
                onClick={handleModuleClick}
                className={`relative z-10 pl-14 md:pl-16 transition-all ${
                  accessInfo.isAccessible ? 'cursor-pointer group' : 'cursor-not-allowed opacity-95'
                }`}
              >
                {/* Status Node Circle on Timeline */}
                <div
                  className={`absolute left-2 md:left-4 top-5 -translate-y-1/2 w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-black transition-transform group-hover:scale-105 shadow-sm ${
                    isCompleted
                      ? 'bg-[#27AE60] border-white text-white'
                      : isActiveModule
                      ? 'bg-[#D35400] border-white text-white ring-4 ring-[#D35400]/20'
                      : isLocked
                      ? 'bg-amber-100 border-amber-300 text-amber-800'
                      : 'bg-white border-[#FAD7A0] text-[#5D6D7E]'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : isLocked ? (
                    <Lock className="w-3.5 h-3.5 text-amber-700" />
                  ) : isActiveModule ? (
                    <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                {/* Module Card Container */}
                <div
                  className={`srit-card p-5 border-2 transition-all ${
                    isLocked
                      ? 'bg-amber-50/40 border-amber-200'
                      : isActiveModule
                      ? 'bg-white border-[#D35400] shadow-md'
                      : isCompleted
                      ? 'bg-white/90 border-green-200 hover:border-green-400'
                      : 'bg-white border-[#FAD7A0] hover:border-[#D35400]'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-[#FFF8F0] text-[#D35400] border border-[#FAD7A0] px-2 py-0.5 rounded-sm">
                          Module {index + 1}
                        </span>
                        <span className="text-[10px] font-bold text-[#5D6D7E]">
                          {mod.code}
                        </span>

                        {isLocked ? (
                          <span className="text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Lock className="w-3 h-3 text-amber-700" />
                            LOCKED — Faculty Release Required
                          </span>
                        ) : isCompleted ? (
                          <span className="text-[10px] font-extrabold bg-green-100 text-green-800 border border-green-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-green-600" />
                            Completed
                          </span>
                        ) : isActiveModule ? (
                          <span className="text-[10px] font-extrabold bg-[#D35400] text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Flame className="w-3 h-3 fill-white" />
                            Active Module
                          </span>
                        ) : (
                          <span className="text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                            Available
                          </span>
                        )}
                      </div>

                      <h3 className={`text-base font-extrabold ${isLocked ? 'text-gray-600' : 'text-[#2C3E50] group-hover:text-[#D35400]'} transition`}>
                        {mod.title}
                      </h3>

                      {isLocked ? (
                        <div className="mt-1.5 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                          <Lock className="w-4 h-4 text-amber-700 shrink-0" />
                          <span>Module locked. Complete Module 1 and wait for Faculty release.</span>
                        </div>
                      ) : (
                        <p className="text-xs text-[#5D6D7E] line-clamp-1">
                          {mod.shortDesc}
                        </p>
                      )}
                    </div>

                    {/* Progress Bar & Action Button */}
                    <div className="flex flex-col md:items-end justify-between gap-2 shrink-0 md:w-56">
                      <div className="w-full space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className="text-[#5D6D7E]">Progress</span>
                          <span className={isLocked ? 'text-gray-400' : 'text-[#D35400]'}>{completionPercent}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden border border-[#FAD7A0]">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isCompleted ? 'bg-[#27AE60]' : isLocked ? 'bg-gray-300' : 'bg-[#D35400]'
                            }`}
                            style={{ width: `${completionPercent}%` }}
                          ></div>
                        </div>
                      </div>

                      <button
                        onClick={handleModuleClick}
                        disabled={isLocked}
                        className={`w-full py-2 px-4 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-2xs ${
                          isLocked
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300'
                            : isActiveModule
                            ? 'bg-[#D35400] hover:bg-[#E67E22] text-white'
                            : isCompleted
                            ? 'bg-green-50 hover:bg-green-100 text-green-900 border border-green-300'
                            : 'bg-[#FFF8F0] hover:bg-[#FAD7A0] text-[#D35400] border border-[#FAD7A0]'
                        }`}
                      >
                        <span>
                          {isLocked
                            ? `Module ${index + 1} Locked`
                            : isCompleted
                            ? 'Review Lab'
                            : isActiveModule
                            ? 'Continue Lab'
                            : 'Start Module'}
                        </span>
                        {isLocked ? (
                          <Lock className="w-3.5 h-3.5 text-gray-500" />
                        ) : (
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================================================== */}
      {/* 5. RECENT PERFORMANCE & ACHIEVEMENTS                */}
      {/* ==================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* RECENT PERFORMANCE CARDS */}
        <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#FAD7A0]/70 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-[#D35400]">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#2C3E50] font-heading">
                  Recent Performance
                </h3>
                <p className="text-[11px] text-[#5D6D7E]">Continuous speech analytics metrics</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('progress')}
              className="text-xs font-extrabold text-[#D35400] hover:underline"
            >
              View Full Analytics
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Metric 1 */}
            <div className="p-3.5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-center space-y-1">
              <span className="text-[10px] font-extrabold text-[#5D6D7E] uppercase block">
                Pronunciation
              </span>
              <span className="text-2xl font-black text-[#D35400] block">88%</span>
              <span className="text-[10px] font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded">
                High Accuracy
              </span>
            </div>

            {/* Metric 2 */}
            <div className="p-3.5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-center space-y-1">
              <span className="text-[10px] font-extrabold text-[#5D6D7E] uppercase block">
                Vocabulary
              </span>
              <span className="text-2xl font-black text-[#E67E22] block">92%</span>
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded">
                Advanced
              </span>
            </div>

            {/* Metric 3 */}
            <div className="p-3.5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-center space-y-1">
              <span className="text-[10px] font-extrabold text-[#5D6D7E] uppercase block">
                Word Stress
              </span>
              <span className="text-2xl font-black text-[#27AE60] block">85%</span>
              <span className="text-[10px] font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded">
                Good Cadence
              </span>
            </div>
          </div>
        </div>

        {/* ACHIEVEMENTS CARDS */}
        <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#FAD7A0]/70 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-[#D35400]">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#2C3E50] font-heading">
                  Achievements & Badges
                </h3>
                <p className="text-[11px] text-[#5D6D7E]">Syllabus badges & milestones</p>
              </div>
            </div>
            <span className="text-xs font-extrabold text-[#D35400] bg-[#FFF8F0] px-2.5 py-0.5 rounded-full border border-[#FAD7A0]">
              3 Unlocked
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Badge 1 */}
            <div className="p-3 bg-white border border-[#FAD7A0] rounded-xl flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#D35400] flex items-center justify-center shrink-0">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-[#2C3E50]">First Recording</h4>
                <p className="text-[10px] text-green-700 font-bold">Awarded ✓</p>
              </div>
            </div>

            {/* Badge 2 */}
            <div className="p-3 bg-white border border-[#FAD7A0] rounded-xl flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-[#E67E22] flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5 fill-[#E67E22]" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-[#2C3E50]">7-Day Streak</h4>
                <p className="text-[10px] text-green-700 font-bold">Active 🔥</p>
              </div>
            </div>

            {/* Badge 3 */}
            <div className="p-3 bg-white border border-[#FAD7A0] rounded-xl flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-green-100 text-green-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-[#2C3E50]">Module Master</h4>
                <p className="text-[10px] text-green-700 font-bold">1 Completed</p>
              </div>
            </div>

            {/* Badge 4 */}
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-2.5 opacity-70">
              <div className="w-9 h-9 rounded-xl bg-gray-200 text-gray-500 flex items-center justify-center shrink-0">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#2C3E50]">Perfect Score</h4>
                <p className="text-[10px] text-gray-500 font-medium">In Progress (90%+ Target)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 6. QUICK ACCESS SHORTCUTS                            */}
      {/* ==================================================== */}
      <section className="space-y-4 pt-2">
        <h3 className="text-lg font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
          <BookMarked className="w-5 h-5 text-[#D35400]" />
          <span>Quick Access Shortcuts</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => onNavigate('practice')}
            className="srit-card p-5 cursor-pointer bg-white border border-[#FAD7A0] hover:border-[#D35400] transition group flex items-start gap-3 shadow-2xs"
          >
            <div className="p-3 rounded-xl bg-[#FFF8F0] text-[#D35400] group-hover:bg-[#D35400] group-hover:text-white transition">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-[#2C3E50] group-hover:text-[#D35400] transition">
                Laboratory Notebook
              </h4>
              <p className="text-[11px] text-[#5D6D7E] mt-0.5">
                Review phonetic transcriptions & notes
              </p>
            </div>
          </div>

          <div
            onClick={() => onNavigate('portfolio')}
            className="srit-card p-5 cursor-pointer bg-white border border-[#FAD7A0] hover:border-[#D35400] transition group flex items-start gap-3 shadow-2xs"
          >
            <div className="p-3 rounded-xl bg-[#FFF8F0] text-[#D35400] group-hover:bg-[#D35400] group-hover:text-white transition">
              <FolderCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-[#2C3E50] group-hover:text-[#D35400] transition">
                Digital Portfolio
              </h4>
              <p className="text-[11px] text-[#5D6D7E] mt-0.5">
                Certified recordings & rubric reviews
              </p>
            </div>
          </div>

          <div
            onClick={() => onNavigate('modules')}
            className="srit-card p-5 cursor-pointer bg-white border border-[#FAD7A0] hover:border-[#D35400] transition group flex items-start gap-3 shadow-2xs"
          >
            <div className="p-3 rounded-xl bg-[#FFF8F0] text-[#D35400] group-hover:bg-[#D35400] group-hover:text-white transition">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-[#2C3E50] group-hover:text-[#D35400] transition">
                Reflection & Self-Mark
              </h4>
              <p className="text-[11px] text-[#5D6D7E] mt-0.5">
                Log module reflections & self-scores
              </p>
            </div>
          </div>

          <div
            onClick={() => onNavigate('ai-engine')}
            className="srit-card p-5 cursor-pointer bg-white border border-[#FAD7A0] hover:border-[#D35400] transition group flex items-start gap-3 shadow-2xs"
          >
            <div className="p-3 rounded-xl bg-[#FFF8F0] text-[#D35400] group-hover:bg-[#D35400] group-hover:text-white transition">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-[#2C3E50] group-hover:text-[#D35400] transition">
                AI Learning Engine
              </h4>
              <p className="text-[11px] text-[#5D6D7E] mt-0.5">
                Real-time speech practice & feedback
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Locked Module Toast Notice */}
      {toastNotice && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-amber-900 text-white p-4 rounded-2xl shadow-2xl border-2 border-amber-400 flex items-start gap-3 animate-bounce">
          <AlertCircle className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-0.5">
            <h5 className="text-xs font-black uppercase tracking-wider text-amber-300">
              Access Locked
            </h5>
            <p className="text-xs font-medium leading-relaxed">{toastNotice}</p>
          </div>
          <button
            onClick={() => setToastNotice(null)}
            className="p-1 hover:bg-amber-800 rounded-lg text-amber-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentDashboardPage;
