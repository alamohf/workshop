import { Resend } from "resend"

// Lazy init — prevents crash at build time when RESEND_API_KEY is not set
function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  return getResend().emails.send({
    from: "PayFlow <noreply@payflow.app>",
    to,
    subject,
    html,
  })
}

export async function sendPayslipNotification({
  to,
  employeeName,
  month,
  year,
}: {
  to: string
  employeeName: string
  month: number
  year: number
}) {
  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ]
  return sendEmail({
    to,
    subject: `Seu holerite de ${monthNames[month - 1]}/${year} está disponível`,
    html: `
      <h2>Olá, ${employeeName}!</h2>
      <p>Seu holerite referente a <strong>${monthNames[month - 1]}/${year}</strong> foi disponibilizado no portal.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/payslips">Acessar holerite</a></p>
      <p>Atenciosamente,<br/>Equipe PayFlow</p>
    `,
  })
}
