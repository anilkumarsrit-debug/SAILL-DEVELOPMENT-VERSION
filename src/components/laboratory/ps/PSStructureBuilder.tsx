import React, { useState } from 'react';
import { PenTool, Sparkles, Bookmark, Share2, FileText, CheckCircle2, BookOpen, Clock, Lightbulb, ChevronRight } from 'lucide-react';
import { dbStorage } from '../../../lib/db';
import confetti from 'canvas-confetti';

interface FreshmanTopicPreset {
  id: string;
  title: string;
  category: string;
  targetAudience: string;
  openingHook: string;
  keyPoint1: string;
  keyPoint2: string;
  keyPoint3: string;
  visualCue: string;
  conclusion: string;
  guidanceTip: string;
}

interface PSStructureBuilderProps {
  onOutlineSaved?: (outline: any) => void;
}

export const PSStructureBuilder: React.FC<PSStructureBuilderProps> = ({ onOutlineSaved }) => {
  const freshmanTopics: FreshmanTopicPreset[] = [
    {
      id: 'topic-1',
      title: 'My Engineering Journey',
      category: 'Personal Narrative',
      targetAudience: 'Faculty mentors, classmates, and department induction committee',
      openingHook:
        'Why did each of us choose engineering? For me, it started with a simple curiosity: taking apart a broken toy to understand how it worked.',
      keyPoint1:
        'Discovering my passion for mathematics, science, and creative problem-solving during high school and joining SRIT.',
      keyPoint2:
        'Adapting to college academics, programming fundamentals, engineering drawing, and building my first hands-on lab experiments.',
      keyPoint3:
        'My future aspirations: mastering technical skills and developing practical engineering solutions that help society.',
      visualCue:
        'Slide 1: Childhood curiosity photo & First-year learning milestone timeline',
      conclusion:
        'In conclusion, engineering is not just a degree—it is a lifelong mindset of continuous learning and problem-solving. Thank you!',
      guidanceTip:
        'Speech Timing: Spend 30s on your childhood spark (Hook), 45s on high school passion, 45s on college transition, and 30s on your future vision.'
    },
    {
      id: 'topic-2',
      title: 'Importance of Communication Skills',
      category: 'Professional Skills',
      targetAudience: 'Engineering students, soft skills trainers, and placement mentors',
      openingHook:
        'A brilliant technical algorithm or machine design is useless if the engineer cannot clearly explain its value to a client or team.',
      keyPoint1:
        'The Technical-Communication Balance: Why engineering excellence requires both 50% technical knowledge and 50% clear articulation.',
      keyPoint2:
        'Impact on Placements & Teamwork: How active listening, structured emails, and confident speaking drive successful campus placement interviews.',
      keyPoint3:
        'Practical Steps for Daily Practice: Overcoming stage fear through daily laboratory practice, group discussions, and reading technical articles aloud.',
      visualCue:
        'Slide 2: Industry survey chart showing top hiring skills demanded by tech employers',
      conclusion:
        'To conclude, words give life to our code and blueprints. Let us invest in our communication skills every day. Thank you!',
      guidanceTip:
        'Emphasize the contrast between code and communication with clear vocal inflection on "50% technical and 50% articulation".'
    },
    {
      id: 'topic-3',
      title: 'Technology in Everyday Life',
      category: 'General Technology',
      targetAudience: 'General college audience, peers, and evaluation panel',
      openingHook:
        'From the smart alarm that woke us up this morning to UPI digital payments at the college canteen, technology surrounds every second of our day.',
      keyPoint1:
        'Everyday Convenience: How smartphones, instant digital payments, and navigation apps have simplified routine human tasks.',
      keyPoint2:
        'Smart Automation: The role of embedded sensors and microcontrollers in washing machines, electric vehicles, and home appliances.',
      keyPoint3:
        'Responsible Usage & Balance: Maintaining personal well-being by balancing screen time and digital habits with physical activity.',
      visualCue:
        'Slide 2: Infographic showing daily human tech interactions across a 24-hour routine',
      conclusion:
        'In conclusion, technology is a powerful servant when used with discipline and purpose. Thank you for your time.',
      guidanceTip:
        'Use relatable everyday examples (UPI, Google Maps, smart alarms) that your classmates instantly connect with.'
    },
    {
      id: 'topic-4',
      title: 'My Favourite Engineering Innovation',
      category: 'Innovation & Tech',
      targetAudience: 'Engineering faculty, classmates, and technical club members',
      openingHook:
        'What single invention transformed humanity from mechanical calculators to smartphones and space rovers? For me, it is the transistor.',
      keyPoint1:
        'The Innovation & History: How replacing bulky vacuum tubes with tiny silicon semiconductors revolutionized all electronics.',
      keyPoint2:
        'Everyday Impact: How billions of microscopic transistors power modern computers, smartphones, medical scanners, and satellites.',
      keyPoint3:
        'The Future Ahead: The next frontier in nanotechnology, energy-efficient microchips, and renewable smart power systems.',
      visualCue:
        'Slide 3: Side-by-side comparison of 1947 point-contact transistor vs modern 3nm microchip',
      conclusion:
        'In summary, small engineering innovations can create gigantic revolutions. Thank you, and I look forward to your questions.',
      guidanceTip:
        'Hold up a physical object (like a calculator or microcontroller chip) as a visual aid to anchor audience attention.'
    },
    {
      id: 'topic-5',
      title: 'Social Media: Advantages and Disadvantages',
      category: 'Society & Media',
      targetAudience: 'Youth, classmates, and communicative English evaluators',
      openingHook:
        'Over 5 billion people log into social media platforms every day. Is it bringing humanity closer together, or driving us further apart?',
      keyPoint1:
        'The Advantages: Instant access to global learning communities, educational content, networking with industry experts, and rapid awareness.',
      keyPoint2:
        'The Disadvantages: Information overload, digital distractions, reduced attention spans, and cyber safety risks.',
      keyPoint3:
        'Constructive Student Solutions: Setting daily screen time limits, following constructive educational accounts, and building a professional portfolio on LinkedIn.',
      visualCue:
        'Slide 2: Two-column balance sheet comparing advantages (learning, network) vs disadvantages (distraction, anxiety)',
      conclusion:
        'To conclude, social media is simply a tool—its impact on our future depends entirely on our self-discipline. Thank you!',
      guidanceTip:
        'Maintain an objective, balanced tone. Present both sides fairly before delivering your practical student recommendations.'
    },
    {
      id: 'topic-6',
      title: 'Artificial Intelligence in Education',
      category: 'AI & Learning',
      targetAudience: 'Teachers, college students, and educational mentors',
      openingHook:
        'Imagine having a personal, 24/7 tutor that explains complex mathematics and coding errors at your own individual learning speed.',
      keyPoint1:
        'Personalized Learning: How AI tutors adapt practice questions and explanations to match each student’s unique learning pace.',
      keyPoint2:
        'Interactive Skill Practice: Using AI tools for language pronunciation feedback, interactive quizzes, and instant code debugging.',
      keyPoint3:
        'Academic Integrity & Ethics: Why students must use AI as a learning companion for understanding concepts, rather than a shortcut for copy-pasting.',
      visualCue:
        'Slide 3: Flowchart comparing traditional classroom vs AI-assisted adaptive learning',
      conclusion:
        'In summary, AI will never replace passionate teachers, but teachers and students who leverage AI will redefine the future of education. Thank you!',
      guidanceTip:
        'Speak clearly about ethical AI usage and give concrete examples like language labs and code feedback.'
    },
    {
      id: 'topic-7',
      title: 'Environmental Protection',
      category: 'Sustainability',
      targetAudience: 'College community, environmental club, and evaluation jury',
      openingHook:
        'Every single minute, one garbage truck worth of plastic enters our oceans. As future engineers, what will we do to protect our planet?',
      keyPoint1:
        'The Urgent Challenges: Rising global temperatures, electronic waste accumulation, and urban air and water pollution.',
      keyPoint2:
        'Green Engineering Solutions: Solar energy systems, biodegradable materials, and circular recycling technologies for electronic devices.',
      keyPoint3:
        'Campus & Individual Action: Practical steps at SRIT: eliminating single-use plastics, conserving energy, and setting up campus e-waste recycling bins.',
      visualCue:
        'Slide 4: Carbon footprint reduction diagram and campus green energy initiatives',
      conclusion:
        'In conclusion, the greatest threat to our planet is the belief that someone else will save it. Let us build a greener tomorrow. Thank you!',
      guidanceTip:
        'Deliver the opening plastic statistic with solemn, deliberate pacing and a 1-second pause to let the audience reflect.'
    },
    {
      id: 'topic-8',
      title: 'Teamwork in Engineering',
      category: 'Collaboration',
      targetAudience: 'First-year project teams, student club leaders, and faculty',
      openingHook:
        'No single engineer ever built a space shuttle, an electric car, or a modern operating system alone. Engineering is always a team sport.',
      keyPoint1:
        'Combining Diverse Talents: Bringing together hardware designers, software coders, and organizers to create complete solutions.',
      keyPoint2:
        'Communication & Conflict Resolution: Holding regular team standup meetings, active listening, and clear task division to avoid misunderstandings.',
      keyPoint3:
        'Collaboration Tools & Accountability: Using shared task boards, version control, and peer reviews to deliver semester projects successfully.',
      visualCue:
        'Slide 2: Team collaboration cycle: Ideation -> Division of Tasks -> Integration -> Testing',
      conclusion:
        'To wrap up, individual talent wins moments, but teamwork and mutual trust build great engineering achievements. Thank you!',
      guidanceTip:
        'Share a real or relatable example of how a group project succeeded through clear communication and division of labor.'
    }
  ];

  const [selectedTopicId, setSelectedTopicId] = useState<string>('topic-1');
  const [topicTitle, setTopicTitle] = useState<string>(freshmanTopics[0].title);
  const [targetAudience, setTargetAudience] = useState<string>(freshmanTopics[0].targetAudience);
  const [openingHook, setOpeningHook] = useState<string>(freshmanTopics[0].openingHook);
  const [keyPoint1, setKeyPoint1] = useState<string>(freshmanTopics[0].keyPoint1);
  const [keyPoint2, setKeyPoint2] = useState<string>(freshmanTopics[0].keyPoint2);
  const [keyPoint3, setKeyPoint3] = useState<string>(freshmanTopics[0].keyPoint3);
  const [visualCue, setVisualCue] = useState<string>(freshmanTopics[0].visualCue);
  const [conclusion, setConclusion] = useState<string>(freshmanTopics[0].conclusion);
  const [guidanceTip, setGuidanceTip] = useState<string>(freshmanTopics[0].guidanceTip);

  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleSelectTopic = (preset: FreshmanTopicPreset) => {
    setSelectedTopicId(preset.id);
    setTopicTitle(preset.title);
    setTargetAudience(preset.targetAudience);
    setOpeningHook(preset.openingHook);
    setKeyPoint1(preset.keyPoint1);
    setKeyPoint2(preset.keyPoint2);
    setKeyPoint3(preset.keyPoint3);
    setVisualCue(preset.visualCue);
    setConclusion(preset.conclusion);
    setGuidanceTip(preset.guidanceTip);
    setIsSaved(false);
  };

  const handleSaveOutline = async () => {
    try {
      const outlineContent = `Freshman Presentation Script Deck:\nTopic: ${topicTitle}\nAudience: ${targetAudience}\nOpening Hook: ${openingHook}\nCore Point 1: ${keyPoint1}\nCore Point 2: ${keyPoint2}\nCore Point 3: ${keyPoint3}\nVisual Cue: ${visualCue}\nConclusion: ${conclusion}`;

      await dbStorage.savePortfolioItem({
        id: 'ps-outline-' + Date.now(),
        moduleId: 'public-speaking',
        moduleTitle: 'Public Speaking & Presentations',
        title: `Presentation Outline: ${topicTitle}`,
        category: 'written',
        content: outlineContent,
        score: 9.5,
        createdAt: new Date().toISOString()
      });

      setIsSaved(true);
      confetti({ particleCount: 30, spread: 50 });
      if (onOutlineSaved) {
        onOutlineSaved({
          topicTitle,
          openingHook,
          keyPoint1,
          keyPoint2,
          keyPoint3,
          conclusion
        });
      }
    } catch (err) {
      console.error('Error saving outline', err);
    }
  };

  return (
    <div className="srit-card p-6 bg-white border border-[#FAD7A0] rounded-2xl space-y-6">
      {/* Header */}
      <div className="border-b border-[#FAD7A0] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <PenTool className="w-5 h-5 text-[#D35400]" />
            <h3 className="text-lg font-extrabold text-[#2C3E50] font-heading">
              Section 6: Guided Presentation Structure & Script Deck Builder
            </h3>
          </div>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Build a structured presentation speech with an attention-grabbing hook, 3 clear points, visual slide cues, and conclusion.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono font-bold bg-[#FFF8F0] px-3 py-1.5 rounded-xl border border-[#FAD7A0] text-[#D35400]">
          <Clock className="w-3.5 h-3.5" />
          <span>Recommended Duration: 3 Mins (180s)</span>
        </div>
      </div>

      {/* 8 Freshman Topic Selectors */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-extrabold text-[#2C3E50] flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-[#D35400]" />
            <span>Select a First-Year Presentation Topic:</span>
          </label>
          <span className="text-[10px] font-mono text-[#5D6D7E]">8 Freshman-Friendly Topics Available</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {freshmanTopics.map((item, idx) => {
            const isSelected = selectedTopicId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTopic(item)}
                className={`p-3 rounded-xl text-left transition border cursor-pointer flex flex-col justify-between gap-1.5 ${
                  isSelected
                    ? 'bg-[#D35400] text-white border-[#D35400] shadow-sm'
                    : 'bg-[#FFF8F0] text-[#2C3E50] border-[#FAD7A0] hover:bg-[#FDEBD0]'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-[10px] font-mono font-bold uppercase ${isSelected ? 'text-[#FAD7A0]' : 'text-[#D35400]'}`}>
                    Topic {idx + 1}
                  </span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${isSelected ? 'bg-white/20 text-white' : 'bg-white text-[#5D6D7E] border border-[#FAD7A0]'}`}>
                    {item.category}
                  </span>
                </div>
                <h5 className="font-extrabold text-xs leading-snug line-clamp-1">
                  {item.title}
                </h5>
              </button>
            );
          })}
        </div>
      </div>

      {/* Guidance & Delivery Tip Banner */}
      <div className="p-3.5 bg-gradient-to-r from-[#FFF8F0] to-[#FEF9E7] border border-[#FAD7A0] rounded-xl flex items-start gap-3 text-xs">
        <Lightbulb className="w-4 h-4 text-[#D35400] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-extrabold text-[#2C3E50]">Presentation Guidance & Pacing Strategy:</span>
          <p className="text-[#5D6D7E] text-[11px] leading-relaxed">
            {guidanceTip}
          </p>
        </div>
      </div>

      {/* Script Builder Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="space-y-1.5">
          <label className="font-extrabold text-[#2C3E50] block">Presentation Topic Title:</label>
          <input
            type="text"
            value={topicTitle}
            onChange={(e) => {
              setTopicTitle(e.target.value);
              setIsSaved(false);
            }}
            className="w-full p-2.5 border border-[#FAD7A0] rounded-xl bg-[#FFF8F0] text-xs font-bold outline-none focus:ring-2 focus:ring-[#D35400] text-[#2C3E50]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-extrabold text-[#2C3E50] block">Target Audience Profile:</label>
          <input
            type="text"
            value={targetAudience}
            onChange={(e) => {
              setTargetAudience(e.target.value);
              setIsSaved(false);
            }}
            className="w-full p-2.5 border border-[#FAD7A0] rounded-xl bg-[#FFF8F0] text-xs outline-none focus:ring-2 focus:ring-[#D35400] text-[#2C3E50]"
          />
        </div>

        <div className="md:col-span-2 space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="font-extrabold text-[#2C3E50] block">
              1. Opening Hook Statement (Curiosity Question, Story, or Everyday Example):
            </label>
            <span className="text-[10px] font-mono text-[#D35400]">~30 Seconds</span>
          </div>
          <textarea
            rows={2}
            value={openingHook}
            onChange={(e) => {
              setOpeningHook(e.target.value);
              setIsSaved(false);
            }}
            className="w-full p-2.5 border border-[#FAD7A0] rounded-xl bg-[#FFF8F0] text-xs outline-none focus:ring-2 focus:ring-[#D35400] text-[#2C3E50] leading-relaxed"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="font-extrabold text-[#2C3E50] block">2. Core Point 1 (Problem / Foundation):</label>
            <span className="text-[10px] font-mono text-[#D35400]">~45 Seconds</span>
          </div>
          <textarea
            rows={3}
            value={keyPoint1}
            onChange={(e) => {
              setKeyPoint1(e.target.value);
              setIsSaved(false);
            }}
            className="w-full p-2.5 border border-[#FAD7A0] rounded-xl bg-[#FFF8F0] text-xs outline-none focus:ring-2 focus:ring-[#D35400] text-[#2C3E50] leading-relaxed"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="font-extrabold text-[#2C3E50] block">3. Core Point 2 (Analysis / Key Insights):</label>
            <span className="text-[10px] font-mono text-[#D35400]">~45 Seconds</span>
          </div>
          <textarea
            rows={3}
            value={keyPoint2}
            onChange={(e) => {
              setKeyPoint2(e.target.value);
              setIsSaved(false);
            }}
            className="w-full p-2.5 border border-[#FAD7A0] rounded-xl bg-[#FFF8F0] text-xs outline-none focus:ring-2 focus:ring-[#D35400] text-[#2C3E50] leading-relaxed"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="font-extrabold text-[#2C3E50] block">4. Core Point 3 (Practical Action / Future):</label>
            <span className="text-[10px] font-mono text-[#D35400]">~45 Seconds</span>
          </div>
          <textarea
            rows={3}
            value={keyPoint3}
            onChange={(e) => {
              setKeyPoint3(e.target.value);
              setIsSaved(false);
            }}
            className="w-full p-2.5 border border-[#FAD7A0] rounded-xl bg-[#FFF8F0] text-xs outline-none focus:ring-2 focus:ring-[#D35400] text-[#2C3E50] leading-relaxed"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="font-extrabold text-[#2C3E50] block">5. Slide Visual / Diagram Cue:</label>
            <span className="text-[10px] font-mono text-[#D35400]">Visual Aid</span>
          </div>
          <textarea
            rows={3}
            value={visualCue}
            onChange={(e) => {
              setVisualCue(e.target.value);
              setIsSaved(false);
            }}
            className="w-full p-2.5 border border-[#FAD7A0] rounded-xl bg-[#FFF8F0] text-xs outline-none focus:ring-2 focus:ring-[#D35400] text-[#2C3E50] leading-relaxed"
          />
        </div>

        <div className="md:col-span-2 space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="font-extrabold text-[#2C3E50] block">6. Conclusion & Takeaway Message:</label>
            <span className="text-[10px] font-mono text-[#D35400]">~30 Seconds</span>
          </div>
          <textarea
            rows={2}
            value={conclusion}
            onChange={(e) => {
              setConclusion(e.target.value);
              setIsSaved(false);
            }}
            className="w-full p-2.5 border border-[#FAD7A0] rounded-xl bg-[#FFF8F0] text-xs outline-none focus:ring-2 focus:ring-[#D35400] text-[#2C3E50] leading-relaxed"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-2">
        <button
          onClick={handleSaveOutline}
          className={`w-full py-3 rounded-xl text-xs font-bold text-white transition flex items-center justify-center gap-2 shadow-2xs cursor-pointer ${
            isSaved ? 'bg-emerald-600' : 'bg-[#D35400] hover:bg-[#E67E22]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{isSaved ? 'Presentation Script Deck Saved to Portfolio ✓' : 'Save Script Deck to Laboratory Portfolio'}</span>
        </button>
      </div>
    </div>
  );
};
