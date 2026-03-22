"use client"

import Link from "next/link"
import { X, Clock } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface TrialBannerProps {
  daysLeft: number
}

export function TrialBanner({ daysLeft }: TrialBannerProps) {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  const urgency = daysLeft <= 3 ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground"

  return (
    <div className={`${urgency} px-4 py-2 text-center text-sm`}>
      <div className="flex items-center justify-center gap-2">
        <Clock className="h-4 w-4 shrink-0" />
        <span>
          {daysLeft === 0
            ? "Seu trial expirou."
            : `Seu trial expira em ${daysLeft} dia${daysLeft !== 1 ? "s" : ""}.`}{" "}
          <Link href="/settings/billing" className="underline font-semibold hover:no-underline">
            Fazer upgrade
          </Link>{" "}
          para continuar sem interrupções.
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 hover:bg-white/20"
          onClick={() => setDismissed(true)}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}
