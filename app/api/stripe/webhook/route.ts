import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { db } from "@/lib/db"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-02-25.clover",
    })
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.mode !== "subscription") break

        const userId = session.metadata?.userId
        if (!userId) break

        const subscriptionId = session.subscription as string
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-02-25.clover" })
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)

        // Get period end from latest invoice
        let periodEnd: Date | null = null
        if (subscription.latest_invoice) {
          const invoice = await stripe.invoices.retrieve(
            typeof subscription.latest_invoice === "string"
              ? subscription.latest_invoice
              : subscription.latest_invoice.id
          )
          periodEnd = invoice.period_end ? new Date(invoice.period_end * 1000) : null
        }

        await db.user.update({
          where: { id: userId },
          data: {
            plan: "PRO",
            stripeSubscriptionId: subscriptionId,
            stripePriceId: subscription.items.data[0]?.price.id,
            stripeCurrentPeriodEnd: periodEnd,
          },
        })
        break
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice
        // Get subscription id from parent.subscription_details (Stripe API v2026+)
        const subscriptionId =
          (invoice as any).parent?.subscription_details?.subscription ??
          (invoice as any).subscription

        if (!subscriptionId) break

        const user = await db.user.findFirst({
          where: { stripeSubscriptionId: subscriptionId },
        })
        if (!user) break

        const periodEnd = invoice.period_end ? new Date(invoice.period_end * 1000) : null

        await db.user.update({
          where: { id: user.id },
          data: {
            plan: "PRO",
            stripeCurrentPeriodEnd: periodEnd,
          },
        })
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        const user = await db.user.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        })
        if (!user) break

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-02-25.clover" })
        let periodEnd: Date | null = null
        if (subscription.latest_invoice) {
          const invoice = await stripe.invoices.retrieve(
            typeof subscription.latest_invoice === "string"
              ? subscription.latest_invoice
              : subscription.latest_invoice.id
          )
          periodEnd = invoice.period_end ? new Date(invoice.period_end * 1000) : null
        }

        await db.user.update({
          where: { id: user.id },
          data: {
            stripePriceId: subscription.items.data[0]?.price.id,
            stripeCurrentPeriodEnd: periodEnd,
          },
        })
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        const user = await db.user.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        })
        if (!user) break

        await db.user.update({
          where: { id: user.id },
          data: {
            plan: "FREE",
            stripeSubscriptionId: null,
            stripePriceId: null,
            stripeCurrentPeriodEnd: null,
          },
        })
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error("Webhook handler error:", err)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
