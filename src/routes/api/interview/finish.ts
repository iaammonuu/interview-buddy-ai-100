import { createFileRoute } from "@tanstack/react-router";
import { finishInterview, InterviewError } from "@/lib/interview/engine";
import { finishRequestSchema } from "@/lib/interview/schemas";

export const Route = createFileRoute("/api/interview/finish")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON body" }, { status: 400 });
        }
        const parsed = finishRequestSchema.safeParse(body);
        if (!parsed.success) {
          return Response.json(
            { error: parsed.error.issues[0]?.message ?? "Invalid request" },
            { status: 400 },
          );
        }
        try {
          const state = await finishInterview(parsed.data.interviewId);
          return Response.json({
            interviewId: state.id,
            isComplete: true,
            questionsAsked: state.turns.filter((t) => t.answer).length,
            coveredCurriculumDays: state.coveredCurriculumDays,
            feedback: state.feedback,
          });
        } catch (e) {
          const status = e instanceof InterviewError ? e.status : 500;
          return Response.json({ error: (e as Error).message }, { status });
        }
      },
    },
  },
});
