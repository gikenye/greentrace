"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Coins, Gift, Smartphone, ShoppingCart, TrendingUp, Wallet } from 'lucide-react'
import { BlockchainService, TokenBalance } from "../services/blockchainService"
import { ThirdwebUser } from "../services/thirdwebService"

interface TokenWalletProps {
  user: ThirdwebUser | null
}

export function TokenWallet({ user }: TokenWalletProps) {
  const [balance, setBalance] = useState<TokenBalance | null>(null)
  const [loading, setLoading] = useState(false)
  const [showRedemption, setShowRedemption] = useState(false)

  const blockchainService = BlockchainService.getInstance()

  useEffect(() => {
    if (user?.address) {
      loadBalance()
    }
  }, [user?.address])

  const loadBalance = async () => {
    if (!user?.address) return
    
    setLoading(true)
    try {
      const tokenBalance = await blockchainService.getTokenBalance(user.address)
      setBalance(tokenBalance)
    } catch (error) {
      console.error('Failed to load balance:', error)
    } finally {
      setLoading(false)
    }
  }

  const redeemTokens = (type: 'airtime' | 'voucher', amount: number, description: string) => {
    if (!balance || balance.balance < amount) {
      alert('Insufficient TREE tokens')
      return
    }
    
    // Mock redemption - in production, this would call a smart contract function
    alert(`🎉 Successfully redeemed ${amount} TREE tokens for ${description}!\n\nYour ${type} will be processed within 24 hours.`)
    setBalance(prev => prev ? { ...prev, balance: prev.balance - amount } : null)
  }

  if (!user) {
    return (
      <Card className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white">
        <CardContent className="p-6 text-center">
          <Wallet className="mx-auto mb-4" size={48} />
          <h3 className="text-xl font-bold mb-2">TREE Token Wallet</h3>
          <p className="text-yellow-100 mb-4">
            Sign in to start earning TREE tokens for mapping trees
          </p>
          <div className="bg-white/20 rounded-lg p-3">
            <p className="text-sm">🌱 Earn tokens by mapping trees</p>
            <p className="text-sm">💰 Redeem for airtime & vouchers</p>
            <p className="text-sm">🔒 Secure blockchain rewards</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Token Balance Card */}
      <Card className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Coins size={24} />
            <span>TREE Token Wallet</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center">
              <div className="animate-pulse">Loading balance...</div>
            </div>
          ) : balance ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold">{balance.balance}</div>
                  <div className="text-xs text-yellow-100">Available Tokens</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">{balance.pendingRewards}</div>
                  <div className="text-xs text-yellow-100">Pending Rewards</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center text-sm">
                <div>
                  <div className="text-lg font-semibold">{balance.totalEarned}</div>
                  <div className="text-xs text-yellow-100">Total Earned</div>
                </div>
                <div>
                  <div className="text-lg font-semibold">{balance.totalSubmissions}</div>
                  <div className="text-xs text-yellow-100">Trees Mapped</div>
                </div>
              </div>
              
              <Button
                onClick={() => setShowRedemption(!showRedemption)}
                className="w-full bg-white text-orange-600 hover:bg-gray-100"
                disabled={balance.balance === 0}
              >
                <Gift className="mr-2" size={16} />
                {balance.balance === 0 ? 'No Tokens to Redeem' : 'Redeem Tokens'}
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Redemption Options */}
      {showRedemption && balance && balance.balance > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-600">
              <Gift size={20} />
              <span>Redeem TREE Tokens</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Airtime Options */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center space-x-2">
                <Smartphone size={16} />
                <span>Mobile Airtime (Kenya)</span>
              </h4>
              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant="outline"
                  onClick={() => redeemTokens('airtime', 50, 'KES 50 Airtime')}
                  disabled={balance.balance < 50}
                  className="justify-between"
                >
                  <span>KES 50 Airtime</span>
                  <Badge variant={balance.balance >= 50 ? "default" : "secondary"}>
                    50 🌳
                  </Badge>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => redeemTokens('airtime', 100, 'KES 100 Airtime')}
                  disabled={balance.balance < 100}
                  className="justify-between"
                >
                  <span>KES 100 Airtime</span>
                  <Badge variant={balance.balance >= 100 ? "default" : "secondary"}>
                    100 🌳
                  </Badge>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => redeemTokens('airtime', 250, 'KES 250 Airtime')}
                  disabled={balance.balance < 250}
                  className="justify-between"
                >
                  <span>KES 250 Airtime</span>
                  <Badge variant={balance.balance >= 250 ? "default" : "secondary"}>
                    250 🌳
                  </Badge>
                </Button>
              </div>
            </div>

            {/* Voucher Options */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center space-x-2">
                <ShoppingCart size={16} />
                <span>Shopping Vouchers</span>
              </h4>
              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant="outline"
                  onClick={() => redeemTokens('voucher', 200, 'Supermarket Voucher')}
                  disabled={balance.balance < 200}
                  className="justify-between"
                >
                  <span>Supermarket Voucher</span>
                  <Badge variant={balance.balance >= 200 ? "default" : "secondary"}>
                    200 🌳
                  </Badge>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => redeemTokens('voucher', 150, 'Restaurant Voucher')}
                  disabled={balance.balance < 150}
                  className="justify-between"
                >
                  <span>Restaurant Voucher</span>
                  <Badge variant={balance.balance >= 150 ? "default" : "secondary"}>
                    150 🌳
                  </Badge>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => redeemTokens('voucher', 300, 'Shopping Mall Voucher')}
                  disabled={balance.balance < 300}
                  className="justify-between"
                >
                  <span>Shopping Mall Voucher</span>
                  <Badge variant={balance.balance >= 300 ? "default" : "secondary"}>
                    300 🌳
                  </Badge>
                </Button>
              </div>
            </div>

            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-xs text-green-700 text-center">
                💡 <strong>Tip:</strong> Find rare tree species to earn more tokens! 
                Legendary trees can reward up to 200 tokens each.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Wallet Info */}
      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Wallet size={16} className="text-gray-600" />
            <span className="text-sm font-medium">Your Wallet</span>
          </div>
          <p className="text-xs font-mono text-gray-500 mb-2">
            {user.address.slice(0, 8)}...{user.address.slice(-8)}
          </p>
          <div className="flex items-center space-x-4 text-xs text-gray-600">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Secured by Thirdweb</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Polygon Network</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
