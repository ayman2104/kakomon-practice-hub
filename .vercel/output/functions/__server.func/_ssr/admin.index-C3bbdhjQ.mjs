import { r as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-zykuuG8H.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as AdminShell } from "./AdminShell-DmG-blHj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.index-C3bbdhjQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminDash() {
	const [stats, setStats] = (0, import_react.useState)({
		students: 0,
		questions: 0,
		attempts: 0
	});
	const [logins, setLogins] = (0, import_react.useState)([]);
	const [attempts, setAttempts] = (0, import_react.useState)([]);
	const [feedback, setFeedback] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		(async () => {
			const [s, q, a] = await Promise.all([
				supabase.from("students").select("*", {
					count: "exact",
					head: true
				}),
				supabase.from("questions").select("*", {
					count: "exact",
					head: true
				}),
				supabase.from("attempts").select("*", {
					count: "exact",
					head: true
				})
			]);
			setStats({
				students: s.count ?? 0,
				questions: q.count ?? 0,
				attempts: a.count ?? 0
			});
			const { data: l } = await supabase.from("activity_logs").select("*, students(student_id)").eq("action", "logged_in").order("created_at", { ascending: false }).limit(10);
			setLogins(l ?? []);
			const { data: at } = await supabase.from("attempts").select("*, students(student_id)").order("started_at", { ascending: false }).limit(10);
			setAttempts(at ?? []);
			const { data: fb } = await supabase.from("feedback").select("*").order("created_at", { ascending: false }).limit(10);
			setFeedback(fb ?? []);
		})();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold mb-4",
			children: "ダッシュボード"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid sm:grid-cols-3 gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "学生数",
					value: stats.students
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Ｃ++言語Ⅰ 問題数",
					value: stats.questions
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "挑戦数",
					value: stats.attempts
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid md:grid-cols-2 gap-4 mt-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "最近のログイン",
					rows: logins.map((l) => `${l.students?.student_id ?? "?"} — ${new Date(l.created_at).toLocaleString("ja-JP")}`)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "最近の挑戦",
					rows: attempts.map((a) => `${a.students?.student_id ?? "?"} (${a.mode}) ${a.score != null ? `${a.score}/${a.total_questions}` : "進行中"}`)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "最近のフィードバック",
					rows: feedback.map((f) => `[${f.category}] ${f.message?.slice(0, 60) ?? ""}`)
				})
			]
		})
	] });
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-card rounded-2xl p-5 shadow-[var(--shadow-card)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-3xl font-bold mt-1",
			children: value
		})]
	});
}
function Panel({ title, rows }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-card rounded-2xl p-5 shadow-[var(--shadow-card)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "font-semibold mb-2",
			children: title
		}), rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "データなし"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-1.5 text-sm",
			children: rows.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "border-b border-border/40 pb-1",
				children: r
			}, i))
		})]
	});
}
//#endregion
export { AdminDash as component };
