import { z } from "zod"

export const companySchema = z.object({
  name: z.string().min(2, "Nome deve ter ao menos 2 caracteres").max(100),
  cnpj: z.string().optional(),
  logoUrl: z.string().url().optional().or(z.literal("")),
})

export const employeeInviteSchema = z.object({
  name: z.string().min(2, "Nome completo obrigatório"),
  email: z.string().email("Email inválido"),
  companyId: z.string().cuid("ID de empresa inválido"),
})

export const payslipUploadSchema = z.object({
  employeeId: z.string().cuid(),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2020).max(2099),
  fileUrl: z.string().url(),
  fileName: z.string().min(1),
  fileSize: z.number().optional(),
})

export const documentSchema = z.object({
  type: z.enum(["MEDICAL_CERTIFICATE", "OTHER"]),
  description: z.string().max(500).optional(),
  fileUrl: z.string().url(),
  fileName: z.string().min(1),
  fileSize: z.number().optional(),
})

export const documentReviewSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  reviewNote: z.string().max(500).optional(),
})

export type CompanyInput = z.infer<typeof companySchema>
export type EmployeeInviteInput = z.infer<typeof employeeInviteSchema>
export type PayslipUploadInput = z.infer<typeof payslipUploadSchema>
export type DocumentInput = z.infer<typeof documentSchema>
export type DocumentReviewInput = z.infer<typeof documentReviewSchema>
