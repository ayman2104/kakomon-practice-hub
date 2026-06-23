import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { StudentShell } from "@/components/StudentShell";

export const Route = createFileRoute("/attempts/$attemptId/result")({
  head: () => ({ meta: [{ title: "結果 | Kakomon Practice Hub" }] }),
  component: ResultPage,
});

function ResultPage() {
  const { attemptId } = Route.useParams();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => { (async () => {
    const { data: a } = await supabase.from("attempts").select("*").eq("id", attemptId).single();
    setAttempt(a);
    const { data } = await supabase.from("attempt_answers")
      .select("*, questions(*)").eq("attempt_id", attemptId);
    setItems(data ?? []);
  })(); }, [attemptId]);

  if (!attempt) return <StudentShell><div className="text-center py-20 text-muted-foreground">読み込み中...</div></StudentShell>;

  const score = attempt.score ?? 0;
  const total = attempt.total_questions ?? items.length;
  const correctCount = items.filter((i) => i.is_correct).length;
  const wrongCount = items.length - correctCount;
  const pct = total ? Math.round((score / total) * 100) : 0;

  return (
    <StudentShell>
      <div className="space-y-6">
        <div className="bg-card rounded-3xl shadow-[var(--shadow-card)] p-8 text-center">
          <h1 className="text-2xl font-bold">結果</h1>
          <div className="mt-4 text-5xl font-bold text-primary">{pct}<span className="text-xl">点</span></div>
          <div className="mt-3 text-sm text-muted-foreground">{score} / {total} 問正解</div>
          <div className="mt-4 flex justify-center gap-4 text-sm">
            <span className="text-[oklch(0.5_0.15_155)]">正解 {correctCount}</span>
            <span className="text-[oklch(0.55_0.18_25)]">不正解 {wrongCount}</span>
          </div>
        </div>

        {items.map((it, i) => (
          <div key={it.id} className="bg-card rounded-3xl shadow-[var(--shadow-card)] p-6 space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">問題 {i + 1}</div>
              <span className={`text-xs font-bold rounded-full px-2.5 py-0.5 ${it.is_correct ? "bg-[oklch(0.94_0.07_155)] text-[oklch(0.4_0.1_155)]" : "bg-[oklch(0.94_0.07_25)] text-[oklch(0.45_0.15_25)]"}`}>
                {it.is_correct ? "○ 正解" : "× 不正解"}
              </span>
            </div>
            <p className="text-sm">{it.questions?.question_text}</p>
            {it.questions?.code_block && <pre className="bg-[oklch(0.96_0.015_15)] rounded-xl p-3 text-xs overflow-x-auto font-mono">{it.questions.code_block}</pre>}
            <div className="text-sm"><span className="text-muted-foreground">あなたの回答: </span><span className="font-medium">{it.student_answer || "（未回答）"}</span></div>
            <div className="text-sm"><span className="text-muted-foreground">正しい答え: </span><span className="font-medium text-primary">{it.questions?.correct_answer}</span></div>
            {it.questions?.explanation && (
              <div className="mt-2 bg-accent rounded-xl p-3 text-sm">
                <div className="text-xs text-muted-foreground mb-1">解説</div>
                {it.questions.explanation}
              </div>
            )}
          </div>
        ))}

        <div className="flex flex-wrap gap-2 justify-center">
          <button onClick={() => navigate({ to: "/courses/c-language-1/exams/final-2026-first" })} className="rounded-full bg-primary text-primary-foreground px-5 py-2 text-sm">もう一度挑戦する</button>
          <button onClick={() => navigate({ to: "/courses/c-language-1" })} className="rounded-full bg-secondary px-5 py-2 text-sm">コースに戻る</button>
        </div>
      </div>
    </StudentShell>
  );
}
