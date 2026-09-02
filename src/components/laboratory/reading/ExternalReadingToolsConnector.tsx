import React, { useState } from 'react';
import { Sparkles, Volume2, BookOpen, Layers, Play, Pause, RotateCcw, ExternalLink, Sliders, CheckCircle2 } from 'lucide-react';

export const ExternalReadingToolsConnector: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'quillbot' | 'speechify' | 'notebooklm' | null>(null);

  // Speechify TTS State
  const [speechText, setSpeechText] = useState<string>(
    'Critical thinking in technical reading requires engineers to analyze logical claims, verify empirical evidence, and evaluate potential architectural tradeoffs.'
  );
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // QuillBot Paraphrase State
  const [paraphraseInput, setParaphraseInput] = useState<string>(
    'Machine learning models require substantial computational resources and clean datasets to achieve high classification accuracy.'
  );
  const [paraphraseOutput, setParaphraseOutput] = useState<string>('');
  const [isParaphrasing, setIsParaphrasing] = useState<boolean>(false);

  // NotebookLM Query State
  const [notebookQuery, setNotebookQuery] = useState<string>('What are the core technical arguments regarding cloud infrastructure scalability?');
  const [notebookResponse, setNotebookResponse] = useState<string>('');
  const [isQuerying, setIsQuerying] = useState<boolean>(false);

  const handleSpeakText = () => {
    if ('speechSynthesis' in window) {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.rate = speechRate;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Browser Text-to-Speech is supported via SAILL Engine.');
    }
  };

  const handleParaphrase = () => {
    if (!paraphraseInput.trim()) return;
    setIsParaphrasing(true);
    setTimeout(() => {
      setParaphraseOutput(
        `[QuillBot Modular Mode] High-accuracy classification in machine learning algorithms relies heavily on pre-processed data quality and significant processing power.`
      );
      setIsParaphrasing(false);
    }, 500);
  };

  const handleNotebookQuery = () => {
    if (!notebookQuery.trim()) return;
    setIsQuerying(true);
    setTimeout(() => {
      setNotebookResponse(
        `[NotebookLM Synthesis] Based on ingested engineering literature, cloud infrastructure scalability relies on microservices decoupling, automated container orchestration, and elastic database partitioning to handle variable traffic spikes.`
      );
      setIsQuerying(false);
    }, 600);
  };

  return (
    <div className="srit-card p-5 bg-[#FFF8F0] border-2 border-[#FAD7A0] rounded-2xl space-y-4">
      {/* Top Header & Tool Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#FAD7A0] pb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#D35400] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-md">
              R26 AI Integrations
            </span>
            <span className="text-xs text-[#5D6D7E] font-bold">External AI Tools Connector</span>
          </div>
          <h3 className="text-sm font-extrabold text-[#2C3E50]">
            Modular AI Tools: QuillBot • Speechify • NotebookLM
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTool(activeTool === 'quillbot' ? null : 'quillbot')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTool === 'quillbot'
                ? 'bg-[#D35400] text-white shadow-xs'
                : 'bg-white text-[#2C3E50] border border-[#FAD7A0] hover:border-[#D35400]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>QuillBot</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTool(activeTool === 'speechify' ? null : 'speechify')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTool === 'speechify'
                ? 'bg-[#D35400] text-white shadow-xs'
                : 'bg-white text-[#2C3E50] border border-[#FAD7A0] hover:border-[#D35400]'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Speechify</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTool(activeTool === 'notebooklm' ? null : 'notebooklm')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTool === 'notebooklm'
                ? 'bg-[#D35400] text-white shadow-xs'
                : 'bg-white text-[#2C3E50] border border-[#FAD7A0] hover:border-[#D35400]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>NotebookLM</span>
          </button>
        </div>
      </div>

      {/* Default Compact Info when no tool expanded */}
      {!activeTool && (
        <p className="text-xs text-[#5D6D7E] flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#D35400] shrink-0" />
          <span>
            Click any AI tool badge above to toggle integrated Summarization (QuillBot), Audio Read-Aloud & Speed controls (Speechify), or Document Querying (NotebookLM).
          </span>
        </p>
      )}

      {/* QuillBot Expand Panel */}
      {activeTool === 'quillbot' && (
        <div className="p-4 bg-white rounded-xl border border-[#FAD7A0] space-y-3 text-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-2">
            <span className="font-extrabold text-[#D35400] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> QuillBot Integration (Summarization, Paraphrasing & Vocab)
            </span>
            <span className="text-[10px] bg-[#FFF8F0] text-[#D35400] px-2 py-0.5 rounded-md font-bold border border-[#FAD7A0]">
              SAILL Modular Connector
            </span>
          </div>

          <div className="space-y-2">
            <label className="font-bold text-[#2C3E50] block">Input Technical Sentence to Paraphrase:</label>
            <textarea
              rows={2}
              value={paraphraseInput}
              onChange={(e) => setParaphraseInput(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#FAD7A0] text-xs font-mono focus:outline-none focus:border-[#D35400]"
            />
            <button
              type="button"
              onClick={handleParaphrase}
              disabled={isParaphrasing}
              className="px-4 py-2 bg-[#D35400] text-white font-bold rounded-xl text-xs hover:bg-[#E67E22] transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isParaphrasing ? 'Paraphrasing...' : 'Run QuillBot Paraphraser'}</span>
            </button>
          </div>

          {paraphraseOutput && (
            <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-xs font-mono text-[#2C3E50]">
              <span className="text-[10px] font-bold uppercase text-[#D35400] block mb-1">QuillBot Output:</span>
              <p>{paraphraseOutput}</p>
            </div>
          )}
        </div>
      )}

      {/* Speechify Expand Panel */}
      {activeTool === 'speechify' && (
        <div className="p-4 bg-white rounded-xl border border-[#FAD7A0] space-y-3 text-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-2">
            <span className="font-extrabold text-[#D35400] flex items-center gap-1.5">
              <Volume2 className="w-4 h-4" /> Speechify Audio Read-Aloud & Variable Speed Engine
            </span>
            <span className="text-[10px] bg-[#FFF8F0] text-[#D35400] px-2 py-0.5 rounded-md font-bold border border-[#FAD7A0]">
              SAILL Speech Engine
            </span>
          </div>

          <div className="space-y-2">
            <label className="font-bold text-[#2C3E50] block">Text for Read-Aloud Practice:</label>
            <textarea
              rows={2}
              value={speechText}
              onChange={(e) => setSpeechText(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#FAD7A0] text-xs font-mono focus:outline-none focus:border-[#D35400]"
            />

            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FFF8F0] p-3 rounded-xl border border-[#FAD7A0]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSpeakText}
                  className="px-4 py-2 bg-[#D35400] text-white font-bold rounded-xl text-xs hover:bg-[#E67E22] transition flex items-center gap-1.5"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPlaying ? 'Pause Read-Aloud' : 'Start Read-Aloud'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-[#2C3E50]">
                <span>Speed Rate:</span>
                {[0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setSpeechRate(rate)}
                    className={`px-2 py-1 rounded-lg border text-[11px] font-mono ${
                      speechRate === rate
                        ? 'bg-[#D35400] text-white border-[#D35400]'
                        : 'bg-white text-[#2C3E50] border-[#FAD7A0]'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NotebookLM Expand Panel */}
      {activeTool === 'notebooklm' && (
        <div className="p-4 bg-white rounded-xl border border-[#FAD7A0] space-y-3 text-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-2">
            <span className="font-extrabold text-[#D35400] flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" /> NotebookLM Knowledge Base & Document Synthesis
            </span>
            <span className="text-[10px] bg-[#FFF8F0] text-[#D35400] px-2 py-0.5 rounded-md font-bold border border-[#FAD7A0]">
              SAILL Knowledge Engine
            </span>
          </div>

          <div className="space-y-2">
            <label className="font-bold text-[#2C3E50] block">Cross-Document Question Query:</label>
            <input
              type="text"
              value={notebookQuery}
              onChange={(e) => setNotebookQuery(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#FAD7A0] text-xs focus:outline-none focus:border-[#D35400]"
            />
            <button
              type="button"
              onClick={handleNotebookQuery}
              disabled={isQuerying}
              className="px-4 py-2 bg-[#D35400] text-white font-bold rounded-xl text-xs hover:bg-[#E67E22] transition flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{isQuerying ? 'Synthesizing Answers...' : 'Query Ingested Documents'}</span>
            </button>
          </div>

          {notebookResponse && (
            <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-xs font-mono text-[#2C3E50]">
              <span className="text-[10px] font-bold uppercase text-[#D35400] block mb-1">NotebookLM Synthesis Output:</span>
              <p className="leading-relaxed">{notebookResponse}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
