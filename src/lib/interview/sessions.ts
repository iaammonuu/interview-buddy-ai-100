/** Maps the spec's external `sessionId` to our internal interview id. */
type SessionMap = Map<string, string>;
const globalRef = globalThis as unknown as { __interviewSessions?: SessionMap };
const sessions: SessionMap = (globalRef.__interviewSessions ??= new Map());

export function linkSession(sessionId: string, interviewId: string) {
  sessions.set(sessionId, interviewId);
}

export function resolveSession(sessionId: string): string | undefined {
  return sessions.get(sessionId);
}
