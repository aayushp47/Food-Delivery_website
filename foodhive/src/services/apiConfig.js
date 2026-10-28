export const API_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.PROD
    ? "/api"
    : `http://${window.location.hostname}:8002`
)
