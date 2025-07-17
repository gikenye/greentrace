"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useGeolocation } from "../../hooks/useGeolocation"
import { RefreshCw, MapPin, Plus, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AddTreePage() {
  const router = useRouter()
  const [treeType, setTreeType] = useState("")
  const [plantedBy, setPlantedBy] = useState("")
  const { latitude, longitude, error, loading, refreshLocation } = useGeolocation()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!latitude || !longitude) {
      alert("Location is required to add a tree. Please enable location access.")
      return
    }
    alert(`Tree added successfully at ${latitude.toFixed(4)}, ${longitude.toFixed(4)}! (Mock submission)`)
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-green-600 text-white p-4">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-white hover:bg-green-700 p-2">
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-bold">Add a New Tree</h1>
        </div>
      </nav>

      <div className="p-4">
        <Card>
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="tree-type">Tree Type</Label>
                <Select value={treeType} onValueChange={setTreeType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tree type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mango">Mango</SelectItem>
                    <SelectItem value="jacaranda">Jacaranda</SelectItem>
                    <SelectItem value="neem">Neem</SelectItem>
                  </SelectContent>
                </Select>
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

              <div>
                <Label htmlFor="planted-by">Planted By (Optional)</Label>
                <Input
                  id="planted-by"
                  value={plantedBy}
                  onChange={(e) => setPlantedBy(e.target.value)}
                  placeholder="Your name or organization"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={!latitude || !longitude}
              >
                Add Tree
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
