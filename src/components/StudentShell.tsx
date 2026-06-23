import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { clearStudent, getStudent, StudentSession } from "@/lib/session";

export function StudentShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [student, setStudentState] = useState<StudentSession | null>(null);

  useEffect(() => {
    const s = getStudent();
    if (!s) { navigate({ to: "/login" }); return; }
    setStudentState(s);
  }, [navigate]);

  if (!student) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">読み込み中...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[oklch(0.98_0.02_15)] to-[oklch(0.95_0.035_20)]">
      <header className="bg-card/80 backdrop-blur border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl">📚</span>
            <span className="font-medium text-primary">Kakomon Practice Hub</span>
          </a>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground hidden sm:inline">学籍番号:</span>
            <span className="font-medium">{student.student_id}</span>
            <button
              onClick={() => { clearStudent(); navigate({ to: "/login" }); }}
              className="rounded-full bg-secondary hover:bg-accent px-3 py-1.5 text-xs text-secondary-foreground"
            >
              ログアウト
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
