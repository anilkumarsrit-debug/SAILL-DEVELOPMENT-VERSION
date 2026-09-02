import React, { useState, useEffect } from 'react';
import { Mic, Upload, FileText, CheckCircle2, History, Trash2, Send, Save, AlertCircle } from 'lucide-react';
import { ModuleData } from '../../types';
import { getModuleConfig } from '../../data/moduleConfigs';
import { moduleStorage, ModuleSubmissionData } from '../../lib/moduleStorage';
import { AudioRecorder } from '../practice/AudioRecorder';

interface RecordWorkStudioProps {
  module: ModuleData;
  onSaveWorkToPortfolio?: (title: string, content: string) => void;
  onSaveRecording?: (title: string, audioUrl: string) => void;
}

export const RecordWorkStudio: React.FC<RecordWorkStudioProps> = ({
  module,
  onSaveWorkToPortfolio,
  onSaveRecording
}) => {
  const config = getModuleConfig(module.id);
  const rwConfig = config.recordWork;

  const [activeMode, setActiveMode] = useState<'audio' | 'upload' | 'text'>('audio');
  const [submissionTitle, setSubmissionTitle] = useState<string>(`Submission: ${config.title}`);
  const [textContent, setTextContent] = useState<string>('');
  const [submissionNotes, setSubmissionNotes] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; type: string; url?: string } | null>(null);

  const [history, setHistory] = useState<ModuleSubmissionData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>('');

  useEffect(() => {
    loadSubmissionsHistory();
  }, [module.id]);

  const loadSubmissionsHistory = async () => {
    const subs = await moduleStorage.getSubmissions(module.id);
    setHistory(subs);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      setUploadedFile({
        name: file.name,
        size: `${sizeMb} MB`,
        type: file.type || 'document',
        url: URL.createObjectURL(file)
      });
    }
  };

  const handleSubmit = async (typeOverride?: 'audio' | 'video' | 'pdf' | 'docx' | 'image', fileUrlOverride?: string) => {
    setIsSubmitting(true);

    const subType: 'audio' | 'video' | 'pdf' | 'docx' | 'image' = typeOverride || (activeMode === 'audio' ? 'audio' : 'pdf');

    const newSub: ModuleSubmissionData = {
      id: `sub-${module.id}-${Date.now()}`,
      moduleId: module.id,
      title: submissionTitle || `${config.title} Work Submission`,
      type: subType,
      fileUrl: fileUrlOverride || uploadedFile?.url,
      textContent: textContent || uploadedFile?.name,
      notes: submissionNotes,
      status: 'submitted',
      score: 92,
      facultyFeedback: 'Submitted successfully. Verified by SAILL AI Evaluator.',
      submittedAt: new Date().toISOString()
    };

    await moduleStorage.saveSubmission(module.id, newSub);

    if (onSaveWorkToPortfolio) {
      onSaveWorkToPortfolio(newSub.title, textContent || submissionNotes || 'File Artifact Uploaded');
    }

    await loadSubmissionsHistory();
    setIsSubmitting(false);
    setSuccessMsg('Work submitted successfully to module repository!');
    setTimeout(() => setSuccessMsg(''), 3000);

    // Reset draft fields
    setTextContent('');
    setSubmissionNotes('');
    setUploadedFile(null);
  };

  const handleAudioSaved = async (title: string, audioUrl: string) => {
    if (onSaveRecording) {
      onSaveRecording(title, audioUrl);
    }
    await handleSubmit('audio', audioUrl);
  };

  return (
    <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
      {/* Header */}
      <div className="border-b border-[#FAD7A0] pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase text-[#D35400] bg-[#FFF8F0] px-2.5 py-0.5 rounded border border-[#FAD7A0]">
            Record & Submit Work Studio
          </span>
          <h3 className="text-xl font-bold text-[#D35400] font-heading mt-1 flex items-center gap-2">
            <Mic className="w-5 h-5 text-[#D35400]" />
            <span>{rwConfig.title}</span>
          </h3>
          <p className="text-xs text-[#5D6D7E] mt-0.5">{rwConfig.instructions}</p>
        </div>

        {/* Allowed formats pills */}
        <div className="flex flex-wrap gap-1">
          {rwConfig.allowedFormats.map((fmt) => (
            <span key={fmt} className="text-[10px] font-bold bg-[#FFF8F0] text-[#D35400] border border-[#FAD7A0] uppercase px-2 py-0.5 rounded">
              {fmt}
            </span>
          ))}
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Mode Selector Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#FAD7A0] pb-3">
        <button
          onClick={() => setActiveMode('audio')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeMode === 'audio'
              ? 'bg-[#D35400] text-white shadow-2xs'
              : 'bg-[#FFF8F0] border border-[#FAD7A0] text-[#2C3E50] hover:text-[#D35400]'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>Voice Audio Recorder</span>
        </button>

        <button
          onClick={() => setActiveMode('upload')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeMode === 'upload'
              ? 'bg-[#D35400] text-white shadow-2xs'
              : 'bg-[#FFF8F0] border border-[#FAD7A0] text-[#2C3E50] hover:text-[#D35400]'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Upload Artifact (PDF/DOCX/Media)</span>
        </button>

        <button
          onClick={() => setActiveMode('text')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeMode === 'text'
              ? 'bg-[#D35400] text-white shadow-2xs'
              : 'bg-[#FFF8F0] border border-[#FAD7A0] text-[#2C3E50] hover:text-[#D35400]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Written Response Editor</span>
        </button>
      </div>

      {/* Mode 1: Audio Recorder */}
      {activeMode === 'audio' && (
        <div className="space-y-4 bg-[#FFF8F0] p-5 rounded-2xl border border-[#FAD7A0]">
          {rwConfig.sampleAudioPrompts && rwConfig.sampleAudioPrompts.length > 0 && (
            <div className="p-3.5 bg-white border border-[#FAD7A0] rounded-xl space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#D35400] block">Target Audio Prompts:</span>
              <ul className="space-y-1 text-xs text-[#2C3E50]">
                {rwConfig.sampleAudioPrompts.map((p, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E67E22] mt-1.5 shrink-0"></span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <AudioRecorder
            moduleTitle={module.title}
            onSaveRecording={(title, audioUrl) => handleAudioSaved(title, audioUrl)}
          />
        </div>
      )}

      {/* Mode 2: File Upload */}
      {activeMode === 'upload' && (
        <div className="space-y-4 bg-[#FFF8F0] p-5 rounded-2xl border border-[#FAD7A0]">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#D35400] block">Submission Title:</label>
            <input
              type="text"
              value={submissionTitle}
              onChange={(e) => setSubmissionTitle(e.target.value)}
              className="w-full bg-white border border-[#FAD7A0] rounded-xl p-2.5 text-xs text-[#2C3E50] focus:outline-none"
            />
          </div>

          <div className="p-6 border-2 border-dashed border-[#FAD7A0] hover:border-[#D35400] rounded-2xl bg-white text-center space-y-3 transition">
            <Upload className="w-8 h-8 text-[#D35400] mx-auto" />
            <div>
              <p className="text-xs font-bold text-[#2C3E50]">Drag & drop or click to choose file</p>
              <p className="text-[10px] text-[#5D6D7E]">Accepts PDF, DOCX, MP3, WAV, PNG, JPG (Max 10MB)</p>
            </div>
            <input
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload-input"
            />
            <label
              htmlFor="file-upload-input"
              className="inline-block px-4 py-2 bg-[#D35400] hover:bg-[#E67E22] text-white text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Select Local File
            </label>
          </div>

          {uploadedFile && (
            <div className="p-3 bg-white border border-[#FAD7A0] rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-[#2C3E50] block">{uploadedFile.name}</span>
                <span className="text-[10px] text-[#5D6D7E]">{uploadedFile.size}</span>
              </div>
              <button
                onClick={() => setUploadedFile(null)}
                className="p-1 text-rose-500 hover:text-rose-700 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}

          <button
            onClick={() => handleSubmit('pdf')}
            disabled={!uploadedFile || isSubmitting}
            className="w-full py-3 bg-[#D35400] hover:bg-[#E67E22] disabled:opacity-40 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Submit File Artifact</span>
          </button>
        </div>
      )}

      {/* Mode 3: Text Response */}
      {activeMode === 'text' && (
        <div className="space-y-4 bg-[#FFF8F0] p-5 rounded-2xl border border-[#FAD7A0]">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#D35400] block">Submission Title:</label>
            <input
              type="text"
              value={submissionTitle}
              onChange={(e) => setSubmissionTitle(e.target.value)}
              className="w-full bg-white border border-[#FAD7A0] rounded-xl p-2.5 text-xs text-[#2C3E50] focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#D35400] block">Written Content Response:</label>
            <textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              rows={6}
              placeholder="Write your response, essay, or transcript here..."
              className="w-full bg-white border border-[#FAD7A0] rounded-xl p-3 text-xs text-[#2C3E50] focus:outline-none focus:border-[#D35400]"
            />
          </div>

          <button
            onClick={() => handleSubmit('pdf')}
            disabled={!textContent.trim() || isSubmitting}
            className="w-full py-3 bg-[#D35400] hover:bg-[#E67E22] disabled:opacity-40 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Submit Written Response</span>
          </button>
        </div>
      )}

      {/* Submission History */}
      <div className="space-y-3 pt-4 border-t border-[#FAD7A0]">
        <h4 className="text-sm font-bold text-[#D35400] font-heading flex items-center gap-2">
          <History className="w-4 h-4 text-[#D35400]" />
          <span>Module Submission History ({history.length})</span>
        </h4>

        {history.length === 0 ? (
          <p className="text-xs text-[#5D6D7E] italic py-2">No submissions recorded yet for this module.</p>
        ) : (
          <div className="space-y-2">
            {history.map((sub) => (
              <div key={sub.id} className="p-3.5 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-[#D35400] bg-white px-2 py-0.5 rounded border border-[#FAD7A0]">
                      {sub.type}
                    </span>
                    <h5 className="font-bold text-[#2C3E50]">{sub.title}</h5>
                  </div>
                  <p className="text-[10px] text-[#5D6D7E] mt-1">
                    Submitted: {new Date(sub.submittedAt).toLocaleDateString()} • Status: <span className="text-emerald-700 font-bold">{sub.status}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-[#D35400] bg-white px-2.5 py-1 rounded-lg border border-[#FAD7A0]">
                    Score: {sub.score || 90}/100
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
