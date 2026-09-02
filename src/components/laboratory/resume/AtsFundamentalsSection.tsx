import React, { useState } from 'react';
import { Layout, Type, FileCheck, CheckCircle2, AlertOctagon, ArrowRight, FileText, ListOrdered, ShieldCheck, Tag } from 'lucide-react';

interface AtsFundamentalsSectionProps {
  onCompleteActivity: () => void;
}

export const AtsFundamentalsSection: React.FC<AtsFundamentalsSectionProps> = ({ onCompleteActivity }) => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const atsRules = [
    {
      title: '1. Standard Section Ordering',
      icon: ListOrdered,
      rule: 'Follow the universally recognized chronological order so ATS parsers map fields correctly:',
      bullets: [
        '1. Personal & Contact Information (Name, SRIT Roll No, Phone, Email, LinkedIn, GitHub)',
        '2. Professional / Career Objective',
        '3. Education (B.Tech SRIT, Intermediate, Schooling with CGPA/Percentage)',
        '4. Technical Skills (Languages, Frameworks, Developer Tools, Core Concepts)',
        '5. Key Engineering Projects (Title, Tech Stack, 2-3 Action Bullet Points)',
        '6. Internships / Experience (Company, Role, Duration, Key Contributions)',
        '7. Certifications & Achievements (NPTEL, Coursera, Hackathons)',
        '8. Soft Skills, Languages, & Declaration'
      ],
      tip: 'Do NOT rename standard headings to non-standard names like "My Background" or "What I Know". Stick to "Education", "Technical Skills", "Projects".'
    },
    {
      title: '2. Font Selection & Readable Typography',
      icon: Type,
      rule: 'Use standard web-safe and ATS-compatible fonts with consistent size scaling:',
      bullets: [
        'Recommended Fonts: Arial, Calibri, Helvetica, Times New Roman, Georgia, Garamond, Trebuchet MS.',
        'Name / Main Heading: 18pt - 22pt Bold',
        'Section Headers: 12pt - 14pt Bold / UPPERCASE',
        'Body Text & Bullet Points: 10pt - 11.5pt Regular',
        'Line Spacing: 1.15 to 1.25x (Avoid dense text walls without line breathing room)'
      ],
      tip: 'Avoid custom decorative script fonts or non-installed Google Web Fonts that render as unreadable glyphs when converted to plain text.'
    },
    {
      title: '3. Single-Column Layout & Margins',
      icon: Layout,
      rule: 'Keep layout simple, single-column, and scanner-friendly:',
      bullets: [
        'Margins: Standard 0.5 inch to 1.0 inch on all 4 sides.',
        'Layout: Single-column vertical flow is 100% preferred over complex multi-column sidebars.',
        'Tables & Graphics: Strictly avoid inserting image boxes, progress bars, or icons inside tables.',
        'Headers & Footers: Do NOT place critical contact info inside Microsoft Word Header/Footer zones (ATS often skips headers).'
      ],
      tip: 'Multi-column tables cause ATS parsers to read text across columns left-to-right, mixing up section sentences!'
    },
    {
      title: '4. Strategic Keyword Placement',
      icon: Tag,
      rule: 'Integrate target job description keywords organically across sections:',
      bullets: [
        'Extract core hard skills from target JD (e.g., Python, REST API, SQL, Data Structures).',
        'Place exact key phrases in Technical Skills section AND inside Project bullet points.',
        'Match exact acronyms AND expanded terms (e.g., "Object-Oriented Programming (OOP)").',
        'Avoid keyword stuffing or white-font hidden keywords (ATS algorithms flag this as spam).'
      ],
      tip: 'Recruiters filter resumes by filtering ATS databases for specific tech stack terms.'
    },
    {
      title: '5. Professional File Naming & Export Format',
      icon: FileCheck,
      rule: 'Save and name your final document strictly according to corporate standards:',
      bullets: [
        'Standard File Name: FullName_SRIT_RollNo_Resume.pdf (e.g., Anil_Kumar_264G1A0501_Resume.pdf)',
        'Unprofessional File Name: resume1.pdf, My_Final_Resume_v3.docx, doc.pdf',
        'Export Format: Searchable PDF or Microsoft Word (.docx).',
        'Never upload flat scanned JPEG images or non-text PDF prints.'
      ],
      tip: 'An ATS cannot read text contained inside a flat scanned image or photo PDF!'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
        {/* Section Header */}
        <div className="border-b border-[#FAD7A0] pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest bg-[#D35400] text-white px-2 py-0.5 rounded-md">
              Section 2
            </span>
            <span className="text-xs text-[#5D6D7E] font-bold">R26 Communicative English Laboratory</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#D35400]" />
            2. ATS Resume Fundamentals & Formatting Rules
          </h2>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Master the 5 non-negotiable ATS standards: section hierarchy, typography, single-column margins, keyword placement, and corporate file naming.
          </p>
        </div>

        {/* Interactive Step Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {atsRules.map((rule, idx) => {
            const Icon = rule.icon;
            const isSelected = activeStep === idx;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={`p-3 rounded-xl border text-left transition flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#D35400] text-white border-[#D35400] shadow-2xs'
                    : 'bg-[#FFF8F0] text-[#2C3E50] border-[#FAD7A0] hover:bg-[#FAD7A0]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="text-xs font-bold truncate">{rule.title.split('.')[1]}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Rule Detail Card */}
        <div className="p-6 bg-[#FFF8F0] border-2 border-[#FAD7A0] rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-3">
            <h3 className="text-base font-extrabold text-[#2C3E50] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#D35400]" />
              {atsRules[activeStep].title}
            </h3>
            <span className="text-[10px] font-black uppercase bg-white border border-[#FAD7A0] text-[#D35400] px-2.5 py-1 rounded-md">
              Rule {activeStep + 1} of 5
            </span>
          </div>

          <p className="text-xs font-bold text-[#2C3E50]">{atsRules[activeStep].rule}</p>

          <div className="bg-white p-4 rounded-xl border border-[#FAD7A0] space-y-2">
            <span className="text-[10px] font-extrabold text-[#D35400] uppercase block">Key Guidelines:</span>
            <ul className="space-y-1.5 text-xs text-[#2C3E50]">
              {atsRules[activeStep].bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E67E22] shrink-0 mt-1.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Faculty Pro-Tip */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-start gap-2">
            <AlertOctagon className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold uppercase text-[10px] text-amber-800 block">SRIT Faculty Pro-Tip:</span>
              <span>{atsRules[activeStep].tip}</span>
            </div>
          </div>
        </div>

        {/* Common ATS Mistakes Summary Table */}
        <div className="p-5 bg-white border border-[#FAD7A0] rounded-2xl space-y-3">
          <h4 className="text-sm font-extrabold text-[#2C3E50] flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-red-600" />
            Common ATS Mistakes to Avoid at SRIT Placements:
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-1 text-red-950">
              <span className="font-extrabold text-red-800 text-[11px] block">❌ Image-Based Skills Ratings</span>
              <p>Avoid star ratings or progress bars (e.g., "Python: ★★★★☆"). ATS parsers cannot read images or stars!</p>
            </div>
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-1 text-red-950">
              <span className="font-extrabold text-red-800 text-[11px] block">❌ Spelling & Grammar Typos</span>
              <p>ATS treats misspelled skills as missing skills (e.g. "Pithon" instead of "Python" will cause 0 score match).</p>
            </div>
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-1 text-red-950">
              <span className="font-extrabold text-red-800 text-[11px] block">❌ Non-Text PDF Scans</span>
              <p>Printing a paper resume and taking a mobile photo/scan creates an image PDF with zero readable text strings.</p>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="flex justify-between items-center pt-4 border-t border-[#FAD7A0]">
          <button
            type="button"
            onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
            disabled={activeStep === 0}
            className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl disabled:opacity-40"
          >
            Previous Standard
          </button>

          {activeStep < atsRules.length - 1 ? (
            <button
              type="button"
              onClick={() => setActiveStep(activeStep + 1)}
              className="px-5 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#E67E22] transition flex items-center gap-1.5"
            >
              <span>Next Standard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onCompleteActivity}
              className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#E67E22] transition flex items-center gap-2"
            >
              <span>Proceed to Section 3: Interactive Resume Builder</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
