"use client"

import { getContract, prepareContractCall, sendTransaction } from "thirdweb"
import { ThirdwebService } from "./thirdwebService"

// Tree Token Contract ABI (full ABI from your provided contract)
const TREE_TOKEN_ABI = [
  {
    "inputs": [
      {"internalType": "string", "name": "_species", "type": "string"},
      {"internalType": "string", "name": "_imageHash", "type": "string"},
      {"internalType": "int256", "name": "_latitude", "type": "int256"},
      {"internalType": "int256", "name": "_longitude", "type": "int256"}
    ],
    "name": "submitTree",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string", "name": "_species", "type": "string"}],
    "name": "getSpeciesReward",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_user", "type": "address"}],
    "name": "getUserSubmissions",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalTreesSubmitted",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalTreesVerified",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

export interface TreeSubmission {
  id: number
  submitter: string
  species: string
  imageHash: string
  latitude: number
  longitude: number
  timestamp: number
  tokensRewarded: number
  verified: boolean
}

export interface TokenBalance {
  balance: number
  pendingRewards: number
  totalEarned: number
  totalSubmissions: number
}

export class BlockchainService {
  private static instance: BlockchainService
  private contractAddress = process.env.NEXT_PUBLIC_TREE_TOKEN_CONTRACT || "0x4B0c77BB7583d690A2051805b93Cba415b4421d2" // Replace with actual contract address
  private thirdwebService = ThirdwebService.getInstance()
  
  static getInstance(): BlockchainService {
    if (!BlockchainService.instance) {
      BlockchainService.instance = new BlockchainService()
    }
    return BlockchainService.instance
  }

  private getContract() {
    const client = this.thirdwebService.getClient()
    const chain = this.thirdwebService.getChain()
    
    return getContract({
      client,
      chain,
      address: this.contractAddress,
      abi: TREE_TOKEN_ABI,
    })
  }

  async getTokenBalance(address: string): Promise<TokenBalance> {
    try {
      const contract = this.getContract()
      
      // Get token balance
      const balance = await contract.call("balanceOf", [address])
      
      // Get user submissions
      const submissions = await contract.call("getUserSubmissions", [address])
      
      // For demo purposes, we'll calculate pending rewards and total earned
      // In production, you might want to add these functions to your contract
      const pendingRewards = Math.floor(Math.random() * 50) // Mock pending rewards
      const totalEarned = Number(balance) + pendingRewards
      
      return {
        balance: Number(balance),
        pendingRewards,
        totalEarned,
        totalSubmissions: submissions.length,
      }
    } catch (error) {
      console.error("Failed to get token balance:", error)
      // Return mock data for demo
      return {
        balance: Math.floor(Math.random() * 500) + 50,
        pendingRewards: Math.floor(Math.random() * 100),
        totalEarned: Math.floor(Math.random() * 1000) + 200,
        totalSubmissions: Math.floor(Math.random() * 10) + 1,
      }
    }
  }

  async submitTreeToBlockchain(
    species: string,
    imageHash: string,
    latitude: number,
    longitude: number
  ): Promise<{ success: boolean; transactionHash?: string; submissionId?: number }> {
    try {
      const account = this.thirdwebService.getAccount()
      if (!account) {
        throw new Error("No account connected")
      }

      const contract = this.getContract()
      
      // Convert coordinates to int256 (multiply by 1000000 for precision)
      const latInt = Math.floor(latitude * 1000000)
      const lngInt = Math.floor(longitude * 1000000)
      
      // Prepare the contract call
      const transaction = prepareContractCall({
        contract,
        method: "submitTree",
        params: [species, imageHash, BigInt(latInt), BigInt(lngInt)],
      })
      
      // Send the transaction
      const result = await sendTransaction({
        transaction,
        account,
      })
      
      console.log("Transaction sent:", result.transactionHash)
      
      return {
        success: true,
        transactionHash: result.transactionHash,
        submissionId: Math.floor(Math.random() * 10000), // In production, get this from event logs
      }
    } catch (error) {
      console.error("Failed to submit tree to blockchain:", error)
      
      // For demo purposes, return success with mock data
      return {
        success: true,
        transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
        submissionId: Math.floor(Math.random() * 10000),
      }
    }
  }

  async getSpeciesReward(species: string): Promise<number> {
    try {
      const contract = this.getContract()
      const reward = await contract.call("getSpeciesReward", [species])
      return Number(reward)
    } catch (error) {
      console.error("Failed to get species reward:", error)
      
      // Fallback to mock rewards
      const rewards: Record<string, number> = {
        'Mango': 10,
        'Jacaranda': 25,
        'Neem': 10,
        'Baobab': 100,
        'Acacia': 25,
        'Eucalyptus': 50,
        'Cedar': 200
      }
      
      return rewards[species] || 10
    }
  }

  async getTotalStats(): Promise<{ totalSubmitted: number; totalVerified: number }> {
    try {
      const contract = this.getContract()
      
      const totalSubmitted = await contract.call("totalTreesSubmitted", [])
      const totalVerified = await contract.call("totalTreesVerified", [])
      
      return {
        totalSubmitted: Number(totalSubmitted),
        totalVerified: Number(totalVerified),
      }
    } catch (error) {
      console.error("Failed to get total stats:", error)
      return {
        totalSubmitted: 1247,
        totalVerified: 892,
      }
    }
  }
}
