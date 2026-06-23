//#region node_modules/.nitro/vite/services/ssr/assets/session-BcYkPPYI.js
var STUDENT_KEY = "kph_student";
var ADMIN_KEY = "kph_admin";
function getStudent() {
	if (typeof window === "undefined") return null;
	const raw = localStorage.getItem(STUDENT_KEY);
	return raw ? JSON.parse(raw) : null;
}
function setStudent(s) {
	localStorage.setItem(STUDENT_KEY, JSON.stringify(s));
}
function clearStudent() {
	localStorage.removeItem(STUDENT_KEY);
}
function isAdmin() {
	if (typeof window === "undefined") return false;
	return localStorage.getItem(ADMIN_KEY) === "1";
}
function setAdmin(v) {
	if (v) localStorage.setItem(ADMIN_KEY, "1");
	else localStorage.removeItem(ADMIN_KEY);
}
//#endregion
export { setStudent as a, setAdmin as i, getStudent as n, isAdmin as r, clearStudent as t };
