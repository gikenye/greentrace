"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix for default markers in Leaflet with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

interface MapData {
  trees: Array<{ id: number; lat: number; lng: number; type: string; plantedBy?: string }>
  issues: Array<{ id: number; lat: number; lng: number; type: string; description: string }>
}

interface InteractiveMapProps {
  center: [number, number]
  zoom?: number
  data: MapData
  className?: string
}

export function InteractiveMap({ center, zoom = 13, data, className = "" }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current) return

    // Initialize map
    const map = L.map(mapRef.current).setView(center, zoom)
    mapInstanceRef.current = map

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map)

    // Custom icons
    const treeIcon = L.divIcon({
      html: '<div style="background-color: #16a34a; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>',
      className: "custom-div-icon",
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    })

    const issueIcon = L.divIcon({
      html: '<div style="background-color: #dc2626; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>',
      className: "custom-div-icon",
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    })

    // Add tree markers
    data.trees.forEach((tree) => {
      L.marker([tree.lat, tree.lng], { icon: treeIcon })
        .addTo(map)
        .bindPopup(`
          <div>
            <strong>🌳 ${tree.type} Tree</strong>
            ${tree.plantedBy ? `<br>Planted by: ${tree.plantedBy}` : ""}
          </div>
        `)
    })

    // Add issue markers
    data.issues.forEach((issue) => {
      L.marker([issue.lat, issue.lng], { icon: issueIcon })
        .addTo(map)
        .bindPopup(`
          <div>
            <strong>⚠️ ${issue.type}</strong>
            <br>${issue.description}
          </div>
        `)
    })

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [center, zoom, data])

  return <div ref={mapRef} className={`h-64 w-full rounded-lg ${className}`} />
}
