import React from 'react';
import { SpokenEnglishLabStudio } from './SpokenEnglishLabStudio';

interface FluencyStudioProps {
  moduleId?: string;
  moduleTitle?: string;
  onSaveWork?: (title: string, content: string) => void;
}

export const FluencyStudio: React.FC<FluencyStudioProps> = ({
  moduleId = 'spoken-english',
  moduleTitle = 'Spoken English & Fluency Building',
  onSaveWork
}) => {
  return (
    <SpokenEnglishLabStudio
      moduleId={moduleId}
      moduleTitle={moduleTitle}
      onSaveWork={onSaveWork}
    />
  );
};
