import React, { useState } from 'react';
import { Mail, FileText, CheckCircle2, ArrowRight, Copy, Save, Sparkles, Building, Briefcase, GraduationCap, Award, Layers } from 'lucide-react';

interface CoverLetterBuilderProps {
  onCompleteActivity: () => void;
}

export const CoverLetterBuilder: React.FC<CoverLetterBuilderProps> = ({ onCompleteActivity }) => {
  const scenarios = [
    { id: 'internship', name: 'Software Engineering Internship', badge: 'Internship' },
    { id: 'campus', name: 'Campus Placement Drive (TCS / Infosys)', badge: 'Campus Drive' },
    { id: 'job', name: 'Direct Corporate Job Application', badge: 'Job App' },
    { id: 'training', name: 'Industrial Training Request', badge: 'Industrial Training' },
    { id: 'scholarship', name: 'Academic Scholarship Application', badge: 'Scholarship' },
    { id: 'higher_ed', name: 'Higher Education M.Tech Admission', badge: 'Higher Ed' }
  ];

  const [activeScenario, setActiveScenario] = useState<string>('internship');

  const [greeting, setGreeting] = useState<string>('Dear Hiring Manager / Recruitment Team,');
  const [openingParagraph, setOpeningParagraph] = useState<string>(
    'I am writing to formally apply for the Summer Software Engineering Internship position at Tech Corp. I am currently a First-Year B.Tech Computer Science student at Srinivasa Ramanujan Institute of Technology (SRIT) with a passion for web development and algorithm design.'
  );
  const [whyCompany, setWhyCompany] = useState<string>(
    'Tech Corp’s pioneering work in scalable cloud infrastructure and commitment to engineering innovation strongly aligns with my career aspirations. I have followed your recent product deployments closely and admire your emphasis on clean software architecture.'
  );
  const [skillsExperience, setSkillsExperience] = useState<string>(
    'Through my coursework at SRIT, I have developed solid competency in Java, Python, Data Structures, and React.js. I have solved 150+ algorithmic problems on LeetCode and maintained a 9.4 GPA in my first semester.'
  );
  const [projectsHighlight, setProjectsHighlight] = useState<string>(
    'Recently, I engineered a campus facility management application using React.js and SQL, which reduced student query processing latency by 30%. This project strengthened my abilities in full-stack debugging and database optimization.'
  );
  const [closingParagraph, setClosingParagraph] = useState<string>(
    'Thank you for your time and consideration. I am eager to discuss how my technical skills and enthusiasm for software engineering can contribute value to Tech Corp’s engineering team.'
  );
  const [signOff, setSignOff] = useState<string>('Sincerely,\nAnil Kumar\nRoll No: 264G1A0501 | B.Tech CSE\nSRIT Anantapur');

  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleCopy = () => {
    const fullText = `${greeting}\n\n${openingParagraph}\n\n${whyCompany}\n\n${skillsExperience}\n\n${projectsHighlight}\n\n${closingParagraph}\n\n${signOff}`;
    navigator.clipboard.writeText(fullText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
        {/* Header */}
        <div className="border-b border-[#FAD7A0] pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest bg-[#D35400] text-white px-2 py-0.5 rounded-md">
              Section 6
            </span>
            <span className="text-xs text-[#5D6D7E] font-bold">R26 Communicative English Laboratory</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#D35400]" />
            6. Tailored Cover Letter Builder
          </h2>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Build a structured 6-part cover letter customized for engineering internships, campus placement drives, industrial training, or higher education applications.
          </p>
        </div>

        {/* Scenario Selector Pills */}
        <div className="flex flex-wrap gap-2 border-b border-[#FAD7A0] pb-3">
          {scenarios.map((scen) => (
            <button
              key={scen.id}
              type="button"
              onClick={() => setActiveScenario(scen.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeScenario === scen.id
                  ? 'bg-[#D35400] text-white shadow-2xs'
                  : 'bg-[#FFF8F0] text-[#2C3E50] border border-[#FAD7A0] hover:bg-[#FAD7A0]'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>{scen.name}</span>
            </button>
          ))}
        </div>

        {/* 6 Cover Letter Form Sections */}
        <div className="space-y-4 bg-[#FFF8F0] p-5 rounded-2xl border border-[#FAD7A0]">
          {/* Part 1: Greeting */}
          <div>
            <label className="text-xs font-extrabold text-[#2C3E50] block mb-1">
              1. Professional Salutation / Greeting
            </label>
            <input
              type="text"
              value={greeting}
              onChange={(e) => setGreeting(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-[#FAD7A0] bg-white font-mono"
            />
          </div>

          {/* Part 2: Opening */}
          <div>
            <label className="text-xs font-extrabold text-[#2C3E50] block mb-1">
              2. Opening Paragraph (State Target Role & College)
            </label>
            <textarea
              rows={2}
              value={openingParagraph}
              onChange={(e) => setOpeningParagraph(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-[#FAD7A0] bg-white font-mono"
            />
          </div>

          {/* Part 3: Why Company */}
          <div>
            <label className="text-xs font-extrabold text-[#2C3E50] block mb-1">
              3. Why This Company / Organization
            </label>
            <textarea
              rows={2}
              value={whyCompany}
              onChange={(e) => setWhyCompany(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-[#FAD7A0] bg-white font-mono"
            />
          </div>

          {/* Part 4: Skills & Experience */}
          <div>
            <label className="text-xs font-extrabold text-[#2C3E50] block mb-1">
              4. Relevant Skills & Academic Track Record
            </label>
            <textarea
              rows={2}
              value={skillsExperience}
              onChange={(e) => setSkillsExperience(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-[#FAD7A0] bg-white font-mono"
            />
          </div>

          {/* Part 5: Projects */}
          <div>
            <label className="text-xs font-extrabold text-[#2C3E50] block mb-1">
              5. Key Project Highlight (Action + Impact)
            </label>
            <textarea
              rows={2}
              value={projectsHighlight}
              onChange={(e) => setProjectsHighlight(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-[#FAD7A0] bg-white font-mono"
            />
          </div>

          {/* Part 6: Closing & Signoff */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-extrabold text-[#2C3E50] block mb-1">
                6. Closing Paragraph
              </label>
              <textarea
                rows={3}
                value={closingParagraph}
                onChange={(e) => setClosingParagraph(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-[#FAD7A0] bg-white font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-extrabold text-[#2C3E50] block mb-1">
                7. Professional Sign-off
              </label>
              <textarea
                rows={3}
                value={signOff}
                onChange={(e) => setSignOff(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-[#FAD7A0] bg-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Formatted Preview & Copy */}
        <div className="p-6 bg-white border-2 border-[#2C3E50] rounded-2xl space-y-3 font-mono text-xs text-[#2C3E50]">
          <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-2 font-sans">
            <span className="text-xs font-black uppercase text-[#D35400] flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> Live Formatted Cover Letter Output
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400] text-xs font-bold rounded-lg hover:bg-[#FAD7A0] transition flex items-center gap-1"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{isCopied ? 'Copied to Clipboard!' : 'Copy Letter'}</span>
            </button>
          </div>

          <div className="whitespace-pre-wrap leading-relaxed space-y-3 pt-2">
            <p className="font-bold">{greeting}</p>
            <p>{openingParagraph}</p>
            <p>{whyCompany}</p>
            <p>{skillsExperience}</p>
            <p>{projectsHighlight}</p>
            <p>{closingParagraph}</p>
            <p className="font-bold pt-2">{signOff}</p>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex justify-end pt-4 border-t border-[#FAD7A0]">
          <button
            type="button"
            onClick={onCompleteActivity}
            className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#E67E22] transition flex items-center gap-2"
          >
            <span>Proceed to Section 7: Resume Scanner & AI Review</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
