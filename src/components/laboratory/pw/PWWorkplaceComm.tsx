import React, { useState } from 'react';
import { MessageSquare, Sparkles, RotateCcw, FolderCheck, CheckCircle2 } from 'lucide-react';
import { evaluateDocument, WritingFeedback } from '../../../services/ai/writingCoach';
import { PWAudioPlaceholder } from './PWAudioPlaceholder';

interface PWWorkplaceCommProps {
  onCompleteActivity: () => void;
  onSaveToPortfolio: (title: string, category: string, content: string, score: number) => void;
}

export const PWWorkplaceComm: React.FC<PWWorkplaceCommProps> = ({
  onCompleteActivity,
  onSaveToPortfolio
}) => {
  const [channelType, setChannelType] = useState<'memo' | 'slack' | 'incident' | 'cross-team'>('memo');
  const [selectedTone, setSelectedTone] = useState<'Assertive' | 'Formal' | 'Direct' | 'Empathetic'>('Formal');
  const [titleText, setTitleText] = useState('MEMORANDUM: Updated Security & Safety Protocols in AI Computing Lab');
  const [contentBody, setContentBody] = useState('All student researchers and lab assistants are hereby informed that multi-factor authentication (MFA) will be enforced for server access starting Monday. Please ensure your credentials are updated before 5:00 PM Friday.');

  const [evalResult, setEvalResult] = useState<WritingFeedback | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [savedToPortfolio, setSavedToPortfolio] = useState(false);

  const handleChannelChange = (type: 'memo' | 'slack' | 'incident' | 'cross-team') => {
    setChannelType(type);
    setEvalResult(null);
    setSavedToPortfolio(false);

    if (type === 'memo') {
      setTitleText('MEMORANDUM: Updated Security & Safety Protocols in AI Computing Lab');
      setContentBody('All student researchers and lab assistants are hereby informed that multi-factor authentication (MFA) will be enforced for server access starting Monday. Please ensure your credentials are updated before 5:00 PM Friday.');
    } else if (type === 'slack') {
      setTitleText('Slack / Teams Channel Announcement: Sprint 3 Bug Fix Review');
      setContentBody('@here Team, Sprint 3 deployment is scheduled for 4:00 PM today. Please push your verified unit tests to the staging branch before 2:30 PM. Let me know if anyone blocks on API keys!');
    } else if (type === 'incident') {
      setTitleText('Incident Notice: Database Latency Spike & Resolution');
      setContentBody('At 10:15 AM today, an unexpected indexing job caused a temporary 300ms latency spike on DB-Cluster-1. The query optimizer has resolved the issue. System latency is restored to normal levels (<15ms).');
    } else {
      setTitleText('Cross-Team Request: Hardware Resource Allocation for Robotics Project');
      setContentBody('Greetings Mechanical Dept Team, The CSE IoT group requests access to 3 microcontroller testbeds for joint testing during Week 8. Please let us know if your lab schedule permits joint slots.');
    }
  };

  const handleEvaluate = async () => {
    setIsAnalyzing(true);
    const fullMessage = `TYPE: ${channelType.toUpperCase()} | TONE: ${selectedTone}\nTITLE: ${titleText}\n\nCONTENT:\n${contentBody}`;

    try {
      const res = await evaluateDocument({
        documentType: 'Workplace Communication',
        content: fullMessage,
        titleOrSubject: titleText
      });
      setEvalResult(res);
      if (res.score10 >= 6.0) {
        onCompleteActivity();
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSavePortfolio = () => {
    if (!evalResult) return;
    onSaveToPortfolio(`Workplace Comm (${channelType}): ${titleText}`, 'Workplace Communication', `${titleText}\n\n${contentBody}`, evalResult.score10);
    setSavedToPortfolio(true);
  };

  return (
    <div className="space-y-6">
      <PWAudioPlaceholder
        category="Instructions"
        title="Workplace Communication & Business Memos Instructions"
        transcript="Practice modern corporate messaging including internal business memos, Slack/Teams channel updates, incident reports, and cross-team requests. Focus on brevity, actionable callouts, and tone control."
      />

      {/* Format Selector Pills */}
      <div className="srit-card p-5 bg-white border border-[#FAD7A0]">
        <label className="block text-xs font-bold text-[#D35400] uppercase tracking-wider mb-2">
          Select Communication Channel / Format:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => handleChannelChange('memo')}
            className={`p-3 rounded-xl border text-xs font-bold transition ${
              channelType === 'memo' ? 'bg-[#D35400] text-white border-[#D35400]' : 'bg-[#FFF8F0] border-[#FAD7A0] text-[#2C3E50]'
            }`}
          >
            📋 Business Memo
          </button>
          <button
            type="button"
            onClick={() => handleChannelChange('slack')}
            className={`p-3 rounded-xl border text-xs font-bold transition ${
              channelType === 'slack' ? 'bg-[#D35400] text-white border-[#D35400]' : 'bg-[#FFF8F0] border-[#FAD7A0] text-[#2C3E50]'
            }`}
          >
            💬 Slack / Teams Update
          </button>
          <button
            type="button"
            onClick={() => handleChannelChange('incident')}
            className={`p-3 rounded-xl border text-xs font-bold transition ${
              channelType === 'incident' ? 'bg-[#D35400] text-white border-[#D35400]' : 'bg-[#FFF8F0] border-[#FAD7A0] text-[#2C3E50]'
            }`}
          >
            ⚠️ Incident Report
          </button>
          <button
            type="button"
            onClick={() => handleChannelChange('cross-team')}
            className={`p-3 rounded-xl border text-xs font-bold transition ${
              channelType === 'cross-team' ? 'bg-[#D35400] text-white border-[#D35400]' : 'bg-[#FFF8F0] border-[#FAD7A0] text-[#2C3E50]'
            }`}
          >
            🤝 Cross-Team Request
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
        <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-3">
          <h3 className="text-base font-extrabold text-[#2C3E50] font-heading flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#D35400]" /> Communication Composer
          </h3>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#5D6D7E] font-bold">Target Tone:</span>
            <select
              value={selectedTone}
              onChange={(e) => setSelectedTone(e.target.value as any)}
              className="bg-[#FFF8F0] border border-[#FAD7A0] rounded-lg px-2.5 py-1 text-xs font-bold text-[#2C3E50]"
            >
              <option value="Formal">Formal</option>
              <option value="Assertive">Assertive</option>
              <option value="Direct">Direct</option>
              <option value="Empathetic">Empathetic</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#2C3E50] mb-1">Header / Subject / Channel Topic:</label>
          <input
            type="text"
            value={titleText}
            onChange={(e) => setTitleText(e.target.value)}
            className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-2.5 text-xs font-bold text-[#2C3E50]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#2C3E50] mb-1">Message Content:</label>
          <textarea
            rows={6}
            value={contentBody}
            onChange={(e) => setContentBody(e.target.value)}
            className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-3 text-xs sm:text-sm text-[#2C3E50]"
          />
        </div>

        <div className="flex items-center justify-end pt-3 border-t border-[#FAD7A0]">
          <button
            type="button"
            onClick={handleEvaluate}
            disabled={isAnalyzing || contentBody.length < 10}
            className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#B04300] transition flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Evaluate Workplace Communication (10 Marks)
          </button>
        </div>
      </div>

      {evalResult && (
        <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-2">
            <h4 className="font-bold text-[#2C3E50]">Workplace Communication Score</h4>
            <span className="text-2xl font-black text-[#D35400]">{evalResult.score10} / 10</span>
          </div>
          <p className="text-xs text-[#5D6D7E]">{evalResult.overallFeedback}</p>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleSavePortfolio}
              disabled={savedToPortfolio}
              className="px-4 py-2 border border-[#FAD7A0] text-[#D35400] text-xs font-bold rounded-xl hover:bg-[#FFF8F0]"
            >
              <FolderCheck className="w-4 h-4 inline mr-1" />
              {savedToPortfolio ? 'Saved to Portfolio' : 'Add to Portfolio'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
