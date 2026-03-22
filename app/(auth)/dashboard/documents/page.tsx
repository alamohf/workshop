import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { hasAccess } from "@/lib/subscription"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Upload, CheckCircle, XCircle, Clock } from "lucide-react"
import Link from "next/link"

export default async function DocumentsPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true, companyId: true, plan: true, trialEndsAt: true, stripeCurrentPeriodEnd: true },
  })

  if (!user || !hasAccess(user)) redirect("/settings/billing")

  const isAdmin = user.role === "COMPANY_ADMIN" || user.role === "SUPER_ADMIN"

  const documents = await db.document.findMany({
    where: isAdmin && user.companyId
      ? { companyId: user.companyId }
      : { employeeId: user.id },
    include: {
      employee: { select: { name: true, email: true } },
      reviewer: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  const StatusIcon = {
    PENDING: Clock,
    APPROVED: CheckCircle,
    REJECTED: XCircle,
  }

  const StatusVariant: Record<string, "outline" | "success" | "destructive"> = {
    PENDING: "outline",
    APPROVED: "success",
    REJECTED: "destructive",
  }

  const StatusLabel = {
    PENDING: "Pendente",
    APPROVED: "Aprovado",
    REJECTED: "Rejeitado",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Atestados e Documentos</h1>
          <p className="text-muted-foreground">
            {isAdmin ? "Revise os documentos enviados pelos funcionários" : "Envie seus atestados e documentos"}
          </p>
        </div>
        {!isAdmin && (
          <Button asChild>
            <Link href="/dashboard/documents/upload">
              <Upload className="mr-2 h-4 w-4" />
              Enviar documento
            </Link>
          </Button>
        )}
      </div>

      {documents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-12 w-12 text-muted-foreground/40" />
            <h3 className="mt-4 font-semibold">Nenhum documento</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {isAdmin ? "Documentos enviados pelos funcionários aparecerão aqui." : "Envie seu primeiro atestado."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => {
            const Icon = StatusIcon[doc.status]
            return (
              <Card key={doc.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{doc.fileName}</p>
                      <p className="text-sm text-muted-foreground">
                        {isAdmin ? `${doc.employee.name} • ` : ""}
                        {doc.type === "MEDICAL_CERTIFICATE" ? "Atestado Médico" : "Outro"} •{" "}
                        {new Date(doc.submittedAt).toLocaleDateString("pt-BR")}
                      </p>
                      {doc.reviewNote && (
                        <p className="mt-1 text-xs text-muted-foreground italic">
                          Nota: {doc.reviewNote}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={StatusVariant[doc.status]}>
                      <Icon className="mr-1 h-3 w-3" />
                      {StatusLabel[doc.status]}
                    </Badge>
                    {isAdmin && doc.status === "PENDING" && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/documents/${doc.id}/review`}>Revisar</Link>
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" asChild>
                      <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                        Ver
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
