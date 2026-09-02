import React from 'react';
import { InterviewSkillsStudio } from './InterviewSkillsStudio';

interface ProfessionalWritingStudioProps {
  moduleId?: string;
  moduleTitle?: string;
  studentId?: string;
  onSaveWorkToPortfolio?: (title: string, content: string) => void;
}

export const ProfessionalWritingStudio: React.FC<ProfessionalWritingStudioProps> = () => {
  return <InterviewSkillsStudio />;
};
