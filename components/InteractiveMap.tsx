"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { MapPin } from 'lucide-react'

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
      html: '<div style="background-color: #16a34a; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>',
      className: "custom-div-icon",
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    })

    const issueIcon = L.divIcon({
      html: '<div style="background-color: #dc2626; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>',
      className: "custom-div-icon",
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    })

    // Add tree markers
    data.trees.forEach((tree) => {
      L.marker([tree.lat, tree.lng], { icon: treeIcon })
        .addTo(map)
        .bindPopup(`
          <div class="p-2">
            <strong class="text-green-700">🌳 ${tree.type} Tree</strong>
            ${tree.plantedBy ? `<br><span class="text-sm text-gray-600">Planted by: ${tree.plantedBy}</span>` : ""}
            <div class="mt-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
              Part of urban forest network
            </div>
          </div>
        `)
    })

    // Add issue markers
    data.issues.forEach((issue) => {
      L.marker([issue.lat, issue.lng], { icon: issueIcon })
        .addTo(map)
        .bindPopup(`
          <div class="p-2">
            <strong class="text-red-700">⚠️ ${issue.type}</strong>
            <br><span class="text-sm text-gray-600">${issue.description}</span>
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

  return (
    <div className={`relative ${className}`}>
      <div ref={mapRef} className="h-48 w-full rounded-lg" />
      
      {/* Map Info */}
      <div className="absolute bottom-2 left-2 bg-white/90 rounded px-2 py-1 text-xs text-gray-600">
        <div className="flex items-center space-x-1">
          <MapPin size={12} />
          <span>Kilimani, Nairobi</span>
        </div>
      </div>
    </div>
  )
}
