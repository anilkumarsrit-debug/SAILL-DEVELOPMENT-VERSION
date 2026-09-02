import React, { useState } from 'react';
import { FileText, Cpu, Terminal, Wrench, Settings, BookOpen, Save, CheckCircle2, Copy } from 'lucide-react';
import { dbStorage } from '../../../lib/db';

interface DocTemplate {
  id: string;
  name: string;
  category: string;
  icon: React.ReactNode;
  overview: string;
  sampleContent: {
    documentTitle: string;
    version: string;
    targetAudience: string;
    overviewSection: string;
    prerequisites: string;
    stepByStepInstructions: string;
    troubleshootingNotes: string;
    safetyPrecautions: string;
  };
}

const DOC_TEMPLATES: DocTemplate[] = [
  {
    id: 'user_manual',
    name: 'User Manual',
    category: 'Consumer & End-User',
    icon: <BookOpen className="w-4 h-4" />,
    overview: 'Clear, jargon-free instructions guiding end-users through product setup, operation, and feature utilization.',
    sampleContent: {
      documentTitle: 'SRIT Smart Energy Monitor - Model SEM-2026 User Guide',
      version: 'v2.1.0',
      targetAudience: 'Facilities Managers and Industrial Technicians',
      overviewSection: 'The SEM-2026 Smart Energy Monitor measures real-time 3-phase AC voltage, current, power factor, and cumulative kWh consumption.',
      prerequisites: '1. Standard 230V AC Single Phase or 415V AC 3-Phase power source.\n2. Wi-Fi / Ethernet LAN with outbound Port 8883 open.',
      stepByStepInstructions: 'Step 1: Mount unit on DIN rail.\nStep 2: Connect CT current transformers around Phase A, B, C conductors.\nStep 3: Power unit and scan QR code on LCD display to complete Wi-Fi setup.',
      troubleshootingNotes: 'Issue: Red LED blinking.\nSolution: Check Wi-Fi password or gateway firewall settings.',
      safetyPrecautions: 'WARNING: Ensure main circuit breaker is isolated prior to current transformer installation.'
    }
  },
  {
    id: 'installation_guide',
    name: 'Installation Guide',
    category: 'Field Engineering',
    icon: <Wrench className="w-4 h-4" />,
    overview: 'Step-by-step physical assembly, wiring, and mechanical mounting procedures for field engineers.',
    sampleContent: {
      documentTitle: 'High-Speed Optical Transceiver Module Installation Guide',
      version: 'v1.0.4',
      targetAudience: 'Network Infrastructure Engineers',
      overviewSection: 'This guide outlines hot-swappable installation procedure for 100G QSFP28 optical modules in enterprise switches.',
      prerequisites: '1. ESD grounding wrist strap.\n2. Fiber optical power meter and cleaning swabs.',
      stepByStepInstructions: '1. Attach anti-static ESD wrist strap.\n2. Remove dust plug from QSFP28 slot.\n3. Align transceiver with slot latch facing upward and slide until audible click.',
      troubleshootingNotes: 'If link LED remains amber, inspect fiber ferrule endface with optical microscope.',
      safetyPrecautions: 'CLASS 1 LASER PRODUCT: Do not stare directly into optical port apertures.'
    }
  },
  {
    id: 'software_doc',
    name: 'Software Architecture Doc',
    category: 'Software Engineering',
    icon: <Cpu className="w-4 h-4" />,
    overview: 'Architectural blueprints, module dependency diagrams, data models, and deployment topologies.',
    sampleContent: {
      documentTitle: 'Microservices Data Pipeline Architecture Specification',
      version: 'v3.0',
      targetAudience: 'Software Architects and DevOps Engineers',
      overviewSection: 'High-throughput real-time telemetry processing pipeline utilizing Kafka event streaming and Redis caching.',
      prerequisites: 'Docker 24.0+, Kubernetes 1.28+, PostgreSQL 16.',
      stepByStepInstructions: '1. Helm install kafka-operator in namespace telemetry.\n2. Deploy ingress controller with TLS termination.\n3. Run db migration script: npm run db:migrate.',
      troubleshootingNotes: 'Kafka consumer lag > 5000: Scale consumer deployment replicas from 3 to 6.',
      safetyPrecautions: 'Never store plain-text DB credentials in repository. Use Vault secrets manager.'
    }
  },
  {
    id: 'api_doc',
    name: 'API Documentation',
    category: 'Developer APIs',
    icon: <Terminal className="w-4 h-4" />,
    overview: 'RESTful / GraphQL endpoint specifications, request payloads, authentication headers, and response status codes.',
    sampleContent: {
      documentTitle: 'RESTful Grid Telemetry API v1 Specification',
      version: 'v1.4',
      targetAudience: 'Frontend and Third-Party API Integrators',
      overviewSection: 'Provides endpoint access for real-time sensor metrics, historical trends, and anomaly alerts.',
      prerequisites: 'Bearer Token (JWT) acquired via /api/v1/auth/login.',
      stepByStepInstructions: 'GET /api/v1/sensors/{sensor_id}/telemetry\nHeader: Authorization: Bearer <token>\nQuery Params: startTime (ISO8601), limit (default: 100).',
      troubleshootingNotes: '401 Unauthorized: Expired JWT token. Refresh token at /api/v1/auth/refresh.',
      safetyPrecautions: 'Rate limit strictly enforced at 100 requests per minute per IP address.'
    }
  },
  {
    id: 'operating_instructions',
    name: 'Operating Instructions (SOP)',
    category: 'Lab Operations',
    icon: <Settings className="w-4 h-4" />,
    overview: 'Standard Operating Procedures (SOPs) for daily laboratory machine operation and safety compliance.',
    sampleContent: {
      documentTitle: 'Digital Storage Oscilloscope (DSO) Standard Operating Procedure',
      version: 'v1.2',
      targetAudience: 'EEE Student Laboratory Technicians',
      overviewSection: 'Defines standard startup, signal acquisition, FFT spectrum analysis, and CSV waveform exporting procedures.',
      prerequisites: 'DSO Tektronix TBS1052B, 10X attenuation probe.',
      stepByStepInstructions: '1. Power on DSO and perform Self-Cal routine.\n2. Connect Probe ground clip to circuit ground.\n3. Press "AutoSet" for initial signal acquisition.',
      troubleshootingNotes: 'Signal clipped on display: Adjust Volts/Div knob to 2V/div.',
      safetyPrecautions: 'Do not connect oscilloscope probe ground to high-voltage non-isolated floating nodes.'
    }
  },
  {
    id: 'maintenance_procedures',
    name: 'Maintenance Procedures',
    category: 'Industrial Maintenance',
    icon: <Wrench className="w-4 h-4" />,
    overview: 'Preventive and corrective maintenance checklists for heavy electrical and mechanical machinery.',
    sampleContent: {
      documentTitle: 'Preventive Maintenance Checklist: 500 kVA Step-Down Transformer',
      version: 'v4.0',
      targetAudience: 'Electrical Substation Maintenance Personnel',
      overviewSection: 'Bi-annual maintenance protocol for oil-immersed distribution transformers.',
      prerequisites: 'Dielectric breakdown voltage tester, megohmmeter (5kV).',
      stepByStepInstructions: '1. De-energize transformer and lock-out/tag-out (LOTO).\n2. Test transformer oil dielectric strength (Minimum threshold: 30 kV).\n3. Clean silica gel breather and verify blue color indicator.',
      troubleshootingNotes: 'Oil BDV < 25 kV: Filter transformer oil using centrifugal oil purification plant.',
      safetyPrecautions: 'LOTO MANDATORY: Verify zero voltage on HV terminals using calibrated detector before grounding.'
    }
  },
  {
    id: 'system_doc',
    name: 'System Documentation',
    category: 'Enterprise Engineering',
    icon: <FileText className="w-4 h-4" />,
    overview: 'Comprehensive system overview combining hardware, software, security policies, and maintenance schedules.',
    sampleContent: {
      documentTitle: 'Autonomous Rover Navigation & Mapping System Documentation',
      version: 'v2.0',
      targetAudience: 'Robotics Engineering Team',
      overviewSection: 'Complete system design integrating LiDAR SLAM, ROS 2 Humble framework, and motor controllers.',
      prerequisites: 'Ubuntu 22.04 LTS, ROS 2 Humble, NVIDIA Jetson Orin Nano.',
      stepByStepInstructions: '1. Launch ROS 2 lifecycle nodes: ros2 launch rover_bringup robot.launch.py.\n2. Initialize SLAM mapping: ros2 launch slam_toolbox online_async.launch.py.',
      troubleshootingNotes: 'Transform tree timeout (tf2): Verify hardware PTP clock synchronization.',
      safetyPrecautions: 'Hardware E-stop button must remain within line-of-sight during autonomous field trials.'
    }
  }
];

export const TechnicalDocumentationStudio: React.FC<{
  onSaveWorkToPortfolio?: (title: string, content: string) => void;
}> = ({ onSaveWorkToPortfolio }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<DocTemplate>(DOC_TEMPLATES[0]);
  const [docData, setDocData] = useState(DOC_TEMPLATES[0].sampleContent);
  const [saveStatus, setSaveStatus] = useState<string>('');

  const handleSelectTemplate = (template: DocTemplate) => {
    setSelectedTemplate(template);
    setDocData(template.sampleContent);
  };

  const handleChangeField = (field: keyof typeof docData, value: string) => {
    setDocData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveDoc = async () => {
    try {
      setSaveStatus('Saving technical documentation...');
      const fullDocText = `DOCUMENT TITLE: ${docData.documentTitle}\nVERSION: ${docData.version}\nTARGET AUDIENCE: ${docData.targetAudience}\n\n1. OVERVIEW:\n${docData.overviewSection}\n\n2. PREREQUISITES:\n${docData.prerequisites}\n\n3. INSTRUCTIONS:\n${docData.stepByStepInstructions}\n\n4. TROUBLESHOOTING:\n${docData.troubleshootingNotes}\n\n5. SAFETY & COMPLIANCE:\n${docData.safetyPrecautions}`;

      await dbStorage.savePortfolioItem({
        id: `tech-doc-${Date.now()}`,
        moduleId: 'report-writing',
        moduleTitle: 'Report Writing & Technical Communication',
        title: docData.documentTitle,
        category: 'written',
        content: fullDocText,
        score: 93,
        createdAt: new Date().toISOString()
      });

      if (onSaveWorkToPortfolio) {
        onSaveWorkToPortfolio(docData.documentTitle, fullDocText);
      }

      setSaveStatus('Documentation saved to Portfolio!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (e) {
      setSaveStatus('Error saving documentation.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-[#D35400]">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-[#E67E22] uppercase tracking-wider">
                Module 11 • Section 5
              </span>
              <h2 className="text-xl font-bold text-[#D35400] font-heading">
                Technical Documentation Studio
              </h2>
            </div>
          </div>

          <button
            onClick={handleSaveDoc}
            className="px-4 py-2 bg-[#D35400] hover:bg-[#E67E22] text-white font-bold text-xs rounded-xl transition flex items-center gap-2 shadow-2xs"
          >
            <Save className="w-4 h-4" />
            Save Documentation
          </button>
        </div>

        {saveStatus && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{saveStatus}</span>
          </div>
        )}
      </div>

      {/* Template Selector Grid */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
        <h3 className="text-xs font-bold text-[#D35400] uppercase font-heading tracking-wider flex items-center gap-2">
          <span>Select Technical Document Type (7 Templates)</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {DOC_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => handleSelectTemplate(tmpl)}
              className={`p-3 rounded-xl border text-left transition space-y-1.5 ${
                selectedTemplate.id === tmpl.id
                  ? 'bg-[#D35400] text-white border-[#D35400] font-bold shadow-2xs'
                  : 'bg-[#FFF8F0] text-[#2C3E50] border-[#FAD7A0] hover:bg-[#FAD7A0]'
              }`}
            >
              <div className="flex items-center gap-1.5">
                {tmpl.icon}
                <span className="text-xs font-heading truncate">{tmpl.name}</span>
              </div>
              <p className="text-[9px] opacity-80 truncate">{tmpl.category}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Fillable Form & Live Output Formatter */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Form Inputs */}
        <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
          <div className="border-b border-[#FAD7A0] pb-2">
            <h3 className="text-sm font-bold text-[#D35400] font-heading">
              Fillable Fields: {selectedTemplate.name}
            </h3>
            <p className="text-xs text-[#2C3E50]">{selectedTemplate.overview}</p>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2 space-y-1">
                <label className="text-[10px] font-bold uppercase text-[#2C3E50]">Document Title</label>
                <input
                  type="text"
                  value={docData.documentTitle}
                  onChange={(e) => handleChangeField('documentTitle', e.target.value)}
                  className="w-full p-2 text-xs rounded-lg border border-[#FAD7A0] focus:ring-2 focus:ring-[#D35400]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-[#2C3E50]">Version</label>
                <input
                  type="text"
                  value={docData.version}
                  onChange={(e) => handleChangeField('version', e.target.value)}
                  className="w-full p-2 text-xs rounded-lg border border-[#FAD7A0] focus:ring-2 focus:ring-[#D35400] font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-[#2C3E50]">Target Audience</label>
              <input
                type="text"
                value={docData.targetAudience}
                onChange={(e) => handleChangeField('targetAudience', e.target.value)}
                className="w-full p-2 text-xs rounded-lg border border-[#FAD7A0] focus:ring-2 focus:ring-[#D35400]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-[#2C3E50]">System Overview & Scope</label>
              <textarea
                rows={2}
                value={docData.overviewSection}
                onChange={(e) => handleChangeField('overviewSection', e.target.value)}
                className="w-full p-2 text-xs rounded-lg border border-[#FAD7A0] focus:ring-2 focus:ring-[#D35400] font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-[#2C3E50]">Prerequisites & Equipment</label>
              <textarea
                rows={2}
                value={docData.prerequisites}
                onChange={(e) => handleChangeField('prerequisites', e.target.value)}
                className="w-full p-2 text-xs rounded-lg border border-[#FAD7A0] focus:ring-2 focus:ring-[#D35400] font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-[#2C3E50]">Step-by-Step Instructions</label>
              <textarea
                rows={4}
                value={docData.stepByStepInstructions}
                onChange={(e) => handleChangeField('stepByStepInstructions', e.target.value)}
                className="w-full p-2 text-xs rounded-lg border border-[#FAD7A0] focus:ring-2 focus:ring-[#D35400] font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-[#2C3E50]">Troubleshooting Notes</label>
              <textarea
                rows={2}
                value={docData.troubleshootingNotes}
                onChange={(e) => handleChangeField('troubleshootingNotes', e.target.value)}
                className="w-full p-2 text-xs rounded-lg border border-[#FAD7A0] focus:ring-2 focus:ring-[#D35400] font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-[#2C3E50]">Safety & Compliance Precautions</label>
              <textarea
                rows={2}
                value={docData.safetyPrecautions}
                onChange={(e) => handleChangeField('safetyPrecautions', e.target.value)}
                className="w-full p-2 text-xs rounded-lg border border-[#FAD7A0] focus:ring-2 focus:ring-[#D35400] font-mono"
              />
            </div>
          </div>
        </div>

        {/* Live Formatted Output View */}
        <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
          <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-2">
            <h3 className="text-sm font-bold text-[#D35400] font-heading">
              Formatted Technical Output
            </h3>
            <span className="text-[10px] font-mono text-[#E67E22] bg-[#FFF8F0] px-2 py-0.5 rounded border border-[#FAD7A0]">
              IEEE / ISO 9001 Format
            </span>
          </div>

          <div className="p-5 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs space-y-4 overflow-x-auto">
            <div className="border-b border-slate-700 pb-2">
              <h2 className="text-amber-400 font-bold text-sm">{docData.documentTitle}</h2>
              <p className="text-slate-400 text-[10px]">Version: {docData.version} | Target Audience: {docData.targetAudience}</p>
            </div>

            <div>
              <p className="text-emerald-400 font-bold mb-1">1. OVERVIEW & SCOPE</p>
              <p className="text-slate-300 leading-relaxed">{docData.overviewSection}</p>
            </div>

            <div>
              <p className="text-emerald-400 font-bold mb-1">2. PREREQUISITES</p>
              <p className="text-slate-300 whitespace-pre-line">{docData.prerequisites}</p>
            </div>

            <div>
              <p className="text-emerald-400 font-bold mb-1">3. PROCEDURE / INSTRUCTIONS</p>
              <p className="text-slate-300 whitespace-pre-line">{docData.stepByStepInstructions}</p>
            </div>

            <div>
              <p className="text-amber-300 font-bold mb-1">4. TROUBLESHOOTING</p>
              <p className="text-slate-300 whitespace-pre-line">{docData.troubleshootingNotes}</p>
            </div>

            <div>
              <p className="text-rose-400 font-bold mb-1">5. SAFETY & COMPLIANCE</p>
              <p className="text-slate-300 whitespace-pre-line">{docData.safetyPrecautions}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
