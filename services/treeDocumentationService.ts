"use client"

import { TreeRecord, TreeClassificationResult } from "./treeClassification"

export interface TreeNetworkStats {
  totalTrees: number
  speciesCount: number
  userContributions: number
  areasCovered: number
}

export class TreeDocumentationService {
  private static instance: TreeDocumentationService
  private treeRecords: TreeRecord[] = []
  
  static getInstance(): TreeDocumentationService {
    if (!TreeDocumentationService.instance) {
      TreeDocumentationService.instance = new TreeDocumentationService()
      // Initialize with some mock data
      TreeDocumentationService.instance.initializeMockData()
    }
    return TreeDocumentationService.instance
  }

  private initializeMockData() {
    this.treeRecords = [
      {
        id: '1',
        species: 'Mango',
        commonName: 'Mango Tree',
        scientificName: 'Mangifera indica',
        latitude: -1.2921,
        longitude: 36.7853,
        timestamp: Date.now() - 86400000,
        imageHash: 'QmHash1',
        submittedBy: 'community',
        verified: true,
        conservationStatus: 'Stable'
      },
      {
        id: '2',
        species: 'Jacaranda',
        commonName: 'Jacaranda Tree',
        scientificName: 'Jacaranda mimosifolia',
        latitude: -1.2931,
        longitude: 36.7863,
        timestamp: Date.now() - 172800000,
        imageHash: 'QmHash2',
        submittedBy: 'community',
        verified: true,
        conservationStatus: 'Stable'
      },
      {
        id: '3',
        species: 'Baobab',
        commonName: 'Baobab Tree',
        scientificName: 'Adansonia digitata',
        latitude: -1.2901,
        longitude: 36.7833,
        timestamp: Date.now() - 259200000,
        imageHash: 'QmHash3',
        submittedBy: 'community',
        verified: true,
        conservationStatus: 'Vulnerable'
      }
    ]
  }

  async submitTreeRecord(
    classification: TreeClassificationResult,
    latitude: number,
    longitude: number,
    imageHash: string,
    submittedBy: string
  ): Promise<TreeRecord> {
    const record: TreeRecord = {
      id: Date.now().toString(),
      species: classification.species,
      commonName: classification.commonName,
      scientificName: classification.scientificName,
      latitude,
      longitude,
      timestamp: Date.now(),
      imageHash,
      submittedBy,
      verified: false,
      conservationStatus: classification.conservationStatus
    }

    this.treeRecords.push(record)
    return record
  }

  getTreeRecords(): TreeRecord[] {
    return this.treeRecords
  }

  getUserTreeRecords(userId: string): TreeRecord[] {
    return this.treeRecords.filter(record => record.submittedBy === userId)
  }

  getNetworkStats(userId?: string): TreeNetworkStats {
    const userTrees = userId ? this.getUserTreeRecords(userId) : []
    const uniqueSpecies = new Set(this.treeRecords.map(r => r.species))
    
    return {
      totalTrees: this.treeRecords.length,
      speciesCount: uniqueSpecies.size,
      userContributions: userTrees.length,
      areasCovered: Math.floor(this.treeRecords.length / 10) + 1
    }
  }

  calculateTreeConnections(maxDistance: number = 0.005): Array<{from: TreeRecord, to: TreeRecord, distance: number}> {
    const connections: Array<{from: TreeRecord, to: TreeRecord, distance: number}> = []
    
    for (let i = 0; i < this.treeRecords.length; i++) {
      for (let j = i + 1; j < this.treeRecords.length; j++) {
        const tree1 = this.treeRecords[i]
        const tree2 = this.treeRecords[j]
        
        const distance = Math.sqrt(
          Math.pow(tree1.latitude - tree2.latitude, 2) + 
          Math.pow(tree1.longitude - tree2.longitude, 2)
        )
        
        if (distance <= maxDistance) {
          connections.push({ from: tree1, to: tree2, distance })
        }
      }
    }
    
    return connections
  }
}
