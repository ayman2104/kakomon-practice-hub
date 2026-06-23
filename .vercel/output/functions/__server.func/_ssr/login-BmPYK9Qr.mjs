import { r as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-zykuuG8H.mjs";
import { a as setStudent } from "./session-BcYkPPYI.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-BmPYK9Qr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const navigate = useNavigate();
	const [studentId, setStudentId] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	async function handleLogin(e) {
		e.preventDefault();
		const sid = studentId.trim();
		if (!sid) return toast.error("学籍番号を入力してください");
		if (!/^\d+$/.test(sid)) return toast.error("学籍番号は数字のみで入力してください");
		setLoading(true);
		try {
			const { data: existing } = await supabase.from("students").select("*").eq("student_id", sid).maybeSingle();
			let student = existing;
			if (!student) {
				const { data: created, error } = await supabase.from("students").insert({
					student_id: sid,
					last_login_at: (/* @__PURE__ */ new Date()).toISOString()
				}).select().single();
				if (error) throw error;
				student = created;
			} else await supabase.from("students").update({ last_login_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", student.id);
			await supabase.from("activity_logs").insert({
				student_id: student.id,
				action: "logged_in"
			});
			setStudent({
				id: student.id,
				student_id: student.student_id
			});
			toast.success("ログインしました");
			navigate({ to: "/dashboard" });
		} catch (err) {
			console.error(err);
			toast.error("ログインに失敗しました");
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-[oklch(0.97_0.025_15)] to-[oklch(0.94_0.04_20)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center mb-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground text-2xl shadow-[var(--shadow-soft)] mb-3",
						children: "📚"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-lg font-medium text-primary tracking-wide",
						children: "Kakomon Practice Hub"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-card rounded-3xl shadow-[var(--shadow-soft)] p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl font-bold text-center text-foreground",
							children: "過去問練習システム"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-center text-sm text-muted-foreground mt-2",
							children: "学籍番号を入力してログインしてください"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleLogin,
							className: "mt-6 space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-sm font-medium mb-2",
									children: "学籍番号"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									inputMode: "numeric",
									value: studentId,
									onChange: (e) => setStudentId(e.target.value),
									placeholder: "2XXXXXX",
									className: "w-full rounded-xl border border-border bg-input/40 px-4 py-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									disabled: loading,
									className: "w-full rounded-full bg-primary hover:opacity-90 text-primary-foreground font-medium py-3 transition shadow-[var(--shadow-card)] disabled:opacity-60",
									children: loading ? "ログイン中..." : "ログイン"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-center text-muted-foreground",
									children: "※パスワードは不要です"
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-center mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/admin/login",
						className: "text-xs text-muted-foreground hover:text-primary",
						children: "管理者ログイン"
					})
				})
			]
		})
	});
}
//#endregion
export { LoginPage as component };
