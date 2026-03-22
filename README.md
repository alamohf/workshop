# PayFlow SaaS

> Gestão de contracheques e RH digital para empresas modernas.
> Portal do colaborador mobile-first com entrega de holerites e gestão de atestados.

## Stack

| Tecnologia | Função |
|---|---|
| Next.js 16+ (App Router) | Framework full-stack |
| TypeScript strict | Tipagem |
| Tailwind CSS 4 | Estilização |
| TanStack Query | Data fetching client |
| Prisma 7 | ORM + migrations (PostgreSQL) |
| Zod | Validação |
| Auth.js v5 (NextAuth) | Autenticação |
| Stripe | Pagamentos |
| shadcn/ui (Radix) | Componentes UI |
| Resend | Emails transacionais |

## Pré-requisitos

```bash
node --version  # v18+
npm --version   # v9+
git --version   # v2+
```

**Contas necessárias:**
- [Neon](https://neon.tech) — PostgreSQL gratuito
- [Google Cloud Console](https://console.cloud.google.com) — OAuth
- [Resend](https://resend.com) — Emails (3k/mês grátis)
- [Stripe](https://stripe.com) — Pagamentos (test mode)
- [Vercel](https://vercel.com) — Hosting (free tier)

## Setup local

### 1. Clone e instale dependências

```bash
git clone https://github.com/seu-usuario/payflow.git
cd payflow
npm install
```

### 2. Configure variáveis de ambiente

```bash
cp .env.example .env.local
```

Edite `.env.local` com seus valores reais.

### 3. Configure o banco de dados (Neon)

1. Crie um banco no [Neon](https://neon.tech)
2. Copie a connection string para `DATABASE_URL` e `DIRECT_URL`

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Configure autenticação (Google OAuth)

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um projeto e ative a "Google+ API"
3. Crie credenciais OAuth 2.0 → Redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Copie Client ID → `AUTH_GOOGLE_ID` e Client Secret → `AUTH_GOOGLE_SECRET`

### 5. Configure Resend (Magic Links)

1. Crie conta em [Resend](https://resend.com)
2. Crie uma API Key → `AUTH_RESEND_KEY` e `RESEND_API_KEY`

### 6. Configure Stripe

1. Crie conta em [Stripe](https://stripe.com) (test mode)
2. Crie um produto "PayFlow Pro" com preço recorrente mensal
3. Copie Secret Key → `STRIPE_SECRET_KEY` e Price ID → `STRIPE_PRICE_ID_PRO`
4. Webhooks locais:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
   Copie o webhook secret → `STRIPE_WEBHOOK_SECRET`

### 7. Rode o projeto

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## Design System

O design system usa `design-system/tokens.ts` como fonte única de verdade.

```bash
npm run tokens        # Atualizar globals.css
npm run tokens:check  # Verificar sincronização (CI)
```

**Regra:** Nunca use hex hardcoded. Sempre use tokens semânticos Tailwind (`bg-primary`, `text-foreground`, etc).

## Deploy (Vercel)

```bash
npm install -g vercel
vercel login
vercel --prod
```

Configure as env vars via dashboard Vercel ou:
```bash
vercel env add DATABASE_URL
# ... (todas as vars do .env.example)
```

## Estrutura

```
payflow/
├── app/
│   ├── (public)/      # Landing, pricing, login
│   ├── (auth)/        # Dashboard, settings, admin
│   └── api/           # Auth, Stripe, payslips, documents
├── components/
│   ├── ui/            # Componentes base (Button, Card, etc)
│   ├── layout/        # Sidebar, TrialBanner
│   └── paywall/       # PaywallGate
├── lib/               # auth, db, stripe, email, subscription
├── design-system/     # tokens.ts, utils.ts, generate-css.ts
├── prisma/            # schema.prisma
└── types/             # Extensões de tipos (next-auth.d.ts)
```

## Planos

| Recurso | Free | Trial (14d) | Pro |
|---|---|---|---|
| Funcionários | 0 | 10 | Ilimitado |
| Holerites/mês | 0 | 50 | Ilimitado |
| Documentos | 0 | 100 | Ilimitado |

## Licença

MIT
