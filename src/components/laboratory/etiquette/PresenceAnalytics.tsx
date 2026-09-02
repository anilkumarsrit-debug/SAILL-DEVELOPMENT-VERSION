import React from 'react';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  BarChart3,
  ShieldCheck,
  UserCheck,
  Zap,
  Layers,
  Sparkles
} from 'lucide-react';

export const PresenceAnalytics: React.FC = () => {
  const analyticsData = [
    { subject: 'Professional Comm.', score: 9.2, label: '9.2 / 10' },
    { subject: 'Digital Presence', score: 9.5, label: '9.5 / 10' },
    { subject: 'LinkedIn Quality', score: 9.0, label: '9.0 / 10' },
    { subject: 'Personal Branding', score: 9.4, label: '9.4 / 10' },
    { subject: 'Career Readiness', score: 9.3, label: '9.3 / 10' },
    { subject: 'Professional Writing', score: 9.6, label: '9.6 / 10' }
  ];

  const overallScore = 9.4; // 10 Marks Scale

  const performanceScale = [
    { range: '10', label: 'Outstanding', desc: 'Flawless corporate etiquette, executive digital presence, tier-1 LinkedIn profile.', color: 'bg-emerald-600 text-white' },
    { range: '9', label: 'Excellent', desc: 'Strong professional communication, clean branding statement, active netiquette adherence.', color: 'bg-emerald-500 text-white' },
    { range: '8', label: 'Very Good', desc: 'Effective workplace behavior, complete LinkedIn draft, clear career vision.', color: 'bg-blue-600 text-white' },
    { range: '7', label: 'Good', desc: 'Satisfactory digital conduct, basic elevator pitch, minor profile polish needed.', color: 'bg-blue-500 text-white' },
    { range: '6', label: 'Satisfactory', desc: 'Meets minimum R26 syllabus requirements. Recommends expanded bio.', color: 'bg-amber-500 text-white' },
    { range: '5', label: 'Needs Improvement', desc: 'Requires refinement in email netiquette and headline clarity.', color: 'bg-orange-500 text-white' },
    { range: '< 5', label: 'Requires Additional Practice', desc: 'Needs complete overhaul of digital persona and workplace scenario practice.', color: 'bg-rose-600 text-white' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
        <div className="flex items-center gap-3 border-b border-[#FAD7A0] pb-3">
          <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-[#D35400]">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#D35400] font-heading">
              7. Professional Presence Analytics (SAILL 10-Mark Rubric)
            </h2>
            <p className="text-xs text-[#2C3E50]">
              Interactive assessment metrics across 6 career readiness dimensions mapped strictly to R26 evaluation standards.
            </p>
          </div>
        </div>

        {/* Overall Score Highlight */}
        <div className="p-5 bg-gradient-to-r from-[#D35400] to-[#E67E22] text-white rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-md">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase bg-white/20 px-2.5 py-0.5 rounded tracking-widest text-white">
              SAILL R26 Overall Professional Readiness
            </span>
            <h3 className="text-2xl font-black font-heading">Grade: Excellent (9.4 / 10)</h3>
            <p className="text-xs text-amber-100 max-w-xl">
              Demonstrates outstanding workplace etiquette, high-impact LinkedIn profile optimization, and polished netiquette.
            </p>
          </div>

          <div className="p-3.5 bg-white/10 backdrop-blur-xs rounded-xl border border-white/20 text-center min-w-[120px]">
            <span className="text-[10px] font-mono uppercase text-amber-200 block">Overall Score</span>
            <span className="text-3xl font-black font-mono">9.4</span>
            <span className="text-[10px] font-mono text-amber-100 block">/ 10 Marks</span>
          </div>
        </div>

        {/* Custom SVG / Interactive Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Progress Bar Chart Breakdown */}
          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-3">
            <h3 className="text-xs font-bold text-[#D35400] font-heading uppercase flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-[#D35400]" />
              Competency Bar Breakdown (Out of 10 Marks)
            </h3>

            <div className="space-y-3 pt-1">
              {analyticsData.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium text-[#2C3E50]">
                    <span className="font-bold">{item.subject}</span>
                    <span className="font-mono text-[#D35400] font-bold">{item.label}</span>
                  </div>
                  <div className="w-full h-3 bg-white border border-[#FAD7A0] rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-[#E67E22] to-[#D35400] rounded-full transition-all duration-500"
                      style={{ width: `${(item.score / 10) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hexagon / Spider Radar Representation */}
          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-3 flex flex-col justify-between">
            <h3 className="text-xs font-bold text-[#D35400] font-heading uppercase flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#E67E22]" />
              Professional Presence Hexagon
            </h3>

            <div className="relative flex items-center justify-center py-4">
              <svg viewBox="0 0 200 200" className="w-48 h-48">
                {/* Outer Hexagon */}
                <polygon points="100,20 170,60 170,140 100,180 30,140 30,60" fill="none" stroke="#FAD7A0" strokeWidth="2" />
                {/* Inner Grid Hexagons */}
                <polygon points="100,45 148,72 148,128 100,155 52,128 52,72" fill="none" stroke="#FAD7A0" strokeWidth="1" strokeDasharray="3,3" />
                <polygon points="100,70 125,85 125,115 100,130 75,115 75,85" fill="none" stroke="#FAD7A0" strokeWidth="1" strokeDasharray="3,3" />

                {/* Score Data Area */}
                <polygon points="100,24 165,63 163,138 100,174 34,136 34,62" fill="#D35400" fillOpacity="0.25" stroke="#D35400" strokeWidth="2.5" />

                {/* Center Badge */}
                <circle cx="100" cy="100" r="18" fill="#D35400" />
                <text x="100" y="104" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">9.4</text>
              </svg>
            </div>

            <p className="text-[11px] text-[#2C3E50] text-center font-medium">
              Balanced competency polygon reflecting high alignment across all 6 R26 evaluation parameters.
            </p>
          </div>
        </div>

        {/* SAILL Performance Scale */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold text-[#D35400] uppercase font-heading tracking-wider">
            SAILL R26 10-Mark Assessment Rubric & Performance Scale
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            {performanceScale.map((scale, i) => (
              <div key={i} className="p-3 bg-white border border-gray-200 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${scale.color}`}>
                    {scale.range} Marks
                  </span>
                  <span className="text-xs font-bold text-[#D35400]">{scale.label}</span>
                </div>
                <p className="text-[11px] text-[#2C3E50] leading-relaxed">{scale.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
