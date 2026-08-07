import type {
  Candidate,
  ControllerAction,
  Difficulty,
  Directive,
  InterviewPlan,
  InterviewState,
  QuestionType,
} from "@/types/interview";
import { curriculum, getDay } from "@/data/curriculum";

export const MINIMUM_QUESTIONS = 8;
export const MAXIMUM_QUESTIONS = 12;
export const MINIMUM_DAYS = 4;

/**
 * Interview Planner — picks the curriculum days this candidate should be
 * pushed on, weighted toward re-attempted missions, skipped days and the
 * cohort's explicit focus recommendations.
 */
export function planInterview(candidate: Candidate): InterviewPlan {
  const scored = new Map<number, number>();

  const bump = (day: number, weight: number) => {
    if (!getDayExists(day)) return;
    scored.set(day, (scored.get(day) ?? 0) + weight);
  };

  candidate.recommendedFocusDays.forEach((day, i) => bump(day, 10 - i));
  candidate.completedMissions.forEach((m) => {
    // Struggled missions are the most informative to probe.
    bump(m.day, 2 + (m.attempts - 1) * 3 + (5 - m.selfRating) * 2);
  });
  // Skipped days matter, but we only touch a couple so the interview stays fair.
  candidate.skippedDays.slice(0, 3).forEach((day) => bump(day, 4));

  const ranked = [...scored.entries()]
    .sort((a, b) => b[1] - a[1] || a[0] - b[0])
    .map(([day]) => day);

  // Always open on something the candidate actually built.
  const anchor = [...candidate.completedMissions]
    .sort((a, b) => b.selfRating - a.selfRating)
    .map((m) => m.day)
    .find((day) => getDayExists(day));

  const focusDays: number[] = [];
  if (anchor !== undefined) focusDays.push(anchor);
  for (const day of ranked) {
    if (focusDays.length >= 6) break;
    if (!focusDays.includes(day)) focusDays.push(day);
  }
  // Guarantee we can always reach the coverage minimum.
  for (const d of curriculum) {
    if (focusDays.length >= 6) break;
    if (!focusDays.includes(d.day)) focusDays.push(d.day);
  }

  const modules = new Set(focusDays.map((d) => getDay(d).module));

  return {
    focusDays,
    focusAreas: [...modules],
    rationale: `Weighted toward re-attempted missions, ${candidate.skippedDays.length} skipped days and the cohort's recommended focus areas.`,
  };
}

function getDayExists(day: number) {
  return curriculum.some((d) => d.day === day);
}

const actionQuestionType: Record<ControllerAction, QuestionType> = {
  open: "reflection",
  "probe-deeper": "concept",
  "ask-example": "implementation",
  "implementation-detail": "implementation",
  "challenge-assumption": "debugging",
  "trade-offs": "trade-offs",
  "failure-modes": "failure-modes",
  "new-topic": "system-design",
  "ease-off": "concept",
  "raise-difficulty": "architecture",
  finish: "reflection",
};

const rotation: QuestionType[] = [
  "system-design",
  "production-readiness",
  "security-reliability",
  "cost-latency",
  "architecture",
  "debugging",
];

export function answerScore(state: InterviewState): number | null {
  const last = state.turns[state.turns.length - 1];
  if (!last?.evaluation) return null;
  const e = last.evaluation;
  return (
    (e.correctness + e.depth + e.practicalExperience + e.tradeoffAwareness + e.productionAwareness) /
    5
  );
}

function nextUncoveredDay(state: InterviewState): number {
  const fromPlan = state.plan.focusDays.find((d) => !state.coveredCurriculumDays.includes(d));
  if (fromPlan !== undefined) return fromPlan;
  const anyDay = curriculum.find((d) => !state.coveredCurriculumDays.includes(d.day));
  return anyDay?.day ?? state.plan.focusDays[0]!;
}

function pickTopic(day: number, used: string[]): string {
  const topics = getDay(day).topics;
  return topics.find((t) => !used.includes(t)) ?? topics[0]!;
}

/**
 * Interview Controller — decides the next move. Deterministic on purpose:
 * question-count, coverage and no-repeat guarantees cannot depend on a model.
 */
export function nextDirective(state: InterviewState): Directive {
  const asked = state.turns.length;
  const covered = state.coveredCurriculumDays.length;
  const score = answerScore(state);
  const last = state.turns[asked - 1];

  if (asked === 0) {
    const day = state.plan.focusDays[0]!;
    return directive("open", day, pickTopic(day, state.topicsDiscussed), "foundational", state);
  }

  const mustFinish = asked >= MAXIMUM_QUESTIONS;
  const canFinish = asked >= MINIMUM_QUESTIONS && covered >= MINIMUM_DAYS;
  if (mustFinish || (canFinish && (score ?? 0) >= 3)) {
    return directive("finish", last!.curriculumDay, last!.topic, state.difficulty, state);
  }

  const questionsLeft = MAXIMUM_QUESTIONS - asked;
  const daysStillNeeded = Math.max(0, MINIMUM_DAYS - covered);
  const followUpsOnDay = state.turns.filter((t) => t.curriculumDay === last!.curriculumDay).length;

  // Coverage guard: if we would run out of runway, move on regardless.
  if (daysStillNeeded >= questionsLeft || followUpsOnDay >= 3) {
    const day = nextUncoveredDay(state);
    return directive(
      "new-topic",
      day,
      pickTopic(day, state.topicsDiscussed),
      state.difficulty,
      state,
    );
  }

  const evalu = last!.evaluation;
  let action: ControllerAction = "new-topic";
  if (evalu?.needsClarification) action = "ask-example";
  else if ((score ?? 3) < 2) action = "ease-off";
  else if ((score ?? 3) < 3) action = "challenge-assumption";
  else if ((score ?? 3) < 3.6)
    action = evalu && evalu.practicalExperience < 3 ? "implementation-detail" : "probe-deeper";
  else if ((score ?? 3) >= 4.2 && followUpsOnDay < 3)
    action = followUpsOnDay === 1 ? "trade-offs" : "raise-difficulty";
  else if (evalu && evalu.productionAwareness < 3) action = "failure-modes";

  if (action === "new-topic") {
    const day = nextUncoveredDay(state);
    return directive(action, day, pickTopic(day, state.topicsDiscussed), nextDifficulty(state, score), state);
  }

  const day = last!.curriculumDay;
  const topic =
    action === "trade-offs" || action === "raise-difficulty" || action === "failure-modes"
      ? pickTopic(day, state.topicsDiscussed)
      : last!.topic;
  return directive(action, day, topic, nextDifficulty(state, score), state);
}

function nextDifficulty(state: InterviewState, score: number | null): Difficulty {
  const order: Difficulty[] = ["foundational", "intermediate", "advanced"];
  const i = order.indexOf(state.difficulty);
  if (score === null) return state.difficulty;
  if (score >= 4.2 && i < 2) return order[i + 1]!;
  if (score < 2.2 && i > 0) return order[i - 1]!;
  return state.difficulty;
}

function directive(
  action: ControllerAction,
  day: number,
  topic: string,
  difficulty: Difficulty,
  state: InterviewState,
): Directive {
  const base = actionQuestionType[action];
  const questionType: QuestionType =
    action === "new-topic" ? rotation[state.turns.length % rotation.length]! : base;

  const guidanceMap: Record<ControllerAction, string> = {
    open: "Warm, brief opener. Ask them to walk through a system they built in this area and the decisions behind it.",
    "probe-deeper": "Push one level deeper on the same topic. Ask for the mechanism, not the definition.",
    "ask-example": "Ask for a specific concrete example from something they actually built.",
    "implementation-detail": "Ask how they would actually implement or wire this up in code or infrastructure.",
    "challenge-assumption":
      "Politely surface a flawed or unexamined assumption in their last answer and ask them to reason it through.",
    "trade-offs": "Ask them to compare their approach with a credible alternative and name the trade-offs.",
    "failure-modes": "Ask what breaks first in production and how they would detect and contain it.",
    "new-topic": "Transition naturally to a new curriculum area, briefly acknowledging their last answer.",
    "ease-off": "Step back to fundamentals on this topic without signalling that they struggled.",
    "raise-difficulty": "Raise the bar: scale, ambiguity or competing constraints.",
    finish: "Close the interview warmly. Ask a short reflective question or thank them and wrap up.",
  };

  return {
    action,
    curriculumDay: day,
    topic,
    questionType,
    difficulty,
    guidance: guidanceMap[action],
  };
}
