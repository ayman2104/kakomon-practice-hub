import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { f as Outlet, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as StudentShell } from "./StudentShell-DWrO16hP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/courses.c-language-1-Be-szXtk.js
var import_jsx_runtime = require_jsx_runtime();
function CoursePage() {
	if (useRouterState({ select: (state) => state.location.pathname }) !== "/courses/c-language-1") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
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
					children: "Ｃ++言語Ⅰ"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground mt-3 leading-relaxed",
					children: "ランダム問題または期末試験形式で、Ｃ++言語Ⅰの過去問対策を行います。"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/courses/c-language-1/practice",
				className: "group bg-card rounded-3xl shadow-[var(--shadow-card)] p-5 min-h-[160px] hover:-translate-y-1 hover:shadow-lg transition flex flex-col justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-xl",
						children: "🎲"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-primary font-medium",
							children: "練習モード"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl font-bold mt-1",
							children: "ランダム問題"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-2 leading-relaxed",
							children: "出題数・範囲・難易度を選んで練習できます。"
						})
					] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between mt-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-muted-foreground",
						children: "4択問題"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-medium group-hover:opacity-90",
						children: "開く →"
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/courses/c-language-1/exams/final-2026-first",
				className: "group bg-card rounded-3xl shadow-[var(--shadow-card)] p-5 min-h-[160px] hover:-translate-y-1 hover:shadow-lg transition flex flex-col justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-xl",
						children: "📝"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-primary font-medium",
							children: "試験モード"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl font-bold mt-1",
							children: "期末試験 2026 前期"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-2 leading-relaxed",
							children: "本番に近い形式で、期末試験の対策を行います。"
						})
					] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between mt-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-muted-foreground",
						children: "固定問題"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-medium group-hover:opacity-90",
						children: "開く →"
					})]
				})]
			})]
		})]
	}) });
}
//#endregion
export { CoursePage as component };
