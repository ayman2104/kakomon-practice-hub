import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { StudentShell } from "@/components/StudentShell";
import { getStudent } from "@/lib/session";
import { toast } from "sonner";

export const Route = createFileRoute("/courses/c-language-1/practice")({
  head: () => ({ meta: [{ title: "ランダム問題 | Ｃ++言語Ⅰ" }] }),
  component: Practice,
});

const COUNTS = [10, 20, 50, 100];

const ROUNDS = [
  { key: "第1回", label: "第1回", desc: "C++の基本" },
  { key: "第2回", label: "第2回", desc: "関数・書式指定" },
  { key: "第3回", label: "第3回", desc: "文字列" },
  { key: "第4回", label: "第4回", desc: "ファイル入出力" },
  { key: "第5回", label: "第5回", desc: "vector / set" },
  { key: "第6回", label: "第6回", desc: "map / queue" },
];

const DIFFICULTIES = [
  { key: "mixed", label: "すべて" },
  { key: "easy", label: "easy" },
  { key: "medium", label: "medium" },
  { key: "hard", label: "hard" },
];
const TIMERS = [
  { key: 0, label: "なし" },
  { key: 10, label: "10分" },
  { key: 30, label: "30分" },
  { key: 60, label: "60分" },
  { key: 90, label: "90分" },
];

type Phase = "setup" | "practice" | "result";
type Choice = {
  key: string;
  label?: string;
  text: string;
};

function Practice() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [loading, setLoading] = useState(false);

  const [selectedCount, setSelectedCount] = useState(10);
  const [selectedRounds, setSelectedRounds] = useState<string[]>(ROUNDS.map((r) => r.key));
  const [difficulty, setDifficulty] = useState("mixed");
  const [selectedTimerMinutes, setSelectedTimerMinutes] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [availableQuestions, setAvailableQuestions] = useState<any[]>([]);
  const [availableLoading, setAvailableLoading] = useState(true);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [idx, setIdx] = useState(0);

  const q = questions[idx];
  useEffect(() => {
    if (phase !== "practice") return;
    if (timeLeft === null) return;

    if (timeLeft <= 0) {
      toast.info("時間切れです。結果を表示します。");
      void finishPractice();
      return;
    }

    const timerId = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null) return null;
        return Math.max(prev - 1, 0);
      });
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [phase, timeLeft]);

  async function loadAvailableQuestions() {
    setAvailableLoading(true);

    try {
      const db = supabase as any;

      const { data: course, error: courseError } = await db
        .from("courses")
        .select("id")
        .eq("slug", "c-language-1")
        .single();

      if (courseError || !course) {
        console.warn(courseError);
        return;
      }

      const { data, error } = await db
        .from("questions")
        .select("id, source_round, difficulty")
        .eq("course_id", course.id)
        .eq("is_active", true)
        .eq("question_type", "random_multiple_choice");

      if (error) {
        console.warn(error);
        return;
      }

      setAvailableQuestions(data ?? []);
    } finally {
      setAvailableLoading(false);
    }
  }

  const answeredCount = useMemo(() => {
    return questions.filter((item) => answers[item.id]).length;
  }, [questions, answers]);

  const selectedAvailableCount = useMemo(() => {
    return availableQuestions.filter((item) => {
      const roundOk = selectedRounds.includes(item.source_round);
      const difficultyOk = difficulty === "mixed" || item.difficulty === difficulty;

      return roundOk && difficultyOk;
    }).length;
  }, [availableQuestions, selectedRounds, difficulty]);

  const correctCount = useMemo(() => {
    return questions.filter((item) => isCorrect(item, answers[item.id] ?? "")).length;
  }, [questions, answers]);

  const incorrectCount = useMemo(() => {
    return questions.filter((item) => {
      const answer = answers[item.id] ?? "";
      return answer && !isCorrect(item, answer);
    }).length;
  }, [questions, answers]);

  const unansweredCount = useMemo(() => {
    return questions.filter((item) => !answers[item.id]).length;
  }, [questions, answers]);

  function toggleRound(round: string) {
    setSelectedRounds((prev) => {
      if (prev.includes(round)) {
        return prev.filter((item) => item !== round);
      }

      return [...prev, round];
    });
  }
  function getRoundCount(roundKey: string) {
    return availableQuestions.filter((item) => {
      const roundOk = item.source_round === roundKey;
      const difficultyOk = difficulty === "mixed" || item.difficulty === difficulty;

      return roundOk && difficultyOk;
    }).length;
  }

  async function startPractice() {
    if (selectedRounds.length === 0) {
      toast.error("範囲を1つ以上選んでください");
      return;
    }

    const student = getStudent();

    if (!student) {
      toast.error("ログイン情報が見つかりません");
      return;
    }

    setLoading(true);

    try {
      const db = supabase as any;

      const { data: course, error: courseError } = await db
        .from("courses")
        .select("id")
        .eq("slug", "c-language-1")
        .single();

      if (courseError || !course) {
        toast.error("コース情報を取得できませんでした");
        return;
      }

      let query = db
        .from("questions")
        .select("*")
        .eq("course_id", course.id)
        .eq("is_active", true)
        .eq("question_type", "random_multiple_choice")
        .in("source_round", selectedRounds);

      if (difficulty !== "mixed") {
        query = query.eq("difficulty", difficulty);
      }

      const { data: loadedQuestions, error: questionError } = await query;

      if (questionError) {
        console.error(questionError);
        toast.error("問題を取得できませんでした");
        return;
      }

      const picked = shuffle(loadedQuestions ?? []).slice(0, selectedCount);

      if (picked.length === 0) {
        toast.error("選択した条件に合う問題がありません");
        return;
      }

      if (picked.length < selectedCount) {
        toast.info(`選択された条件では ${picked.length} 問だけ見つかりました`);
      }

      const { data: attempt, error: attemptError } = await db
        .from("attempts")
        .insert({
          student_id: student.id,
          course_id: course.id,
          mode: "random",
        })
        .select()
        .single();

      if (attemptError) {
        console.warn(attemptError);
      }

      setCourseId(course.id);
      setAttemptId(attempt?.id ?? null);
      setQuestions(picked);
      setAnswers({});
      setIdx(0);
      setTimeLeft(selectedTimerMinutes > 0 ? selectedTimerMinutes * 60 : null);
      setPhase("practice");
    } finally {
      setLoading(false);
    }
  }

  function selectAnswer(key: string) {
    if (!q) return;

    setAnswers((prev) => ({
      ...prev,
      [q.id]: key,
    }));
  }

  function goNext() {
    if (idx >= questions.length - 1) {
      void finishPractice();
      return;
    }

    setIdx((prev) => prev + 1);
  }

  function goPrev() {
    setIdx((prev) => Math.max(0, prev - 1));
  }

  function stopNow() {
    const ok = window.confirm(
      `今すぐ終了しますか？\n\n回答済み: ${answeredCount} / ${questions.length}\n未回答: ${
        questions.length - answeredCount
      }\n\n未回答の問題は0点になります。`,
    );

    if (ok) {
      void finishPractice();
    }
  }

  async function finishPractice() {
    if (attemptId) {
      const rows = questions.map((item) => {
        const studentAnswer = answers[item.id] ?? "";

        return {
          attempt_id: attemptId,
          question_id: item.id,
          student_answer: studentAnswer,
          is_correct: isCorrect(item, studentAnswer),
        };
      });

      const { error } = await (supabase as any).from("attempt_answers").insert(rows);

      if (error) {
        console.warn(error);
      }
    }

    setPhase("result");
  }

  if (phase === "setup") {
    return (
      <StudentShell>
        <div className="space-y-6">
          <div className="bg-card rounded-3xl shadow-[var(--shadow-card)] p-6 sm:p-8">
            <Link
              to="/courses/c-language-1"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4"
            >
              ← コースに戻る
            </Link>

            <div className="text-xs text-primary font-medium">Ｃ++言語Ⅰ / ランダム問題</div>
            <h1 className="text-2xl font-bold mt-1">ランダム問題の設定</h1>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              出題数、範囲、難易度を選んでから開始します。
            </p>
          </div>

          <div className="bg-card rounded-3xl shadow-[var(--shadow-card)] p-6 sm:p-8 space-y-8">
            <section className="space-y-3">
              <h2 className="font-semibold">出題数</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {COUNTS.map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setSelectedCount(count)}
                    className={`rounded-2xl border px-4 py-4 text-sm font-medium transition ${
                      selectedCount === count
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:bg-accent"
                    }`}
                  >
                    {count}問
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="font-semibold">範囲</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {ROUNDS.map((round) => {
                  const checked = selectedRounds.includes(round.key);

                  return (
                    <button
                      key={round.key}
                      type="button"
                      onClick={() => toggleRound(round.key)}
                      className={`rounded-2xl border px-4 py-4 text-left transition ${
                        checked ? "border-primary bg-primary/10" : "border-border hover:bg-accent"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="font-semibold">{round.label}</div>
                          <div className="text-xs text-muted-foreground mt-1">{round.desc}</div>
                          <div className="text-xs text-primary mt-2 font-medium">
                            {availableLoading ? "読み込み中..." : `${getRoundCount(round.key)}問`}
                          </div>
                        </div>
                        <div
                          className={`h-6 w-6 rounded-full border flex items-center justify-center text-xs ${
                            checked
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border"
                          }`}
                        >
                          {checked ? "✓" : ""}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="font-semibold">難易度</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {DIFFICULTIES.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setDifficulty(item.key)}
                    className={`rounded-2xl border px-4 py-4 text-sm font-medium transition ${
                      difficulty === item.key
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:bg-accent"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="font-semibold">タイマー</h2>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {TIMERS.map((timer) => (
                  <button
                    key={timer.key}
                    type="button"
                    onClick={() => setSelectedTimerMinutes(timer.key)}
                    className={`rounded-2xl border px-4 py-4 text-sm font-medium transition ${
                      selectedTimerMinutes === timer.key
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:bg-accent"
                    }`}
                  >
                    {timer.label}
                  </button>
                ))}
              </div>
              <div className="text-xs text-muted-foreground">
                タイマーを設定すると、時間切れで自動的に結果画面へ進みます。
              </div>
            </section>
            <div className="rounded-2xl bg-primary/10 border border-primary/20 px-4 py-4 text-sm">
              <div className="font-medium">
                選択中の条件: {availableLoading ? "読み込み中..." : `${selectedAvailableCount}問`}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                出題数より少ない場合は、見つかった問題数だけで開始します。
              </div>
            </div>
            <button
              type="button"
              onClick={startPractice}
              disabled={loading || selectedAvailableCount === 0}
              className="w-full rounded-full bg-primary text-primary-foreground py-3 font-medium hover:opacity-90 disabled:opacity-60"
            >
              {loading
                ? "読み込み中..."
                : selectedAvailableCount === 0
                  ? "問題がありません"
                  : "開始する"}
            </button>
          </div>
        </div>
      </StudentShell>
    );
  }

  if (phase === "result") {
    return (
      <StudentShell>
        <div className="space-y-6">
          <div className="bg-card rounded-3xl shadow-[var(--shadow-card)] p-6 sm:p-8">
            <Link
              to="/courses/c-language-1"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4"
            >
              ← コースに戻る
            </Link>

            <div className="text-xs text-primary font-medium">Ｃ++言語Ⅰ / ランダム問題</div>
            <h1 className="text-2xl font-bold mt-1">結果</h1>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              <ResultBox label="正解" value={`${correctCount}`} />
              <ResultBox label="不正解" value={`${incorrectCount}`} />
              <ResultBox label="未回答" value={`${unansweredCount}`} />
              <ResultBox label="点数" value={`${correctCount} / ${questions.length}`} />
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              <button
                type="button"
                onClick={() => setPhase("setup")}
                className="rounded-full bg-primary text-primary-foreground px-5 py-2 text-sm font-medium"
              >
                もう一度設定する
              </button>
              <Link
                to="/courses/c-language-1"
                className="rounded-full bg-secondary px-5 py-2 text-sm"
              >
                コース選択へ
              </Link>
              <button
                type="button"
                onClick={startPractice}
                className="rounded-full bg-secondary px-5 py-2 text-sm"
              >
                同じ条件で再開する
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {questions.map((item, index) => {
              const studentAnswer = answers[item.id] ?? "";
              const correct = isCorrect(item, studentAnswer);
              const correctKey = getCorrectKey(item);
              const isUnanswered = !studentAnswer;

              return (
                <div
                  key={item.id}
                  className="bg-card rounded-3xl shadow-[var(--shadow-card)] p-6 space-y-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium">
                      問題 {index + 1}
                    </span>
                    {item.source_round && (
                      <span className="rounded-full bg-accent px-3 py-1 text-xs">
                        {item.source_round}
                      </span>
                    )}
                    {item.topic && (
                      <span className="rounded-full bg-accent px-3 py-1 text-xs">{item.topic}</span>
                    )}
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        correct
                          ? "bg-[oklch(0.95_0.05_155)] text-[oklch(0.4_0.1_155)]"
                          : isUnanswered
                            ? "bg-secondary text-muted-foreground"
                            : "bg-[oklch(0.95_0.05_25)] text-[oklch(0.45_0.15_25)]"
                      }`}
                    >
                      {correct ? "○ 正解" : isUnanswered ? "未回答" : "× 不正解"}
                    </span>
                  </div>

                  <p className="whitespace-pre-wrap leading-relaxed">{item.question_text}</p>

                  {item.code_block && (
                    <pre className="bg-[oklch(0.96_0.015_15)] rounded-2xl p-4 text-sm overflow-x-auto font-mono border border-border">
                      {item.code_block}
                    </pre>
                  )}

                  <div className="grid gap-2">
                    {getChoices(item).map((choice) => {
                      const isStudent = studentAnswer === choice.key;
                      const isCorrectChoice = correctKey === choice.key;

                      return (
                        <div
                          key={choice.key}
                          className={`rounded-2xl border px-4 py-3 text-sm ${
                            isCorrectChoice
                              ? "border-primary bg-primary/10"
                              : isStudent
                                ? "border-destructive/50 bg-destructive/10"
                                : "border-border"
                          }`}
                        >
                          <span className="font-bold mr-2">{choice.key}.</span>
                          <span>{choice.text}</span>
                          {isCorrectChoice && (
                            <span className="ml-2 text-xs text-primary font-medium">正解</span>
                          )}
                          {isStudent && !isCorrectChoice && (
                            <span className="ml-2 text-xs text-destructive font-medium">
                              あなたの回答
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="rounded-2xl bg-accent/60 px-4 py-3 text-sm">
                    <div>
                      あなたの回答:{" "}
                      <span className="font-semibold">{studentAnswer || "未回答"}</span>
                    </div>
                    <div>
                      正解: <span className="font-semibold">{correctKey}</span>
                    </div>
                    {item.explanation && (
                      <div className="mt-2 leading-relaxed">解説: {item.explanation}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </StudentShell>
    );
  }

  if (!q) {
    return (
      <StudentShell>
        <div className="text-center py-20 text-muted-foreground">読み込み中...</div>
      </StudentShell>
    );
  }

  const selectedAnswer = answers[q.id] ?? "";
  const progress = Math.round(((idx + 1) / questions.length) * 100);

  return (
    <StudentShell>
      <div className="lg:pr-[300px]">
        <div className="bg-card rounded-3xl shadow-[var(--shadow-card)] p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs text-primary font-medium">Ｃ++言語Ⅰ / ランダム問題</div>
              <h1 className="text-2xl font-bold mt-1">
                問題 {idx + 1} / {questions.length}
              </h1>
              <div className="text-sm text-muted-foreground mt-1">
                回答済み: {answeredCount} / {questions.length}
              </div>

              {timeLeft !== null && (
                <div className="mt-2 inline-flex rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-semibold">
                  残り時間: {formatTime(timeLeft)}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={stopNow}
              className="rounded-full bg-secondary px-4 py-2 text-sm"
            >
              今すぐ終了
            </button>
          </div>

          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            {q.source_round && (
              <span className="rounded-full bg-primary/10 text-primary px-3 py-1">
                {q.source_round}
              </span>
            )}
            {q.topic && <span className="rounded-full bg-accent px-3 py-1">{q.topic}</span>}
            {q.difficulty && (
              <span className="rounded-full bg-secondary px-3 py-1">{q.difficulty}</span>
            )}
          </div>

          <p className="text-base leading-relaxed whitespace-pre-wrap">{q.question_text}</p>

          {q.code_block && (
            <pre className="bg-[oklch(0.96_0.015_15)] rounded-2xl p-4 text-sm overflow-x-auto font-mono border border-border">
              {q.code_block}
            </pre>
          )}

          <div className="grid gap-3">
            {getChoices(q).map((choice) => (
              <button
                key={choice.key}
                type="button"
                onClick={() => selectAnswer(choice.key)}
                className={`rounded-2xl border px-4 py-4 text-left text-sm transition ${
                  selectedAnswer === choice.key
                    ? "border-primary bg-primary/10"
                    : "border-border hover:bg-accent"
                }`}
              >
                <span className="font-bold mr-3">{choice.key}.</span>
                <span>{choice.text}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={goPrev}
              disabled={idx === 0}
              className="rounded-full bg-secondary px-5 py-2 text-sm disabled:opacity-40"
            >
              前の問題
            </button>

            <button
              type="button"
              onClick={goNext}
              className="rounded-full bg-primary text-primary-foreground px-5 py-2 text-sm font-medium"
            >
              {idx === questions.length - 1 ? "結果を見る" : "次の問題"}
            </button>

            <button
              type="button"
              onClick={stopNow}
              className="rounded-full bg-secondary px-5 py-2 text-sm"
            >
              今すぐ終了
            </button>
          </div>

          <div className="lg:hidden rounded-3xl border border-border p-4">
            <div className="text-sm font-semibold mb-3">問題一覧</div>
            <QuestionNumbers
              questions={questions}
              answers={answers}
              currentIndex={idx}
              onSelect={setIdx}
            />
          </div>
        </div>

        <aside className="hidden lg:block fixed right-4 top-24 bottom-6 w-[260px] bg-card rounded-3xl shadow-[var(--shadow-card)] border border-border p-5 overflow-y-auto">
          <div className="font-semibold">問題一覧</div>
          <p className="text-xs text-muted-foreground mt-1">問題番号から移動できます</p>

          <div className="mt-4">
            <QuestionNumbers
              questions={questions}
              answers={answers}
              currentIndex={idx}
              onSelect={setIdx}
            />
          </div>

          <button
            type="button"
            onClick={stopNow}
            className="w-full mt-5 rounded-full bg-secondary px-4 py-2 text-sm"
          >
            今すぐ終了
          </button>
        </aside>
      </div>
    </StudentShell>
  );
}

function QuestionNumbers({ questions, answers, currentIndex, onSelect }: any) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {questions.map((item: any, index: number) => {
        const answered = Boolean(answers[item.id]);
        const current = index === currentIndex;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(index)}
            className={`h-10 rounded-xl text-sm font-medium border transition ${
              current
                ? "bg-primary text-primary-foreground border-primary"
                : answered
                  ? "bg-primary/10 text-primary border-primary/30"
                  : "bg-background border-border hover:bg-accent"
            }`}
          >
            {index + 1}
          </button>
        );
      })}
    </div>
  );
}

function ResultBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-accent/60 p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}

function getChoices(q: any): Choice[] {
  if (!q) return [];

  const normalizeChoice = (choice: any): Choice => ({
    key: String(choice.key ?? choice.id ?? ""),
    label: choice.label ? String(choice.label) : "",
    text: String(choice.text ?? ""),
  });

  if (Array.isArray(q.choices_json)) {
    return q.choices_json.map(normalizeChoice);
  }

  try {
    const parsed = JSON.parse(String(q.choices_json));

    if (Array.isArray(parsed)) {
      return parsed.map(normalizeChoice);
    }
  } catch {
    return [];
  }

  return [];
}

function getCorrectKey(q: any) {
  if (!q) return "";

  const raw = q.correct_answer;

  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    return String(raw.A ?? "");
  }

  try {
    const parsed = JSON.parse(String(raw));

    if (parsed && typeof parsed === "object") {
      return String(parsed.A ?? "");
    }
  } catch {
    return String(raw ?? "");
  }

  return String(raw ?? "");
}

function isCorrect(q: any, answer: string) {
  if (!answer) return false;

  return String(answer).trim() === getCorrectKey(q).trim();
}

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainSeconds = seconds % 60;

  return `${minutes}:${String(remainSeconds).padStart(2, "0")}`;
}