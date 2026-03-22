import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { documentSchema, documentReviewSchema } from "@/lib/validations"
import { hasAccess } from "@/lib/subscription"

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true, companyId: true, plan: true, trialEndsAt: true, stripeCurrentPeriodEnd: true },
  })

  if (!user || !hasAccess(user)) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 })
  }

  if (!user.companyId) {
    return NextResponse.json({ error: "User not associated with a company" }, { status: 400 })
  }

  const body = await request.json()
  const parsed = documentSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const document = await db.document.create({
    data: {
      companyId: user.companyId,
      employeeId: user.id,
      ...parsed.data,
    },
  })

  return NextResponse.json(document, { status: 201 })
}

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true, companyId: true, plan: true, trialEndsAt: true, stripeCurrentPeriodEnd: true },
  })

  if (!user || !hasAccess(user)) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 })
  }

  const isAdmin = user.role !== "EMPLOYEE"

  const documents = await db.document.findMany({
    where: isAdmin && user.companyId
      ? { companyId: user.companyId }
      : { employeeId: user.id },
    include: {
      employee: { select: { name: true, email: true } },
      reviewer: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(documents)
}
