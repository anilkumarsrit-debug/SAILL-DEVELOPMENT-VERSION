import React, { useState } from 'react';
import { BookMarked, Sparkles, CheckCircle2, ChevronRight, Save, Wand2, FileText } from 'lucide-react';
import { dbStorage } from '../../../lib/db';

interface ProjectSection {
  id: string;
  num: string;
  name: string;
  guidance: string;
  aiPromptHelper: string;
  sampleContent: string;
}

const PROJECT_SECTIONS: ProjectSection[] = [
  {
    id: 'title_page',
    num: '1',
    name: 'Title Page',
    guidance: 'State the exact project title, student names, roll numbers, department, college name, and date.',
    aiPromptHelper: 'Format a formal IEEE engineering capstone project title page.',
    sampleContent: 'DESIGN AND IMPLEMENTATION OF AN IOT-BASED SMART GRID ENERGY MONITORING SYSTEM\n\nA Project Report Submitted in Partial Fulfillment for B.Tech in Electrical & Electronics Engineering\n\nBy:\n1. A. Rakesh (23R26A0201)\n2. P. Sneha (23R26A0202)\n\nDepartment of EEE, Srinivasa Ramanujan Institute of Technology (SRIT), Anantapur - 2026'
  },
  {
    id: 'certificate',
    num: '2',
    name: 'Bonafide Certificate',
    guidance: 'Formal certificate signed by Project Guide, Head of Department (HOD), and External Examiner.',
    aiPromptHelper: 'Generate standard college project bonafide certificate text.',
    sampleContent: 'CERTIFICATE\n\nThis is to certify that the project report entitled "IoT-based Smart Grid" is a bonafide record of work done by A. Rakesh during the academic year 2025-2026 under my supervision.'
  },
  {
    id: 'acknowledgement',
    num: '3',
    name: 'Acknowledgement',
    guidance: 'Express formal gratitude to project guide, HOD, principal, lab technicians, and peers.',
    aiPromptHelper: 'Draft a professional engineering project acknowledgement section.',
    sampleContent: 'We express our deepest gratitude to our project guide Dr. M. Sateesh and HOD Dr. V. Ramesh for their continuous guidance, technical insights, and encouragement throughout this project.'
  },
  {
    id: 'abstract',
    num: '4',
    name: 'Abstract (Executive Summary)',
    guidance: 'Standalone 150-250 word distillation covering Problem, Methodology, Results, and Significance.',
    aiPromptHelper: 'Summarize a smart grid monitoring capstone project into a 200-word IEEE abstract.',
    sampleContent: 'Abstract—Modern power distribution networks face significant energy loss and load management challenges. This paper presents an IoT-enabled smart grid energy monitoring system utilizing ESP32 microcontrollers and cloud analytics. Real-time voltage, current, and power factor data are sampled at 100 Hz and transmitted via MQTT protocol. Experimental validation demonstrates a power measurement accuracy of 99.2% with latency under 150ms.'
  },
  {
    id: 'toc',
    num: '5',
    name: 'Table of Contents & List of Figures',
    guidance: 'Numbered index of all chapters, section headings, table captions, and figure titles with page numbers.',
    aiPromptHelper: 'Create a structured IEEE chapter table of contents.',
    sampleContent: 'CHAPTER 1: INTRODUCTION........................................................... 1\n  1.1 Background........................................................................... 2\n  1.2 Problem Statement............................................................. 3\nCHAPTER 2: LITERATURE REVIEW.................................................... 5\nCHAPTER 3: METHODOLOGY & ARCHITECTURE............................... 12'
  },
  {
    id: 'introduction',
    num: '6',
    name: 'Chapter 1: Introduction',
    guidance: 'Define domain background, motivation, problem statement, objectives, and scope.',
    aiPromptHelper: 'Draft Chapter 1 introduction for smart grid IoT energy monitoring.',
    sampleContent: '1.1 Background\nEnergy efficiency and real-time telemetry have become critical requirements in modern electrical grids. Traditional electromechanical metering lacks automated fault detection and remote data logging capabilities.\n\n1.2 Problem Statement\nUtilities lose up to 14% of generated power due to unmonitored transmission losses and phase imbalances.'
  },
  {
    id: 'literature_review',
    num: '7',
    name: 'Chapter 2: Literature Review',
    guidance: 'Critically analyze 5-10 existing research papers, patents, or industry solutions with IEEE citations.',
    aiPromptHelper: 'Review recent IEEE publications on smart metering and identify research gaps.',
    sampleContent: '2.1 Survey of Existing Systems\nKumar et al. [1] proposed a GSM-based metering unit. However, GSM modules incur recurring SMS costs and bandwidth constraints. Smith et al. [2] introduced Wi-Fi nodes but lacked local failover storage.'
  },
  {
    id: 'methodology',
    num: '8',
    name: 'Chapter 3: Methodology',
    guidance: 'Detail mathematical formulations, algorithmic workflow, hardware component selection, and software setup.',
    aiPromptHelper: 'Explain MQTT protocol sampling methodology and sensor calibration.',
    sampleContent: '3.1 System Architecture\nThe proposed system comprises three primary layers: Data Acquisition Layer (ACS712 current & ZMPT101B voltage sensors), Processing Layer (ESP32 node), and Cloud Dashboard Layer (ThingSpeak API).'
  },
  {
    id: 'system_design',
    num: '9',
    name: 'Chapter 4: System Design & Schematics',
    guidance: 'Provide block diagrams, circuit schematics, UML sequence diagrams, and hardware wiring diagrams.',
    aiPromptHelper: 'Describe circuit schematic and pin assignments for ESP32 voltage sensor interfacing.',
    sampleContent: '4.1 Hardware Circuit Schematic\nThe ZMPT101B voltage transformer output is biased with a 1.65V DC offset to map AC sine waves (±2.5V) into the ESP32 0-3.3V ADC input range.'
  },
  {
    id: 'implementation',
    num: '10',
    name: 'Chapter 5: Implementation',
    guidance: 'Document physical assembly, code snippets, library dependencies, and deployment steps.',
    aiPromptHelper: 'Provide modular C++ code snippets for ESP32 ADC sampling and RMS calculation.',
    sampleContent: '5.1 Software Firmware Development\nThe firmware executes a continuous 1000-point sampling loop to calculate Root Mean Square (RMS) voltage and current values:\n\nfloat rmsVoltage = sqrt(sumVoltageSq / sampleCount) * calibrationFactor;'
  },
  {
    id: 'results',
    num: '11',
    name: 'Chapter 6: Results & Discussion',
    guidance: 'Present empirical data graphs, performance metrics, accuracy tables, and efficiency charts.',
    aiPromptHelper: 'Format empirical accuracy data into a comparative results section.',
    sampleContent: '6.1 Accuracy Comparison\nEmpirical measurements were compared against a calibrated Fluke 87V multimeter. Across loads from 100W to 2000W, the mean absolute percentage error (MAPE) was recorded as 0.78%.'
  },
  {
    id: 'testing',
    num: '12',
    name: 'Chapter 7: Testing & Verification',
    guidance: 'Detail unit testing, integration testing, thermal stress testing, and fault tolerance validation.',
    aiPromptHelper: 'Document load testing procedures and edge-case network drop scenarios.',
    sampleContent: '7.1 Fault Tolerance Testing\nWhen Wi-Fi connectivity was intentionally disrupted for 30 minutes, the ESP32 cached 1,800 telemetry records to onboard SPIFFS flash memory, successfully syncing upon reconnect.'
  },
  {
    id: 'conclusion',
    num: '13',
    name: 'Chapter 8: Conclusion',
    guidance: 'Summarize key achievements against project objectives and emphasize main project deliverables.',
    aiPromptHelper: 'Summarize capstone project conclusions and societal impact.',
    sampleContent: '8.1 Concluding Remarks\nThe IoT-based Smart Grid Energy Monitoring System successfully demonstrated real-time telemetry, high precision (99.2%), and cloud logging at low deployment cost.'
  },
  {
    id: 'future_scope',
    num: '14',
    name: 'Future Scope',
    guidance: 'Outline potential expansions (e.g., machine learning predictive maintenance, mobile app integration).',
    aiPromptHelper: 'Propose AI and edge computing future enhancements for the project.',
    sampleContent: 'Future research will focus on integrating edge TinyML models directly on microcontrollers to enable predictive arc-fault detection prior to circuit breaker tripping.'
  },
  {
    id: 'references',
    num: '15',
    name: 'References (IEEE Style)',
    guidance: 'Complete list of peer-reviewed journals, books, and standards in IEEE citation format.',
    aiPromptHelper: 'Format references according to IEEE bibliographic guidelines.',
    sampleContent: '[1] R. Kumar and S. Patel, "IoT smart meters in smart grid," IEEE Trans. Smart Grid, vol. 12, no. 3, pp. 2100–2108, 2021.\n[2] IEEE Standard for Smart Metering Protocols, IEEE Std 1379-2020.'
  },
  {
    id: 'appendices',
    num: '16',
    name: 'Appendices',
    guidance: 'Raw datasheet excerpts, full source code listings, bill of materials (BOM), and calibration logs.',
    aiPromptHelper: 'Draft Appendix A: Component Bill of Materials (BOM) table.',
    sampleContent: 'APPENDIX A: BILL OF MATERIALS (BOM)\n1. ESP32 Development Board - $4.50\n2. ZMPT101B Voltage Sensor Module - $2.20\n3. ACS712-30A Current Sensor - $1.80\nTotal Project Prototype Cost: $18.50'
  }
];

export const ProjectReportBuilder: React.FC<{
  onSaveWorkToPortfolio?: (title: string, content: string) => void;
}> = ({ onSaveWorkToPortfolio }) => {
  const [activeSectionIdx, setActiveSectionIdx] = useState<number>(3); // default to Abstract
  const [sectionContents, setSectionContents] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    PROJECT_SECTIONS.forEach((s) => {
      initial[s.id] = s.sampleContent;
    });
    return initial;
  });

  const [aiAssistantText, setAiAssistantText] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string>('');

  const currentSection = PROJECT_SECTIONS[activeSectionIdx];

  const handleTextChange = (text: string) => {
    setSectionContents((prev) => ({
      ...prev,
      [currentSection.id]: text
    }));
  };

  const handleGenerateAiGuidance = () => {
    setIsAiLoading(true);
    setAiAssistantText('AI Engine analyzing section requirements...');
    setTimeout(() => {
      setAiAssistantText(
        `AI Writing Advice for [${currentSection.name}]:\n- Maintain objective passive voice.\n- Ensure exact quantifiers (e.g., percentages, SI units).\n- Keep paragraph length between 4 and 6 lines for peak readability.`
      );
      setIsAiLoading(false);
    }, 600);
  };

  const handleSaveProjectReport = async () => {
    try {
      setSaveStatus('Saving complete project report to IndexedDB...');
      const fullReportText = PROJECT_SECTIONS.map(
        (s) => `====================\n${s.num}. ${s.name.toUpperCase()}\n====================\n${sectionContents[s.id] || ''}\n`
      ).join('\n');

      await dbStorage.savePortfolioItem({
        id: `project-report-${Date.now()}`,
        moduleId: 'report-writing',
        moduleTitle: 'Report Writing & Technical Communication',
        title: 'B.Tech Capstone Project Report - Smart Grid IoT',
        category: 'report',
        content: fullReportText,
        score: 95,
        createdAt: new Date().toISOString()
      });

      if (onSaveWorkToPortfolio) {
        onSaveWorkToPortfolio('B.Tech Capstone Project Report', fullReportText.slice(0, 1000) + '...');
      }

      setSaveStatus('Project Report successfully saved to Portfolio & IndexedDB!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (e) {
      setSaveStatus('Error saving report.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-[#D35400]">
              <BookMarked className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-[#E67E22] uppercase tracking-wider">
                Module 11 • Section 4
              </span>
              <h2 className="text-xl font-bold text-[#D35400] font-heading">
                Engineering Project Report Builder
              </h2>
            </div>
          </div>

          <button
            onClick={handleSaveProjectReport}
            className="px-4 py-2 bg-[#D35400] hover:bg-[#E67E22] text-white font-bold text-xs rounded-xl transition flex items-center gap-2 shadow-2xs"
          >
            <Save className="w-4 h-4" />
            Save Full Project Report
          </button>
        </div>

        {saveStatus && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{saveStatus}</span>
          </div>
        )}
      </div>

      {/* Main 16-Section Navigator & Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Section Navigation List (4 cols) */}
        <div className="lg:col-col-span-4 srit-card p-4 bg-white border border-[#FAD7A0] space-y-2 max-h-[600px] overflow-y-auto">
          <h3 className="text-xs font-bold text-[#D35400] uppercase font-heading tracking-wider mb-3 flex items-center justify-between">
            <span>16 Required Report Sections</span>
            <span className="text-[10px] text-[#E67E22] font-mono">IEEE Standard</span>
          </h3>

          <div className="space-y-1">
            {PROJECT_SECTIONS.map((sec, idx) => {
              const isFilled = (sectionContents[sec.id] || '').trim().length > 10;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSectionIdx(idx)}
                  className={`w-full p-2.5 rounded-xl text-left text-xs transition flex items-center justify-between border ${
                    activeSectionIdx === idx
                      ? 'bg-[#D35400] text-white border-[#D35400] font-bold shadow-2xs'
                      : 'bg-[#FFF8F0] text-[#2C3E50] border-[#FAD7A0] hover:bg-[#FAD7A0]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className={`w-5 h-5 rounded-full text-[10px] font-mono flex items-center justify-center shrink-0 ${
                        activeSectionIdx === idx
                          ? 'bg-white text-[#D35400] font-bold'
                          : 'bg-[#FAD7A0] text-[#2C3E50]'
                      }`}
                    >
                      {sec.num}
                    </span>
                    <span className="truncate">{sec.name}</span>
                  </div>
                  {isFilled && (
                    <CheckCircle2
                      className={`w-3.5 h-3.5 shrink-0 ${
                        activeSectionIdx === idx ? 'text-white' : 'text-emerald-600'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section Editor & AI Helper (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
            <div className="flex flex-wrap items-center justify-between border-b border-[#FAD7A0] pb-3 gap-2">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#E67E22] uppercase">
                  Section {currentSection.num} of 16
                </span>
                <h3 className="text-base font-bold text-[#D35400] font-heading">
                  {currentSection.name}
                </h3>
              </div>

              <button
                onClick={handleGenerateAiGuidance}
                disabled={isAiLoading}
                className="px-3 py-1.5 bg-[#FFF8F0] border border-[#FAD7A0] hover:bg-[#FAD7A0] text-[#D35400] font-bold text-xs rounded-lg transition flex items-center gap-1.5"
              >
                <Wand2 className="w-3.5 h-3.5 text-[#E67E22]" />
                {isAiLoading ? 'Analyzing...' : 'AI Guidance'}
              </button>
            </div>

            <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-xs text-[#2C3E50] space-y-1">
              <p className="font-bold text-[#D35400] flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                Guidance & Requirements:
              </p>
              <p>{currentSection.guidance}</p>
            </div>

            {aiAssistantText && (
              <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-xl text-xs whitespace-pre-line font-mono animate-fadeIn">
                {aiAssistantText}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#2C3E50] uppercase flex items-center justify-between">
                <span>Section Draft Content</span>
                <span className="text-[10px] text-gray-500 font-normal">
                  {(sectionContents[currentSection.id] || '').split(/\s+/).filter(Boolean).length} words
                </span>
              </label>
              <textarea
                rows={10}
                value={sectionContents[currentSection.id] || ''}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder={`Write or paste section content for ${currentSection.name}...`}
                className="w-full p-3 text-xs rounded-xl border border-[#FAD7A0] focus:ring-2 focus:ring-[#D35400] font-mono leading-relaxed text-[#2C3E50]"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setActiveSectionIdx((prev) => Math.max(0, prev - 1))}
                disabled={activeSectionIdx === 0}
                className="px-3 py-1.5 text-xs font-bold text-[#2C3E50] bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-40"
              >
                Previous Section
              </button>

              <button
                onClick={() => setActiveSectionIdx((prev) => Math.min(PROJECT_SECTIONS.length - 1, prev + 1))}
                disabled={activeSectionIdx === PROJECT_SECTIONS.length - 1}
                className="px-4 py-1.5 text-xs font-bold text-white bg-[#D35400] hover:bg-[#E67E22] rounded-lg flex items-center gap-1 disabled:opacity-40"
              >
                Next Section
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
