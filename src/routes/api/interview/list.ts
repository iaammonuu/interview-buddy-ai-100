import { createFileRoute } from "@tanstack/react-router";
import { listInterviews } from "@/lib/interview/store";

export const Route = createFileRoute("/api/interview/list")({
  server: {
    handlers: {
      GET: async () => {
        const sessions = listInterviews().map((s) => ({
          interviewId: s.id,
          candidateId: s.candidateId,
          candidateName: s.candidate.name,
          questionsAsked: s.questionNumber,
          answered: s.turns.filter((t) => t.answer).length,
          minimumQuestions: s.minimumQuestions,
          coveredCurriculumDays: s.coveredCurriculumDays,
          topicsDiscussed: s.topicsDiscussed,
          phase: s.phase,
          isComplete: s.isComplete,
          usedMockFallback: s.usedMockFallback,
          createdAt: s.createdAt,
          updatedAt: s.updatedAt,
          feedback: s.feedback ?? null,
        }));
        return Response.json({ count: sessions.length, sessions });
      },
    },
  },
});
