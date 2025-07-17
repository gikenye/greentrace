"use client"

import { useState, useEffect } from "react"

interface GeolocationState {
  latitude: number | null
  longitude: number | null
  error: string | null
  loading: boolean
}

export function useGeolocation() {
  const [location, setLocation] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: false,
  })

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        error: "Geolocation is not supported by this browser.",
        loading: false,
      }))
      return
    }

    setLocation((prev) => ({ ...prev, loading: true }))

    const handleSuccess = (position: GeolocationPosition) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null,
        loading: false,
      })
    }

    const handleError = (error: GeolocationPositionError) => {
      let errorMessage = "An unknown error occurred."
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "Location access denied by user."
          break
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Location information is unavailable."
          break
        case error.TIMEOUT:
          errorMessage = "Location request timed out."
          break
      }
      setLocation((prev) => ({
        ...prev,
        error: errorMessage,
        loading: false,
      }))
    }

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 600000, // 10 minutes
    })
  }, [])

  const refreshLocation = () => {
    if (typeof window === "undefined" || !navigator.geolocation) return

    setLocation((prev) => ({ ...prev, loading: true, error: null }))
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
        })
      },
      (error) => {
        setLocation((prev) => ({
          ...prev,
          error: "Failed to get location",
          loading: false,
        }))
      },
    )
  }

  return { ...location, refreshLocation }
}
