# PayFlow SaaS — Convenções do Projeto

Este arquivo fornece contexto para agentes de AI que trabalham neste codebase.

## Stack

- **Framework:** Next.js 16+ (App Router, TypeScript strict)
- **Auth:** Auth.js v5 (NextAuth beta) — Google OAuth + Resend Magic Link
- **Banco:** Prisma 6 + PostgreSQL (Neon)
- **Pagamentos:** Stripe v20 (API v2026-02-25.clover)
- **UI:** shadcn/ui (componentes em `components/ui/` — implementados manualmente sem CLI)
- **Design System:** `design-system/tokens.ts` é a fonte única de verdade
- **Estilo:** Tailwind CSS 4 — ZERO hex hardcoded nos componentes

## Regras críticas

### Design System
- Editar `design-system/tokens.ts` → rodar `npm run tokens` para sincronizar globals.css
- Sempre usar tokens semânticos Tailwind: `bg-primary`, `text-foreground`, etc.
- NUNCA usar `bg-[#xxxxxx]` nos componentes

### Auth.js v5
- Env vars: `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_RESEND_KEY`
- Cookie de sessão: `authjs.session-token` (ou `__Secure-authjs.session-token` em produção)
- O middleware usa o cookie diretamente — NÃO importa Auth.js (limite 1MB Vercel edge)

### Middleware (Edge)
- `middleware.ts` é uma Edge Function — NUNCA importar Prisma, Resend ou Auth.js nele
- Checagem de sessão via cookie apenas

### Stripe
- API version: `2026-02-25.clover`
- Stripe client usa lazy init (proxy) para não crashar no build
- `createCheckoutSession()` NÃO define `trial_period_days` — upgrade é imediato
- Webhook em `/api/stripe/webhook`

### Prisma
- Versão: ^6 (Prisma 7 quebrou o datasource — não atualizar)
- Tipos exportados: `Plan`, `UserRole`, `PayslipStatus`, `DocumentStatus`, `DocumentType`
- Singleton via `lib/db.ts`

### Multi-tenancy
- Todos os dados são filtrados por `companyId`
- Roles: `SUPER_ADMIN` > `COMPANY_ADMIN` > `EMPLOYEE`
- SUPER_ADMIN acessa `/admin` — vê todas as empresas

## Estrutura de pastas

```
app/(public)/       # Landing, pricing, login (sem auth)
app/(auth)/         # Dashboard, settings, admin (com auth)
app/api/            # API routes
components/ui/      # Componentes base
components/layout/  # Sidebar, TrialBanner
components/paywall/ # PaywallGate
lib/                # auth, db, stripe, email, subscription, validations
design-system/      # tokens.ts, utils.ts, generate-css.ts
prisma/             # schema.prisma
types/              # next-auth.d.ts
```

## Scripts úteis

```bash
npm run dev           # Dev server
npm run build         # Build de produção
npm run tokens        # Sincronizar design tokens com globals.css
npm run tokens:check  # Verificar sincronização (usado em CI)
npx prisma studio     # GUI do banco
npx prisma db push    # Aplicar schema sem migration
npx prisma migrate dev --name <nome>  # Criar migration
```
