import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { setStudent } from "@/lib/session";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "ログイン | Kakomon Practice Hub" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const sid = studentId.trim();
    if (!sid) return toast.error("学籍番号を入力してください");
    if (!/^\d+$/.test(sid)) return toast.error("学籍番号は数字のみで入力してください");

    setLoading(true);
    try {
      const { data: existing } = await supabase
        .from("students").select("*").eq("student_id", sid).maybeSingle();

      let student = existing;
      if (!student) {
        const { data: created, error } = await supabase
          .from("students").insert({ student_id: sid, last_login_at: new Date().toISOString() })
          .select().single();
        if (error) throw error;
        student = created;
      } else {
        await supabase.from("students")
          .update({ last_login_at: new Date().toISOString() })
          .eq("id", student.id);
      }

      await supabase.from("activity_logs").insert({ student_id: student!.id, action: "logged_in" });
      setStudent({ id: student!.id, student_id: student!.student_id });
      toast.success("ログインしました");
      navigate({ to: "/dashboard" });
    } catch (err) {
      console.error(err);
      toast.error("ログインに失敗しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-[oklch(0.97_0.025_15)] to-[oklch(0.94_0.04_20)]">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground text-2xl shadow-[var(--shadow-soft)] mb-3">
            📚
          </div>
          <h1 className="text-lg font-medium text-primary tracking-wide">Kakomon Practice Hub</h1>
        </div>
        <div className="bg-card rounded-3xl shadow-[var(--shadow-soft)] p-8">
          <h2 className="text-2xl font-bold text-center text-foreground">過去問練習システム</h2>
          <p className="text-center text-sm text-muted-foreground mt-2">
            学籍番号を入力してログインしてください
          </p>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">学籍番号</label>
              <input
                type="text"
                inputMode="numeric"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="2XXXXXX"
                className="w-full rounded-xl border border-border bg-input/40 px-4 py-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-primary hover:opacity-90 text-primary-foreground font-medium py-3 transition shadow-[var(--shadow-card)] disabled:opacity-60"
            >
              {loading ? "ログイン中..." : "ログイン"}
            </button>
            <p className="text-xs text-center text-muted-foreground">※パスワードは不要です</p>
          </form>
        </div>
        <div className="text-center mt-4">
          <a href="/admin/login" className="text-xs text-muted-foreground hover:text-primary">管理者ログイン</a>
        </div>
      </div>
    </div>
  );
}
