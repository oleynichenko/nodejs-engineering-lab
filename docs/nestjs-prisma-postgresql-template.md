# Task: NestJS Project Starter

Create a small NestJS + TypeScript + PostgreSQL starter for new backend services.

The repository is a pattern to copy. It is not a sample product and not a platform.

The repository must read as an ordinary project starter.

## Stack

Use these versions:

- Node.js 24.15 or newer on the 24 LTS line. Set `engines.node` to `>=24.15.0` and put `24` in `.nvmrc`.
- NestJS 12, scaffolded with the Nest CLI.
- TypeScript 6, strict mode. `@nestjs/schematics` 12 requires TypeScript 6.
- PostgreSQL 18 via Docker Compose. Image: `postgres:18`.
- Prisma ORM 7 and `@prisma/client` 7, on the same minor line.
- class-validator and class-transformer for DTO validation.
- Joi only for environment validation.
- npm as the only package manager.
- The test runner and linter that `nest new` generates for an ESM project: Vitest and oxlint.
- Supertest for HTTP tests.
- Prettier, if the CLI adds it.

Install current stable minor and patch releases inside these majors. Commit the lockfile.

This set is already chosen. Do not swap majors. If a peer dependency refuses to install, fix it inside the same major. Do not use prerelease packages.

Do not install `prisma@latest`. That tag currently points at a Prisma 8 prerelease whose CLI does not provide `migrate` and `generate`. Install `prisma@7` and `@prisma/client@7` explicitly.

Do not add Terminus, Passport, caching, queues, logging libraries, `@nestjs/observe`, or an AI client.
Do not replace Vitest with Jest or oxlint with ESLint.

## Scaffold

Create the app with the Nest CLI in non-interactive mode:

- package manager: npm
- module system: ESM, the CLI default
- do not pass `--observe`

Keep the module system, test runner, and linter the CLI generates. Build later features on that layout.

## Runtime layout

`docker-compose.yml` starts PostgreSQL only. The Nest app runs on the host with `npm run start:dev`.

PostgreSQL service:

- image `postgres:18`
- user, password, and `POSTGRES_DB`: `app`
- publish port `5432`
- named volume mounted at `/var/lib/postgresql`
- healthcheck using `pg_isready -U app -d app`
- a SQL file mounted into `/docker-entrypoint-initdb.d` that runs `CREATE DATABASE app_test;`
  The official image creates only `POSTGRES_DB`. The init script creates the test database on the first volume initialization.

Local credentials in `.env.example` are `app` / `app`. They are development defaults.

## Prisma 7

Run:

`npx prisma init --datasource-provider postgresql --output ../src/generated/prisma`

Keep the config file this command creates (`prisma7.config.ts`, or `prisma.config.ts` on a 7 release before 7.10). That file reads the connection URL from `DATABASE_URL`. Load it with `dotenv/config`.

Do not put `url` in the `datasource` block of `schema.prisma`.

Generator:

- `provider = "prisma-client"`
- `output = "../src/generated/prisma"`
- leave `moduleFormat` unset. The Nest project is ESM.

Also install `dotenv` as a dev dependency and `@prisma/adapter-pg` plus `pg` as dependencies.

`PrismaModule` and `PrismaService` live in `src/database/prisma`.

- `PrismaService` extends the generated `PrismaClient`.
- Construct it with `new PrismaPg({ connectionString })`.
- Take the connection string from `ConfigService` (`DATABASE_URL`).
- Call `$connect` on module init and `$disconnect` on module destroy.
- Import the client from `src/generated/prisma`.
- Gitignore the generated directory.
- Run `npx prisma generate` before `build` and before tests on a fresh checkout.

Put `prisma/schema.prisma` and `prisma/migrations` at the repository root.

The running application always reads `DATABASE_URL`.
`TEST_DATABASE_URL` points at the `app_test` database on the same host, with the same credentials.
The e2e script sets `DATABASE_URL` from `TEST_DATABASE_URL` before `prisma migrate deploy` and before booting the app. Test migrations never touch the `app` database.

## Application behavior

- Global prefix: `/api`.
- CORS enabled for local development.
- One global `ValidationPipe`: `whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`.
- One global exception filter for `HttpException` and unknown errors.
- `HttpException` keeps its status code and message.
- An unknown error returns HTTP 500 with a generic message.
- Responses contain no stack trace and no internal error text when `NODE_ENV` is `production`.
- Every error body uses these fields, in this order: `statusCode`, `message`, `error`, `timestamp`, `path`.
- `GET /api/health` returns 200 when Prisma runs `SELECT 1`, and 503 otherwise.
- `ConfigModule` is global. Validate the environment with Joi at startup and fail fast.

## Environment files

Create `.env.example` and `.gitignore`.

`.env.example` defines:

- `DATABASE_URL=postgresql://app:app@localhost:5432/app`
- `TEST_DATABASE_URL=postgresql://app:app@localhost:5432/app_test`

Gitignore `.env`. Never commit real secrets.

## Example feature: Note

Add one sample feature, Note. It shows the module pattern used by this starter.

Prisma model:

- `id String @id @default(uuid())`
- `title String`
- `createdAt DateTime @default(now())`

`POST /api/notes`

- Body: `{ "title": "Example note" }`
- DTO: `title` is a string, required, trimmed, and non-empty.
- Response: 201 and the created note.

`GET /api/notes`

- Response: 200 and an array of notes, newest first.
- No rows returns `[]`.

Architecture:

- Thin controller.
- Business logic in `NoteService`.
- Prisma calls only inside `NoteService`.
- Constructor injection.
- External input validated by DTOs.

Tests:

- `note.service.spec.ts` with a mocked `PrismaService`.
- `note.controller.spec.ts` with a mocked `NoteService`.

Add one initial migration.

In the README, explain that `src/modules/note` is a sample. Remove it when the first real feature is added, and copy its structure.

Do not add a second feature. Do not add auth.

## Feature request

Add `ASSIGNMENT.md` at the repository root. It is the current feature request for this starter.

Contents:

- a "Feature" heading and an empty section to replace
- a checklist: module, Prisma model, migration, endpoints, DTOs, service tests, HTTP test, README note if the API changed

The file describes the next feature only.

## Skill

Add a project skill at `.cursor/skills/plan-feature/SKILL.md`.

Put this content in that file exactly:
BEGIN SKILL

---

name: plan-feature
description: >-
Plans and implements the feature described in ASSIGNMENT.md using the Note
module as the pattern. Use when the user mentions ASSIGNMENT.md, asks to
plan a feature, or wants a plan before coding.

---

# Plan a feature

## Before planning

Read ASSIGNMENT.md, .cursor/rules/project.mdc, and src/modules/note.

If the Feature section of ASSIGNMENT.md is empty, stop and ask the user to fill it in. Do not invent a feature.

## Plan

Write the plan. Do not edit ASSIGNMENT.md. Do not change application code yet.

The plan names:

- the module to add and the Note files it copies
- Prisma model changes and the migration
- endpoints, DTOs, and status codes
- tests
- assumptions for anything the feature request leaves open
- removal of the sample Note module, its Prisma model, and a migration that drops the Note table, when Note is still present

Ask a question only when the feature cannot be built without the answer. Otherwise choose the smaller option and list it under Assumptions.

## After the plan is accepted

Implement only that plan.

Match src/modules/note: thin controller, business logic in the service, Prisma calls only in the service, DTOs for external input, a migration for every schema change, and tests for the new behavior.

Do not add dependencies or new layers unless the feature request requires them.
Do not change a test so that broken behavior passes.
Leave ASSIGNMENT.md unchanged unless the user asks to update it.

END SKILL

## Project rules

Add `.cursor/rules/project.mdc` with these conventions:

- Prefer a small, maintainable change.
- The current feature request lives in ASSIGNMENT.md. Plan it with the plan-feature skill before changing application code.
- Match the structure of `src/modules/note` when adding a feature.
- HTTP stays in controllers. Business logic stays in services. Database access goes through Prisma.
- Validate every external input with a DTO.
- Every schema change has a migration.
- Cover new behavior with tests. Do not change a test so that broken behavior passes.
- Stay on TypeScript strict. Do not use `any`.
- Do not add dependencies or new layers unless the requested feature requires them.

## Scripts

Keep the scripts the Nest CLI creates. Make sure these names exist and work:

- `start:dev`
- `build`
- `lint`
- `format`
- `test`
- `test:watch`
- `test:cov`
- `test:e2e`
- `prisma:generate`
- `prisma:migrate`
- `prisma:studio`

`test:e2e` exports `DATABASE_URL` from `TEST_DATABASE_URL`, runs `prisma migrate deploy` against that database, boots the app, and requests `GET /api/health` with Supertest. The health check must return 200.

`build` and `test` depend on a generated Prisma Client.

## README

Write a short README with the exact commands for:

1. What this starter includes.
2. Prerequisites: Node.js 24.15+, Docker, npm.
3. `npm ci`
4. `cp .env.example .env` (on Windows, `copy .env.example .env`)
5. `docker compose up -d`
6. `npx prisma migrate dev`
7. `npm run start:dev`
8. `npm test` and `npm run test:e2e`
9. `src/modules/note` is a sample of the feature pattern. The first real feature replaces it: remove the module, the model, and the table.
10. The next feature goes in `ASSIGNMENT.md`. Planning steps are in `.cursor/skills/plan-feature/SKILL.md`.
11. The script list.

## Verify

Run these in order. Record the command and the exit code. On failure, fix the cause and rerun that command before continuing. Report a pass only for a command you executed.

1. `npm ci`
2. `npx prisma generate`
3. `docker compose up -d`
4. `npx prisma migrate dev`
5. `npm test`
6. `npm run test:e2e`
7. `npm run lint`
8. `npm run build`

Reply with the verification log only.
