# Spokena: AI-Driven Articulation Coach

> Build a daily, low-friction habit of clearer speaking — judgment-free, data-driven, and relentlessly incremental.

## The Problem: The Articulation Gap

Despite technical or linguistic proficiency, many people face a plateau in professional communication caused by three core barriers:

- **The Comprehension Paradox**: Users can understand complex language but fail to articulate the same ideas clearly under pressure.
- **Voice Confrontation (Unfamiliarity)**: Hearing one's own voice produces discomfort, preventing objective self-assessment and slowing improvement.
- **The Feedback Void**: Lack of immediate, private, and objective feedback prevents iterative progress.

## The Solution: The Kaizen of Speech

Spokena implements the Plan-Do-Check-Act (PDCA) cycle for speech practice:

- **Do (Daily Exposure)**: Short daily speaking tasks (1–2 minutes) to normalize self-audio and build vocal habit.
- **Check (Structured AI Analysis)**: A dual-AI engine returns concise, schema-validated feedback that emphasizes successes, deficiencies, and actionable fixes.
- **Act (Proactive Retention)**: Automated reminders and scheduling preserve streaks and convert practice into habit.

## Technical Architecture & Design Rationale

Every choice in the Spokena stack favors reliability, predictable outputs, and long-term operational sustainability.

### Client & Interface

- **Next.js & React**: Responsive UI and optimized rendering.
- **Electron**: Native desktop wrapper to increase retention and reduce friction.

### Backend Logic

_(Place the attached architecture diagram in `assets/architecture.png` and it will render here.)_

![Architecture Diagram](assets/architecture.png)

- **FastAPI**: Asynchronous, high-performance API orchestration.
- **Resilient Transcription Router**:
  - Primary: **AssemblyAI** for low-latency, high-accuracy cloud transcription.
  - Fallback: **Distil-Whisper** (local) to guarantee availability regardless of API limits.
- **Gemini API with Guardrails**: LLM analysis enforced by strict JSON schema to ensure deterministic, parseable feedback.

### Data & Automation Engine

- **Supabase (Postgres)**: Centralized state store for user preferences and practice history.
- **Automated Engagement**: `pg_cron` + Supabase Edge Functions scan for users near their Preferred Practice Time and send reminders using the Resend API.

## Core Tech Stack

| Component | Technology |
| --- | --- |
| **Frontend** | Next.js, React, Tailwind CSS |
| **Desktop Shell** | Electron |
| **Backend API** | FastAPI (Python) |
| **Transcription** | AssemblyAI (Cloud), Distil-Whisper (Local Fallback) |
| **LLM Analysis** | Gemini API |
| **Database** | Supabase (PostgreSQL) |
| **Automation** | Supabase Edge Functions, pg_cron |
| **Email Service** | Resend API |

## Repository Layout & Quick Analysis

This repository contains three primary workspaces: `backend/`, `electron/`, and the web app `spokena/`.

- `backend/Spokena/`
  - API server built with FastAPI: see [backend/Spokena/app.py](backend/Spokena/app.py) and configuration in [backend/Spokena/api/core/config.py](backend/Spokena/api/core/config.py).
  - Transcription services and AI orchestrators live under `api/services` and `api/routers`.
  - `requirements.txt` holds Python dependencies used by the backend.

- `spokena/` (Next.js app)
  - Frontend UI lives under `spokena/app/` (routes and components). Key files include [spokena/package.json](spokena/package.json) and UI components in `spokena/app/components`.
  - A `pnpm-lock.yaml` is present — `pnpm` is the recommended package manager.

- `electron/`
  - Desktop wrapper and bundling scripts (see [electron/package.json](electron/package.json)).

Notes and recommendations:

- The backend uses asynchronous patterns (FastAPI + Uvicorn). Keep long-running tasks off the request path and queue heavy work if needed.
- The transcription router is designed to failover from AssemblyAI to a local Whisper model to ensure practice continuity.
- The Gemini responses are intended to be schema-validated to ensure the front-end can render feedback consistently.

## Getting Started (Local Development)

Below are pragmatic, minimal steps to run the system locally. Adapt paths and commands to your platform.

1) Backend (FastAPI)

```
# from the repo root
cd backend/Spokena
python -m venv .venv
# Windows (PowerShell)
.\.venv\Scripts\Activate.ps1
# or Windows (cmd)
.\.venv\Scripts\activate.bat
# macOS / Linux
# source .venv/bin/activate

pip install -r requirements.txt
# start the API
uvicorn app:app --reload --port 8000

# The API should be reachable at http://localhost:8000
```

Notes:
- If the project expects environment variables (API keys for AssemblyAI, Gemini, Supabase, Resend), set them before starting the server. See `backend/Spokena/api/core/config.py` for config keys.

2) Frontend (Next.js)

```
# from repo root
cd spokena
pnpm install
pnpm dev

# open http://localhost:3000
```

If you don't have `pnpm` installed, use `npm install -g pnpm` or run `npm install && npm run dev` as an alternative.

3) Electron (Desktop Shell)

```
# from repo root
cd electron
npm install
# start the Electron shell (check package.json for the correct script)
npm run start
```

4) Optional: Local Whisper Fallback

- The repository includes code for a local Whisper model fallback. Running a local model can be resource intensive. See `backend/Spokena/api/services/transcription.py` (or similar) for setup instructions and model paths.

## Environment Variables

At minimum, you will likely configure keys for:

- `ASSEMBLYAI_API_KEY` (AssemblyAI cloud transcription)
- `GEMINI_API_KEY` (Gemini LLM)
- `SUPABASE_URL` and `SUPABASE_KEY` (Supabase)
- `RESEND_API_KEY` (Email reminders)

Store these in a `.env` file or configure them in your shell/CI environment.

## Contributing

- Open a PR against `main` and include a concise description of the change and any local testing steps.
- If you modify AI schemas or feedback formats, update both the backend schema and the frontend parsers/components.

## Where to place the architecture image

Please add the provided architecture diagram to `assets/architecture.png` at the repo root. It will render in this README as `![Architecture Diagram](assets/architecture.png)`.

## Contact

For questions about architecture or design rationale, open an issue or contact the repository owner.

---

This README is intended as the canonical project overview for contributors and stakeholders. If you want, I can also open a small PR that:

- Adds `assets/architecture.png` if you provide the image file here.
- Adds a short `CONTRIBUTING.md` with branch and commit conventions.
