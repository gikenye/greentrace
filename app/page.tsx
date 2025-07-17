"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useGeolocation } from "../hooks/useGeolocation"
import { SocialLogin } from "../components/SocialLogin"
import { RefreshCw, MapPin, Plus, AlertTriangle, TreesIcon as Tree, Users, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import dynamic from "next/dynamic"

// Dynamically import the map component to avoid SSR issues
const InteractiveMap = dynamic(
  () => import("../components/InteractiveMap").then((mod) => ({ default: mod.InteractiveMap })),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 w-full rounded-lg bg-gray-200 flex items-center justify-center">
        <div className="text-gray-500 text-center">
          <MapPin size={32} className="mx-auto mb-2" />
          <p>Loading Map...</p>
        </div>
      </div>
    ),
  },
)

// Mock data
const mockActivities = [
  { id: 1, type: "tree", description: "Mango Tree added on Wood Avenue", time: "3 days ago" },
  { id: 2, type: "issue", description: "Blocked Drain reported on Arwings Kodhek", time: "1 day ago" },
  { id: 3, type: "tree", description: "Jacaranda Tree added on Ngong Road", time: "5 days ago" },
  { id: 4, type: "issue", description: "Tree Cutting reported on Kilimani Road", time: "2 days ago" },
  { id: 5, type: "tree", description: "Neem Tree added on Dennis Pritt Road", time: "1 week ago" },
]

// Mock map data
const mockMapData = {
  trees: [
    { id: 1, lat: -1.2921, lng: 36.7853, type: "Mango", plantedBy: "John Doe" },
    { id: 2, lat: -1.2931, lng: 36.7863, type: "Jacaranda" },
    { id: 3, lat: -1.2911, lng: 36.7843, type: "Neem", plantedBy: "Community Group" },
    { id: 4, lat: -1.2941, lng: 36.7873, type: "Mango" },
  ],
  issues: [
    { id: 1, lat: -1.2901, lng: 36.7833, type: "Blocked Drain", description: "Drain blocked with debris" },
    { id: 2, lat: -1.2951, lng: 36.7883, type: "Tree Cutting", description: "Unauthorized tree cutting reported" },
  ],
}

interface User {
  id: string
  name: string
  email: string
  avatar: string
  provider: "google" | "github"
}

export default function HomePage() {
  const router = useRouter()
  const { latitude, longitude, error, loading, refreshLocation } = useGeolocation()
  const [user, setUser] = useState<User | null>(null)
  const [mounted, setMounted] = useState(false)

  const handleLogin = (userData: User) => {
    setUser(userData)
    if (typeof window !== "undefined") {
      localStorage.setItem("greentrace_user", JSON.stringify(userData))
    }
  }

  const handleLogout = () => {
    setUser(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("greentrace_user")
    }
  }

  // Load user from localStorage on component mount
  useEffect(() => {
    setMounted(true)
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("greentrace_user")
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
    }
  }, [])

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🌳</div>
          <p>Loading GreenTrace Lite...</p>
        </div>
      </div>
    )
  }

  // Use user's location or default to Kilimani center
  const mapCenter: [number, number] = latitude && longitude ? [latitude, longitude] : [-1.2921, 36.7853]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Navigation */}
      <nav className="bg-green-600 text-white p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">GreenTrace Lite</h1>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/add-tree")}
              className="text-white hover:bg-green-700"
              disabled={!user}
            >
              Add Tree
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/report")}
              className="text-white hover:bg-green-700"
              disabled={!user}
            >
              Report
            </Button>
          </div>
        </div>
      </nav>

      <div className="p-4 space-y-6">
        {/* Social Login */}
        <SocialLogin user={user} onLogin={handleLogin} onLogout={handleLogout} />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center space-x-3">
              <Tree className="text-green-600" size={24} />
              <div>
                <p className="text-2xl font-bold">128</p>
                <p className="text-sm text-gray-600">Trees Added</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center space-x-3">
              <AlertCircle className="text-red-600" size={24} />
              <div>
                <p className="text-2xl font-bold">42</p>
                <p className="text-sm text-gray-600">Issues Reported</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center space-x-3">
              <Users className="text-blue-600" size={24} />
              <div>
                <p className="text-2xl font-bold">15</p>
                <p className="text-sm text-gray-600">Active Users</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Location Status */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin size={16} className="text-gray-600" />
                <span className="text-sm">Your Location:</span>
              </div>
              <Button variant="outline" size="sm" onClick={refreshLocation} disabled={loading}>
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              </Button>
            </div>
            {loading && <p className="text-sm text-gray-500 mt-2">Getting location...</p>}
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
            {latitude && longitude && (
              <p className="text-sm font-mono mt-2">
                {latitude.toFixed(4)}, {longitude.toFixed(4)}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Interactive Map */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Kilimani Area Map</h3>
            <InteractiveMap center={mapCenter} data={mockMapData} className="border border-gray-200" />
            <div className="flex items-center justify-center space-x-4 mt-3 text-xs text-gray-600">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Trees</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Issues</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => router.push("/add-tree")}
            className="bg-green-600 hover:bg-green-700 h-12"
            disabled={!user}
          >
            <Plus size={20} className="mr-2" />
            Add Tree
          </Button>

          <Button
            onClick={() => router.push("/report")}
            variant="outline"
            className="border-red-600 text-red-600 hover:bg-red-50 h-12"
            disabled={!user}
          >
            <AlertTriangle size={20} className="mr-2" />
            Report Issue
          </Button>
        </div>

        {!user && (
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-gray-600">Sign in to add trees and report issues</p>
            </CardContent>
          </Card>
        )}

        {/* Recent Activity */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Recent Activity</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {mockActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  {activity.type === "tree" ? (
                    <Tree className="text-green-600 mt-0.5" size={16} />
                  ) : (
                    <AlertCircle className="text-red-600 mt-0.5" size={16} />
                  )}
                  <div className="flex-1">
                    <p className="text-sm">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
