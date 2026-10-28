import { useEffect, useState } from "react"
import { getOrders } from "../services/checkoutService"

function formatCurrency(value) {
  return `₹${Math.round(value).toLocaleString("en-IN")}`
}

function OrderItems({ items = [] }) {
  if (!items.length) {
    return <span className="order-items-empty">No item details</span>
  }

  return (
    <div className="order-items-list">
      {items.map((item) => (
        <div className="order-item-detail" key={`${item.dish_id}-${item.name}`}>
          <span className="order-item-quantity">{item.quantity}x</span>
          <span className="order-item-name">{item.name}</span>
          <span className="order-item-price">{formatCurrency(item.line_total ?? item.price * item.quantity)}</span>
        </div>
      ))}
    </div>
  )
}

function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    getOrders().then(setOrders).catch(() => setError("Unable to load orders.")).finally(() => setLoading(false))
  }, [])

  const visibleOrders = filter === "today"
    ? orders.filter((order) => new Date(order.created_at).toDateString() === new Date().toDateString())
    : orders

  return (
    <div className="admin-content">
      <section className="admin-page-intro"><div><p className="eyebrow">Operations</p><h2>Order management</h2><p className="admin-muted">Review customer orders and keep the kitchen moving.</p></div><button type="button" className="admin-secondary-button" onClick={() => window.location.reload()}>↻ Refresh</button></section>
      {error && <div className="admin-error">{error}</div>}
      <section className="admin-panel orders-table-panel">
        <div className="admin-panel-heading"><div><h3>All orders <span className="heading-count">{visibleOrders.length}</span></h3></div><div className="admin-segmented"><button className={filter === "all" ? "selected" : ""} onClick={() => setFilter("all")}>All orders</button><button className={filter === "today" ? "selected" : ""} onClick={() => setFilter("today")}>Today</button></div></div>
        {loading ? <div className="admin-panel-empty">Loading orders...</div> : visibleOrders.length === 0 ? <div className="admin-panel-empty"><strong>No orders found</strong><span>Orders will appear here after checkout.</span></div> : <div className="admin-orders-table-wrap"><table className="admin-orders-table"><thead><tr><th>Order</th><th>Items</th><th>Payment</th><th>Total</th><th>Status</th><th>Placed</th></tr></thead><tbody>{visibleOrders.map((order) => <tr key={order.id}><td><strong>#{order.id}</strong></td><td><OrderItems items={order.items} /></td><td>{order.payment_method}</td><td><strong>{formatCurrency(order.total)}</strong></td><td><span className={`order-status ${order.status}`}>{order.status}</span></td><td>{new Date(order.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</td></tr>)}</tbody></table></div>}
      </section>
    </div>
  )
}

export default AdminOrders
