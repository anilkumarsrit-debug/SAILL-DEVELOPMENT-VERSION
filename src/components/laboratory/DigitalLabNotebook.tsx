import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, Printer, Award, UserCheck } from 'lucide-react';
import { ModuleData, StudentProfile } from '../../types';
import { getModuleConfig } from '../../data/moduleConfigs';
import { moduleStorage, ModuleNotebookData } from '../../lib/moduleStorage';

interface DigitalLabNotebookProps {
  module: ModuleData;
  studentProfile?: StudentProfile;
  audioRecordingUrl?: string;
  onSaveExperiment?: (record: any) => void;
}

export const DigitalLabNotebook: React.FC<DigitalLabNotebookProps> = ({
  module,
  studentProfile,
  audioRecordingUrl,
  onSaveExperiment
}) => {
  const config = getModuleConfig(module.id);
  const nbConfig = config.notebookConfig;
  const expNum = nbConfig.experimentNumber || module.code.replace('R26-LAB-', 'EXP-');

  const [dateStr, setDateStr] = useState<string>(new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }));

  const [studentWork, setStudentWork] = useState<string>(nbConfig.defaultStudentWork);
  const [reflectionText, setReflectionText] = useState<string>(nbConfig.defaultReflection);
  const [rubricScores, setRubricScores] = useState<Record<string, number>>({
    c1: 18,
    c2: 19,
    c3: 18,
    c4: 20,
    c5: 19
  });

  const [facultyRemarks, setFacultyRemarks] = useState<string>(nbConfig.facultySampleRemarks);
  const [isVerified, setIsVerified] = useState<boolean>(true);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    loadSavedData();
  }, [module.id]);

  const loadSavedData = async () => {
    const saved = await moduleStorage.getNotebook(module.id);
    if (saved) {
      if (saved.dateStr) setDateStr(saved.dateStr);
      if (saved.studentWork) setStudentWork(saved.studentWork);
      if (saved.reflectionText) setReflectionText(saved.reflectionText);
      if (saved.rubricScores && Object.keys(saved.rubricScores).length > 0) setRubricScores(saved.rubricScores);
      if (saved.facultyRemarks) setFacultyRemarks(saved.facultyRemarks);
      setIsVerified(saved.isVerified ?? true);
    } else {
      setStudentWork(nbConfig.defaultStudentWork);
      setReflectionText(nbConfig.defaultReflection);
      setFacultyRemarks(nbConfig.facultySampleRemarks);
    }
  };

  const handleRubricChange = (key: string, value: number) => {
    setRubricScores((prev) => ({ ...prev, [key]: value }));
  };

  const totalScore: number = (Object.values(rubricScores) as number[]).reduce((a: number, b: number) => a + b, 0);

  const handlePrint = () => {
    window.print();
  };

  const handleSaveNotebook = async () => {
    const notebookData: ModuleNotebookData = {
      moduleId: module.id,
      experimentNumber: expNum,
      dateStr,
      studentWork,
      reflectionText,
      rubricScores,
      totalScore,
      facultyRemarks,
      isVerified,
      updatedAt: new Date().toISOString()
    };

    await moduleStorage.saveNotebook(module.id, notebookData);

    if (onSaveExperiment) {
      onSaveExperiment(notebookData);
    }

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6 print:border-none print:shadow-none">
      {/* Formal Header Banner */}
      <div className="border-b-2 border-[#D35400] pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#D35400] bg-[#FFF8F0] px-2.5 py-0.5 rounded border border-[#FAD7A0]">
            Srinivasa Ramanujan Institute of Technology (Autonomous)
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#2C3E50] font-heading mt-1">
            DIGITAL LABORATORY EXPERIMENT RECORD
          </h2>
          <p className="text-xs text-[#5D6D7E] font-medium">
            R26 Communicative English Laboratory • Department of Humanities & Sciences
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 print:hidden">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-[#FFF8F0] border border-[#FAD7A0] hover:bg-[#FAD7A0] text-[#D35400] text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Sheet</span>
          </button>

          <button
            onClick={handleSaveNotebook}
            className="px-4 py-2 bg-[#D35400] hover:bg-[#E67E22] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? 'Saved to Module Notebook!' : 'Save Experiment Sheet'}</span>
          </button>
        </div>
      </div>

      {/* Student Details & Experiment Meta */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FFF8F0] p-4 rounded-xl border border-[#FAD7A0] text-xs">
        <div>
          <span className="text-[10px] font-bold text-[#E67E22] uppercase block">Experiment No:</span>
          <span className="font-black text-[#D35400]">{expNum}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-[#E67E22] uppercase block">Date & Time:</span>
          <span className="font-bold text-[#2C3E50]">{dateStr}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-[#E67E22] uppercase block">Student Name:</span>
          <span className="font-bold text-[#2C3E50]">{studentProfile?.name || 'K. V. S. Rahul'}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-[#E67E22] uppercase block">Roll Number:</span>
          <span className="font-bold text-[#2C3E50]">{studentProfile?.rollNo || '262G1A0501'}</span>
        </div>
      </div>

      {/* Experiment Objective & Apparatus */}
      <div className="space-y-3">
        <div className="p-4 rounded-xl bg-white border border-[#FAD7A0] space-y-1">
          <h4 className="text-xs font-black text-[#D35400] uppercase tracking-wider">Experiment Aim & Topic:</h4>
          <p className="text-xs font-bold text-[#2C3E50]">{config.title} ({config.syllabusTopic})</p>
          <p className="text-xs text-[#5D6D7E] leading-relaxed mt-1">{nbConfig.aim}</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#FAD7A0] space-y-1">
          <h4 className="text-xs font-black text-[#D35400] uppercase tracking-wider">Apparatus & Tools Used:</h4>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {nbConfig.apparatus.map((appItem) => (
              <span key={appItem} className="text-[10px] font-bold bg-[#FFF8F0] text-[#D35400] border border-[#FAD7A0] px-2 py-0.5 rounded">
                {appItem}
              </span>
            ))}
            {module.aiTools.map((tool) => (
              <span key={tool} className="text-[10px] font-bold bg-[#FFF8F0] text-[#D35400] border border-[#FAD7A0] px-2 py-0.5 rounded">
                {tool}
              </span>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#FAD7A0] space-y-1">
          <h4 className="text-xs font-black text-[#D35400] uppercase tracking-wider">Theory & Principles:</h4>
          <p className="text-xs text-[#2C3E50] leading-relaxed">{nbConfig.theory}</p>
        </div>
      </div>

      {/* Student Activity Work Content */}
      <div className="space-y-2">
        <h4 className="text-xs font-black text-[#D35400] uppercase tracking-wider">Student Activity Submission & Experiment Output:</h4>
        <textarea
          value={studentWork}
          onChange={(e) => setStudentWork(e.target.value)}
          rows={7}
          className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-3 text-xs text-[#2C3E50] font-mono focus:outline-none focus:border-[#D35400]"
        />
      </div>

      {/* Reflection Notes */}
      <div className="space-y-2">
        <h4 className="text-xs font-black text-[#D35400] uppercase tracking-wider">Student Reflection & Learning Takeaway:</h4>
        <textarea
          value={reflectionText}
          onChange={(e) => setReflectionText(e.target.value)}
          rows={3}
          className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-3 text-xs text-[#2C3E50] focus:outline-none focus:border-[#D35400]"
        />
      </div>

      {/* Faculty Evaluation Rubric */}
      <div className="p-5 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-4">
        <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-2">
          <h4 className="text-sm font-black text-[#D35400] font-heading flex items-center gap-2">
            <Award className="w-4 h-4 text-[#D35400]" />
            <span>Faculty Evaluation Rubric (Total Score: {totalScore} / 100)</span>
          </h4>
          <span className="text-xs font-extrabold text-[#D35400] bg-white px-3 py-1 rounded-full border border-[#FAD7A0]">
            Grade: {totalScore >= 90 ? 'A+' : totalScore >= 80 ? 'A' : 'B'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          {nbConfig.rubricCriteria.map((item, index) => {
            const key = `c${index + 1}`;
            const currentVal = rubricScores[key] ?? 18;
            return (
              <div key={item.name} className="p-3 bg-white border border-[#FAD7A0] rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-[#5D6D7E] block line-clamp-1" title={item.description}>
                  {item.name}
                </span>
                <div className="flex items-center justify-between">
                  <input
                    type="number"
                    min="0"
                    max={item.maxScore}
                    value={currentVal}
                    onChange={(e) => handleRubricChange(key, Number(e.target.value))}
                    className="w-12 bg-[#FFF8F0] border border-[#FAD7A0] rounded p-1 text-xs font-black text-[#D35400]"
                  />
                  <span className="text-[10px] font-bold text-[#5D6D7E]">/ {item.maxScore}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Faculty Remarks & Verification Stamp */}
        <div className="pt-2 border-t border-[#FAD7A0] space-y-2">
          <label className="text-xs font-bold text-[#D35400] uppercase block">Faculty Remarks:</label>
          <input
            type="text"
            value={facultyRemarks}
            onChange={(e) => setFacultyRemarks(e.target.value)}
            className="w-full bg-white border border-[#FAD7A0] rounded-xl p-2.5 text-xs text-[#2C3E50] focus:outline-none"
          />
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-xs font-bold text-[#2C3E50]">
              Verified by Faculty: Dr. P. S. Reddy, Professor of English
            </span>
          </div>

          <div className="px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full text-[10px] font-black uppercase flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>SRIT Approved & Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
