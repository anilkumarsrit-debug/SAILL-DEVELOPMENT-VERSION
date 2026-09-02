import React, { useState } from 'react';
import { BookOpen, FileText, Download, Copy, CheckCircle2, FileCode, Video, ExternalLink, Headphones, Image } from 'lucide-react';
import { ModuleData } from '../../types';
import { getModuleConfig } from '../../data/moduleConfigs';
import { ResourceItem } from '../../types/moduleConfig';

interface LearningResourcesStudioProps {
  module: ModuleData;
}

export const LearningResourcesStudio: React.FC<LearningResourcesStudioProps> = ({ module }) => {
  const config = getModuleConfig(module.id);
  const resources = config.resources;

  const [selectedRes, setSelectedRes] = useState<ResourceItem>(resources[0] || {
    id: 'res-default',
    title: 'Module Learning Resource',
    type: 'reference',
    description: 'Core reference material for ' + module.title,
    content: 'Content loading...'
  });

  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedRes.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([selectedRes.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = selectedRes.downloadFileName || `${module.code}_Resource.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'reference':
        return <BookOpen className="w-4 h-4 text-[#D35400]" />;
      case 'template':
        return <FileCode className="w-4 h-4 text-[#D35400]" />;
      case 'video':
        return <Video className="w-4 h-4 text-[#D35400]" />;
      case 'ai_tool':
        return <ExternalLink className="w-4 h-4 text-[#D35400]" />;
      case 'audio':
        return <Headphones className="w-4 h-4 text-[#D35400]" />;
      case 'infographic':
        return <Image className="w-4 h-4 text-[#D35400]" />;
      default:
        return <FileText className="w-4 h-4 text-[#D35400]" />;
    }
  };

  return (
    <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-6">
      {/* Header */}
      <div className="border-b border-[#FAD7A0] pb-4">
        <span className="text-[10px] font-black uppercase text-[#D35400] bg-[#FFF8F0] px-2.5 py-0.5 rounded border border-[#FAD7A0]">
          Curated Learning & Practice Repository
        </span>
        <h3 className="text-xl font-bold text-[#D35400] font-heading mt-1 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#D35400]" />
          <span>Curated Learning Resources: {config.title}</span>
        </h3>
        <p className="text-xs text-[#5D6D7E] mt-0.5">
          Explore reference guides, downloadable templates, worksheets, and syllabus resources tailored for {module.code}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Resource Selector Sidebar */}
        <div className="space-y-2.5 md:col-span-1">
          <h4 className="text-xs font-black text-[#D35400] uppercase tracking-wider">Available Resources:</h4>
          <div className="space-y-2">
            {resources.map((res) => {
              const isSelected = selectedRes.id === res.id;
              return (
                <button
                  key={res.id}
                  onClick={() => setSelectedRes(res)}
                  className={`w-full p-3 rounded-xl border text-left transition flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-[#FFF8F0] border-[#D35400] shadow-2xs'
                      : 'bg-white border-[#FAD7A0] hover:border-[#E67E22]'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-white border border-[#FAD7A0] shrink-0 mt-0.5">
                    {getIconForType(res.type)}
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-[10px] font-bold uppercase text-[#E67E22] block">{res.type}</span>
                    <h5 className="text-xs font-bold text-[#2C3E50] line-clamp-2">{res.title}</h5>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Resource Viewer Canvas */}
        <div className="md:col-span-2 space-y-4 bg-[#FFF8F0] p-5 rounded-2xl border border-[#FAD7A0]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#FAD7A0] pb-3">
            <div>
              <span className="text-[10px] font-extrabold text-[#D35400] uppercase bg-white px-2.5 py-0.5 rounded border border-[#FAD7A0]">
                {selectedRes.type}
              </span>
              <h4 className="text-sm font-black text-[#2C3E50] mt-1">{selectedRes.title}</h4>
              <p className="text-xs text-[#5D6D7E]">{selectedRes.description}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 bg-white border border-[#FAD7A0] hover:bg-[#FAD7A0] text-[#D35400] text-xs font-bold rounded-lg transition flex items-center gap-1 cursor-pointer"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Text'}</span>
              </button>

              <button
                onClick={handleDownload}
                className="px-3 py-1.5 bg-[#D35400] hover:bg-[#E67E22] text-white text-xs font-bold rounded-lg transition flex items-center gap-1 shadow-2xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>

          <div className="bg-white border border-[#FAD7A0] rounded-xl p-4 font-mono text-xs text-[#2C3E50] whitespace-pre-wrap leading-relaxed max-h-[420px] overflow-y-auto">
            {selectedRes.content}
          </div>
        </div>
      </div>
    </div>
  );
};
