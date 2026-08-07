import type { CurriculumDay } from "@/types/interview";

/**
 * SYNTHETIC SEED DATA.
 * No curriculum file was supplied with the brief, so this is a representative
 * 31-day enterprise AI engineering cohort. Replace this array with the real
 * curriculum export and everything downstream (planning, coverage, feedback)
 * adapts automatically.
 */
export const curriculum: CurriculumDay[] = [
  {
    day: 1,
    module: "Foundations",
    title: "LLM Fundamentals & Tokenization",
    topics: ["Transformer intuition", "Tokenization", "Context windows", "Sampling parameters"],
    objectives: [
      "Explain how token limits shape application design",
      "Reason about temperature, top-p and determinism",
    ],
    tools: ["OpenAI API", "tiktoken"],
  },
  {
    day: 2,
    module: "Foundations",
    title: "Prompt Engineering Patterns",
    topics: ["System prompts", "Few-shot prompting", "Chain-of-thought alternatives", "Delimiters"],
    objectives: [
      "Design prompts that are testable and version controlled",
      "Choose between zero-shot, few-shot and structured prompting",
    ],
    tools: ["OpenAI API", "Prompt templates"],
  },
  {
    day: 3,
    module: "Foundations",
    title: "Structured Outputs & Schema Validation",
    topics: ["JSON mode", "Function/tool schemas", "Schema validation", "Repair loops"],
    objectives: [
      "Guarantee machine-parsable model output",
      "Recover gracefully from malformed generations",
    ],
    tools: ["Zod", "JSON Schema"],
  },
  {
    day: 4,
    module: "Foundations",
    title: "Embeddings & Semantic Similarity",
    topics: ["Embedding models", "Cosine similarity", "Dimensionality", "Normalization"],
    objectives: [
      "Select an embedding model for a domain",
      "Explain why similarity is not relevance",
    ],
    tools: ["text-embedding-3", "NumPy"],
  },
  {
    day: 5,
    module: "Retrieval",
    title: "Vector Databases",
    topics: ["Indexes (HNSW, IVF)", "Metadata filtering", "Upserts", "Namespaces"],
    objectives: [
      "Choose an index type given recall and latency targets",
      "Design a metadata schema for multi-tenant retrieval",
    ],
    tools: ["pgvector", "Pinecone", "Qdrant"],
  },
  {
    day: 6,
    module: "Retrieval",
    title: "Chunking & Document Processing",
    topics: ["Fixed vs semantic chunking", "Overlap", "Parsing PDFs", "Metadata enrichment"],
    objectives: [
      "Design a chunking strategy for heterogeneous documents",
      "Explain the recall/precision impact of chunk size",
    ],
    tools: ["Unstructured", "LangChain splitters"],
  },
  {
    day: 7,
    module: "Retrieval",
    title: "RAG Pipeline Architecture",
    topics: ["Ingestion", "Retrieval", "Grounded generation", "Citations"],
    objectives: [
      "Build an end-to-end RAG pipeline",
      "Enforce grounding and citation of sources",
    ],
    tools: ["pgvector", "LangChain"],
  },
  {
    day: 8,
    module: "Retrieval",
    title: "Hybrid Search & Re-ranking",
    topics: ["BM25", "Reciprocal rank fusion", "Cross-encoder re-rankers", "Query rewriting"],
    objectives: [
      "Combine lexical and vector retrieval",
      "Quantify the value of a re-ranking stage",
    ],
    tools: ["BM25", "Cohere Rerank"],
  },
  {
    day: 9,
    module: "Retrieval",
    title: "RAG Failure Modes",
    topics: ["Hallucination", "Stale index", "Irrelevant retrieval", "Conflicting sources"],
    objectives: [
      "Diagnose whether a bad answer is a retrieval or generation failure",
      "Design guardrails for low-confidence retrieval",
    ],
    tools: ["Ragas", "Custom eval harness"],
  },
  {
    day: 10,
    module: "Evaluation",
    title: "Evaluating RAG Systems",
    topics: ["Recall@k", "Faithfulness", "Answer relevance", "Golden datasets"],
    objectives: [
      "Build a golden dataset from real traffic",
      "Separate retrieval metrics from generation metrics",
    ],
    tools: ["Ragas", "Promptfoo"],
  },
  {
    day: 11,
    module: "Evaluation",
    title: "LLM-as-Judge & Offline Evals",
    topics: ["Judge prompts", "Bias and position effects", "Pairwise comparison", "Calibration"],
    objectives: [
      "Design a defensible LLM-as-judge rubric",
      "Know when human review is mandatory",
    ],
    tools: ["Promptfoo", "Braintrust"],
  },
  {
    day: 12,
    module: "Evaluation",
    title: "Regression Testing for Prompts",
    topics: ["Prompt versioning", "CI evals", "Golden outputs", "Drift detection"],
    objectives: [
      "Gate prompt changes behind automated evals",
      "Detect silent model-upgrade regressions",
    ],
    tools: ["GitHub Actions", "Promptfoo"],
  },
  {
    day: 13,
    module: "Agents",
    title: "Tool Calling Fundamentals",
    topics: ["Tool schemas", "Argument validation", "Tool result formatting", "Error surfaces"],
    objectives: [
      "Design narrow, well-described tools",
      "Handle tool failures without derailing the agent",
    ],
    tools: ["AI SDK", "Zod"],
  },
  {
    day: 14,
    module: "Agents",
    title: "Agent Loops & Control Flow",
    topics: ["ReAct", "Step limits", "Termination conditions", "Loop detection"],
    objectives: [
      "Bound an agent loop safely",
      "Detect and break repetitive tool cycles",
    ],
    tools: ["AI SDK", "LangGraph"],
  },
  {
    day: 15,
    module: "Agents",
    title: "Multi-Agent Orchestration",
    topics: ["Planner/worker split", "Handoffs", "Shared state", "Supervisor patterns"],
    objectives: [
      "Decide when multi-agent beats a single agent",
      "Prevent context loss across handoffs",
    ],
    tools: ["LangGraph", "AI SDK"],
  },
  {
    day: 16,
    module: "Agents",
    title: "Agent Memory & Context Management",
    topics: ["Short vs long-term memory", "Summarization", "Context compaction", "Retrieval memory"],
    objectives: [
      "Keep long sessions inside the context budget",
      "Choose what to persist and what to discard",
    ],
    tools: ["pgvector", "Redis"],
  },
  {
    day: 17,
    module: "Agents",
    title: "Human-in-the-Loop & Approvals",
    topics: ["Approval gates", "Irreversible actions", "Audit trails", "Escalation"],
    objectives: [
      "Identify actions that require human approval",
      "Design an auditable approval flow",
    ],
    tools: ["AI SDK needsApproval", "Temporal"],
  },
  {
    day: 18,
    module: "MCP",
    title: "Model Context Protocol Basics",
    topics: ["MCP servers", "Resources", "Tools", "Transport"],
    objectives: [
      "Explain what MCP standardizes and why it matters",
      "Connect a client to an MCP server",
    ],
    tools: ["MCP SDK"],
  },
  {
    day: 19,
    module: "MCP",
    title: "Building an MCP Server",
    topics: ["Tool registration", "Auth", "Streaming", "Versioning"],
    objectives: [
      "Expose an internal system safely over MCP",
      "Version tools without breaking clients",
    ],
    tools: ["MCP SDK", "TypeScript"],
  },
  {
    day: 20,
    module: "MCP",
    title: "MCP in Production",
    topics: ["OAuth", "Tool catalog overload", "Rate limits", "Observability"],
    objectives: [
      "Scope credentials per end user",
      "Manage large or dynamic tool catalogs",
    ],
    tools: ["MCP SDK", "OAuth 2.1"],
  },
  {
    day: 21,
    module: "Safety",
    title: "Prompt Injection & Untrusted Content",
    topics: ["Direct and indirect injection", "Data vs instructions", "Sandboxing", "Allowlists"],
    objectives: [
      "Treat retrieved and user content as data",
      "Contain the blast radius of a successful injection",
    ],
    tools: ["Guardrails", "Content filters"],
  },
  {
    day: 22,
    module: "Safety",
    title: "Guardrails, PII & Compliance",
    topics: ["PII redaction", "Output filtering", "Data residency", "Retention policy"],
    objectives: [
      "Redact sensitive data before it reaches a model",
      "Document data flows for compliance review",
    ],
    tools: ["Presidio", "Policy engines"],
  },
  {
    day: 23,
    module: "Production",
    title: "Streaming, Timeouts & Resilience",
    topics: ["SSE streaming", "Timeouts", "Retries with backoff", "Idempotency"],
    objectives: [
      "Stream long generations without platform timeouts",
      "Retry only what is safely retryable",
    ],
    tools: ["AI SDK", "Cloudflare Workers"],
  },
  {
    day: 24,
    module: "Production",
    title: "Caching & Cost Optimization",
    topics: ["Prompt caching", "Semantic cache", "Model routing", "Token budgeting"],
    objectives: [
      "Cut cost per request without hurting quality",
      "Route easy traffic to smaller models",
    ],
    tools: ["Redis", "Model routers"],
  },
  {
    day: 25,
    module: "Production",
    title: "Latency Engineering",
    topics: ["Time to first token", "Parallel retrieval", "Speculative prefetch", "Payload size"],
    objectives: [
      "Instrument and reduce p95 latency",
      "Trade quality for speed deliberately",
    ],
    tools: ["OpenTelemetry", "Load testing"],
  },
  {
    day: 26,
    module: "Production",
    title: "Observability & Tracing",
    topics: ["Trace spans", "Token accounting", "Feedback capture", "Alerting"],
    objectives: [
      "Trace a request across retrieval, tools and generation",
      "Alert on quality regressions, not just errors",
    ],
    tools: ["OpenTelemetry", "Langfuse"],
  },
  {
    day: 27,
    module: "Production",
    title: "Deployment & Environments",
    topics: ["Edge vs node runtimes", "Secrets", "Blue/green rollout", "Config management"],
    objectives: [
      "Ship model changes behind a rollout gate",
      "Keep provider keys out of client bundles",
    ],
    tools: ["Cloudflare Workers", "Vercel"],
  },
  {
    day: 28,
    module: "Production",
    title: "Scaling & Rate Limits",
    topics: ["Provider quotas", "Queueing", "Backpressure", "Multi-provider failover"],
    objectives: [
      "Design for provider throttling",
      "Fail over between providers without user impact",
    ],
    tools: ["Queues", "Gateways"],
  },
  {
    day: 29,
    module: "Production",
    title: "Fine-tuning vs RAG vs Prompting",
    topics: ["When to fine-tune", "Distillation", "Data requirements", "Maintenance cost"],
    objectives: [
      "Justify a fine-tune with data and cost evidence",
      "Compare lifecycle costs of each approach",
    ],
    tools: ["Fine-tuning APIs", "LoRA"],
  },
  {
    day: 30,
    module: "Capstone",
    title: "Enterprise AI System Design",
    topics: ["Requirements", "Reference architecture", "Failure analysis", "Rollout plan"],
    objectives: [
      "Present a defensible end-to-end architecture",
      "Explain trade-offs to non-AI stakeholders",
    ],
    tools: ["Architecture diagrams"],
  },
  {
    day: 31,
    module: "Capstone",
    title: "Capstone Ship & Review",
    topics: ["Demo", "Post-mortem", "Roadmap", "Handover"],
    objectives: [
      "Ship a working system and defend the decisions behind it",
      "Identify what you would change with more time",
    ],
    tools: ["Everything above"],
  },
];

export const curriculumByDay = new Map(curriculum.map((d) => [d.day, d]));

export function getDay(day: number): CurriculumDay {
  return curriculumByDay.get(day) ?? curriculum[0]!;
}
