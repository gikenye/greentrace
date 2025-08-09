"use client"

import { TreeRecord } from "../services/treeDocumentationService"
import { MobileCard, MobileCardContent, MobileCardHeader, MobileCardTitle } from "./ui/mobile-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TreesIcon as Tree, MapPin, Calendar, User, Shield, X, Hash, Coins } from 'lucide-react'

interface TreeDetailsModalProps {
  tree: TreeRecord | null
  isOpen: boolean
  onClose: () => void
  isUserTree?: boolean
}

export function TreeDetailsModal({ tree, isOpen, onClose, isUserTree = false }: TreeDetailsModalProps) {
  if (!isOpen || !tree) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Stable': return 'bg-green-100 text-green-700'
      case 'Vulnerable': return 'bg-yellow-100 text-yellow-700'
      case 'Endangered': return 'bg-orange-100 text-orange-700'
      case 'Critical': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <MobileCard className="border-0 shadow-none">
          <MobileCardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <MobileCardTitle className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isUserTree ? 'bg-green-600' : 'bg-green-500'}`}>
                  <Tree size={16} className="text-white" />
                </div>
                <span>{tree.species}</span>
              </MobileCardTitle>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X size={16} />
              </Button>
            </div>
          </MobileCardHeader>
          
          <MobileCardContent className="space-y-4">
            {/* Species Info */}
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">{tree.commonName}</h3>
              {tree.scientificName && (
                <p className="text-sm italic text-green-600 mb-2">{tree.scientificName}</p>
              )}
              <Badge className={`${getStatusColor(tree.conservationStatus)} border-0`}>
                {tree.conservationStatus}
              </Badge>
            </div>

            {/* Location */}
            <div className="flex items-start space-x-3">
              <MapPin size={16} className="text-gray-500 mt-1" />
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-xs font-mono text-gray-600">
                  {tree.latitude.toFixed(6)}, {tree.longitude.toFixed(6)}
                </p>
              </div>
            </div>

            {/* Documentation Date */}
            <div className="flex items-start space-x-3">
              <Calendar size={16} className="text-gray-500 mt-1" />
              <div>
                <p className="text-sm font-medium">Documented</p>
                <p className="text-xs text-gray-600">
                  {new Date(tree.timestamp).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(tree.timestamp).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>

            {/* Contributor */}
            <div className="flex items-start space-x-3">
              <User size={16} className="text-gray-500 mt-1" />
              <div>
                <p className="text-sm font-medium">Contributor</p>
                <p className="text-xs text-gray-600">
                  {isUserTree ? 'You' : 'Community Member'}
                </p>
                {isUserTree && (
                  <Badge className="bg-green-100 text-green-700 border-0 text-xs mt-1">
                    Your Documentation
                  </Badge>
                )}
              </div>
            </div>

            {/* Verification Status */}
            <div className="flex items-start space-x-3">
              <Shield size={16} className="text-gray-500 mt-1" />
              <div>
                <p className="text-sm font-medium">Verification</p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className={`w-2 h-2 rounded-full ${tree.verified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  <span className="text-xs text-gray-600">
                    {tree.verified ? 'Verified by AI' : 'Pending Verification'}
                  </span>
                </div>
              </div>
            </div>

            {/* Blockchain Transaction */}
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-start space-x-3 mb-3">
                <Hash size={16} className="text-blue-600 mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-800">Blockchain Transaction</p>
                  <p className="text-xs font-mono text-blue-600 break-all mb-1">
                    {tree.transactionHash}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div>Block: #{tree.blockNumber.toLocaleString()}</div>
                    <div>Gas: {tree.gasUsed} ETH</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1">
                  <Coins size={12} className="text-yellow-600" />
                  <span className="text-gray-600">Reward: {tree.conservationStatus === 'Critical' ? '200' : tree.conservationStatus === 'Endangered' ? '150' : tree.conservationStatus === 'Vulnerable' ? '100' : '50'} TREE</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium">Confirmed</span>
                </div>
              </div>
            </div>

            {/* Tree ID */}
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Tree ID</p>
              <p className="text-xs font-mono text-gray-700">{tree.id}</p>
            </div>

            {/* Conservation Info */}
            {tree.conservationStatus !== 'Stable' && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <p className="text-sm font-medium text-orange-800 mb-1">Conservation Alert</p>
                <p className="text-xs text-orange-700">
                  This species requires special attention and protection efforts.
                </p>
              </div>
            )}
          </MobileCardContent>
        </MobileCard>
      </div>
    </div>
  )
}