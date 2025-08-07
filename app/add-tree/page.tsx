"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useGeolocation } from "../../hooks/useGeolocation"
import { TreeDocumentation } from "../../components/TreeDocumentation"
import { MobileCard, MobileCardContent } from "../../components/ui/mobile-card"
import { RefreshCw, MapPin, ArrowLeft, TreesIcon as Tree } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { TreeClassificationResult } from "../../services/treeClassification"
import { ThirdwebUser } from "../../services/thirdwebService"

export default function AddTreePage() {
  const router = useRouter()
  const { latitude, longitude, error, loading, refreshLocation } = useGeolocation()
  const [classificationResult, setClassificationResult] = useState<TreeClassificationResult | null>(null)
  const [user, setUser] = useState<ThirdwebUser | null>(null)

  // Load user from localStorage on mount
  useState(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("greentrace_thirdweb_user")
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
    }
  })

  const handleDocumentationComplete = (result: TreeClassificationResult) => {
    setClassificationResult(result)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Enhanced Mobile Header */}
      <div className="shadow-lg sticky top-0 z-10" style={{background: 'linear-gradient(to right, #00563B, #006B47)'}}>
        <div className="p-4">
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
                <Tree size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Document Tree</h1>
                <p className="text-sm text-green-100">Add to urban forest database</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Enhanced Location Status */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{backgroundColor: '#00563B20'}}>
                <MapPin size={20} style={{color: '#00563B'}} />
              </div>
              <div>
                <h3 className="font-bold text-green-800">Documentation Location</h3>
                <p className="text-sm text-green-600">GPS coordinates for tree mapping</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshLocation} 
              disabled={loading}
              className="rounded-full border-green-300 text-green-600 hover:bg-green-50"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </Button>
          </div>
          
          {loading && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <RefreshCw size={20} className="animate-spin text-blue-600" />
                <div>
                  <p className="font-medium text-blue-800">Getting precise location...</p>
                  <p className="text-sm text-blue-600">This may take a few seconds</p>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle size={16} className="text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-red-800">Location Error</p>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshLocation} 
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                Try Again
              </Button>
            </div>
          )}
          
          {latitude && longitude && (
            <div className="rounded-xl p-4 border" style={{background: 'linear-gradient(to right, #00563B10, #006B4710)', borderColor: '#00563B40'}}>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{backgroundColor: '#00563B'}}>
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                </div>
                <div>
                  <p className="font-bold" style={{color: '#00563B'}}>Location Confirmed</p>
                  <p className="text-sm" style={{color: '#00563B'}}>Ready for tree documentation</p>
                </div>
              </div>
              <div className="bg-white/50 rounded-lg p-3">
                <p className="text-sm font-mono font-medium" style={{color: '#00563B'}}>
                  {latitude.toFixed(6)}, {longitude.toFixed(6)}
                </p>

              </div>
            </div>
          )}
        </div>

        {/* Tree Documentation Component */}
        <TreeDocumentation
          onDocumentationComplete={handleDocumentationComplete}
          userId={user?.address || 'anonymous'}
        />

        {/* Enhanced Success Message */}
        {classificationResult && (
          <div className="rounded-2xl p-8 text-center text-white shadow-xl border-4" style={{background: 'linear-gradient(to right, #00563B, #006B47)', borderColor: '#00563B40'}}>
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tree size={40} />
            </div>
            <h3 className="text-2xl font-bold mb-3">
              🎉 {classificationResult.species} Successfully Documented!
            </h3>
            <p className="text-green-100 mb-6 text-lg">
              Added to Kilimani's urban forest database for conservation tracking
            </p>
            <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="text-lg">📊</span>
                <p className="font-bold">
                  Conservation Status: {classificationResult.conservationStatus}
                </p>
              </div>
              <p className="text-sm text-green-100">
                This data helps monitor deforestation and urban development impact
              </p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white/10 rounded-lg p-3">
                <span className="text-lg block mb-1">🌳</span>
                <span>Forest Network</span>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <span className="text-lg block mb-1">📍</span>
                <span>GPS Mapped</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
