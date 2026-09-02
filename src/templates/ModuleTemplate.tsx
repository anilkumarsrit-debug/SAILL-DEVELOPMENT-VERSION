/**
 * SAILL - SRIT AI Language Laboratory
 * Reusable Learning Module React Component Template
 *
 * @version 2.6.0
 * @description Standardized React component layout for implementing new educational
 * modules in SAILL. Provides responsive tab navigation, audio recording container,
 * self-evaluation rubric, and AI diagnostic feedback wiring.
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Mic, Dumbbell, Calculator, CheckCircle, ArrowLeft } from 'lucide-react';
import { SAILLModuleDefinition, createModuleTemplate } from './learningModuleTemplate';
import { ModuleProgress, StudentProfile } from '../types';
import { AudioRecorder } from '../components/practice/AudioRecorder';

export interface ModuleTemplateProps {
  definition?: SAILLModuleDefinition;
  student?: StudentProfile | null;
  progress?: ModuleProgress;
  onSaveProgress?: (progressData: Partial<ModuleProgress>) => void;
  onBack?: () => void;
}

export const ModuleTemplate: React.FC<ModuleTemplateProps> = ({
  definition = createModuleTemplate(),
  progress,
  onSaveProgress,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [, setRecording] = useState<string | null>(null);

  const handleRecordingComplete = (audioUrl: string) => {
    setRecording(audioUrl);
    if (onSaveProgress) {
      onSaveProgress({
        status: 'in_progress',
        lastAccessed: new Date().toISOString()
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Module Header Banner */}
      <div className="bg-gradient-to-r from-[#D35400] to-[#E67E22] rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>
            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
              {definition.code}
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black">{definition.title}</h1>
            <p className="text-white/90 mt-1 text-sm sm:text-base max-w-3xl">{definition.shortDesc || definition.overview?.description}</p>
          </div>

          <div className="flex flex-wrap gap-4 text-xs sm:text-sm pt-2 border-t border-white/20">
            <div><span className="opacity-75">Category:</span> <strong className="capitalize">{definition.category}</strong></div>
            <div><span className="opacity-75">Estimated Time:</span> <strong>{definition.estimatedMinutes} mins</strong></div>
            <div><span className="opacity-75">Level:</span> <strong>{definition.difficultyLevel}</strong></div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-amber-200 overflow-x-auto gap-2">
        {definition.tabsConfig.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-semibold text-sm border-b-2 transition whitespace-nowrap ${
                isActive
                  ? 'border-[#D35400] text-[#D35400] bg-amber-50/50 rounded-t-lg'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-amber-300'
              }`}
            >
              {tab.id === 'overview' && <BookOpen className="w-4 h-4" />}
              {tab.id === 'practice' && <Dumbbell className="w-4 h-4" />}
              {tab.id === 'record' && <Mic className="w-4 h-4" />}
              {tab.id === 'evaluation' && <Calculator className="w-4 h-4" />}
              {tab.title}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="bg-white rounded-2xl p-6 border-2 border-[#FAD7A0] shadow-sm">
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#D35400]" /> Objectives & Core Concepts
            </h2>
            <ul className="space-y-3">
              {definition.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-700 text-sm">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {activeTab === 'practice' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-[#D35400]" /> Guided Practice Studio
            </h2>
            <p className="text-sm text-gray-600">
              Complete practice exercises to build articulation and rhythm before recording your final submission.
            </p>
          </motion.div>
        )}

        {activeTab === 'record' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Mic className="w-5 h-5 text-[#D35400]" /> Recording Studio
            </h2>
            <AudioRecorder
              moduleTitle={definition.title}
              onRecordingComplete={(audioUrl) => handleRecordingComplete(audioUrl)}
            />
          </motion.div>
        )}

        {activeTab === 'evaluation' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#D35400]" /> Evaluation Rubric
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {definition.rubricCriteria.map((criterion) => (
                <div key={criterion.key} className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 space-y-2">
                  <div className="flex justify-between font-bold text-sm text-gray-800">
                    <span>{criterion.label}</span>
                    <span className="text-[#D35400]">Max {criterion.maxScore} pts</span>
                  </div>
                  <p className="text-xs text-gray-600">{criterion.guidelines}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
export default ModuleTemplate;
