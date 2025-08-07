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
import { TokenWallet } from "../components/TokenWallet"

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

  const mapCenter: [number, number] = latitude && longitude ? [latitude, longitude] : [0, 0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Enhanced Mobile Header */}
      <div className="shadow-lg sticky top-0 z-10" style={{background: 'linear-gradient(to right, #00563B, #006B47)'}}>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Tree size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">GreenTrace</h1>
                <p className="text-sm text-green-100">Urban Forest Documentation</p>
              </div>
            </div>
            <div className="text-right bg-white/10 rounded-lg px-3 py-2">
              <div className="text-2xl font-bold text-white">{stats.totalTrees}</div>
              <div className="text-xs text-green-100">Trees Documented</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Authentication */}
        <ThirdwebAuth user={user} onLogin={handleLogin} onLogout={handleLogout} />

        {user && (
          <>
            {/* Enhanced User Impact Stats */}
            <div className="rounded-2xl p-6 text-white shadow-lg" style={{background: 'linear-gradient(to right, #00563B, #006B47)'}}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold">Your Impact</h2>
                  <p className="text-green-100 text-sm">Contributing to forest preservation</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <BarChart3 size={24} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Tree size={24} />
                  </div>
                  <div className="text-2xl font-bold">{stats.userContributions}</div>
                  <div className="text-xs text-green-100">Trees Documented</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl">🌿</span>
                  </div>
                  <div className="text-2xl font-bold">{stats.speciesCount}</div>
                  <div className="text-xs text-green-100">Species Found</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <MapPin size={24} />
                  </div>
                  <div className="text-2xl font-bold">{stats.areasCovered}</div>
                  <div className="text-xs text-green-100">Areas Covered</div>
                </div>
              </div>
            </div>

            {/* Token Wallet */}
            <TokenWallet user={user} />

            {/* Forest Network Map */}
            <MobileCard>
              <MobileCardHeader>
                <MobileCardTitle className="flex items-center justify-between">
                  <span>Urban Forest Network</span>
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

            {/* Enhanced Action Buttons */}
            <div className="grid grid-cols-1 gap-4">
              <Button
                onClick={() => router.push("/add-tree")}
                className="w-full h-16 text-lg rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200 text-white"
                style={{background: 'linear-gradient(to right, #00563B, #006B47)'}}
                size="lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Plus size={24} />
                  </div>
                  <div className="text-left">
                    <div className="font-bold">Document New Tree</div>
                    <div className="text-sm text-green-100">Add to forest database</div>
                  </div>
                </div>
              </Button>

              <Button
                onClick={() => router.push("/report")}
                variant="outline"
                className="w-full border-2 border-orange-500 text-orange-600 hover:bg-orange-50 h-16 rounded-2xl shadow-md transform hover:scale-105 transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <AlertTriangle size={24} className="text-orange-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold">Report Issue</div>
                    <div className="text-sm text-orange-500">Environmental concerns</div>
                  </div>
                </div>
              </Button>
            </div>

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
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-green-100">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{background: 'linear-gradient(to right, #00563B, #006B47)'}}>
              <Tree className="text-white" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-3">Document Urban Trees</h2>
            <p className="text-green-600 mb-6 text-lg leading-relaxed">
              Help preserve urban forests by documenting trees and tracking environmental changes.
            </p>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-lg font-bold text-green-700">
                  {stats.totalTrees} trees documented by the community
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-green-600">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🌳</span>
                  <span>Track deforestation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">💚</span>
                  <span>Monitor tree health</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🔍</span>
                  <span>Species identification</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">📊</span>
                  <span>Conservation status</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
