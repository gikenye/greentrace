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
    <div className="min-h-screen bg-green-50">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b border-green-100 sticky top-0 z-10">
        <div className="p-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-green-700 hover:bg-green-50 p-2">
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-green-800">Document Tree</h1>
              <p className="text-sm text-green-600">Add to urban forest database</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Location Status */}
        <MobileCard>
          <MobileCardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <MapPin size={16} className="text-green-600" />
                <span className="text-sm font-medium">Documentation Location</span>
              </div>
              <Button variant="outline" size="sm" onClick={refreshLocation} disabled={loading}>
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              </Button>
            </div>
            
            {loading && (
              <div className="flex items-center space-x-2 text-green-600">
                <RefreshCw size={16} className="animate-spin" />
                <span className="text-sm">Getting precise location...</span>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
                <Button variant="outline" size="sm" onClick={refreshLocation} className="mt-2">
                  Try Again
                </Button>
              </div>
            )}
            
            {latitude && longitude && (
              <div className="bg-green-100 border border-green-200 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-700">Location confirmed</span>
                </div>
                <p className="text-sm font-mono text-green-600">
                  {latitude.toFixed(6)}, {longitude.toFixed(6)}
                </p>
                <p className="text-xs text-green-500">Kilimani, Nairobi</p>
              </div>
            )}
          </MobileCardContent>
        </MobileCard>

        {/* Tree Documentation Component */}
        <TreeDocumentation
          onDocumentationComplete={handleDocumentationComplete}
          latitude={latitude}
          longitude={longitude}
          userId={user?.address || 'anonymous'}
        />

        {/* Success Message */}
        {classificationResult && (
          <MobileCard variant="primary">
            <MobileCardContent className="p-6 text-center">
              <Tree className="mx-auto mb-3" size={32} />
              <h3 className="text-lg font-bold mb-2">
                {classificationResult.species} Successfully Documented
              </h3>
              <p className="text-green-100 mb-3">
                Added to Kilimani's urban forest database for conservation tracking
              </p>
              <div className="bg-white/20 rounded-lg p-3">
                <p className="text-sm">
                  <strong>Conservation Status:</strong> {classificationResult.conservationStatus}
                </p>
                <p className="text-xs text-green-100 mt-1">
                  This data helps monitor deforestation and urban development impact
                </p>
              </div>
            </MobileCardContent>
          </MobileCard>
        )}
      </div>
    </div>
  )
}
