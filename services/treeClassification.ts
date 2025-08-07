"use client"

export interface TreeClassificationResult {
  species: string
  confidence: number
  commonName?: string
  scientificName?: string
  description?: string
  conservationStatus: 'Stable' | 'Vulnerable' | 'Endangered' | 'Critical'
}

export interface TreeRecord {
  id: string
  species: string
  commonName?: string
  scientificName?: string
  latitude: number
  longitude: number
  timestamp: number
  imageHash: string
  submittedBy: string
  verified: boolean
  conservationStatus: string
}

const treeSpeciesDatabase: Record<string, TreeClassificationResult> = {
  'mango': {
    species: 'Mango',
    commonName: 'Mango Tree',
    scientificName: 'Mangifera indica',
    confidence: 0.92,
    conservationStatus: 'Stable',
    description: 'Common fruit tree, important for urban biodiversity'
  },
  'jacaranda': {
    species: 'Jacaranda',
    commonName: 'Jacaranda Tree',
    scientificName: 'Jacaranda mimosifolia',
    confidence: 0.88,
    conservationStatus: 'Stable',
    description: 'Ornamental tree with purple flowers, non-native but established'
  },
  'neem': {
    species: 'Neem',
    commonName: 'Neem Tree',
    scientificName: 'Azadirachta indica',
    confidence: 0.85,
    conservationStatus: 'Stable',
    description: 'Medicinal tree with natural pesticide properties'
  },
  'baobab': {
    species: 'Baobab',
    commonName: 'Baobab Tree',
    scientificName: 'Adansonia digitata',
    confidence: 0.95,
    conservationStatus: 'Vulnerable',
    description: 'Ancient tree species, culturally significant and drought-resistant'
  },
  'acacia': {
    species: 'Acacia',
    commonName: 'Acacia Tree',
    scientificName: 'Acacia species',
    confidence: 0.78,
    conservationStatus: 'Stable',
    description: 'Native tree important for soil conservation'
  },
  'eucalyptus': {
    species: 'Eucalyptus',
    commonName: 'Eucalyptus Tree',
    scientificName: 'Eucalyptus species',
    confidence: 0.82,
    conservationStatus: 'Stable',
    description: 'Fast-growing tree, can impact local water table'
  },
  'cedar': {
    species: 'Cedar',
    commonName: 'Cedar Tree',
    scientificName: 'Cedrus species',
    confidence: 0.91,
    conservationStatus: 'Endangered',
    description: 'Valuable timber tree, declining due to over-harvesting'
  }
}

export class TreeClassificationService {
  private static instance: TreeClassificationService
  
  static getInstance(): TreeClassificationService {
    if (!TreeClassificationService.instance) {
      TreeClassificationService.instance = new TreeClassificationService()
    }
    return TreeClassificationService.instance
  }

  async classifyImage(imageFile: File): Promise<TreeClassificationResult> {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2500))
    
    // In production, this would call your AI model
    const species = Object.keys(treeSpeciesDatabase)
    const randomSpecies = species[Math.floor(Math.random() * species.length)]
    
    return treeSpeciesDatabase[randomSpecies]
  }

  getConservationColor(status: string): string {
    switch (status) {
      case 'Stable': return 'text-green-600'
      case 'Vulnerable': return 'text-yellow-600'
      case 'Endangered': return 'text-orange-600'
      case 'Critical': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  getConservationBgColor(status: string): string {
    switch (status) {
      case 'Stable': return 'bg-green-100'
      case 'Vulnerable': return 'bg-yellow-100'
      case 'Endangered': return 'bg-orange-100'
      case 'Critical': return 'bg-red-100'
      default: return 'bg-gray-100'
    }
  }
}
