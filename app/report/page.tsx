"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useGeolocation } from "../../hooks/useGeolocation"
import { RefreshCw, MapPin, Plus, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import dynamic from "next/dynamic"

// Dynamically import the map component
const InteractiveMap = dynamic(
  () => import("../../components/InteractiveMap").then((mod) => ({ default: mod.InteractiveMap })),
  {
    ssr: false,
    loading: () => (
      <div className="h-48 w-full rounded-lg bg-gray-200 flex items-center justify-center">
        <div className="text-gray-500 text-center">
          <MapPin size={32} className="mx-auto mb-2 animate-pulse" />
          <p>Loading Map...</p>
        </div>
      </div>
    ),
  },
)

// Mock map data
const mockMapData = {
  trees: [
    { id: 1, lat: -1.2921, lng: 36.7853, type: "Mango", plantedBy: "John Doe" },
    { id: 2, lat: -1.2931, lng: 36.7863, type: "Jacaranda" },
  ],
  issues: [
    { id: 1, lat: -1.2901, lng: 36.7833, type: "Blocked Drain", description: "Drain blocked with debris" },
    { id: 2, lat: -1.2951, lng: 36.7883, type: "Tree Cutting", description: "Unauthorized tree cutting reported" },
  ],
}

export default function ReportIssuePage() {
  const router = useRouter()
  const [issueType, setIssueType] = useState("")
  const [description, setDescription] = useState("")
  const { latitude, longitude, error, loading, refreshLocation } = useGeolocation()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!latitude || !longitude) {
      alert("Location is required to report an issue. Please enable location access.")
      return
    }
    alert(`Issue reported successfully at ${latitude.toFixed(4)}, ${longitude.toFixed(4)}! (Mock submission)`)
    router.push("/")
  }

  const mapCenter: [number, number] = latitude && longitude ? [latitude, longitude] : [-1.2921, 36.7853]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Navigation */}
      <nav className="bg-green-600 text-white p-4">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-white hover:bg-green-700 p-2">
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-bold">Report Environmental Issue</h1>
        </div>
      </nav>

      <div className="p-4 space-y-6">
        {/* Area Map */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3 text-green-800">Issue Location Context</h3>
            <InteractiveMap center={mapCenter} data={mockMapData} className="border border-green-200" />
            <p className="text-xs text-gray-600 mt-2 text-center">
              Current area overview • Your issue will be added to this map
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="issue-type">Issue Type</Label>
                <Select value={issueType} onValueChange={setIssueType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select issue type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flooding">🌊 Flooding</SelectItem>
                    <SelectItem value="tree-cutting">🪓 Tree Cutting</SelectItem>
                    <SelectItem value="trash">🗑️ Trash</SelectItem>
                    <SelectItem value="noise">🔊 Noise</SelectItem>
                    <SelectItem value="air-pollution">💨 Air Pollution</SelectItem>
                    <SelectItem value="water-pollution">💧 Water Pollution</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the environmental issue in detail..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="photo">Photo</Label>
                <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <div className="text-gray-400">
                    <Plus size={32} className="mx-auto mb-2" />
                    <p>Tap to upload photo</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label>Location</Label>
                  <Button type="button" variant="outline" size="sm" onClick={refreshLocation} disabled={loading}>
                    <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                  </Button>
                </div>
                <div className="mt-1 p-3 bg-gray-100 rounded-lg">
                  {loading && (
                    <div className="flex items-center space-x-2">
                      <RefreshCw size={16} className="animate-spin text-gray-600" />
                      <span className="text-sm text-gray-600">Getting location...</span>
                    </div>
                  )}
                  {error && <div className="text-sm text-red-500">{error}</div>}
                  {latitude && longitude && (
                    <>
                      <div className="flex items-center space-x-2">
                        <MapPin size={16} className="text-gray-600" />
                        <span className="text-sm text-gray-600">Current location:</span>
                      </div>
                      <p className="text-sm font-mono mt-1">
                        {latitude.toFixed(4)}, {longitude.toFixed(4)}
                      </p>
                      <p className="text-xs text-gray-500">Kilimani, Nairobi</p>
                    </>
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={!latitude || !longitude}>
                Report Issue
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
