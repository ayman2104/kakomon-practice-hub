import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/AdminShell";

export const Route = createFileRoute("/admin/feedback")({
  head: () => ({ meta: [{ title: "フィードバック" }] }),
  component: AdminFb,
});

function AdminFb() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { (async () => {
    const { data } = await supabase.from("feedback").select("*, students(student_id), questions(question_text)").order("created_at", { ascending: false });
    setRows(data ?? []);
  })(); }, []);
  return (
    <AdminShell>
      <h1 className="text-2xl font-bold mb-4">フィードバック</h1>
      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.id} className="bg-card rounded-2xl p-4 shadow-[var(--shadow-card)]">
            <div className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString("ja-JP")} · 学籍番号 {r.students?.student_id ?? "—"}</div>
            <div className="text-sm font-medium mt-1">[{r.category}]</div>
            <div className="text-sm mt-1">{r.message || "（メッセージなし）"}</div>
            {r.questions?.question_text && <div className="text-xs text-muted-foreground mt-2 truncate">対象問題: {r.questions.question_text}</div>}
          </div>
        ))}
        {rows.length === 0 && <p className="text-sm text-muted-foreground text-center py-10">フィードバックはありません</p>}
      </div>
    </AdminShell>
  );
}
