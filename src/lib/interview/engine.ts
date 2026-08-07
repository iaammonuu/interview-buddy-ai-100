import type { Directive, InterviewState } from "@/types/interview";
import { candidatesById } from "@/data/candidates";
import { getDay } from "@/data/curriculum";
import {
  MAXIMUM_QUESTIONS,
  MINIMUM_QUESTIONS,
  nextDirective,
  planInterview,
} from "./controller";
import { buildFallbackFeedback, mockEvaluate, mockQuestion } from "./mock";
import { evaluatorPrompt, feedbackPrompt, interviewerPrompt } from "./prompts";
import { evaluationSchema, feedbackSchema, questionSchema } from "./schemas";
import { createGatewayClient, type LLMClient } from "./llm.server";
import { getInterview, saveInterview } from "./store";

export class InterviewError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}

function client(): LLMClient | null {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) return null;
  try {
    return createGatewayClient(key);
  } catch {
    return null;
  }
}

async function askQuestion(state: InterviewState, directive: Directive) {
  const llm = client();
  if (llm) {
    try {
      const { system, user } = interviewerPrompt(state, directive);
      const out = await llm.json({ system, user, schema: questionSchema });
      if (out.question.trim()) return out;
    } catch (e) {
      console.error("interviewer model failure, using fallback", e);
      state.usedMockFallback = true;
    }
  } else {
    state.usedMockFallback = true;
  }
  return mockQuestion(state, directive);
}

async function evaluateAnswer(state: InterviewState, directive: Directive, answer: string) {
  const llm = client();
  if (llm) {
    try {
      const { system, user } = evaluatorPrompt(state, directive, answer);
      return await llm.json({ system, user, schema: evaluationSchema });
    } catch (e) {
      console.error("evaluator model failure, using heuristics", e);
      state.usedMockFallback = true;
    }
  }
  return mockEvaluate(answer, directive);
}

function record(state: InterviewState, directive: Directive, question: string) {
  state.questionNumber += 1;
  state.turns.push({
    questionNumber: state.questionNumber,
    question,
    questionType: directive.questionType,
    curriculumDay: directive.curriculumDay,
    topic: directive.topic,
    action: directive.action,
  });
  if (!state.coveredCurriculumDays.includes(directive.curriculumDay)) {
    state.coveredCurriculumDays.push(directive.curriculumDay);
  }
  if (!state.topicsDiscussed.includes(directive.topic)) state.topicsDiscussed.push(directive.topic);
  state.difficulty = directive.difficulty;
  state.phase =
    state.questionNumber <= 1
      ? "warmup"
      : state.questionNumber < 5
        ? "core"
        : state.questionNumber < MINIMUM_QUESTIONS
          ? "depth"
          : "wrap-up";
}

export function coverageLabels(state: InterviewState) {
  return state.coveredCurriculumDays.map((d) => ({ day: d, title: getDay(d).title }));
}

export async function startInterview(candidateId: string) {
  const candidate = candidatesById.get(candidateId);
  if (!candidate) throw new InterviewError(`Unknown candidateId: ${candidateId}`, 404);

  const state: InterviewState = {
    id: `int_${crypto.randomUUID()}`,
    candidateId,
    candidate,
    plan: planInterview(candidate),
    questionNumber: 0,
    minimumQuestions: MINIMUM_QUESTIONS,
    maximumQuestions: MAXIMUM_QUESTIONS,
    coveredCurriculumDays: [],
    topicsDiscussed: [],
    turns: [],
    difficulty: "intermediate",
    phase: "warmup",
    isComplete: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    usedMockFallback: false,
  };

  const directive = nextDirective(state);
  const { message, question } = await askQuestion(state, directive);
  record(state, directive, question);
  saveInterview(state);

  return { state, openingMessage: message, question };
}

export async function submitMessage(interviewId: string, message: string) {
  const state = getInterview(interviewId);
  if (!state) throw new InterviewError(`Unknown or expired interviewId: ${interviewId}`, 404);
  if (state.isComplete) throw new InterviewError("This interview is already complete.", 409);

  const current = state.turns[state.turns.length - 1];
  if (!current) throw new InterviewError("Interview has no active question.", 409);

  const currentDirective: Directive = {
    action: current.action,
    curriculumDay: current.curriculumDay,
    topic: current.topic,
    questionType: current.questionType,
    difficulty: state.difficulty,
    guidance: "",
  };

  current.answer = message.slice(0, 4000);
  current.evaluation = await evaluateAnswer(state, currentDirective, current.answer);

  const directive = nextDirective(state);
  const next = await askQuestion(state, directive);

  if (directive.action === "finish") {
    state.isComplete = true;
    state.phase = "complete";
    saveInterview(state);
    return {
      state,
      message: next.message,
      question: "",
      isComplete: true,
    };
  }

  record(state, directive, next.question);
  saveInterview(state);
  return { state, message: next.message, question: next.question, isComplete: false };
}

export async function finishInterview(interviewId: string) {
  const state = getInterview(interviewId);
  if (!state) throw new InterviewError(`Unknown or expired interviewId: ${interviewId}`, 404);
  if (state.feedback) return state;

  const answered = state.turns.filter((t) => t.answer).length;
  if (answered === 0) throw new InterviewError("No answers recorded yet.", 409);

  state.isComplete = true;
  state.phase = "complete";

  const llm = client();
  if (llm) {
    try {
      const { system, user } = feedbackPrompt(state);
      state.feedback = await llm.json({ system, user, schema: feedbackSchema });
    } catch (e) {
      console.error("feedback model failure, using deterministic report", e);
      state.usedMockFallback = true;
    }
  }
  if (!state.feedback) state.feedback = buildFallbackFeedback(state);

  saveInterview(state);
  return state;
}

export { getInterview };
