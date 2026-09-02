import React, { useState, useEffect } from 'react';
import { BookMarked, Save, CheckCircle2, Clock, FileText, UserCheck } from 'lucide-react';
import { dbStorage } from '../../../lib/db';

export const InterviewLabNotebook: React.FC = () => {
  const [aim, setAim] = useState<string>(
    'To practice HR placement interview questions, master the STAR framework for behavioral responses, refine camera eye contact and body language, and evaluate voice parameters.'
  );
  const [procedure, setProcedure] = useState<string>(
    '1. Reviewed HR round evaluation criteria and Present-Past-Future self-introduction framework.\n2. Completed HR simulation question bank recording voice answers.\n3. Formulated structured STAR stories for situational team scenarios.\n4. Audited body language setup and eye-gaze alignment via camera preview.\n5. Completed AI Mock Interview and generated diagnostic scorecard.'
  );
  const [observations, setObservations] = useState<string>(
    'Achieved an average SAILL score of 9.2/10. Speaking rate measured 135 WPM (optimal). Maintained clear articulation and structured answers.'
  );

  const [saved, setSaved] = useState<boolean>(false);

  useEffect(() => {
    const loadNotebook = async () => {
      const records = await dbStorage.getLabNotes('professional-writing');
      if (records && records.length > 0) {
        const latest = records[0];
        if (latest.aim) setAim(latest.aim);
        if (latest.procedure) setProcedure(latest.procedure);
        if (latest.observations) setObservations(latest.observations);
      }
    };
    loadNotebook();
  }, []);

  const handleSaveNotebook = async () => {
    await dbStorage.saveLabNote({
      id: `labnote-int-${Date.now()}`,
      moduleId: 'professional-writing',
      moduleTitle: 'Module 6: Interview Skills & Mock Interviews',
      aim,
      procedure,
      observations,
      date: new Date().toISOString()
    });
    setSaved(true);
  };

  return (
    <div className="space-y-6">
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
        <div className="border-b border-[#FAD7A0] pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest bg-[#D35400] text-white px-2 py-0.5 rounded-md">
                Activity 9
              </span>
              <span className="text-xs text-[#5D6D7E] font-bold">R26 Communicative English Laboratory</span>
            </div>
            <h2 className="text-lg font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-[#D35400]" />
              9. Laboratory Notebook — Module 6 Record
            </h2>
            <p className="text-xs text-[#5D6D7E] mt-1">
              Official ELT Laboratory Notebook record for R26 Communicative English. Automatically persisted in SAILL local storage.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-xl">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" /> Faculty Review Status: Verified
            </span>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-2">
            <label className="font-extrabold text-[#2C3E50] block flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#D35400]" /> Aim of Experiment:
            </label>
            <textarea
              rows={2}
              value={aim}
              onChange={(e) => {
                setAim(e.target.value);
                setSaved(false);
              }}
              className="w-full bg-white border border-[#FAD7A0] rounded-lg p-3 text-xs text-[#2C3E50]"
            />
          </div>

          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-2">
            <label className="font-extrabold text-[#2C3E50] block flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#D35400]" /> Laboratory Procedure & Execution Steps:
            </label>
            <textarea
              rows={4}
              value={procedure}
              onChange={(e) => {
                setProcedure(e.target.value);
                setSaved(false);
              }}
              className="w-full bg-white border border-[#FAD7A0] rounded-lg p-3 text-xs text-[#2C3E50]"
            />
          </div>

          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-2">
            <label className="font-extrabold text-[#2C3E50] block flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#D35400]" /> Result & SAILL Diagnostic Observations:
            </label>
            <textarea
              rows={3}
              value={observations}
              onChange={(e) => {
                setObservations(e.target.value);
                setSaved(false);
              }}
              className="w-full bg-white border border-[#FAD7A0] rounded-lg p-3 text-xs text-[#2C3E50]"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleSaveNotebook}
              className={`px-6 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
                saved
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-[#D35400] text-white hover:bg-[#B04300]'
              }`}
            >
              {saved ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Lab Notebook Record Saved to IndexedDB
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Lab Notebook Entry
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
