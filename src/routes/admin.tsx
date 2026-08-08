import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { candidates } from "@/data/candidates";
import { getDay } from "@/data/curriculum";
import type { InterviewFeedback } from "@/types/interview";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefreshCw, Search, FileText, PlayCircle } from "lucide-react";

interface SessionRow {
  interviewId: string;
  candidateId: string;
  candidateName: string;
  questionsAsked: number;
  answered: number;
  minimumQuestions: number;
  coveredCurriculumDays: number[];
  topicsDiscussed: string[];
  phase: string;
  isComplete: boolean;
  usedMockFallback: boolean;
  createdAt: number;
  updatedAt: number;
  feedback: InterviewFeedback | null;
}

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin console — The Interview Agent" },
      {
        name: "description",
        content:
          "Browse cohort candidate profiles, launch mock technical interviews and inspect generated feedback reports in one console.",
      },
      { property: "og:title", content: "Admin console — The Interview Agent" },
      {
        property: "og:description",
        content: "Candidate profiles, mock interview launcher and generated feedback summaries.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [query, setQuery] = useState("");
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<SessionRow | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/interview/list");
      const json = (await res.json()) as { sessions: SessionRow[] };
      setSessions(json.sessions ?? []);
      setError(null);
    } catch {
      setError("Could not load interview sessions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function generateReport(row: SessionRow) {
    setBusy(row.interviewId);
    try {
      const res = await fetch("/api/interview/finish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interviewId: row.interviewId }),
      });
      const json = (await res.json()) as { feedback?: InterviewFeedback; error?: string };
      if (json.feedback) {
        setOpen({ ...row, feedback: json.feedback, isComplete: true });
        await load();
      } else {
        setError(json.error ?? "Could not generate a report for this session.");
      }
    } catch {
      setError("Could not generate a report for this session.");
    } finally {
      setBusy(null);
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return candidates;
    return candidates.filter((c) =>
      [c.name, c.id, c.jobRole ?? "", c.status ?? "", c.headline].join(" ").toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Badge variant="secondary" className="mb-3">
              Admin console
            </Badge>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Cohort operations
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Browse candidate profiles, launch mock interviews and inspect the feedback reports the
              agent generated.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/">Back to home</Link>
          </Button>
        </div>

        {error ? (
          <p className="mt-6 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-foreground">
            {error}
          </p>
        ) : null}

        <Tabs defaultValue="candidates" className="mt-10">
          <TabsList>
            <TabsTrigger value="candidates">Candidates ({candidates.length})</TabsTrigger>
            <TabsTrigger value="sessions">Sessions ({sessions.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="candidates" className="mt-6">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, role or status"
                className="pl-9"
                aria-label="Search candidates"
              />
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {filtered.map((c) => (
                <Card key={c.id} className="flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <CardTitle className="text-base">{c.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {c.id} · {c.jobRole ?? "—"}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs font-normal">
                        {c.status ?? "ACTIVE"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col gap-4">
                    <div>
                      <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                        <span>Cohort progress</span>
                        <span>{c.progressPercent}%</span>
                      </div>
                      <Progress value={c.progressPercent} />
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <Stat label="Missions" value={c.completedMissions.length} />
                      <Stat label="Skipped" value={c.skippedDays.length} />
                      <Stat label="Focus days" value={c.recommendedFocusDays.length} />
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {c.recommendedFocusDays.slice(0, 3).map((d) => (
                        <Badge key={d} variant="secondary" className="text-xs font-normal">
                          Day {d} · {getDay(d).title}
                        </Badge>
                      ))}
                    </div>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      {c.learningSignals.slice(0, 2).map((s) => (
                        <li key={s}>• {s}</li>
                      ))}
                    </ul>
                    <Button asChild className="mt-auto w-full">
                      <Link to="/interview/$candidateId" params={{ candidateId: c.id }}>
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Start mock interview
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
              {filtered.length === 0 ? (
                <p className="text-sm text-muted-foreground">No candidates match "{query}".</p>
              ) : null}
            </div>
          </TabsContent>

          <TabsContent value="sessions" className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Sessions are held in memory for 3 hours.
              </p>
              <Button variant="outline" size="sm" onClick={() => void load()} disabled={loading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>

            <div className="rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Phase</TableHead>
                    <TableHead>Answered</TableHead>
                    <TableHead>Days covered</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Report</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map((s) => (
                    <TableRow key={s.interviewId}>
                      <TableCell>
                        <span className="font-medium text-foreground">{s.candidateName}</span>
                        <span className="block text-xs text-muted-foreground">{s.candidateId}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={s.isComplete ? "default" : "outline"}>{s.phase}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {s.answered}/{s.minimumQuestions}
                      </TableCell>
                      <TableCell className="text-sm">
                        {s.coveredCurriculumDays.join(", ") || "—"}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(s.updatedAt).toLocaleTimeString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {s.feedback ? (
                          <Button size="sm" variant="secondary" onClick={() => setOpen(s)}>
                            <FileText className="mr-2 h-4 w-4" />
                            Inspect
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={s.answered === 0 || busy === s.interviewId}
                            onClick={() => void generateReport(s)}
                          >
                            {busy === s.interviewId ? "Generating…" : "Generate"}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {sessions.length === 0 && !loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                        No interview sessions yet. Start one from the Candidates tab.
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Feedback report — {open?.candidateName}</DialogTitle>
            <DialogDescription>
              Generated from {open?.answered ?? 0} answered questions across days{" "}
              {open?.coveredCurriculumDays.join(", ") || "—"}.
            </DialogDescription>
          </DialogHeader>
          {open?.feedback ? <FeedbackView f={open.feedback} /> : null}
        </DialogContent>
      </Dialog>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-border py-2">
      <div className="text-sm font-medium text-foreground">{value}</div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}

function FeedbackView({ f }: { f: InterviewFeedback }) {
  return (
    <div className="space-y-6 text-sm">
      <div className="flex flex-wrap items-center gap-3">
        <Badge>{f.readinessLevel}</Badge>
        <span className="text-muted-foreground">Overall score: {f.overallScore}/10</span>
      </div>
      <p className="text-muted-foreground">{f.overallAssessment}</p>

      <Separator />
      <Section title="Strengths">
        {f.strengths.map((s, i) => (
          <li key={i}>
            <span className="font-medium text-foreground">{s.topic}</span> — {s.evidence}
          </li>
        ))}
      </Section>
      <Section title="Knowledge gaps">
        {f.knowledgeGaps.map((g, i) => (
          <li key={i}>
            <span className="font-medium text-foreground">{g.topic}</span> ({g.importance}) — {g.gap}
          </li>
        ))}
      </Section>
      <Section title="Topic breakdown">
        {f.topicBreakdown.map((t, i) => (
          <li key={i}>
            <span className="font-medium text-foreground">
              {t.curriculumDay} · {t.topic} — {t.score}/10
            </span>{" "}
            {t.assessment}
          </li>
        ))}
      </Section>
      <Section title="Recommended next steps">
        {f.recommendedNextSteps.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 font-medium text-foreground">{title}</h3>
      <ul className="space-y-1.5 text-muted-foreground">{children}</ul>
    </div>
  );
}
