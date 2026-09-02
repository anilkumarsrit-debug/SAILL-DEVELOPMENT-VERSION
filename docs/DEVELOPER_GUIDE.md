# SAILL Developer Guide (SRIT R26 Architecture)

Welcome to the **Srinivasa Ramanujan Institute of Technology (SRIT) AI Language Laboratory (SAILL R26)** Developer Guide. This guide outlines architectural conventions, coding standards, and step-by-step procedures for extending the platform.

---

## 1. Architecture Overview

SAILL is designed as a modular, responsive full-stack platform built with:
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + Motion (Framer Motion) + Lucide Icons
- **Backend Service**: Express.js server (`server.ts`) running on Node.js
- **Persistence**: Hybrid architecture featuring client IndexedDB (`dbStorage` service in `src/lib/db.ts`) with cloud readiness
- **AI Engine**: Google Gemini API (`@google/genai` SDK) with local rule engine failover for offline reliability
- **Audio Processing**: WebAudio API + MediaRecorder API with WebM/Opus encoding

---

## 2. Project Directory Structure

```
src/
├── ai/              # AI Prompt Manager, Gemini SDK handlers, and evaluation rules
├── components/      # Modular UI components
│   ├── laboratory/  # Lab tools (Phonetics, Jam, Mock Interview, Resume, Presentation)
│   ├── navigation/  # Navbar, Footer, MobileNav
│   ├── practice/    # AudioRecorder, Waveform Visualizer
│   └── student/     # Student Dashboard, Portfolio, Analytics
├── config/          # Centralized master config (APP_CONFIG, FeatureFlags)
├── context/         # React Contexts (AuthContext, ThemeContext, LabContext)
├── data/            # Static curriculum content & module definitions
├── docs/            # Developer & API documentation
├── lib/             # Database storage engine (IndexedDB)
├── pages/           # Primary page views (LandingPage, FacultyDashboard, AdminControl)
├── services/        # Service layers (AuthService, AIService, PortfolioService)
├── templates/       # Standardized learning module blueprints & React templates
├── types/           # Global TypeScript type definitions
└── utils/           # Logger, Accessibility (a11y), and middleware helpers
```

---

## 3. Coding & Styling Standards

### Naming Conventions
- **Components**: PascalCase (e.g., `RecordWorkStudio.tsx`, `AudioRecorder.tsx`).
- **Hooks / Services**: camelCase prefixed with function domain (e.g., `useAudioRecorder.ts`, `AuthService.ts`).
- **Constants / Enums**: UPPER_SNAKE_CASE (e.g., `APP_CONFIG`, `DEFAULT_FEATURE_FLAGS`).
- **Types & Interfaces**: PascalCase (e.g., `StudentProfile`, `ModuleProgress`).

### UI Palette & Styling Rules
- **Brand Colors**: Primary Terracotta `#D35400`, Warm Amber Accent `#E67E22`, Soft Gold Border `#FAD7A0`, Card Background `#FFFDF9`.
- **Buttons**: Minimum touch target of 44px. Padding must scale proportionally (e.g., `px-4 py-2`).
- **Typography**: Paired display and clean body typography with strict WCAG AA contrast (minimum 4.5:1 ratio).
- **Icons**: Exclusively imported from `lucide-react`.

---

## 4. How to Add a New Learning Module

To introduce a new module (e.g., Module 09 or custom module):

1. **Define Module Data**:
   Open `src/data/modules.ts` or create a definition using `createModuleTemplate`:
   ```typescript
   import { createModuleTemplate } from '../templates/learningModuleTemplate';

   export const module09 = createModuleTemplate({
     id: 'module-09',
     code: 'R26-ENG-M09',
     title: 'Technical Pitching & Startup Demos',
     category: 'presentation',
     duration: '60 mins',
     level: 'Advanced',
     description: 'Master 3-minute technical pitch structures with AI speech feedback.'
   });
   ```

2. **Create Module View Component**:
   Utilize `src/templates/ModuleTemplate.tsx` as a baseline or customize in `src/components/laboratory/`:
   ```tsx
   import React from 'react';
   import { ModuleTemplate } from '../../templates/ModuleTemplate';
   import { module09 } from '../../data/modules';

   export const TechnicalPitchModule: React.FC = () => {
     return <ModuleTemplate definition={module09} />;
   };
   ```

3. **Register Page Route**:
   Add the new module ID to `src/types/index.ts` under the `Page` union type and handle rendering in `src/App.tsx`.

---

## 5. How to Add a New AI Prompt

1. **Register Prompt Template**:
   Open `src/ai/promptManager.ts` and declare your system prompt:
   ```typescript
   export const PROMPTS = {
     PITCH_EVALUATION_V1: {
       version: '1.0.0',
       systemPrompt: `Analyze the technical pitch transcript. Return strictly valid JSON...`,
       expectedJsonSchema: `{ "score": number, "clarity": string, "hookStrength": string }`
     }
   };
   ```

2. **Connect Service Handler**:
   Update `src/services/AIService.ts` to call the route or SDK function using `logger.ai(...)` for audit trails.

---

## 6. How to Create an API Endpoint

Express endpoints reside in `server.ts`. Follow this structure:

```typescript
app.post('/api/v1/custom-endpoint', async (req, res) => {
  try {
    const { payload } = req.body;
    logger.info('API', 'Received custom endpoint request', { payload });

    // Business Logic
    const result = { success: true, timestamp: new Date().toISOString() };
    res.json(result);
  } catch (error) {
    logger.error('API', 'Custom endpoint error', error);
    res.status(500).json({ error: 'Internal server error', code: 'SERVER_ERROR' });
  }
});
```

---

## 7. Logging & Telemetry

Always use the standardized logger in `src/utils/logger.ts`:

```typescript
import { logger } from '../utils/logger';

// Info log
logger.info('UI', 'User switched to Phonetics module tab', { tabId: 'concept' });

// AI log
logger.ai('Gemini speech evaluation initiated', { audioDuration: 42 });

// Security log
logger.security('Role change attempt blocked', { userId: '101', role: 'admin' });

// Error log
logger.error('AUDIO', 'MediaRecorder failed to initialize', error);
```
