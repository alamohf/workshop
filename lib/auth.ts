import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Google from "next-auth/providers/google"
import Resend from "next-auth/providers/resend"
import { db } from "@/lib/db"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY!,
      from: "PayFlow <noreply@payflow.app>",
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        const dbUser = await db.user.findUnique({
          where: { id: user.id },
          select: {
            id: true,
            role: true,
            plan: true,
            trialEndsAt: true,
            companyId: true,
            stripeCurrentPeriodEnd: true,
          },
        })
        if (dbUser) {
          session.user.role = dbUser.role
          session.user.plan = dbUser.plan
          session.user.trialEndsAt = dbUser.trialEndsAt
          session.user.companyId = dbUser.companyId
          session.user.stripeCurrentPeriodEnd = dbUser.stripeCurrentPeriodEnd
        }
      }
      return session
    },
  },
  events: {
    async createUser({ user }) {
      // First login → start 14-day trial
      await db.user.update({
        where: { id: user.id },
        data: {
          plan: "TRIAL",
          trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        },
      })
    },
  },
})
