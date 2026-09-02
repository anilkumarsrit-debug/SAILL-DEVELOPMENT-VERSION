import { R26_MODULES } from '../data/modulesData';
import { ModuleData, StudentProfile } from '../types';

export interface FacultyModuleStat {
  module: ModuleData;
  completionPercentage: number;
  averageScore: number;
  studentsCompletedCount: number;
  studentsPendingCount: number;
  commonWeakAreas: string[];
}

export class FacultyModuleService {
  /**
   * Get all published SAILL modules
   */
  static getPublishedModules(): ModuleData[] {
    return R26_MODULES;
  }

  /**
   * Compute aggregate performance stats for a module across assigned students
   */
  static getModuleStatsForFaculty(
    module: ModuleData,
    assignedStudents: StudentProfile[],
    moduleIndex = 1
  ): FacultyModuleStat {
    const totalAssigned = assignedStudents.length || 1;

    // Deterministic computation based on student IDs and module ID
    let completedCount = 0;
    let totalScoreSum = 0;

    assignedStudents.forEach((st) => {
      // Mock deterministic calculation for preview/real data integration
      const seed = (st.rollNo.charCodeAt(st.rollNo.length - 1) || 5) + moduleIndex;
      const isCompleted = seed % 3 !== 0; // ~66% completed
      if (isCompleted) {
        completedCount++;
        const score = 75 + (seed * 3) % 25;
        totalScoreSum += score;
      }
    });

    const pendingCount = totalAssigned - completedCount;
    const completionPercentage = Math.round((completedCount / totalAssigned) * 100);
    const averageScore = completedCount > 0 ? Math.round(totalScoreSum / completedCount) : 0;

    // Common weak area placeholders tailored per module
    const weakAreasMap: Record<number, string[]> = {
      1: ['Word Stress Rule 5 (Suffixes)', 'Vowel neutralization in unstressed syllables', 'Initial consonants contrast'],
      2: ['Falling vs. Rising intonation on WH-questions', 'Thought group pausing in long sentences', 'Liaison & Speed modulation'],
      3: ['Active listening key-point extraction', 'Note-taking during multi-speaker dialogue', 'Main idea vs supporting detail identification'],
      4: ['Professional telephone etiquette phrases', 'Handling unexpected interruptions politely', 'Clear articulation of technical terms'],
      5: ['Structuring 2-minute impromptu speeches', 'Pacing and minimizing vocal fillers (um, ah)', 'Body language & eye contact cues'],
      6: ['Interview question opening STAR technique', 'Enunciating strengths with high confidence', 'Synthesizing technical experience succinctly']
    };

    return {
      module,
      completionPercentage,
      averageScore: averageScore || 82,
      studentsCompletedCount: completedCount,
      studentsPendingCount: pendingCount,
      commonWeakAreas: weakAreasMap[moduleIndex] || ['Pronunciation clarity', 'Intonation cadence']
    };
  }
}
