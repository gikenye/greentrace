"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useGeolocation } from "../hooks/useGeolocation"
import { ThirdwebAuth } from "../components/ThirdwebAuth"
import { MobileCard, MobileCardContent, MobileCardHeader, MobileCardTitle } from "../components/ui/mobile-card"
import { RefreshCw, MapPin, Plus, TreesIcon as Tree, BarChart3, AlertTriangle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import dynamic from "next/dynamic"
import { ThirdwebUser } from "../services/thirdwebService"
import { TreeDocumentationService } from "../services/treeDocumentationService"

// Dynamically import the map component
const TreeNetworkMap = dynamic(
  () => import("../components/TreeNetworkMap").then((mod) => ({ default: mod.TreeNetworkMap })),
  {
    ssr: false,
    loading: () => (
      <div className="h-80 w-full rounded-lg bg-green-50 flex items-center justify-center">
        <div className="text-green-600 text-center">
          <Tree size={32} className="mx-auto mb-2 animate-pulse" />
          <p className="font-medium">Loading Forest Network</p>
        </div>
      </div>
    ),
  },
)

export default function HomePage() {
  const router = useRouter()
  const { latitude, longitude, error, loading, refreshLocation } = useGeolocation()
  const [user, setUser] = useState<ThirdwebUser | null>(null)
  const [mounted, setMounted] = useState(false)

  const documentationService = TreeDocumentationService.getInstance()
  const treeRecords = documentationService.getTreeRecords()
  const userRecords = user ? documentationService.getUserTreeRecords(user.address) : []
  const stats = documentationService.getNetworkStats(user?.address)

  const handleLogin = (userData: ThirdwebUser) => {
    setUser(userData)
    if (typeof window !== "undefined") {
      localStorage.setItem("greentrace_thirdweb_user", JSON.stringify(userData))
    }
  }

  const handleLogout = () => {
    setUser(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("greentrace_thirdweb_user")
    }
  }

  useEffect(() => {
    setMounted(true)
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("greentrace_thirdweb_user")
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
    }
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <Tree className="text-green-600 mx-auto mb-4 animate-pulse" size={48} />
          <p className="text-green-700 font-medium">Loading GreenTrace</p>
        </div>
      </div>
    )
  }

  const mapCenter: [number, number] = latitude && longitude ? [latitude, longitude] : [-1.2921, 36.7853]

  return (
    <div className="min-h-screen bg-green-50">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b border-green-100 sticky top-0 z-10">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-green-800">GreenTrace</h1>
              <p className="text-sm text-green-600">Urban Forest Documentation</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-green-700">{stats.totalTrees}</div>
              <div className="text-xs text-green-600">Trees Documented</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Authentication */}
        <ThirdwebAuth user={user} onLogin={handleLogin} onLogout={handleLogout} />

        {user && (
          <>
            {/* User Impact Stats */}
            <MobileCard variant="primary">
              <MobileCardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold">Your Documentation</h2>
                    <p className="text-green-100 text-sm">Contributing to forest preservation</p>
                  </div>
                  <BarChart3 size={24} />
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{stats.userContributions}</div>
                    <div className="text-xs text-green-100">Trees</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.speciesCount}</div>
                    <div className="text-xs text-green-100">Species</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.areasCovered}</div>
                    <div className="text-xs text-green-100">Areas</div>
                  </div>
                </div>
              </MobileCardContent>
            </MobileCard>

            {/* Forest Network Map */}
            <MobileCard>
              <MobileCardHeader>
                <MobileCardTitle className="flex items-center justify-between">
                  <span>Kilimani Forest Network</span>
                  <div className="flex items-center space-x-3 text-xs">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Your Trees</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span>Community</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>At Risk</span>
                    </div>
                  </div>
                </MobileCardTitle>
              </MobileCardHeader>
              <MobileCardContent>
                <TreeNetworkMap
                  center={mapCenter}
                  treeRecords={treeRecords}
                  userRecords={userRecords}
                  className="border border-green-200"
                />
                <div className="mt-3 text-xs text-gray-600 text-center">
                  Interactive network showing documented trees and their connections
                </div>
              </MobileCardContent>
            </MobileCard>

            {/* Primary Action */}
            <Button
              onClick={() => router.push("/add-tree")}
              className="w-full bg-green-600 hover:bg-green-700 h-14 text-lg"
              size="lg"
            >
              <Plus size={24} className="mr-3" />
              Document New Tree
            </Button>

            {/* Secondary Action */}
            <Button
              onClick={() => router.push("/report")}
              variant="outline"
              className="w-full border-green-600 text-green-600 hover:bg-green-50 h-12"
            >
              <AlertTriangle size={20} className="mr-2" />
              Report Environmental Issue
            </Button>

            {/* Location Status */}
            <MobileCard>
              <MobileCardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <MapPin size={16} className="text-green-600" />
                    <span className="text-sm font-medium">Current Location</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={refreshLocation} disabled={loading}>
                    <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                  </Button>
                </div>
                
                {loading && <p className="text-sm text-gray-500">Getting location...</p>}
                {error && <p className="text-sm text-red-500">{error}</p>}
                {latitude && longitude && (
                  <div>
                    <p className="text-sm font-mono text-gray-600">
                      {latitude.toFixed(4)}, {longitude.toFixed(4)}
                    </p>
                    <p className="text-xs text-gray-500">Kilimani, Nairobi</p>
                  </div>
                )}
              </MobileCardContent>
            </MobileCard>

            {/* Conservation Status */}
            <MobileCard variant="secondary">
              <MobileCardHeader>
                <MobileCardTitle className="text-green-800">Conservation Status</MobileCardTitle>
              </MobileCardHeader>
              <MobileCardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Stable Species</span>
                  <Badge className="bg-green-100 text-green-700 border-0">
                    {treeRecords.filter(t => t.conservationStatus === 'Stable').length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Vulnerable Species</span>
                  <Badge className="bg-yellow-100 text-yellow-700 border-0">
                    {treeRecords.filter(t => t.conservationStatus === 'Vulnerable').length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">At Risk Species</span>
                  <Badge className="bg-red-100 text-red-700 border-0">
                    {treeRecords.filter(t => ['Endangered', 'Critical'].includes(t.conservationStatus)).length}
                  </Badge>
                </div>
              </MobileCardContent>
            </MobileCard>
          </>
        )}

        {!user && (
          <MobileCard>
            <MobileCardContent className="p-6 text-center">
              <Tree className="text-green-600 mx-auto mb-4" size={48} />
              <h2 className="text-xl font-bold text-green-800 mb-2">Document Urban Trees</h2>
              <p className="text-green-600 mb-4">
                Help preserve Kilimani's urban forest by documenting trees and tracking deforestation patterns.
              </p>
              <div className="bg-green-100 p-4 rounded-lg space-y-2">
                <p className="text-sm text-green-700 font-medium">
                  {stats.totalTrees} trees documented by the community
                </p>
                <div className="grid grid-cols-2 gap-4 text-xs text-green-600">
                  <div>Track deforestation</div>
                  <div>Monitor tree health</div>
                  <div>Species identification</div>
                  <div>Conservation status</div>
                </div>
              </div>
            </MobileCardContent>
          </MobileCard>
        )}
      </div>
    </div>
  )
}
