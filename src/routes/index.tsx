import { createFileRoute, Link } from "@tanstack/react-router";
import { candidates } from "@/data/candidates";
import { getDay } from "@/data/curriculum";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, MessagesSquare, Target, ClipboardCheck } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Interview Agent — Personalized AI technical interviews" },
      {
        name: "description",
        content:
          "An AI interviewer that runs adaptive, personalized technical interviews for enterprise AI engineering graduates and returns evidence-based feedback.",
      },
      { property: "og:title", content: "The Interview Agent" },
      {
        property: "og:description",
        content: "Build the interviewer, not the interview. Adaptive AI technical interviews with structured feedback.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-5xl px-6 pt-20 pb-14">
        <Badge variant="secondary" className="mb-6">
          Enterprise AI Engineering · 31-day cohort
        </Badge>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
          The Interview Agent
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Build the interviewer, not the interview. A senior-level AI interviewer that reads each
          learner's actual journey — missions completed, missions re-attempted, days skipped — and
          conducts a real, adaptive technical conversation.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button size="lg" asChild>
            <a href="#candidates">
              Start an interview <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          <Feature
            icon={<Target className="h-5 w-5" />}
            title="Personalized plan"
            body="Questions are weighted toward re-attempted missions, skipped days and recommended focus areas — never a fixed script."
          />
          <Feature
            icon={<MessagesSquare className="h-5 w-5" />}
            title="Adaptive follow-ups"
            body="Every answer is assessed internally, then the interviewer probes, challenges, raises difficulty or moves on."
          />
          <Feature
            icon={<ClipboardCheck className="h-5 w-5" />}
            title="Evidence-based report"
            body="A rubric-scored report where every strength and gap quotes what the candidate actually said."
          />
        </div>
      </section>

      <section id="candidates" className="mx-auto max-w-5xl px-6 pb-24">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Select a candidate</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Profiles are seeded demo data from the cohort export.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {candidates.map((c) => (
            <Card key={c.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg">{c.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{c.headline}</p>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-4">
                <div>
                  <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                    <span>Cohort progress</span>
                    <span>{c.progressPercent}%</span>
                  </div>
                  <Progress value={c.progressPercent} />
                </div>
                <p className="text-sm text-muted-foreground">{c.background}</p>
                <div className="text-sm">
                  <p className="font-medium text-foreground">
                    {c.completedMissions.length} missions completed
                  </p>
                  <p className="text-muted-foreground">
                    Skipped days: {c.skippedDays.join(", ") || "none"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {c.recommendedFocusDays.slice(0, 4).map((d) => (
                    <Badge key={d} variant="outline" className="text-xs font-normal">
                      Day {d} · {getDay(d).title}
                    </Badge>
                  ))}
                </div>
                <ul className="mt-auto space-y-1 text-xs text-muted-foreground">
                  {c.learningSignals.slice(0, 3).map((s) => (
                    <li key={s}>• {s}</li>
                  ))}
                </ul>
                <Button asChild className="mt-2 w-full">
                  <Link to="/interview/$candidateId" params={{ candidateId: c.id }}>
                    Interview {c.name.split(" ")[0]}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}

function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-lg border border-border p-5">
      <div className="mb-3 inline-flex rounded-md bg-secondary p-2 text-foreground">{icon}</div>
      <h3 className="font-medium text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
