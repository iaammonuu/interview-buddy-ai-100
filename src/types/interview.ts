export interface CurriculumDay {
  day: number;
  module: string;
  title: string;
  type?: string;
  topics: string[];
  objectives: string[];
  tools: string[];
}

export interface CompletedMission {
  day: number;
  title: string;
  attempts: number;
  selfRating: number; // 1-5, derived from attempts
}

export interface Candidate {
  id: string;
  name: string;
  headline: string;
  background: string;
  jobRole?: string;
  yearsExperience?: number;
  education?: string;
  status?: string;
  progressPercent: number;
  completedMissions: CompletedMission[];
  skippedDays: number[];
  learningSignals: string[];
  recommendedFocusDays: number[];
}


export type QuestionType =
  | "concept"
  | "system-design"
  | "debugging"
  | "trade-offs"
  | "architecture"
  | "failure-modes"
  | "production-readiness"
  | "security-reliability"
  | "cost-latency"
  | "reflection"
  | "implementation";

export type ControllerAction =
  | "open"
  | "probe-deeper"
  | "ask-example"
  | "implementation-detail"
  | "challenge-assumption"
  | "trade-offs"
  | "failure-modes"
  | "new-topic"
  | "ease-off"
  | "raise-difficulty"
  | "finish";

export type Difficulty = "foundational" | "intermediate" | "advanced";

export interface AnswerEvaluation {
  correctness: number;
  depth: number;
  clarity: number;
  practicalExperience: number;
  tradeoffAwareness: number;
  productionAwareness: number;
  confidence: number;
  missingConcepts: string[];
  evidence: string;
  summary: string;
  needsClarification: boolean;
}

export interface InterviewTurn {
  questionNumber: number;
  question: string;
  questionType: QuestionType;
  curriculumDay: number;
  topic: string;
  action: ControllerAction;
  answer?: string;
  evaluation?: AnswerEvaluation;
}

export interface Directive {
  action: ControllerAction;
  curriculumDay: number;
  topic: string;
  questionType: QuestionType;
  difficulty: Difficulty;
  guidance: string;
}

export interface InterviewPlan {
  focusDays: number[];
  rationale: string;
  focusAreas: string[];
}

export interface InterviewState {
  id: string;
  candidateId: string;
  candidate: Candidate;
  plan: InterviewPlan;
  questionNumber: number;
  minimumQuestions: number;
  maximumQuestions: number;
  coveredCurriculumDays: number[];
  topicsDiscussed: string[];
  turns: InterviewTurn[];
  difficulty: Difficulty;
  phase: "warmup" | "core" | "depth" | "wrap-up" | "complete";
  isComplete: boolean;
  createdAt: number;
  updatedAt: number;
  feedback?: InterviewFeedback;
  usedMockFallback: boolean;
}

export interface InterviewFeedback {
  overallAssessment: string;
  overallScore: number;
  readinessLevel: "Not Ready" | "Developing" | "Interview Ready" | "Strong";
  strengths: { topic: string; evidence: string }[];
  knowledgeGaps: {
    topic: string;
    gap: string;
    evidence: string;
    importance: "Low" | "Medium" | "High";
  }[];
  technicalCommunication: { score: number; assessment: string; recommendations: string[] };
  engineeringJudgment: { score: number; assessment: string; recommendations: string[] };
  topicBreakdown: {
    curriculumDay: string;
    topic: string;
    score: number;
    assessment: string;
  }[];
  recommendedNextSteps: string[];
  sampleImprovedAnswers: { question: string; improvement: string }[];
}
