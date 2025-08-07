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

  const mapCenter: [number, number] = latitude && longitude ? [latitude, longitude] : [0, 0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* Enhanced Navigation */}
      <nav className="text-white p-4 shadow-lg" style={{background: 'linear-gradient(to right, #00563B, #006B47)'}}>
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.back()} 
            className="text-white hover:bg-white/20 p-2 rounded-full"
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold">Report Environmental Issue</h1>
              <p className="text-sm text-green-100">Help protect our community</p>
            </div>
          </div>
        </div>
      </nav>

      <div className="p-4 space-y-6">
        {/* Enhanced Area Map */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <MapPin size={20} className="text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-orange-800">Issue Location Context</h3>
              <p className="text-sm text-orange-600">Current area overview</p>
            </div>
          </div>
          <InteractiveMap center={mapCenter} data={mockMapData} className="border border-orange-200 rounded-xl" />
          <div className="mt-4 bg-orange-50 rounded-lg p-3">
            <p className="text-sm text-orange-700 text-center font-medium">
              📍 Your issue will be added to this map for community awareness
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">📝</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-orange-800">Issue Details</h3>
              <p className="text-sm text-orange-600">Provide information about the environmental concern</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="issue-type" className="text-lg font-semibold text-gray-800">Issue Type</Label>
                <Select value={issueType} onValueChange={setIssueType}>
                  <SelectTrigger className="h-14 text-lg border-2 border-orange-200 rounded-xl focus:border-orange-500">
                    <SelectValue placeholder="Select the type of environmental issue" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="flooding" className="text-lg p-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🌊</span>
                        <div>
                          <div className="font-medium">Flooding</div>
                          <div className="text-sm text-gray-500">Water accumulation, drainage issues</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="tree-cutting" className="text-lg p-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🪓</span>
                        <div>
                          <div className="font-medium">Tree Cutting</div>
                          <div className="text-sm text-gray-500">Unauthorized tree removal</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="trash" className="text-lg p-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🗑️</span>
                        <div>
                          <div className="font-medium">Trash</div>
                          <div className="text-sm text-gray-500">Illegal dumping, litter</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="noise" className="text-lg p-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🔊</span>
                        <div>
                          <div className="font-medium">Noise Pollution</div>
                          <div className="text-sm text-gray-500">Excessive noise levels</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="air-pollution" className="text-lg p-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">💨</span>
                        <div>
                          <div className="font-medium">Air Pollution</div>
                          <div className="text-sm text-gray-500">Smoke, dust, emissions</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="water-pollution" className="text-lg p-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">💧</span>
                        <div>
                          <div className="font-medium">Water Pollution</div>
                          <div className="text-sm text-gray-500">Contaminated water sources</div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-lg font-semibold text-gray-800">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the environmental issue in detail... Include when you noticed it, severity, and any immediate impacts."
                  rows={5}
                  className="border-2 border-orange-200 rounded-xl focus:border-orange-500 text-lg p-4"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="photo" className="text-lg font-semibold text-gray-800">Photo Evidence</Label>
                <div className="border-2 border-dashed border-orange-300 rounded-xl p-8 text-center bg-orange-50 hover:bg-orange-100 transition-colors cursor-pointer">
                  <div className="text-orange-500">
                    <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Plus size={32} />
                    </div>
                    <p className="text-lg font-medium mb-1">Add Photo Evidence</p>
                    <p className="text-sm text-orange-600">Tap to upload photo of the issue</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-semibold text-gray-800">Location</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={refreshLocation} 
                    disabled={loading}
                    className="rounded-full border-orange-300 text-orange-600 hover:bg-orange-50"
                  >
                    <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                  </Button>
                </div>
                <div className="border-2 border-orange-200 rounded-xl p-4 bg-orange-50">
                  {loading && (
                    <div className="flex items-center space-x-3">
                      <RefreshCw size={20} className="animate-spin text-orange-600" />
                      <div>
                        <p className="font-medium text-orange-800">Getting precise location...</p>
                        <p className="text-sm text-orange-600">This helps identify the issue area</p>
                      </div>
                    </div>
                  )}
                  {error && (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertTriangle size={16} className="text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-red-800">Location Error</p>
                        <p className="text-sm text-red-600">{error}</p>
                      </div>
                    </div>
                  )}
                  {latitude && longitude && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                        </div>
                        <div>
                          <p className="font-bold text-green-800">Location Confirmed</p>
                          <p className="text-sm text-green-600">Ready to submit report</p>
                        </div>
                      </div>
                      <div className="bg-white/70 rounded-lg p-3 ml-11">
                        <p className="text-sm font-mono text-gray-700 font-medium">
                          {latitude.toFixed(6)}, {longitude.toFixed(6)}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">Kilimani, Nairobi • Kenya</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-16 text-lg rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200 text-white" 
                style={{background: 'linear-gradient(to right, #00563B, #006B47)'}}
                disabled={!latitude || !longitude}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <AlertTriangle size={24} />
                  </div>
                  <div className="text-left">
                    <div className="font-bold">Submit Report</div>
                    <div className="text-sm text-green-100">Alert the community</div>
                  </div>
                </div>
              </Button>
            </form>
        </div>
      </div>
    </div>
  )
}
