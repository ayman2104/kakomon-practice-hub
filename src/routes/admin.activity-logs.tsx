import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/AdminShell";

export const Route = createFileRoute("/admin/activity-logs")({
  head: () => ({ meta: [{ title: "アクティビティログ" }] }),
  component: Logs,
});

function Logs() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { (async () => {
    const { data } = await supabase.from("activity_logs").select("*, students(student_id), courses(title)").order("created_at", { ascending: false }).limit(200);
    setRows(data ?? []);
  })(); }, []);
  return (
    <AdminShell>
      <h1 className="text-2xl font-bold mb-4">アクティビティログ</h1>
      <div className="bg-card rounded-2xl shadow-[var(--shadow-card)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-secondary-foreground">
            <tr><th className="text-left px-4 py-2">日時</th><th className="text-left px-4 py-2">学籍番号</th><th className="text-left px-4 py-2">アクション</th><th className="text-left px-4 py-2">コース</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="px-4 py-2">{new Date(r.created_at).toLocaleString("ja-JP")}</td>
                <td className="px-4 py-2">{r.students?.student_id ?? "—"}</td>
                <td className="px-4 py-2">{r.action}</td>
                <td className="px-4 py-2">{r.courses?.title ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="text-sm text-muted-foreground text-center py-10">ログはありません</p>}
      </div>
    </AdminShell>
  );
}
