import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { payslipUploadSchema } from "@/lib/validations"
import { hasAccess } from "@/lib/subscription"
import { sendPayslipNotification } from "@/lib/email"

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

  if (user.role === "EMPLOYEE" || !user.companyId) {
    return NextResponse.json({ error: "Only admins can upload payslips" }, { status: 403 })
  }

  const body = await request.json()
  const parsed = payslipUploadSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { employeeId, month, year, fileUrl, fileName, fileSize } = parsed.data

  // Verify employee belongs to company
  const employee = await db.user.findFirst({
    where: { id: employeeId, companyId: user.companyId },
    select: { id: true, name: true, email: true },
  })

  if (!employee) {
    return NextResponse.json({ error: "Employee not found" }, { status: 404 })
  }

  const payslip = await db.payslip.upsert({
    where: {
      companyId_employeeId_month_year: {
        companyId: user.companyId,
        employeeId,
        month,
        year,
      },
    },
    update: { fileUrl, fileName, fileSize, status: "DELIVERED" },
    create: {
      companyId: user.companyId,
      employeeId,
      uploadedBy: user.id,
      month,
      year,
      fileUrl,
      fileName,
      fileSize,
      status: "DELIVERED",
    },
  })

  // Send email notification
  if (employee.email) {
    await sendPayslipNotification({
      to: employee.email,
      employeeName: employee.name ?? "Funcionário",
      month,
      year,
    }).catch(console.error)
  }

  return NextResponse.json(payslip, { status: 201 })
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

  const payslips = await db.payslip.findMany({
    where: isAdmin && user.companyId
      ? { companyId: user.companyId }
      : { employeeId: user.id },
    include: { employee: { select: { name: true, email: true } } },
    orderBy: [{ year: "desc" }, { month: "desc" }],
  })

  return NextResponse.json(payslips)
}
