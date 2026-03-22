import { Plan } from "@prisma/client"

export const PLAN_LIMITS = {
  FREE: {
    payslips: 0,
    employees: 0,
    documents: 0,
  },
  TRIAL: {
    payslips: 50,
    employees: 10,
    documents: 100,
  },
  PRO: {
    payslips: Infinity,
    employees: Infinity,
    documents: Infinity,
  },
} satisfies Record<Plan, { payslips: number; employees: number; documents: number }>

export const PLAN_NAMES: Record<Plan, string> = {
  FREE: "Gratuito",
  TRIAL: "Trial",
  PRO: "Pro",
}
