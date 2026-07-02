import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/AdminShell";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/student-data")({
  head: () => ({ meta: [{ title: "学生データ管理" }] }),
  component: StudentDataAdmin,
});

type Student = {
  id: string;
  student_id: string;
  created_at: string;
  last_login_at: string | null;
};

type Attempt = {
  id: string;
  mode: string;
  score: number | null;
  total_questions: number | null;
  started_at: string;
  submitted_at: string | null;
  courses?: { title?: string | null } | null;
  exams?: { title?: string | null } | null;
};

type AnswerRow = {
  id: string;
  student_answer: string | null;
  is_correct: boolean | null;
  created_at: string;
  questions?: any;
};

function StudentDataAdmin() {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState<Student | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [selectedAttemptId, setSelectedAttemptId] = useState("");
  const [answers, setAnswers] = useState<AnswerRow[]>([]);
  const [answersLoading, setAnswersLoading] = useState(false);

  const selectedAttempt = useMemo(
    () => attempts.find((item) => item.id === selectedAttemptId) ?? null,
    [attempts, selectedAttemptId],
  );

  const stats = useMemo(() => {
    const finished = attempts.filter((item) => item.submitted_at).length;
    const inProgress = attempts.length - finished;
    const totalScore = attempts.reduce((sum, item) => sum + (item.score ?? 0), 0);
    const totalQuestions = attempts.reduce(
      (sum, item) => sum + (item.total_questions ?? 0),
      0,
    );

    return {
      attempts: attempts.length,
      finished,
      inProgress,
      logins: logs.filter((item) => item.action === "logged_in").length,
      totalScore,
      totalQuestions,
    };
  }, [attempts, logs]);

  async function searchStudent() {
    const value = keyword.trim();

    if (!value) {
      toast.error("学籍番号を入力してください");
      return;
    }

    setLoading(true);
    setStudent(null);
    setAttempts([]);
    setLogs([]);
    setFeedback([]);
    setSelectedAttemptId("");
    setAnswers([]);

    try {
      const { data: studentData, error: studentError } = await supabase
        .from("students")
        .select("*")
        .eq("student_id", value)
        .maybeSingle();

      if (studentError) {
        toast.error(studentError.message);
        return;
      }

      if (!studentData) {
        toast.error("該当する学生が見つかりません");
        return;
      }

      setStudent(studentData as Student);

      const [attemptRes, logRes, feedbackRes] = await Promise.all([
        supabase
          .from("attempts")
          .select("*, courses(title), exams(title)")
          .eq("student_id", studentData.id)
          .order("started_at", { ascending: false }),
        supabase
          .from("activity_logs")
          .select("*, courses(title), exams(title)")
          .eq("student_id", studentData.id)
          .order("created_at", { ascending: false })
          .limit(50),
        supabase
          .from("feedback")
          .select("*, questions(question_text)")
          .eq("student_id", studentData.id)
          .order("created_at", { ascending: false })
          .limit(50),
      ]);

      if (attemptRes.error) toast.error(attemptRes.error.message);
      if (logRes.error) toast.error(logRes.error.message);
      if (feedbackRes.error) toast.error(feedbackRes.error.message);

      const loadedAttempts = (attemptRes.data ?? []) as Attempt[];
      setAttempts(loadedAttempts);
      setLogs(logRes.data ?? []);
      setFeedback(feedbackRes.data ?? []);

      if (loadedAttempts[0]) {
        await loadAnswers(loadedAttempts[0].id);
      }
    } finally {
      setLoading(false);
    }
  }

  async function loadAnswers(attemptId: string) {
    setSelectedAttemptId(attemptId);
    setAnswersLoading(true);
    setAnswers([]);

    try {
      const { data, error } = await supabase
        .from("attempt_answers")
        .select("*, questions(*)")
        .eq("attempt_id", attemptId)
        .order("created_at", { ascending: true });

      if (error) {
        toast.error(error.message);
        return;
      }

      setAnswers((data ?? []) as AnswerRow[]);
    } finally {
      setAnswersLoading(false);
    }
  }

  async function resetSelectedStudentHistory() {
    if (!student) return;

    const ok = window.prompt(
      `学籍番号 ${student.student_id} の挑戦履歴・回答・ログ・フィードバックを削除します。\n学生番号自体は残します。\n実行するには RESET と入力してください。`,
    );

    if (ok !== "RESET") return;

    setLoading(true);

    try {
      const attemptIds = attempts.map((item) => item.id);

      if (attemptIds.length > 0) {
        const { error: answerError } = await supabase
          .from("attempt_answers")
          .delete()
          .in("attempt_id", attemptIds);

        if (answerError) {
          toast.error(answerError.message);
          return;
        }
      }

      const [attemptDelete, logDelete, feedbackDelete] = await Promise.all([
        supabase.from("attempts").delete().eq("student_id", student.id),
        supabase.from("activity_logs").delete().eq("student_id", student.id),
        supabase.from("feedback").delete().eq("student_id", student.id),
      ]);

      const firstError = attemptDelete.error || logDelete.error || feedbackDelete.error;
      if (firstError) {
        toast.error(firstError.message);
        return;
      }

      toast.success("この学生の履歴をリセットしました");
      await searchStudent();
    } finally {
      setLoading(false);
    }
  }

  async function deleteSelectedStudent() {
    if (!student) return;

    const ok = window.prompt(
      `学籍番号 ${student.student_id} と関連履歴を削除します。\n実行するには DELETE と入力してください。`,
    );

    if (ok !== "DELETE") return;

    setLoading(true);

    try {
      const attemptIds = attempts.map((item) => item.id);

      if (attemptIds.length > 0) {
        const { error: answerError } = await supabase
          .from("attempt_answers")
          .delete()
          .in("attempt_id", attemptIds);

        if (answerError) {
          toast.error(answerError.message);
          return;
        }
      }

      const [attemptDelete, logDelete, feedbackDelete] = await Promise.all([
        supabase.from("attempts").delete().eq("student_id", student.id),
        supabase.from("activity_logs").delete().eq("student_id", student.id),
        supabase.from("feedback").delete().eq("student_id", student.id),
      ]);

      const firstError = attemptDelete.error || logDelete.error || feedbackDelete.error;
      if (firstError) {
        toast.error(firstError.message);
        return;
      }

      const { error: studentError } = await supabase
        .from("students")
        .delete()
        .eq("id", student.id);

      if (studentError) {
        toast.error(studentError.message);
        return;
      }

      toast.success("学生データを削除しました");
      setStudent(null);
      setAttempts([]);
      setLogs([]);
      setFeedback([]);
      setAnswers([]);
      setSelectedAttemptId("");
    } finally {
      setLoading(false);
    }
  }

  async function resetAllUsageData() {
    const ok = window.prompt(
      "全学生・挑戦履歴・回答・ログ・フィードバックを削除します。\n問題データは残します。\n実行するには RESET ALL と入力してください。",
    );

    if (ok !== "RESET ALL") return;

    setLoading(true);

    try {
      const answersDelete = await supabase
        .from("attempt_answers")
        .delete()
        .not("id", "is", null);

      if (answersDelete.error) {
        toast.error(answersDelete.error.message);
        return;
      }

      const [attemptDelete, logDelete, feedbackDelete] = await Promise.all([
        supabase.from("attempts").delete().not("id", "is", null),
        supabase.from("activity_logs").delete().not("id", "is", null),
        supabase.from("feedback").delete().not("id", "is", null),
      ]);

      const firstError = attemptDelete.error || logDelete.error || feedbackDelete.error;
      if (firstError) {
        toast.error(firstError.message);
        return;
      }

      const studentDelete = await supabase
        .from("students")
        .delete()
        .not("id", "is", null);

      if (studentDelete.error) {
        toast.error(studentDelete.error.message);
        return;
      }

      toast.success("利用データをすべてリセットしました");
      setStudent(null);
      setAttempts([]);
      setLogs([]);
      setFeedback([]);
      setAnswers([]);
      setSelectedAttemptId("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">学生データ管理</h1>
            <p className="text-sm text-muted-foreground mt-1">
              学籍番号で検索し、挑戦履歴・回答内容・リセット操作を確認できます。
            </p>
          </div>

          <button
            type="button"
            onClick={resetAllUsageData}
            disabled={loading}
            className="rounded-full bg-destructive text-destructive-foreground px-4 py-2 text-sm disabled:opacity-50"
          >
            全利用データリセット
          </button>
        </div>

        <div className="bg-card rounded-2xl p-5 shadow-[var(--shadow-card)]">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") void searchStudent();
              }}
              placeholder="学籍番号を入力（例: 2521007）"
              className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              type="button"
              onClick={searchStudent}
              disabled={loading}
              className="rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-medium disabled:opacity-50"
            >
              {loading ? "検索中..." : "検索"}
            </button>
          </div>
        </div>

        {student && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Stat label="学籍番号" value={student.student_id} />
              <Stat label="挑戦数" value={stats.attempts} />
              <Stat label="完了" value={stats.finished} />
              <Stat label="ログイン回数" value={stats.logins} />
            </div>

            <div className="bg-card rounded-2xl p-5 shadow-[var(--shadow-card)] flex flex-wrap gap-3 items-center justify-between">
              <div className="text-sm text-muted-foreground">
                登録日: {formatDate(student.created_at)} / 最終ログイン: {formatDate(student.last_login_at)}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={resetSelectedStudentHistory}
                  disabled={loading}
                  className="rounded-full bg-secondary px-4 py-2 text-sm disabled:opacity-50"
                >
                  この学生の履歴をリセット
                </button>
                <button
                  type="button"
                  onClick={deleteSelectedStudent}
                  disabled={loading}
                  className="rounded-full bg-destructive text-destructive-foreground px-4 py-2 text-sm disabled:opacity-50"
                >
                  この学生を削除
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-[360px_1fr] gap-4">
              <section className="bg-card rounded-2xl p-5 shadow-[var(--shadow-card)]">
                <h2 className="font-semibold mb-3">挑戦履歴</h2>
                <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
                  {attempts.map((attempt) => {
                    const active = attempt.id === selectedAttemptId;

                    return (
                      <button
                        key={attempt.id}
                        type="button"
                        onClick={() => loadAnswers(attempt.id)}
                        className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${
                          active
                            ? "border-primary bg-primary/10"
                            : "border-border hover:bg-accent"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium">{attempt.mode}</span>
                          <span className="text-xs text-muted-foreground">
                            {attempt.score != null
                              ? `${attempt.score}/${attempt.total_questions ?? "?"}`
                              : "進行中"}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatDate(attempt.started_at)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 truncate">
                          {attempt.exams?.title || attempt.courses?.title || "—"}
                        </div>
                      </button>
                    );
                  })}
                  {attempts.length === 0 && (
                    <p className="text-sm text-muted-foreground py-6 text-center">
                      挑戦履歴はありません
                    </p>
                  )}
                </div>
              </section>

              <section className="bg-card rounded-2xl p-5 shadow-[var(--shadow-card)]">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <h2 className="font-semibold">回答詳細</h2>
                    {selectedAttempt && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {selectedAttempt.mode} / {formatDate(selectedAttempt.started_at)} / {selectedAttempt.score != null ? `${selectedAttempt.score}/${selectedAttempt.total_questions ?? "?"}` : "進行中"}
                      </p>
                    )}
                  </div>
                  {selectedAttempt && (
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs">
                      {answers.length} 問
                    </span>
                  )}
                </div>

                {answersLoading ? (
                  <p className="text-sm text-muted-foreground py-10 text-center">
                    読み込み中...
                  </p>
                ) : answers.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-10 text-center">
                    回答データがありません
                  </p>
                ) : (
                  <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
                    {answers.map((answer, index) => {
                      const question = answer.questions;
                      const choices = getChoices(question);
                      const studentAnswer = normalizeAnswer(answer.student_answer);
                      const correctAnswer = normalizeAnswer(question?.correct_answer);

                      return (
                        <div key={answer.id} className="rounded-2xl border border-border p-4 space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="font-medium text-sm">問題 {index + 1}</div>
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${
                                answer.is_correct
                                  ? "bg-[oklch(0.94_0.07_155)] text-[oklch(0.4_0.1_155)]"
                                  : "bg-[oklch(0.94_0.07_25)] text-[oklch(0.45_0.15_25)]"
                              }`}
                            >
                              {answer.is_correct ? "○ 正解" : "× 不正解"}
                            </span>
                          </div>

                          <p className="text-sm whitespace-pre-wrap leading-relaxed">
                            {question?.question_text ?? "問題文なし"}
                          </p>

                          {question?.code_block && (
                            <pre className="bg-[oklch(0.96_0.015_15)] rounded-xl p-3 text-xs overflow-x-auto font-mono border border-border">
{question.code_block}
                            </pre>
                          )}

                          {choices.length > 0 && (
                            <div className="grid gap-1.5 text-xs">
                              {choices.map((choice) => (
                                <div key={choice.key} className="rounded-xl bg-accent/50 px-3 py-2">
                                  <span className="font-bold mr-2">{choice.key}.</span>
                                  {choice.text}
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="grid sm:grid-cols-2 gap-2 text-sm">
                            <div className="rounded-xl bg-accent/60 px-3 py-2">
                              <div className="text-xs text-muted-foreground">学生の回答</div>
                              <div className="font-medium mt-0.5">
                                {studentAnswer || "未回答"}
                                {choices.length > 0 && studentAnswer && (
                                  <span className="text-muted-foreground font-normal">
                                    {` / ${getChoiceText(choices, studentAnswer)}`}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="rounded-xl bg-primary/10 px-3 py-2">
                              <div className="text-xs text-muted-foreground">正解</div>
                              <div className="font-medium mt-0.5">
                                {correctAnswer || "—"}
                                {choices.length > 0 && correctAnswer && (
                                  <span className="text-muted-foreground font-normal">
                                    {` / ${getChoiceText(choices, correctAnswer)}`}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {question?.explanation && (
                            <div className="rounded-xl bg-secondary px-3 py-2 text-sm">
                              <div className="text-xs text-muted-foreground mb-1">解説</div>
                              {question.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
              <section className="bg-card rounded-2xl p-5 shadow-[var(--shadow-card)]">
                <h2 className="font-semibold mb-3">最近のログ</h2>
                <div className="space-y-2 text-sm max-h-[320px] overflow-y-auto pr-1">
                  {logs.map((log) => (
                    <div key={log.id} className="border-b border-border/50 pb-2">
                      <div>{log.action}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(log.created_at)} / {log.courses?.title || log.exams?.title || "—"}
                      </div>
                    </div>
                  ))}
                  {logs.length === 0 && <p className="text-sm text-muted-foreground">ログはありません</p>}
                </div>
              </section>

              <section className="bg-card rounded-2xl p-5 shadow-[var(--shadow-card)]">
                <h2 className="font-semibold mb-3">フィードバック</h2>
                <div className="space-y-2 text-sm max-h-[320px] overflow-y-auto pr-1">
                  {feedback.map((item) => (
                    <div key={item.id} className="border-b border-border/50 pb-2">
                      <div className="font-medium">[{item.category}] {item.status}</div>
                      <div>{item.message || "—"}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(item.created_at)}
                      </div>
                    </div>
                  ))}
                  {feedback.length === 0 && <p className="text-sm text-muted-foreground">フィードバックはありません</p>}
                </div>
              </section>
            </div>
          </>
        )}
      </div>
    </AdminShell>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-card rounded-2xl p-5 shadow-[var(--shadow-card)]">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}

function formatDate(value?: string | null) {
  if (!value) return "—";

  return new Date(value).toLocaleString("ja-JP");
}

type Choice = {
  key: string;
  text: string;
};

function getChoices(question: any): Choice[] {
  if (!question?.choices_json) return [];

  const normalize = (choice: any): Choice => ({
    key: String(choice.key ?? choice.id ?? ""),
    text: String(choice.text ?? ""),
  });

  if (Array.isArray(question.choices_json)) {
    return question.choices_json.map(normalize);
  }

  try {
    const parsed = JSON.parse(String(question.choices_json));
    if (Array.isArray(parsed)) return parsed.map(normalize);
  } catch {
    return [];
  }

  return [];
}

function normalizeAnswer(value: unknown) {
  if (!value) return "";

  const text = String(value);

  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return Object.entries(parsed)
        .map(([key, val]) => `${key}=${String(val)}`)
        .join(", ");
    }
  } catch {
    // normal plain answer
  }

  return text;
}

function getChoiceText(choices: Choice[], key: string) {
  if (key.includes("=")) {
    return key
      .split(",")
      .map((part) => {
        const [, value] = part.split("=");
        return choices.find((choice) => choice.key === value?.trim())?.text;
      })
      .filter(Boolean)
      .join(" / ");
  }

  return choices.find((choice) => choice.key === key)?.text ?? "";
}
