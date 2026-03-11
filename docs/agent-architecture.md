# Ideal Agent Architecture

**Status:** 🧪 Beta

This guide explains the recommended architecture for building a multi-agent system with Agent Teams. Following this pattern produces a scalable, maintainable, and predictable pipeline where each layer has a single responsibility.

---

## The Four-Layer Pipeline

```
User Prompt  →  Router  →  Orchestrator  →  Worker(s)  →  Task Done
```

Each layer transforms the input in a specific way before passing it to the next. No layer skips steps or takes on responsibilities outside its scope.

---

## Layer 1 — User Prompt

The entry point. The user sends a natural-language message through Copilot Chat using `@router`.

```
@router  Refactor the authentication module to use JWT tokens.
```

**What happens here:**
- The user expresses intent in plain language
- No structure or routing logic is expected from the user
- The message may reference a file, a domain, or a vague goal

**Best practices:**
- Keep `@router` as the single entry point for all requests
- Avoid bypassing the router by addressing a specific agent directly unless you need pinpoint control

---

## Layer 2 — Router

The router is the traffic controller. It receives every `@router` message, analyzes it, and delegates to the most appropriate agent.

**Responsibilities:**
- Parse intent keywords (e.g. `refactor`, `write`, `review`, `fix`)
- Match the active file's path against agent glob patterns
- Score agents by domain vocabulary, expertise areas, and role
- Hand off to a single **orchestrator** (for multi-step tasks) or directly to a **worker** (for simple tasks)

**What the router must NOT do:**
- Execute any task itself
- Make assumptions about implementation details
- Delegate to more than one agent simultaneously

**Example routing decision:**

| Signal | Value | Matched agent |
|---|---|---|
| Intent keyword | `refactor` | `backend-orchestrator` |
| Active file | `src/auth/jwt.ts` | `backend-orchestrator` |
| Domain match | `backend`, `auth` | `backend-orchestrator` |

> The router is configured as `role: router` in its YAML spec. Only one router agent should exist per team.

---

## Layer 3 — Orchestrator

The orchestrator receives a delegated task from the router and breaks it into an ordered sequence of subtasks. It coordinates workers but does not implement anything itself.

**Responsibilities:**
- Decompose the original request into discrete, actionable steps
- Determine which worker agent handles each step
- Define the order and dependencies between steps
- Aggregate or summarize results from workers before returning a response

**What the orchestrator must NOT do:**
- Write, read, or modify files directly
- Execute shell commands or call external APIs
- Short-circuit to the user without completing the plan

**Example decomposition:**

```
Task: Refactor authentication module to use JWT tokens

Step 1 → [backend-worker]   Analyse existing auth code and identify coupling points
Step 2 → [backend-worker]   Replace session logic with JWT issuance and validation
Step 3 → [testing-worker]   Generate unit tests for the new JWT functions
Step 4 → [docs-worker]      Update API reference documentation
```

> An orchestrator is configured as `role: orchestrator`. A team can have multiple orchestrators, each specialised in a domain (e.g. `frontend-orchestrator`, `backend-orchestrator`).

---

## Layer 4 — Worker(s)

Workers are the agents that actually do the work. Each worker is a domain specialist with a narrow, well-defined scope.

**Responsibilities:**
- Execute the specific subtask delegated by the orchestrator
- Use only the tools and skills defined in its spec
- Return a structured result to the orchestrator
- Escalate if the subtask is outside its scope

**What a worker must NOT do:**
- Accept tasks outside its declared domain
- Delegate to other workers directly (all coordination goes through the orchestrator)
- Return partial results without signalling incompleteness

**Worker examples:**

| Worker | Domain | Typical tasks |
|---|---|---|
| `backend-worker` | `backend` | API logic, database queries, service layer |
| `frontend-worker` | `frontend` | Components, styles, state management |
| `testing-worker` | `testing` | Unit tests, integration tests, coverage |
| `docs-worker` | `documentation` | README updates, API docs, changelogs |

> Workers are configured as `role: worker`. You can have as many workers as needed — each covering a specific domain or subdomain.

---

## Full Example: End-to-End Flow

```
User:
  @router  Refactor the authentication module to use JWT tokens.

Router:
  → Scores agents
  → Selects: backend-orchestrator (intent=refactor, file=src/auth/, domain=backend)
  → Delegates full request

Orchestrator (backend-orchestrator):
  → Decomposes task into 4 steps
  → Step 1 → backend-worker   (analyse existing code)
  → Step 2 → backend-worker   (replace session with JWT)
  → Step 3 → testing-worker   (write unit tests)
  → Step 4 → docs-worker      (update API docs)
  → Aggregates results
  → Returns summary to user

Task done.
```

---

## Architecture Diagram

```
┌─────────────┐
│  User Prompt │
└──────┬──────┘
       │  @router message
       ▼
┌─────────────┐        scores & routes
│    Router    │ ──────────────────────────────┐
└─────────────┘                                │
                                               ▼
                                  ┌────────────────────────┐
                                  │      Orchestrator       │
                                  │  (decomposes the task)  │
                                  └────────┬───────────────┘
                                           │  delegates subtasks
                          ┌────────────────┼────────────────┐
                          ▼                ▼                 ▼
                   ┌────────────┐  ┌────────────┐  ┌────────────┐
                   │  Worker A  │  │  Worker B  │  │  Worker C  │
                   │ (backend)  │  │ (testing)  │  │   (docs)   │
                   └─────┬──────┘  └─────┬──────┘  └─────┬──────┘
                         │               │                │
                         └───────────────┴────────────────┘
                                         │  results
                                         ▼
                               ┌──────────────────┐
                               │   Task Done ✓    │
                               └──────────────────┘
```

---

## Design Principles

| Principle | Description |
|---|---|
| **Single responsibility** | Each layer has one job and does not bleed into another |
| **One entry point** | All requests flow through `@router` — no shortcuts |
| **Orchestrators coordinate, workers execute** | Never mix planning and doing in the same agent |
| **Explicit handoffs** | Each agent declares `handoffs.delegates_to` and `handoffs.receives_from` |
| **Escalation over failure** | Workers escalate to the orchestrator when blocked — they never fail silently |

---

## Configuring Handoffs in YAML

```yaml
# backend-orchestrator.yml
id: backend-orchestrator
name: Backend Orchestrator
role: orchestrator
handoffs:
  receives_from:
    - router
  delegates_to:
    - backend-worker
    - testing-worker
    - docs-worker
  escalates_to:
    - human
```

```yaml
# backend-worker.yml
id: backend-worker
name: Backend Worker
role: worker
handoffs:
  receives_from:
    - backend-orchestrator
  delegates_to: []
  escalates_to:
    - backend-orchestrator
```

---

## Common Anti-Patterns

| Anti-pattern | Problem | Fix |
|---|---|---|
| User bypasses router | No routing logic applied, wrong agent picked | Always use `@router` as the entry point |
| Router executes tasks | Router becomes a bottleneck and a single point of failure | Router only routes — never acts |
| Orchestrator writes code | Mixes coordination and execution, hard to debug | Move execution to a dedicated worker |
| Worker delegates to another worker | Creates hidden dependencies and circular calls | All delegation must go through the orchestrator |
| Single "do everything" agent | Unscalable, context bloat, unpredictable output | Split by domain into multiple focused workers |

---
