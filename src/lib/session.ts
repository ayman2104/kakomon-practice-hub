const STUDENT_KEY = "kph_student";
const ADMIN_KEY = "kph_admin";

export type StudentSession = { id: string; student_id: string };

export function getStudent(): StudentSession | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STUDENT_KEY);
  return raw ? JSON.parse(raw) : null;
}
export function setStudent(s: StudentSession) {
  localStorage.setItem(STUDENT_KEY, JSON.stringify(s));
}
export function clearStudent() {
  localStorage.removeItem(STUDENT_KEY);
}

export const ADMIN_PIN = "admin2026";
export function isAdmin(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(ADMIN_KEY) === "1";
}
export function setAdmin(v: boolean) {
  if (v) localStorage.setItem(ADMIN_KEY, "1");
  else localStorage.removeItem(ADMIN_KEY);
}
