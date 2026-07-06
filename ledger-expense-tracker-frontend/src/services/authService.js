import api from "./apiClient";

// POST /api/auth/register
export async function registerUser({ name, email, password, contact }) {
  const { data } = await api.post("/auth/register", { name, email, password, contact });
  return data;
}

// POST /api/auth/login
export async function loginUser({ email, password }) {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
}

export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
