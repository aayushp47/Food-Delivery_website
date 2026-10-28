import { API_URL } from "./apiConfig"


async function request(path, options = {}) {

  const response = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    ...options
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.detail || "Checkout request failed")
  }

  return response.json()
}


export function getAddresses() {
  return request("/addresses")
}


export function getOrders() {
  return request("/orders")
}


export function createAddress(address) {
  return request("/addresses", {
    method: "POST",
    body: JSON.stringify(address)
  })
}


export function deleteAddress(id) {
  return request(`/addresses/${id}`, {
    method: "DELETE"
  })
}


export function createOrder(order) {
  return request("/orders", {
    method: "POST",
    body: JSON.stringify(order)
  })
}


export function updateAddress(id, address) {
  return request(`/addresses/${id}`, {
    method: "PUT",
    body: JSON.stringify(address)
  })
}