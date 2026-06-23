import { ReactNode, useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { isAdmin, setAdmin } from "@/lib/session";

export function AdminShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (!isAdmin()) navigate({ to: "/admin/login" });
    else setOk(true);
  }, [navigate]);
  if (!ok) return null;

  return (
    <div className="min-h-screen bg-[oklch(0.97_0.02_15)]">
      <header className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚙️</span>
            <span className="font-medium">管理画面 — Kakomon Practice Hub</span>
          </div>
          <button onClick={() => { setAdmin(false); navigate({ to: "/admin/login" }); }} className="text-xs rounded-full bg-secondary px-3 py-1.5">ログアウト</button>
        </div>
        <nav className="max-w-6xl mx-auto px-4 pb-3 flex flex-wrap gap-1.5 text-sm">
          {[
            ["ダッシュボード", "/admin"],
            ["問題管理", "/admin/questions"],
            ["AI生成", "/admin/ai-generator"],
            ["フィードバック", "/admin/feedback"],
            ["アクティビティ", "/admin/activity-logs"],
          ].map(([l, h]) => (
            <Link key={h} to={h} className="rounded-full px-3 py-1.5 hover:bg-accent" activeProps={{ className: "rounded-full px-3 py-1.5 bg-primary text-primary-foreground" }}>{l}</Link>
          ))}
        </nav>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
