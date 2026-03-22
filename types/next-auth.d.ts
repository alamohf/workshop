import { Plan, UserRole } from "@prisma/client"
import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: UserRole
      plan: Plan
      trialEndsAt: Date | null
      companyId: string | null
      stripeCurrentPeriodEnd: Date | null
    } & DefaultSession["user"]
  }
}
