import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, Crown, Clock } from "lucide-react"
import { hasAccess, isTrialActive, daysLeftInTrial, isSubscribed } from "@/lib/subscription"
import Link from "next/link"

export default async function BillingPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true, name: true, email: true, plan: true,
      trialEndsAt: true, stripeCurrentPeriodEnd: true, stripeCustomerId: true,
    },
  })

  if (!user) redirect("/login")

  const trialActive = isTrialActive(user)
  const subscribed = isSubscribed(user)
  const access = hasAccess(user)
  const daysLeft = daysLeftInTrial(user)

  const PLAN_FEATURES = {
    FREE: [],
    TRIAL: ["Até 10 funcionários", "50 holerites/mês", "100 documentos"],
    PRO: ["Funcionários ilimitados", "Holerites ilimitados", "Documentos ilimitados", "Multi-empresa", "Suporte prioritário"],
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Assinatura</h1>
        <p className="text-muted-foreground">Gerencie seu plano e faturamento.</p>
      </div>

      {/* Current plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Plano atual</CardTitle>
            <Badge variant={subscribed ? "default" : trialActive ? "secondary" : "outline"}>
              {subscribed ? "Pro" : trialActive ? `Trial (${daysLeft}d restantes)` : "Expirado"}
            </Badge>
          </div>
          <CardDescription>
            {subscribed && user.stripeCurrentPeriodEnd
              ? `Renova em ${new Date(user.stripeCurrentPeriodEnd).toLocaleDateString("pt-BR")}`
              : trialActive && user.trialEndsAt
              ? `Trial expira em ${new Date(user.trialEndsAt).toLocaleDateString("pt-BR")}`
              : "Seu acesso está limitado. Faça upgrade para continuar."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {PLAN_FEATURES[user.plan].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                {f}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Upgrade card — shown if not PRO */}
      {!subscribed && (
        <Card className="border-primary">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              <CardTitle>Upgrade para Pro</CardTitle>
            </div>
            <CardDescription>
              Desbloqueie tudo: funcionários ilimitados, holerites ilimitados e suporte prioritário.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">R$ 97</span>
              <span className="text-muted-foreground">/mês</span>
            </div>
            <ul className="space-y-2">
              {PLAN_FEATURES.PRO.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  {f}
                </li>
              ))}
            </ul>
            <form action="/api/checkout" method="POST">
              <Button type="submit" className="w-full">
                Assinar agora — R$ 97/mês
              </Button>
            </form>
            <p className="text-center text-xs text-muted-foreground">
              Pagamento seguro via Stripe • Cancele quando quiser
            </p>
          </CardContent>
        </Card>
      )}

      {/* Portal for PRO */}
      {subscribed && user.stripeCustomerId && (
        <>
          <Separator />
          <div className="space-y-2">
            <h2 className="font-semibold">Gerenciar assinatura</h2>
            <p className="text-sm text-muted-foreground">
              Acesse o portal de faturamento para atualizar seu método de pagamento ou cancelar.
            </p>
            <form action="/api/customer-portal" method="POST">
              <Button variant="outline">Abrir portal de faturamento</Button>
            </form>
          </div>
        </>
      )}
    </div>
  )
}
