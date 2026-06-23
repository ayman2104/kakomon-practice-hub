import { r as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-zykuuG8H.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as AdminShell } from "./AdminShell-DmG-blHj.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.questions-BhVwo6ep.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TYPES = [
	"multiple_choice",
	"true_false",
	"short_answer",
	"code_output"
];
var DIFFS = [
	"easy",
	"medium",
	"hard"
];
function emptyForm() {
	return {
		id: null,
		question_type: "multiple_choice",
		question_text: "",
		code_block: "",
		choices_json: "[{\"key\":\"A\",\"text\":\"\"},{\"key\":\"B\",\"text\":\"\"}]",
		correct_answer: "",
		explanation: "",
		topic: "",
		difficulty: "easy",
		is_active: true
	};
}
function AdminQuestions() {
	const [items, setItems] = (0, import_react.useState)([]);
	const [courseId, setCourseId] = (0, import_react.useState)("");
	const [filterTopic, setFilterTopic] = (0, import_react.useState)("");
	const [filterDiff, setFilterDiff] = (0, import_react.useState)("");
	const [filterType, setFilterType] = (0, import_react.useState)("");
	const [form, setForm] = (0, import_react.useState)(emptyForm());
	const [showForm, setShowForm] = (0, import_react.useState)(false);
	async function load() {
		const { data: course } = await supabase.from("courses").select("id").eq("slug", "c-language-1").single();
		if (!course) return;
		setCourseId(course.id);
		const { data } = await supabase.from("questions").select("*").eq("course_id", course.id).order("created_at", { ascending: false });
		setItems(data ?? []);
	}
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	const filtered = items.filter((i) => (!filterTopic || i.topic?.includes(filterTopic)) && (!filterDiff || i.difficulty === filterDiff) && (!filterType || i.question_type === filterType));
	async function save() {
		let choices = null;
		if (form.question_type === "multiple_choice") try {
			choices = JSON.parse(form.choices_json);
		} catch {
			return toast.error("choices_json が不正です");
		}
		const payload = {
			course_id: courseId,
			question_type: form.question_type,
			question_text: form.question_text,
			code_block: form.code_block || null,
			choices_json: choices,
			correct_answer: form.correct_answer,
			explanation: form.explanation || null,
			topic: form.topic || null,
			difficulty: form.difficulty,
			is_active: form.is_active
		};
		const { error } = await (form.id ? supabase.from("questions").update(payload).eq("id", form.id) : supabase.from("questions").insert(payload));
		if (error) return toast.error(error.message);
		toast.success("保存しました");
		setShowForm(false);
		setForm(emptyForm());
		load();
	}
	async function del(id) {
		if (!confirm("削除しますか？")) return;
		await supabase.from("questions").delete().eq("id", id);
		load();
	}
	async function toggleActive(q) {
		await supabase.from("questions").update({ is_active: !q.is_active }).eq("id", q.id);
		load();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold",
				children: "Ｃ++言語Ⅰ 問題管理"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => {
					setForm(emptyForm());
					setShowForm(true);
				},
				className: "rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm",
				children: "+ 新規追加"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-card rounded-2xl p-4 shadow-[var(--shadow-card)] mb-4 flex flex-wrap gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					placeholder: "トピックで絞り込み",
					value: filterTopic,
					onChange: (e) => setFilterTopic(e.target.value),
					className: "rounded-lg border border-border px-3 py-2 text-sm"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: filterDiff,
					onChange: (e) => setFilterDiff(e.target.value),
					className: "rounded-lg border border-border px-3 py-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "難易度すべて"
					}), DIFFS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: d }, d))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: filterType,
					onChange: (e) => setFilterType(e.target.value),
					className: "rounded-lg border border-border px-3 py-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "種別すべて"
					}), TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: t }, t))]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2",
			children: [filtered.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-card rounded-2xl p-4 shadow-[var(--shadow-card)] flex justify-between gap-3 items-start",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: [
								q.question_type,
								" · ",
								q.topic || "—",
								" · ",
								q.difficulty,
								" ",
								!q.is_active && "· 非公開"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium truncate",
							children: q.question_text
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground mt-1",
							children: ["正解: ", q.correct_answer]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-1 shrink-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								setForm({
									...emptyForm(),
									...q,
									choices_json: q.choices_json ? JSON.stringify(q.choices_json) : "[]",
									code_block: q.code_block ?? "",
									explanation: q.explanation ?? "",
									topic: q.topic ?? ""
								});
								setShowForm(true);
							},
							className: "text-xs rounded-full bg-secondary px-3 py-1",
							children: "編集"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => toggleActive(q),
							className: "text-xs rounded-full bg-secondary px-3 py-1",
							children: q.is_active ? "無効化" : "有効化"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => del(q.id),
							className: "text-xs rounded-full bg-destructive text-destructive-foreground px-3 py-1",
							children: "削除"
						})
					]
				})]
			}, q.id)), filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground text-center py-10",
				children: "問題がありません"
			})]
		}),
		showForm && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 bg-black/40 flex items-start justify-center p-4 overflow-y-auto z-50",
			onClick: () => setShowForm(false),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-card rounded-3xl p-6 max-w-2xl w-full my-8 space-y-3",
				onClick: (e) => e.stopPropagation(),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-bold text-lg",
						children: form.id ? "問題を編集" : "問題を追加"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "種別",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: form.question_type,
							onChange: (e) => setForm({
								...form,
								question_type: e.target.value
							}),
							className: "w-full rounded-lg border border-border px-3 py-2",
							children: TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: t }, t))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "問題文",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: form.question_text,
							onChange: (e) => setForm({
								...form,
								question_text: e.target.value
							}),
							rows: 3,
							className: "w-full rounded-lg border border-border px-3 py-2"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "コード (任意)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: form.code_block,
							onChange: (e) => setForm({
								...form,
								code_block: e.target.value
							}),
							rows: 4,
							className: "w-full rounded-lg border border-border px-3 py-2 font-mono text-sm"
						})
					}),
					form.question_type === "multiple_choice" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "選択肢 JSON (例: [{\"key\":\"A\",\"text\":\"...\"}])",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: form.choices_json,
							onChange: (e) => setForm({
								...form,
								choices_json: e.target.value
							}),
							rows: 4,
							className: "w-full rounded-lg border border-border px-3 py-2 font-mono text-xs"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "正解",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: form.correct_answer,
							onChange: (e) => setForm({
								...form,
								correct_answer: e.target.value
							}),
							className: "w-full rounded-lg border border-border px-3 py-2"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "解説",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: form.explanation,
							onChange: (e) => setForm({
								...form,
								explanation: e.target.value
							}),
							rows: 2,
							className: "w-full rounded-lg border border-border px-3 py-2"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "トピック",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: form.topic,
								onChange: (e) => setForm({
									...form,
									topic: e.target.value
								}),
								className: "w-full rounded-lg border border-border px-3 py-2"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "難易度",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: form.difficulty,
								onChange: (e) => setForm({
									...form,
									difficulty: e.target.value
								}),
								className: "w-full rounded-lg border border-border px-3 py-2",
								children: DIFFS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: d }, d))
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: form.is_active,
							onChange: (e) => setForm({
								...form,
								is_active: e.target.checked
							})
						}), "有効"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-end gap-2 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setShowForm(false),
							className: "rounded-full bg-secondary px-4 py-2 text-sm",
							children: "キャンセル"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: save,
							className: "rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm",
							children: "保存"
						})]
					})
				]
			})
		})
	] });
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: "block text-xs font-medium text-muted-foreground mb-1",
		children: label
	}), children] });
}
//#endregion
export { AdminQuestions as component };
