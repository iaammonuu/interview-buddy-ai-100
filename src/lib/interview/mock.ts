import type {
  AnswerEvaluation,
  Directive,
  InterviewFeedback,
  InterviewState,
} from "@/types/interview";
import { getDay } from "@/data/curriculum";

/**
 * Deterministic-but-branching interview engine used when no model is
 * available (or the gateway fails). It is NOT a scripted transcript: every
 * question is derived from the controller directive, the candidate profile
 * and the curriculum, and every evaluation is derived from signals in the
 * actual answer text.
 */

const PRODUCTION_TERMS = [
  "latency", "p95", "cost", "monitor", "observab", "trace", "alert", "retry", "timeout",
  "rate limit", "fallback", "cache", "scale", "incident", "rollout", "slo", "on-call",
];
const TRADEOFF_TERMS = [
  "trade-off", "tradeoff", "versus", " vs ", "instead of", "compared", "downside", "cheaper",
  "slower", "faster", "but ", "however", "depends",
];
const PRACTICE_TERMS = [
  "i built", "we built", "i implemented", "we shipped", "in my", "our system", "i used",
  "we used", "when i", "we had", "production", "capstone",
];
const HEDGES = ["i think", "maybe", "not sure", "i guess", "probably", "i don't know", "no idea"];

function count(hay: string, needles: string[]) {
  return needles.reduce((n, t) => (hay.includes(t) ? n + 1 : n), 0);
}

const clamp = (n: number) => Math.max(0, Math.min(5, Math.round(n * 10) / 10));

export function mockEvaluate(answer: string, directive: Directive): AnswerEvaluation {
  const text = answer.toLowerCase();
  const words = text.split(/\s+/).filter(Boolean).length;
  const day = getDay(directive.curriculumDay);
  const topicTerms = [directive.topic, ...day.topics, ...day.tools]
    .join(" ")
    .toLowerCase()
    .split(/[^a-z0-9+]+/)
    .filter((w) => w.length > 3);
  const onTopic = count(text, [...new Set(topicTerms)]);

  const lengthScore = Math.min(5, words / 28);
  const relevance = Math.min(5, onTopic * 0.9);
  const production = Math.min(5, count(text, PRODUCTION_TERMS) * 1.3);
  const tradeoffs = Math.min(5, count(text, TRADEOFF_TERMS) * 1.2);
  const practical = Math.min(5, count(text, PRACTICE_TERMS) * 1.6);
  const hedging = count(text, HEDGES);
  const structured = /[.;]/.test(answer) && words > 20;

  const correctness = clamp((relevance * 0.7 + lengthScore * 0.5) - hedging * 0.6);
  const depth = clamp(lengthScore * 0.8 + relevance * 0.3 - hedging * 0.4);
  const clarity = clamp(structured ? 3.4 + Math.min(1.4, words / 120) - hedging * 0.4 : 2.1);
  const confidence = clamp(4 - hedging * 1.1 + (practical > 2 ? 0.6 : 0));

  const missing: string[] = [];
  if (production < 2) missing.push("production operations for " + directive.topic);
  if (tradeoffs < 2) missing.push("explicit trade-off comparison");
  if (practical < 2) missing.push("concrete implementation experience");

  const evidence = answer.trim().slice(0, 220);

  return {
    correctness,
    depth,
    clarity,
    practicalExperience: clamp(practical),
    tradeoffAwareness: clamp(tradeoffs),
    productionAwareness: clamp(production),
    confidence,
    missingConcepts: missing,
    evidence,
    summary:
      words < 12
        ? "Very short answer with little supporting reasoning."
        : `Covers ${directive.topic} at ${correctness >= 3.5 ? "a solid" : "a surface"} level; ${
            tradeoffs >= 2 ? "names trade-offs" : "no trade-offs named"
          }.`,
    needsClarification: words < 10,
  };
}

export function mockQuestion(state: InterviewState, directive: Directive) {
  const day = getDay(directive.curriculumDay);
  const topic = directive.topic;
  const last = state.turns[state.turns.length - 1];
  const name = state.candidate.name.split(" ")[0];
  const skipped = state.candidate.skippedDays.includes(day.day);

  const ack = last?.answer
    ? pick(state, [
        "Thanks — that gives me a good picture.",
        "Got it.",
        "That's helpful context.",
        "Understood.",
      ])
    : "";

  switch (directive.action) {
    case "open": {
      const mission = state.candidate.completedMissions.find((m) => m.day === day.day);
      return {
        message: `Hi ${name} — thanks for making the time. This will be a conversational technical interview, roughly 20 minutes, and I'll follow your answers wherever they get interesting. There are no trick questions.`,
        question: mission
          ? `Let's start with ${mission.title}. Walk me through what you actually built for that mission and the two decisions you're least sure were right.`
          : `Let's start with ${day.title.toLowerCase()}. Walk me through a system you built that touches ${topic}, and why you designed it that way.`,
      };
    }
    case "ask-example":
      return {
        message: ack,
        question: `Can you give me a specific example from something you built where ${topic} actually mattered? Walk me through what you did.`,
      };
    case "probe-deeper":
      return {
        message: ack,
        question: `Go one level deeper for me: mechanically, how does ${topic} work in that system — what happens step by step when a request comes in?`,
      };
    case "implementation-detail":
      return {
        message: ack,
        question: `If you had to implement ${topic} tomorrow, what would the pieces be — storage, libraries, the actual call path — and where would you expect to spend the most time?`,
      };
    case "challenge-assumption":
      return {
        message: ack,
        question: `Let's examine one assumption there. ${challenge(topic, day.title)}`,
      };
    case "trade-offs":
      return {
        message: ack,
        question: `Compare that approach with a credible alternative for ${topic}. What do you gain, what do you give up, and when would you pick the other one?`,
      };
    case "failure-modes":
      return {
        message: ack,
        question: `Now put that system in production for a year. What breaks first around ${topic}, how would you detect it, and what's the containment plan?`,
      };
    case "ease-off":
      return {
        message: ack,
        question: `Let's take a step back. In your own words, what problem does ${topic} solve, and what would you lose if you removed it?`,
      };
    case "raise-difficulty":
      return {
        message: ack,
        question: `Scale it up: the same system now serves 50x traffic across three regions with a hard p95 budget. How does your handling of ${topic} change?`,
      };
    case "finish":
      return {
        message: "That's everything I wanted to cover — thank you, this was a good conversation.",
        question: `Last one: looking back at everything you built in the cohort, what would you change if you rebuilt it next month?`,
      };
    case "new-topic":
    default:
      return {
        message: ack,
        question: skipped
          ? `Let's move to something you may not have gone deep on: ${day.title.toLowerCase()}. Reasoning from first principles, how would you approach ${topic} in an enterprise system?`
          : `Let's switch areas. On ${day.title.toLowerCase()} — ${byType(directive, topic)}`,
      };
  }
}

function byType(directive: Directive, topic: string) {
  switch (directive.questionType) {
    case "system-design":
      return `design me the shape of a system that depends on ${topic}. What are the components and where does state live?`;
    case "production-readiness":
      return `what would you need in place around ${topic} before you'd let real customer traffic hit it?`;
    case "security-reliability":
      return `where is ${topic} most exposed from a security or reliability angle, and how do you close that?`;
    case "cost-latency":
      return `where does ${topic} cost you money or milliseconds, and what's the first optimization you'd make?`;
    case "architecture":
      return `what architectural decision around ${topic} would be hardest to reverse later, and how would you de-risk it?`;
    case "debugging":
      return `a user reports consistently wrong output and you suspect ${topic}. How do you isolate it?`;
    default:
      return `how would you reason about ${topic} in a real deployment?`;
  }
}

function challenge(topic: string, title: string) {
  const options = [
    `What happens if the data feeding ${topic} is stale or simply wrong — does your design still hold?`,
    `Suppose the simplest possible version of ${title.toLowerCase()} outperforms your approach in an eval. How would you find out, and what would you do?`,
    `A colleague argues ${topic} is unnecessary complexity here. What's your strongest counter-argument, and what would change your mind?`,
  ];
  return options[Math.floor(Math.random() * options.length)]!;
}

function pick(state: InterviewState, options: string[]) {
  return options[state.turns.length % options.length]!;
}

/** Feedback Generator fallback — grounded in the recorded evaluations. */
export function buildFallbackFeedback(state: InterviewState): InterviewFeedback {
  const answered = state.turns.filter((t) => t.evaluation && t.answer);
  const avg = (fn: (t: (typeof answered)[number]) => number) =>
    answered.length ? answered.reduce((s, t) => s + fn(t), 0) / answered.length : 0;

  const correctness = avg((t) => t.evaluation!.correctness);
  const depth = avg((t) => t.evaluation!.depth);
  const clarity = avg((t) => t.evaluation!.clarity);
  const tradeoffs = avg((t) => t.evaluation!.tradeoffAwareness);
  const production = avg((t) => t.evaluation!.productionAwareness);

  const overall = Math.round(
    ((correctness * 0.3 + depth * 0.2 + tradeoffs * 0.2 + production * 0.15 + clarity * 0.15) / 5) *
      100,
  );

  const readiness: InterviewFeedback["readinessLevel"] =
    overall >= 80 ? "Strong" : overall >= 65 ? "Interview Ready" : overall >= 45 ? "Developing" : "Not Ready";

  const ranked = [...answered].sort(
    (a, b) =>
      b.evaluation!.correctness + b.evaluation!.depth - (a.evaluation!.correctness + a.evaluation!.depth),
  );

  const strengths = ranked.slice(0, 3).map((t) => ({
    topic: `Day ${t.curriculumDay} — ${t.topic}`,
    evidence: `On "${truncate(t.question, 70)}" you said: "${truncate(t.evaluation!.evidence, 160)}"`,
  }));

  const gaps = ranked
    .slice(-3)
    .reverse()
    .map((t) => ({
      topic: `Day ${t.curriculumDay} — ${t.topic}`,
      gap:
        t.evaluation!.missingConcepts[0] ??
        `The answer stayed at a descriptive level rather than reaching a decision and its consequences.`,
      evidence: `"${truncate(t.evaluation!.evidence, 160)}"`,
      importance: (t.evaluation!.correctness < 2.5 ? "High" : t.evaluation!.correctness < 3.5 ? "Medium" : "Low") as
        | "Low"
        | "Medium"
        | "High",
    }));

  const byDay = new Map<number, typeof answered>();
  answered.forEach((t) => byDay.set(t.curriculumDay, [...(byDay.get(t.curriculumDay) ?? []), t]));

  return {
    overallAssessment: `${state.candidate.name} answered ${answered.length} questions across ${byDay.size} curriculum days. Strongest around ${
      strengths[0]?.topic ?? "the opening topic"
    }; weakest around ${gaps[0]?.topic ?? "the later topics"}. ${
      production < 2.5
        ? "Production reasoning was the most consistent gap — answers described how things work more often than how they behave under load or failure."
        : "Production reasoning held up across topics, with concrete operational detail in most answers."
    }`,
    overallScore: overall,
    readinessLevel: readiness,
    strengths,
    knowledgeGaps: gaps,
    technicalCommunication: {
      score: Math.round((clarity / 5) * 100),
      assessment:
        clarity >= 3.5
          ? "Explanations were structured and easy to follow, with the conclusion usually stated before the detail."
          : "Answers often started in the detail and left the interviewer to assemble the point. Leading with a one-sentence answer would help.",
      recommendations: [
        "Open each answer with a one-sentence conclusion, then support it.",
        "Name the decision you made and the option you rejected.",
        "Practise a 90-second version of your capstone architecture out loud.",
      ],
    },
    engineeringJudgment: {
      score: Math.round(((tradeoffs + production) / 10) * 100),
      assessment:
        tradeoffs >= 3
          ? "Comfortable weighing alternatives and naming what each costs."
          : "Tended to present one approach as the approach. Interviewers look for the alternative you considered and discarded.",
      recommendations: [
        "For every design choice, be ready with the alternative and why you rejected it.",
        "Attach numbers — latency budgets, cost per request, recall targets — to your claims.",
        "Rehearse a failure story: what broke, how you found it, what you changed.",
      ],
    },
    topicBreakdown: [...byDay.entries()].map(([day, turns]) => {
      const s = Math.round(
        (turns.reduce(
          (n, t) => n + (t.evaluation!.correctness + t.evaluation!.depth + t.evaluation!.productionAwareness) / 3,
          0,
        ) /
          turns.length /
          5) *
          100,
      );
      return {
        curriculumDay: `Day ${day} — ${getDay(day).title}`,
        topic: turns[0]!.topic,
        score: s,
        assessment:
          s >= 70
            ? `Confident coverage across ${turns.length} question${turns.length > 1 ? "s" : ""}, with specifics rather than definitions.`
            : `Answers here stayed general. Revisit ${getDay(day).objectives[0]?.toLowerCase() ?? "the objectives for this day"}.`,
      };
    }),
    recommendedNextSteps: [
      ...gaps.slice(0, 2).map((g) => `Rebuild a small project focused on ${g.topic}, then write up the trade-offs you hit.`),
      state.candidate.skippedDays.length
        ? `Complete the skipped missions on days ${state.candidate.skippedDays.slice(0, 3).join(", ")}.`
        : "Deepen the modules where you scored lowest above.",
      "Run a mock interview where every answer must include one number and one trade-off.",
    ],
    sampleImprovedAnswers: ranked.slice(-2).map((t) => ({
      question: t.question,
      improvement: `Lead with the decision ("I used X because Y"), then give one concrete detail from your implementation, then name the alternative you rejected and its cost. Concretely for ${t.topic}: state the mechanism, the metric you watched, and the failure mode you guarded against.`,
    })),
  };
}

function truncate(s: string, n: number) {
  return s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s;
}
