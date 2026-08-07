import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { candidatesById } from "@/data/candidates";
import { getDay } from "@/data/curriculum";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import type { InterviewFeedback } from "@/types/interview";
import { Loader2, RotateCcw, Send, X } from "lucide-react";

export const Route = createFileRoute("/interview/$candidateId")({
  head: () => ({
    meta: [
      { title: "Live interview — The Interview Agent" },
      {
        name: "description",
        content: "An adaptive AI technical interview personalized to the candidate's cohort journey.",
      },
      { property: "og:title", content: "Live interview — The Interview Agent" },
      {
        property: "og:description",
        content: "Adaptive AI technical interview with structured, evidence-based feedback.",
      },
    ],
  }),
  component: InterviewPage,
});

type Msg = { role: "interviewer" | "candidate"; text: string };
type Coverage = { day: number; title: string };

function InterviewPage() {
  const { candidateId } = Route.useParams();
  const navigate = useNavigate();
  const candidate = candidatesById.get(candidateId);

  const [phase, setPhase] = useState<"brief" | "live" | "report">("brief");
  const [interviewId, setInterviewId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [coverage, setCoverage] = useState<Coverage[]>([]);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [complete, setComplete] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  if (!candidate) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 text-center">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Candidate not found</h1>
          <Button asChild className="mt-4">
            <Link to="/">Back to candidates</Link>
          </Button>
        </div>
      </main>
    );
  }

  const start = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/interview/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidateId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not start the interview");
      setInterviewId(data.interviewId);
      setMessages([
        { role: "interviewer", text: data.openingMessage },
        { role: "interviewer", text: data.question },
      ]);
      setCoverage(data.coveredCurriculumDays);
      setQuestionNumber(data.questionNumber);
      setPhase("live");
      setTimeout(() => inputRef.current?.focus(), 50);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const send = async () => {
    const text = input.trim();
    if (!text || busy || !interviewId) return;
    setInput("");
    setMessages((m) => [...m, { role: "candidate", text }]);
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/interview/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interviewId, message: text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "The interviewer could not respond");
      const next: Msg[] = [];
      if (data.message) next.push({ role: "interviewer", text: data.message });
      if (data.question) next.push({ role: "interviewer", text: data.question });
      setMessages((m) => [...m, ...next]);
      setCoverage(data.coveredCurriculumDays);
      setQuestionNumber(data.questionNumber);
      setComplete(Boolean(data.isComplete));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const finish = async () => {
    if (!interviewId) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/interview/finish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interviewId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not generate the report");
      setFeedback(data.feedback);
      setPhase("report");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const restart = () => {
    setPhase("brief");
    setInterviewId(null);
    setMessages([]);
    setCoverage([]);
    setQuestionNumber(0);
    setComplete(false);
    setFeedback(null);
    setError(null);
  };

  if (phase === "brief") {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← All candidates
        </Link>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-foreground">
          Enterprise AI Engineering Interview
        </h1>
        <p className="mt-2 text-muted-foreground">
          Candidate: {candidate.name} · Estimated duration 15–25 minutes · 8–12 questions
        </p>
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-base">What to expect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              A conversational technical interview. One question at a time, and follow-up questions
              adapt to your answers — expect to be asked for examples, trade-offs and what breaks in
              production.
            </p>
            <div>
              <p className="mb-2 font-medium text-foreground">Topics that may come up</p>
              <div className="flex flex-wrap gap-1.5">
                {candidate.recommendedFocusDays.map((d) => (
                  <Badge key={d} variant="outline" className="font-normal">
                    Day {d} · {getDay(d).title}
                  </Badge>
                ))}
              </div>
            </div>
            <p>
              Style: senior interviewer, direct and curious. Answers are assessed only at the end —
              you will not be scored out loud.
            </p>
          </CardContent>
        </Card>
        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
        <div className="mt-8 flex gap-3">
          <Button onClick={start} disabled={busy} size="lg">
            {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Start interview
          </Button>
          <Button variant="outline" size="lg" onClick={() => navigate({ to: "/" })}>
            Exit
          </Button>
        </div>
      </main>
    );
  }

  if (phase === "report" && feedback) {
    return <Report feedback={feedback} onRestart={restart} />;
  }

  const progress = Math.min(100, (questionNumber / 8) * 100);

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-6">
      <header className="mb-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="font-semibold text-foreground">{candidate.name}</h1>
            <p className="text-xs text-muted-foreground">
              Question {questionNumber} · minimum 8
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={restart}>
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Restart
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/" })}>
              <X className="mr-1.5 h-3.5 w-3.5" /> Exit
            </Button>
          </div>
        </div>
        <Progress value={progress} className="mt-3" />
        <div className="mt-2 flex flex-wrap gap-1.5">
          {coverage.map((c) => (
            <Badge key={c.day} variant="secondary" className="text-xs font-normal">
              Day {c.day} · {c.title}
            </Badge>
          ))}
        </div>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto pb-4">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "candidate" ? "flex justify-end" : ""}>
            <div
              className={
                m.role === "candidate"
                  ? "max-w-[85%] rounded-lg bg-primary px-4 py-2.5 text-sm text-primary-foreground"
                  : "max-w-[90%] text-sm leading-relaxed text-foreground"
              }
            >
              {m.role === "interviewer" && (
                <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Interviewer
                </span>
              )}
              {m.text}
            </div>
          </div>
        ))}
        {busy && (
          <p className="animate-pulse text-sm text-muted-foreground">The interviewer is thinking…</p>
        )}
        <div ref={endRef} />
      </div>

      {error && <p className="mb-2 text-sm text-destructive">{error}</p>}

      {complete ? (
        <div className="rounded-lg border border-border p-4 text-center">
          <p className="text-sm text-muted-foreground">
            The interview is complete. Generate the feedback report when you're ready.
          </p>
          <Button className="mt-3" onClick={finish} disabled={busy}>
            {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Generate feedback report
          </Button>
        </div>
      ) : (
        <div className="sticky bottom-0 bg-background pt-2">
          <div className="flex gap-2">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send();
                }
              }}
              placeholder="Type your answer… (Enter to send, Shift+Enter for a new line)"
              className="min-h-[80px] resize-none"
              maxLength={4000}
              aria-label="Your answer"
            />
            <Button onClick={send} disabled={busy || !input.trim()} aria-label="Send answer">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          {questionNumber >= 8 && (
            <Button variant="link" size="sm" className="mt-1 px-0" onClick={finish} disabled={busy}>
              End early and generate report
            </Button>
          )}
        </div>
      )}
    </main>
  );
}

function Report({ feedback, onRestart }: { feedback: InterviewFeedback; onRestart: () => void }) {
  const copy = () => {
    void navigator.clipboard.writeText(
      `Overall: ${feedback.overallScore}/100 — ${feedback.readinessLevel}\n\n${feedback.overallAssessment}`,
    );
  };
  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">Interview feedback</h1>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <div className="rounded-lg border border-border px-6 py-4">
          <p className="text-3xl font-semibold text-foreground">{feedback.overallScore}</p>
          <p className="text-xs text-muted-foreground">overall / 100</p>
        </div>
        <Badge className="text-sm">{feedback.readinessLevel}</Badge>
      </div>
      <p className="mt-6 text-muted-foreground">{feedback.overallAssessment}</p>

      <Section title="Strengths">
        {feedback.strengths.map((s, i) => (
          <Item key={i} title={s.topic} body={s.evidence} />
        ))}
      </Section>

      <Section title="Knowledge gaps">
        {feedback.knowledgeGaps.map((g, i) => (
          <Item key={i} title={`${g.topic} · ${g.importance} priority`} body={`${g.gap} — ${g.evidence}`} />
        ))}
      </Section>

      <Section title="Topic breakdown">
        {feedback.topicBreakdown.map((t, i) => (
          <Item key={i} title={`${t.curriculumDay} — ${t.score}/100`} body={t.assessment} />
        ))}
      </Section>

      <Section title="Technical communication">
        <Item
          title={`${feedback.technicalCommunication.score}/100`}
          body={feedback.technicalCommunication.assessment}
        />
        <ul className="ml-4 list-disc text-sm text-muted-foreground">
          {feedback.technicalCommunication.recommendations.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </Section>

      <Section title="Engineering judgment">
        <Item
          title={`${feedback.engineeringJudgment.score}/100`}
          body={feedback.engineeringJudgment.assessment}
        />
        <ul className="ml-4 list-disc text-sm text-muted-foreground">
          {feedback.engineeringJudgment.recommendations.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </Section>

      <Section title="Recommended next steps">
        <ul className="ml-4 list-disc text-sm text-muted-foreground">
          {feedback.recommendedNextSteps.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </Section>

      <Section title="Stronger versions of your answers">
        {feedback.sampleImprovedAnswers.map((s, i) => (
          <Item key={i} title={s.question} body={s.improvement} />
        ))}
      </Section>

      <div className="mt-10 flex gap-3">
        <Button onClick={onRestart}>Run another interview</Button>
        <Button variant="outline" onClick={copy}>
          Copy summary
        </Button>
        <Button variant="ghost" asChild>
          <Link to="/">All candidates</Link>
        </Button>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="mb-3 text-lg font-semibold text-foreground">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Item({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
