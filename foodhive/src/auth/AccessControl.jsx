import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "./useAuth"
import { allowedRoles, roleLandingPath } from "./roles"


export function RequireStaff({ children, allowForcedPasswordChange = false }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <main className="auth-loading" aria-live="polite">Checking your session...</main>
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  if (user.must_change_password && !allowForcedPasswordChange) {
    return <Navigate to="/change-password" replace />
  }

  return children
}


export function RequireRole({ area, children }) {
  const { user } = useAuth()
  const roles = allowedRoles[area] || []

  if (!roles.includes(user.role)) {
    return <Navigate to={roleLandingPath(user.role)} replace />
  }

  return children
}


