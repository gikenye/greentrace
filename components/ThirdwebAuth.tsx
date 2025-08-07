"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogOut, Mail, Wallet, TreesIcon as Tree } from 'lucide-react'
import { ThirdwebService, ThirdwebUser } from "../services/thirdwebService"

interface ThirdwebAuthProps {
  user: ThirdwebUser | null
  onLogin: (user: ThirdwebUser) => void
  onLogout: () => void
}

export function ThirdwebAuth({ user, onLogin, onLogout }: ThirdwebAuthProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [showEmailLogin, setShowEmailLogin] = useState(false)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [mounted, setMounted] = useState(false)

  const thirdwebService = ThirdwebService.getInstance()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleGoogleLogin = async () => {
    setIsLoading("google")
    try {
      const connectedUser = await thirdwebService.connectWithGoogle()
      if (connectedUser) {
        onLogin(connectedUser)
      }
    } catch (error) {
      console.error("Google login failed:", error)
      alert("Failed to connect with Google. Please try again.")
    } finally {
      setIsLoading(null)
    }
  }

  const handleEmailLogin = async () => {
    if (!email) return
    
    setIsLoading("email")
    try {
      const connectedUser = await thirdwebService.connectWithEmail(email)
      if (connectedUser) {
        setOtpSent(true)
      }
    } catch (error) {
      console.error("Email login failed:", error)
      alert("Failed to send verification code. Please try again.")
    } finally {
      setIsLoading(null)
    }
  }

  const handleOTPVerification = async () => {
    if (!otp) return
    
    setIsLoading("otp")
    try {
      const verified = await thirdwebService.verifyEmailOTP(otp)
      if (verified) {
        const address = thirdwebService.getAddress()
        if (address) {
          onLogin({
            address,
            email,
            name: email.split('@')[0], // Use email prefix as name
          })
        }
      } else {
        alert("Invalid verification code. Please try again.")
      }
    } catch (error) {
      console.error("OTP verification failed:", error)
      alert("Verification failed. Please try again.")
    } finally {
      setIsLoading(null)
    }
  }

  const handleLogout = async () => {
    setIsLoading("logout")
    try {
      await thirdwebService.disconnect()
      onLogout()
      setShowEmailLogin(false)
      setOtpSent(false)
      setEmail("")
      setOtp("")
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      setIsLoading(null)
    }
  }

  if (!mounted) {
    return (
      <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <CardContent className="p-4">
          <div className="h-16 bg-white/20 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    )
  }

  if (user) {
    return (
      <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              {user.profileImage ? (
                <img 
                  src={user.profileImage || "/placeholder.svg"} 
                  alt={user.name || "User"} 
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <Wallet size={24} />
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium">{user.name || "Tree Mapper"}</p>
              <p className="text-sm text-green-100">{user.email}</p>
              <p className="text-xs text-green-200 font-mono">
                {user.address.slice(0, 6)}...{user.address.slice(-4)}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              disabled={isLoading === "logout"}
              className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
            >
              {isLoading === "logout" ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
              ) : (
                <LogOut size={16} />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
      <CardHeader>
        <CardTitle className="text-center flex items-center justify-center space-x-2 text-white">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-2xl">
            <Tree size={24} />
          </div>
          <span>Join GreenTrace</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-center text-green-100 text-sm">
          Sign in to start mapping trees and earning TREE tokens. No crypto knowledge required!
        </p>

        {!showEmailLogin && !otpSent && (
          <div className="space-y-3">
            <Button
              onClick={handleGoogleLogin}
              disabled={isLoading === "google"}
              className="w-full bg-white text-green-600 hover:bg-gray-50 flex items-center justify-center space-x-2"
            >
              {isLoading === "google" ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </Button>

            {/* <Button
              onClick={() => setShowEmailLogin(true)}
              variant="outline"
              className="w-full border-white text-white hover:bg-white/10 bg-transparent"
            >
              <Mail className="mr-2" size={16} />
              Continue with Email
            </Button> */}
          </div>
        )}

        {showEmailLogin && !otpSent && (
          <div className="space-y-3">
            <div>
              <Label htmlFor="email" className="text-white">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
            </div>
            <Button
              onClick={handleEmailLogin}
              disabled={isLoading === "email" || !email}
              className="w-full bg-white text-green-600 hover:bg-gray-50"
            >
              {isLoading === "email" ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
              ) : (
                "Send Verification Code"
              )}
            </Button>
            <Button
              onClick={() => setShowEmailLogin(false)}
              variant="ghost"
              className="w-full text-white hover:bg-white/10"
            >
              Back
            </Button>
          </div>
        )}

        {otpSent && (
          <div className="space-y-3">
            <div>
              <Label htmlFor="otp" className="text-white">Verification Code</Label>
              <Input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit code"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                maxLength={6}
              />
            </div>
            <p className="text-xs text-green-100">
              We sent a verification code to {email}
            </p>
            <Button
              onClick={handleOTPVerification}
              disabled={isLoading === "otp" || !otp}
              className="w-full bg-white text-green-600 hover:bg-gray-50"
            >
              {isLoading === "otp" ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
              ) : (
                "Verify & Continue"
              )}
            </Button>
            <Button
              onClick={() => {
                setOtpSent(false)
                setShowEmailLogin(false)
                setEmail("")
                setOtp("")
              }}
              variant="ghost"
              className="w-full text-white hover:bg-white/10"
            >
              Use Different Email
            </Button>
          </div>
        )}

        <div className="text-xs text-green-100 text-center">
          <p>🔒 Secure wallet created automatically</p>
          <p>✨ No crypto experience needed</p>
        </div>
      </CardContent>
    </Card>
  )
}
