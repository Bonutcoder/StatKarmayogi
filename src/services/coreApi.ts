import { Competency, Course, SkillGap, UserProfile, UserRole } from "../types";

// In development, Vite proxies these relative paths to the local FastAPI server.
// Deployments should set VITE_API_URL to their public API origin.
export const API_URL = import.meta.env.VITE_API_URL || "";
const TOKEN_KEY = "statkarmayogi.access_token";

export class ApiError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
  }
}

export const getAccessToken = () => sessionStorage.getItem(TOKEN_KEY);
export const clearSession = () => sessionStorage.removeItem(TOKEN_KEY);

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAccessToken();
  const response = await fetch(`${API_URL}/api/v1${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new ApiError(body?.detail || `Request failed (${response.status})`, response.status);
  }
  return response.json() as Promise<T>;
}

export async function checkCoreHealth() {
  try {
    const response = await fetch(`${API_URL}/health`);
    const data = await response.json();
    return { online: response.ok, version: data.version as string | undefined };
  } catch {
    return { online: false, version: undefined };
  }
}

type ApiUser = { id: string; email: string; role: UserRole; department_id: string; department_name?: string };
type ApiEmployee = { id: string; full_name: string; designation: string; department_id: string; cadre?: string };

function toProfile(user: ApiUser, employee?: ApiEmployee): UserProfile {
  return {
    id: user.id, name: employee?.full_name || user.email.split("@")[0], email: user.email, role: user.role,
    roleTitle: employee?.designation || user.role.split("_").join(" "), department: user.department_name || employee?.department_id || user.department_id,
    grade: employee?.cadre || "Not provided", cadre: employee?.cadre || "Not provided",
  };
}

async function getAuthenticatedProfile(): Promise<UserProfile> {
  const user = await request<ApiUser>("/auth/me");
  const employee = await request<ApiEmployee>("/employees/me").catch(() => undefined);
  return toProfile(user, employee);
}

export async function login(email: string, password: string) {
  const session = await request<{ access_token: string }>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
  sessionStorage.setItem(TOKEN_KEY, session.access_token);
  return getAuthenticatedProfile();
}

export async function register(input: { fullName: string; email: string; password: string; designation: string; grade: string; department: string }) {
  const session = await request<{ access_token: string }>("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      full_name: input.fullName,
      email: input.email,
      password: input.password,
      designation: input.designation,
      grade: input.grade,
      department: input.department,
    }),
  });
  sessionStorage.setItem(TOKEN_KEY, session.access_token);
  return getAuthenticatedProfile();
}

export async function completeGithubLogin(accessToken: string) {
  sessionStorage.setItem(TOKEN_KEY, accessToken);
  return getAuthenticatedProfile();
}

export async function getCompetencies(): Promise<Competency[]> {
  const data = await request<Array<{ id: string; name: string; domain: string; description?: string; min_level: number; max_level: number }>>("/competencies");
  return data.map((item) => ({
    id: item.id, name: item.name,
    category: /data science|analytics|spatial/i.test(item.domain) ? "Advanced" : /statistics|survey/i.test(item.domain) ? "Core" : "Foundational",
    level: item.min_level, required: item.max_level, desc: item.description || "No description provided.", evidenceSource: item.domain,
  }));
}

export async function getCourses(): Promise<Course[]> {
  const data = await request<Array<{ id: string; title: string; description?: string; provider: string; duration_hours: number; level: string; external_url?: string }>>("/courses");
  return data.map((item) => ({
    id: item.id, title: item.title, provider: item.provider, source: item.provider === "iGOT" ? "iGOT" : "LOCAL",
    competency: "Not specified", level: item.level === "Beginner" || item.level === "Advanced" ? item.level : "Intermediate",
    duration: `${item.duration_hours} hours`, reason: item.description || "No recommendation rationale provided.", externalUrl: item.external_url,
  }));
}

export async function getSkillGaps(employeeId: string): Promise<SkillGap[]> {
  const data = await request<Array<{ competency_id: string; competency_name: string; required_level: number; current_level: number; gap_value: number; priority_score: number }>>(`/employees/${employeeId}/gaps`);
  return data.map((item) => ({
    id: item.competency_id, name: item.competency_name, current: item.current_level, required: item.required_level,
    priority: item.priority_score >= 0.7 ? "HIGH" : item.priority_score >= 0.4 ? "MEDIUM" : "LOW",
    impact: `Current gap: ${item.gap_value} level${item.gap_value === 1 ? "" : "s"}.`, recommendedCourseId: "",
  }));
}

export async function getCurrentEmployee() {
  return request<ApiEmployee>("/employees/me");
}
