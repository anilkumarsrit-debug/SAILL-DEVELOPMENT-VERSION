import React, { useState } from 'react';
import { BookOpen, CheckCircle2, ArrowRight, Highlighter, Sparkles, Save, Check, Layers, Cpu, Globe, HeartPulse, GraduationCap, Building, Leaf, ShieldAlert } from 'lucide-react';

interface ArticleReadingLabProps {
  onCompleteActivity: () => void;
}

export const ArticleReadingLab: React.FC<ArticleReadingLabProps> = ({ onCompleteActivity }) => {
  const articles = [
    {
      id: 'art-ai',
      category: 'Artificial Intelligence',
      icon: Cpu,
      title: 'Generative AI and Large Language Model Optimization in Enterprise Software',
      passage: `Large Language Models (LLMs) have transformed software development workflows by automating code synthesis, bug detection, and automated test generation. However, deploying multi-billion parameter foundation models in production environments introduces latency overheads and token cost constraints. To mitigate these challenges, AI engineers employ techniques such as 8-bit quantization, low-rank adaptation (LoRA), and retrieval-augmented generation (RAG). RAG allows models to ground their responses in proprietary enterprise vector databases without requiring costly full model retraining, ensuring data privacy and zero-shot contextual accuracy.`,
      highlights: ['8-bit quantization', 'low-rank adaptation (LoRA)', 'retrieval-augmented generation (RAG)', 'vector databases'],
      questions: [
        {
          question: 'What primary issue is mitigated by employing Retrieval-Augmented Generation (RAG)?',
          options: [
            'Model latency and costly full retraining requirements',
            'Hardware GPU chip fabrication limits',
            'Compiler syntax errors in Python scripts',
            'Network bandwidth restrictions'
          ],
          correct: 0
        },
        {
          question: 'How does RAG ensure data privacy for enterprise software?',
          options: [
            'By uploading all data to public internet servers',
            'By grounding responses in proprietary vector databases locally',
            'By disabling encryption protocols',
            'By rewriting compiler code in assembly language'
          ],
          correct: 1
        }
      ]
    },
    {
      id: 'art-eng',
      category: 'Engineering & Renewable Energy',
      icon: Leaf,
      title: 'Solid-State Battery Chemistry for Next-Generation Electric Vehicles',
      passage: `Solid-state lithium-metal batteries represent a major paradigm shift in energy storage technology. Unlike traditional lithium-ion cells that utilize flammable liquid organic electrolytes, solid-state batteries incorporate solid ceramic or polymeric ion conductors. This fundamental architectural change dramatically reduces thermal runaway risks, increases volumetric energy density beyond 400 Wh/kg, and enables fast charging capabilities from 10% to 80% state-of-charge in under 12 minutes.`,
      highlights: ['solid ceramic or polymeric ion conductors', 'thermal runaway risks', 'volumetric energy density beyond 400 Wh/kg', 'under 12 minutes'],
      questions: [
        {
          question: 'What is the main physical difference between traditional lithium-ion batteries and solid-state batteries?',
          options: [
            'Solid-state batteries use solid ceramic/polymeric electrolytes instead of flammable liquid electrolytes',
            'Solid-state batteries do not use lithium',
            'Traditional batteries operate without electrodes',
            'Solid-state batteries require lead-acid plates'
          ],
          correct: 0
        }
      ]
    },
    {
      id: 'art-health',
      category: 'Healthcare & Biomedical Tech',
      icon: HeartPulse,
      title: 'Microfluidic Lab-on-a-Chip Devices for Rapid Point-of-Care Diagnostics',
      passage: `Microfluidic lab-on-a-chip (LOC) systems integrate multiple laboratory functions onto a single miniaturized substrate measuring a few square centimeters. By manipulating sub-microliter liquid volumes through capillary microchannels, LOC platforms execute automated DNA amplification and biomarker detection within minutes. These portable diagnostic tools enable instant infectious disease screening in remote rural health centers lacking centralized laboratory infrastructure.`,
      highlights: ['sub-microliter liquid volumes', 'miniaturized substrate', 'instant infectious disease screening', 'lacking centralized laboratory infrastructure'],
      questions: [
        {
          question: 'Why are lab-on-a-chip devices particularly valuable in remote rural health centers?',
          options: [
            'They enable instant disease screening without requiring centralized laboratory infrastructure',
            'They replace qualified doctors completely',
            'They operate without electric power or batteries',
            'They require heavy refrigeration units'
          ],
          correct: 0
        }
      ]
    }
  ];

  const [selectedArticleIndex, setSelectedArticleIndex] = useState<number>(0);
  const current = articles[selectedArticleIndex];

  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [highlightedText, setHighlightedText] = useState<Set<string>>(new Set());
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const toggleHighlight = (phrase: string) => {
    setHighlightedText((prev) => {
      const next = new Set(prev);
      if (next.has(phrase)) next.delete(phrase);
      else next.add(phrase);
      return next;
    });
  };

  const handleSaveProgress = () => {
    try {
      localStorage.setItem('srit_article_reading_progress', JSON.stringify({
        articleId: current.id,
        answers,
        highlightedText: Array.from(highlightedText),
        savedAt: new Date().toISOString()
      }));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
        {/* Header */}
        <div className="border-b border-[#FAD7A0] pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest bg-[#D35400] text-white px-2 py-0.5 rounded-md">
              Section 3
            </span>
            <span className="text-xs text-[#5D6D7E] font-bold">R26 Communicative English Laboratory</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#D35400]" />
            3. Article Reading Lab
          </h2>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Practice multi-domain technical reading across AI, Engineering, Healthcare, Business, and Science. Highlight key claims and answer comprehension questions.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 border-b border-[#FAD7A0] pb-3">
          {articles.map((art, idx) => {
            const Icon = art.icon;
            return (
              <button
                key={art.id}
                type="button"
                onClick={() => {
                  setSelectedArticleIndex(idx);
                  setAnswers({});
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  selectedArticleIndex === idx
                    ? 'bg-[#D35400] text-white shadow-2xs'
                    : 'bg-[#FFF8F0] text-[#2C3E50] border border-[#FAD7A0] hover:bg-[#FAD7A0]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{art.category}</span>
              </button>
            );
          })}
        </div>

        {/* Article Reading Area */}
        <div className="p-6 bg-[#FFF8F0] border-2 border-[#FAD7A0] rounded-2xl space-y-5">
          <div className="border-b border-[#FAD7A0] pb-3">
            <span className="text-[10px] font-black uppercase bg-white border border-[#FAD7A0] text-[#D35400] px-2 py-0.5 rounded-md">
              {current.category}
            </span>
            <h3 className="text-base font-extrabold text-[#2C3E50] mt-1.5">{current.title}</h3>
          </div>

          {/* Passage Text */}
          <div className="p-5 bg-white rounded-xl border border-[#FAD7A0] font-mono text-xs text-[#2C3E50] leading-relaxed shadow-2xs">
            {current.passage}
          </div>

          {/* Highlighting Helper */}
          <div className="space-y-2">
            <span className="text-xs font-extrabold text-[#D35400] uppercase block">
              Toggle Key Technical Phrase Highlights:
            </span>
            <div className="flex flex-wrap gap-2">
              {current.highlights.map((hl, i) => {
                const active = highlightedText.has(hl);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleHighlight(hl)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold border transition ${
                      active
                        ? 'bg-[#D35400] text-white border-[#D35400]'
                        : 'bg-white text-[#2C3E50] border-[#FAD7A0] hover:bg-[#FFF8F0]'
                    }`}
                  >
                    ✨ {hl}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comprehension Questions */}
          <div className="space-y-4 pt-2">
            <h4 className="text-sm font-extrabold text-[#2C3E50]">Comprehension Assessment Questions:</h4>
            {current.questions.map((q, qIdx) => (
              <div key={qIdx} className="p-4 bg-white rounded-xl border border-[#FAD7A0] space-y-2 text-xs">
                <p className="font-bold text-[#2C3E50]">{qIdx + 1}. {q.question}</p>
                <div className="space-y-1.5">
                  {q.options.map((opt, oIdx) => (
                    <label
                      key={oIdx}
                      className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition ${
                        answers[qIdx] === oIdx
                          ? 'bg-[#FFF8F0] border-[#D35400] text-[#D35400] font-bold'
                          : 'bg-white border-[#FAD7A0] text-[#2C3E50]'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${qIdx}`}
                        checked={answers[qIdx] === oIdx}
                        onChange={() => setAnswers((prev) => ({ ...prev, [qIdx]: oIdx }))}
                        className="accent-[#D35400]"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Save Progress Button */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleSaveProgress}
              className="px-5 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#E67E22] transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSaved ? 'Progress Saved to Notebook!' : 'Save Reading Progress'}</span>
            </button>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex justify-end pt-4 border-t border-[#FAD7A0]">
          <button
            type="button"
            onClick={onCompleteActivity}
            className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#E67E22] transition flex items-center gap-2"
          >
            <span>Proceed to Section 4: Editorial Reading Lab</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
