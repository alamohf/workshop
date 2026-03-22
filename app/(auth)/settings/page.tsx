import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PLAN_NAMES } from "@/lib/constants"

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true, name: true, email: true, image: true,
      role: true, plan: true, trialEndsAt: true, createdAt: true,
    },
  })

  if (!user) redirect("/login")

  const ROLE_LABEL: Record<string, string> = {
    SUPER_ADMIN: "Super Admin",
    COMPANY_ADMIN: "Administrador",
    EMPLOYEE: "Funcionário",
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">Seu perfil e preferências.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
          <CardDescription>Suas informações pessoais.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.image ?? undefined} />
              <AvatarFallback className="text-lg">
                {user.name?.slice(0, 2).toUpperCase() ?? "??"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-lg">{user.name}</p>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{ROLE_LABEL[user.role]}</Badge>
            <Badge variant={user.plan === "PRO" ? "default" : "outline"}>
              {PLAN_NAMES[user.plan]}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Membro desde {new Date(user.createdAt).toLocaleDateString("pt-BR")}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
