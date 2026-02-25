# ProcureAI Phase 1 – Core Architecture Foundation

## Monorepo Folder Structure

```text
.
├── apps
│   ├── api
│   │   ├── src
│   │   │   ├── app.module.ts
│   │   │   ├── main.ts
│   │   │   ├── common
│   │   │   │   ├── decorators
│   │   │   │   ├── filters
│   │   │   │   ├── guards
│   │   │   │   └── middleware
│   │   │   ├── database
│   │   │   │   └── migrations
│   │   │   └── modules
│   │   │       ├── audit
│   │   │       ├── auth
│   │   │       ├── dashboard
│   │   │       ├── roles
│   │   │       ├── tenants
│   │   │       └── users
│   │   └── test
│   └── web
│       ├── app
│       │   ├── dashboard
│       │   └── login
│       ├── components
│       └── lib
├── packages
│   └── shared
├── docker
│   ├── Dockerfile.api
│   ├── Dockerfile.web
│   └── docker-compose.yml
└── docs
    └── phase1-foundation.md
```

## PostgreSQL Schema + RLS

- Schema tables: `tenants`, `users`, `roles`, `user_roles`, `audit_logs`.
- RLS policies are enabled on tenant-scoped tables (`users`, `user_roles`, `audit_logs`).
- Each request sets `app.current_tenant_id` (from `x-tenant-id`) via middleware.
- Policies force `tenant_id = current_setting('app.current_tenant_id')::uuid` for both reads and writes.

## NestJS Module Breakdown

- `AuthModule`
  - `AuthController`: `/auth/login`, `/auth/refresh`.
  - `AuthService`: credential validation + JWT access/refresh issuance + rotation.
  - `JwtStrategy`: bearer token validation.
- `UsersModule`
  - `UsersService`: tenant-aware user loading and role hydration.
- `DashboardModule`
  - Protected route for tenant-scoped dashboard shell data.
- `AuditModule`
  - Global interceptor writing records to `audit_logs`.
- `RolesModule` / `TenantsModule`
  - Domain placeholders for expansion in next phases.

## Middleware, Filters, and Guards

- `RequestLoggingMiddleware`: logs request/response latency and status.
- `TenantContextMiddleware`: sets PostgreSQL tenant runtime setting for RLS.
- `AuditMiddleware`: prepares immutable request metadata.
- `GlobalExceptionFilter`: consistent structured API errors.
- `JwtAuthGuard`: enforces access token auth.
- `TenantGuard`: ensures token tenant + `x-tenant-id` alignment.
- `RolesGuard`: enforces RBAC (`Admin`, `ProcurementManager`, `Approver`, `Finance`).

## API Endpoints (Phase 1)

- `POST /api/v1/auth/login`
  - Body: `email`, `password`, `tenantId`
  - Returns: `accessToken`, `refreshToken`
- `POST /api/v1/auth/refresh`
  - Body: `refreshToken`, `tenantId`
  - Returns: new `accessToken`, new `refreshToken`
- `GET /api/v1/dashboard`
  - Headers: `Authorization: Bearer ...`, `x-tenant-id`
  - RBAC: any phase-1 role
  - Returns: tenant-scoped dashboard payload

## Auth Flow (Access + Refresh Rotation)

1. User submits email/password + tenant context.
2. Backend validates credentials against tenant-scoped user lookup.
3. Backend issues short-lived access token and long-lived refresh token.
4. Protected routes require access token + tenant header verification.
5. Refresh endpoint validates refresh token tenant scope and rotates both tokens.

## Audit Logging

- Global audit interceptor captures authenticated request actions.
- Persisted fields: `tenant_id`, `actor_id`, `action`, `entity_name`, `metadata`, `created_at`.
- Captures route/method/ip/user-agent context from middleware.

## Dockerized Architecture

- `postgres`: source of truth relational database.
- `redis`: queue/cache foundation (BullMQ-ready in phase 1).
- `api`: NestJS runtime.
- `web`: Next.js runtime.

## Acceptance Criteria Mapping

- Tenant isolation via RLS policies + `TenantGuard` + tenant session context middleware.
- Cross-tenant access blocked by SQL policy and header/token mismatch validation.
- JWT rotation implemented in `/auth/refresh` issuing new token pair.
- Audit logs inserted through global interceptor for authenticated actions.

## Frontend Shell

- `/login`: enterprise login form integrated to API.
- `/dashboard`: role-aware shell page for phase-1 foundational visibility.
