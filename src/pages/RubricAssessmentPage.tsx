import React, { useState, useEffect } from 'react';
import {
  RubricSkillCategory,
  RubricEvaluation
} from '../types';
import { RUBRIC_CONFIGS, MOCK_STUDENTS } from '../data/academicData';
import { academicDb } from '../lib/academicDb';
import { formatScore10, getPerformanceDescriptor, normalizeTo10Scale } from '../lib/scoring';
import {
  ClipboardList,
  Award,
  Save,
  CheckCircle,
  FileText,
  User,
  Sliders,
  BarChart,
  Calendar,
  Sparkles
} from 'lucide-react';

export const RubricAssessmentPage: React.FC = () => {
  const [selectedRubricId, setSelectedRubricId] =
    useState<RubricSkillCategory>('pronunciation');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(MOCK_STUDENTS[0].id);
  const [experimentCode, setExperimentCode] = useState<string>('R26-LAB-01');

  // Scores state: criterionId -> number (0-20)
  const [scores, setScores] = useState<Record<string, number>>({});
  const [facultyComments, setFacultyComments] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [evaluationsHistory, setEvaluationsHistory] = useState<RubricEvaluation[]>([]);

  const activeRubricConfig =
    RUBRIC_CONFIGS.find((r) => r.id === selectedRubricId) || RUBRIC_CONFIGS[0];
  const activeStudent =
    MOCK_STUDENTS.find((s) => s.id === selectedStudentId) || MOCK_STUDENTS[0];

  useEffect(() => {
    // Reset criteria default scores to 16/20
    const defaults: Record<string, number> = {};
    activeRubricConfig.criteria.forEach((c) => {
      defaults[c.id] = 16;
    });
    setScores(defaults);
  }, [selectedRubricId]);

  useEffect(() => {
    setEvaluationsHistory(academicDb.getRubricEvaluations());
  }, []);

  const handleScoreChange = (criterionId: string, value: number) => {
    const val = Math.max(0, Math.min(20, value));
    setScores((prev) => ({ ...prev, [criterionId]: val }));
  };

  // Calculate totals
  const totalScore: number = (Object.values(scores) as number[]).reduce((sum: number, val: number) => sum + (val || 0), 0);
  const maxPossible: number = activeRubricConfig.criteria.length * 20; // 100
  const percentage: number = Math.round((totalScore / maxPossible) * 100);

  const getGrade = (pct: number) => {
    if (pct >= 90) return 'O (Outstanding)';
    if (pct >= 80) return 'A+ (Excellent)';
    if (pct >= 70) return 'A (Very Good)';
    if (pct >= 60) return 'B+ (Good)';
    if (pct >= 50) return 'B (Above Average)';
    if (pct >= 40) return 'C (Average)';
    return 'F (Fail)';
  };

  const currentGrade = getGrade(percentage);

  const handleSaveEvaluation = () => {
    const evaluation: RubricEvaluation = {
      id: `rubric-eval-${Date.now()}`,
      studentId: activeStudent.id,
      studentName: activeStudent.name,
      rollNo: activeStudent.rollNo,
      branch: activeStudent.branch,
      rubricCategory: selectedRubricId,
      labExperimentCode: experimentCode,
      criterionScores: scores,
      totalMarks: totalScore,
      maxMarks: maxPossible,
      percentage,
      grade: currentGrade,
      facultyComments: facultyComments || 'Satisfactory performance. Keep practicing.',
      assessedBy: 'Dr. V. Lakshmi (Faculty)',
      assessedAt: new Date().toISOString()
    };

    const updated = academicDb.saveRubricEvaluation(evaluation);
    setEvaluationsHistory(updated);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="space-y-8 pb-12 text-[#2C3E50]">
      {/* Header */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#D35400] text-white rounded-xl shadow-xs">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-serif text-[#2C3E50]">
              Digital Assessment Rubrics Studio
            </h1>
            <p className="text-xs text-gray-600">
              Multi-criterion scoring rubrics across 12 communicative & technical skills with automated totals.
            </p>
          </div>
        </div>

        <button
          onClick={handleSaveEvaluation}
          className="px-5 py-2.5 bg-[#D35400] hover:bg-[#E67E22] text-white font-bold text-xs rounded-xl transition flex items-center gap-2 shadow-md shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Save Rubric Assessment</span>
        </button>
      </div>

      {/* Select Rubric Competency & Student */}
      <div className="srit-card p-5 bg-white border border-[#FAD7A0] grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-bold text-gray-600 block mb-1">
            Skill Competency Rubric
          </label>
          <select
            value={selectedRubricId}
            onChange={(e) => setSelectedRubricId(e.target.value as RubricSkillCategory)}
            className="w-full p-2.5 text-xs border border-gray-300 rounded-xl focus:border-[#D35400] outline-none bg-white font-bold text-[#D35400]"
          >
            {RUBRIC_CONFIGS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-600 block mb-1">
            Select Student
          </label>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="w-full p-2.5 text-xs border border-gray-300 rounded-xl focus:border-[#D35400] outline-none bg-white font-bold text-[#2C3E50]"
          >
            {MOCK_STUDENTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.rollNo} - {s.name} ({s.branch})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-600 block mb-1">
            Lab Experiment Code
          </label>
          <input
            type="text"
            value={experimentCode}
            onChange={(e) => setExperimentCode(e.target.value)}
            placeholder="e.g. R26-LAB-01"
            className="w-full p-2.5 text-xs border border-gray-300 rounded-xl focus:border-[#D35400] outline-none bg-white font-bold"
          />
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-100 text-emerald-800 text-xs rounded-xl border border-emerald-300 flex items-center justify-between font-bold">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Rubric assessment evaluation saved to student record successfully!</span>
          </div>
        </div>
      )}

      {/* Main Rubric Assessment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Criteria Scoring Form (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="srit-card p-6 bg-white border border-[#FAD7A0]">
            <div className="flex items-center justify-between pb-3 mb-6 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#D35400] tracking-wider">
                  Active Rubric Module
                </span>
                <h2 className="text-base font-bold text-[#2C3E50] font-serif">
                  {activeRubricConfig.title}
                </h2>
                <p className="text-xs text-gray-500">{activeRubricConfig.description}</p>
              </div>
            </div>

            <div className="space-y-6">
              {activeRubricConfig.criteria.map((criterion, index) => {
                const currentScore = scores[criterion.id] ?? 16;
                return (
                  <div
                    key={criterion.id}
                    className="p-4 bg-[#FFF8F0]/60 border border-[#FAD7A0]/70 rounded-xl space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-[#D35400] uppercase">
                          Criterion {index + 1}
                        </span>
                        <h3 className="text-sm font-bold text-[#2C3E50]">
                          {criterion.name}
                        </h3>
                        <p className="text-xs text-gray-600">{criterion.description}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 bg-white p-2 rounded-lg border border-[#FAD7A0]">
                        <span className="text-xs font-semibold text-gray-500">Score:</span>
                        <input
                          type="number"
                          min={0}
                          max={20}
                          value={currentScore}
                          onChange={(e) =>
                            handleScoreChange(criterion.id, parseInt(e.target.value) || 0)
                          }
                          className="w-14 p-1 text-center font-extrabold text-sm text-[#D35400] border border-gray-300 rounded focus:border-[#D35400] outline-none"
                        />
                        <span className="text-xs font-bold text-gray-400">/ 20</span>
                      </div>
                    </div>

                    {/* Interactive Slider */}
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-gray-400">0</span>
                      <input
                        type="range"
                        min={0}
                        max={20}
                        value={currentScore}
                        onChange={(e) =>
                          handleScoreChange(criterion.id, parseInt(e.target.value) || 0)
                        }
                        className="flex-1 accent-[#D35400] cursor-pointer"
                      />
                      <span className="text-[10px] font-bold text-gray-600">20</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Faculty Remarks */}
            <div className="mt-6 pt-4 border-t border-gray-100 space-y-2">
              <label className="text-xs font-bold text-[#2C3E50] block">
                Faculty Remarks & Constructive Guidance
              </label>
              <textarea
                value={facultyComments}
                onChange={(e) => setFacultyComments(e.target.value)}
                placeholder="Enter specific feedback on phonetics, fluency, structure, or areas for improvement..."
                className="w-full p-3 text-xs border border-gray-300 rounded-xl focus:border-[#D35400] outline-none min-h-[90px]"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Live Score Calculator & Student Profile (1 col) */}
        <div className="space-y-6">
          {/* Live Calculated Total Box */}
          <div className="srit-card p-6 bg-gradient-to-br from-[#2C3E50] to-[#1A252F] text-white border-2 border-[#FAD7A0]/40 shadow-lg text-center space-y-4">
            <span className="text-xs font-bold text-[#FAD7A0] uppercase tracking-wider block">
              Automated Score Calculation
            </span>

            <div className="py-2">
              <div className="text-4xl font-extrabold text-[#FAD7A0] tracking-tight">
                {formatScore10(normalizeTo10Scale(percentage))}
              </div>
              <p className="text-xs text-gray-300 mt-1 font-medium">
                Performance Level: <strong className="text-white font-bold">{getPerformanceDescriptor(normalizeTo10Scale(percentage))}</strong>
              </p>
            </div>

            <div className="p-3 bg-white/10 rounded-xl border border-white/10">
              <span className="text-[10px] uppercase text-gray-300 block">Assigned Grade</span>
              <span className="text-sm font-extrabold text-[#27AE60]">{currentGrade}</span>
            </div>

            <button
              onClick={handleSaveEvaluation}
              className="w-full py-3 bg-[#D35400] hover:bg-[#E67E22] text-white font-bold text-xs rounded-xl transition shadow-md flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Submit Evaluation</span>
            </button>
          </div>

          {/* Student Context Card */}
          <div className="srit-card p-5 bg-white border border-[#FAD7A0] space-y-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Student Information
            </h3>
            <div className="flex items-center gap-3">
              <img
                src={activeStudent.avatarUrl}
                alt={activeStudent.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#FAD7A0]"
              />
              <div>
                <h4 className="text-sm font-bold text-[#2C3E50]">{activeStudent.name}</h4>
                <p className="text-xs text-[#D35400] font-bold">Roll: {activeStudent.rollNo}</p>
                <p className="text-[11px] text-gray-500">{activeStudent.branch}</p>
              </div>
            </div>
            <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-600 space-y-1">
              <p>Batch: <strong>{activeStudent.batch}</strong></p>
              <p>Section: <strong>{activeStudent.section}</strong></p>
            </div>
          </div>
        </div>
      </div>

      {/* Evaluation History Table */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#D35400]" />
            <h3 className="text-base font-bold text-[#2C3E50] font-serif">
              Saved Rubric Evaluations Log
            </h3>
          </div>
          <span className="text-xs text-gray-500 font-semibold">
            {evaluationsHistory.length} Evaluation Records
          </span>
        </div>

        {evaluationsHistory.length === 0 ? (
          <p className="text-xs text-gray-500 py-4 text-center italic">
            No rubric evaluations recorded yet. Complete the form above to save student grades.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 font-bold text-gray-500 uppercase border-b border-gray-200">
                  <th className="p-3">Assessed At</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Roll No</th>
                  <th className="p-3">Rubric Competency</th>
                  <th className="p-3">Total Marks</th>
                  <th className="p-3">Grade</th>
                  <th className="p-3">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {evaluationsHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="p-3 font-semibold text-gray-600">
                      {new Date(item.assessedAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 font-bold text-[#2C3E50]">{item.studentName}</td>
                    <td className="p-3 text-[#D35400] font-bold">{item.rollNo}</td>
                    <td className="p-3 capitalize text-gray-700">
                      {item.rubricCategory.replace('-', ' ')}
                    </td>
                    <td className="p-3 font-extrabold text-[#2C3E50]">
                      {formatScore10(normalizeTo10Scale(item.percentage))} ({getPerformanceDescriptor(normalizeTo10Scale(item.percentage))})
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {item.grade}
                      </span>
                    </td>
                    <td className="p-3 text-gray-500 max-w-xs truncate">
                      {item.facultyComments}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
