/**
 * SAILL - Unit Test Architecture Spec
 *
 * Place pure function tests, helper tests, logger tests, and hook tests here.
 */

import { describe, it, expect } from '../testUtils';
import { APP_CONFIG } from '../../config/appConfig';
import { featureFlags } from '../../config/featureFlags';

describe('SAILL Configuration Unit Baseline', () => {
  it('has valid curriculum codes', () => {
    expect(APP_CONFIG.institution.curriculumCode).toBe('R26');
  });

  it('initializes default feature flags', () => {
    expect(featureFlags.isEnabled('enableAiRecordingAnalysis')).toBe(true);
  });
});
