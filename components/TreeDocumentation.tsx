"use client"

import { useState } from "react"
import { MobileCard, MobileCardContent, MobileCardHeader, MobileCardTitle } from "./ui/mobile-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Camera, MapPin, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import { TreeClassificationService, TreeClassificationResult } from "../services/treeClassification"
import { TreeDocumentationService } from "../services/treeDocumentationService"

interface TreeDocumentationProps {
  onDocumentationComplete: (result: TreeClassificationResult) => void
  userId: string
}

export function TreeDocumentation({ onDocumentationComplete, userId }: TreeDocumentationProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [classifying, setClassifying] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<TreeClassificationResult | null>(null)
  const [documented, setDocumented] = useState(false)
  const [captureLocation, setCaptureLocation] = useState<{latitude: number, longitude: number} | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)

  const classificationService = TreeClassificationService.getInstance()
  const documentationService = TreeDocumentationService.getInstance()

  const handleImageCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Capture current location when photo is taken
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCaptureLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            })
            setLocationError(null)
          },
          (error) => {
            setLocationError("Failed to get precise location. Please ensure location access is enabled.")
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        )
      } else {
        setLocationError("Geolocation not supported")
      }
      
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
    if (!result || !captureLocation) return

    setSubmitting(true)
    try {
      const imageHash = 'Qm' + Math.random().toString(36).substr(2, 44) // Mock IPFS hash
      
      await documentationService.submitTreeRecord(
        result,
        captureLocation.latitude,
        captureLocation.longitude,
        imageHash,
        userId
      )

      setDocumented(true)
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
                      setCaptureLocation(null)
                      setLocationError(null)
                    }}
                    className="border-green-600 text-green-600"
                  >
                    Choose Different Photo
                  </Button>
                </div>
              ) : (
                <div className="text-green-600">
                  <Camera size={32} className="mx-auto mb-2" />
                  <p className="font-medium">Take Live Photo</p>
                  <p className="text-sm text-green-500">Camera only - location captured automatically</p>
                  <input
                    id="tree-image"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageCapture}
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
        <MobileCard variant="secondary">
          <MobileCardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-green-800">{result.species}</h3>
                <Badge className={`${classificationService.getConservationBgColor(result.conservationStatus)} ${classificationService.getConservationColor(result.conservationStatus)} border-0`}>
                  {result.conservationStatus}
                </Badge>
              </div>
              
              {result.scientificName && (
                <p className="text-sm italic text-gray-600">{result.scientificName}</p>
              )}
              
              {result.description && (
                <p className="text-sm text-gray-700">{result.description}</p>
              )}
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Identification Confidence:</span>
                  <span className="font-medium">{(result.confidence * 100).toFixed(1)}%</span>
                </div>
                <Progress value={result.confidence * 100} className="bg-gray-200" />
              </div>

              {!documented ? (
                <Button
                  onClick={submitDocumentation}
                  disabled={submitting || !captureLocation}
                  className="w-full bg-green-600 hover:bg-green-700 mt-4"
                >
                  {submitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Documenting Tree...</span>
                    </div>
                  ) : (
                    <>
                      <MapPin className="mr-2" size={16} />
                      Document Tree Location
                    </>
                  )}
                </Button>
              ) : (
                <div className="mt-4 p-3 bg-green-100 rounded-lg flex items-center space-x-2 text-green-800">
                  <CheckCircle size={16} />
                  <span className="text-sm font-medium">
                    Tree successfully documented and added to forest network
                  </span>
                </div>
              )}
            </div>
          </MobileCardContent>
        </MobileCard>
      )}

      {/* Location Status */}
      <MobileCard>
        <MobileCardContent className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <MapPin size={16} className="text-green-600" />
            <span className="text-sm font-medium">Photo Location</span>
          </div>
          
          {captureLocation ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-700">Location captured with photo</span>
              </div>
              <p className="text-sm font-mono text-green-600">
                {captureLocation.latitude.toFixed(6)}, {captureLocation.longitude.toFixed(6)}
              </p>
            </div>
          ) : locationError ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
              <AlertTriangle size={16} className="text-red-600" />
              <span className="text-sm text-red-700">{locationError}</span>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center space-x-2">
              <Clock size={16} className="text-blue-600" />
              <span className="text-sm text-blue-700">Location will be captured when you take a photo</span>
            </div>
          )}
        </MobileCardContent>
      </MobileCard>

      {/* Documentation Guide */}
      <MobileCard>
        <MobileCardHeader>
          <MobileCardTitle className="text-green-800">Documentation Tips</MobileCardTitle>
        </MobileCardHeader>
        <MobileCardContent className="space-y-3 text-sm">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-xs">1</div>
            <div>
              <p className="font-medium">Clear Photo</p>
              <p className="text-gray-600">Take photo with camera - location captured automatically</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-xs">2</div>
            <div>
              <p className="font-medium">Stand Close</p>
              <p className="text-gray-600">Position yourself near the tree for accurate GPS mapping</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-xs">3</div>
            <div>
              <p className="font-medium">Verify Results</p>
              <p className="text-gray-600">Check if the identified species matches your observation</p>
            </div>
          </div>
        </MobileCardContent>
      </MobileCard>
    </div>
  )
}
