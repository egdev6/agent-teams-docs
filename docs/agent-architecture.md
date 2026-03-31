---
description: Learn the recommended 4-layer agent architecture in Agent Teams — Router, Orchestrator, Workers, and Context — for building scalable, maintainable AI pipelines in VS Code.
---

# Ideal Agent Architecture

**Status:** 🧪 Beta

This guide explains the recommended architecture for building a multi-agent system with Agent Teams. Following this pattern produces a scalable, maintainable, and predictable pipeline where each layer has a single responsibility.

---

## The Pipeline

<!-- IMAGE: Screenshot — GitHub Copilot Chat panel showing a real conversation where the user sends a message to @router and the router delegates to an orchestrator, with the orchestrator's response visible. Captures the pipeline in action end-to-end. Suggested filename: architecture-pipeline-chat.png -->

```
Single domain:
  User Prompt  →  Router  →  Orchestrator  →  Worker(s)  →  Task Done

Multiple domains (parallel dispatch):
  User Prompt  →  Router  →  Orchestrator A ┐
                                Orchestrator B ┤ → Workers → Aggregator → Task Done
                                Orchestrator C ┘
Direct dispatch (autonomous workers, no orchestrator needed):
  User Prompt  →  Router  →  Worker A (autonomous) ┌
                             Worker B (autonomous) ┤ → Aggregator → Task Done
                             Worker C (autonomous) ┘```

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
- For single-domain tasks: use `agent-teams-handoff` to open a targeted chat with one orchestrator
- For multi-domain tasks: use `agent-teams-dispatch-parallel` to fan out to multiple orchestrators simultaneously

**What the router must NOT do:**
- Execute any task itself
- Make assumptions about implementation details
- Call orchestrators as direct sub-agent tools — always use the dispatch tools (`agent-teams-handoff` or `agent-teams-dispatch-parallel`)

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

### Autonomous Workers (Direct Dispatch)

Workers can optionally operate in **autonomous mode** via `engram.mode: autonomous`. In this mode the worker is dispatched directly by the router — without an intermediate orchestrator — and manages its own task lifecycle:

- Recalls task context from Engram at session start (using the `[Handoff:{taskId}]` or `[Parallel:{taskId}]` prefix injected by the router).
- Persists its result and calls `complete_subtask` when done to notify the aggregator.
- Automatically receives the `complete-subtask` tool; no manual configuration required.

```yaml
id: frontend-worker
name: Frontend Worker
role: worker
engram:
  mode: autonomous
```

Use autonomous mode when the work within a domain is self-contained and does not require orchestration. For tasks that need multi-step coordination within a domain, keep the standard orchestrator → worker flow.

---

## Layer 5 — Aggregator

The aggregator is used exclusively in **parallel dispatch** flows. When the router fans out a task to multiple orchestrators simultaneously, the aggregator receives all their results once every subtask is complete, merges them, and returns a unified response to the user.

**Responsibilities:**
- Load each orchestrator's result from Engram using the task ID
- Detect conflicts (e.g. two orchestrators modifying the same file)
- Report conflicts clearly before presenting the unified outcome
- Persist the merged result to Engram under `task:{taskId}:result`

**What the aggregator must NOT do:**
- Execute subtasks itself
- Proceed before all parallel subtasks have signalled completion
- Silently discard conflicts — all cross-domain file overlaps must be reported

> The aggregator is configured as `role: aggregator`. It is only needed when your team uses parallel dispatch. One aggregator per team is sufficient.

---

## Full Example: End-to-End Flow

### Single domain

```
User:
  @router  Refactor the authentication module to use JWT tokens.

Router:
  → Scores agents
  → Selects: backend-orchestrator (intent=refactor, file=src/auth/, domain=backend)
  → Calls agent-teams-handoff → opens chat with backend-orchestrator

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

### Multiple domains (parallel dispatch)

```
User:
  @router  Add a new /payments endpoint with frontend form and full test coverage.

Router:
  → Identifies 3 independent domains: backend, frontend, testing
  → Calls agent-teams-dispatch-parallel with subtasks for each orchestrator
  → Opens 3 parallel chats simultaneously

Orchestrators (in parallel):
  backend-orchestrator  → implements the REST endpoint
  frontend-orchestrator → builds the payment form component
  testing-orchestrator  → writes end-to-end and unit tests

  Each orchestrator calls agent-teams-complete-subtask when done

Aggregator:
  → Loads all 3 results from Engram
  → Detects conflicts (e.g. both backend and frontend touched api-client.ts)
  → Reports conflicts and presents unified outcome

Task done.
```

---

## Architecture Diagram

<!-- IMAGE: Diagram — Rendered visual of the single-domain flow: User Prompt → Router → Orchestrator → Workers A/B/C → Task Done. Should replace or complement the ASCII art above, using boxes and arrows for clarity. Suggested filename: architecture-single-domain.png -->

### Single domain

```
┌─────────────┐
│  User Prompt │
└──────┬──────┘
       │  @router message
       ▼
┌─────────────┐        agent-teams-handoff
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

<!-- IMAGE: Diagram — Rendered visual of the multi-domain parallel dispatch flow: User Prompt → Router → Orchestrators A/B/C (in parallel) → Workers → Aggregator → Task Done. Should replace or complement the ASCII art below. Suggested filename: architecture-parallel-dispatch.png -->

### Multiple domains (parallel dispatch)

```
┌─────────────┐
│  User Prompt │
└──────┬──────┘
       │  @router message
       ▼
┌─────────────┐   agent-teams-dispatch-parallel
│    Router    │ ─────────────────────────────────────────────┐
└─────────────┘                                               │
                                       ┌──────────────────────┼──────────────────────┐
                                       ▼                      ▼                      ▼
                            ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
                            │  Orchestrator A  │   │  Orchestrator B  │   │  Orchestrator C  │
                            └────────┬────────┘   └────────┬────────┘   └────────┬────────┘
                                     │ workers              │ workers              │ workers
                                     ▼                      ▼                      ▼
                              [complete-subtask]     [complete-subtask]     [complete-subtask]
                                     │                      │                      │
                                     └──────────────────────┴──────────────────────┘
                                                            │  all subtasks done
                                                            ▼
                                                  ┌──────────────────┐
                                                  │    Aggregator    │
                                                  │ (merges results, │
                                                  │ flags conflicts) │
                                                  └────────┬─────────┘
                                                           │
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
| **Dispatch tools for multi-domain** | Routers use `agent-teams-handoff` or `agent-teams-dispatch-parallel` — never call orchestrators directly |
| **Aggregator closes the loop** | Parallel flows always end with an aggregator that merges results and surfaces conflicts |

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

```yaml
# results-aggregator.yml
id: results-aggregator
name: Results Aggregator
role: aggregator
handoffs:
  receives_from:
    - backend-orchestrator
    - frontend-orchestrator
    - testing-orchestrator
  delegates_to: []
  escalates_to:
    - human
```

---

<!-- IMAGE: Screenshot — Agent Teams dashboard Team Agents card showing a fully configured team with Router, Orchestrator, and Worker agents each in their respective role sections, illustrating the layer structure in the real UI. Suggested filename: architecture-team-overview.png -->

## Common Anti-Patterns

| Anti-pattern | Problem | Fix |
|---|---|---|
| User bypasses router | No routing logic applied, wrong agent picked | Always use `@router` as the entry point |
| Router executes tasks | Router becomes a bottleneck and a single point of failure | Router only routes — never acts |
| Router calls orchestrators directly as tools | Bypasses context passing and task tracking via Engram | Always use `agent-teams-handoff` or `agent-teams-dispatch-parallel` |
| Orchestrator writes code | Mixes coordination and execution, hard to debug | Move execution to a dedicated worker |
| Worker delegates to another worker | Creates hidden dependencies and circular calls | All delegation must go through the orchestrator |
| Single "do everything" agent | Unscalable, context bloat, unpredictable output | Split by domain into multiple focused workers |
| Parallel dispatch without an aggregator | Results are never merged; conflicts go undetected | Add a `role: aggregator` agent to your team |
| Aggregator starts before all subtasks complete | Reads incomplete Engram state, produces wrong output | `agent-teams-complete-subtask` ensures the aggregator opens only after all subtasks signal completion |
| Using `engram.mode: autonomous` for multi-step domain tasks | Autonomous workers have no orchestrator to sequence steps or retry failures | Use autonomous mode only for self-contained, single-step domain tasks |

---
