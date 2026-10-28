import { API_URL } from "./apiConfig"


async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.detail || "Reservation request failed")
  }

  return response.json()
}


export function getReservations() {
  return request("/reservations")
}


export function createReservation(reservation) {
  return request("/reservations", {
    method: "POST",
    body: JSON.stringify(reservation),
  })
}