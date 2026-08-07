import { z } from "zod";

export const evaluationSchema = z.object({
  correctness: z.number(),
  depth: z.number(),
  clarity: z.number(),
  practicalExperience: z.number(),
  tradeoffAwareness: z.number(),
  productionAwareness: z.number(),
  confidence: z.number(),
  missingConcepts: z.array(z.string()),
  evidence: z.string(),
  summary: z.string(),
  needsClarification: z.boolean(),
});

export const questionSchema = z.object({
  message: z.string(),
  question: z.string(),
});

export const feedbackSchema = z.object({
  overallAssessment: z.string(),
  overallScore: z.number(),
  readinessLevel: z.enum(["Not Ready", "Developing", "Interview Ready", "Strong"]),
  strengths: z.array(z.object({ topic: z.string(), evidence: z.string() })),
  knowledgeGaps: z.array(
    z.object({
      topic: z.string(),
      gap: z.string(),
      evidence: z.string(),
      importance: z.enum(["Low", "Medium", "High"]),
    }),
  ),
  technicalCommunication: z.object({
    score: z.number(),
    assessment: z.string(),
    recommendations: z.array(z.string()),
  }),
  engineeringJudgment: z.object({
    score: z.number(),
    assessment: z.string(),
    recommendations: z.array(z.string()),
  }),
  topicBreakdown: z.array(
    z.object({
      curriculumDay: z.string(),
      topic: z.string(),
      score: z.number(),
      assessment: z.string(),
    }),
  ),
  recommendedNextSteps: z.array(z.string()),
  sampleImprovedAnswers: z.array(z.object({ question: z.string(), improvement: z.string() })),
});

/** API request schemas */
export const startRequestSchema = z.object({
  candidateId: z.string().min(1, "candidateId is required"),
});

export const messageRequestSchema = z.object({
  interviewId: z.string().min(1, "interviewId is required"),
  message: z
    .string()
    .trim()
    .min(1, "message cannot be empty")
    .max(4000, "message must be 4000 characters or fewer"),
});

export const finishRequestSchema = z.object({
  interviewId: z.string().min(1, "interviewId is required"),
});
