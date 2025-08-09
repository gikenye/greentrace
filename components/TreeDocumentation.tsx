"use client"

import { useState } from "react"
import { MobileCard, MobileCardContent, MobileCardHeader, MobileCardTitle } from "./ui/mobile-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Camera, MapPin, CheckCircle, Clock, AlertTriangle, Map, Coins } from 'lucide-react'
import { TreeClassificationService, TreeClassificationResult } from "../services/treeClassification"
import { TreeDocumentationService } from "../services/treeDocumentationService"
import dynamic from "next/dynamic"

const TreeNetworkMap = dynamic(
  () => import("./TreeNetworkMap").then((mod) => ({ default: mod.TreeNetworkMap })),
  { ssr: false }
)

interface TreeDocumentationProps {
  onDocumentationComplete: (result: TreeClassificationResult) => void
  latitude?: number
  longitude?: number
  userId: string
}

export function TreeDocumentation({ onDocumentationComplete, latitude, longitude, userId }: TreeDocumentationProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [classifying, setClassifying] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<TreeClassificationResult | null>(null)
  const [documented, setDocumented] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [showTokenAnimation, setShowTokenAnimation] = useState(false)
  const [tokensEarned, setTokensEarned] = useState(0)

  const classificationService = TreeClassificationService.getInstance()
  const documentationService = TreeDocumentationService.getInstance()

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const classifyImage = async () => {
    if (!selectedImage) return

    setClassifying(true)
    try {
      const classification = await classificationService.classifyImage(selectedImage)
      setResult(classification)
      onDocumentationComplete(classification)
    } catch (error) {
      console.error('Classification failed:', error)
      alert('Failed to identify tree species. Please try again.')
    } finally {
      setClassifying(false)
    }
  }

  const submitDocumentation = async () => {
    if (!result || !latitude || !longitude) return

    setSubmitting(true)
    try {
      const imageHash = 'Qm' + Math.random().toString(36).substr(2, 44) // Mock IPFS hash
      
      await documentationService.submitTreeRecord(
        result,
        latitude,
        longitude,
        imageHash,
        userId
      )

      const tokens = result.conservationStatus === 'Critical' ? 200 : 
                    result.conservationStatus === 'Endangered' ? 150 : 
                    result.conservationStatus === 'Vulnerable' ? 100 : 50
      
      setTokensEarned(tokens)
      setDocumented(true)
      setShowTokenAnimation(true)
      
      // Hide animation after 3 seconds
      setTimeout(() => setShowTokenAnimation(false), 3000)
    } catch (error) {
      console.error('Documentation submission failed:', error)
      alert('Failed to document tree. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <MobileCard>
        <MobileCardHeader>
          <MobileCardTitle className="flex items-center space-x-2">
            <Camera className="text-green-600" size={20} />
            <span>Document Tree</span>
          </MobileCardTitle>
        </MobileCardHeader>
        <MobileCardContent className="space-y-4">
          {/* Image Upload */}
          <div>
            <label htmlFor="tree-image" className="block text-sm font-medium mb-2 text-gray-700">
              Tree Photo
            </label>
            <div className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center bg-green-50">
              {imagePreview ? (
                <div className="space-y-3">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Tree preview"
                    className="max-h-48 mx-auto rounded-lg"
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      setImagePreview(null)
                      setSelectedImage(null)
                      setResult(null)
                      setDocumented(false)
                    }}
                    className="border-green-600 text-green-600"
                  >
                    Choose Different Photo
                  </Button>
                </div>
              ) : (
                <div className="text-green-600">
                  <Camera size={32} className="mx-auto mb-2" />
                  <p className="font-medium">Capture Tree Photo</p>
                  <p className="text-sm text-green-500">Help document urban forest</p>
                  <input
                    id="tree-image"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageSelect}
                    className="mt-3"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Classification Button */}
          {selectedImage && !result && (
            <Button
              onClick={classifyImage}
              disabled={classifying}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {classifying ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Identifying Species...</span>
                </div>
              ) : (
                <>
                  <Camera className="mr-2" size={16} />
                  Identify Tree Species
                </>
              )}
            </Button>
          )}

          {/* Classification Progress */}
          {classifying && (
            <div className="space-y-2">
              <div className="text-sm text-gray-600">AI analysis in progress...</div>
              <Progress value={75} className="w-full" />
              <div className="text-xs text-gray-500">
                Processing image to identify tree species
              </div>
            </div>
          )}
        </MobileCardContent>
      </MobileCard>

      {/* Classification Result */}
      {result && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🌳</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-xl" style={{color: '#416600'}}>{result.species}</h3>
              {result.scientificName && (
                <p className="text-sm italic text-gray-600">{result.scientificName}</p>
              )}
              <Badge className={`mt-1 ${classificationService.getConservationBgColor(result.conservationStatus)} ${classificationService.getConservationColor(result.conservationStatus)} border-0`}>
                {result.conservationStatus}
              </Badge>
            </div>
          </div>
          
          {result.description && (
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-700">{result.description}</p>
            </div>
          )}
          
          <div className="bg-blue-50 rounded-lg p-3 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-blue-800">Identification Confidence</span>
              <span className="text-sm font-bold text-blue-900">{(result.confidence * 100).toFixed(1)}%</span>
            </div>
            <Progress value={result.confidence * 100} className="bg-blue-200" />
          </div>

          {!documented ? (
            <Button
              onClick={submitDocumentation}
              disabled={submitting || !latitude || !longitude}
              className="w-full mt-4"
              style={{backgroundColor: '#416600'}}
            >
              {submitting ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Registering tree...</span>
                </div>
              ) : (
                <>
                  <MapPin className="mr-2" size={16} />
                  Register Tree
                </>
              )}
            </Button>
          ) : (
            <div className="mt-4 space-y-4">
              {/* Success Card */}
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-green-800">🎉 Tree Registered Successfully!</h4>
                    <p className="text-sm text-green-600">You're making a real difference!</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className="text-green-700 font-medium">✅ Verified & Secured</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Reward:</span>
                    <span className="text-yellow-700 font-medium">🪙 {tokensEarned} TREE tokens</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Impact:</span>
                    <span className="text-purple-700 font-medium">🌍 Forest preserved</span>
                  </div>
                </div>
              </div>
              
              {/* Map Button */}
              <Button
                onClick={() => setShowMap(!showMap)}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Map className="mr-2" size={16} />
                {showMap ? 'Hide Map' : 'View Your Tree on Map'}
              </Button>
              
              {/* Map View */}
              {showMap && latitude && longitude && (
                <div className="bg-white rounded-xl border border-blue-200 overflow-hidden">
                  <div className="p-3 bg-blue-50 border-b">
                    <h4 className="font-semibold text-blue-800">Your Tree Location</h4>
                    <p className="text-xs text-blue-600">Now part of the urban forest network</p>
                  </div>
                  <TreeNetworkMap
                    center={[latitude, longitude]}
                    zoom={16}
                    treeRecords={documentationService.getTreeRecords()}
                    userRecords={documentationService.getUserTreeRecords(userId)}
                    className="h-64"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Location Status */}
      <div className="bg-white rounded-2xl p-4 shadow-md border border-blue-100">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <MapPin size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-800">Tree Location</h3>
            <p className="text-xs text-gray-500">GPS coordinates for mapping</p>
          </div>
        </div>
        
        {latitude && longitude ? (
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-sm text-green-700 font-medium mb-1">✅ Location confirmed</p>
            <p className="text-xs font-mono text-gray-600">
              {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </p>
          </div>
        ) : (
          <div className="bg-yellow-50 rounded-lg p-3 flex items-center space-x-2">
            <AlertTriangle size={16} className="text-yellow-600" />
            <span className="text-sm text-yellow-700">Location required for registration</span>
          </div>
        )}
      </div>

      {/* Documentation Guide */}
      <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
        <h3 className="font-bold text-lg mb-4" style={{color: '#416600'}}>Documentation Tips</h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
            <div>
              <p className="font-semibold text-green-800">Clear Photo</p>
              <p className="text-sm text-green-600">Capture leaves, bark, and tree structure</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
            <div>
              <p className="font-semibold text-blue-800">Accurate Location</p>
              <p className="text-sm text-blue-600">Stand close for precise GPS coordinates</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-3 bg-purple-50 rounded-lg">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
            <div>
              <p className="font-semibold text-purple-800">Verify Results</p>
              <p className="text-sm text-purple-600">Check if species matches your observation</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Token Animation Overlay */}
      {showTokenAnimation && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-white rounded-2xl p-8 text-center animate-bounce">
            <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Coins size={40} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-yellow-600 mb-2">+{tokensEarned} TREE</h3>
            <p className="text-lg font-semibold text-green-700">Tokens Minted! 🎉</p>
            <p className="text-sm text-gray-600 mt-2">You're a forest hero!</p>
            <div className="flex justify-center space-x-1 mt-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`w-2 h-2 bg-yellow-400 rounded-full animate-ping`} style={{animationDelay: `${i * 0.2}s`}}></div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
