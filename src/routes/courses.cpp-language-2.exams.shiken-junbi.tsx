import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { StudentShell } from "@/components/StudentShell";
import { getStudent } from "@/lib/session";
import { isAnswerCorrect } from "@/components/QuestionView";
import { toast } from "sonner";

export const Route = createFileRoute("/courses/cpp-language-2/exams/shiken-junbi")({
  head: () => ({ meta: [{ title: "試験準備 | Ｃ++言語Ⅱ" }] }),
  component: ExamPage,
});

const FALLBACK_CHOICES = [
  { key: "1", text: "正しい" },
  { key: "2", text: "誤り" },
];

function ExamPage() {
  const navigate = useNavigate();

  const [exam, setExam] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, Record<string, string>>>({});
  const [activeSlot, setActiveSlot] = useState("A");
  const [idx, setIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [isNavigatorOpen, setIsNavigatorOpen] = useState(true);

  useEffect(() => {
    void loadExam();
  }, []);

  async function loadExam() {
    setLoading(true);

    const s = getStudent();

    if (!s) {
      setLoading(false);
      return;
    }

    const { data: e, error: examError } = await supabase
      .from("exams")
      .select("*")
      .eq("slug", "cpp2-shiken-junbi")
      .maybeSingle();

    if (examError) {
      console.error(examError);
      toast.error("試験データの取得に失敗しました");
      setLoading(false);
      return;
    }

    if (!e) {
      setLoading(false);
      return;
    }

    setExam(e);

    const { data: eq, error: questionError } = await supabase
      .from("exam_questions")
      .select("question_order, questions(*)")
      .eq("exam_id", e.id)
      .order("question_order");

    if (questionError) {
      console.error(questionError);
      toast.error("問題データの取得に失敗しました");
      setLoading(false);
      return;
    }

    const qs = (eq ?? [])
      .map((r: any) => r.questions)
      .filter(Boolean)
      .filter((q: any) => q.question_type === "exam_shared_choice");

    setQuestions(qs);

    const { data: att, error: attemptError } = await supabase
      .from("attempts")
      .insert({
        student_id: s.id,
        course_id: e.course_id,
        exam_id: e.id,
        mode: "exam",
        total_questions: qs.length,
      })
      .select()
      .maybeSingle();

    if (attemptError) {
      console.error(attemptError);
      toast.error("受験記録の作成に失敗しました");
    }

    setAttemptId(att?.id ?? null);
    setLoading(false);
  }

  const q = questions[idx];
  const slots: string[] = getAnswerSlots(q);
  const currentAnswer: Record<string, string> = q ? (answers[q.id] ?? {}) : {};
  const choices = getChoices(q);
  const isFirstQuestion = idx === 0;
  const isLastQuestion = idx === questions.length - 1;

  function getAnswerSlots(question: any): string[] {
    if (!question) return ["A"];

    if (Array.isArray(question.answer_slots_json)) {
      return question.answer_slots_json.map(String);
    }

    try {
      const parsed = JSON.parse(question.answer_slots_json);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      return ["A"];
    }

    return ["A"];
  }

  function getChoices(question: any) {
    if (!question) return FALLBACK_CHOICES;

    if (Array.isArray(question.choices_json)) {
      return question.choices_json;
    }

    try {
      const parsed = JSON.parse(question.choices_json);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return FALLBACK_CHOICES;
    }

    return FALLBACK_CHOICES;
  }

  function selectChoice(choiceKey: string) {
    if (!q) return;

    setAnswers((prev) => ({
      ...prev,
      [q.id]: {
        ...(prev[q.id] ?? {}),
        [activeSlot]: choiceKey,
      },
    }));

    const currentSlotIndex = slots.indexOf(activeSlot);
    const nextSlot = slots[currentSlotIndex + 1];

    if (nextSlot) {
      setActiveSlot(nextSlot);
    }
  }

  function nextQuestion() {
    if (!q) return;

    if (isLastQuestion) {
      void submitExam();
      return;
    }

    setIdx((prev) => prev + 1);
    setActiveSlot("A");
  }

  function prevQuestion() {
    if (isFirstQuestion) return;

    setIdx((prev) => prev - 1);
    setActiveSlot("A");
  }

  function clearCurrentQuestion() {
    if (!q) return;

    setAnswers((prev) => ({
      ...prev,
      [q.id]: {},
    }));

    setActiveSlot("A");
  }

  function isQuestionAnswered(question: any) {
    const questionAnswer: Record<string, string> = answers[question.id] ?? {};
    const questionSlots = getAnswerSlots(question);

    return questionSlots.every((slot) => questionAnswer[slot]);
  }

  function jumpToQuestion(questionIndex: number) {
    setIdx(questionIndex);
    setActiveSlot("A");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function submitExam() {
    if (!attemptId || submitting) return;

    setSubmitting(true);

    let calculatedScore = 0;

    const rows = questions.map((question) => {
      const studentAnswerObject = answers[question.id] ?? {};
      const studentAnswerText = JSON.stringify(studentAnswerObject);
      const correct = isAnswerCorrect(question, studentAnswerText);

      if (correct) {
        calculatedScore++;
      }

      return {
        attempt_id: attemptId,
        question_id: question.id,
        student_answer: studentAnswerText,
        is_correct: correct,
      };
    });

    await supabase.from("attempt_answers").insert(rows);

    await supabase
      .from("attempts")
      .update({
        score: calculatedScore,
        total_questions: questions.length,
        submitted_at: new Date().toISOString(),
      })
      .eq("id", attemptId);

    setScore(calculatedScore);
    setFinished(true);
    setSubmitting(false);

    toast.success("提出しました");
  }

  function retryExam() {
    setAnswers({});
    setIdx(0);
    setActiveSlot("A");
    setFinished(false);
    setScore(0);
    void loadExam();
  }

  function parseAnswerObject(value: any): Record<string, string> | null {
    if (!value) return null;

    if (typeof value === "object" && !Array.isArray(value)) {
      return value as Record<string, string>;
    }

    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          return parsed as Record<string, string>;
        }
      } catch {
        return null;
      }
    }

    return null;
  }

  function formatAnswer(value: any, question: any) {
    const parsed = parseAnswerObject(value);

    if (!parsed || Object.keys(parsed).length === 0) return "未回答";

    const questionChoices = getChoices(question);

    return Object.entries(parsed)
      .map(([slot, key]) => {
        const choice = questionChoices.find((item: any) => String(item.key) === String(key));
        return `${slot}=${key}${choice ? `. ${choice.text}` : ""}`;
      })
      .join(", ");
  }

  if (loading) {
    return (
      <StudentShell>
        <div className="text-center py-20 text-muted-foreground">読み込み中...</div>
      </StudentShell>
    );
  }

  if (!exam || questions.length === 0) {
    return (
      <StudentShell>
        <div className="bg-card rounded-3xl shadow-[var(--shadow-card)] p-8 text-center">
          <h1 className="text-xl font-bold">試験準備問題が見つかりませんでした</h1>
          <p className="text-sm text-muted-foreground mt-2">
            cpp2_shiken_junbi_seed.sql を Lovable / Supabase SQL Editor で実行してください。
          </p>
          <button
            onClick={() => navigate({ to: "/courses/cpp-language-2" as any })}
            className="mt-6 rounded-full bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium"
          >
            コースに戻る
          </button>
        </div>
      </StudentShell>
    );
  }

  if (finished) {
    return (
      <StudentShell>
        <div className="space-y-6">
          <div className="bg-card rounded-3xl shadow-[var(--shadow-card)] p-6 sm:p-8 text-center">
            <div className="text-4xl">📝</div>
            <h1 className="text-2xl font-bold mt-3">試験結果</h1>
            <p className="text-sm text-muted-foreground mt-2">{exam.title}</p>

            <div className="rounded-3xl bg-accent p-6 mt-6">
              <div className="text-sm text-muted-foreground">点数</div>
              <div className="text-4xl font-bold mt-1">
                {score} / {questions.length}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <button
                onClick={retryExam}
                className="rounded-full bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium"
              >
                もう一度挑戦する
              </button>

              <button
                onClick={() => navigate({ to: "/courses/cpp-language-2" as any })}
                className="rounded-full bg-secondary px-6 py-2.5 text-sm font-medium"
              >
                コースに戻る
              </button>
            </div>
          </div>

          {questions.map((question, i) => {
            const studentAnswer = answers[question.id] ?? {};
            const correct = isAnswerCorrect(question, JSON.stringify(studentAnswer));

            return (
              <div
                key={question.id}
                className="bg-card rounded-3xl shadow-[var(--shadow-card)] p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-primary">問題 {i + 1}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {question.source_round} / {question.topic}
                    </div>
                  </div>
                  <div
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      correct
                        ? "bg-[oklch(0.95_0.05_155)] text-[oklch(0.4_0.1_155)]"
                        : "bg-[oklch(0.95_0.05_25)] text-[oklch(0.45_0.15_25)]"
                    }`}
                  >
                    {correct ? "正解" : "不正解"}
                  </div>
                </div>

                <p className="whitespace-pre-wrap leading-relaxed">{question.question_text}</p>

                {question.code_block && (
                  <pre className="bg-[oklch(0.96_0.015_15)] rounded-2xl p-4 text-sm overflow-x-auto font-mono border border-border whitespace-pre-wrap">
                    {question.code_block}
                  </pre>
                )}

                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl bg-accent p-4">
                    <div className="text-muted-foreground text-xs">あなたの回答</div>
                    <div className="font-bold mt-1 whitespace-pre-wrap">{formatAnswer(studentAnswer, question)}</div>
                  </div>

                  <div className="rounded-2xl bg-accent p-4">
                    <div className="text-muted-foreground text-xs">正しい答え</div>
                    <div className="font-bold mt-1 whitespace-pre-wrap">{formatAnswer(question.correct_answer, question)}</div>
                  </div>
                </div>

                {question.explanation && (
                  <div className="rounded-2xl bg-secondary p-4 text-sm leading-relaxed whitespace-pre-wrap">
                    <div className="text-xs text-muted-foreground mb-1">解説</div>
                    {question.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </StudentShell>
    );
  }

  return (
    <StudentShell>
      <div className="space-y-6">
        <div className="bg-card rounded-3xl shadow-[var(--shadow-card)] p-6">
          <div className="text-xs text-primary font-medium">Ｃ++言語Ⅱ</div>
          <h1 className="text-xl font-bold mt-1">{exam.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            問題 {idx + 1} / {questions.length} ・ 第8回〜第13回の順番で出題
          </p>
        </div>

        <div className="space-y-6 lg:pr-[300px]">
          <div className="bg-card rounded-3xl shadow-[var(--shadow-card)] p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-bold text-primary">問題 {idx + 1}</div>

              <div className="flex flex-wrap gap-2 text-xs">
                {q.source_round && <span className="rounded-full bg-primary/10 text-primary px-2.5 py-0.5">{q.source_round}</span>}
                {q.topic && <span className="rounded-full bg-accent px-2.5 py-0.5">{q.topic}</span>}
                {q.difficulty && (
                  <span className="rounded-full bg-secondary px-2.5 py-0.5">{q.difficulty}</span>
                )}
              </div>
            </div>

            <div className="min-h-[260px] flex flex-col justify-center space-y-5">
              <p className="text-xl sm:text-2xl font-semibold leading-relaxed whitespace-pre-wrap text-center">
                {q.question_text}
              </p>

              {q.code_block && (
                <pre className="bg-[oklch(0.96_0.015_15)] rounded-2xl p-5 text-sm sm:text-base overflow-x-auto font-mono border border-border whitespace-pre-wrap">
                  {q.code_block}
                </pre>
              )}

              <div className="rounded-2xl bg-accent p-4">
                <div className="text-xs text-muted-foreground mb-3">回答欄</div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {slots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setActiveSlot(slot)}
                      className={`rounded-2xl border p-4 text-left transition ${
                        activeSlot === slot
                          ? "border-primary bg-primary/10"
                          : "border-border bg-background"
                      }`}
                    >
                      <div className="text-xs text-muted-foreground">回答 {slot}</div>
                      <div className="text-3xl font-bold mt-1">
                        {currentAnswer[slot] || "未選択"}
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={clearCurrentQuestion}
                  className="mt-3 rounded-full bg-secondary px-4 py-1.5 text-xs"
                >
                  クリア
                </button>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-3xl shadow-[var(--shadow-card)] p-6 space-y-4">
            <div>
              <h2 className="font-bold">選択肢</h2>
              <p className="text-sm text-muted-foreground mt-1">
                回答欄を選んでから、下の選択肢を押してください。
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-2">
              {choices.map((choice: any) => (
                <button
                  key={choice.key}
                  type="button"
                  onClick={() => selectChoice(choice.key)}
                  className="rounded-2xl border border-border bg-accent/40 px-4 py-3 text-left text-sm transition hover:bg-accent"
                >
                  <span className="font-bold mr-2">{choice.key}.</span>
                  <span className="font-mono whitespace-pre-wrap">{choice.text}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <button
              onClick={prevQuestion}
              disabled={isFirstQuestion}
              className="rounded-full bg-secondary px-6 py-2.5 text-sm font-medium disabled:opacity-40"
            >
              前の問題
            </button>

            <button
              onClick={nextQuestion}
              disabled={submitting}
              className="rounded-full bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium disabled:opacity-60"
            >
              {isLastQuestion ? (submitting ? "提出中..." : "提出する") : "次の問題"}
            </button>
          </div>
        </div>

        {!isNavigatorOpen && (
          <button
            type="button"
            onClick={() => setIsNavigatorOpen(true)}
            className="fixed right-0 top-1/2 z-50 -translate-y-1/2 rounded-l-2xl bg-primary text-primary-foreground shadow-lg px-3 py-5 text-xl font-bold hover:opacity-90"
            aria-label="問題一覧を開く"
          >
            ‹
          </button>
        )}

        {isNavigatorOpen && (
          <aside className="fixed right-4 top-24 bottom-6 z-50 w-[280px] rounded-3xl bg-card shadow-2xl border border-border p-5 space-y-4 overflow-y-auto">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-bold text-primary">問題一覧</h2>
                <p className="text-xs text-muted-foreground mt-1">第8回から順番に並んでいます。</p>
              </div>

              <button
                type="button"
                onClick={() => setIsNavigatorOpen(false)}
                className="h-8 w-8 rounded-lg bg-secondary text-sm font-bold hover:bg-accent transition"
                aria-label="問題一覧を閉じる"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {questions.map((question, questionIndex) => {
                const active = questionIndex === idx;
                const answered = isQuestionAnswered(question);

                return (
                  <button
                    key={question.id}
                    type="button"
                    onClick={() => jumpToQuestion(questionIndex)}
                    title={`${question.source_round ?? ""} 問題${questionIndex + 1}`}
                    className={`h-10 rounded-xl text-sm font-bold border transition ${
                      active
                        ? "bg-primary text-primary-foreground border-primary"
                        : answered
                          ? "bg-primary/10 text-primary border-primary/30"
                          : "bg-background border-border hover:bg-accent"
                    }`}
                  >
                    {questionIndex + 1}
                  </button>
                );
              })}
            </div>

            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded bg-primary" />
                <span>現在の問題</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded bg-primary/20 border border-primary/30" />
                <span>回答済み</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded bg-background border border-border" />
                <span>未回答</span>
              </div>
            </div>

            <button
              onClick={submitExam}
              disabled={submitting}
              className="w-full rounded-full bg-primary text-primary-foreground py-2.5 text-sm font-medium disabled:opacity-60"
            >
              {submitting ? "提出中..." : "提出する"}
            </button>

            <p className="text-xs text-muted-foreground leading-relaxed">
              未回答の問題は、提出時に未回答として扱われます。
            </p>
          </aside>
        )}
      </div>
    </StudentShell>
  );
}
