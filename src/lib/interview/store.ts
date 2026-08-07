import type { InterviewState } from "@/types/interview";

const TTL_MS = 1000 * 60 * 60 * 3;

type Store = Map<string, InterviewState>;
const globalRef = globalThis as unknown as { __interviewStore?: Store };
const store: Store = (globalRef.__interviewStore ??= new Map());

export function saveInterview(state: InterviewState) {
  state.updatedAt = Date.now();
  store.set(state.id, state);
  sweep();
}

export function getInterview(id: string): InterviewState | undefined {
  const s = store.get(id);
  if (!s) return undefined;
  if (Date.now() - s.updatedAt > TTL_MS) {
    store.delete(id);
    return undefined;
  }
  return s;
}

function sweep() {
  const now = Date.now();
  for (const [id, s] of store) if (now - s.updatedAt > TTL_MS) store.delete(id);
}
