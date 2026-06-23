import { r as __toESM } from "../_runtime.mjs";
import { i as setAdmin, r as isAdmin } from "./session-BcYkPPYI.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AdminShell-DmG-blHj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminShell({ children }) {
	const navigate = useNavigate();
	const [ok, setOk] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!isAdmin()) navigate({ to: "/admin/login" });
		else setOk(true);
	}, [navigate]);
	if (!ok) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-[oklch(0.97_0.02_15)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "bg-card border-b border-border",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-6xl mx-auto px-4 py-3 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-lg",
						children: "⚙️"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium",
						children: "管理画面 — Kakomon Practice Hub"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => {
						setAdmin(false);
						navigate({ to: "/admin/login" });
					},
					className: "text-xs rounded-full bg-secondary px-3 py-1.5",
					children: "ログアウト"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "max-w-6xl mx-auto px-4 pb-3 flex flex-wrap gap-1.5 text-sm",
				children: [
					["ダッシュボード", "/admin"],
					["問題管理", "/admin/questions"],
					["AI生成", "/admin/ai-generator"],
					["フィードバック", "/admin/feedback"],
					["アクティビティ", "/admin/activity-logs"]
				].map(([l, h]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: h,
					className: "rounded-full px-3 py-1.5 hover:bg-accent",
					activeProps: { className: "rounded-full px-3 py-1.5 bg-primary text-primary-foreground" },
					children: l
				}, h))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "max-w-6xl mx-auto px-4 py-6",
			children
		})]
	});
}
//#endregion
export { AdminShell as t };
