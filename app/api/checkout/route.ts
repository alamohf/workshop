import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { createCheckoutSession } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const priceId = process.env.STRIPE_PRICE_ID_PRO
  if (!priceId) {
    return NextResponse.json({ error: "Price not configured" }, { status: 500 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

  try {
    const checkoutSession = await createCheckoutSession({
      userId: session.user.id,
      email: session.user.email!,
      priceId,
      successUrl: `${appUrl}/settings/billing?success=true`,
      cancelUrl: `${appUrl}/settings/billing`,
    })

    return NextResponse.redirect(checkoutSession.url!, 303)
  } catch (err) {
    console.error("Checkout error:", err)
    return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 })
  }
}
