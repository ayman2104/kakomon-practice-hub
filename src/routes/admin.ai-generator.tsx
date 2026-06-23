import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/AdminShell";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/ai-generator")({
  head: () => ({ meta: [{ title: "AI問題生成" }] }),
  component: AIGen,
});

const MOCK = [
  { question_type: "multiple_choice", question_text: "C言語で変数を宣言するキーワードはどれですか？", choices_json: [{ key: "A", text: "int" }, { key: "B", text: "var" }, { key: "C", text: "let" }, { key: "D", text: "string" }], correct_answer: "A", explanation: "C言語では型キーワード（int等）で宣言します。", topic: "変数", difficulty: "easy" },
  { question_type: "true_false", question_text: "C言語では文末にセミコロンが必要です。", correct_answer: "true", explanation: "文末には必ず ; を付けます。", topic: "文法", difficulty: "easy" },
  { question_type: "short_answer", question_text: "標準出力に文字列を表示する関数名は？", correct_answer: "printf", explanation: "printf関数を使います。", topic: "printf", difficulty: "easy" },
];

function AIGen() {
  const [material, setMaterial] = useState("");
  const [past, setPast] = useState("");
  const [generated, setGenerated] = useState<any[]>([]);
  const [selected, setSelected] = useState<Record<number, boolean>>({});

  function generate() {
    if (!material.trim() && !past.trim()) return toast.error("教材または過去問を入力してください");
    setGenerated(MOCK.map((m) => ({ ...m })));
    setSelected(Object.fromEntries(MOCK.map((_, i) => [i, true])));
    toast.success("モック問題を生成しました");
  }

  async function save() {
    const { data: course } = await supabase.from("courses").select("id").eq("slug", "c-language-1").single();
    if (!course) return;
    const rows = generated.filter((_, i) => selected[i]).map((g) => ({ ...g, course_id: course.id, is_active: true }));
    if (rows.length === 0) return toast.error("選択してください");
    const { error } = await supabase.from("questions").insert(rows);
    if (error) return toast.error(error.message);
    toast.success(`${rows.length}問を保存しました`);
    setGenerated([]); setSelected({});
  }

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold mb-1">AI問題生成 — Ｃ++言語Ⅰ</h1>
      <p className="text-sm text-muted-foreground mb-4">※現在はモック生成です。将来 Edge Function で実AIに接続予定。</p>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-card rounded-2xl p-4 shadow-[var(--shadow-card)]">
          <label className="text-sm font-medium block mb-2">教材テキスト</label>
          <textarea value={material} onChange={(e) => setMaterial(e.target.value)} rows={8} className="w-full rounded-lg border border-border px-3 py-2 text-sm" placeholder="Ｃ++言語Ⅰの教材を貼り付け..." />
        </div>
        <div className="bg-card rounded-2xl p-4 shadow-[var(--shadow-card)]">
          <label className="text-sm font-medium block mb-2">過去問</label>
          <textarea value={past} onChange={(e) => setPast(e.target.value)} rows={8} className="w-full rounded-lg border border-border px-3 py-2 text-sm" placeholder="過去問を貼り付け..." />
        </div>
      </div>
      <button onClick={generate} className="mt-4 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium">Generate Questions</button>

      {generated.length > 0 && (
        <div className="mt-6 space-y-3">
          <h2 className="font-semibold">生成された問題（編集可）</h2>
          {generated.map((g, i) => (
            <div key={i} className="bg-card rounded-2xl p-4 shadow-[var(--shadow-card)] space-y-2">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!selected[i]} onChange={(e) => setSelected({ ...selected, [i]: e.target.checked })} /> 保存対象</label>
              <input value={g.question_text} onChange={(e) => { const arr = [...generated]; arr[i] = { ...g, question_text: e.target.value }; setGenerated(arr); }} className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
              <div className="grid grid-cols-2 gap-2">
                <input value={g.correct_answer} onChange={(e) => { const arr = [...generated]; arr[i] = { ...g, correct_answer: e.target.value }; setGenerated(arr); }} placeholder="正解" className="rounded-lg border border-border px-3 py-2 text-sm" />
                <input value={g.topic} onChange={(e) => { const arr = [...generated]; arr[i] = { ...g, topic: e.target.value }; setGenerated(arr); }} placeholder="トピック" className="rounded-lg border border-border px-3 py-2 text-sm" />
              </div>
              <textarea value={g.explanation} onChange={(e) => { const arr = [...generated]; arr[i] = { ...g, explanation: e.target.value }; setGenerated(arr); }} rows={2} className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
            </div>
          ))}
          <button onClick={save} className="rounded-full bg-primary text-primary-foreground px-5 py-2 text-sm font-medium">問題バンクに保存</button>
        </div>
      )}
    </AdminShell>
  );
}
