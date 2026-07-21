import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { StudentShell } from "@/components/StudentShell";

export const Route = createFileRoute("/courses/cpp-language-2")({
  head: () => ({ meta: [{ title: "Ｃ++言語Ⅱ | Kakomon Practice Hub" }] }),
  component: CoursePage,
});

function CoursePage() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const isChildPage = pathname !== "/courses/cpp-language-2";

  if (isChildPage) {
    return <Outlet />;
  }

  return (
    <StudentShell>
      <div className="space-y-6">
        <div className="bg-card rounded-3xl shadow-[var(--shadow-card)] p-6 sm:p-8">
          <div className="text-xs text-primary font-medium">Kakomon Practice Hub</div>
          <h1 className="text-2xl font-bold mt-1">Ｃ++言語Ⅱ</h1>
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
            第8回〜第13回の範囲を章ごとに選んで、Ｃ++言語Ⅱのランダム問題を練習します。
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/courses/cpp-language-2/practice"
            className="group bg-card rounded-3xl shadow-[var(--shadow-card)] p-5 min-h-[160px] hover:-translate-y-1 hover:shadow-lg transition flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-xl">
                🎲
              </div>

              <div>
                <div className="text-xs text-primary font-medium">練習モード</div>
                <h2 className="text-xl font-bold mt-1">ランダム問題</h2>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  出題数・章（第8回〜第13回）・難易度を選んで練習できます。
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-5">
              <span className="text-sm text-muted-foreground">4択問題</span>
              <span className="rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-medium group-hover:opacity-90">
                開く →
              </span>
            </div>
          </Link>
        </div>
      </div>
    </StudentShell>
  );
}
