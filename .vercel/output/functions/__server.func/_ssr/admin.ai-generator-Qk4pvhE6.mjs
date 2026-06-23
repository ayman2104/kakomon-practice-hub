import { r as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-zykuuG8H.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as AdminShell } from "./AdminShell-DmG-blHj.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.ai-generator-Qk4pvhE6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MOCK = [
	{
		question_type: "multiple_choice",
		question_text: "C言語で変数を宣言するキーワードはどれですか？",
		choices_json: [
			{
				key: "A",
				text: "int"
			},
			{
				key: "B",
				text: "var"
			},
			{
				key: "C",
				text: "let"
			},
			{
				key: "D",
				text: "string"
			}
		],
		correct_answer: "A",
		explanation: "C言語では型キーワード（int等）で宣言します。",
		topic: "変数",
		difficulty: "easy"
	},
	{
		question_type: "true_false",
		question_text: "C言語では文末にセミコロンが必要です。",
		correct_answer: "true",
		explanation: "文末には必ず ; を付けます。",
		topic: "文法",
		difficulty: "easy"
	},
	{
		question_type: "short_answer",
		question_text: "標準出力に文字列を表示する関数名は？",
		correct_answer: "printf",
		explanation: "printf関数を使います。",
		topic: "printf",
		difficulty: "easy"
	}
];
function AIGen() {
	const [material, setMaterial] = (0, import_react.useState)("");
	const [past, setPast] = (0, import_react.useState)("");
	const [generated, setGenerated] = (0, import_react.useState)([]);
	const [selected, setSelected] = (0, import_react.useState)({});
	function generate() {
		if (!material.trim() && !past.trim()) return toast.error("教材または過去問を入力してください");
		setGenerated(MOCK.map((m) => ({ ...m })));
		setSelected(Object.fromEntries(MOCK.map((_, i) => [i, true])));
		toast.success("モック問題を生成しました");
	}
	async function save() {
		const { data: course } = await supabase.from("courses").select("id").eq("slug", "c-language-1").single();
		if (!course) return;
		const rows = generated.filter((_, i) => selected[i]).map((g) => ({
			...g,
			course_id: course.id,
			is_active: true
		}));
		if (rows.length === 0) return toast.error("選択してください");
		const { error } = await supabase.from("questions").insert(rows);
		if (error) return toast.error(error.message);
		toast.success(`${rows.length}問を保存しました`);
		setGenerated([]);
		setSelected({});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold mb-1",
			children: "AI問題生成 — Ｃ++言語Ⅰ"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground mb-4",
			children: "※現在はモック生成です。将来 Edge Function で実AIに接続予定。"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid md:grid-cols-2 gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-card rounded-2xl p-4 shadow-[var(--shadow-card)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-sm font-medium block mb-2",
					children: "教材テキスト"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: material,
					onChange: (e) => setMaterial(e.target.value),
					rows: 8,
					className: "w-full rounded-lg border border-border px-3 py-2 text-sm",
					placeholder: "Ｃ++言語Ⅰの教材を貼り付け..."
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-card rounded-2xl p-4 shadow-[var(--shadow-card)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-sm font-medium block mb-2",
					children: "過去問"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: past,
					onChange: (e) => setPast(e.target.value),
					rows: 8,
					className: "w-full rounded-lg border border-border px-3 py-2 text-sm",
					placeholder: "過去問を貼り付け..."
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: generate,
			className: "mt-4 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium",
			children: "Generate Questions"
		}),
		generated.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-semibold",
					children: "生成された問題（編集可）"
				}),
				generated.map((g, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-card rounded-2xl p-4 shadow-[var(--shadow-card)] space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: !!selected[i],
								onChange: (e) => setSelected({
									...selected,
									[i]: e.target.checked
								})
							}), " 保存対象"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: g.question_text,
							onChange: (e) => {
								const arr = [...generated];
								arr[i] = {
									...g,
									question_text: e.target.value
								};
								setGenerated(arr);
							},
							className: "w-full rounded-lg border border-border px-3 py-2 text-sm"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: g.correct_answer,
								onChange: (e) => {
									const arr = [...generated];
									arr[i] = {
										...g,
										correct_answer: e.target.value
									};
									setGenerated(arr);
								},
								placeholder: "正解",
								className: "rounded-lg border border-border px-3 py-2 text-sm"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: g.topic,
								onChange: (e) => {
									const arr = [...generated];
									arr[i] = {
										...g,
										topic: e.target.value
									};
									setGenerated(arr);
								},
								placeholder: "トピック",
								className: "rounded-lg border border-border px-3 py-2 text-sm"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: g.explanation,
							onChange: (e) => {
								const arr = [...generated];
								arr[i] = {
									...g,
									explanation: e.target.value
								};
								setGenerated(arr);
							},
							rows: 2,
							className: "w-full rounded-lg border border-border px-3 py-2 text-sm"
						})
					]
				}, i)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: save,
					className: "rounded-full bg-primary text-primary-foreground px-5 py-2 text-sm font-medium",
					children: "問題バンクに保存"
				})
			]
		})
	] });
}
//#endregion
export { AIGen as component };
