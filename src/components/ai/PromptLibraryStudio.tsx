import React, { useState } from 'react';
import { PromptTemplateItem, AICoachId } from '../../types';
import { PROMPT_LIBRARY_TEMPLATES } from '../../services/aiCoachesService';
import { 
  BookOpen, 
  Copy, 
  CheckCircle2, 
  Search, 
  Sparkles, 
  Code, 
  Play, 
  FileCode, 
  Tag 
} from 'lucide-react';

interface PromptLibraryStudioProps {
  onSelectPromptForCoach?: (coachId: AICoachId, promptText: string) => void;
}

export const PromptLibraryStudio: React.FC<PromptLibraryStudioProps> = ({
  onSelectPromptForCoach
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPrompt, setSelectedPrompt] = useState<PromptTemplateItem>(PROMPT_LIBRARY_TEMPLATES[0]);
  const [copied, setCopied] = useState<boolean>(false);

  const categories = ['All', 'Phonetics', 'Listening', 'Speaking', 'Writing', 'Career', 'Reading', 'Debate', 'Grammar', 'Vocabulary', 'Reflection'];

  const filteredPrompts = PROMPT_LIBRARY_TEMPLATES.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesQuery = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.experimentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLaunchCoach = () => {
    if (onSelectPromptForCoach) {
      onSelectPromptForCoach(selectedPrompt.coachId, selectedPrompt.sampleInput);
    }
  };

  return (
    <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#FAD7A0] pb-4">
        <div>
          <span className="text-[10px] font-black uppercase text-[#D35400] bg-[#FFF8F0] px-2.5 py-0.5 rounded border border-[#FAD7A0]">
            SAILL Educational Prompt Architecture
          </span>
          <h3 className="text-xl font-extrabold text-[#2C3E50] font-heading mt-1 flex items-center gap-2">
            <FileCode className="w-5 h-5 text-[#D35400]" />
            <span>R26 Laboratory Prompt Library & Experiment Templates</span>
          </h3>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#5D6D7E] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search experiment prompts..."
            className="w-full bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#2C3E50] focus:outline-none focus:border-[#D35400]"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-[#D35400] text-white shadow-2xs'
                : 'bg-[#FFF8F0] text-[#2C3E50] border border-[#FAD7A0] hover:bg-[#FAD7A0]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Grid: Prompts List (4 Cols) + Details Drawer (8 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* List of Prompts */}
        <div className="lg:col-span-5 space-y-2 max-h-[550px] overflow-y-auto pr-1">
          {filteredPrompts.length === 0 ? (
            <p className="text-xs text-[#5D6D7E] italic py-6 text-center">No prompt templates found matching search criteria.</p>
          ) : (
            filteredPrompts.map((p) => {
              const isSelected = selectedPrompt.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPrompt(p)}
                  className={`w-full p-3.5 rounded-xl border text-left transition flex flex-col gap-1.5 ${
                    isSelected
                      ? 'bg-[#D35400] text-white border-[#2C3E50] shadow-xs'
                      : 'bg-[#FFF8F0] text-[#2C3E50] border-[#FAD7A0] hover:bg-[#FAD7A0]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-[#FAD7A0] text-[#D35400]'
                    }`}>
                      {p.experimentNumber} • {p.category}
                    </span>
                    <span className={`text-[10px] font-mono ${isSelected ? 'text-amber-200' : 'text-[#E67E22]'}`}>
                      Coach: {p.coachId}
                    </span>
                  </div>

                  <h4 className="text-xs font-extrabold line-clamp-1">{p.title}</h4>
                  <p className={`text-[10px] line-clamp-2 ${isSelected ? 'text-white/90' : 'text-[#5D6D7E]'}`}>
                    {p.description}
                  </p>
                </button>
              );
            })
          )}
        </div>

        {/* Selected Prompt Detail View */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-4">
          
          <div className="flex items-start justify-between border-b border-[#FAD7A0] pb-3 gap-3">
            <div>
              <span className="text-[10px] font-extrabold text-[#D35400] bg-white px-2 py-0.5 rounded border border-[#FAD7A0]">
                {selectedPrompt.experimentNumber} Template
              </span>
              <h4 className="text-base font-extrabold text-[#2C3E50] font-heading mt-1">
                {selectedPrompt.title}
              </h4>
              <p className="text-xs text-[#5D6D7E] mt-0.5">{selectedPrompt.description}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleCopy(selectedPrompt.userTemplate)}
                className="px-3 py-1.5 bg-white border border-[#FAD7A0] hover:bg-[#D35400] hover:text-white text-[#D35400] font-bold text-xs rounded-xl transition flex items-center gap-1 shadow-2xs"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Template'}</span>
              </button>

              <button
                onClick={handleLaunchCoach}
                className="px-3.5 py-1.5 bg-[#D35400] hover:bg-[#E67E22] text-white font-extrabold text-xs rounded-xl transition flex items-center gap-1.5 shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>Test with AI Coach</span>
              </button>
            </div>
          </div>

          {/* System Prompt Instruction */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#D35400] uppercase">System Instruction Constraint:</span>
            <pre className="p-3 bg-white border border-[#FAD7A0] rounded-xl text-[11px] text-[#2C3E50] font-mono leading-relaxed whitespace-pre-wrap">
              {selectedPrompt.systemPrompt}
            </pre>
          </div>

          {/* User Template Architecture */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#2C3E50] uppercase">User Template Structure:</span>
              <div className="flex gap-1">
                {selectedPrompt.variables.map((v) => (
                  <span key={v} className="text-[9px] font-mono bg-amber-100 text-[#D35400] px-1.5 py-0.5 rounded border border-amber-300">
                    {`{${v}}`}
                  </span>
                ))}
              </div>
            </div>
            <pre className="p-3 bg-white border border-[#FAD7A0] rounded-xl text-[11px] text-[#2C3E50] font-mono leading-relaxed whitespace-pre-wrap">
              {selectedPrompt.userTemplate}
            </pre>
          </div>

          {/* Sample Input Data */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#E67E22] uppercase">Sample Student Data Input:</span>
            <pre className="p-3 bg-white border border-[#FAD7A0] rounded-xl text-[11px] text-[#2C3E50] font-mono leading-relaxed whitespace-pre-wrap">
              {selectedPrompt.sampleInput}
            </pre>
          </div>

        </div>

      </div>

    </div>
  );
};
