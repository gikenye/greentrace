"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { TreeRecord } from "../services/treeDocumentationService"

// Fix for default markers in Leaflet with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

interface TreeNetworkMapProps {
  center: [number, number]
  zoom?: number
  treeRecords: TreeRecord[]
  userRecords: TreeRecord[]
  className?: string
}

export function TreeNetworkMap({ center, zoom = 14, treeRecords, userRecords, className = "" }: TreeNetworkMapProps) {
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

    // Custom icons for different tree types
    const userTreeIcon = L.divIcon({
      html: '<div style="background-color: #00563B; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
      className: "custom-div-icon",
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    })

    const communityTreeIcon = L.divIcon({
      html: '<div style="background-color: #059669; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.2);"></div>',
      className: "custom-div-icon",
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    })

    const vulnerableTreeIcon = L.divIcon({
      html: '<div style="background-color: #dc2626; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.2);"></div>',
      className: "custom-div-icon",
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    })

    // Create network connections between nearby trees
    const connections: L.Polyline[] = []
    const maxDistance = 0.005 // Maximum distance for connections (roughly 500m)

    for (let i = 0; i < treeRecords.length; i++) {
      for (let j = i + 1; j < treeRecords.length; j++) {
        const tree1 = treeRecords[i]
        const tree2 = treeRecords[j]
        
        const distance = Math.sqrt(
          Math.pow(tree1.latitude - tree2.latitude, 2) + Math.pow(tree1.longitude - tree2.longitude, 2)
        )
        
        if (distance <= maxDistance) {
          const isUserConnection = userRecords.some(ur => ur.id === tree1.id || ur.id === tree2.id)
          const connection = L.polyline(
            [[tree1.latitude, tree1.longitude], [tree2.latitude, tree2.longitude]],
            {
              color: isUserConnection ? "#00563B" : "#059669",
              weight: isUserConnection ? 3 : 1,
              opacity: 0.7,
              dashArray: isUserConnection ? undefined : "5, 5"
            }
          ).addTo(map)
          connections.push(connection)
        }
      }
    }

    // Add tree markers
    treeRecords.forEach((tree) => {
      const isUserTree = userRecords.some(ur => ur.id === tree.id)
      const isVulnerable = tree.conservationStatus === 'Vulnerable' || tree.conservationStatus === 'Endangered' || tree.conservationStatus === 'Critical'
      
      let icon = communityTreeIcon
      if (isUserTree) {
        icon = userTreeIcon
      } else if (isVulnerable) {
        icon = vulnerableTreeIcon
      }

      const marker = L.marker([tree.latitude, tree.longitude], { icon })
        .addTo(map)
        .bindPopup(`
          <div class="p-3 min-w-[200px]">
            <div class="flex items-center space-x-2 mb-2">
              <div class="w-3 h-3 ${isUserTree ? 'bg-green-500' : isVulnerable ? 'bg-red-500' : 'bg-green-600'} rounded-full"></div>
              <strong class="text-green-700">${tree.species}</strong>
            </div>
            ${tree.scientificName ? `<p class="text-sm italic text-gray-600 mb-1">${tree.scientificName}</p>` : ''}
            <p class="text-sm text-gray-600 mb-2">Documented ${new Date(tree.timestamp).toLocaleDateString()}</p>
            <div class="text-xs px-2 py-1 rounded ${tree.conservationStatus === 'Stable' ? 'bg-green-100 text-green-700' : tree.conservationStatus === 'Vulnerable' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}">
              Conservation: ${tree.conservationStatus}
            </div>
            ${isUserTree ? '<div class="mt-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">Your documentation</div>' : ''}
            <div class="mt-2 text-xs text-gray-500">
              Connected to ${connections.filter(c => 
                c.getLatLngs().some(latlng => 
                  Math.abs(latlng.lat - tree.latitude) < 0.0001 && Math.abs(latlng.lng - tree.longitude) < 0.0001
                )
              ).length} nearby trees
            </div>
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
  }, [center, zoom, treeRecords, userRecords])

  return <div ref={mapRef} className={`h-80 w-full rounded-lg ${className}`} />
}
