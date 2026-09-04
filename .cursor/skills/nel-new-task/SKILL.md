---
name: nel-new-task
description: >-
  Scaffold a Node.js backend interview coding task in utils/ with README,
  SOLUTION (TypeScript), and empty ts stubs. Use when the user asks to create
  a new interview task, names nel-new-task, gives a task name (e.g. "debounce",
  "rate limiter"), or wants the same structure as utils/retry.
---

# nel-new-task

Scaffold a new interview exercise under `utils/{task-name}/`. Canonical example: `utils/retry/`.

## Input

User provides a **task name** (e.g. `retry`, `debounce`, `promise-pool`). Derive:

| Input | Output |
|-------|--------|
| `retry` | folder `utils/retry/`, files `retry.ts`, `retry.test.ts` |
| `rate limiter` | folder `utils/rate-limiter/`, files `rate-limiter.ts`, `rate-limiter.test.ts` |

Use **kebab-case** for folder and file names.

## Directory Structure

Create exactly this layout:

```
utils/{task-name}/
├── README.md
├── SOLUTION.md
└── ts/
    ├── {task-name}.ts       # empty (single newline or blank)
    └── {task-name}.test.ts  # empty (single newline or blank)
```

Do **not** implement code in `ts/` — those files are for the user to solve.

## Step 1 — README.md (the interview prompt)

Write what a candidate would actually get in a live coding round: **short, direct, no lecture**.

Include only:

1. **Title** — `# Implement \`{fn}\`` or `# Implement {ClassName}`
2. **One-sentence description**
3. **Function signature** — TypeScript types (interface/type for options where needed)
4. **Requirements** — bullet list, 5–8 items max
5. **Example** — one runnable snippet with expected output
6. **Edge cases** — 3–5 bullets

Rules:

- No "what interviewers test", no senior follow-ups, no bonus sections
- No production architecture essays
- Match tone of `utils/retry/README.md`
- Scope fits ~30–45 minutes of live coding (basic version only)

## Step 2 — SOLUTION.md (study guide)

Everything the candidate needs **after** attempting the task. Sections:

1. **Reference Solution** — complete working **TypeScript** with proper types and `export`
2. **How it works** — numbered steps, brief
3. **Common mistakes** — table: mistake | why wrong
4. **What to Know for the Interview** — 5–8 subsections on concepts the task touches (production context, trade-offs)
5. **Typical Interview Progression** — how the interviewer extends the basic task verbally (numbered list)
6. **Extended Solution** — optional harder version in **TypeScript** if commonly asked
7. **Quick Checklist Before the Interview** — checkbox list of skills to rehearse

Rules:

- All solution code is **TypeScript** — typed options, generics where appropriate, `export`/`export default`
- Solution code must match README requirements exactly
- Extended solution covers follow-ups from "Typical Interview Progression", not random extras
- Senior topics live here, not in README

## Step 3 — Empty stubs

Create `ts/{task-name}.ts` and `ts/{task-name}.test.ts` as empty files.

## Task Selection

Pick a **classic Node.js / backend interview problem** appropriate to the name:

| Name hints | Typical task |
|------------|--------------|
| retry, backoff | async retry with delay |
| debounce, throttle | rate-limit function calls |
| promise-pool, concurrency | bounded parallel execution |
| lru-cache, ttl-cache | in-memory cache |
| event-emitter | pub/sub class |
| middleware | sync/async pipeline |
| deep-clone, flatten | object/array utility |
| rate-limiter | token bucket / sliding window |

If the name is ambiguous, pick the most common interview variant for that topic.

## Do Not

- Add tests to `*.test.ts` unless the user explicitly asks
- Fill in `ts/{task-name}.ts` with implementation
- Put JavaScript solutions in SOLUTION.md — always TypeScript
- Create a `js/` folder unless the user explicitly asks for it
- Create extra files (no separate requirements.md, no package.json changes)
- Over-specify README — leave room for verbal follow-ups in SOLUTION.md

## Verification

After creating files, confirm:

- [ ] `utils/{task-name}/` exists with 4 files
- [ ] README is concise (~40–60 lines) with TypeScript signatures
- [ ] SOLUTION.md has all 7 sections with TypeScript code
- [ ] `ts/*.ts` files are empty
- [ ] Naming is consistent (folder name = file prefix)

## Reference

Read these before writing if unsure of tone:

- `utils/retry/README.md` — prompt style
- `utils/retry/SOLUTION.md` — study guide style
