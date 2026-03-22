"use client"

import { ReactNode } from "react"
import { Lock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface PaywallGateProps {
  children: ReactNode
  blocked?: boolean
  title?: string
  description?: string
  ctaLabel?: string
  onUpgrade?: () => void
}

export function PaywallGate({
  children,
  blocked = false,
  title = "Recurso exclusivo",
  description = "Faça upgrade para o plano Pro para desbloquear este recurso.",
  ctaLabel = "Fazer upgrade",
  onUpgrade,
}: PaywallGateProps) {
  if (!blocked) return <>{children}</>

  return (
    <div className="relative">
      <div className="pointer-events-none select-none opacity-30 blur-sm">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Card className="mx-4 max-w-md shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={onUpgrade} className="w-full sm:w-auto">
              {ctaLabel}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
