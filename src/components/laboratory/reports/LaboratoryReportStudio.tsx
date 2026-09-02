import React, { useState, useEffect } from 'react';
import { FileCode, Save, Sparkles, History, Download, CheckCircle, RefreshCw, Layers } from 'lucide-react';
import { dbStorage } from '../../../lib/db';

interface LabReportData {
  title: string;
  aim: string;
  objectives: string;
  equipment: string;
  theory: string;
  procedure: string;
  observations: string;
  calculations: string;
  results: string;
  discussion: string;
  conclusion: string;
  precautions: string;
  references: string;
}

const DEFAULT_LAB_REPORT: LabReportData = {
  title: 'Experiment 04: Verification of Kirchhoff\'s Voltage and Current Laws in DC Mesh Circuits',
  aim: 'To experimentally verify Kirchhoff\'s Voltage Law (KVL) and Kirchhoff\'s Current Law (KCL) in a multi-loop DC circuit.',
  objectives: '1. Construct a two-loop DC circuit using discrete resistors and DC power supply.\n2. Measure individual loop voltages and node currents.\n3. Compare empirical values against theoretical calculations.',
  equipment: '1. Regulated Dual DC Power Supply (0-30V)\n2. Digital Multimeter (Fluke 87V)\n3. Resistors: 100Ω, 220Ω, 330Ω, 470Ω (1/4W, 5% tolerance)\n4. Breadboard and Jumper Wires',
  theory: 'Kirchhoff\'s Voltage Law states that the algebraic sum of all electrical potential differences around any closed circuit loop is equal to zero (∑V = 0). Kirchhoff\'s Current Law states that the total current entering a junction equals the total current leaving the node (∑I_in = ∑I_out).',
  procedure: '1. Assemble the two-loop circuit on the breadboard as per Figure 4.1.\n2. Apply a 10V DC input across node A and B.\n3. Measure voltage drop across R1, R2, and R3 using the DMM.\n4. Measure branch currents I1, I2, and I3 by inserting the ammeter in series.\n5. Record readings in Observation Table 4.1.',
  observations: 'Table 4.1: Empirical Voltage and Current Measurements\n- Input Voltage (V_in): 10.02 V\n- V_R1 (100Ω): 3.01 V | Measured I1: 30.1 mA\n- V_R2 (220Ω): 4.40 V | Measured I2: 20.0 mA\n- V_R3 (330Ω): 2.61 V | Measured I3: 10.1 mA',
  calculations: 'Theoretical Mesh Calculations:\nLoop 1: 10 - 100*I1 - 220*(I1 - I2) = 0 => 320*I1 - 220*I2 = 10\nLoop 2: -220*(I2 - I1) - 330*I2 = 0 => -220*I1 + 550*I2 = 0\nSolving simultaneously:\nI1 = 30.3 mA, I2 = 12.1 mA\nPercentage Error = (|Empirical - Theoretical| / Theoretical) * 100 = 0.66%',
  results: '1. Kirchhoff\'s Voltage Law verified with a maximum deviation of 0.66%.\n2. Kirchhoff\'s Current Law satisfied at Node B (I1 = I2 + I3 => 30.1 mA ≈ 20.0 mA + 10.1 mA).',
  discussion: 'Minor deviations between measured and theoretical values are attributed to resistor component tolerance (±5%), contact resistance on the breadboard, and digital multimeter internal resistance.',
  conclusion: 'The experiment successfully validated KVL and KCL in a two-mesh DC network under laboratory conditions.',
  precautions: '1. Ensure power supply is turned off during circuit wiring changes.\n2. Do not exceed resistor power dissipation limits (P = I²R < 0.25W).\n3. Verify DMM polarity before taking DC current measurements.',
  references: '[1] C. Alexander and M. Sadiku, Fundamentals of Electric Circuits, 6th ed., McGraw-Hill, 2017.\n[2] R26 Electrical Engineering Laboratory Manual, SRIT Anantapur, 2026.'
};

export const LaboratoryReportStudio: React.FC<{
  onSaveWorkToPortfolio?: (title: string, content: string) => void;
}> = ({ onSaveWorkToPortfolio }) => {
  const [formData, setFormData] = useState<LabReportData>(DEFAULT_LAB_REPORT);
  const [saveStatus, setSaveStatus] = useState<string>('');
  const [historyLogs, setHistoryLogs] = useState<Array<{ timestamp: string; version: string }>>([]);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  useEffect(() => {
    // Load existing report draft from storage if available
    const loadDraft = async () => {
      try {
        const progress = await dbStorage.getProgressMap();
        if (progress['report-writing']?.savedNotes || progress['report-writing']?.reflectionNotes) {
          // Check if notes contains saved json
          try {
            const notesText = progress['report-writing'].savedNotes || progress['report-writing'].reflectionNotes;
            const parsed = JSON.parse(notesText);
            if (parsed.labReport) {
              setFormData(parsed.labReport);
            }
          } catch {
            // keep default
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadDraft();
  }, []);

  const handleChange = (field: keyof LabReportData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveDraft = async () => {
    try {
      setSaveStatus('Saving report to Laboratory Notebook...');
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Save to IndexedDB
      await dbStorage.savePortfolioItem({
        id: `lab-report-${Date.now()}`,
        moduleId: 'report-writing',
        moduleTitle: 'Report Writing & Technical Communication',
        title: formData.title || 'Laboratory Report',
        category: 'report',
        content: JSON.stringify(formData, null, 2),
        score: 92,
        createdAt: new Date().toISOString()
      });

      if (onSaveWorkToPortfolio) {
        onSaveWorkToPortfolio(formData.title, `LAB REPORT:\n\nAIM: ${formData.aim}\n\nRESULTS: ${formData.results}`);
      }

      setHistoryLogs((prev) => [{ timestamp: timeStr, version: formData.title.slice(0, 30) }, ...prev]);
      setSaveStatus('Successfully saved to IndexedDB & Portfolio!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (e) {
      setSaveStatus('Failed to save report.');
    }
  };

  const handleResetTemplate = () => {
    if (window.confirm('Reset form to default engineering sample lab report?')) {
      setFormData(DEFAULT_LAB_REPORT);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-[#D35400]">
              <FileCode className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-[#E67E22] uppercase tracking-wider">
                Module 11 • Section 3
              </span>
              <h2 className="text-xl font-bold text-[#D35400] font-heading">
                Laboratory Report Writing Studio
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition ${
                activeTab === 'editor'
                  ? 'bg-[#D35400] text-white shadow-2xs'
                  : 'bg-[#FFF8F0] text-[#2C3E50] border border-[#FAD7A0]'
              }`}
            >
              Editor Mode
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition ${
                activeTab === 'preview'
                  ? 'bg-[#D35400] text-white shadow-2xs'
                  : 'bg-[#FFF8F0] text-[#2C3E50] border border-[#FAD7A0]'
              }`}
            >
              Formatted Report
            </button>
            <button
              onClick={handleSaveDraft}
              className="px-4 py-1.5 bg-[#E67E22] hover:bg-[#D35400] text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow-2xs"
            >
              <Save className="w-4 h-4" />
              Save to Portfolio
            </button>
          </div>
        </div>

        {saveStatus && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{saveStatus}</span>
          </div>
        )}
      </div>

      {activeTab === 'editor' ? (
        /* 13-Field Editor Layout */
        <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-5">
          <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-3">
            <h3 className="text-sm font-bold text-[#D35400] uppercase font-heading tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#E67E22]" />
              <span>Standard 13-Section Engineering Lab Report Template</span>
            </h3>
            <button
              onClick={handleResetTemplate}
              className="text-xs text-[#E67E22] hover:text-[#D35400] font-bold flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Sample
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-[#2C3E50] uppercase">1. Experiment Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-[#FAD7A0] focus:ring-2 focus:ring-[#D35400] font-semibold text-[#2C3E50]"
              />
            </div>

            {/* Aim */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#2C3E50] uppercase">2. Aim</label>
              <textarea
                rows={3}
                value={formData.aim}
                onChange={(e) => handleChange('aim', e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-[#FAD7A0] focus:ring-2 focus:ring-[#D35400] font-mono text-[#2C3E50]"
              />
            </div>

            {/* Objectives */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#2C3E50] uppercase">3. Objectives</label>
              <textarea
                rows={3}
                value={formData.objectives}
                onChange={(e) => handleChange('objectives', e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-[#FAD7A0] focus:ring-2 focus:ring-[#D35400] font-mono text-[#2C3E50]"
              />
            </div>

            {/* Equipment */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#2C3E50] uppercase">4. Equipment & Components</label>
              <textarea
                rows={3}
                value={formData.equipment}
                onChange={(e) => handleChange('equipment', e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-[#FAD7A0] focus:ring-2 focus:ring-[#D35400] font-mono text-[#2C3E50]"
              />
            </div>

            {/* Theory */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#2C3E50] uppercase">5. Theoretical Background</label>
              <textarea
                rows={3}
                value={formData.theory}
                onChange={(e) => handleChange('theory', e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-[#FAD7A0] focus:ring-2 focus:ring-[#D35400] font-mono text-[#2C3E50]"
              />
            </div>

            {/* Procedure */}
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-[#2C3E50] uppercase">6. Experimental Procedure</label>
              <textarea
                rows={3}
                value={formData.procedure}
                onChange={(e) => handleChange('procedure', e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-[#FAD7A0] focus:ring-2 focus:ring-[#D35400] font-mono text-[#2C3E50]"
              />
            </div>

            {/* Observations */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#2C3E50] uppercase">7. Observations & Data Tables</label>
              <textarea
                rows={3}
                value={formData.observations}
                onChange={(e) => handleChange('observations', e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-[#FAD7A0] focus:ring-2 focus:ring-[#D35400] font-mono text-[#2C3E50]"
              />
            </div>

            {/* Calculations */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#2C3E50] uppercase">8. Mathematical Calculations & Error Analysis</label>
              <textarea
                rows={3}
                value={formData.calculations}
                onChange={(e) => handleChange('calculations', e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-[#FAD7A0] focus:ring-2 focus:ring-[#D35400] font-mono text-[#2C3E50]"
              />
            </div>

            {/* Results */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#2C3E50] uppercase">9. Results & Key Findings</label>
              <textarea
                rows={3}
                value={formData.results}
                onChange={(e) => handleChange('results', e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-[#FAD7A0] focus:ring-2 focus:ring-[#D35400] font-mono text-[#2C3E50]"
              />
            </div>

            {/* Discussion */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#2C3E50] uppercase">10. Discussion & Error Sources</label>
              <textarea
                rows={3}
                value={formData.discussion}
                onChange={(e) => handleChange('discussion', e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-[#FAD7A0] focus:ring-2 focus:ring-[#D35400] font-mono text-[#2C3E50]"
              />
            </div>

            {/* Conclusion */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#2C3E50] uppercase">11. Conclusion</label>
              <textarea
                rows={2}
                value={formData.conclusion}
                onChange={(e) => handleChange('conclusion', e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-[#FAD7A0] focus:ring-2 focus:ring-[#D35400] font-mono text-[#2C3E50]"
              />
            </div>

            {/* Precautions */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#2C3E50] uppercase">12. Lab Safety & Precautions</label>
              <textarea
                rows={2}
                value={formData.precautions}
                onChange={(e) => handleChange('precautions', e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-[#FAD7A0] focus:ring-2 focus:ring-[#D35400] font-mono text-[#2C3E50]"
              />
            </div>

            {/* References */}
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-[#2C3E50] uppercase">13. References (IEEE Style)</label>
              <textarea
                rows={2}
                value={formData.references}
                onChange={(e) => handleChange('references', e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-[#FAD7A0] focus:ring-2 focus:ring-[#D35400] font-mono text-[#2C3E50]"
              />
            </div>
          </div>
        </div>
      ) : (
        /* Formatted Engineering Report Preview */
        <div className="srit-card p-8 bg-white border border-[#FAD7A0] space-y-6 shadow-sm">
          <div className="text-center border-b border-[#FAD7A0] pb-4 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#E67E22] font-bold">
              SRINIVASA RAMANUJAN INSTITUTE OF TECHNOLOGY • COMMUNICATIVE ENGLISH LAB
            </span>
            <h1 className="text-lg font-bold text-[#D35400] uppercase font-heading">{formData.title}</h1>
            <p className="text-xs text-[#2C3E50] font-mono">Date: {new Date().toLocaleDateString()} | Student ID: R26-EEE-104</p>
          </div>

          <div className="space-y-4 text-xs text-[#2C3E50] leading-relaxed font-serif">
            <div>
              <h4 className="font-bold text-[#D35400] uppercase font-sans border-b border-gray-100 pb-1 mb-1">1. Aim</h4>
              <p>{formData.aim}</p>
            </div>

            <div>
              <h4 className="font-bold text-[#D35400] uppercase font-sans border-b border-gray-100 pb-1 mb-1">2. Objectives</h4>
              <p className="whitespace-pre-line">{formData.objectives}</p>
            </div>

            <div>
              <h4 className="font-bold text-[#D35400] uppercase font-sans border-b border-gray-100 pb-1 mb-1">3. Equipment & Apparatus</h4>
              <p className="whitespace-pre-line font-mono text-[11px] bg-gray-50 p-2.5 rounded border border-gray-200">{formData.equipment}</p>
            </div>

            <div>
              <h4 className="font-bold text-[#D35400] uppercase font-sans border-b border-gray-100 pb-1 mb-1">4. Theory</h4>
              <p>{formData.theory}</p>
            </div>

            <div>
              <h4 className="font-bold text-[#D35400] uppercase font-sans border-b border-gray-100 pb-1 mb-1">5. Procedure</h4>
              <p className="whitespace-pre-line">{formData.procedure}</p>
            </div>

            <div>
              <h4 className="font-bold text-[#D35400] uppercase font-sans border-b border-gray-100 pb-1 mb-1">6. Observations & Calculations</h4>
              <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-lg font-mono text-[11px] space-y-2">
                <p><strong>Observation Data:</strong></p>
                <p className="whitespace-pre-line">{formData.observations}</p>
                <p className="border-t border-[#FAD7A0] pt-2"><strong>Calculations:</strong></p>
                <p className="whitespace-pre-line">{formData.calculations}</p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-[#D35400] uppercase font-sans border-b border-gray-100 pb-1 mb-1">7. Results & Discussion</h4>
              <p className="font-semibold text-emerald-900">{formData.results}</p>
              <p className="mt-1">{formData.discussion}</p>
            </div>

            <div>
              <h4 className="font-bold text-[#D35400] uppercase font-sans border-b border-gray-100 pb-1 mb-1">8. Conclusion & Precautions</h4>
              <p><strong>Conclusion:</strong> {formData.conclusion}</p>
              <p className="mt-1 text-gray-600"><strong>Precautions:</strong> {formData.precautions}</p>
            </div>

            <div>
              <h4 className="font-bold text-[#D35400] uppercase font-sans border-b border-gray-100 pb-1 mb-1">9. References</h4>
              <p className="font-mono text-[10px] text-gray-500 whitespace-pre-line">{formData.references}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
