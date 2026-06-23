import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, j as redirect, m as createFileRoute, p as lazyRouteComponent, s as Scripts, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as Route$13 } from "./attempts._attemptId.result-BZpW53_I.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BWSy8wOd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-Jkdp4rhy.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "ページが見つかりません"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:opacity-90",
						children: "ホームへ戻る"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold text-foreground",
					children: "エラーが発生しました"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: error.message
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
						children: "再試行"
					})
				})
			]
		})
	});
}
var Route$12 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Kakomon Practice Hub" },
			{
				name: "description",
				content: "過去問練習システム"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "ja",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$12.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
			position: "top-center",
			richColors: true
		})]
	});
}
var $$splitComponentImporter$11 = () => import("./login-BmPYK9Qr.mjs");
var Route$11 = createFileRoute("/login")({
	head: () => ({ meta: [{ title: "ログイン | Kakomon Practice Hub" }] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./dashboard-reu9aZp4.mjs");
var Route$10 = createFileRoute("/dashboard")({
	head: () => ({ meta: [{ title: "コース一覧 | Kakomon Practice Hub" }] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./routes-DTEZEvkE.mjs");
var Route$9 = createFileRoute("/")({
	beforeLoad: () => {
		throw redirect({ to: "/login" });
	},
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./admin.index-C3bbdhjQ.mjs");
var Route$8 = createFileRoute("/admin/")({
	head: () => ({ meta: [{ title: "管理ダッシュボード" }] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./courses.c-language-1-Be-szXtk.mjs");
var Route$7 = createFileRoute("/courses/c-language-1")({
	head: () => ({ meta: [{ title: "Ｃ++言語Ⅰ | Kakomon Practice Hub" }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./admin.questions-BhVwo6ep.mjs");
var Route$6 = createFileRoute("/admin/questions")({
	head: () => ({ meta: [{ title: "問題管理" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./admin.login-DJyb1a96.mjs");
var Route$5 = createFileRoute("/admin/login")({
	head: () => ({ meta: [{ title: "管理者ログイン" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./admin.feedback-qTr3yEd6.mjs");
var Route$4 = createFileRoute("/admin/feedback")({
	head: () => ({ meta: [{ title: "フィードバック" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./admin.ai-generator-Qk4pvhE6.mjs");
var Route$3 = createFileRoute("/admin/ai-generator")({
	head: () => ({ meta: [{ title: "AI問題生成" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./admin.activity-logs-BDmaLsKd.mjs");
var Route$2 = createFileRoute("/admin/activity-logs")({
	head: () => ({ meta: [{ title: "アクティビティログ" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./courses.c-language-1.practice-D1KKMYFb.mjs");
var Route$1 = createFileRoute("/courses/c-language-1/practice")({
	head: () => ({ meta: [{ title: "ランダム問題 | Ｃ++言語Ⅰ" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./courses.c-language-1.exams.final-2026-first-t-XSs6GI.mjs");
var Route = createFileRoute("/courses/c-language-1/exams/final-2026-first")({
	head: () => ({ meta: [{ title: "期末試験 2026 前期 | Ｃ++言語Ⅰ" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var LoginRoute = Route$11.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$12
});
var DashboardRoute = Route$10.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => Route$12
});
var IndexRoute = Route$9.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$12
});
var AdminIndexRoute = Route$8.update({
	id: "/admin/",
	path: "/admin/",
	getParentRoute: () => Route$12
});
var CoursesCLanguage1Route = Route$7.update({
	id: "/courses/c-language-1",
	path: "/courses/c-language-1",
	getParentRoute: () => Route$12
});
var AdminQuestionsRoute = Route$6.update({
	id: "/admin/questions",
	path: "/admin/questions",
	getParentRoute: () => Route$12
});
var AdminLoginRoute = Route$5.update({
	id: "/admin/login",
	path: "/admin/login",
	getParentRoute: () => Route$12
});
var AdminFeedbackRoute = Route$4.update({
	id: "/admin/feedback",
	path: "/admin/feedback",
	getParentRoute: () => Route$12
});
var AdminAiGeneratorRoute = Route$3.update({
	id: "/admin/ai-generator",
	path: "/admin/ai-generator",
	getParentRoute: () => Route$12
});
var AdminActivityLogsRoute = Route$2.update({
	id: "/admin/activity-logs",
	path: "/admin/activity-logs",
	getParentRoute: () => Route$12
});
var CoursesCLanguage1PracticeRoute = Route$1.update({
	id: "/practice",
	path: "/practice",
	getParentRoute: () => CoursesCLanguage1Route
});
var AttemptsAttemptIdResultRoute = Route$13.update({
	id: "/attempts/$attemptId/result",
	path: "/attempts/$attemptId/result",
	getParentRoute: () => Route$12
});
var CoursesCLanguage1RouteChildren = {
	CoursesCLanguage1PracticeRoute,
	CoursesCLanguage1ExamsFinal2026FirstRoute: Route.update({
		id: "/exams/final-2026-first",
		path: "/exams/final-2026-first",
		getParentRoute: () => CoursesCLanguage1Route
	})
};
var rootRouteChildren = {
	IndexRoute,
	DashboardRoute,
	LoginRoute,
	AdminActivityLogsRoute,
	AdminAiGeneratorRoute,
	AdminFeedbackRoute,
	AdminLoginRoute,
	AdminQuestionsRoute,
	CoursesCLanguage1Route: CoursesCLanguage1Route._addFileChildren(CoursesCLanguage1RouteChildren),
	AdminIndexRoute,
	AttemptsAttemptIdResultRoute
};
var routeTree = Route$12._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
