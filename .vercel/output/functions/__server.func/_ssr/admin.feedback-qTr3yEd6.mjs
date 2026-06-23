import { r as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-zykuuG8H.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as AdminShell } from "./AdminShell-DmG-blHj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.feedback-qTr3yEd6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminFb() {
	const [rows, setRows] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		(async () => {
			const { data } = await supabase.from("feedback").select("*, students(student_id), questions(question_text)").order("created_at", { ascending: false });
			setRows(data ?? []);
		})();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
		className: "text-2xl font-bold mb-4",
		children: "フィードバック"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-card rounded-2xl p-4 shadow-[var(--shadow-card)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs text-muted-foreground",
					children: [
						new Date(r.created_at).toLocaleString("ja-JP"),
						" · 学籍番号 ",
						r.students?.student_id ?? "—"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-sm font-medium mt-1",
					children: [
						"[",
						r.category,
						"]"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm mt-1",
					children: r.message || "（メッセージなし）"
				}),
				r.questions?.question_text && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs text-muted-foreground mt-2 truncate",
					children: ["対象問題: ", r.questions.question_text]
				})
			]
		}, r.id)), rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground text-center py-10",
			children: "フィードバックはありません"
		})]
	})] });
}
//#endregion
export { AdminFb as component };
