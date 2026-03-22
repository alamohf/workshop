import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "sonner"
import { Providers } from "@/components/providers"

export const metadata: Metadata = {
  title: "PayFlow — Gestão de Holerites e RH Digital",
  description:
    "Portal do colaborador mobile-first com entrega de holerites e gestão de atestados para empresas modernas.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="h-full">
        <Providers>
          {children}
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  )
}
