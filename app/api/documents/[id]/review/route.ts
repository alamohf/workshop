import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { documentReviewSchema } from "@/lib/validations"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true, companyId: true },
  })

  if (!user || user.role === "EMPLOYEE") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await request.json()
  const parsed = documentReviewSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const document = await db.document.findFirst({
    where: { id, companyId: user.companyId ?? undefined },
  })

  if (!document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 })
  }

  const updated = await db.document.update({
    where: { id },
    data: {
      status: parsed.data.status,
      reviewNote: parsed.data.reviewNote,
      reviewedBy: user.id,
      reviewedAt: new Date(),
    },
  })

  return NextResponse.json(updated)
}
