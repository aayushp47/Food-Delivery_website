import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom"

import FoodHome from "./pages/FoodHome"
import AdminDishes from "./pages/AdminDishes"
import AdminDashboard from "./pages/AdminDashboard"
import AdminOrders from "./pages/AdminOrders"
import AdminInventory from "./pages/AdminInventory"
import AdminSettings from "./pages/AdminSettings"
import AdminReservations from "./pages/AdminReservations"
import AdminLayout from "./components/AdminLayout"
import { useEffect, useState } from "react"
import { AuthProvider } from "./auth/AuthProvider"
import { RequireRole, RequireStaff } from "./auth/AccessControl"
import StaffLogin from "./pages/StaffLogin"
import StaffChangePassword from "./pages/StaffChangePassword"


function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("foodhive-theme") || "light"
  })

  useEffect(() => {
    localStorage.setItem("foodhive-theme", theme)
    document.documentElement.dataset.theme = theme
  }, [theme])

  function toggleTheme() {
    setTheme((currentTheme) => currentTheme === "light" ? "dark" : "light")
  }

  return (

    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<FoodHome theme={theme} toggleTheme={toggleTheme} />}
          />
          <Route path="/login" element={<StaffLogin />} />
          <Route
            path="/change-password"
            element={(
              <RequireStaff allowForcedPasswordChange>
                <StaffChangePassword />
              </RequireStaff>
            )}
          />
          <Route
            path="/admin"
            element={(
              <RequireStaff>
                <AdminLayout theme={theme} toggleTheme={toggleTheme} />
              </RequireStaff>
            )}
          >
            <Route index element={<RequireRole area="dashboard"><AdminDashboard /></RequireRole>} />
            <Route path="dishes" element={<RequireRole area="menu"><AdminDishes /></RequireRole>} />
            <Route path="orders" element={<RequireRole area="orders"><AdminOrders /></RequireRole>} />
            <Route path="reservations" element={<RequireRole area="reservations"><AdminReservations /></RequireRole>} />
            <Route path="inventory" element={<RequireRole area="inventory"><AdminInventory /></RequireRole>} />
            <Route path="settings" element={<RequireRole area="settings"><AdminSettings /></RequireRole>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>

  )

}


export default App