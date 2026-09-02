import React, { useState } from 'react';
import { BookOpen, CheckCircle2, XCircle, ArrowRight, Lightbulb, Shield, Building2, GraduationCap, Briefcase } from 'lucide-react';

interface EmailIntroSectionProps {
  onCompleteActivity: () => void;
}

export const EmailIntroSection: React.FC<EmailIntroSectionProps> = ({ onCompleteActivity }) => {
  const [selectedDomain, setSelectedDomain] = useState<'academic' | 'workplace' | 'business'>('academic');
  const [activeComparison, setActiveComparison] = useState<'request' | 'complaint' | 'submission'>('request');

  const domainData = {
    academic: {
      title: 'Academic Communication',
      icon: GraduationCap,
      description: 'Formal correspondence with Professors, Head of Department (HOD), Dean, and Administrative Staff.',
      purposes: [
        'Requesting leave or On-Duty (OD) permissions for events/hackathons',
        'Submitting assignments, lab reports, and mini-project documentation',
        'Seeking recommendation letters or bonafide certificates',
        'Requesting project guidance or clarification on coursework'
      ],
      keyRule: 'Always include your Roll Number, Branch, and Section in academic emails for immediate identification.'
    },
    workplace: {
      title: 'Workplace & Internship Communication',
      icon: Briefcase,
      description: 'Professional emails with Team Leads, Engineering Managers, HR, and Cross-functional Peers.',
      purposes: [
        'Providing daily/weekly sprint updates and project status reports',
        'Escalating technical blockers or software bugs politely',
        'Requesting formal meetings, code reviews, or design approvals',
        'Applying for internal project shifts or training registrations'
      ],
      keyRule: 'Keep messages concise and actionable. Busy managers appreciate bullet points over long blocks of text.'
    },
    business: {
      title: 'Business & Client Communication',
      icon: Building2,
      description: 'Formal emails to External Vendors, Clients, Industry Mentors, and Placement Recruiters.',
      purposes: [
        'Inquiring about summer internship opportunities or job vacancies',
        'Submitting formal business proposals, quotes, or service complaints',
        'Following up after campus placement drives or interview rounds',
        'Expressing gratitude (Thank You emails) after professional interactions'
      ],
      keyRule: 'Maintain flawless grammar, polite modal verbs, and explicit professional sign-offs.'
    }
  };

  const comparisonData = {
    request: {
      title: 'Leave Request Email',
      unprofessional: {
        subject: 'leave needed',
        body: 'hi sir, i need leave tomorrow for some urgent personal work so please grant leave tnx.',
        flaws: [
          'Subject is vague and lowercase',
          'Informal greeting ("hi sir")',
          'No roll number, branch, or date specified',
          'Slang/text speak ("tnx")',
          'Abrupt and demanding tone'
        ]
      },
      professional: {
        subject: '[Leave Request] On-Duty Leave for State Hackathon - 264G1A0501',
        body: 'Dear Prof. Sharma,\n\nI am writing to request On-Duty (OD) leave for 2 days, from July 28 to July 29, 2026, to participate in the State Level Smart India Hackathon representing SRIT.\n\nI have ensured all my lab assignments for this week are completed. Attached is the official invitation letter for your kind perusal.\n\nThank you for your consideration.\n\nSincerely,\nAnil Kumar\nRoll No: 264G1A0501 | B.Tech CSE (Year I)',
        strengths: [
          'Clear, actionable subject line with credentials',
          'Formal greeting ("Dear Prof. Sharma")',
          'Explicit dates and valid reason provided',
          'Mentions completion of academic backlog',
          'Formal sign-off with full identity'
        ]
      }
    },
    complaint: {
      title: 'Laboratory Equipment Issue',
      unprofessional: {
        subject: 'pc not working fix quickly!!',
        body: 'computer no 14 in lab 2 is totally broken mouse is not working and screen is black fix it immediately i cant do my work.',
        flaws: [
          'Aggressive, demanding tone with exclamation marks',
          'No greeting or sign-off',
          'Lacks technical specifics (e.g. error code, exact lab batch)',
          'Sounds rude rather than constructive'
        ]
      },
      professional: {
        subject: '[Technical Issue] Monitor & Mouse Replacement - Language Lab PC 14',
        body: 'Dear Lab In-Charge,\n\nI would like to bring to your notice a technical issue with Computer System No. 14 in the Language Laboratory. During our morning session, the monitor failed to display video and the USB optical mouse was unresponsive.\n\nCould you kindly inspect or replace the faulty peripheral when convenient?\n\nThank you for your support.\n\nRegards,\nSuresh Reddy\nStudent Coordinator, Language Lab',
        strengths: [
          'Objective, polite description of technical defect',
          'Specific PC number and location identified',
          'Polite modal request ("Could you kindly...")',
          'Professional signature and designation'
        ]
      }
    },
    submission: {
      title: 'Project Assignment Submission',
      unprofessional: {
        subject: 'my project file',
        body: 'hey maam check my attached zip file for cse project ok bye.',
        flaws: [
          'Vague subject line with no project name',
          'Casual greeting ("hey maam")',
          'Inappropriate closing ("ok bye")',
          'Missing project description or summary'
        ]
      },
      professional: {
        subject: '[Submission] Phase-1 Web App Source Code - Group 04',
        body: 'Dear Dr. Lakshmi,\n\nPlease find attached the source code archive and documentation for our Phase-1 Web Application Project titled "SRIT Smart Library System".\n\nProject Team Members:\n1. Anil Kumar (264G1A0501)\n2. Priya Sharma (264G1A0502)\n\nWe look forward to your feedback during Friday\'s lab evaluation.\n\nBest regards,\nGroup 04 - CSE Section A',
        strengths: [
          'Descriptive subject line with group number',
          'Lists all team members and roll numbers',
          'Clean, scannable bullet layout',
          'Respectful forward-looking closing'
        ]
      }
    }
  };

  const SelectedDomainIcon = domainData[selectedDomain].icon;

  return (
    <div className="space-y-6">
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
        {/* Header */}
        <div className="border-b border-[#FAD7A0] pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest bg-[#D35400] text-white px-2 py-0.5 rounded-md">
              Section 1
            </span>
            <span className="text-xs text-[#5D6D7E] font-bold">R26 Communicative English Laboratory</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#D35400]" />
            1. Introduction to Professional Email & Business Writing
          </h2>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Understand why formal email literacy is a core engineering competency for academic excellence and corporate placement success.
          </p>
        </div>

        {/* 3 Core Communication Domains */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase text-[#D35400] tracking-wider">
            Explore Communication Domains:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(['academic', 'workplace', 'business'] as const).map((key) => {
              const item = domainData[key];
              const Icon = item.icon;
              const isActive = selectedDomain === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedDomain(key)}
                  className={`p-4 rounded-xl text-left border transition flex flex-col justify-between ${
                    isActive
                      ? 'bg-[#FFF8F0] border-[#D35400] text-[#2C3E50] shadow-xs'
                      : 'bg-white border-[#FAD7A0] hover:border-[#E67E22] hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-2 rounded-lg ${isActive ? 'bg-[#D35400] text-white' : 'bg-[#FFF8F0] text-[#D35400]'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold">{item.title}</span>
                  </div>
                  <p className="text-[11px] text-[#5D6D7E] line-clamp-2">{item.description}</p>
                </button>
              );
            })}
          </div>

          {/* Active Domain Details */}
          <div className="p-5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl space-y-3">
            <div className="flex items-center gap-2">
              <SelectedDomainIcon className="w-5 h-5 text-[#D35400]" />
              <h4 className="text-sm font-bold text-[#2C3E50]">{domainData[selectedDomain].title}</h4>
            </div>
            <p className="text-xs text-[#5D6D7E]">{domainData[selectedDomain].description}</p>

            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold text-[#D35400] uppercase">Common Email Purposes:</span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#2C3E50]">
                {domainData[selectedDomain].purposes.map((p, idx) => (
                  <li key={idx} className="bg-white p-2.5 rounded-lg border border-[#FAD7A0] flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D35400] mt-1.5 shrink-0" />
                    <span className="text-[11px] font-medium">{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-white rounded-xl border border-[#FAD7A0] text-xs text-[#D35400] font-bold flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-[#E67E22] shrink-0" />
              <span>Golden Rule: {domainData[selectedDomain].keyRule}</span>
            </div>
          </div>
        </div>

        {/* Interactive Comparison: Professional vs Unprofessional */}
        <div className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#FAD7A0] pb-2">
            <div>
              <h3 className="text-xs font-bold uppercase text-[#D35400] tracking-wider">
                Interactive Case Study: Contrast Analysis
              </h3>
              <p className="text-[11px] text-[#5D6D7E]">
                Toggle scenarios to compare unprofessional vs professional email examples.
              </p>
            </div>

            <div className="flex gap-1.5 shrink-0">
              {(['request', 'complaint', 'submission'] as const).map((sc) => (
                <button
                  key={sc}
                  type="button"
                  onClick={() => setActiveComparison(sc)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition capitalize ${
                    activeComparison === sc
                      ? 'bg-[#D35400] text-white'
                      : 'bg-[#FFF8F0] text-[#2C3E50] border border-[#FAD7A0] hover:bg-[#FAD7A0]'
                  }`}
                >
                  {sc}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Unprofessional Example */}
            <div className="p-5 bg-red-50/60 border border-red-200 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-red-700 font-bold text-xs uppercase tracking-wide">
                <XCircle className="w-4 h-4 text-red-600" />
                <span>❌ Unprofessional Draft ({comparisonData[activeComparison].title})</span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-red-200 text-xs font-mono space-y-2">
                <div>
                  <span className="text-[10px] text-gray-400 font-sans block">Subject:</span>
                  <span className="text-red-900 font-bold">{comparisonData[activeComparison].unprofessional.subject}</span>
                </div>
                <div className="pt-2 border-t border-gray-100 whitespace-pre-wrap text-gray-700">
                  {comparisonData[activeComparison].unprofessional.body}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-red-800 uppercase">Critical Deficiencies:</span>
                <ul className="space-y-1">
                  {comparisonData[activeComparison].unprofessional.flaws.map((flaw, idx) => (
                    <li key={idx} className="text-[11px] text-red-700 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-red-500" />
                      <span>{flaw}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Professional Example */}
            <div className="p-5 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wide">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>✅ Professional Draft ({comparisonData[activeComparison].title})</span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-emerald-200 text-xs font-mono space-y-2">
                <div>
                  <span className="text-[10px] text-gray-400 font-sans block">Subject:</span>
                  <span className="text-emerald-950 font-bold">{comparisonData[activeComparison].professional.subject}</span>
                </div>
                <div className="pt-2 border-t border-gray-100 whitespace-pre-wrap text-gray-800">
                  {comparisonData[activeComparison].professional.body}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-emerald-800 uppercase">Professional Highlights:</span>
                <ul className="space-y-1">
                  {comparisonData[activeComparison].professional.strengths.map((str, idx) => (
                    <li key={idx} className="text-[11px] text-emerald-800 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-emerald-600" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-[#FAD7A0]">
          <span className="text-xs text-[#5D6D7E] flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-[#D35400]" />
            Aligned with R26 Communicative English Lab Syllabus
          </span>

          <button
            type="button"
            onClick={onCompleteActivity}
            className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#B04300] transition flex items-center gap-2"
          >
            Continue to Email Structure & Netiquette <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
