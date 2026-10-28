import { API_URL } from "./apiConfig"


function toInventoryItem(item) {
  return {
    id: item.id,
    item: item.item,
    category: item.category,
    stock: item.stock,
    unit: item.unit,
    reorderLevel: item.reorder_level,
    supplier: item.supplier,
    lastUpdated: new Date(item.last_updated).toLocaleString(),
    status: item.status,
  }
}


function toInventoryPayload(item) {
  return {
    item: item.item,
    category: item.category,
    stock: Number(item.stock),
    unit: item.unit,
    reorder_level: Number(item.reorderLevel),
    supplier: item.supplier,
    status: item.status,
  }
}


async function requestInventory(path, options) {
  const response = await fetch(`${API_URL}/inventory/${path}`, {
    ...options,
    credentials: "include",
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || "Unable to save inventory. Check that the API is running.")
  }

  return response.json()
}


export async function getInventory() {
  const items = await requestInventory("", {})
  return items.map(toInventoryItem)
}


export async function createInventoryItem(item) {
  const savedItem = await requestInventory("", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toInventoryPayload(item)),
  })

  return toInventoryItem(savedItem)
}


export async function updateInventoryItem(id, item) {
  const savedItem = await requestInventory(String(id), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toInventoryPayload(item)),
  })

  return toInventoryItem(savedItem)
}