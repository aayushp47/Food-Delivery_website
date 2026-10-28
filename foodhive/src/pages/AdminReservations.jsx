import { useEffect, useState } from "react"
import { createReservation, getReservations } from "../services/reservationService"

function AdminReservations() {
  const [reservations, setReservations] = useState([])
  const [form, setForm] = useState({
    guest_name: "",
    phone: "",
    party_size: "2",
    table_label: "",
    reservation_at: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")

  useEffect(() => {
    getReservations()
      .then(setReservations)
      .catch(() => setError("Unable to load reservations."))
      .finally(() => setLoading(false))
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError("")
    setNotice("")

    try {
      const created = await createReservation({
        ...form,
        party_size: Number(form.party_size),
      })
      setReservations((current) => [...current, created].sort(
        (first, second) => new Date(first.reservation_at) - new Date(second.reservation_at)
      ))
      setForm((current) => ({ ...current, guest_name: "", phone: "", table_label: "" }))
      setNotice("Reservation created.")
    } catch (createError) {
      setError(createError.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="admin-content">
      <section className="admin-page-intro">
        <div>
          <p className="eyebrow">Front of house</p>
          <h2>Table reservations</h2>
          <p className="admin-muted">Create a booking and review the guest list.</p>
        </div>
        <button type="button" className="admin-secondary-button" onClick={() => window.location.reload()}>↻ Refresh</button>
      </section>

      {error && <p className="admin-error" role="alert">{error}</p>}
      {notice && <p className="reservation-notice" role="status">{notice}</p>}

      <section className="admin-panel reservation-form-panel">
        <div className="admin-panel-heading">
          <div><h3>New reservation</h3><p className="admin-muted">Add the guest and assigned table details.</p></div>
        </div>
        <form className="reservation-form" onSubmit={handleSubmit}>
          <label>Guest name<input value={form.guest_name} onChange={(event) => setForm({ ...form, guest_name: event.target.value })} maxLength="120" required /></label>
          <label>Phone number<input type="tel" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} minLength="7" maxLength="24" required /></label>
          <label>Party size<input type="number" value={form.party_size} onChange={(event) => setForm({ ...form, party_size: event.target.value })} min="1" step="1" required /></label>
          <label>Table<input value={form.table_label} onChange={(event) => setForm({ ...form, table_label: event.target.value })} placeholder="e.g. Table 4" maxLength="30" required /></label>
          <label className="reservation-date-field">Date and time<input type="datetime-local" value={form.reservation_at} onChange={(event) => setForm({ ...form, reservation_at: event.target.value })} required /></label>
          <button className="admin-primary-button" type="submit" disabled={saving}>{saving ? "Booking..." : "Create reservation"}</button>
        </form>
      </section>

      <section className="admin-panel orders-table-panel reservation-list-panel">
        <div className="admin-panel-heading"><div><h3>Reservations <span className="heading-count">{reservations.length}</span></h3></div></div>
        {loading ? <div className="admin-panel-empty">Loading reservations...</div> : reservations.length === 0 ? <div className="admin-panel-empty"><strong>No reservations yet</strong><span>New table bookings will appear here.</span></div> : (
          <div className="admin-orders-table-wrap">
            <table className="admin-orders-table">
              <thead><tr><th>Guest</th><th>Table</th><th>Party</th><th>Date and time</th><th>Status</th></tr></thead>
              <tbody>{reservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td><strong>{reservation.guest_name}</strong><small>{reservation.phone}</small></td>
                  <td>{reservation.table_label}</td>
                  <td>{reservation.party_size}</td>
                  <td>{new Date(reservation.reservation_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</td>
                  <td><span className="order-status">{reservation.status}</span></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

export default AdminReservations