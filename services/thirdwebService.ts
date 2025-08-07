"use client"

import { createThirdwebClient } from "thirdweb"
import { inAppWallet } from "thirdweb/wallets"
import { defineChain } from "thirdweb/chains"

// Initialize Thirdweb client
const client = createThirdwebClient({ 
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || ""
})

// Define the chain (you can change this to your preferred network)
const chain = defineChain({
  id: 137, // Polygon Mainnet
  name: "Polygon",
  nativeCurrency: {
    name: "MATIC",
    symbol: "MATIC",
    decimals: 18,
  },
  rpc: "https://polygon-rpc.com",
})

export interface ThirdwebUser {
  address: string
  email?: string
  name?: string
  profileImage?: string
}

export class ThirdwebService {
  private static instance: ThirdwebService
  private wallet = inAppWallet()
  private account: any = null

  static getInstance(): ThirdwebService {
    if (!ThirdwebService.instance) {
      ThirdwebService.instance = new ThirdwebService()
    }
    return ThirdwebService.instance
  }

  async connectWithGoogle(): Promise<ThirdwebUser | null> {
    try {
      // Connect using Google OAuth
      this.account = await this.wallet.connect({
        client,
        strategy: "google",
      })

      console.log("Connected as:", this.account?.address)

      // Get user profile information
      const userInfo = await this.getUserInfo()
      
      return {
        address: this.account.address,
        email: userInfo?.email,
        name: userInfo?.name,
        profileImage: userInfo?.profileImage,
      }
    } catch (error) {
      console.error("Failed to connect with Google:", error)
      return null
    }
  }

  async connectWithEmail(email: string): Promise<ThirdwebUser | null> {
    try {
      // Connect using email
      this.account = await this.wallet.connect({
        client,
        strategy: "email",
        email,
      })

      return {
        address: this.account.address,
        email,
      }
    } catch (error) {
      console.error("Failed to connect with email:", error)
      return null
    }
  }

  async verifyEmailOTP(otp: string): Promise<boolean> {
    try {
      await this.wallet.verify({ verificationCode: otp })
      return true
    } catch (error) {
      console.error("Failed to verify OTP:", error)
      return false
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.wallet.disconnect()
      this.account = null
    } catch (error) {
      console.error("Failed to disconnect:", error)
    }
  }

  async getUserInfo(): Promise<any> {
    if (!this.account) return null

    try {
      // Get user details from the connected account
      const details = await this.wallet.getAccount()
      return details
    } catch (error) {
      console.error("Failed to get user info:", error)
      return null
    }
  }

  getAccount() {
    return this.account
  }

  getWallet() {
    return this.wallet
  }

  getClient() {
    return client
  }

  getChain() {
    return chain
  }

  isConnected(): boolean {
    return !!this.account
  }

  getAddress(): string | null {
    return this.account?.address || null
  }
}
