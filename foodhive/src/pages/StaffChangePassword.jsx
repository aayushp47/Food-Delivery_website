import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { roleLandingPath } from "../auth/roles"
import { useAuth } from "../auth/useAuth"
import { changePassword } from "../services/authService"

function StaffChangePassword() {
  const { user, updateCurrentStaff } = useAuth()
  const navigate = useNavigate()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmation, setConfirmation] = useState("")
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError("")
    if (newPassword !== confirmation) {
      setError("The new passwords do not match.")
      return
    }

    setSaving(true)
    try {
      const updatedStaff = await changePassword(currentPassword, newPassword)
      updateCurrentStaff(updatedStaff)
      navigate(roleLandingPath(updatedStaff.role), { replace: true })
    } catch (changeError) {
      setError(changeError.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="auth-page auth-password-page">
      <section className="auth-brand-panel">
        <div className="auth-brand-mark">F</div>
        <p className="auth-kicker">FoodHive · Staff workspace</p>
        <h1>One quick security step.</h1>
        <p className="auth-brand-copy">Set a private password before opening your workspace.</p>
      </section>
      <section className="auth-form-panel">
        <form className="auth-form" onSubmit={handleSubmit}>
          <p className="eyebrow">Account security</p>
          <h2>Change your password</h2>
          <p className="admin-muted">Signed in as {user.email}. Use at least 8 characters.</p>
          {error && <p className="admin-error" role="alert">{error}</p>}
          <label>Temporary password<input type="password" autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required /></label>
          <label>New password<input type="password" autoComplete="new-password" minLength="8" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required /></label>
          <label>Confirm new password<input type="password" autoComplete="new-password" minLength="8" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} required /></label>
          <button className="admin-primary-button" type="submit" disabled={saving}>{saving ? "Updating..." : "Update password"}</button>
        </form>
      </section>
    </main>
  )
}

export default StaffChangePassword
