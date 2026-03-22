import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { hasAccess } from "@/lib/subscription"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Eye, Upload } from "lucide-react"
import Link from "next/link"

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
]

export default async function PayslipsPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true, companyId: true, plan: true, trialEndsAt: true, stripeCurrentPeriodEnd: true },
  })

  if (!user || !hasAccess(user)) redirect("/settings/billing")

  const isAdmin = user.role === "COMPANY_ADMIN" || user.role === "SUPER_ADMIN"

  const payslips = await db.payslip.findMany({
    where: isAdmin && user.companyId
      ? { companyId: user.companyId }
      : { employeeId: user.id },
    include: {
      employee: { select: { name: true, email: true } },
    },
    orderBy: [{ year: "desc" }, { month: "desc" }],
    take: 50,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Holerites</h1>
          <p className="text-muted-foreground">
            {isAdmin ? "Gerencie os holerites dos funcionários" : "Seus contracheques mensais"}
          </p>
        </div>
        {isAdmin && (
          <Button asChild>
            <Link href="/dashboard/payslips/upload">
              <Upload className="mr-2 h-4 w-4" />
              Upload holerite
            </Link>
          </Button>
        )}
      </div>

      {payslips.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-12 w-12 text-muted-foreground/40" />
            <h3 className="mt-4 font-semibold">Nenhum holerite</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {isAdmin
                ? "Faça upload do primeiro holerite para um funcionário."
                : "Seus holerites aparecerão aqui quando disponibilizados."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {payslips.map((payslip) => (
            <Card key={payslip.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {MONTH_NAMES[payslip.month - 1]}/{payslip.year}
                    </p>
                    {isAdmin && (
                      <p className="text-sm text-muted-foreground">
                        {payslip.employee.name} — {payslip.employee.email}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      payslip.status === "VIEWED"
                        ? "success"
                        : payslip.status === "DELIVERED"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {payslip.status === "VIEWED"
                      ? "Visualizado"
                      : payslip.status === "DELIVERED"
                      ? "Entregue"
                      : "Pendente"}
                  </Badge>
                  <Button variant="outline" size="sm" asChild>
                    <a href={payslip.fileUrl} target="_blank" rel="noopener noreferrer">
                      <Eye className="mr-1 h-3 w-3" />
                      Ver
                    </a>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={payslip.fileUrl} download>
                      <Download className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
