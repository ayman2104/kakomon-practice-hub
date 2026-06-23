export function QuestionView({ q, value, onChange, disabled }: any) {
  const choices: any[] = Array.isArray(q.choices_json) ? q.choices_json : [];
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 text-xs">
        {q.topic && <span className="rounded-full bg-accent text-accent-foreground px-2.5 py-0.5">{q.topic}</span>}
        {q.difficulty && <span className="rounded-full bg-secondary text-secondary-foreground px-2.5 py-0.5">{q.difficulty}</span>}
        <span className="rounded-full bg-primary/10 text-primary px-2.5 py-0.5">{labelType(q.question_type)}</span>
      </div>
      <p className="text-base leading-relaxed whitespace-pre-wrap">{q.question_text}</p>
      {q.code_block && (
        <pre className="bg-[oklch(0.96_0.015_15)] rounded-2xl p-4 text-sm overflow-x-auto font-mono border border-border">
{q.code_block}
        </pre>
      )}

      {q.question_type === "multiple_choice" && (
        <div className="space-y-2">
          {choices.map((c) => (
            <label key={c.key} className={`flex items-center gap-3 rounded-2xl border border-border px-4 py-3 cursor-pointer hover:bg-accent ${value === c.key ? "border-primary bg-primary/5" : ""}`}>
              <input type="radio" name="ans" disabled={disabled} checked={value === c.key} onChange={() => onChange(c.key)} className="accent-primary" />
              <span className="font-medium w-6">{c.key}.</span>
              <span>{c.text}</span>
            </label>
          ))}
        </div>
      )}
      {q.question_type === "true_false" && (
        <div className="flex gap-3">
          {["true", "false"].map((v) => (
            <button key={v} disabled={disabled} onClick={() => onChange(v)}
              className={`flex-1 rounded-2xl border border-border px-4 py-3 ${value === v ? "border-primary bg-primary/10" : "hover:bg-accent"}`}>
              {v === "true" ? "○ 正しい" : "× 間違い"}
            </button>
          ))}
        </div>
      )}
      {(q.question_type === "short_answer" || q.question_type === "code_output") && (
        <input type="text" disabled={disabled} value={value || ""} onChange={(e) => onChange(e.target.value)}
          placeholder="答えを入力" className="w-full rounded-xl border border-border bg-input/40 px-4 py-3 font-mono" />
      )}
    </div>
  );
}

function labelType(t: string) {
  return { multiple_choice: "選択式", true_false: "○×", short_answer: "記述", code_output: "出力" }[t as string] || t;
}

export function isAnswerCorrect(q: any, ans: string) {
  if (!ans) return false;

  const normalize = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replaceAll("，", ",")
      .replaceAll("、", ",")
      .replaceAll(" ", "")
      .replaceAll("　", "");

  function tryParseObject(value: string) {
    try {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      return null;
    }

    return null;
  }

  const correctObject = tryParseObject(String(q.correct_answer));
  const answerObject = tryParseObject(ans);

  if (correctObject && answerObject) {
    return Object.keys(correctObject).every((key) => {
      return normalize(String(answerObject[key] ?? "")) === normalize(String(correctObject[key] ?? ""));
    });
  }

  return normalize(ans) === normalize(String(q.correct_answer));
}
