import { useEffect, useState } from "react"
import { useAuth } from "../auth/useAuth"
import { createStaff, getStaff, updateStaff } from "../services/authService"

const staffRoles = ["owner", "manager", "chef", "waiter"]

function StaffManagement({ currentUser }) {
  const [staff, setStaff] = useState([])
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "waiter" })
  const [error, setError] = useState("")
  const [createError, setCreateError] = useState("")
  const [notice, setNotice] = useState("")
  const [saving, setSaving] = useState(false)
  const [showCreate, setShowCreate] = useState(false)

  useEffect(() => {
    let active = true
    getStaff()
      .then((users) => { if (active) setStaff(users) })
      .catch((loadError) => { if (active) setError(loadError.message) })
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (!showCreate) return

    function handleKeyDown(event) {
      if (event.key === "Escape" && !saving) setShowCreate(false)
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [showCreate, saving])

  function openCreateModal() {
    setForm({ name: "", email: "", password: "", role: "waiter" })
    setCreateError("")
    setShowCreate(true)
  }

  function closeCreateModal() {
    if (!saving) setShowCreate(false)
  }

  async function handleCreate(event) {
    event.preventDefault()
    setSaving(true)
    setCreateError("")
    setNotice("")
    try {
      const created = await createStaff(form)
      setStaff((current) => [...current, created])
      setForm({ name: "", email: "", password: "", role: "waiter" })
      setShowCreate(false)
      setNotice("Staff account created. Give them the temporary password securely; they must change it at first sign-in.")
    } catch (createError) {
      setCreateError(createError.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleRoleChange(user, role) {
    setError("")
    try {
      const updated = await updateStaff(user.id, { role })
      setStaff((current) => current.map((item) => item.id === updated.id ? updated : item))
    } catch (updateError) {
      setError(updateError.message)
    }
  }

  async function handleActiveToggle(user) {
    setError("")
    try {
      const updated = await updateStaff(user.id, { is_active: !user.is_active })
      setStaff((current) => current.map((item) => item.id === updated.id ? updated : item))
    } catch (updateError) {
      setError(updateError.message)
    }
  }

  return (
    <section className="admin-panel staff-management">
      <div className="admin-panel-heading">
        <div><h3>Staff accounts</h3><p>Create accounts and assign access by role.</p></div>
        <button type="button" className="admin-primary-button" onClick={openCreateModal}>+ Add staff</button>
      </div>
      {error && <p className="admin-error" role="alert">{error}</p>}
      {notice && <p className="staff-notice" role="status">{notice}</p>}
      {showCreate && (
        <div
          className="staff-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeCreateModal()
          }}
        >
          <section className="staff-modal" role="dialog" aria-modal="true" aria-labelledby="staff-modal-title">
            <div className="staff-modal-header">
              <div>
                <p className="eyebrow">Team access</p>
                <h3 id="staff-modal-title">Add staff member</h3>
                <p className="admin-muted">Create a sign-in and choose their access level.</p>
              </div>
              <button type="button" className="staff-modal-close" onClick={closeCreateModal} aria-label="Close dialog" disabled={saving}>×</button>
            </div>
            {createError && <p className="admin-error" role="alert">{createError}</p>}
            <form className="staff-create-form staff-modal-form" onSubmit={handleCreate}>
              <label>Staff name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} maxLength="120" autoComplete="name" required /></label>
              <label>Email address<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} maxLength="254" autoComplete="email" required /></label>
              <label>Temporary password<input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} minLength="8" maxLength="128" autoComplete="new-password" required /><small>At least 8 characters; they’ll change it at first sign-in.</small></label>
              <label>Role<select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>{staffRoles.map((role) => <option key={role} value={role}>{role}</option>)}</select></label>
              <div className="staff-modal-actions">
                <button type="button" className="admin-secondary-button" onClick={closeCreateModal} disabled={saving}>Cancel</button>
                <button className="admin-primary-button" type="submit" disabled={saving}>{saving ? "Adding..." : "Add staff"}</button>
              </div>
            </form>
          </section>
        </div>
      )}
      <div className="staff-table-wrap">
        <table className="staff-table">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Access</th></tr></thead>
          <tbody>{staff.map((user) => (
            <tr key={user.id}>
              <td>{user.name}{user.id === currentUser.id ? " (you)" : ""}</td>
              <td>{user.email}</td>
              <td>
                <select aria-label={`Role for ${user.name}`} value={user.role} disabled={user.id === currentUser.id} onChange={(event) => handleRoleChange(user, event.target.value)}>
                  {staffRoles.map((role) => <option key={role} value={role}>{role}</option>)}
                </select>
              </td>
              <td><button type="button" className="staff-access-toggle" disabled={user.id === currentUser.id} onClick={() => handleActiveToggle(user)}>{user.is_active ? "Active · Deactivate" : "Inactive · Activate"}</button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </section>
  )
}

function AdminSettings() {
  const { user } = useAuth()
  const [saved, setSaved] = useState(false)
  const [isOpen, setIsOpen] = useState(true)

  function saveSettings(event) {
    event.preventDefault()
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="admin-content">
      <section className="admin-page-intro"><div><p className="eyebrow">Configuration</p><h2>Store settings</h2><p className="admin-muted">Keep your restaurant details and ordering preferences up to date.</p></div></section>
      <form className="admin-settings-grid" onSubmit={saveSettings}>
        <section className="admin-panel settings-panel"><div className="admin-panel-heading"><div><h3>Restaurant profile</h3><p>These details are shown to customers.</p></div></div><label>Restaurant name<input defaultValue="Grand Palms" /></label><label>Tagline<input defaultValue="Experience the Royal Indian Taste" /></label><label>Restaurant description<textarea defaultValue="Authentic Indian, Chinese, Italian and Continental food." rows="4" /></label></section>
        <section className="admin-panel settings-panel"><div className="admin-panel-heading"><div><h3>Ordering preferences</h3><p>Control the customer ordering experience.</p></div></div><div className="setting-toggle"><div><strong>Accept new orders</strong><small>Customers can place orders online</small></div><button type="button" className={isOpen ? "toggle on" : "toggle"} onClick={() => setIsOpen(!isOpen)} aria-label="Toggle order acceptance"><span></span></button></div><label>Average preparation time<input defaultValue="25 - 35 min" /></label><label>Free delivery threshold<input type="number" defaultValue="299" /></label><button className="admin-primary-button settings-save" type="submit">{saved ? "Saved" : "Save changes"}</button></section>
      </form>
      {user.role === "owner" && <StaffManagement currentUser={user} />}
    </div>
  )
}

export default AdminSettings
