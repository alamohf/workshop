import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  FileText, Shield, Smartphone, Users, CheckCircle2, Star,
  Building2, Clock, Upload, Bell
} from "lucide-react"

const FEATURES = [
  {
    icon: FileText,
    title: "Entrega de Holerites Digital",
    description:
      "Faça upload de PDFs e notifique automaticamente os funcionários por email. Sem impressão, sem retrabalho.",
  },
  {
    icon: Smartphone,
    title: "Portal Mobile-First",
    description:
      "Funcionários acessam holerites e enviam atestados direto pelo celular, a qualquer hora.",
  },
  {
    icon: Shield,
    title: "Gestão de Atestados",
    description:
      "Workflow completo: funcionário envia, RH aprova ou rejeita com nota. Histórico completo.",
  },
  {
    icon: Building2,
    title: "Multi-Empresa",
    description:
      "Gerencie múltiplas empresas em um único painel. Isolamento completo de dados por empresa.",
  },
  {
    icon: Users,
    title: "Gestão de Equipe",
    description:
      "Cadastre funcionários, defina papéis e controle acessos. Simples e sem burocracia.",
  },
  {
    icon: Bell,
    title: "Notificações Automáticas",
    description:
      "Emails automáticos quando um holerite é disponibilizado. Funcionários sempre informados.",
  },
]

const PRICING_PLANS = [
  {
    name: "Trial",
    price: "Grátis",
    period: "14 dias",
    description: "Experimente todas as funcionalidades sem cartão de crédito.",
    features: ["Até 10 funcionários", "50 holerites/mês", "100 documentos", "Suporte por email"],
    cta: "Começar grátis",
    href: "/login",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "R$ 97",
    period: "/mês",
    description: "Tudo ilimitado para sua empresa crescer sem limites.",
    features: [
      "Funcionários ilimitados",
      "Holerites ilimitados",
      "Documentos ilimitados",
      "Multi-empresa",
      "Suporte prioritário",
      "Exportação de relatórios",
    ],
    cta: "Assinar agora",
    href: "/login",
    highlighted: true,
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <FileText className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">PayFlow</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground">
              Funcionalidades
            </Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">
              Preços
            </Link>
            <Button asChild variant="outline" size="sm">
              <Link href="/login">Entrar</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/login">Começar grátis</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-24 text-center">
        <Badge variant="secondary" className="mb-4">
          ✨ 100% digital, sem papel
        </Badge>
        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
          Gestão de contracheques e{" "}
          <span className="text-primary">RH digital</span> para empresas modernas
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
          Portal do colaborador mobile-first com entrega de holerites e gestão de atestados.
          Simplifique o RH da sua empresa hoje.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link href="/login">Começar trial grátis de 14 dias</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="#features">Ver funcionalidades</Link>
          </Button>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Sem cartão de crédito • 14 dias grátis • Cancele a qualquer momento
        </p>
      </section>

      {/* Screenshot placeholder */}
      <section className="mx-auto max-w-5xl px-4 pb-24">
        <div className="overflow-hidden rounded-xl border shadow-2xl">
          <div className="flex h-8 items-center gap-2 border-b bg-muted/50 px-4">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-yellow-400" />
            <div className="h-3 w-3 rounded-full bg-green-400" />
            <span className="ml-2 text-xs text-muted-foreground">payflow.app/dashboard</span>
          </div>
          <div className="flex h-72 items-center justify-center bg-gradient-to-br from-primary/5 to-primary/20">
            <div className="text-center">
              <FileText className="mx-auto h-16 w-16 text-primary/40" />
              <p className="mt-4 text-muted-foreground">Dashboard PayFlow</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-muted/30 py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold">Tudo que o seu RH precisa</h2>
            <p className="text-muted-foreground">
              Funcionalidades pensadas para simplificar o dia a dia do RH e dos funcionários.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <Card key={feature.title} className="border-0 shadow-sm">
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold">Preço simples e transparente</h2>
            <p className="text-muted-foreground">Comece grátis, pague quando estiver pronto.</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            {PRICING_PLANS.map((plan) => (
              <Card
                key={plan.name}
                className={plan.highlighted ? "border-primary shadow-lg" : ""}
              >
                {plan.highlighted && (
                  <div className="-mt-px flex justify-center">
                    <Badge className="rounded-t-none">Mais popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <CardTitle>{plan.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="w-full" variant={plan.highlighted ? "default" : "outline"}>
                    <Link href={plan.href}>{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
                <FileText className="h-3 w-3 text-primary-foreground" />
              </div>
              <span className="font-semibold">PayFlow</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} PayFlow. Todos os direitos reservados.
            </p>
            <div className="flex gap-4">
              <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">
                Entrar
              </Link>
              <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">
                Preços
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
