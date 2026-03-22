import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { Sidebar } from "@/components/layout/sidebar"
import { TrialBanner } from "@/components/layout/trial-banner"
import { isTrialActive, daysLeftInTrial } from "@/lib/subscription"

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const user = session.user
  const showTrialBanner = user.plan === "TRIAL"
  const daysLeft = user.trialEndsAt ? daysLeftInTrial({ plan: user.plan, trialEndsAt: user.trialEndsAt, stripeCurrentPeriodEnd: user.stripeCurrentPeriodEnd }) : 0

  return (
    <div className="flex h-full">
      <Sidebar user={user} />
      <div className="flex flex-1 flex-col overflow-hidden">
        {showTrialBanner && <TrialBanner daysLeft={daysLeft} />}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
