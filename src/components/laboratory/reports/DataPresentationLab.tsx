import React, { useState } from 'react';
import { BarChart3, Table, Network, Image as ImageIcon, Sparkles, CheckCircle2, Award } from 'lucide-react';
import { evaluateDataPresentation, DataPresentationReview } from '../../../services/ai/reportWritingCoach';

export const DataPresentationLab: React.FC = () => {
  const [activeVisualType, setActiveVisualType] = useState<'Chart' | 'Table' | 'Flowchart' | 'Diagram'>('Chart');
  const [title, setTitle] = useState<string>('Thermal Efficiency vs Load Power');
  const [caption, setCaption] = useState<string>('Thermal efficiency of 50kW synchronous generator recorded under varying resistive loads at 1500 RPM.');
  const [description, setDescription] = useState<string>('Efficiency increases non-linearly from 78% at 10kW load to a peak of 94.2% at 40kW load, beyond which core saturation reduces efficiency slightly to 92.8%.');
  const [interpretation, setInterpretation] = useState<string>('Optimal fuel economy is achieved when operating the generator between 75% and 85% rated capacity.');

  const [aiReview, setAiReview] = useState<DataPresentationReview | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  const handleEvaluate = async () => {
    setIsEvaluating(true);
    const review = await evaluateDataPresentation({
      presentationType: activeVisualType,
      title,
      caption,
      dataDescription: description,
      keyInterpretation: interpretation
    });
    setAiReview(review);
    setIsEvaluating(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-[#D35400]">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-[#E67E22] uppercase tracking-wider">
              Module 11 • Section 6
            </span>
            <h2 className="text-xl font-bold text-[#D35400] font-heading">
              Data Presentation Lab & Figure Captions
            </h2>
          </div>
        </div>
        <p className="text-xs text-[#2C3E50] leading-relaxed">
          In technical engineering reports, visuals must speak for themselves. Practice constructing IEEE-compliant table captions, figure labels, trend interpretations, and flowcharts evaluated by AI across 5 criteria.
        </p>
      </div>

      {/* Visual Type Selector */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
        <h3 className="text-xs font-bold text-[#D35400] uppercase font-heading tracking-wider flex items-center gap-2">
          <span>Choose Visual Format to Practice</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: 'Chart', label: 'Graphs & Charts', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'Table', label: 'Data Tables', icon: <Table className="w-4 h-4" /> },
            { id: 'Flowchart', label: 'Process Flowcharts', icon: <Network className="w-4 h-4" /> },
            { id: 'Diagram', label: 'Circuit Diagrams', icon: <ImageIcon className="w-4 h-4" /> }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveVisualType(item.id as any)}
              className={`p-3 rounded-xl border text-center transition flex items-center justify-center gap-2 font-bold text-xs ${
                activeVisualType === item.id
                  ? 'bg-[#D35400] text-white border-[#D35400] shadow-2xs'
                  : 'bg-[#FFF8F0] text-[#2C3E50] border-[#FAD7A0] hover:bg-[#FAD7A0]'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Input & Form Controls */}
        <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
          <h3 className="text-sm font-bold text-[#D35400] font-heading border-b border-[#FAD7A0] pb-2">
            Figure / Table Metadata & Captions
          </h3>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-[#2C3E50]">Visual Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-[#FAD7A0] focus:ring-2 focus:ring-[#D35400]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-[#2C3E50]">
                IEEE Figure Caption (Positioned BELOW charts & ABOVE tables)
              </label>
              <textarea
                rows={2}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-[#FAD7A0] focus:ring-2 focus:ring-[#D35400] font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-[#2C3E50]">Quantitative Trend Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-[#FAD7A0] focus:ring-2 focus:ring-[#D35400] font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-[#2C3E50]">Key Engineering Takeaway / Conclusion</label>
              <textarea
                rows={2}
                value={interpretation}
                onChange={(e) => setInterpretation(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-[#FAD7A0] focus:ring-2 focus:ring-[#D35400] font-mono"
              />
            </div>

            <button
              onClick={handleEvaluate}
              disabled={isEvaluating}
              className="w-full py-2.5 bg-[#D35400] hover:bg-[#E67E22] text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-2xs"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              {isEvaluating ? 'Evaluating Presentation Quality...' : 'Run AI Data Presentation Audit'}
            </button>
          </div>
        </div>

        {/* Live Visual Preview & AI Review Scores */}
        <div className="space-y-4">
          {/* Mock Graphic Container */}
          <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-3 text-center">
            <span className="text-[10px] font-mono text-[#E67E22] font-bold uppercase">
              {activeVisualType === 'Table' ? 'Table Caption (Top)' : 'Graphic Preview'}
            </span>

            {activeVisualType === 'Table' && (
              <p className="text-xs font-bold font-mono text-[#D35400]">
                TABLE 1.1: {title.toUpperCase()}
              </p>
            )}

            {/* Visual Representation */}
            <div className="p-6 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl flex flex-col items-center justify-center min-h-[160px] space-y-2">
              {activeVisualType === 'Chart' && (
                <div className="w-full space-y-2">
                  <div className="flex items-end justify-between h-24 px-8 border-b border-l border-[#D35400]">
                    <div className="w-8 bg-[#E67E22] h-[30%] rounded-t"></div>
                    <div className="w-8 bg-[#E67E22] h-[60%] rounded-t"></div>
                    <div className="w-8 bg-[#D35400] h-[95%] rounded-t"></div>
                    <div className="w-8 bg-[#E67E22] h-[85%] rounded-t"></div>
                  </div>
                  <p className="text-[10px] text-gray-500 font-mono">X-Axis: Generator Load (kW) | Y-Axis: Efficiency (%)</p>
                </div>
              )}

              {activeVisualType === 'Table' && (
                <div className="w-full text-[10px] font-mono border border-[#FAD7A0] rounded overflow-hidden">
                  <div className="grid grid-cols-3 bg-[#FAD7A0] p-1.5 font-bold text-[#D35400]">
                    <span>Load (kW)</span>
                    <span>Efficiency (%)</span>
                    <span>Power Factor</span>
                  </div>
                  <div className="grid grid-cols-3 p-1.5 border-b border-[#FAD7A0]">
                    <span>10.0</span>
                    <span>78.2</span>
                    <span>0.82</span>
                  </div>
                  <div className="grid grid-cols-3 p-1.5 bg-white font-bold text-emerald-800">
                    <span>40.0</span>
                    <span>94.2</span>
                    <span>0.96</span>
                  </div>
                </div>
              )}

              {activeVisualType === 'Flowchart' && (
                <div className="flex items-center gap-2 font-mono text-[10px] text-[#D35400]">
                  <span className="p-2 bg-white rounded border border-[#FAD7A0]">Sensor Sampling</span>
                  <span>→</span>
                  <span className="p-2 bg-white rounded border border-[#FAD7A0]">ADC Filtering</span>
                  <span>→</span>
                  <span className="p-2 bg-emerald-100 text-emerald-900 rounded border border-emerald-300 font-bold">Cloud Telemetry</span>
                </div>
              )}

              {activeVisualType === 'Diagram' && (
                <div className="p-3 bg-white rounded border border-[#FAD7A0] font-mono text-[11px] text-[#D35400]">
                  [V_in: 12V] ─── (R1: 220Ω) ─── [ZMPT101B Sensor] ─── (Ground)
                </div>
              )}
            </div>

            {activeVisualType !== 'Table' && (
              <p className="text-xs font-mono font-bold text-[#2C3E50]">
                Figure 1.1: {caption}
              </p>
            )}
          </div>

          {/* AI Assessment Result Card */}
          {aiReview && (
            <div className="srit-card p-5 bg-white border border-[#FAD7A0] space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-2">
                <h4 className="text-xs font-bold text-[#D35400] uppercase font-heading flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#E67E22]" />
                  <span>AI Presentation Audit (5 Criteria)</span>
                </h4>
                <span className="text-sm font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {aiReview.overallScore} / 10
                </span>
              </div>

              <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] font-mono">
                <div className="p-1.5 bg-[#FFF8F0] rounded border border-[#FAD7A0]">
                  <p className="text-gray-500">Accuracy</p>
                  <p className="font-bold text-[#D35400]">{aiReview.accuracyScore}</p>
                </div>
                <div className="p-1.5 bg-[#FFF8F0] rounded border border-[#FAD7A0]">
                  <p className="text-gray-500">Readability</p>
                  <p className="font-bold text-[#D35400]">{aiReview.readabilityScore}</p>
                </div>
                <div className="p-1.5 bg-[#FFF8F0] rounded border border-[#FAD7A0]">
                  <p className="text-gray-500">Organization</p>
                  <p className="font-bold text-[#D35400]">{aiReview.organizationScore}</p>
                </div>
                <div className="p-1.5 bg-[#FFF8F0] rounded border border-[#FAD7A0]">
                  <p className="text-gray-500">Labeling</p>
                  <p className="font-bold text-[#D35400]">{aiReview.labelingScore}</p>
                </div>
                <div className="p-1.5 bg-[#FFF8F0] rounded border border-[#FAD7A0]">
                  <p className="text-gray-500">Interpretation</p>
                  <p className="font-bold text-[#D35400]">{aiReview.interpretationScore}</p>
                </div>
              </div>

              <p className="text-xs text-[#2C3E50]">{aiReview.feedback}</p>

              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-1">
                <span className="font-bold text-emerald-900">Suggested Refined IEEE Caption:</span>
                <p className="font-serif italic text-emerald-950">{aiReview.improvedCaption}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
