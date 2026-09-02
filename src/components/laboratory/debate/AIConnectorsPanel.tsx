import React, { useState } from 'react';
import { Sparkles, Bot, GitFork, RefreshCw, CheckCircle2, ShieldCheck, ExternalLink, Network } from 'lucide-react';

export const AIConnectorsPanel: React.FC = () => {
  const [activeConnector, setActiveConnector] = useState<'chatgpt' | 'claude' | 'kialo'>('chatgpt');

  // Interactive connector simulations
  const [chatgptTopic, setChatgptTopic] = useState('This House would regulate generative AI models as public utilities.');
  const [chatgptResult, setChatgptResult] = useState<string | null>(null);

  const [claudeArgument, setClaudeArgument] = useState('Regulating AI models as public utilities ensures equal access for small enterprises and prevents monopoly pricing, but it requires strict government oversight.');
  const [claudeResult, setClaudeResult] = useState<string | null>(null);

  const [kialoMotion, setKialoMotion] = useState('Nuclear energy is essential for powering carbon-neutral AI infrastructure.');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRunChatGPT = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setChatgptResult(
        `ChatGPT Generated Brief:\n• Topic Category: Technology & Public Policy\n• Supporting Points: Prevents monopoly pricing, establishes uniform safety benchmarks.\n• Opposing Points: Stifles early-stage startup innovation, increases bureaucratic delay.\n• Grammar Check: 100% Correct\n• Critical Thinking Index: 9.2/10`
      );
      setIsProcessing(false);
    }, 800);
  };

  const handleRunClaude = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setClaudeResult(
        `Claude Long-Form Argument Analysis:\n• Premise Analysis: Valid. Connects public utility classification to monopoly prevention.\n• Logical Cohesion Score: 9.4/10\n• Edge Cases: Fails to address international jurisdictional enforcement.\n• Structural Reasoning Recommendation: Add an empirical case study on telecommunications deregulation.`
      );
      setIsProcessing(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-[#D35400]">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-[#E67E22] uppercase tracking-wider">
              Module 10 • Modular AI Tool Connectors
            </span>
            <h2 className="text-xl font-bold text-[#D35400] font-heading">
              ChatGPT, Claude & Kialo Edu Integration Hub
            </h2>
          </div>
        </div>
        <p className="text-xs text-[#2C3E50] leading-relaxed">
          R26 Lab syllabus modular connector suite. Switch seamlessly between ChatGPT (Topic/Argument Generation & Grammar), Claude (Long-form Reasoning & Analysis), and Kialo Edu (Pros/Cons Argument Mapping & Debate Tree Visualization).
        </p>
      </div>

      {/* Provider Switcher Tabs */}
      <div className="srit-card p-4 bg-white border border-[#FAD7A0] flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold text-[#D35400] uppercase tracking-wider">
          Select Active AI Integration Connector:
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveConnector('chatgpt')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeConnector === 'chatgpt'
                ? 'bg-[#D35400] text-white shadow-2xs'
                : 'bg-[#FFF8F0] text-[#2C3E50] border border-[#FAD7A0] hover:bg-[#FAD7A0]'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>ChatGPT Connector</span>
          </button>

          <button
            onClick={() => setActiveConnector('claude')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeConnector === 'claude'
                ? 'bg-[#D35400] text-white shadow-2xs'
                : 'bg-[#FFF8F0] text-[#2C3E50] border border-[#FAD7A0] hover:bg-[#FAD7A0]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Claude Connector</span>
          </button>

          <button
            onClick={() => setActiveConnector('kialo')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeConnector === 'kialo'
                ? 'bg-[#D35400] text-white shadow-2xs'
                : 'bg-[#FFF8F0] text-[#2C3E50] border border-[#FAD7A0] hover:bg-[#FAD7A0]'
            }`}
          >
            <GitFork className="w-4 h-4" />
            <span>Kialo Edu Argument Tree</span>
          </button>
        </div>
      </div>

      {/* CHATGPT CONNECTOR WORKSPACE */}
      {activeConnector === 'chatgpt' && (
        <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-2">
            <h3 className="text-base font-bold text-[#D35400] font-heading flex items-center gap-2">
              <Bot className="w-5 h-5 text-[#E67E22]" />
              <span>ChatGPT Connector Workspace</span>
            </h3>
            <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-bold">
              Status: SAILL Native Engine Proxy Ready
            </span>
          </div>

          <p className="text-xs text-[#5D6D7E]">
            Uses ChatGPT for debate topic generation, arguments, counterarguments, grammar improvement, and critical thinking feedback.
          </p>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#2C3E50]">Debate Motion Query:</label>
            <input
              type="text"
              value={chatgptTopic}
              onChange={(e) => setChatgptTopic(e.target.value)}
              className="w-full p-2.5 bg-white border border-[#FAD7A0] rounded-xl text-xs text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
            />
          </div>

          <button
            onClick={handleRunChatGPT}
            disabled={isProcessing}
            className="w-full py-2.5 bg-[#D35400] hover:bg-[#E67E22] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Run ChatGPT Analysis</span>
          </button>

          {chatgptResult && (
            <pre className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-xs text-[#2C3E50] font-sans whitespace-pre-wrap">
              {chatgptResult}
            </pre>
          )}
        </div>
      )}

      {/* CLAUDE CONNECTOR WORKSPACE */}
      {activeConnector === 'claude' && (
        <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-2">
            <h3 className="text-base font-bold text-[#D35400] font-heading flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#E67E22]" />
              <span>Claude Connector (Long-Form Argument Analysis)</span>
            </h3>
            <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-bold">
              Status: SAILL Native Engine Proxy Ready
            </span>
          </div>

          <p className="text-xs text-[#5D6D7E]">
            Uses Claude for long-form argument analysis, structured reasoning verification, and multi-layered debate evaluation.
          </p>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#2C3E50]">Long-Form Argument Text for Analysis:</label>
            <textarea
              rows={3}
              value={claudeArgument}
              onChange={(e) => setClaudeArgument(e.target.value)}
              className="w-full p-2.5 bg-white border border-[#FAD7A0] rounded-xl text-xs text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
            />
          </div>

          <button
            onClick={handleRunClaude}
            disabled={isProcessing}
            className="w-full py-2.5 bg-[#D35400] hover:bg-[#E67E22] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Run Claude Structured Reasoning Evaluation</span>
          </button>

          {claudeResult && (
            <pre className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-xs text-[#2C3E50] font-sans whitespace-pre-wrap">
              {claudeResult}
            </pre>
          )}
        </div>
      )}

      {/* KIALO EDU CONNECTOR WORKSPACE */}
      {activeConnector === 'kialo' && (
        <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-2">
            <h3 className="text-base font-bold text-[#D35400] font-heading flex items-center gap-2">
              <GitFork className="w-5 h-5 text-[#E67E22]" />
              <span>Kialo Edu Argument Tree & Visualization Connector</span>
            </h3>
            <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-bold">
              Status: Interactive Visualization Ready
            </span>
          </div>

          <p className="text-xs text-[#5D6D7E]">
            Generates Kialo Edu argument trees with pros, cons, evidence hierarchies, and visual claim mapping.
          </p>

          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-3">
            <span className="text-xs font-bold text-[#D35400] block">Visual Debate Tree Root Motion:</span>
            <p className="text-xs font-bold text-[#2C3E50] font-serif italic">"{kialoMotion}"</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {/* Pros Tree Column */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                <span className="text-xs font-bold text-emerald-800 block">🟢 Pros (Affirmative Branches)</span>
                <div className="space-y-1.5 text-[11px] text-emerald-900">
                  <div className="p-2 bg-white rounded border border-emerald-200">
                    <strong>Claim 1:</strong> Zero Carbon Emissions during base-load energy generation.
                    <span className="block text-[10px] text-emerald-700 italic">Evidence: IAEA 2023 Clean Energy Benchmark</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-emerald-200">
                    <strong>Claim 2:</strong> High Energy Density suitable for hyperscale AI data centers.
                  </div>
                </div>
              </div>

              {/* Cons Tree Column */}
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
                <span className="text-xs font-bold text-rose-800 block">🔴 Cons (Negative Branches)</span>
                <div className="space-y-1.5 text-[11px] text-rose-900">
                  <div className="p-2 bg-white rounded border border-rose-200">
                    <strong>Claim 1:</strong> High Initial Capital Cost and long construction lead times.
                    <span className="block text-[10px] text-rose-700 italic">Evidence: World Nuclear Association capital cost analysis</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-rose-200">
                    <strong>Claim 2:</strong> Nuclear waste disposal and geopolitical safety risks.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
