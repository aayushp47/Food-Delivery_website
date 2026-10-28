import { API_URL } from "./apiConfig"


async function request(path, options = {}) {
  const response = await fetch(`${API_URL}/auth/${path}`, {
    credentials: "include",
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.detail || "Authentication request failed")
  }

  return response.json()
}


export function login(email, password) {
  return request("login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
}


export function logout() {
  return request("logout", { method: "POST" })
}


export function getCurrentStaff() {
  return request("me")
}


export function changePassword(currentPassword, newPassword) {
  return request("change-password", {
    method: "POST",
    body: JSON.stringify({
      current_password: currentPassword,
      new_password: newPassword,
    }),
  })
}


export function getStaff() {
  return request("users")
}


export function createStaff(staff) {
  return request("users", {
    method: "POST",
    body: JSON.stringify(staff),
  })
}


export function updateStaff(id, changes) {
  return request(`users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(changes),
  })
}
