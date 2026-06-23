import { t as supabase } from "./client-zykuuG8H.mjs";
import { n as getStudent } from "./session-BcYkPPYI.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as StudentShell } from "./StudentShell-DWrO16hP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-reu9aZp4.js
var import_jsx_runtime = require_jsx_runtime();
function Dashboard() {
	function logCourseOpen() {
		const s = getStudent();
		if (!s) return;
		(async () => {
			try {
				const { data: course, error: courseError } = await supabase.from("courses").select("id").eq("slug", "c-language-1").maybeSingle();
				if (courseError || !course) {
					console.warn("Course log fetch failed:", courseError);
					return;
				}
				const { error: logError } = await supabase.from("activity_logs").insert({
					student_id: s.id,
					action: "opened_course",
					course_id: course.id
				});
				if (logError) console.warn("Activity log insert failed:", logError);
			} catch (error) {
				console.warn("Activity log failed:", error);
			}
		})();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-card rounded-3xl shadow-[var(--shadow-card)] p-6 sm:p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-primary font-medium",
					children: "Kakomon Practice Hub"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold mt-1",
					children: "過去問コース一覧"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground mt-3 leading-relaxed",
					children: "学習したい過去問コースを選択してください。"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/courses/c-language-1",
				onClick: logCourseOpen,
				className: "group bg-card rounded-3xl shadow-[var(--shadow-card)] p-5 min-h-[150px] hover:-translate-y-1 hover:shadow-lg transition flex flex-col justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-xl",
						children: "📘"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-primary font-medium",
						children: "プログラミング"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl font-bold mt-1",
						children: "Ｃ++言語Ⅰ"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between mt-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-muted-foreground",
						children: "期末試験対策"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-medium group-hover:opacity-90",
						children: "開く →"
					})]
				})]
			})
		})]
	}) });
}
//#endregion
export { Dashboard as component };
