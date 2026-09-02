import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  Mic,
  MicOff,
  Volume2,
  Save,
  CheckCircle2,
  Zap,
  Target,
  Compass,
  FileText,
  UserCheck
} from 'lucide-react';
import { EtiquetteBrandingCoach } from '../../../services/ai/etiquetteBrandingCoach';
import { dbStorage } from '../../../lib/db';

export const PersonalBrandingStudio: React.FC<{
  onSaveWorkToPortfolio?: (title: string, content: string) => void;
}> = ({ onSaveWorkToPortfolio }) => {
  // Input parameters
  const [branch, setBranch] = useState<string>('Computer Science & Engineering');
  const [specialization, setSpecialization] = useState<string>('AI & Cloud Architecture');
  const [coreStrengthsInput, setCoreStrengthsInput] = useState<string>('System Design, Analytical Problem Solving, IEEE Technical Writing');
  const [careerValuesInput, setCareerValuesInput] = useState<string>('Engineering Integrity, Innovation, Continuous Learning');
  const [targetRole, setTargetRole] = useState<string>('Full-Stack Software Engineer');
  const [keyProjects, setKeyProjects] = useState<string>('IoT Smart Grid Monitoring System');

  // Generated outputs
  const [brandingOptions, setBrandingOptions] = useState<{
    executive: string;
    innovative: string;
    research: string;
  } | null>(null);

  const [selectedBrandingStatement, setSelectedBrandingStatement] = useState<string>(
    'Passionate Computer Science undergraduate at SRIT specializing in AI & Cloud Architecture. Driven by Innovation and Integrity, with core expertise in System Design and Technical Writing.'
  );

  const [elevatorPitch, setElevatorPitch] = useState<string>(
    "Hello! I am a B.Tech Computer Science student at SRIT with a passion for software architecture and IoT systems. Over the past year, I engineered an IoT Smart Grid Monitoring platform adhering to IEEE standards. I thrive in collaborative agile environments where I can apply my analytical problem-solving skills to build scalable software solutions. I am excited to contribute as a Full-Stack Engineer."
  );

  const [professionalBio, setProfessionalBio] = useState<string>(
    "Engineering Student & Technology Specialist @ SRIT. Specializing in cloud software systems, technical documentation, and cross-functional team leadership."
  );

  const [careerVision, setCareerVision] = useState<string>(
    "To become a Lead Systems Architect in top-tier tech organizations, engineering resilient software that solves global sustainability challenges."
  );

  // Audio recording state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string>('');

  const handleGenerateBrandingOptions = () => {
    const strengths = coreStrengthsInput.split(',').map((s) => s.trim()).filter(Boolean);
    const values = careerValuesInput.split(',').map((v) => v.trim()).filter(Boolean);

    const options = EtiquetteBrandingCoach.generateBrandingStatements({
      branch,
      specialization,
      coreStrengths: strengths,
      careerValues: values,
      targetRole,
      keyProjects
    });

    setBrandingOptions(options);
  };

  const handleSelectOption = (statement: string) => {
    setSelectedBrandingStatement(statement);
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      // Mock audio saved
      setRecordedAudioUrl('mock-recorded-pitch.mp3');
    } else {
      setIsRecording(true);
    }
  };

  const handleSaveBrandingPortfolio = async () => {
    setSaveStatus('Saving Personal Brand Package to IndexedDB...');

    const fullContent = `PERSONAL BRANDING PACKAGE - SRIT R26
Branch: ${branch}
Specialization: ${specialization}
Target Role: ${targetRole}

SELECTED BRANDING STATEMENT:
${selectedBrandingStatement}

ELEVATOR PITCH (30-60 SECONDS):
${elevatorPitch}

PROFESSIONAL BIO:
${professionalBio}

CAREER VISION STATEMENT:
${careerVision}`;

    await dbStorage.savePortfolioItem({
      id: `personal-branding-${Date.now()}`,
      moduleId: 'etiquette-branding',
      moduleTitle: 'Etiquette, Netiquette & Personal Branding',
      title: 'Personal Branding & Elevator Pitch Package',
      category: 'written',
      content: fullContent,
      score: 96,
      createdAt: new Date().toISOString()
    });

    if (onSaveWorkToPortfolio) {
      onSaveWorkToPortfolio('Personal Branding Package', fullContent);
    }

    setSaveStatus('Branding Package successfully saved to Portfolio & IndexedDB!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
        <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-[#D35400]">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#D35400] font-heading">
                5. Personal Branding Studio (R26 Syllabus)
              </h2>
              <p className="text-xs text-[#2C3E50]">
                Define your professional identity, elevator pitch, executive bio, and generate AI-powered branding statements.
              </p>
            </div>
          </div>

          <button
            onClick={handleSaveBrandingPortfolio}
            className="px-4 py-2 bg-[#D35400] text-white rounded-xl text-xs font-bold hover:bg-[#B94600] transition flex items-center gap-2 shadow-2xs"
          >
            <Save className="w-4 h-4" />
            Save Brand Package
          </button>
        </div>

        {saveStatus && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{saveStatus}</span>
          </div>
        )}

        {/* Brand Parameter Inputs */}
        <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-3">
          <span className="text-xs font-bold text-[#D35400] font-heading block border-b border-[#FAD7A0] pb-1 uppercase">
            Step 1: Input Professional Attributes
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold text-[#D35400]">Engineering Branch:</label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full p-2 bg-white border border-gray-300 rounded text-xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#D35400]">Specialization / Domain:</label>
              <input
                type="text"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full p-2 bg-white border border-gray-300 rounded text-xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#D35400]">Target Role / Ambition:</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full p-2 bg-white border border-gray-300 rounded text-xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#D35400]">Core Strengths (Comma Separated):</label>
              <input
                type="text"
                value={coreStrengthsInput}
                onChange={(e) => setCoreStrengthsInput(e.target.value)}
                className="w-full p-2 bg-white border border-gray-300 rounded text-xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#D35400]">Career Values (Comma Separated):</label>
              <input
                type="text"
                value={careerValuesInput}
                onChange={(e) => setCareerValuesInput(e.target.value)}
                className="w-full p-2 bg-white border border-gray-300 rounded text-xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#D35400]">Key Project Highlight:</label>
              <input
                type="text"
                value={keyProjects}
                onChange={(e) => setKeyProjects(e.target.value)}
                className="w-full p-2 bg-white border border-gray-300 rounded text-xs"
              />
            </div>
          </div>

          <button
            onClick={handleGenerateBrandingOptions}
            className="px-4 py-2 bg-[#D35400] text-white text-xs font-bold rounded-xl hover:bg-[#B94600] transition flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Generate AI Branding Statements
          </button>
        </div>

        {/* AI Branding Options */}
        {brandingOptions && (
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold text-[#D35400] font-heading block uppercase">
              Step 2: Select AI-Generated Branding Statement
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div
                onClick={() => handleSelectOption(brandingOptions.executive)}
                className={`p-4 rounded-xl border cursor-pointer transition space-y-2 ${
                  selectedBrandingStatement === brandingOptions.executive
                    ? 'bg-[#FFF8F0] border-[#D35400] shadow-2xs'
                    : 'bg-white border-gray-200 hover:border-[#FAD7A0]'
                }`}
              >
                <span className="text-[10px] font-mono font-bold bg-[#D35400] text-white px-2 py-0.5 rounded">
                  Executive Tone
                </span>
                <p className="text-xs text-[#2C3E50] leading-relaxed">{brandingOptions.executive}</p>
              </div>

              <div
                onClick={() => handleSelectOption(brandingOptions.innovative)}
                className={`p-4 rounded-xl border cursor-pointer transition space-y-2 ${
                  selectedBrandingStatement === brandingOptions.innovative
                    ? 'bg-[#FFF8F0] border-[#D35400] shadow-2xs'
                    : 'bg-white border-gray-200 hover:border-[#FAD7A0]'
                }`}
              >
                <span className="text-[10px] font-mono font-bold bg-emerald-600 text-white px-2 py-0.5 rounded">
                  Innovative Tech Tone
                </span>
                <p className="text-xs text-[#2C3E50] leading-relaxed">{brandingOptions.innovative}</p>
              </div>

              <div
                onClick={() => handleSelectOption(brandingOptions.research)}
                className={`p-4 rounded-xl border cursor-pointer transition space-y-2 ${
                  selectedBrandingStatement === brandingOptions.research
                    ? 'bg-[#FFF8F0] border-[#D35400] shadow-2xs'
                    : 'bg-white border-gray-200 hover:border-[#FAD7A0]'
                }`}
              >
                <span className="text-[10px] font-mono font-bold bg-blue-600 text-white px-2 py-0.5 rounded">
                  Research & Growth Tone
                </span>
                <p className="text-xs text-[#2C3E50] leading-relaxed">{brandingOptions.research}</p>
              </div>
            </div>
          </div>
        )}

        {/* Selected Branding & Pitch Studio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Selected Branding Statement */}
          <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-2">
            <label className="text-xs font-bold text-[#D35400]">Active Branding Statement:</label>
            <textarea
              value={selectedBrandingStatement}
              onChange={(e) => setSelectedBrandingStatement(e.target.value)}
              rows={3}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-xs font-medium text-[#2C3E50]"
            />
          </div>

          {/* Elevator Pitch Builder */}
          <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#D35400]">30–60 Second Elevator Pitch:</label>
              <button
                onClick={toggleRecording}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  isRecording ? 'bg-rose-600 text-white animate-pulse' : 'bg-gray-100 text-gray-800'
                }`}
              >
                {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                <span>{isRecording ? 'Recording Pitch...' : 'Record Audio Pitch'}</span>
              </button>
            </div>

            <textarea
              value={elevatorPitch}
              onChange={(e) => setElevatorPitch(e.target.value)}
              rows={3}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-xs text-[#2C3E50]"
            />

            {recordedAudioUrl && (
              <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-emerald-600" />
                <span>Audio Elevator Pitch Recorded (0:45 s) • Ready for Portfolio</span>
              </div>
            )}
          </div>

          {/* Professional Bio */}
          <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-2">
            <label className="text-xs font-bold text-[#D35400]">Professional Bio (1-2 Sentences):</label>
            <textarea
              value={professionalBio}
              onChange={(e) => setProfessionalBio(e.target.value)}
              rows={2}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-xs text-[#2C3E50]"
            />
          </div>

          {/* Career Vision Statement */}
          <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-2">
            <label className="text-xs font-bold text-[#D35400]">Career Vision Statement:</label>
            <textarea
              value={careerVision}
              onChange={(e) => setCareerVision(e.target.value)}
              rows={2}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-xs text-[#2C3E50]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
