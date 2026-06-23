import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { StudentShell } from "@/components/StudentShell";
import { getStudent } from "@/lib/session";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "コース一覧 | Kakomon Practice Hub" }] }),
  component: Dashboard,
});

function Dashboard() {
  function logCourseOpen() {
    const s = getStudent();
    if (!s) return;

    void (async () => {
      try {
        const { data: course, error: courseError } = await supabase
          .from("courses")
          .select("id")
          .eq("slug", "c-language-1")
          .maybeSingle();

        if (courseError || !course) {
          console.warn("Course log fetch failed:", courseError);
          return;
        }

        const { error: logError } = await supabase.from("activity_logs").insert({
          student_id: s.id,
          action: "opened_course",
          course_id: course.id,
        });

        if (logError) {
          console.warn("Activity log insert failed:", logError);
        }
      } catch (error) {
        console.warn("Activity log failed:", error);
      }
    })();
  }

  return (
    <StudentShell>
      <div className="space-y-6">
        <div className="bg-card rounded-3xl shadow-[var(--shadow-card)] p-6 sm:p-8">
          <div className="text-xs text-primary font-medium">Kakomon Practice Hub</div>
          <h1 className="text-2xl font-bold mt-1">過去問コース一覧</h1>
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
            学習したい過去問コースを選択してください。
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/courses/c-language-1"
            onClick={logCourseOpen}
            className="group bg-card rounded-3xl shadow-[var(--shadow-card)] p-5 min-h-[150px] hover:-translate-y-1 hover:shadow-lg transition flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-xl">
                📘
              </div>

              <div>
                <div className="text-xs text-primary font-medium">プログラミング</div>
                <h2 className="text-xl font-bold mt-1">Ｃ++言語Ⅰ</h2>
              </div>
            </div>

            <div className="flex items-center justify-between mt-5">
              <span className="text-sm text-muted-foreground">期末試験対策</span>
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
