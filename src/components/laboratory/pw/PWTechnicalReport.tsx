import React, { useState } from 'react';
import { FileCode, Sparkles, FolderCheck, CheckCircle2 } from 'lucide-react';
import { evaluateDocument, WritingFeedback } from '../../../services/ai/writingCoach';
import { PWAudioPlaceholder } from './PWAudioPlaceholder';

interface PWTechnicalReportProps {
  onCompleteActivity: () => void;
  onSaveToPortfolio: (title: string, category: string, content: string, score: number) => void;
}

export const PWTechnicalReport: React.FC<PWTechnicalReportProps> = ({
  onCompleteActivity,
  onSaveToPortfolio
}) => {
  const [reportTitle, setReportTitle] = useState('Design & Performance Analysis of IoT Smart Edge Nodes for Agricultural Soil Health Monitoring');
  const [abstractText, setAbstractText] = useState('This technical report presents the architecture and deployment metrics of low-power IoT sensor nodes designed at SRIT AI Lab. Using LoRaWAN communication, the system achieves 98.4% packet delivery over a 3km field radius while reducing battery consumption by 32%.');
  const [introText, setIntroText] = useState('Precision agriculture requires continuous monitoring of soil moisture, pH, and nitrogen levels. Traditional manual soil testing introduces latency in irrigation decisions. This project addresses real-time sensing via microcontrollers.');
  const [methodologyText, setMethodologyText] = useState('We configured ESP32 microcontrollers interfaced with capacitive soil moisture sensors and NPK probes. Data is transmitted via LoRa protocol to a local gateway connected to a cloud database.');
  const [resultsText, setResultsText] = useState('Field testing conducted across 5 test plots demonstrated sensor latency <2.5 seconds. Power profiling showed the node operates for 180 days on a single 3000mAh Li-ion battery.');
  const [conclusionText, setConclusionText] = useState('The proposed IoT edge architecture offers a cost-effective, energy-efficient solution for automated irrigation control in rural farmland.');
  const [ieeeRefs, setIeeeRefs] = useState('[1] A. Kumar and R. Sharma, "LoRaWAN sensor networks for precision farming," IEEE Trans. Ind. Electron., vol. 68, no. 4, pp. 3120-3129, Apr. 2024.');

  const [evalResult, setEvalResult] = useState<WritingFeedback | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [savedToPortfolio, setSavedToPortfolio] = useState(false);

  const handleEvaluate = async () => {
    setIsAnalyzing(true);
    const fullReport = `TECHNICAL REPORT\nTitle: ${reportTitle}\n\n1. ABSTRACT\n${abstractText}\n\n2. INTRODUCTION\n${introText}\n\n3. METHODOLOGY\n${methodologyText}\n\n4. RESULTS & ANALYSIS\n${resultsText}\n\n5. CONCLUSION\n${conclusionText}\n\nREFERENCES (IEEE):\n${ieeeRefs}`;

    try {
      const res = await evaluateDocument({
        documentType: 'Technical Report',
        content: fullReport,
        titleOrSubject: reportTitle
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
    const fullReport = `# ${reportTitle}\n\n## Abstract\n${abstractText}\n\n## Introduction\n${introText}\n\n## Methodology\n${methodologyText}\n\n## Results\n${resultsText}\n\n## Conclusion\n${conclusionText}\n\n## References\n${ieeeRefs}`;
    onSaveToPortfolio(`Technical Report: ${reportTitle}`, 'Technical Report', fullReport, evalResult.score10);
    setSavedToPortfolio(true);
  };

  return (
    <div className="space-y-6">
      <PWAudioPlaceholder
        category="Instructions"
        title="Technical Report Writing Activity Instructions"
        transcript="Structure formal engineering reports using IEEE standard sections: Title, Abstract, Introduction, Methodology, Performance Results, Conclusions, and IEEE Reference Citations."
      />

      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
        <h3 className="text-base font-extrabold text-[#2C3E50] font-heading flex items-center gap-2 border-b border-[#FAD7A0] pb-3">
          <FileCode className="w-5 h-5 text-[#D35400]" /> IEEE Technical Report Builder
        </h3>

        <div>
          <label className="block text-xs font-bold text-[#2C3E50] mb-1">1. Report Title:</label>
          <input
            type="text"
            value={reportTitle}
            onChange={(e) => setReportTitle(e.target.value)}
            className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-2.5 text-xs font-bold text-[#2C3E50]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#2C3E50] mb-1">2. Executive Abstract (150 Words Max):</label>
          <textarea
            rows={3}
            value={abstractText}
            onChange={(e) => setAbstractText(e.target.value)}
            className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-2.5 text-xs text-[#2C3E50]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#2C3E50] mb-1">3. Introduction & Problem Statement:</label>
            <textarea
              rows={4}
              value={introText}
              onChange={(e) => setIntroText(e.target.value)}
              className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-2.5 text-xs text-[#2C3E50]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2C3E50] mb-1">4. Methodology & Architecture:</label>
            <textarea
              rows={4}
              value={methodologyText}
              onChange={(e) => setMethodologyText(e.target.value)}
              className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-2.5 text-xs text-[#2C3E50]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#2C3E50] mb-1">5. Experimental Results & Data Analysis:</label>
            <textarea
              rows={4}
              value={resultsText}
              onChange={(e) => setResultsText(e.target.value)}
              className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-2.5 text-xs text-[#2C3E50]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2C3E50] mb-1">6. Conclusions & Next Steps:</label>
            <textarea
              rows={4}
              value={conclusionText}
              onChange={(e) => setConclusionText(e.target.value)}
              className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-2.5 text-xs text-[#2C3E50]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#2C3E50] mb-1">7. IEEE Reference Citations:</label>
          <input
            type="text"
            value={ieeeRefs}
            onChange={(e) => setIeeeRefs(e.target.value)}
            className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl p-2.5 text-xs text-[#2C3E50]"
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-[#FAD7A0]">
          <button
            type="button"
            onClick={handleEvaluate}
            disabled={isAnalyzing}
            className="px-6 py-2.5 bg-[#D35400] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#B04300] transition flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Evaluate Technical Report (10 Marks)
          </button>
        </div>
      </div>

      {evalResult && (
        <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-2">
            <h4 className="font-bold text-[#2C3E50]">Technical Report Score</h4>
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
