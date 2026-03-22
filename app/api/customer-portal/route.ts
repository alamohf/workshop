import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { createCustomerPortalSession } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { stripeCustomerId: true },
  })

  if (!user?.stripeCustomerId) {
    return NextResponse.json({ error: "No Stripe customer" }, { status: 400 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

  try {
    const portalSession = await createCustomerPortalSession({
      customerId: user.stripeCustomerId,
      returnUrl: `${appUrl}/settings/billing`,
    })

    return NextResponse.redirect(portalSession.url, 303)
  } catch (err) {
    console.error("Portal error:", err)
    return NextResponse.json({ error: "Failed to open portal" }, { status: 500 })
  }
}
