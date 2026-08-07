import { createFileRoute } from "@tanstack/react-router";
import { startInterview, coverageLabels, InterviewError } from "@/lib/interview/engine";
import { startRequestSchema } from "@/lib/interview/schemas";

export const Route = createFileRoute("/api/interview/start")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON body" }, { status: 400 });
        }
        const parsed = startRequestSchema.safeParse(body);
        if (!parsed.success) {
          return Response.json(
            { error: parsed.error.issues[0]?.message ?? "Invalid request" },
            { status: 400 },
          );
        }
        try {
          const { state, openingMessage, question } = await startInterview(parsed.data.candidateId);
          return Response.json({
            interviewId: state.id,
            candidate: state.candidate,
            openingMessage,
            question,
            questionNumber: state.questionNumber,
            minimumQuestions: state.minimumQuestions,
            coveredCurriculumDays: coverageLabels(state),
            focusAreas: state.plan.focusAreas,
          });
        } catch (e) {
          const status = e instanceof InterviewError ? e.status : 500;
          return Response.json({ error: (e as Error).message }, { status });
        }
      },
    },
  },
});
