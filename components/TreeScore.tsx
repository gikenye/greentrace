"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TreesIcon as Tree, Award, Target, TrendingUp } from 'lucide-react'

interface TreeScoreProps {
  userTreeCount: number
  totalTrees: number
  goal?: number
}

export function TreeScore({ userTreeCount, totalTrees, goal = 10 }: TreeScoreProps) {
  const progress = (userTreeCount / goal) * 100
  const nextMilestone = Math.ceil(userTreeCount / 5) * 5

  const getBadgeLevel = (count: number) => {
    if (count >= 50) return { name: "Forest Guardian", color: "text-purple-600", icon: "🌳" }
    if (count >= 25) return { name: "Tree Champion", color: "text-green-600", icon: "🏆" }
    if (count >= 10) return { name: "Tree Mapper", color: "text-blue-600", icon: "🗺️" }
    if (count >= 5) return { name: "Seedling", color: "text-emerald-600", icon: "🌱" }
    return { name: "New Mapper", color: "text-gray-600", icon: "👋" }
  }

  const badge = getBadgeLevel(userTreeCount)

  return (
    <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">Your Tree Impact</h2>
            <p className="text-green-100">Building Kilimani's green network</p>
          </div>
          <div className="bg-white/20 p-3 rounded-full">
            <Tree size={24} />
          </div>
        </div>

        {/* Current Badge */}
        <div className="bg-white/10 rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{badge.icon}</span>
            <div>
              <p className="font-semibold">{badge.name}</p>
              <p className="text-sm text-green-100">{userTreeCount} trees mapped</p>
            </div>
          </div>
        </div>

        {/* Progress to next goal */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Progress to {nextMilestone} trees</span>
            <span>{userTreeCount}/{nextMilestone}</span>
          </div>
          <Progress value={(userTreeCount / nextMilestone) * 100} className="bg-white/20" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/20">
          <div className="text-center">
            <div className="text-2xl font-bold">{userTreeCount}</div>
            <div className="text-xs text-green-100">Your Trees</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{totalTrees}</div>
            <div className="text-xs text-green-100">Community</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{Math.round((userTreeCount / totalTrees) * 100)}%</div>
            <div className="text-xs text-green-100">Your Share</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
