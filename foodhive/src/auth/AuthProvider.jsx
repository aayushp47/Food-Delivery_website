import { useEffect, useState } from "react"
import { AuthContext } from "./authContext"
import { getCurrentStaff, login, logout } from "../services/authService"

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    getCurrentStaff()
      .then((staff) => {
        if (active) setUser(staff)
      })
      .catch(() => {
        if (active) setUser(null)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  async function signIn(email, password) {
    const staff = await login(email, password)
    setUser(staff)
    return staff
  }

  async function signOut() {
    try {
      await logout()
    } finally {
      setUser(null)
    }
  }

  function updateCurrentStaff(staff) {
    setUser(staff)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, updateCurrentStaff }}>
      {children}
    </AuthContext.Provider>
  )
}