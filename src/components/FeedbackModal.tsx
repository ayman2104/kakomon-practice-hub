import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getStudent } from "@/lib/session";
import { toast } from "sonner";

const CATEGORIES = [
  "答えが間違っている",
  "解説がわかりにくい",
  "誤字・脱字",
  "問題文がわかりにくい",
  "その他",
];

export function FeedbackModal({
  questionId,
  courseId,
  onClose,
}: {
  questionId: string;
  courseId?: string | null;
  onClose: () => void;
}) {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    setSubmitting(true);
    const s = getStudent();
    const { error } = await supabase.from("feedback").insert({
      student_id: s?.id ?? null,
      course_id: courseId ?? null,
      question_id: questionId,
      category,
      message,
    });
    setSubmitting(false);
    if (error) return toast.error("送信に失敗しました");
    toast.success("フィードバックを送信しました");
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-card rounded-3xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-bold text-lg">問題を報告する</h3>
        <div className="mt-4 space-y-3">
          <div>
            <label className="text-sm font-medium block mb-1">カテゴリ</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-xl border border-border bg-input/40 px-3 py-2">
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">メッセージ</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} className="w-full rounded-xl border border-border bg-input/40 px-3 py-2" />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="rounded-full bg-secondary px-4 py-2 text-sm">キャンセル</button>
          <button onClick={submit} disabled={submitting} className="rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm disabled:opacity-60">
            {submitting ? "送信中..." : "送信する"}
          </button>
        </div>
      </div>
    </div>
  );
}
