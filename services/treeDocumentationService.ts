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

  private generateTransactionHash(): string {
    return '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')
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
        conservationStatus: 'Stable',
        transactionHash: '0xa7b3c8d9e2f1a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9',
        blockNumber: 18456789,
        gasUsed: '0.0023'
      },
      {
        id: '2',
        species: 'Jacaranda',
        commonName: 'Jacaranda Tree',
        scientificName: 'Jacaranda mimosifolia',
        latitude: -1.2925,
        longitude: 36.7857,
        timestamp: Date.now() - 172800000,
        imageHash: 'QmHash2',
        submittedBy: 'community',
        verified: true,
        conservationStatus: 'Stable',
        transactionHash: '0xb8c4d0e3f2a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1',
        blockNumber: 18456790,
        gasUsed: '0.0021'
      },
      {
        id: '3',
        species: 'Baobab',
        commonName: 'Baobab Tree',
        scientificName: 'Adansonia digitata',
        latitude: -1.2918,
        longitude: 36.7850,
        timestamp: Date.now() - 259200000,
        imageHash: 'QmHash3',
        submittedBy: 'community',
        verified: true,
        conservationStatus: 'Vulnerable',
        transactionHash: '0xc9d5e1f4a3b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2',
        blockNumber: 18456791,
        gasUsed: '0.0034'
      },
      {
        id: '4',
        species: 'Neem',
        commonName: 'Neem Tree',
        scientificName: 'Azadirachta indica',
        latitude: -1.2923,
        longitude: 36.7855,
        timestamp: Date.now() - 345600000,
        imageHash: 'QmHash4',
        submittedBy: 'community',
        verified: true,
        conservationStatus: 'Stable',
        transactionHash: '0xd0e6f2a5b4c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3',
        blockNumber: 18456792,
        gasUsed: '0.0019'
      },
      {
        id: '5',
        species: 'Eucalyptus',
        commonName: 'Eucalyptus Tree',
        scientificName: 'Eucalyptus globulus',
        latitude: -1.2927,
        longitude: 36.7851,
        timestamp: Date.now() - 432000000,
        imageHash: 'QmHash5',
        submittedBy: 'community',
        verified: true,
        conservationStatus: 'Stable',
        transactionHash: '0xe1f7a3b6c5d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4',
        blockNumber: 18456793,
        gasUsed: '0.0025'
      },
      {
        id: '6',
        species: 'Acacia',
        commonName: 'Acacia Tree',
        scientificName: 'Acacia tortilis',
        latitude: -1.2919,
        longitude: 36.7854,
        timestamp: Date.now() - 518400000,
        imageHash: 'QmHash6',
        submittedBy: 'community',
        verified: true,
        conservationStatus: 'Endangered',
        transactionHash: '0xf2a8b4c7d6e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5',
        blockNumber: 18456794,
        gasUsed: '0.0041'
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
      conservationStatus: classification.conservationStatus,
      transactionHash: this.generateTransactionHash(),
      blockNumber: 18456795 + this.treeRecords.length,
      gasUsed: (0.002 + Math.random() * 0.003).toFixed(4)
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
