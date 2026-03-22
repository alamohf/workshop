import Stripe from "stripe"

// Lazy init — prevents crash when STRIPE_SECRET_KEY is not set at build time
let _stripe: Stripe | null = null

function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set")
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-02-25.clover",
    })
  }
  return _stripe
}

export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return getStripe()[prop as keyof Stripe]
  },
})

export async function createCheckoutSession({
  userId,
  email,
  priceId,
  successUrl,
  cancelUrl,
}: {
  userId: string
  email: string
  priceId: string
  successUrl: string
  cancelUrl: string
}) {
  const s = getStripe()

  // Check if customer already exists
  const { db } = await import("@/lib/db")
  const user = await db.user.findUnique({ where: { id: userId } })

  let customerId = user?.stripeCustomerId

  if (!customerId) {
    const customer = await s.customers.create({ email, metadata: { userId } })
    customerId = customer.id
    await db.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customer.id },
    })
  }

  // No trial_period_days — immediate payment for upgrade during trial
  const session = await s.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { userId },
  })

  return session
}

export async function createCustomerPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string
  returnUrl: string
}) {
  const s = getStripe()
  const session = await s.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
  return session
}
