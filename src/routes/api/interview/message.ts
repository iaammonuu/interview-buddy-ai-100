import { createFileRoute } from "@tanstack/react-router";
import { submitMessage, coverageLabels, InterviewError } from "@/lib/interview/engine";
import { messageRequestSchema } from "@/lib/interview/schemas";

export const Route = createFileRoute("/api/interview/message")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON body" }, { status: 400 });
        }
        const parsed = messageRequestSchema.safeParse(body);
        if (!parsed.success) {
          return Response.json(
            { error: parsed.error.issues[0]?.message ?? "Invalid request" },
            { status: 400 },
          );
        }
        try {
          const { state, message, question, isComplete } = await submitMessage(
            parsed.data.interviewId,
            parsed.data.message,
          );
          return Response.json({
            interviewId: state.id,
            message,
            question,
            questionNumber: state.questionNumber,
            minimumQuestions: state.minimumQuestions,
            isComplete,
            coveredCurriculumDays: coverageLabels(state),
          });
        } catch (e) {
          const status = e instanceof InterviewError ? e.status : 500;
          return Response.json({ error: (e as Error).message }, { status });
        }
      },
    },
  },
});
