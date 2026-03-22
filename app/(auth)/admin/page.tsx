import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, FileText, CreditCard } from "lucide-react"

export default async function SuperAdminPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  if (user?.role !== "SUPER_ADMIN") redirect("/dashboard")

  const [companiesCount, usersCount, payslipsCount, proUsersCount] = await Promise.all([
    db.company.count(),
    db.user.count(),
    db.payslip.count(),
    db.user.count({ where: { plan: "PRO" } }),
  ])

  const companies = await db.company.findMany({
    include: {
      _count: { select: { users: true, payslips: true, documents: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Super Admin</h1>
        <p className="text-muted-foreground">Visão global de todas as empresas e assinaturas.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Empresas</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companiesCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Holerites</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payslipsCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Assinantes Pro</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{proUsersCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Companies list */}
      <Card>
        <CardHeader>
          <CardTitle>Empresas cadastradas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {companies.map((company) => (
              <div key={company.id} className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <p className="font-medium">{company.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {company._count.users} funcionários • {company._count.payslips} holerites • {company._count.documents} docs
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={company.plan === "PRO" ? "default" : "secondary"}>
                    {company.plan}
                  </Badge>
                  <Badge variant={company.active ? "success" : "outline"}>
                    {company.active ? "Ativa" : "Inativa"}
                  </Badge>
                </div>
              </div>
            ))}
            {companies.length === 0 && (
              <p className="text-center text-muted-foreground">Nenhuma empresa cadastrada.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
