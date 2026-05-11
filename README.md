# Elimu Finder 🎓

> A free, community-built directory of special, integrated, and inclusive schools for neurodivergent learners across Kenya.

---

## Stack

| Layer | Tech | Why |
|---|---|---|
| Frontend | Next.js 14 (App Router) | SSR/SSG for SEO, free on Vercel |
| Database | Supabase (PostgreSQL) | Auth + DB + Storage, generous free tier |
| Maps | Leaflet + OpenStreetMap | Fully free, no API key needed |
| Search | Supabase full-text search | Built-in `tsvector`, no Algolia needed |
| Email | Resend | 3,000 emails/month free |
| Hosting | Vercel | Free tier, auto-deploys from GitHub |

**Monthly cost at MVP: KES 0**

---

## Getting started

### 1. Clone & install

```bash
git clone https://github.com/your-org/elimu-finder.git
cd elimu-finder
npm install
```

### 2. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the full contents of `supabase/migrations/001_initial_schema.sql`
3. Go to **Settings → API** and copy your project URL and anon key

### 3. Configure environment

```bash
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials
```

### 4. Run locally

```bash
npm run dev
# Open http://localhost:3000
```

### 5. Create your admin user

1. Go to Supabase → Authentication → Users → Invite user (your email)
2. Accept the invite, set a password
3. In Supabase SQL Editor, run:

```sql
update public.profiles
set role = 'admin'
where email = 'your@email.com';
```

4. Log in at `http://localhost:3000/admin/login`

---

## Project structure

```
src/
├── app/
│   ├── (public)/          # User-facing pages
│   │   ├── page.tsx       # Homepage
│   │   ├── search/        # Search + filter
│   │   ├── schools/[slug] # School profile
│   │   └── submit/        # Add a school (4-step form)
│   ├── (admin)/           # Moderation panel (auth-protected)
│   │   ├── dashboard/     # Stats + pending queue
│   │   └── login/         # Admin login
│   └── api/
│       ├── submit/        # POST new school submission
│       └── schools/moderate/  # PATCH approve/reject
├── components/
│   ├── schools/           # SchoolCard, SubmitSchoolForm, ModerationQueue, SearchFiltersPanel
│   ├── map/               # Leaflet map (client-only)
│   └── ui/                # Pagination, shared UI
├── lib/
│   ├── supabase/          # Browser, server, middleware clients
│   ├── utils/             # schools.ts (data layer), helpers.ts
│   └── validations/       # Zod schemas
└── types/                 # Shared TypeScript types + label maps
```

---

## Key features

### For parents
- Search by county, condition, school type, level
- Map pin on every school profile
- Stale data warnings (⚠️ if unverified >6 months)
- One-tap WhatsApp share

### For school admins
- Claim your school listing
- Keep your profile up to date

### For moderators (you)
- Pending queue at `/admin/dashboard`
- One-click approve / reject
- Full submission log in Supabase

---

## Data quality strategy

Every school profile shows a **"Last verified"** timestamp. If a school hasn't been verified in 6 months, a yellow warning banner appears on the profile. Automated re-verification emails go out via Resend to school admins every 6 months.

---

## Deploying to Vercel

```bash
# Push to GitHub, then:
# 1. Import repo in vercel.com/new
# 2. Add environment variables from .env.local
# 3. Deploy — done.
```

---

## Monetisation roadmap

| Tier | Price | What they get |
|---|---|---|
| Free listing | KES 0 | Basic profile, forever |
| Enhanced profile | KES 5k–15k/yr | Logo, photos, enquiry form, view stats |
| Verified Partner | KES 25k–50k/yr | Badge, featured placement, PDF guides |
| Professionals directory | KES 10k–30k/yr | OTs, SLPs, psychologists |
| County guide sponsorship | KES 100k–300k | CSR branding on downloadable guides |
| Grants | Variable | KCDF, CBM, USAID, Aga Khan Foundation |

**Core principle: parents never pay.**

---

## Contributing schools

Anyone can submit a school via `/submit`. Submissions enter a `pending` queue and go live after admin review (target: 48 hours). School admins can claim their listing for direct updates.

---

## Licence

MIT — build on it, fork it, improve it.
