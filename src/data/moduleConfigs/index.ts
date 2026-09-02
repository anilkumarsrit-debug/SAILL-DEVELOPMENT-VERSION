import { ModuleConfig } from '../../types/moduleConfig';
import { module1Config } from './module1';
import { module2Config } from './module2';
import { module3Config } from './module3';
import { module4Config } from './module4';
import { module5Config } from './module5';
import { module6Config } from './module6';
import { module7Config } from './module7';
import { module8Config } from './module8';
import { module9Config } from './module9';
import { module10Config } from './module10';
import { module11Config } from './module11';
import { module12Config } from './module12';

export const MODULE_CONFIGS: Record<string, ModuleConfig> = {
  'pronunciation': module1Config,
  'listening': module2Config,
  'spoken-english': module3Config,
  'group-discussion': module4Config,
  'public-speaking': module5Config,
  'professional-writing': module6Config,
  'professional-email': module7Config,
  'resume-writing': module8Config,
  'reading-comprehension': module9Config,
  'debate-skills': module10Config,
  'report-writing': module11Config,
  'etiquette-branding': module12Config,
};

export function getModuleConfig(moduleId: string): ModuleConfig {
  if (MODULE_CONFIGS[moduleId]) {
    return MODULE_CONFIGS[moduleId];
  }
  // Fallback to module 1 or 12 if not found
  return MODULE_CONFIGS['pronunciation'] || module12Config;
}

export {
  module1Config,
  module2Config,
  module3Config,
  module4Config,
  module5Config,
  module6Config,
  module7Config,
  module8Config,
  module9Config,
  module10Config,
  module11Config,
  module12Config
};
