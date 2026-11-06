# Verdanza — 3-Tier Next.js Project & Task Dashboard

A clean **White & Emerald Green** full-stack **3-Tier Application** built with **Next.js (App Router)**, **Tailwind CSS**, **Prisma ORM**, and **SQLite** for hands-on practice.

---

## 🏗️ 3-Tier Architecture Overview

1. **Tier 1: Presentation Layer (Frontend UI)**
   - [`src/app/page.tsx`](./src/app/page.tsx) — Main dashboard view & state orchestration.
   - [`src/components/StatsBanner.tsx`](./src/components/StatsBanner.tsx) — Real-time KPI summary cards.
   - [`src/components/ProjectSidebar.tsx`](./src/components/ProjectSidebar.tsx) — Workspace switcher & project creation.
   - [`src/components/TaskBoard.tsx`](./src/components/TaskBoard.tsx) — Kanban board & table list view with search and priority filters.
   - [`src/components/ArchitectureDrawer.tsx`](./src/components/ArchitectureDrawer.tsx) — Live 3-Tier request tracer showing every API call flowing through the tiers.

2. **Tier 2: Application / Business Logic Layer (API Routes + Services)**
   - **Services (Business Rules & Validation):**
     - [`src/services/projectService.ts`](./src/services/projectService.ts)
     - [`src/services/taskService.ts`](./src/services/taskService.ts)
   - **API Controllers (HTTP Endpoints):**
     - `GET / POST` [`src/app/api/projects/route.ts`](./src/app/api/projects/route.ts)
     - `DELETE` [`src/app/api/projects/[id]/route.ts`](./src/app/api/projects/[id]/route.ts)
     - `GET / POST` [`src/app/api/tasks/route.ts`](./src/app/api/tasks/route.ts)
     - `PATCH / DELETE` [`src/app/api/tasks/[id]/route.ts`](./src/app/api/tasks/[id]/route.ts)
     - `GET` [`src/app/api/stats/route.ts`](./src/app/api/stats/route.ts)

3. **Tier 3: Data Access & Database Layer (Prisma + SQLite)**
   - [`prisma/schema.prisma`](./prisma/schema.prisma) — Relational schema (`Project` 1:N `Task`).
   - [`src/lib/db.ts`](./src/lib/db.ts) — Prisma Client singleton connection.
   - [`prisma/seed.ts`](./prisma/seed.ts) — Initial sample projects and tasks.

---

## 🚀 Quick Commands

```bash
# Start development server
npm run dev

# Push schema changes to SQLite
npm run db:push

# Re-seed sample data
npm run db:seed

# Open Prisma Studio (Visual Database Browser)
npm run db:studio
```
