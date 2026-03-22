import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { hasAccess, isTrialActive, daysLeftInTrial } from "@/lib/subscription"
import { redirect } from "next/navigation"
import { FileText, Users, Clock, CheckCircle2 } from "lucide-react"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true, name: true, email: true, plan: true, role: true,
      trialEndsAt: true, stripeCurrentPeriodEnd: true, companyId: true,
    },
  })

  if (!user) redirect("/login")

  if (!hasAccess(user)) {
    redirect("/settings/billing")
  }

  // Fetch stats
  const companyId = user.companyId

  const [payslipCount, documentCount, employeeCount] = await Promise.all([
    companyId
      ? db.payslip.count({ where: { companyId } })
      : db.payslip.count({ where: { employeeId: user.id } }),
    companyId
      ? db.document.count({ where: { companyId } })
      : db.document.count({ where: { employeeId: user.id } }),
    companyId && user.role !== "EMPLOYEE"
      ? db.user.count({ where: { companyId } })
      : null,
  ])

  const pendingDocs = await db.document.count({
    where: {
      ...(companyId && user.role !== "EMPLOYEE" ? { companyId } : { employeeId: user.id }),
      status: "PENDING",
    },
  })

  const PLAN_LABEL: Record<string, string> = { FREE: "Gratuito", TRIAL: "Trial", PRO: "Pro" }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Olá, {user.name?.split(" ")[0]} 👋</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao PayFlow •{" "}
          <Badge variant={user.plan === "PRO" ? "default" : "secondary"}>
            {PLAN_LABEL[user.plan]}
          </Badge>
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Holerites</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payslipCount}</div>
            <p className="text-xs text-muted-foreground">Total disponíveis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Documentos</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documentCount}</div>
            <p className="text-xs text-muted-foreground">Total enviados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingDocs}</div>
            <p className="text-xs text-muted-foreground">Aguardando análise</p>
          </CardContent>
        </Card>

        {employeeCount !== null && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Funcionários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employeeCount}</div>
              <p className="text-xs text-muted-foreground">Na empresa</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
