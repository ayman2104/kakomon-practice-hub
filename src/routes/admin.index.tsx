import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/AdminShell";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "管理ダッシュボード" }] }),
  component: AdminDash,
});

function AdminDash() {
  const [stats, setStats] = useState({ students: 0, questions: 0, attempts: 0 });
  const [logins, setLogins] = useState<any[]>([]);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);

  useEffect(() => { (async () => {
    const [s, q, a] = await Promise.all([
      supabase.from("students").select("*", { count: "exact", head: true }),
      supabase.from("questions").select("*", { count: "exact", head: true }),
      supabase.from("attempts").select("*", { count: "exact", head: true }),
    ]);
    setStats({ students: s.count ?? 0, questions: q.count ?? 0, attempts: a.count ?? 0 });
    const { data: l } = await supabase.from("activity_logs").select("*, students(student_id)").eq("action", "logged_in").order("created_at", { ascending: false }).limit(10);
    setLogins(l ?? []);
    const { data: at } = await supabase.from("attempts").select("*, students(student_id)").order("started_at", { ascending: false }).limit(10);
    setAttempts(at ?? []);
    const { data: fb } = await supabase.from("feedback").select("*").order("created_at", { ascending: false }).limit(10);
    setFeedback(fb ?? []);
  })(); }, []);

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold mb-4">ダッシュボード</h1>
      <div className="grid sm:grid-cols-3 gap-4">
        <Stat label="学生数" value={stats.students} />
        <Stat label="Ｃ++言語Ⅰ 問題数" value={stats.questions} />
        <Stat label="挑戦数" value={stats.attempts} />
      </div>
      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <Panel title="最近のログイン" rows={logins.map((l) => `${l.students?.student_id ?? "?"} — ${new Date(l.created_at).toLocaleString("ja-JP")}`)} />
        <Panel title="最近の挑戦" rows={attempts.map((a) => `${a.students?.student_id ?? "?"} (${a.mode}) ${a.score != null ? `${a.score}/${a.total_questions}` : "進行中"}`)} />
        <Panel title="最近のフィードバック" rows={feedback.map((f) => `[${f.category}] ${f.message?.slice(0, 60) ?? ""}`)} />
      </div>
    </AdminShell>
  );
}

function Stat({ label, value }: any) {
  return (
    <div className="bg-card rounded-2xl p-5 shadow-[var(--shadow-card)]">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-3xl font-bold mt-1">{value}</div>
    </div>
  );
}
function Panel({ title, rows }: { title: string; rows: string[] }) {
  return (
    <div className="bg-card rounded-2xl p-5 shadow-[var(--shadow-card)]">
      <h3 className="font-semibold mb-2">{title}</h3>
      {rows.length === 0 ? <p className="text-sm text-muted-foreground">データなし</p> : (
        <ul className="space-y-1.5 text-sm">{rows.map((r, i) => <li key={i} className="border-b border-border/40 pb-1">{r}</li>)}</ul>
      )}
    </div>
  );
}
