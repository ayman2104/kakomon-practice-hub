import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/AdminShell";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/questions")({
  head: () => ({ meta: [{ title: "問題管理" }] }),
  component: AdminQuestions,
});

const TYPES = ["multiple_choice", "true_false", "short_answer", "code_output"];
const DIFFS = ["easy", "medium", "hard"];

function emptyForm() {
  return {
    id: null as string | null,
    question_type: "multiple_choice",
    question_text: "",
    code_block: "",
    choices_json: '[{"key":"A","text":""},{"key":"B","text":""}]',
    correct_answer: "",
    explanation: "",
    topic: "",
    difficulty: "easy",
    is_active: true,
  };
}

function AdminQuestions() {
  const [items, setItems] = useState<any[]>([]);
  const [courseId, setCourseId] = useState<string>("");
  const [filterTopic, setFilterTopic] = useState("");
  const [filterDiff, setFilterDiff] = useState("");
  const [filterType, setFilterType] = useState("");
  const [form, setForm] = useState(emptyForm());
  const [showForm, setShowForm] = useState(false);

  async function load() {
    const { data: course } = await supabase.from("courses").select("id").eq("slug", "c-language-1").single();
    if (!course) return;
    setCourseId(course.id);
    let q = supabase.from("questions").select("*").eq("course_id", course.id).order("created_at", { ascending: false });
    const { data } = await q;
    setItems(data ?? []);
  }
  useEffect(() => { load(); }, []);

  const filtered = items.filter((i) =>
    (!filterTopic || i.topic?.includes(filterTopic)) &&
    (!filterDiff || i.difficulty === filterDiff) &&
    (!filterType || i.question_type === filterType)
  );

  async function save() {
    let choices: any = null;
    if (form.question_type === "multiple_choice") {
      try { choices = JSON.parse(form.choices_json); } catch { return toast.error("choices_json が不正です"); }
    }
    const payload: any = {
      course_id: courseId,
      question_type: form.question_type,
      question_text: form.question_text,
      code_block: form.code_block || null,
      choices_json: choices,
      correct_answer: form.correct_answer,
      explanation: form.explanation || null,
      topic: form.topic || null,
      difficulty: form.difficulty,
      is_active: form.is_active,
    };
    const op = form.id
      ? supabase.from("questions").update(payload).eq("id", form.id)
      : supabase.from("questions").insert(payload);
    const { error } = await op;
    if (error) return toast.error(error.message);
    toast.success("保存しました");
    setShowForm(false); setForm(emptyForm()); load();
  }
  async function del(id: string) {
    if (!confirm("削除しますか？")) return;
    await supabase.from("questions").delete().eq("id", id);
    load();
  }
  async function toggleActive(q: any) {
    await supabase.from("questions").update({ is_active: !q.is_active }).eq("id", q.id);
    load();
  }

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Ｃ++言語Ⅰ 問題管理</h1>
        <button onClick={() => { setForm(emptyForm()); setShowForm(true); }} className="rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm">+ 新規追加</button>
      </div>

      <div className="bg-card rounded-2xl p-4 shadow-[var(--shadow-card)] mb-4 flex flex-wrap gap-3">
        <input placeholder="トピックで絞り込み" value={filterTopic} onChange={(e) => setFilterTopic(e.target.value)} className="rounded-lg border border-border px-3 py-2 text-sm" />
        <select value={filterDiff} onChange={(e) => setFilterDiff(e.target.value)} className="rounded-lg border border-border px-3 py-2 text-sm">
          <option value="">難易度すべて</option>{DIFFS.map((d) => <option key={d}>{d}</option>)}
        </select>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="rounded-lg border border-border px-3 py-2 text-sm">
          <option value="">種別すべて</option>{TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>

      <div className="space-y-2">
        {filtered.map((q) => (
          <div key={q.id} className="bg-card rounded-2xl p-4 shadow-[var(--shadow-card)] flex justify-between gap-3 items-start">
            <div className="flex-1 min-w-0">
              <div className="text-xs text-muted-foreground">{q.question_type} · {q.topic || "—"} · {q.difficulty} {!q.is_active && "· 非公開"}</div>
              <div className="font-medium truncate">{q.question_text}</div>
              <div className="text-xs text-muted-foreground mt-1">正解: {q.correct_answer}</div>
            </div>
            <div className="flex flex-col gap-1 shrink-0">
              <button onClick={() => { setForm({ ...emptyForm(), ...q, choices_json: q.choices_json ? JSON.stringify(q.choices_json) : "[]", code_block: q.code_block ?? "", explanation: q.explanation ?? "", topic: q.topic ?? "" }); setShowForm(true); }} className="text-xs rounded-full bg-secondary px-3 py-1">編集</button>
              <button onClick={() => toggleActive(q)} className="text-xs rounded-full bg-secondary px-3 py-1">{q.is_active ? "無効化" : "有効化"}</button>
              <button onClick={() => del(q.id)} className="text-xs rounded-full bg-destructive text-destructive-foreground px-3 py-1">削除</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-10">問題がありません</p>}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-start justify-center p-4 overflow-y-auto z-50" onClick={() => setShowForm(false)}>
          <div className="bg-card rounded-3xl p-6 max-w-2xl w-full my-8 space-y-3" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-lg">{form.id ? "問題を編集" : "問題を追加"}</h3>
            <Field label="種別">
              <select value={form.question_type} onChange={(e) => setForm({ ...form, question_type: e.target.value })} className="w-full rounded-lg border border-border px-3 py-2">
                {TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="問題文"><textarea value={form.question_text} onChange={(e) => setForm({ ...form, question_text: e.target.value })} rows={3} className="w-full rounded-lg border border-border px-3 py-2" /></Field>
            <Field label="コード (任意)"><textarea value={form.code_block} onChange={(e) => setForm({ ...form, code_block: e.target.value })} rows={4} className="w-full rounded-lg border border-border px-3 py-2 font-mono text-sm" /></Field>
            {form.question_type === "multiple_choice" && (
              <Field label='選択肢 JSON (例: [{"key":"A","text":"..."}])'>
                <textarea value={form.choices_json} onChange={(e) => setForm({ ...form, choices_json: e.target.value })} rows={4} className="w-full rounded-lg border border-border px-3 py-2 font-mono text-xs" />
              </Field>
            )}
            <Field label="正解"><input value={form.correct_answer} onChange={(e) => setForm({ ...form, correct_answer: e.target.value })} className="w-full rounded-lg border border-border px-3 py-2" /></Field>
            <Field label="解説"><textarea value={form.explanation} onChange={(e) => setForm({ ...form, explanation: e.target.value })} rows={2} className="w-full rounded-lg border border-border px-3 py-2" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="トピック"><input value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} className="w-full rounded-lg border border-border px-3 py-2" /></Field>
              <Field label="難易度">
                <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} className="w-full rounded-lg border border-border px-3 py-2">
                  {DIFFS.map((d) => <option key={d}>{d}</option>)}
                </select>
              </Field>
            </div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />有効</label>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowForm(false)} className="rounded-full bg-secondary px-4 py-2 text-sm">キャンセル</button>
              <button onClick={save} className="rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm">保存</button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

function Field({ label, children }: any) {
  return <div><label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>{children}</div>;
}
