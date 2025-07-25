"use client"

import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"

export function OfflineDetector() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleOnline = () => {
      const storedPath = sessionStorage.getItem("pathBeforeOffline")
      if (location.pathname === "/offline" && storedPath) {
        navigate(storedPath)
        sessionStorage.removeItem("pathBeforeOffline")
      }
    }

    const handleOffline = () => {
      if (location.pathname !== "/offline") {
        sessionStorage.setItem("pathBeforeOffline", location.pathname)
        navigate("/offline")
      }
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Check initial status
    if (!navigator.onLine && location.pathname !== "/offline") {
      sessionStorage.setItem("pathBeforeOffline", location.pathname)
      navigate("/offline")
    }

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [navigate, location.pathname])

  return null
}
