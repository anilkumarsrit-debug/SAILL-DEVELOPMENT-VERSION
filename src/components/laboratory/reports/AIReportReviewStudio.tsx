import React, { useState } from 'react';
import { Columns, Check, Sparkles, AlertCircle, RefreshCw, Save, CheckCircle2, Tag } from 'lucide-react';
import { dbStorage } from '../../../lib/db';

export const AIReportReviewStudio: React.FC<{
  onSaveWorkToPortfolio?: (title: string, content: string) => void;
}> = ({ onSaveWorkToPortfolio }) => {
  const [studentDraft, setStudentDraft] = useState<string>(
    `EXPERIMENTAL REPORT: TEMPERATURE SENSOR CALIBRATION\n\nAim: We want to test the LM35 temperature sensor.\n\nTheory: LM35 gives 10mV per degree celsius. So if it is 25C it gives 250mV. We measured it with Arduino.\n\nProcedure:\n1. Hook up LM35 output pin to Arduino analog pin A0.\n2. Boil water in beaker and put thermometer inside.\n3. Take voltage readings every 5 degrees as water cools down.\n\nResults & Discussion: The values were pretty close to the thermometer readings. Maximum error was like 1.2 degrees. Arduino code read analogRead value and multiplied by 5.0 / 1024.0.`
  );

  const [acceptedVersion, setAcceptedVersion] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string>('');

  const aiImprovedReport = `EXPERIMENTAL REPORT: LM35 PRECISION TEMPERATURE SENSOR CALIBRATION\n\n1. AIM:\nTo calibrate an LM35 linear analog temperature sensor against a standard glass thermometer across a 25°C to 100°C range.\n\n2. THEORETICAL BACKGROUND:\nThe LM35 device produces an output voltage directly proportional to the Celsius temperature (10.0 mV/°C sensitivity). The internal ADC of the ATmega328P microcontroller converts the analog voltage into a 10-bit digital representation according to V_out = (ADC_Value × 5.0 V) / 1023.\n\n3. EXPERIMENTAL PROCEDURE:\n1. The LM35 V_out terminal was connected to Arduino Analog Pin A0 with a 0.1 μF decoupling capacitor.\n2. Deionized water was heated to 100°C in a temperature-controlled beaker alongside a reference glass thermometer.\n3. Voltage data were sampled at 5.0°C intervals during natural convection cooling.\n\n4. RESULTS & DISCUSSION:\nEmpirical calibration demonstrated strong linearity (R² = 0.998). The maximum absolute temperature error observed was 1.2°C at 90°C, well within manufacturer component tolerances (±0.5°C at 25°C).`;

  const highlights = [
    { type: 'Vocabulary', label: 'Technical Vocabulary', count: 6, color: 'bg-amber-100 text-amber-900 border-amber-300' },
    { type: 'Grammar', label: 'Grammar & Mechanics', count: 4, color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
    { type: 'Structure', label: 'IEEE Section Layout', count: 5, color: 'bg-blue-100 text-blue-900 border-blue-300' },
    { type: 'Tone', label: 'Passive Objective Tone', count: 3, color: 'bg-purple-100 text-purple-900 border-purple-300' },
    { type: 'Formatting', label: 'SI Unit Formatting', count: 4, color: 'bg-teal-100 text-teal-900 border-teal-300' }
  ];

  const handleApplyAiImprovements = async () => {
    try {
      setAcceptedVersion(true);
      setSaveStatus('Applying AI Refinements & Saving to Portfolio...');

      await dbStorage.savePortfolioItem({
        id: `ai-review-${Date.now()}`,
        moduleId: 'report-writing',
        moduleTitle: 'Report Writing & Technical Communication',
        title: 'LM35 Temperature Sensor Calibration - AI Refined Report',
        category: 'report',
        content: aiImprovedReport,
        score: 96,
        createdAt: new Date().toISOString()
      });

      if (onSaveWorkToPortfolio) {
        onSaveWorkToPortfolio('LM35 Calibration Report (AI Enhanced)', aiImprovedReport);
      }

      setSaveStatus('Successfully saved improved version to Portfolio!');
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
              <Columns className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-[#E67E22] uppercase tracking-wider">
                Module 11 • Section 8
              </span>
              <h2 className="text-xl font-bold text-[#D35400] font-heading">
                AI Report Review Studio (Side-by-Side Comparison)
              </h2>
            </div>
          </div>

          <button
            onClick={handleApplyAiImprovements}
            className="px-4 py-2 bg-[#D35400] hover:bg-[#E67E22] text-white font-bold text-xs rounded-xl transition flex items-center gap-2 shadow-2xs"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            Accept & Save AI Refined Version
          </button>
        </div>

        {saveStatus && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{saveStatus}</span>
          </div>
        )}
      </div>

      {/* Categories & Highlights Filter Bar */}
      <div className="srit-card p-4 bg-white border border-[#FAD7A0] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-[#E67E22]" />
          <span className="text-xs font-bold text-[#D35400] uppercase font-heading">
            AI Enhancements Applied (22 Changes):
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {highlights.map((h) => (
            <span
              key={h.type}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border ${h.color} flex items-center gap-1`}
            >
              <span>{h.label}</span>
              <span className="bg-white px-1.5 py-0.2 rounded-full border border-gray-200">{h.count}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Side-by-Side Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left Column: Student Original Draft */}
        <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-3">
          <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-2">
            <h3 className="text-xs font-bold text-[#D35400] uppercase font-heading">
              Student Original Draft
            </h3>
            <span className="text-[10px] font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
              Original Input
            </span>
          </div>

          <textarea
            rows={16}
            value={studentDraft}
            onChange={(e) => setStudentDraft(e.target.value)}
            className="w-full p-3 text-xs rounded-xl border border-rose-200 bg-rose-50/30 text-rose-950 font-mono leading-relaxed focus:ring-2 focus:ring-[#D35400]"
          />
        </div>

        {/* Right Column: AI Improved Version */}
        <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-3">
          <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-2">
            <h3 className="text-xs font-bold text-emerald-800 uppercase font-heading flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>AI Refined Technical Report</span>
            </h3>
            <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 font-bold">
              IEEE Formatted
            </span>
          </div>

          <div className="p-3 text-xs rounded-xl border border-emerald-200 bg-emerald-50/40 text-emerald-950 font-mono leading-relaxed min-h-[340px] whitespace-pre-line">
            {aiImprovedReport}
          </div>
        </div>
      </div>
    </div>
  );
};
