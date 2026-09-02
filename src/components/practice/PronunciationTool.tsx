import React, { useState } from 'react';
import { AudioRecorder } from './AudioRecorder';
import { analyzePronunciation, PronunciationFeedback } from '../../services/ai';
import { Sparkles, Mic, Volume2, CheckCircle2, ChevronRight, RefreshCw } from 'lucide-react';

interface PronunciationToolProps {
  onSaveWork?: (title: string, audioDataUrl: string, feedback: PronunciationFeedback) => void;
}

const IPA_PRACTICE_PHRASES = [
  { phrase: 'The algorithm optimizes memory cache efficiency.', phonetic: '/ðiː ˈæl.ɡə.rɪ.ðəm ˈɒp.tɪ.maɪ.zɪz ˈmem.ər.i kæʃ ɪˈfɪʃ.ən.si/', category: 'Software' },
  { phrase: 'Artificial intelligence enhances automated system performance.', phonetic: '/ˌɑː.tɪˈfɪʃ.əl ɪnˈtel.ɪ.dʒəns ɪnˈhɑːns.ɪz ˈɔː.tə.meɪ.tɪd ˈsɪs.təm pəˈfɔː.məns/', category: 'AI/ML' },
  { phrase: 'Please verify the client server architecture protocols.', phonetic: '/pliːz ˈver.ɪ.faɪ ðə ˈklaɪ.ənt ˈsɜː.vər ˈɑː.kɪ.tek.tʃər ˈprəʊ.tə.kɒlz/', category: 'Networks' },
  { phrase: 'Microprocessors execute high frequency instructions smoothly.', phonetic: '/ˈmaɪ.krəʊˌprəʊ.ses.əz ˈek.sɪ.kjuːt haɪ ˈfriː.kwən.si ɪnˈstrʌk.ʃənz smuːð.li/', category: 'Hardware' }
];

export const PronunciationTool: React.FC<PronunciationToolProps> = ({ onSaveWork }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<PronunciationFeedback | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);

  const selectedItem = IPA_PRACTICE_PHRASES[selectedIndex];

  const handleRecordingComplete = async (audioDataUrl: string) => {
    setRecordedAudioUrl(audioDataUrl);
    setIsAnalyzing(true);
    try {
      const feedback = await analyzePronunciation({
        targetPhrase: selectedItem.phrase,
        phoneticSpelling: selectedItem.phonetic,
        audioBlobUrl: audioDataUrl
      });
      setAnalysisResult(feedback);
      if (onSaveWork) {
        onSaveWork(`Pronunciation: ${selectedItem.phrase.substring(0, 30)}...`, audioDataUrl, feedback);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Target Phrase Selection */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <Mic className="w-5 h-5 text-indigo-400" />
          <span>Select Engineering Phonetic Practice Phrase</span>
        </h3>
        <p className="text-sm text-slate-400 mb-4">
          Practice International Phonetic Alphabet (IPA) articulation and syllable stress for technical terms.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {IPA_PRACTICE_PHRASES.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedIndex(idx);
                setAnalysisResult(null);
              }}
              className={`text-left p-4 rounded-xl border transition flex flex-col justify-between ${
                selectedIndex === idx
                  ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-md'
                  : 'bg-slate-900/60 border-slate-700/70 text-slate-300 hover:border-slate-500'
              }`}
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-900/80 text-indigo-300 mb-2 inline-block">
                  {item.category}
                </span>
                <p className="text-sm font-semibold">{item.phrase}</p>
              </div>
              <p className="text-xs font-mono text-indigo-300/80 mt-2">{item.phonetic}</p>
            </button>
          ))}
        </div>

        {/* Selected Phrase Showcase */}
        <div className="bg-slate-900/90 border border-slate-700 p-5 rounded-xl mb-6">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Target Statement:</span>
          <p className="text-lg font-extrabold text-white mb-1">{selectedItem.phrase}</p>
          <p className="text-sm font-mono text-indigo-400">{selectedItem.phonetic}</p>
        </div>

        {/* Audio Recorder Component */}
        <AudioRecorder
          targetSampleText={selectedItem.phrase}
          onRecordingComplete={handleRecordingComplete}
        />
      </div>

      {/* AI Analysis Feedback */}
      {isAnalyzing && (
        <div className="bg-indigo-950/40 border border-indigo-800/60 rounded-2xl p-6 text-center animate-pulse flex flex-col items-center justify-center py-8">
          <Sparkles className="w-8 h-8 text-indigo-400 animate-spin mb-3" />
          <h4 className="text-base font-bold text-white mb-1">Analyzing Pronunciation & Pitch...</h4>
          <p className="text-xs text-indigo-200">Evaluating phonemes, stress accents, and speech rate</p>
        </div>
      )}

      {analysisResult && !isAnalyzing && (
        <div className="bg-slate-800/90 border border-indigo-500/50 rounded-2xl p-6 shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-600/20 border border-indigo-500/40 rounded-xl">
                <Sparkles className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">AI Pronunciation Coach Feedback</h4>
                <p className="text-xs text-slate-400">Simulated Gemini Phonetics Engine Evaluation</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Accuracy Score</span>
              <span className="text-2xl font-black text-emerald-400">{analysisResult.score}%</span>
            </div>
          </div>

          <p className="text-sm text-slate-200 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-700/60">
            {analysisResult.overallFeedback}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-950/30 border border-emerald-800/40 p-4 rounded-xl">
              <h5 className="text-xs font-bold uppercase text-emerald-400 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Strong Pronunciation Points
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {analysisResult.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-950/30 border border-amber-800/40 p-4 rounded-xl">
              <h5 className="text-xs font-bold uppercase text-amber-400 mb-2 flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4" /> Recommended Adjustments
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {analysisResult.improvements.map((imp, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
