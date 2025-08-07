"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MobileCardProps extends React.ComponentProps<typeof Card> {
  variant?: "default" | "primary" | "secondary"
}

export function MobileCard({ className, variant = "default", ...props }: MobileCardProps) {
  return (
    <Card
      className={cn(
        "w-full",
        variant === "primary" && "bg-green-600 text-white border-green-700",
        variant === "secondary" && "bg-green-50 border-green-200",
        className
      )}
      {...props}
    />
  )
}

export function MobileCardHeader({ className, ...props }: React.ComponentProps<typeof CardHeader>) {
  return <CardHeader className={cn("pb-3", className)} {...props} />
}

export function MobileCardContent({ className, ...props }: React.ComponentProps<typeof CardContent>) {
  return <CardContent className={cn("pt-0", className)} {...props} />
}

export function MobileCardTitle({ className, ...props }: React.ComponentProps<typeof CardTitle>) {
  return <CardTitle className={cn("text-lg", className)} {...props} />
}
