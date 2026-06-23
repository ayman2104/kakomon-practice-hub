import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ADMIN_PIN, setAdmin } from "@/lib/session";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "管理者ログイン" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setAdmin(true);
      toast.success("ログインしました");
      navigate({ to: "/admin" });
    } else {
      toast.error("PINが正しくありません");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[oklch(0.96_0.03_15)] to-[oklch(0.93_0.05_20)]">
      <div className="w-full max-w-sm bg-card rounded-3xl shadow-[var(--shadow-soft)] p-8">
        <h1 className="text-xl font-bold text-center">管理者ログイン</h1>
        <p className="text-xs text-center text-muted-foreground mt-1">PINを入力してください</p>
        <form onSubmit={submit} className="mt-5 space-y-3">
          <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="PIN" className="w-full rounded-xl border border-border bg-input/40 px-4 py-3 outline-none focus:border-primary" />
          <button className="w-full rounded-full bg-primary text-primary-foreground py-3 font-medium">ログイン</button>
        </form>
        <p className="text-[10px] text-center text-muted-foreground mt-4">デフォルト: admin2026</p>
      </div>
    </div>
  );
}
