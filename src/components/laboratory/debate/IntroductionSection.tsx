import React, { useState } from 'react';
import { BookOpen, Brain, Shield, Award, Play, Pause, Volume2, Lightbulb, CheckCircle2 } from 'lucide-react';

export const IntroductionSection: React.FC = () => {
  const [activeExampleIndex, setActiveExampleIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const debateExamples = [
    {
      title: 'Academic Debate: Autonomous AI Systems Ethics',
      domain: 'Engineering & Technology Ethics',
      context: 'SRIT Inter-Departmental Parliamentary Debate Final',
      speaker: 'Affirmative First Speaker (Computer Science Engineering)',
      transcript:
        'Mr. Speaker, autonomous decision-making algorithms deployed in healthcare and autonomous transport directly impact human survival. We argue that developers must be held legally accountable for algorithmic biases because self-regulation in the tech sector has repeatedly failed to protect vulnerable populations.',
      breakdown: [
        { label: 'Claim', text: 'Developers must be held legally accountable for algorithmic bias.' },
        { label: 'Evidence', text: 'Self-regulation has failed across medical AI deployments.' },
        { label: 'Impact', text: 'Protects vulnerable populations from automated system errors.' }
      ]
    },
    {
      title: 'Workplace Review Board: Cloud vs On-Premises Architecture',
      domain: 'Professional Engineering Discussion',
      context: 'Tech Mahindra Design Review Meeting',
      speaker: 'Principal Software Architect',
      transcript:
        'While migrating our database to hyperscale cloud reduces upfront capital expenditure by 35%, our team asserts that latency-sensitive manufacturing telemetry requires edge-computing deployment. Over-reliance on public cloud introduces single-point internet outages that halt factory assembly lines.',
      breakdown: [
        { label: 'Counter-Concession', text: 'Acknowledges 35% upfront cost savings of public cloud.' },
        { label: 'Core Claim', text: 'Manufacturing telemetry requires edge computing.' },
        { label: 'Reasoning', text: 'Prevents single-point internet outages from halting production lines.' }
      ]
    }
  ];

  const currentExample = debateExamples[activeExampleIndex];

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-[#D35400]">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-[#E67E22] uppercase tracking-wider">
              Module 10 • Section 1
            </span>
            <h2 className="text-xl font-bold text-[#D35400] font-heading">
              Introduction to Debate & Critical Thinking
            </h2>
          </div>
        </div>
        <p className="text-xs text-[#2C3E50] leading-relaxed">
          Debate is not merely winning an argument—it is the disciplined intellectual practice of constructing logical claims, verifying empirical evidence, anticipating counter-perspectives, and communicating with persuasive clarity.
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="srit-card p-4 bg-white border border-[#FAD7A0] space-y-2">
          <div className="flex items-center gap-2 text-[#D35400] font-bold text-sm font-heading">
            <BookOpen className="w-4 h-4" />
            <span>1. Purpose of Debate</span>
          </div>
          <p className="text-xs text-[#5D6D7E] leading-relaxed">
            Cultivates multi-dimensional problem solving by forcing speakers to objectively analyze both sides of complex technical and ethical issues.
          </p>
        </div>

        <div className="srit-card p-4 bg-white border border-[#FAD7A0] space-y-2">
          <div className="flex items-center gap-2 text-[#D35400] font-bold text-sm font-heading">
            <Brain className="w-4 h-4" />
            <span>2. Critical Thinking</span>
          </div>
          <p className="text-xs text-[#5D6D7E] leading-relaxed">
            Differentiates verifiable evidence from personal assertions, identifies hidden assumptions, and detects logical fallacies immediately.
          </p>
        </div>

        <div className="srit-card p-4 bg-white border border-[#FAD7A0] space-y-2">
          <div className="flex items-center gap-2 text-[#D35400] font-bold text-sm font-heading">
            <Award className="w-4 h-4" />
            <span>3. Academic Debates</span>
          </div>
          <p className="text-xs text-[#5D6D7E] leading-relaxed">
            Follows strict parliamentary motions, formal speaker time limits, points of information, and structured rebuttal protocols.
          </p>
        </div>

        <div className="srit-card p-4 bg-white border border-[#FAD7A0] space-y-2">
          <div className="flex items-center gap-2 text-[#D35400] font-bold text-sm font-heading">
            <Shield className="w-4 h-4" />
            <span>4. Workplace & Professional</span>
          </div>
          <p className="text-xs text-[#5D6D7E] leading-relaxed">
            Essential for technical design reviews, defending project budgets, pitching software architecture, and boardroom decision-making.
          </p>
        </div>
      </div>

      {/* Interactive Debate Example Showcase */}
      <div className="srit-card p-6 bg-[#FFF8F0] border border-[#FAD7A0] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-[#D35400] flex items-center gap-2 font-heading">
              <Lightbulb className="w-5 h-5 text-[#E67E22]" />
              <span>Interactive Model Debate Demonstrations</span>
            </h3>
            <p className="text-xs text-[#5D6D7E]">Inspect structured debate excerpts from academic and corporate engineering settings</p>
          </div>

          <div className="flex items-center gap-2">
            {debateExamples.map((ex, idx) => (
              <button
                key={ex.title}
                onClick={() => {
                  setActiveExampleIndex(idx);
                  setIsPlaying(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeExampleIndex === idx
                    ? 'bg-[#D35400] text-white shadow-2xs'
                    : 'bg-white text-[#2C3E50] border border-[#FAD7A0] hover:bg-[#FAD7A0]'
                }`}
              >
                Case {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Example Card */}
        <div className="p-4 bg-white rounded-xl border border-[#FAD7A0] space-y-3">
          <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-2">
            <div>
              <span className="text-[10px] font-bold uppercase text-[#D35400] bg-[#FFF8F0] px-2 py-0.5 rounded border border-[#FAD7A0]">
                {currentExample.domain}
              </span>
              <h4 className="text-sm font-bold text-[#2C3E50] mt-1">{currentExample.title}</h4>
            </div>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3 py-1.5 bg-[#D35400] hover:bg-[#E67E22] text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause Speech' : 'Listen Model Speech'}</span>
            </button>
          </div>

          <p className="text-xs text-[#2C3E50] italic bg-[#FFF8F0] p-3 rounded-lg border border-[#FAD7A0]/60 leading-relaxed font-serif">
            "{currentExample.transcript}"
          </p>

          <div className="space-y-1.5 pt-2">
            <span className="text-[11px] font-bold text-[#D35400] uppercase tracking-wider block">
              Structural Argument Breakdown:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {currentExample.breakdown.map((item) => (
                <div key={item.label} className="p-2.5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-lg text-xs space-y-1">
                  <span className="font-bold text-[#D35400] block text-[10px] uppercase">{item.label}</span>
                  <p className="text-[11px] text-[#2C3E50]">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
