export const allowedRoles = {
  dashboard: ["owner", "manager"],
  orders: ["owner", "manager", "waiter", "chef"],
  reservations: ["owner", "manager", "waiter"],
  menu: ["owner", "manager"],
  inventory: ["owner", "manager", "chef"],
  settings: ["owner", "manager"],
}

export function roleLandingPath(role) {
  if (role === "waiter") return "/admin/orders"
  if (role === "chef") return "/admin/inventory"
  return "/admin"
}

export function canAccessArea(role, area) {
  return (allowedRoles[area] || []).includes(role)
}
