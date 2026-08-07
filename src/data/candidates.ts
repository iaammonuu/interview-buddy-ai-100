import type { Candidate } from "@/types/interview";

/**
 * SYNTHETIC SEED DATA.
 * No candidate profile file was supplied with the brief. These four profiles
 * have deliberately different shapes so the personalization logic is visible
 * in a demo. Replace this array with the real cohort export to go live.
 */
export const candidates: Candidate[] = [
  {
    id: "cand-priya",
    name: "Priya Raman",
    headline: "Ships fast, thin on production hardening",
    background:
      "Backend engineer, four years in Python services. Built three retrieval prototypes during the cohort and shipped the capstone early.",
    progressPercent: 84,
    completedMissions: [
      { day: 2, title: "Prompt Engineering Patterns", attempts: 1, selfRating: 5 },
      { day: 4, title: "Embeddings & Semantic Similarity", attempts: 1, selfRating: 4 },
      { day: 5, title: "Vector Databases", attempts: 2, selfRating: 4 },
      { day: 6, title: "Chunking & Document Processing", attempts: 1, selfRating: 5 },
      { day: 7, title: "RAG Pipeline Architecture", attempts: 1, selfRating: 5 },
      { day: 8, title: "Hybrid Search & Re-ranking", attempts: 3, selfRating: 3 },
      { day: 13, title: "Tool Calling Fundamentals", attempts: 1, selfRating: 4 },
      { day: 14, title: "Agent Loops & Control Flow", attempts: 2, selfRating: 3 },
      { day: 30, title: "Enterprise AI System Design", attempts: 1, selfRating: 4 },
    ],
    skippedDays: [21, 22, 25, 26, 28],
    learningSignals: [
      "Completes build missions well ahead of the cohort median",
      "Re-attempted hybrid search three times before passing",
      "Rarely engages with observability or cost material",
      "Capstone had no tracing and no rate-limit handling",
    ],
    recommendedFocusDays: [8, 21, 25, 26, 28],
  },
  {
    id: "cand-daniel",
    name: "Daniel Okafor",
    headline: "Strong theory, limited shipped systems",
    background:
      "Data scientist moving into engineering. Reads deeply, but most missions were completed as notebooks rather than deployed services.",
    progressPercent: 71,
    completedMissions: [
      { day: 1, title: "LLM Fundamentals & Tokenization", attempts: 1, selfRating: 5 },
      { day: 3, title: "Structured Outputs & Schema Validation", attempts: 2, selfRating: 3 },
      { day: 4, title: "Embeddings & Semantic Similarity", attempts: 1, selfRating: 5 },
      { day: 9, title: "RAG Failure Modes", attempts: 1, selfRating: 4 },
      { day: 10, title: "Evaluating RAG Systems", attempts: 1, selfRating: 5 },
      { day: 11, title: "LLM-as-Judge & Offline Evals", attempts: 1, selfRating: 4 },
      { day: 29, title: "Fine-tuning vs RAG vs Prompting", attempts: 1, selfRating: 5 },
    ],
    skippedDays: [13, 14, 15, 17, 23, 27, 28],
    learningSignals: [
      "Highest evaluation-module engagement in the cohort",
      "No agent missions attempted",
      "Deployment mission left unfinished twice",
      "Explains concepts precisely but with few concrete war stories",
    ],
    recommendedFocusDays: [13, 14, 23, 27, 10],
  },
  {
    id: "cand-mei",
    name: "Mei Tanaka",
    headline: "Solid builder who skipped the agent and MCP block",
    background:
      "Full-stack engineer with production ownership experience. Strong on infrastructure, jumped straight from retrieval to the capstone.",
    progressPercent: 77,
    completedMissions: [
      { day: 5, title: "Vector Databases", attempts: 1, selfRating: 5 },
      { day: 7, title: "RAG Pipeline Architecture", attempts: 1, selfRating: 4 },
      { day: 9, title: "RAG Failure Modes", attempts: 2, selfRating: 4 },
      { day: 12, title: "Regression Testing for Prompts", attempts: 1, selfRating: 4 },
      { day: 23, title: "Streaming, Timeouts & Resilience", attempts: 1, selfRating: 5 },
      { day: 24, title: "Caching & Cost Optimization", attempts: 1, selfRating: 5 },
      { day: 26, title: "Observability & Tracing", attempts: 1, selfRating: 5 },
      { day: 27, title: "Deployment & Environments", attempts: 1, selfRating: 5 },
      { day: 31, title: "Capstone Ship & Review", attempts: 1, selfRating: 4 },
    ],
    skippedDays: [13, 14, 15, 16, 18, 19, 20],
    learningSignals: [
      "Best production-operations scores in the cohort",
      "Entire agents and MCP block skipped",
      "Capstone was a RAG service with no tool use",
      "Comfortable discussing incidents and rollbacks",
    ],
    recommendedFocusDays: [13, 15, 18, 20, 16],
  },
  {
    id: "cand-arjun",
    name: "Arjun Mehta",
    headline: "Well-rounded, close to interview ready",
    background:
      "Platform engineer who completed nearly every mission. Built an internal MCP server and an approval-gated agent for the capstone.",
    progressPercent: 94,
    completedMissions: [
      { day: 3, title: "Structured Outputs & Schema Validation", attempts: 1, selfRating: 5 },
      { day: 7, title: "RAG Pipeline Architecture", attempts: 1, selfRating: 4 },
      { day: 8, title: "Hybrid Search & Re-ranking", attempts: 1, selfRating: 4 },
      { day: 10, title: "Evaluating RAG Systems", attempts: 2, selfRating: 4 },
      { day: 14, title: "Agent Loops & Control Flow", attempts: 1, selfRating: 5 },
      { day: 17, title: "Human-in-the-Loop & Approvals", attempts: 1, selfRating: 5 },
      { day: 19, title: "Building an MCP Server", attempts: 1, selfRating: 5 },
      { day: 21, title: "Prompt Injection & Untrusted Content", attempts: 2, selfRating: 4 },
      { day: 25, title: "Latency Engineering", attempts: 1, selfRating: 4 },
      { day: 26, title: "Observability & Tracing", attempts: 1, selfRating: 4 },
      { day: 30, title: "Enterprise AI System Design", attempts: 1, selfRating: 5 },
    ],
    skippedDays: [24, 29],
    learningSignals: [
      "Consistent completion across every module",
      "Shipped an MCP server used by two other learners",
      "Never revisited cost optimization material",
      "Tends to over-explain before reaching the decision",
    ],
    recommendedFocusDays: [24, 29, 21, 15, 25],
  },
];

export const candidatesById = new Map(candidates.map((c) => [c.id, c]));
