# The Interview Agent — Build Plan

An AI interviewer that runs realistic, personalized technical interviews for graduates of a 31-day enterprise AI engineering cohort, then produces an evidence-grounded feedback report.

No curriculum/profile/spec files were attached, so the app ships with clearly labeled synthetic seed data and implements the suggested API contract from the brief. Swapping in real data later means replacing two JSON files.

## Stack note

This project runs on TanStack Start (React + Vite + Tailwind + shadcn/ui), not Next.js. Same architecture, equivalent surfaces: server routes under `src/routes/api/*` replace Next API routes. AI calls use Lovable AI (`google/gemini-3.6-flash`) with the key kept server-side.

## Screens

1. **Landing** — product name, tagline, value proposition, how personalization works, primary CTA.
2. **Candidate selection** — cards per candidate: progress ring, completed missions, skipped topics, learning signals, recommended focus areas. No internal scoring exposed.
3. **Interview brief** — title, estimated duration, topic areas that may come up, interview style, note that follow-ups adapt. Start / back.
4. **Interview** — chat transcript, interviewer vs candidate styling, thinking indicator, question counter (n of 8+), curriculum-day coverage chips, progress bar, exit + restart, keyboard send, mobile layout.
5. **Feedback report** — readiness level, overall score, strengths, knowledge gaps with importance, per-day topic breakdown, communication and engineering-judgment assessments, next steps, sample improved answers, copy/export, restart.

## Interview engine

Five separated responsibilities in `src/lib/interview/`:

- **Planner** — builds a personalized question strategy at start: picks curriculum days weighted toward completed-but-shaky and skipped topics, guarantees ≥4 distinct days.
- **Interviewer** — writes the next question in natural conversational tone, referencing prior answers.
- **Evaluator** — scores each answer on correctness, depth, clarity, practical experience, trade-off awareness, production awareness, confidence; records missing concepts and evidence quotes. Internal only.
- **Controller** — decides probe / example / implementation detail / challenge / trade-off / failure-mode / topic switch / difficulty shift / finish. Enforces ≥8 questions, ≥4 days, no duplicate questions.
- **Feedback generator** — produces the final report against the rubric (correctness 30, depth 20, design/trade-offs 20, production awareness 15, communication 15), every strength and gap tied to a quoted answer.

Question types rotate across concept explanation, system design, debugging, trade-offs, architecture decisions, failure modes, production readiness, security/reliability, cost/latency, and reflection.

## AI layer

- `LLMClient` interface with two implementations: `GatewayLLMClient` (Lovable AI, structured JSON output validated with Zod, one repair retry on invalid JSON, timeout + transient-failure retry) and `MockLLMClient`.
- Mock mode activates automatically when no key is available or the gateway fails. It is not a scripted transcript: it branches on candidate profile, a per-topic question pool, and keyword/length/specificity signals from the answer, and it still delivers 8+ questions, 4+ days, follow-ups, and a full report.
- Candidate messages are treated as untrusted data: wrapped in delimited blocks, length-capped, with explicit instructions that they cannot alter interview rules. No chain-of-thought is stored or returned.

## API

Server routes, in-memory session store (per the chosen storage option), Zod validation on every request:

- `POST /api/interview/start` — `{ candidateId }` → `{ interviewId, candidate, openingMessage, question, questionNumber, minimumQuestions, coveredCurriculumDays }`
- `POST /api/interview/message` — `{ interviewId, message }` → `{ interviewId, message, question, questionNumber, isComplete, coveredCurriculumDays }`
- `POST /api/interview/finish` — `{ interviewId }` → `{ interviewId, isComplete, feedback }`
- `GET /api/health`

Errors return clear messages and correct status codes for unknown candidate, invalid/expired interview ID, empty or oversized message, finishing early, and model failure (which degrades to mock rather than erroring).

## Data

`src/data/curriculum.json` — 31 days across RAG, vector databases, embeddings, prompt engineering, evaluation, agentic AI, MCP, tool use, guardrails, deployment, observability, cost/latency, and production operations; each day has topics, learning objectives, and tools.

`src/data/candidates.json` — 4 profiles with distinct shapes (strong builder with weak production instincts; theory-heavy with few shipped systems; solid but skipped agents/MCP; well-rounded near interview-ready), each with completed missions, attempt counts, skipped topics, and learning signals.

## Tests

Vitest coverage for state transitions, ≥8-question enforcement, ≥4-day coverage, duplicate-question prevention, follow-up selection given evaluation signals, feedback schema validation, and API request validation.

## Docs

`README.md` (overview, features, architecture, agent workflow, setup, env vars, dev, tests, API reference, mock mode, deployment, design decisions, limitations, and an explicit note that seed data is synthetic) and `PROMPTS.md` (all five prompts, design rationale, example structured outputs).

## Verification before finishing

Typecheck, lint, tests, then a full browser-driven demo interview: select candidate → 8+ answered questions → confirm coverage chips span 4+ days → generate report → verify evidence quotes appear. Endpoints exercised directly, including error cases.
