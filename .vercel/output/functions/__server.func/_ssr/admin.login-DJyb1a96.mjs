import { r as __toESM } from "../_runtime.mjs";
import { i as setAdmin } from "./session-BcYkPPYI.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.login-DJyb1a96.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminLogin() {
	const navigate = useNavigate();
	const [pin, setPin] = (0, import_react.useState)("");
	function submit(e) {
		e.preventDefault();
		if (pin === "admin2026") {
			setAdmin(true);
			toast.success("ログインしました");
			navigate({ to: "/admin" });
		} else toast.error("PINが正しくありません");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[oklch(0.96_0.03_15)] to-[oklch(0.93_0.05_20)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm bg-card rounded-3xl shadow-[var(--shadow-soft)] p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-bold text-center",
					children: "管理者ログイン"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-center text-muted-foreground mt-1",
					children: "PINを入力してください"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: submit,
					className: "mt-5 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "password",
						value: pin,
						onChange: (e) => setPin(e.target.value),
						placeholder: "PIN",
						className: "w-full rounded-xl border border-border bg-input/40 px-4 py-3 outline-none focus:border-primary"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "w-full rounded-full bg-primary text-primary-foreground py-3 font-medium",
						children: "ログイン"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] text-center text-muted-foreground mt-4",
					children: "デフォルト: admin2026"
				})
			]
		})
	});
}
//#endregion
export { AdminLogin as component };
