import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import {
  finishInterview,
  getInterview,
  startInterview,
  submitMessage,
  InterviewError,
} from "@/lib/interview/engine";
import { candidates } from "@/data/candidates";
import { linkSession, resolveSession } from "@/lib/interview/sessions";

/**
 * Spec endpoint: POST /api/interview
 * Body: { sessionId, candidate? } to start, { sessionId, message } to continue.
 */
const bodySchema = z.object({
  sessionId: z.string().min(1, "sessionId is required"),
  message: z.string().max(4000).optional(),
  candidate: z.unknown().optional(),
});

function resolveCandidateId(candidate: unknown): string | undefined {
  if (!candidate || typeof candidate !== "object") return undefined;
  const c = candidate as Record<string, unknown>;
  const member = c["member"] as Record<string, unknown> | undefined;
  const id = (member?.["id"] ?? c["id"]) as string | undefined;
  if (id && candidates.some((x) => x.id === id)) return id;
  const name = (member?.["name"] ?? c["name"]) as string | undefined;
  return candidates.find((x) => x.name === name)?.id;
}

export const Route = createFileRoute("/api/interview")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let raw: unknown;
        try {
          raw = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON body" }, { status: 400 });
        }
        const parsed = bodySchema.safeParse(raw);
        if (!parsed.success) {
          return Response.json(
            { error: parsed.error.issues[0]?.message ?? "Invalid request" },
            { status: 400 },
          );
        }
        const { sessionId, message, candidate } = parsed.data;

        try {
          const existingId = resolveSession(sessionId);
          const existing = existingId ? getInterview(existingId) : undefined;

          // Start a new interview.
          if (!existing) {
            const candidateId = resolveCandidateId(candidate) ?? candidates[0]!.id;
            const { state, openingMessage, question } = await startInterview(candidateId);
            linkSession(sessionId, state.id);
            return Response.json({
              reply: [openingMessage, question].filter(Boolean).join("\n\n"),
              done: false,
            });
          }

          if (!message?.trim()) {
            return Response.json(
              { error: "message is required for an ongoing session" },
              { status: 400 },
            );
          }

          const turn = await submitMessage(existing.id, message.trim());
          if (!turn.isComplete) {
            return Response.json({
              reply: [turn.message, turn.question].filter(Boolean).join("\n\n"),
              done: false,
            });
          }

          const final = await finishInterview(existing.id);
          const f = final.feedback!;
          return Response.json({
            reply: turn.message || "Interview completed.",
            done: true,
            feedback: {
              summary: f.overallAssessment,
              strengths: f.strengths.map((s) => `${s.topic}: ${s.evidence}`),
              gaps: f.knowledgeGaps.map((g) => `${g.topic} (${g.importance}): ${g.gap}`),
              next: f.recommendedNextSteps,
            },
          });
        } catch (e) {
          const status = e instanceof InterviewError ? e.status : 500;
          return Response.json({ error: (e as Error).message }, { status });
        }
      },
    },
  },
});
