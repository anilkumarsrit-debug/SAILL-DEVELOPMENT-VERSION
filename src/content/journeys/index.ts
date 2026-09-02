import { JourneyContentSchema } from '../types';
import { journey01Content } from './journey-01';
import { journey02Content } from './journey-02';
import { journey03Content } from './journey-03';
import { journey04Content } from './journey-04';
import { journey05Content } from './journey-05';
import { journey06Content } from './journey-06';
import { journey07Content } from './journey-07';
import { journey08Content } from './journey-08';
import { journey09Content } from './journey-09';
import { journey10Content } from './journey-10';
import { journey11Content } from './journey-11';
import { journey12Content } from './journey-12';

export const ALL_JOURNEY_CONTENTS: Record<string, JourneyContentSchema> = {
  'journey-01': journey01Content,
  'journey-02': journey02Content,
  'journey-03': journey03Content,
  'journey-04': journey04Content,
  'journey-05': journey05Content,
  'journey-06': journey06Content,
  'journey-07': journey07Content,
  'journey-08': journey08Content,
  'journey-09': journey09Content,
  'journey-10': journey10Content,
  'journey-11': journey11Content,
  'journey-12': journey12Content,

  // Also map by moduleId for backward compatibility
  'pronunciation': journey01Content,
  'listening': journey02Content,
  'spoken-english': journey03Content,
  'group-discussion': journey04Content,
  'public-speaking': journey05Content,
  'professional-writing': journey06Content,
  'professional-email': journey07Content,
  'resume-writing': journey08Content,
  'reading-comprehension': journey09Content,
  'debate-skills': journey10Content,
  'report-writing': journey11Content,
  'etiquette-branding': journey12Content
};

export function getJourneyContent(idOrModule: string): JourneyContentSchema {
  return ALL_JOURNEY_CONTENTS[idOrModule] || journey01Content;
}

export {
  journey01Content,
  journey02Content,
  journey03Content,
  journey04Content,
  journey05Content,
  journey06Content,
  journey07Content,
  journey08Content,
  journey09Content,
  journey10Content,
  journey11Content,
  journey12Content
};
