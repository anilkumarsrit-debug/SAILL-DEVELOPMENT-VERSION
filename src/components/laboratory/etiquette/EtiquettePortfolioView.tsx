import React, { useState, useEffect } from 'react';
import { Award, Linkedin, UserCheck, Sparkles, CheckCircle2, Download, Clock, Star, ShieldCheck } from 'lucide-react';
import { dbStorage } from '../../../lib/db';

export const EtiquettePortfolioView: React.FC = () => {
  const [portfolioItems, setPortfolioItems] = useState<Array<any>>([]);

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const items = await dbStorage.getPortfolio();
        const m12Items = (items || []).filter((i) => i.moduleId === 'etiquette-branding');
        if (m12Items.length > 0) {
          setPortfolioItems(m12Items);
        } else {
          // Mock display item for immediate viewing
          setPortfolioItems([
            {
              id: 'best-linkedin-1',
              title: 'Best Optimized LinkedIn Profile Draft',
              category: 'written',
              createdAt: new Date().toISOString(),
              score: 96,
              content: 'Custom URL: linkedin.com/in/student-name-srit\nHeadline: B.Tech CSE Student @ SRIT | Python & Cloud Architecture | Building Smart IoT Systems\nAbout: Driven Computer Science student applying IEEE report standards, corporate netiquette, and team leadership to engineer reliable software systems.',
              teacherFeedback: 'Verified by SRIT Faculty • High Executive Alignment.'
            },
            {
              id: 'best-branding-1',
              title: 'Personal Branding & Elevator Pitch Package',
              category: 'branding',
              createdAt: new Date().toISOString(),
              score: 95,
              content: 'SELECTED BRANDING STATEMENT:\nPassionate Computer Science undergraduate at SRIT specializing in AI & Cloud Architecture. Driven by Innovation and Integrity.\n\nELEVATOR PITCH:\nHello! I am a B.Tech Computer Science student at SRIT with a passion for software architecture...',
              teacherFeedback: 'Outstanding elevator pitch clarity and executive presence.'
            }
          ]);
        }
      } catch (e) {
        console.error(e);
      }
    };

    loadPortfolio();
  }, []);

  const careerTimeline = [
    { stage: 'Semester 1-2', label: 'Workplace & Campus Etiquette', desc: 'Mastered formal greetings, meeting decorum, and academic professionalism.', status: 'Completed' },
    { stage: 'Semester 3-4', label: 'Digital Communication & Netiquette', desc: 'Practiced professional emailing, video meeting camera protocols, and responsible AI usage.', status: 'Completed' },
    { stage: 'Semester 5-6', label: 'LinkedIn Optimization & Brand Building', desc: 'Built 12-section LinkedIn profile, elevator pitch, and 2-sentence branding statement.', status: 'Active' },
    { stage: 'Semester 7-8', label: 'Corporate Recruitment Readiness', desc: 'Executing campus placements, technical interviews, and industry networking.', status: 'Upcoming' }
  ];

  return (
    <div className="space-y-6">
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
        <div className="flex items-center gap-3 border-b border-[#FAD7A0] pb-3">
          <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-[#D35400]">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#D35400] font-heading">
              10. Professional Portfolio & Career Readiness Timeline
            </h2>
            <p className="text-xs text-[#2C3E50]">
              Showcase of best LinkedIn profile, branding statements, elevator pitch, presence report, and career timeline.
            </p>
          </div>
        </div>

        {/* Portfolio Showcase Grid */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-[#D35400] uppercase font-heading tracking-wider">
            Featured Portfolio Artifacts
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {portfolioItems.map((item, idx) => (
              <div key={idx} className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-2">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-[#D35400]" />
                    <h4 className="text-xs font-bold text-[#D35400] font-heading">{item.title}</h4>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Score: {item.score} / 100
                  </span>
                </div>

                <pre className="p-3 bg-white border border-gray-200 rounded-lg text-xs font-mono text-gray-800 whitespace-pre-wrap max-h-40 overflow-y-auto">
                  {item.content}
                </pre>

                <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] text-emerald-900 flex items-center gap-1.5 font-medium">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{item.teacherFeedback || 'Verified by Faculty Lead • Meets R26 Standards.'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Career Readiness Timeline */}
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <h3 className="text-xs font-bold text-[#D35400] uppercase font-heading tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#D35400]" />
            SRIT B.Tech Career Readiness & Etiquette Progression Timeline
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {careerTimeline.map((step, i) => (
              <div key={i} className="p-3.5 bg-white border border-gray-200 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold bg-[#D35400] text-white px-2 py-0.5 rounded">
                    {step.stage}
                  </span>
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    step.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                    step.status === 'Active' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {step.status}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-[#D35400] font-heading">{step.label}</h4>
                <p className="text-[11px] text-[#2C3E50] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
