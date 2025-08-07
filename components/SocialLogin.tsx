"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut } from 'lucide-react'

interface SocialLoginUser {
  id: string
  name: string
  email: string
  avatar: string
  provider: "google" | "github"
}

interface SocialLoginProps {
  user: SocialLoginUser | null
  onLogin: (user: SocialLoginUser) => void
  onLogout: () => void
}

export function SocialLogin({ user, onLogin, onLogout }: SocialLoginProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleGoogleLogin = async () => {
    setIsLoading("google")

    // Simulate Google OAuth flow
    setTimeout(() => {
      const mockUser: SocialLoginUser = {
        id: "1",
        name: "John Doe",
        email: "john.doe@gmail.com",
        avatar: "/placeholder.svg?height=40&width=40",
        provider: "google",
      }
      onLogin(mockUser)
      setIsLoading(null)
    }, 1500)
  }

  const handleGitHubLogin = async () => {
    setIsLoading("github")

    // Simulate GitHub OAuth flow
    setTimeout(() => {
      const mockUser: SocialLoginUser = {
        id: "2",
        name: "Jane Smith",
        email: "jane.smith@github.com",
        avatar: "/placeholder.svg?height=40&width=40",
        provider: "github",
      }
      onLogin(mockUser)
      setIsLoading(null)
    }, 1500)
  }

  if (!mounted) {
    return (
      <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <CardContent className="p-4">
          <div className="h-16 bg-gray-100 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    )
  }

  if (user) {
    return (
      <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
            >
              <LogOut size={16} />
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
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-2xl">🌳</div>
          <span>Join the Forest Network</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-center text-green-100 text-sm mb-4">
          Sign in to start mapping trees and building Kilimani's urban forest
        </p>
        <Button
          onClick={handleGoogleLogin}
          disabled={isLoading === "google"}
          className="w-full bg-white text-green-600 hover:bg-gray-50"
        >
          {isLoading === "google" ? "Signing in..." : "Continue with Google"}
        </Button>

        <Button
          onClick={handleGitHubLogin}
          disabled={isLoading === "github"}
          variant="outline"
          className="w-full border-white text-white hover:bg-white/10 bg-transparent"
        >
          {isLoading === "github" ? "Signing in..." : "Continue with GitHub"}
        </Button>
      </CardContent>
    </Card>
  )
}
