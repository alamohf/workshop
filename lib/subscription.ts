import { Plan } from "@prisma/client"

type UserForSub = {
  plan: Plan
  trialEndsAt: Date | null
  stripeCurrentPeriodEnd: Date | null
}

export function isTrialActive(user: UserForSub): boolean {
  return user.plan === "TRIAL" && user.trialEndsAt != null && user.trialEndsAt > new Date()
}

export function isSubscribed(user: UserForSub): boolean {
  return (
    user.plan === "PRO" &&
    user.stripeCurrentPeriodEnd != null &&
    user.stripeCurrentPeriodEnd > new Date()
  )
}

export function hasAccess(user: UserForSub): boolean {
  return isTrialActive(user) || isSubscribed(user)
}

export function daysLeftInTrial(user: UserForSub): number {
  if (!user.trialEndsAt) return 0
  const diff = user.trialEndsAt.getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}
