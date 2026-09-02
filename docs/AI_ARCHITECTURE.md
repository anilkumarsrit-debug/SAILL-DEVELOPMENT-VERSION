# SAILL AI Architecture & Prompt Engineering Specification

This document details the AI architecture powering the **Srinivasa Ramanujan Institute of Technology (SRIT) AI Language Laboratory (SAILL R26)**.

---

## 1. AI Infrastructure Overview

SAILL uses a resilient dual-tier AI processing engine:
1. **Primary AI Provider**: Google Gemini API via `@google/genai` TypeScript SDK (utilizing `gemini-1.5-flash` for real-time speech evaluation and `gemini-1.5-pro` for deep essay & resume reviews).
2. **Secondary Local Rule Engine**: Client/Server offline failover parser that uses heuristic NLP analysis when internet or Gemini API access is unavailable or throttled.

---

## 2. Prompt Manager Architecture

AI prompts are structured, versioned, and stored in `src/ai/promptManager.ts` to ensure consistency and prevent prompt injection or format drift.

### Prompt Registry Schema
```typescript
export interface AIPromptDefinition {
  id: string;
  version: string;
  moduleCategory: 'phonetics' | 'jam' | 'interview' | 'presentation' | 'resume';
  systemPrompt: string;
  expectedJsonSchema: object;
  validationRules: Array<(response: any) => boolean>;
}
```

---

## 3. Registered Prompts & JSON Schemas

### Prompt 01: Speech & Phonetics Evaluator (`SPEECH_EVALUATION_V2`)
- **Version**: `2.6.0`
- **Model Target**: `gemini-1.5-flash`
- **System Prompt**:
  > "You are an expert Phonetics Professor at SRIT English Language Lab. Evaluate the provided student spoken text against RP (Received Pronunciation) standard. Output MUST strictly match the requested JSON schema."

#### Expected JSON Output
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "score": { "type": "number", "minimum": 0, "maximum": 100 },
    "letterGrade": { "type": "string", "enum": ["A+", "A", "B", "C", "Needs Work"] },
    "pronunciationScore": { "type": "number", "minimum": 0, "maximum": 10 },
    "fluencyScore": { "type": "number", "minimum": 0, "maximum": 10 },
    "grammarScore": { "type": "number", "minimum": 0, "maximum": 10 },
    "feedback": {
      "type": "object",
      "properties": {
        "keyStrengths": { "type": "array", "items": { "type": "string" } },
        "areasForImprovement": { "type": "array", "items": { "type": "string" } },
        "phoneticCorrections": { "type": "array", "items": { "type": "string" } }
      },
      "required": ["keyStrengths", "areasForImprovement"]
    }
  },
  "required": ["score", "letterGrade", "feedback"]
}
```

---

### Prompt 02: Mock Interview Diagnostic (`INTERVIEW_EVALUATION_V1`)
- **Version**: `1.2.0`
- **Model Target**: `gemini-1.5-flash`
- **System Prompt**:
  > "You are an Enterprise HR Technical Interviewer. Analyze the candidate's answer for STAR methodology (Situation, Task, Action, Result) and communication clarity."

---

## 4. Response Validation Rules

Before sending AI responses to the UI, the service validates output against three strict rules:

1. **JSON Syntax Rule**: Response must parse cleanly via `JSON.parse()` without trailing markdown backticks or raw strings.
2. **Range Constraint Rule**: Numerical scores must fall within bounds (`0 <= score <= 100`).
3. **Non-Empty Feedback Rule**: `keyStrengths` and `areasForImprovement` arrays must contain at least 1 actionable string.

If validation fails, the service executes a repair re-prompt or gracefully falls back to the local rule engine.

---

## 5. Audit Logging & Security

All AI calls are recorded using `logger.ai(...)`:
- **Logged Data**: Prompt ID, Version, Model ID, Token Count / Duration, Failure/Fallback State.
- **Privacy Protection**: PII (Personally Identifiable Information) like student phone numbers or passwords are sanitized prior to AI transmission.
