# Architecture

This document records confirmed architectural decisions and their trade-offs.
Open questions remain explicitly marked so that recommendations are not mistaken
for decisions.

## Priorities

In order:

1. simplicity;
2. ease of understanding and live modification;
3. testability;
4. reasonable extension without speculative infrastructure.

The target is a clear 4-6 hour solution, not a compressed enterprise platform.

## Modularity rule

Separate code by reason to change and introduce abstractions only at boundaries
that have more than one required implementation or isolate an external system.
Domain code is expected to know about listing suggestions; making it generic
would hide the product rather than improve reuse.

Applied boundaries:

- `GenerateModelOutput` is injected because real and mock model access are both
  required;
- model-output parsing is a dedicated pure function because it protects the
  external-data trust boundary;
- the listing-suggestions contract is shared by backend and frontend so their
  compile-time types cannot drift;
- frontend HTTP access is separate from React rendering.

The parser itself is not injected because there is only one validation policy.
Routes and use cases remain concrete. No dependency-injection container, generic
provider framework, or repository layer is introduced.

## Confirmed technology choices

### Language

Use TypeScript across frontend and backend.

Although JavaScript is not the user's preferred language, one language across the
whole application reduces setup, context switching, and the amount of code that
must be understood during the assessment.

TypeScript is preferred over plain JavaScript because the request, application
result, and provider boundaries benefit from explicit types. Runtime validation
is still required because TypeScript cannot validate HTTP or AI data at runtime.

### Frontend

Use React with Vite.

Reasons:

- the product has one interactive screen;
- React local state is sufficient for the agreed workflow;
- Vite provides a small client build and development setup;
- no frontend router, server rendering, or full-stack React framework is needed.

Trade-off: React provides fewer built-in conventions than Angular, so the project
must keep its own structure clear.

### Backend

Use Node.js with Express and TypeScript.

Reasons:

- one language across both sides;
- Express can expose the required single endpoint with little framework code;
- the route can be tested independently from the listening server;
- provider credentials remain on the backend.

Trade-off: Express is deliberately unopinionated, so we must avoid both a large
layered architecture and an unstructured route containing every responsibility.

### Alternatives not selected

- Angular offers a broader first-party application structure, but most of it is
  unnecessary for one screen.
- Kotlin with Ktor offers a strongly typed backend, but adds a second language,
  Gradle, and more context switching for this assignment.

These alternatives were rejected for proportionality, not because they are poor
technologies.

## Confirmed repository shape

Use one npm project and one dependency installation:

```text
src/
  frontend/
  backend/
```

Frontend and backend remain visibly separated without introducing npm workspaces
or two independent package configurations.

Expected supporting configuration may remain at the repository root. The exact
file tree will be introduced incrementally rather than scaffolded in advance.

## Confirmed scope boundaries

- React local state; no Redux or other global state library.
- One backend endpoint for listing suggestions.
- No database, authentication, queue, cache, or microservice split.
- AI keys and provider-specific code never reach the frontend.
- Mock mode is a first-class backend behaviour controlled by environment.

## Confirmed test approach

Use Vitest as the single test runner for backend and frontend code.

- Backend tests run in a Node environment.
- Supertest exercises the Express application in memory without opening a port.
- Later frontend component tests can use the same runner with a DOM environment.
- Type checking remains a separate `tsc --noEmit` command because Vitest
  transforms TypeScript but does not perform full static type checking.

Trade-offs:

- Vitest and Supertest add development dependencies.
- Supertest verifies Express routes and middleware but not the process listening
  on a real network port.
- The benefit is one test syntax, command style, and reporting flow across the
  application.

Test files initially stay beside the code they exercise. A small endpoint suite
remains in one file and is grouped by behaviour with `describe` blocks. When a
behaviour grows to several cases, it can move to a focused file such as
`app.input-validation.test.ts` or `app.model-errors.test.ts`. Regression tests
remain with the behaviour they protect rather than in a generic regression file.

Frontend behaviour tests use React Testing Library, `user-event`, and jsdom under
the same Vitest runner. They query accessible labels and visible results rather
than component implementation details.

## Request flow

The high-level flow is:

```text
Seller
  -> React UI
  -> backend endpoint
  -> request validation
  -> application generation flow
  -> real or mock model access
  -> untrusted-output parsing and validation
  -> application result
  -> React UI
```

During local development, Vite proxies `/api` to the Express server on port 3001.
The two processes start through one npm command. This keeps provider access on the
backend while avoiding CORS configuration for the local single-page application.

The frontend keeps request code and API-facing types in a small module separate
from the React component. React local state owns the description, field error,
request error, loading flag, and current result; no shared state library is
needed.

This is a responsibility map, not a commitment to one file or class per line.

## Confirmed AI boundary

Mock mode replaces only the call to the real model. It does not replace the
endpoint, application flow, parser, validator, or UI.

Both implementations return an untrusted model payload:

```text
                         -> real model
application generation -|
                         -> mock model
                                |
                                v
                    shared parsing and validation
                                |
                                v
                       application result
```

`Untrusted` describes the payload before validation; it does not mean that every
model response is invalid. A valid payload becomes an application result only
after it passes the common parser and deterministic checks.

The boundary remains a small function type rather than a class hierarchy:

```ts
type ListingGenerationInput = {
  description: string;
};

type GenerateModelOutput = (
  input: ListingGenerationInput,
) => Promise<unknown>;
```

Prompt construction therefore belongs to each provider adapter rather than the
application generation function.

### Responsibilities

- The Express route owns HTTP request and response concerns.
- A dedicated application function coordinates prompt creation, model access,
  parsing, and the application result.
- The real model implementation owns provider SDK, model, credentials, and
  transport details.
- The mock implementation owns deterministic scenarios selected through
  environment configuration.
- The common parser and validator own the trust boundary.
- The frontend knows only the application/API result, never the provider.

### Mock behaviour

Mock mode is a required way to run the complete application without an API key.
It must support at least:

- a valid model payload;
- a malformed or otherwise invalid model payload.

A separate nonsensical-but-structured scenario can be included if it protects a
distinct deterministic rule without creating a semantic classification engine.

The development server selects the deterministic mock through
`MOCK_SCENARIO=valid|limited|needs_more_information|invalid`. An absent value
defaults to `valid`; an unsupported value fails immediately instead of silently
selecting a scenario. The backend development command optionally loads `.env`
through Node's built-in `--env-file-if-exists` flag, so mock mode still starts
when the ignored local file is absent.

### Confirmed real-provider direction

Use Groq with the `openai/gpt-oss-20b` model. Its free tier allows the real AI
path to be demonstrated without OpenAI API billing, and Groq documents support
for the selected OpenAI-compatible JavaScript client and JSON Object Mode.

The provider will receive a small application-owned input object rather than a
prebuilt provider prompt:

```ts
type ListingGenerationInput = {
  description: string;
};
```

This keeps prompt construction inside the provider adapter. The frontend request
remains `{ description }`, and provider selection uses
`MODEL_PROVIDER=mock|groq`. Mock is the default. Selecting Groq without a
non-empty `GROQ_API_KEY` fails at startup instead of silently falling back to a
mock; the key remains backend-only.

The Groq adapter uses Chat Completions with JSON Object Mode. A strict JSON Schema
was considered but rejected because it duplicated the existing runtime parser
and required extra representation work for the three result variants. The prompt
defines the expected variants, while the common parser remains the application
trust boundary.

The request uses `temperature: 0.5` and a fixed `seed: 42` to reduce variation
between identical descriptions. The seed is treated as best-effort reproducibility,
not a guarantee that outputs remain identical across provider or model changes.

Price ranges are model estimates based on general learned knowledge, not live
Wallapop listings or a comparable-sales data source. The prompt avoids claiming
live market data, `limited` requests a wider range, and the UI labels every range
as estimated.

### Validation scope

Use structural validation plus small deterministic domain rules, such as the
required number of tags and a coherent non-negative price range.

Do not add keyword heuristics, a category rules engine, a numeric confidence
score, or a second AI call to judge the first response. A plausible but
semantically unrelated response cannot be detected perfectly by deterministic
validation; prompt constraints reduce this risk, and the limitation should be
documented honestly.

The implemented parser currently accepts the `complete` outcome and enforces a
non-empty title, 3-5 non-empty case-insensitively unique tags, and a finite,
non-negative, ordered EUR price range. It accepts either a JSON string or an
already-decoded unknown value and always returns the shared application type.

Malformed JSON or a structurally invalid value raises a focused
`InvalidModelOutputError`. The Express route maps only that known failure to HTTP
502 and the stable `INVALID_MODEL_OUTPUT` code; unrelated failures continue to
the normal Express error path so future provider errors are not accidentally
misclassified.

## Other open decisions

- the remainder of the HTTP response contract beyond the first success response
  and the `INVALID_DESCRIPTION` error;
- runtime validation approach;
- application and provider error mapping;
- frontend component-testing helper and exact later test boundaries;
- development and production scripts.

## Refactoring watchpoints

The first vertical slice intentionally keeps some responsibilities together.
`generateListingSuggestions` currently creates the prompt, calls the model
gateway, and parses JSON. This is acceptable while there is only one successful
path, but it must be reviewed as runtime validation and additional outcomes are
introduced.

Split responsibilities only when the next behaviour produces a clear boundary;
do not keep adding parsing, validation, provider error mapping, and prompt logic
to one growing function.

Basic request-shape validation currently belongs to the Express route. The first
rule rejects a missing, non-string, empty, or whitespace-only `description` with
HTTP 400 before model access. This placement keeps HTTP input concerns out of the
generation function; revisit the validation mechanism only if the request shape
grows enough to justify a schema library or dedicated module.
