import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom"
import { canAccessArea } from "../auth/roles"
import { useAuth } from "../auth/useAuth"

const navigation = [
  { label: "Dashboard", description: "Business overview", path: "/admin", icon: "⌂", end: true, area: "dashboard" },
  { label: "Orders", description: "Track customer orders", path: "/admin/orders", icon: "▤", area: "orders" },
  { label: "Reservations", description: "Book guest tables", path: "/admin/reservations", icon: "◷", area: "reservations" },
  { label: "Menu", description: "Manage dishes", path: "/admin/dishes", icon: "♨", area: "menu" },
  { label: "Inventory", description: "Ingredient stock", path: "/admin/inventory", icon: "▣", area: "inventory" },
  { label: "Settings", description: "Store preferences", path: "/admin/settings", icon: "⚙", area: "settings" }
]

function AdminLayout({ theme, toggleTheme }) {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const currentPage = navigation.find((item) =>
    item.end ? location.pathname === item.path : location.pathname.startsWith(item.path)
  )
  const visibleNavigation = navigation.filter((item) => canAccessArea(user.role, item.area))

  async function handleSignOut() {
    try {
      await signOut()
    } finally {
      navigate("/login", { replace: true })
    }
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <button className="admin-brand" type="button" onClick={() => navigate("/admin")}>
          <span className="admin-brand-mark">F</span>
          <span>
            <strong>FoodHive</strong>
            <small>Restaurant console</small>
          </span>
        </button>

        <div className="admin-workspace">
          <span className="workspace-dot"></span>
          <span>Grand Palms</span>
          <span className="workspace-status">Live</span>
        </div>

        <nav className="admin-nav" aria-label="Admin navigation">
          <p className="admin-nav-label">Workspace</p>
          {visibleNavigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => isActive ? "admin-nav-link active" : "admin-nav-link"}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              <span className="admin-nav-copy">
                <strong>{item.label}</strong>
                <small>{item.description}</small>
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user">
            <span className="admin-avatar">{user.name.charAt(0).toUpperCase()}</span>
            <span><strong>{user.name}</strong><small>{user.role}</small></span>
          </div>
          <button type="button" className="admin-store-link" onClick={() => navigate("/")}>View customer site <span>↗</span></button>
          <button type="button" className="admin-store-link" onClick={handleSignOut}>Sign out <span>⇥</span></button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="admin-breadcrumb">Admin / {currentPage?.label || "Overview"}</p>
            <h1>{currentPage?.label || "Overview"}</h1>
          </div>
          <div className="admin-topbar-actions">
            <span className="admin-live-indicator"><i></i> System operational</span>
            <button type="button" className="admin-theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`} title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>
              {theme === "light" ? "☾" : "☀"}
            </button>
            <button type="button" className="admin-icon-button" aria-label="Notifications">♢</button>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
