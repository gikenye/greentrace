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
  transactionHash: string
  blockNumber: number
  gasUsed: string
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
  },
  'mukinduri': {
    species: 'Mukinduri',
    commonName: 'East African Greenheart',
    scientificName: 'Warburgia ugandensis',
    confidence: 0.90,
    conservationStatus: 'Vulnerable',
    description: 'Medicinal tree with antimicrobial properties, critical for forest ecosystems'
  },
  'muringa': {
    species: 'Muringa',
    commonName: 'Sausage Tree',
    scientificName: 'Kigelia africana',
    confidence: 0.87,
    conservationStatus: 'Stable',
    description: 'Tree with large fruit, used in traditional medicine and savanna restoration'
  },
  'muhugu': {
    species: 'Muhugu',
    commonName: 'African Teak',
    scientificName: 'Milicia excelsa',
    confidence: 0.93,
    conservationStatus: 'Endangered',
    description: 'Hardwood tree, heavily exploited for timber, vital for forest canopy'
  },
  'muthiga': {
    species: 'Muthiga',
    commonName: 'Red Stinkwood',
    scientificName: 'Prunus africana',
    confidence: 0.89,
    conservationStatus: 'Endangered',
    description: 'Medicinal bark tree, threatened by overharvesting for prostate treatment'
  },
  'mugumo': {
    species: 'Mugumo',
    commonName: 'Strangler Fig',
    scientificName: 'Ficus natalensis',
    confidence: 0.94,
    conservationStatus: 'Stable',
    description: 'Keystone species, supports epiphytic biodiversity and cultural significance'
  },
  'mukeu': {
    species: 'Mukeu',
    commonName: 'White Stinkwood',
    scientificName: 'Celtis africana',
    confidence: 0.86,
    conservationStatus: 'Stable',
    description: 'Deciduous tree, provides shade and supports avian seed dispersal'
  },
  'mutamayu': {
    species: 'Mutamayu',
    commonName: 'Cape Chestnut',
    scientificName: 'Calodendrum capense',
    confidence: 0.91,
    conservationStatus: 'Stable',
    description: 'Ornamental tree with pink flowers, enhances urban pollinator habitats'
  },
  'muringu': {
    species: 'Muringu',
    commonName: 'Cordia',
    scientificName: 'Cordia africana',
    confidence: 0.88,
    conservationStatus: 'Stable',
    description: 'Multipurpose tree, used for timber and fodder, supports soil fertility'
  },
  'muthaiti': {
    species: 'Muthaiti',
    commonName: 'Wild Olive',
    scientificName: 'Olea europaea subsp. cuspidata',
    confidence: 0.90,
    conservationStatus: 'Stable',
    description: 'Drought-resistant tree, important for fruit and oil production'
  },
  'mukau': {
    species: 'Mukau',
    commonName: 'Melia',
    scientificName: 'Melia azedarach',
    confidence: 0.85,
    conservationStatus: 'Stable',
    description: 'Fast-growing tree, used for timber and insect-repellent properties'
  },
  'mugumo_wa_njahi': {
    species: 'Mugumo wa Njahi',
    commonName: 'Sycamore Fig',
    scientificName: 'Ficus sycomorus',
    confidence: 0.92,
    conservationStatus: 'Stable',
    description: 'Large fig tree, keystone species for frugivorous fauna'
  },
  'mweri': {
    species: 'Mweri',
    commonName: 'Markhamia',
    scientificName: 'Markhamia lutea',
    confidence: 0.87,
    conservationStatus: 'Stable',
    description: 'Ornamental tree with yellow flowers, supports pollinator diversity'
  },
  'mutundu': {
    species: 'Mutundu',
    commonName: 'Croton',
    scientificName: 'Croton megalocarpus',
    confidence: 0.89,
    conservationStatus: 'Stable',
    description: 'Pioneer species, used for biofuel and soil stabilization'
  },
  'muiri': {
    species: 'Muiri',
    commonName: 'African Cherry',
    scientificName: 'Prunus cerasoides',
    confidence: 0.91,
    conservationStatus: 'Vulnerable',
    description: 'Medicinal tree, bark used in traditional remedies, threatened by logging'
  },
  'mukurwe': {
    species: 'Mukurwe',
    commonName: 'Cape Teak',
    scientificName: 'Tectona grandis',
    confidence: 0.84,
    conservationStatus: 'Stable',
    description: 'Hardwood tree, introduced but naturalized, used for furniture'
  },
  'muthirioni': {
    species: 'Muthirioni',
    commonName: 'Yellowwood',
    scientificName: 'Podocarpus latifolius',
    confidence: 0.93,
    conservationStatus: 'Endangered',
    description: 'Coniferous tree, critical for montane forest ecosystems'
  },
  'mukinduri_wa_ngai': {
    species: 'Mukinduri wa Ngai',
    commonName: 'Sandalwood',
    scientificName: 'Osyris lanceolata',
    confidence: 0.90,
    conservationStatus: 'Endangered',
    description: 'Aromatic tree, overexploited for essential oils'
  },
  'mugaa': {
    species: 'Mugaa',
    commonName: 'Acacia Tortilis',
    scientificName: 'Vachellia tortilis',
    confidence: 0.88,
    conservationStatus: 'Stable',
    description: 'Umbrella-shaped tree, vital for arid ecosystem stability'
  },
  'muthi': {
    species: 'Muthi',
    commonName: 'African Mahogany',
    scientificName: 'Khaya anthotheca',
    confidence: 0.92,
    conservationStatus: 'Vulnerable',
    description: 'Timber tree, threatened by overexploitation'
  },
  'mugandi': {
    species: 'Mugandi',
    commonName: 'Cape Mahogany',
    scientificName: 'Trichilia emetica',
    confidence: 0.87,
    conservationStatus: 'Stable',
    description: 'Seed oil source, supports riparian ecosystems'
  },
  'mukima': {
    species: 'Mukima',
    commonName: 'Wild Loquat',
    scientificName: 'Uapaca kirkiana',
    confidence: 0.89,
    conservationStatus: 'Stable',
    description: 'Fruit tree, important for food security and biodiversity'
  },
  'mutati': {
    species: 'Mutati',
    commonName: 'Albizia',
    scientificName: 'Albizia gummifera',
    confidence: 0.86,
    conservationStatus: 'Stable',
    description: 'Nitrogen-fixing tree, enhances soil fertility'
  },
  'mugumo_wa_mweri': {
    species: 'Mugumo wa Mweri',
    commonName: 'Strangler Fig Variant',
    scientificName: 'Ficus thonningii',
    confidence: 0.91,
    conservationStatus: 'Stable',
    description: 'Epiphytic fig, supports diverse fauna in forest canopies'
  },
  'mukuyu': {
    species: 'Mukuyu',
    commonName: 'Fig Tree',
    scientificName: 'Ficus capensis',
    confidence: 0.90,
    conservationStatus: 'Stable',
    description: 'Riparian species, critical for aquatic ecosystem health'
  },
  'muthare': {
    species: 'Muthare',
    commonName: 'Bamboo',
    scientificName: 'Oxytenanthera abyssinica',
    confidence: 0.85,
    conservationStatus: 'Stable',
    description: 'Fast-growing grass, used for construction and erosion control'
  },
  'mugumo_wa_kirima': {
    species: 'Mugumo wa Kirima',
    commonName: 'Mountain Fig',
    scientificName: 'Ficus lutea',
    confidence: 0.92,
    conservationStatus: 'Stable',
    description: 'Large fig, keystone species in montane forests'
  },
  'mukinduri_wa_mweri': {
    species: 'Mukinduri wa Mweri',
    commonName: 'African Greenheart Variant',
    scientificName: 'Warburgia salutaris',
    confidence: 0.90,
    conservationStatus: 'Endangered',
    description: 'Medicinal tree, critically threatened by overharvesting'
  },
  'mutarakwa': {
    species: 'Mutarakwa',
    commonName: 'Cape Ash',
    scientificName: 'Ekebergia capensis',
    confidence: 0.88,
    conservationStatus: 'Stable',
    description: 'Timber and shade tree, supports avian biodiversity'
  },
  'mugaa_wa_njahi': {
    species: 'Mugaa wa Njahi',
    commonName: 'Flat-top Acacia',
    scientificName: 'Vachellia abyssinica',
    confidence: 0.87,
    conservationStatus: 'Stable',
    description: 'Montane acacia, important for soil nitrogen fixation'
  },
  'mukinduri_wa_kirima': {
    species: 'Mukinduri wa Kirima',
    commonName: 'Mountain Greenheart',
    scientificName: 'Warburgia elongata',
    confidence: 0.89,
    conservationStatus: 'Vulnerable',
    description: 'Rare medicinal tree, restricted to highland forests'
  },
  'muthigira': {
    species: 'Muthigira',
    commonName: 'Red Thorn',
    scientificName: 'Acacia lahai',
    confidence: 0.86,
    conservationStatus: 'Stable',
    description: 'Thorny acacia, vital for savanna herbivore deterrence'
  },
  'mukurwe_wa_njahi': {
    species: 'Mukurwe wa Njahi',
    commonName: 'Wild Pear',
    scientificName: 'Dombeya rotundifolia',
    confidence: 0.90,
    conservationStatus: 'Stable',
    description: 'Flowering tree, supports pollinators in dry forests'
  },
  'muthiga_wa_mweri': {
    species: 'Muthiga wa Mweri',
    commonName: 'African Almond',
    scientificName: 'Terminalia catappa',
    confidence: 0.85,
    conservationStatus: 'Stable',
    description: 'Coastal tree, used for shade and erosion control'
  },
  'mugumo_wa_muthiga': {
    species: 'Mugumo wa Muthiga',
    commonName: 'Broad-leaved Fig',
    scientificName: 'Ficus exasperata',
    confidence: 0.91,
    conservationStatus: 'Stable',
    description: 'Sandpapery leaves, supports frugivorous species'
  },
  'mukinduri_wa_muthiga': {
    species: 'Mukinduri wa Muthiga',
    commonName: 'Greenheart Variant',
    scientificName: 'Warburgia stuhlmannii',
    confidence: 0.89,
    conservationStatus: 'Vulnerable',
    description: 'Medicinal tree, limited distribution in coastal forests'
  },
  'muthirioni_wa_kirima': {
    species: 'Muthirioni wa Kirima',
    commonName: 'Mountain Yellowwood',
    scientificName: 'Podocarpus falcatus',
    confidence: 0.92,
    conservationStatus: 'Endangered',
    description: 'Coniferous tree, critical for highland forest stability'
  },
  'mukau_wa_njahi': {
    species: 'Mukau wa Njahi',
    commonName: 'Persian Lilac',
    scientificName: 'Melia volkensii',
    confidence: 0.87,
    conservationStatus: 'Stable',
    description: 'Arid-adapted tree, used for timber and shade'
  },
  'mugaa_wa_mweri': {
    species: 'Mugaa wa Mweri',
    commonName: 'Fever Tree',
    scientificName: 'Vachellia xanthophloea',
    confidence: 0.90,
    conservationStatus: 'Stable',
    description: 'Bright-barked acacia, thrives in wetland ecosystems'
  },
  'mutamayu_wa_kirima': {
    species: 'Mutamayu wa Kirima',
    commonName: 'Mountain Chestnut',
    scientificName: 'Calodendrum eickii',
    confidence: 0.88,
    conservationStatus: 'Vulnerable',
    description: 'Rare highland tree, valued for ornamental flowers'
  },
  'mukima_wa_muthiga': {
    species: 'Mukima wa Muthiga',
    commonName: 'Wild Loquat Variant',
    scientificName: 'Uapaca nitida',
    confidence: 0.89,
    conservationStatus: 'Stable',
    description: 'Fruit tree, supports food security in rural areas'
  },
  'muthi_wa_njahi': {
    species: 'Muthi wa Njahi',
    commonName: 'East African Mahogany',
    scientificName: 'Khaya nyasica',
    confidence: 0.91,
    conservationStatus: 'Vulnerable',
    description: 'Timber tree, threatened by illegal logging'
  },
  'mukurwe_wa_mweri': {
    species: 'Mukurwe wa Mweri',
    commonName: 'Cape Teak Variant',
    scientificName: 'Tectona nobilis',
    confidence: 0.86,
    conservationStatus: 'Stable',
    description: 'Hardwood tree, used in reforestation efforts'
  },
  'muthare_wa_kirima': {
    species: 'Muthare wa Kirima',
    commonName: 'Mountain Bamboo',
    scientificName: 'Arundinaria alpina',
    confidence: 0.85,
    conservationStatus: 'Stable',
    description: 'Highland bamboo, critical for watershed protection'
  },
  'mugandi_wa_muthiga': {
    species: 'Mugandi wa Muthiga',
    commonName: 'Cape Mahogany Variant',
    scientificName: 'Trichilia dregeana',
    confidence: 0.88,
    conservationStatus: 'Stable',
    description: 'Shade tree, supports riparian biodiversity'
  },
  'mutati_wa_njahi': {
    species: 'Mutati wa Njahi',
    commonName: 'Silk Tree',
    scientificName: 'Albizia coriaria',
    confidence: 0.87,
    conservationStatus: 'Stable',
    description: 'Nitrogen-fixing tree, used in agroforestry systems'
  },
  'mukuyu_wa_mweri': {
    species: 'Mukuyu wa Mweri',
    commonName: 'Rock Fig',
    scientificName: 'Ficus glumosa',
    confidence: 0.90,
    conservationStatus: 'Stable',
    description: 'Rock-splitting fig, vital for arid ecosystem fauna'
  },
  'muthirioni_wa_njahi': {
    species: 'Muthirioni wa Njahi',
    commonName: 'Yellowwood Variant',
    scientificName: 'Podocarpus gracilior',
    confidence: 0.92,
    conservationStatus: 'Endangered',
    description: 'Coniferous tree, threatened by habitat loss'
  },
  'mukinduri_wa_mugumo': {
    species: 'Mukinduri wa Mugumo',
    commonName: 'Greenheart Fig Associate',
    scientificName: 'Warburgia kenyensis',
    confidence: 0.89,
    conservationStatus: 'Vulnerable',
    description: 'Medicinal tree, grows in fig-dominated forests'
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
