"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Camera, Sparkles, Coins, CheckCircle } from 'lucide-react'
import { TreeClassificationService, TreeClassificationResult } from "../services/treeClassification"
import { BlockchainService } from "../services/blockchainService"

interface TreeClassificationProps {
  onClassificationComplete: (result: TreeClassificationResult) => void
  latitude?: number
  longitude?: number
}

export function TreeClassification({ onClassificationComplete, latitude, longitude }: TreeClassificationProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [classifying, setClassifying] = useState(false)
  const [submittingToBlockchain, setSubmittingToBlockchain] = useState(false)
  const [result, setResult] = useState<TreeClassificationResult | null>(null)
  const [blockchainSubmitted, setBlockchainSubmitted] = useState(false)

  const classificationService = TreeClassificationService.getInstance()
  const blockchainService = BlockchainService.getInstance()

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
      onClassificationComplete(classification)
    } catch (error) {
      console.error('Classification failed:', error)
      alert('Failed to classify image. Please try again.')
    } finally {
      setClassifying(false)
    }
  }

  const submitToBlockchain = async () => {
    if (!result || !latitude || !longitude) return

    setSubmittingToBlockchain(true)
    try {
      const imageHash = 'Qm' + Math.random().toString(36).substr(2, 44) // Mock IPFS hash
      
      const submission = await blockchainService.submitTreeToBlockchain(
        result.species,
        imageHash,
        latitude,
        longitude
      )

      if (submission.success) {
        setBlockchainSubmitted(true)
        alert(`🎉 Tree submitted successfully! You'll earn ${result.baseReward} TREE tokens once verified.`)
      }
    } catch (error) {
      console.error('Blockchain submission failed:', error)
      alert('Failed to submit to blockchain. Please try again.')
    } finally {
      setSubmittingToBlockchain(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Sparkles className="text-purple-600" size={20} />
          <span>AI Tree Classification</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Image Upload */}
        <div>
          <label htmlFor="tree-image" className="block text-sm font-medium mb-2">
            Upload Tree Photo
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
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
                    setBlockchainSubmitted(false)
                  }}
                >
                  Choose Different Image
                </Button>
              </div>
            ) : (
              <div className="text-gray-400">
                <Camera size={32} className="mx-auto mb-2" />
                <p className="font-medium">Take or upload a tree photo</p>
                <p className="text-sm">AI will identify the species and rarity</p>
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
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {classifying ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Analyzing with AI...</span>
              </div>
            ) : (
              <>
                <Sparkles className="mr-2" size={16} />
                Classify Tree Species
              </>
            )}
          </Button>
        )}

        {/* Classification Progress */}
        {classifying && (
          <div className="space-y-2">
            <div className="text-sm text-gray-600">AI Analysis in progress...</div>
            <Progress value={75} className="w-full" />
            <div className="text-xs text-gray-500">
              Using advanced computer vision to identify tree species
            </div>
          </div>
        )}

        {/* Classification Result */}
        {result && (
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-lg text-green-800">
                  {classificationService.getRarityEmoji(result.rarity)} {result.species}
                </h3>
                <Badge 
                  style={{ 
                    backgroundColor: classificationService.getRarityColor(result.rarity),
                    color: 'white'
                  }}
                >
                  {result.rarity}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Confidence:</span>
                  <span className="font-medium">{(result.confidence * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Reward:</span>
                  <span className="font-medium flex items-center">
                    <Coins className="mr-1" size={14} />
                    {result.baseReward} TREE tokens
                  </span>
                </div>
              </div>

              {!blockchainSubmitted ? (
                <Button
                  onClick={submitToBlockchain}
                  disabled={submittingToBlockchain || !latitude || !longitude}
                  className="w-full mt-4 bg-green-600 hover:bg-green-700"
                >
                  {submittingToBlockchain ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Submitting to Blockchain...</span>
                    </div>
                  ) : (
                    <>
                      <Coins className="mr-2" size={16} />
                      Submit & Earn Tokens
                    </>
                  )}
                </Button>
              ) : (
                <div className="mt-4 p-3 bg-green-100 rounded-lg flex items-center space-x-2 text-green-800">
                  <CheckCircle size={16} />
                  <span className="text-sm font-medium">
                    Successfully submitted! Tokens will be awarded after verification.
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Rarity Guide */}
        <Card className="bg-gray-50">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-2 text-sm">Tree Rarity Guide</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center space-x-1">
                <span>🌱</span>
                <span>Common (10 tokens)</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>🌿</span>
                <span>Uncommon (25 tokens)</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>🌳</span>
                <span>Rare (50 tokens)</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>🌲</span>
                <span>Epic (100 tokens)</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>🌟</span>
                <span>Legendary (200 tokens)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}
