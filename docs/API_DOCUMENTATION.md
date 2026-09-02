# SAILL API Documentation (SRIT R26 REST Services)

This document provides complete specification for all Express server endpoints provided by the **SAILL R26 Backend Service** (`server.ts`).

---

## Global Base URL & Headers

- **Base URL**: `https://<host>/api`
- **Default Content-Type**: `application/json`
- **Authentication**: Bearer Token or Session Cookie (for student/faculty roles)

---

## Endpoints Summary

| Endpoint | Method | Purpose | Auth Required |
| :--- | :--- | :--- | :--- |
| `/api/health` | `GET` | Health check & system diagnostics | No |
| `/api/ai/evaluate-speech` | `POST` | Speech transcript evaluation via Gemini AI | Yes |
| `/api/ai/transcribe` | `POST` | Audio recording transcription & phonetics | Yes |
| `/api/portfolio/submit` | `POST` | Student lab work portfolio submission | Yes |
| `/api/faculty/approve-portfolio` | `POST` | Faculty in-charge approval workflow | Yes (Faculty) |

---

## Endpoint Details

### 1. System Health Check
`GET /api/health`

Returns operational status of the server and attached services.

#### Request
```http
GET /api/health HTTP/1.1
Host: localhost:3000
```

#### Response (`200 OK`)
```json
{
  "status": "ok",
  "version": "2.6.0-PROD",
  "timestamp": "2026-08-06T07:00:00.000Z",
  "institution": "SRIT SAILL R26",
  "services": {
    "database": "online",
    "aiEngine": "ready"
  }
}
```

---

### 2. Speech Evaluation API
`POST /api/ai/evaluate-speech`

Evaluates student spoken transcript against curriculum rubric using Gemini AI with failover.

#### Request Body
```json
{
  "moduleCode": "R26-ENG-M01",
  "transcript": "Good morning respected faculty, today I will present...",
  "targetTopic": "Phonetics & Monophthongs",
  "evaluationCriteria": ["pronunciation", "fluency", "grammar", "vocabulary"]
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "score": 88,
  "letterGrade": "A",
  "breakdown": {
    "pronunciation": 9,
    "fluency": 8,
    "grammar": 9,
    "vocabulary": 9
  },
  "feedback": {
    "strengths": ["Clear vowel articulation", "Confident pacing"],
    "improvements": ["Work on rising intonation for questions"],
    "phoneticsNotes": "Monophthong /i:/ was accurately sustained."
  },
  "provider": "Gemini-1.5-Flash"
}
```

#### Error Response (`400 Bad Request`)
```json
{
  "error": "Missing required field 'transcript'",
  "code": "INVALID_PAYLOAD"
}
```

---

### 3. Audio Transcription API
`POST /api/ai/transcribe`

Converts base64 audio payload into text transcript with phonetic markers.

#### Request Body
```json
{
  "audioBase64": "data:audio/webm;base64,GkXfo59ChoEBQveBA...",
  "mimeType": "audio/webm;codecs=opus"
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "transcript": "Hello everyone, my name is Rahul from CSE department.",
  "durationSeconds": 14.2,
  "confidenceScore": 0.94
}
```

---

### 4. Portfolio Submission API
`POST /api/portfolio/submit`

Submits a completed lab recording, self-assessment score, and notes for faculty verification.

#### Request Body
```json
{
  "studentId": "26SRIT001",
  "studentName": "A. Rahul",
  "rollNumber": "234G1A0501",
  "moduleTitle": "Phonetics Lab 1",
  "audioUrl": "data:audio/webm;base64,...",
  "selfMark": "A",
  "reflectionNotes": "Practiced pure vowels and diphthongs."
}
```

#### Response (`201 Created`)
```json
{
  "success": true,
  "portfolioItemId": "port-88219",
  "status": "Submitted for Verification",
  "submittedAt": "2026-08-06T07:00:00.000Z"
}
```

---

## Standard Error Codes

| Error Code | HTTP Status | Description |
| :--- | :--- | :--- |
| `INVALID_PAYLOAD` | `400` | Missing required parameters in request body |
| `UNAUTHORIZED` | `401` | Missing or invalid bearer token |
| `FORBIDDEN` | `403` | User role lacks permission for action |
| `AI_SERVICE_UNAVAILABLE` | `503` | Gemini API unreachable; failover engaged |
| `SERVER_ERROR` | `500` | Unhandled internal server error |
