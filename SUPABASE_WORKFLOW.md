# 👻 Cura — Supabase Setup & Project Switching Guide

This document explains how to:

* use Supabase CLI
* switch between projects
* push database schema (migrations)
* generate TypeScript types

---

# 🔐 1. Login to Supabase

```bash
npx supabase login
```

This authenticates your CLI with your Supabase account.

---

# 🔄 2. Switch to Another Supabase Project

Link your local project to a different Supabase instance.

```bash
npx supabase link --project-ref YOUR_PROJECT_REF
```

> You will be prompted for your database password.

---

# 📦 3. Push Database Schema (Migrations)

Push all local migrations to the linked Supabase project.

```bash
npx supabase db push
```

This will:

* create/update tables
* apply constraints
* apply indexes
* apply RLS policies

---

# 🧾 4. Generate TypeScript Types

Generate fresh database types for your app.

```bash
npx supabase gen types typescript --linked --schema public > types/database.types.ts
```

This keeps your frontend in sync with your database schema.

---

# ✅ Full Workflow (Copy & Run)

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
npx supabase gen types typescript --linked --schema public > types/database.types.ts
```

---

# 📁 Output

Generated types will be saved to:

```
src/types/database.types.ts
```

---

# ⚠️ Important Notes

## Always follow this order:

1. Link project
2. Push schema
3. Generate types

---

## After schema changes:

* run `db push`
* regenerate types
* verify your app still works

---

## If something breaks:

* check correct `project-ref`
* re-run `supabase link`
* verify migrations exist in `/supabase/migrations`
  
---

# 🚀 Optional (Local Development)

If using local Supabase:

```bash
npx supabase gen types typescript --local > src/types/database.types.ts
```

---

# 🎯 Summary

Main workflow:

> link → push → generate types

---

# 👻 Cura Philosophy

Clean structure.
Strong typing.
Production-first mindset.
