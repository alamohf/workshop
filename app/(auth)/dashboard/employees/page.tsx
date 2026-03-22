import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { hasAccess } from "@/lib/subscription"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, UserPlus } from "lucide-react"
import Link from "next/link"

export default async function EmployeesPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true, companyId: true, plan: true, trialEndsAt: true, stripeCurrentPeriodEnd: true },
  })

  if (!user || !hasAccess(user)) redirect("/settings/billing")
  if (user.role === "EMPLOYEE") redirect("/dashboard")

  const employees = user.companyId
    ? await db.user.findMany({
        where: { companyId: user.companyId, role: "EMPLOYEE" },
        orderBy: { name: "asc" },
      })
    : []

  const ROLE_LABEL: Record<string, string> = {
    SUPER_ADMIN: "Super Admin",
    COMPANY_ADMIN: "Admin",
    EMPLOYEE: "Funcionário",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Funcionários</h1>
          <p className="text-muted-foreground">{employees.length} funcionário{employees.length !== 1 ? "s" : ""} cadastrado{employees.length !== 1 ? "s" : ""}</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/employees/invite">
            <UserPlus className="mr-2 h-4 w-4" />
            Convidar funcionário
          </Link>
        </Button>
      </div>

      {employees.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="h-12 w-12 text-muted-foreground/40" />
            <h3 className="mt-4 font-semibold">Nenhum funcionário</h3>
            <p className="mt-1 text-sm text-muted-foreground">Convide o primeiro funcionário para a empresa.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {employees.map((emp) => (
            <Card key={emp.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={emp.image ?? undefined} />
                    <AvatarFallback>{emp.name?.slice(0, 2).toUpperCase() ?? "??"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{emp.name}</p>
                    <p className="text-sm text-muted-foreground">{emp.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{ROLE_LABEL[emp.role]}</Badge>
                  <Badge variant={emp.plan === "PRO" ? "default" : "outline"}>{emp.plan}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
