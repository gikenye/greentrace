"use client"

import { useState } from "react"
import { MobileCard, MobileCardContent, MobileCardHeader, MobileCardTitle } from "./ui/mobile-card"
import { TreeRecord } from "../services/treeDocumentationService"
import { Badge } from "@/components/ui/badge"
import { TreesIcon as Tree, MapPin, Link, Eye } from 'lucide-react'
import { TreeDetailsModal } from "./TreeDetailsModal"

interface TreeConnection {
  from: TreeRecord
  to: TreeRecord
  distance: number
}

interface TreeNetworkCardProps {
  treeRecords: TreeRecord[]
  userRecords: TreeRecord[]
  connections: TreeConnection[]
}

export function TreeNetworkCard({ treeRecords, userRecords, connections }: TreeNetworkCardProps) {
  const [selectedTree, setSelectedTree] = useState<TreeRecord | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const getDistanceInMeters = (distance: number) => Math.round(distance * 111000) // Convert degrees to meters

  const userConnections = connections.filter(conn => 
    userRecords.some(ur => ur.id === conn.from.id || ur.id === conn.to.id)
  )

  const handleTreeClick = (tree: TreeRecord) => {
    setSelectedTree(tree)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedTree(null)
  }

  return (
    <MobileCard>
      <MobileCardHeader>
        <MobileCardTitle className="flex items-center space-x-2">
          <Tree size={20} style={{color: '#00563B'}} />
          <span>Tree Network Connections</span>
        </MobileCardTitle>
      </MobileCardHeader>
      <MobileCardContent className="space-y-4">
        {/* Network Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold" style={{color: '#00563B'}}>{connections.length}</div>
            <div className="text-xs text-gray-600">Connections</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-blue-600">{userConnections.length}</div>
            <div className="text-xs text-gray-600">Your Links</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-purple-600">{treeRecords.length}</div>
            <div className="text-xs text-gray-600">Total Trees</div>
          </div>
        </div>

        {/* Recent Trees */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm" style={{color: '#416600'}}>Recent Trees</h4>
          {treeRecords.slice(0, 4).map((tree) => {
            const isUserTree = userRecords.some(ur => ur.id === tree.id)
            
            return (
              <div 
                key={tree.id} 
                onClick={() => handleTreeClick(tree)}
                className={`p-3 rounded-lg border cursor-pointer hover:shadow-md transition-all ${isUserTree ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${isUserTree ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <span className="text-sm font-medium">{tree.species}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isUserTree && (
                      <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                        Yours
                      </Badge>
                    )}
                    <Eye size={12} className="text-gray-400" />
                  </div>
                </div>
                
                <div className="text-xs text-gray-600 mb-1">
                  {tree.scientificName || tree.commonName}
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{new Date(tree.timestamp).toLocaleDateString()}</span>
                  <Badge className={`text-xs border-0 ${
                    tree.conservationStatus === 'Stable' ? 'bg-green-100 text-green-600' :
                    tree.conservationStatus === 'Vulnerable' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {tree.conservationStatus}
                  </Badge>
                </div>
              </div>
            )
          })}
        </div>

        {treeRecords.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <Tree size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No trees documented yet</p>
            <p className="text-xs">Start documenting trees to build the network</p>
          </div>
        )}
      </MobileCardContent>
      
      <TreeDetailsModal
        tree={selectedTree}
        isOpen={isModalOpen}
        onClose={closeModal}
        isUserTree={selectedTree ? userRecords.some(ur => ur.id === selectedTree.id) : false}
      />
    </MobileCard>
  )
}