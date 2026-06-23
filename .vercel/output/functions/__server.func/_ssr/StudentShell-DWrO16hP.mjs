import { r as __toESM } from "../_runtime.mjs";
import { n as getStudent, t as clearStudent } from "./session-BcYkPPYI.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/StudentShell-DWrO16hP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function StudentShell({ children }) {
	const navigate = useNavigate();
	const [student, setStudentState] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const s = getStudent();
		if (!s) {
			navigate({ to: "/login" });
			return;
		}
		setStudentState(s);
	}, [navigate]);
	if (!student) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center text-muted-foreground",
		children: "読み込み中..."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-gradient-to-br from-[oklch(0.98_0.02_15)] to-[oklch(0.95_0.035_20)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "bg-card/80 backdrop-blur border-b border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-5xl mx-auto px-4 py-3 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: "/dashboard",
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xl",
						children: "📚"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium text-primary",
						children: "Kakomon Practice Hub"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground hidden sm:inline",
							children: "学籍番号:"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: student.student_id
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								clearStudent();
								navigate({ to: "/login" });
							},
							className: "rounded-full bg-secondary hover:bg-accent px-3 py-1.5 text-xs text-secondary-foreground",
							children: "ログアウト"
						})
					]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "max-w-5xl mx-auto px-4 py-8",
			children
		})]
	});
}
//#endregion
export { StudentShell as t };
