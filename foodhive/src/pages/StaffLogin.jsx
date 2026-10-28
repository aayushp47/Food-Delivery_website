import { useState } from "react"
import { Navigate, useLocation, useNavigate } from "react-router-dom"
import { roleLandingPath } from "../auth/roles"
import { useAuth } from "../auth/useAuth"

function StaffLogin() {
  const { user, loading, signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  if (loading) return <main className="auth-loading">Checking your session...</main>
  if (user) {
    return <Navigate to={user.must_change_password ? "/change-password" : roleLandingPath(user.role)} replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError("")

    try {
      const staff = await signIn(email, password)
      const destination = staff.must_change_password
        ? "/change-password"
        : location.state?.from?.pathname || roleLandingPath(staff.role)
      navigate(destination, { replace: true })
    } catch (loginError) {
      setError(loginError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-brand-panel">
        <div className="auth-brand-mark">F</div>
        <p className="auth-kicker">FoodHive · Staff workspace</p>
        <h1>Good service starts behind the scenes.</h1>
        <p className="auth-brand-copy">Sign in to the restaurant workspace with your staff account.</p>
        <div className="auth-brand-footer">Grand Palms · Restaurant operations</div>
      </section>
      <section className="auth-form-panel">
        <form className="auth-form" onSubmit={handleSubmit}>
          <p className="eyebrow">Staff access</p>
          <h2>Welcome back</h2>
          <p className="admin-muted">Use the email and password provided by your owner.</p>
          {error && <p className="admin-error" role="alert">{error}</p>}
          <label>Email address<input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
          <label>Password<input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
          <button className="admin-primary-button" type="submit" disabled={submitting}>{submitting ? "Signing in..." : "Sign in"}</button>
        </form>
      </section>
    </main>
  )
}

export default StaffLogin
