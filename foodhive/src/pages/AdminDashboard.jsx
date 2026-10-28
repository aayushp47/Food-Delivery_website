import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { getOrders } from "../services/checkoutService"
import { getDishes } from "../services/dishService"

function formatCurrency(value) {
  return `₹${Math.round(value).toLocaleString("en-IN")}`
}

function formatOrderItems(items = []) {
  return items.map((item) => `${item.quantity}x ${item.name}`).join(", ") || "Customer order"
}

function formatOrderDateTime(value) {
  if (!value) return "Date unavailable"

  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  })
}

function isToday(value) {
  if (!value) return false
  const date = new Date(value)
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

function formatToday() {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date())
}

function AdminDashboard() {
  const [orders, setOrders] = useState([])
  const [dishCount, setDishCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    Promise.all([getOrders(), getDishes()])
      .then(([loadedOrders, loadedDishes]) => {
        setOrders(loadedOrders)
        setDishCount(loadedDishes.length)
      })
      .catch(() => setError("Unable to load the latest business data."))
      .finally(() => setLoading(false))
  }, [])

  const metrics = useMemo(() => {
    const todaysOrders = orders.filter((order) => isToday(order.created_at))
    const todaysRevenue = todaysOrders.reduce((sum, order) => sum + order.total, 0)
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
    return { todaysOrders, todaysRevenue, totalRevenue }
  }, [orders])

  const recentOrders = orders.slice(0, 5)

  return (
    <div className="admin-content">
      <section className="admin-welcome">
        <div>
          <p className="eyebrow">{formatToday()}</p>
          <h2>Good morning, Aayush.</h2>
          <p className="admin-muted">Here is what is happening at Grand Palms today.</p>
        </div>
        <Link className="admin-primary-button" to="/admin/dishes">+ Add new dish</Link>
      </section>

      {error && <div className="admin-error">{error} Refresh the page to try again.</div>}

      <section className="admin-metric-grid">
        <article className="admin-metric-card accent-green">
          <div className="metric-heading"><span>Today's revenue</span><span className="metric-icon">₹</span></div>
          <strong>{loading ? "--" : formatCurrency(metrics.todaysRevenue)}</strong>
          <small><span className="metric-positive">Live</span> from today's orders</small>
        </article>
        <article className="admin-metric-card accent-blue">
          <div className="metric-heading"><span>Today's orders</span><span className="metric-icon">⌁</span></div>
          <strong>{loading ? "--" : metrics.todaysOrders.length}</strong>
          <small><span className="metric-positive">{metrics.todaysOrders.length ? "Active" : "Quiet"}</span> order activity today</small>
        </article>
        <article className="admin-metric-card accent-orange">
          <div className="metric-heading"><span>Total revenue</span><span className="metric-icon">↗</span></div>
          <strong>{loading ? "--" : formatCurrency(metrics.totalRevenue)}</strong>
          <small>Across {orders.length} recorded orders</small>
        </article>
        <article className="admin-metric-card accent-purple">
          <div className="metric-heading"><span>Menu items</span><span className="metric-icon">♨</span></div>
          <strong>{loading ? "--" : dishCount}</strong>
          <small>Published dishes available</small>
        </article>
      </section>

      <section className="admin-dashboard-grid">
        <article className="admin-panel recent-orders-panel">
          <div className="admin-panel-heading"><div><p className="eyebrow">Operations</p><h3>Recent orders</h3></div><Link to="/admin/orders">View all <span>→</span></Link></div>
          {loading ? <div className="admin-panel-empty">Loading recent orders...</div> : recentOrders.length === 0 ? <div className="admin-panel-empty"><strong>No orders yet</strong><span>New customer orders will appear here.</span></div> : (
            <div className="recent-order-list">
              {recentOrders.map((order) => (
                <div className="recent-order-row" key={order.id}>
                  <span className="order-badge">#{order.id}</span>
                  <div><strong>{formatOrderItems(order.items)}</strong><small>{order.items?.reduce((total, item) => total + item.quantity, 0) || 0} items · {order.payment_method}</small><small className="order-date-time">{formatOrderDateTime(order.created_at)}</small></div>
                  <strong className="order-amount">{formatCurrency(order.total)}</strong>
                  <span className={`order-status ${order.status}`}>{order.status}</span>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="admin-panel quick-actions-panel">
          <div className="admin-panel-heading"><div><p className="eyebrow">Shortcuts</p><h3>Quick actions</h3></div></div>
          <Link className="quick-action" to="/admin/dishes"><span>♨</span><div><strong>Manage menu</strong><small>Add, edit, or remove dishes</small></div><b>→</b></Link>
          <Link className="quick-action" to="/admin/orders"><span>⌁</span><div><strong>Review orders</strong><small>Track every customer order</small></div><b>→</b></Link>
          <Link className="quick-action" to="/admin/settings"><span>⚙</span><div><strong>Store settings</strong><small>Restaurant profile and preferences</small></div><b>→</b></Link>
        </article>
      </section>
    </div>
  )
}

export default AdminDashboard
