import { r as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-zykuuG8H.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Route } from "./attempts._attemptId.result-BZpW53_I.mjs";
import { t as StudentShell } from "./StudentShell-DWrO16hP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/attempts._attemptId.result-5rLZ4Gmm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ResultPage() {
	const { attemptId } = Route.useParams();
	const navigate = useNavigate();
	const [attempt, setAttempt] = (0, import_react.useState)(null);
	const [items, setItems] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		(async () => {
			const { data: a } = await supabase.from("attempts").select("*").eq("id", attemptId).single();
			setAttempt(a);
			const { data } = await supabase.from("attempt_answers").select("*, questions(*)").eq("attempt_id", attemptId);
			setItems(data ?? []);
		})();
	}, [attemptId]);
	if (!attempt) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-center py-20 text-muted-foreground",
		children: "読み込み中..."
	}) });
	const score = attempt.score ?? 0;
	const total = attempt.total_questions ?? items.length;
	const correctCount = items.filter((i) => i.is_correct).length;
	const wrongCount = items.length - correctCount;
	const pct = total ? Math.round(score / total * 100) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-card rounded-3xl shadow-[var(--shadow-card)] p-8 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-bold",
						children: "結果"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 text-5xl font-bold text-primary",
						children: [pct, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xl",
							children: "点"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 text-sm text-muted-foreground",
						children: [
							score,
							" / ",
							total,
							" 問正解"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex justify-center gap-4 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[oklch(0.5_0.15_155)]",
							children: ["正解 ", correctCount]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[oklch(0.55_0.18_25)]",
							children: ["不正解 ", wrongCount]
						})]
					})
				]
			}),
			items.map((it, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-card rounded-3xl shadow-[var(--shadow-card)] p-6 space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm font-medium",
							children: ["問題 ", i + 1]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `text-xs font-bold rounded-full px-2.5 py-0.5 ${it.is_correct ? "bg-[oklch(0.94_0.07_155)] text-[oklch(0.4_0.1_155)]" : "bg-[oklch(0.94_0.07_25)] text-[oklch(0.45_0.15_25)]"}`,
							children: it.is_correct ? "○ 正解" : "× 不正解"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm",
						children: it.questions?.question_text
					}),
					it.questions?.code_block && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "bg-[oklch(0.96_0.015_15)] rounded-xl p-3 text-xs overflow-x-auto font-mono",
						children: it.questions.code_block
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "あなたの回答: "
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: it.student_answer || "（未回答）"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "正しい答え: "
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium text-primary",
							children: it.questions?.correct_answer
						})]
					}),
					it.questions?.explanation && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 bg-accent rounded-xl p-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground mb-1",
							children: "解説"
						}), it.questions.explanation]
					})
				]
			}, it.id)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2 justify-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => navigate({ to: "/courses/c-language-1/exams/final-2026-first" }),
					className: "rounded-full bg-primary text-primary-foreground px-5 py-2 text-sm",
					children: "もう一度挑戦する"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => navigate({ to: "/courses/c-language-1" }),
					className: "rounded-full bg-secondary px-5 py-2 text-sm",
					children: "コースに戻る"
				})]
			})
		]
	}) });
}
//#endregion
export { ResultPage as component };
