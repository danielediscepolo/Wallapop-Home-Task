# AI Journey Notes

Working notes for the development of the Wallapop Listing Assistant.

This is a chronological record of the real collaboration with AI. It captures
decisions, alternatives, rejected proposals, trade-offs, prompts, unexpected
results, and lessons while they happen. It is not the final `AI_JOURNEY.md` and
should not be polished into a success story prematurely.

## 2026-09-04 - Starting from the seller experience

### Objective

Understand the assignment before choosing technologies or writing application
code. Separate explicit requirements from optional ideas and identify the first
product decision to discuss.

### User direction

The user established a working method centred on:

- starting from the seller experience;
- discussing significant decisions together;
- using small, behaviour-focused TDD steps;
- keeping the solution proportional to a 4-6 hour assignment;
- treating AI output as untrusted input;
- recording the real AI-assisted process as it happens.

### AI proposal

The AI extracted the explicit requirements, proposed a minimal seller flow, and
separated mandatory behaviour from possible nice-to-have features. It identified
user-facing failure cases such as empty input, provider errors, malformed output,
missing fields, an invalid price range, and semantically nonsensical suggestions.

For the first product decision, the AI proposed discussing how the UI should
handle invalid or incomplete AI results. It presented three alternatives:

1. show results only when the complete response is valid;
2. show the valid parts of a partial response;
3. replace missing values with application-generated fallbacks.

The AI recommended the first alternative because it is simpler to explain and
test and avoids presenting invented or partially trustworthy pricing advice.

### User decision

The user paused the UI decision and asked to create this working notebook first,
so that decisions, strategies, and contributions from both sides are preserved
throughout the project.

### Outcome

- No application code, stack, architecture, or UI behaviour has been chosen.
- `AI_JOURNEY_NOTES.md` is created before implementation begins.
- The handling of invalid or partial AI results remains the next open discussion.

### Lesson

Capturing decisions from the beginning is part of the development process, not a
documentation exercise to reconstruct at the end.

## 2026-09-04 - Choosing the seller input experience

### Problem

A completely free description is easy to use, but sellers of different products
may omit different information. For example, mileage matters for a car while size
matters for clothing.

### User proposal

Keep the main description free-form, but consider optional fields that could
appear depending on the type of product.

### Alternatives discussed

1. Use only a guided free-form description.
2. Add generic optional fields such as brand, model, and condition.
3. Add category-specific fields, either fixed by the application or selected by
   the seller.

The AI initially recommended the first option for the initial scope. It keeps the
flow universal and close to the assignment, while category-specific fields would
require a taxonomy, conditional validation, additional API data, and more tests.

### Decision

Start with one guided free-form description. The interface will suggest useful
details to include when relevant, such as brand, model, condition, defects, size,
year, or mileage.

Optional fields remain a deliberate future possibility. We have not decided
whether they should be fixed, category-dependent, or selected by the seller.

### Trade-off

The initial interaction stays quick and works across product categories, but the
seller may omit information that would improve the suggestions. We accept this
for the first version and will avoid speculative category infrastructure until a
real need is demonstrated.

## 2026-09-04 - Separating the first draft from the intended experience

### AI proposal

The AI initially proposed displaying valid suggestions as read-only values with
copy actions. This was intended to keep the implementation small and avoid
turning the result area into an editor too early.

### User direction

The user clarified that editing results, regenerating suggestions, and providing
input guidance are desired product features. They do not need to be present in
the first working draft, but the implementation should allow them to be added
without being rebuilt from scratch.

### Revised direction

- The first draft may only generate and display suggestions.
- The intended experience will also support editing and regeneration.
- Input guidance is part of the intended experience, not a mandatory field
  system.
- Extensibility means keeping responsibilities and UI state clear; it does not
  mean implementing a generic category or dynamic-form framework in advance.

### Lesson

Minimising the first implementation is different from limiting the final user
experience. A feature can be deliberately sequenced after the first vertical
slice while still influencing small, concrete design choices from the start.

## 2026-09-04 - Choosing how sellers edit suggestions

### Alternatives discussed

1. Show title, tags, and price as editable fields immediately.
2. Present the suggestions in a readable form and let the seller activate an
   explicit edit mode.

### Decision

Use the second option. Suggestions should initially be easy to scan, with a clear
`Edit` action that turns them into editable values.

### Reason and trade-off

This keeps the result visually clear and communicates that the AI has produced a
suggestion, while still leaving the seller in control. It adds an explicit step
compared with always-editable fields, but avoids making the result area look like
another form before the seller decides to change anything.

## 2026-09-04 - Agreeing on incremental scope

### Happy path discussed

The proposed seller journey is: open the single page, enter a guided free-form
description, generate suggestions, review the title, tags, and estimated price,
then optionally copy, edit, or regenerate them.

### Decision

Start from the basic end-to-end flow and add only a small number of useful
features. Further ideas should be implemented incrementally when their behaviour
is understood.

The code should remain reasonably easy to extend, but we will not introduce
abstractions solely for hypothetical features. In particular, optional fields,
category-specific inputs, and regeneration informed by seller edits remain open
possibilities rather than current requirements.

### Next topic

Define how the product responds to invalid seller input and unexpected seller
interactions before discussing failures from the AI provider.

## 2026-09-04 - Treating insufficient input as a product state

### Problem

A description can be non-empty but still contain too little relevant information
to support a credible title, tag set, and especially a price estimate. Character
count alone cannot distinguish a concise useful description from a longer
meaningless one.

### Alternatives discussed

1. Accept every non-empty description and always attempt a result.
2. Require an arbitrary minimum number of characters.
3. Represent insufficient information as an expected outcome and ask the seller
   for more relevant details.

### Decision

Use the third option. The application must maintain a consistent result: when the
description is insufficient or nonsensical, it should not display a title, tags,
or price range as if they were reliable.

This is an expected product state rather than a provider or system error. The
seller keeps the original description and can improve it before trying again.

### Reason and trade-off

Avoiding an unsupported price estimate is more trustworthy than always returning
an answer. This requires the future API contract and UI to distinguish a valid
suggestion from a request for more information, but it avoids relying on an
arbitrary length check.

## 2026-09-04 - Refining input quality beyond a binary outcome

### User counterexample

The user challenged the previous binary distinction with two materially
different descriptions:

- `Renault Twingo` identifies a product but omits year, mileage, and condition.
- `Nice thing I have in the garage` does not identify a sellable product well
  enough to support meaningful suggestions.

The user proposed returning suggestions and a clearly qualified price estimate
for the first case, while declining to produce a price for the second.

### Revised decision

Distinguish three product outcomes:

1. sufficient information: show the complete suggestions normally;
2. limited information: show complete suggestions with a clear warning that the
   price estimate is based on few details;
3. insufficient or nonsensical information: do not show title, tags, or price and
   ask the seller to describe the item more clearly.

An insufficient description remains an expected product state, not a technical
system error.

### Why the proposal changed

The earlier all-or-nothing rule treated identifiable but incomplete products the
same as meaningless input. The counterexample showed that this would reject a
potentially useful result. Three explicit outcomes preserve usefulness without
presenting every estimate with the same apparent confidence.

### Scope guardrail

Do not introduce a numeric confidence score or a large category-specific rules
engine. The distinction should remain understandable in the UI and testable with
a small set of representative behaviours.

### Clarification from the user

Limited information must not become a blocking condition. If the application can
identify approximately what is being sold, it should still generate title, tags,
and a price range. A non-blocking tip should explain that the price is especially
indicative because important details are missing.

Only input that does not identify a sellable item well enough should produce the
`needs more information` outcome. This keeps the assistant useful even when the
model is not powerful enough to assess input quality with high confidence.

## 2026-09-04 - Moving forward with an 80 percent product definition

### User direction

The user decided that the team has enough of the core experience defined to begin
implementation soon. The remaining details should be decided incrementally while
keeping the code understandable and reasonably open to change.

The user explicitly rejected adding complexity now for possibilities such as
language handling or category-specific behaviour. Comfort for the seller remains
important, but simplicity is the primary scope constraint.

### Documentation decision

Create two working references under `AI_resources`:

- `Functionalities.md` for agreed functionality, planned increments, possible
  extensions, and open decisions;
- `Incorrect_Inputs.md` for seller input and interaction cases that must remain
  visible during development.

These files support implementation and memory. They do not replace the
chronological decision record in this document or the final `AI_JOURNEY.md`.

## 2026-09-04 - Selecting the initial technology stack

### Problem

Choose among the frontend and backend technologies allowed by the assignment
while prioritising simplicity, future modification, testing, and the ability to
explain and change the application live.

### Alternatives discussed

- React and Node.js with TypeScript throughout;
- Angular and Node.js with TypeScript;
- React and a Kotlin/Ktor backend.

The AI recommended React, Vite, Node.js, Express, and TypeScript. It also compared
a single npm project with separated source folders against two independent npm
projects.

### User decision

The user accepted the JavaScript ecosystem for this assignment despite not
personally liking JavaScript very much. The reduced context switching and lower
setup cost were considered more important here than language preference.

The user also selected one npm project with source code separated into:

```text
src/
  frontend/
  backend/
```

### Reason and trade-off

React and Node.js keep the implementation and live-modification workflow small,
while TypeScript provides useful static contracts on both sides. Angular or
Kotlin could offer more built-in structure, but would add concepts and tooling
that the current one-screen, one-endpoint product does not need.

The single-package layout reduces setup while preserving a visible frontend and
backend boundary. It accepts some shared project configuration instead of the
stronger isolation of two packages.

### Next decision

Define the AI boundary carefully. In particular, decide how real and mock model
access can share the same parsing and validation path so that malformed mock
output tests the real trust boundary rather than bypassing it.

## 2026-09-04 - Confirming the AI trust boundary

### Clarification needed

The phrase `untrusted output` initially caused confusion. It sounded as though
the application had to choose between supporting valid output and supporting the
required broken mock output.

### Clarification reached

`Untrusted` is the state of every raw model payload before validation, not a
separate response mode. Real and mock generation can each produce valid or
invalid data. Valid application outcomes include complete suggestions, limited
information with a warning, and a request for more information. Malformed data or
impossible field combinations are invalid model output.

### Decision

- Mock mode replaces only model access.
- Real and mock payloads go through the same parser and validator.
- Mock mode must run the whole application without an API key.
- Mock configuration must reproduce a valid payload and an invalid payload.
- Parsing uses structural checks and small deterministic domain invariants.
- Do not add a second AI judge or a speculative semantic rules engine.

### Reason and trade-off

This boundary makes the failure simulation meaningful: malformed mock data tests
the same trust boundary used in real mode. It adds one small function-level
abstraction, justified by the explicit real/mock requirement. Deterministic
validation cannot detect every plausible but irrelevant AI answer, and that
limitation is accepted rather than hidden behind unreliable heuristics.

### Proposed implementation sequence

1. Build the smallest end-to-end flow with a valid mock payload.
2. Add shared parsing and validation.
3. Add the invalid mock scenario and its user-facing behaviour.
4. Add the real provider behind the same boundary.

### Milestone

The architectural direction is now sufficiently defined to begin incremental,
behaviour-first implementation. API details, validation tooling, provider choice,
and tests will be decided when their first concrete behaviour is introduced.

## 2026-09-04 - First backend behaviour with a valid mock

### Objective

Build the smallest backend behaviour for a valid seller description using mock
model output, following a lightweight red-green TDD cycle.

### Testing decision

The user accepted Vitest as the common test runner for backend and future React
tests. Supertest is used only as an HTTP helper for exercising the Express app in
memory. The user considered the extra development dependencies worthwhile because
one runner reduces overall project complexity.

Type checking remains a separate command because Vitest transforms TypeScript but
does not replace `tsc` static analysis.

### Behaviour specified

Given a valid description and the valid mock model, `POST
/api/listing-suggestions` returns HTTP 200 with:

- status `complete`;
- a non-empty title;
- 3-5 unique tags;
- a numeric EUR price range whose minimum is not greater than its maximum.

The test protects the response behaviour and invariants rather than the exact
wording of the deterministic mock title.

### Red phase

The first test run failed because `src/backend/app.ts` did not exist. Vitest
started correctly and reported the missing application module, which was the
expected reason for failure before implementation.

### Minimal implementation

The implementation added:

- an Express application exposing the single route;
- a small application function coordinating generation;
- a function-level model gateway type;
- a valid mock model returning a raw JSON payload.

The implementation intentionally does not yet include runtime input validation,
invalid model-output validation, environment-based model selection, or a listening
server. Those behaviours will be introduced only with their corresponding tests.

### Green phase

The endpoint test passed, and `tsc --noEmit` completed without errors.

### Lesson

Separating the Express application from the listening process made the first HTTP
behaviour testable without a real port. Returning raw JSON from the mock also
preserved the agreed trust boundary for the next parsing and validation step.

### User review before committing

The user accepted the first slice but flagged that some units already appear to
carry several responsibilities. The current code uses functions rather than
classes, but the concern applies particularly to `generateListingSuggestions`,
which currently builds a prompt, calls the gateway, and parses the response.

We decided not to refactor speculatively before the next behaviour. Instead, this
is recorded as an explicit watchpoint: input validation and invalid model-output
handling must not turn the function into a catch-all. The next tests should reveal
whether parsing and validation deserve their own focused unit.

## 2026-09-04 - Rejecting a blank seller description

### Behaviour specified

An empty or whitespace-only description is an invalid HTTP request. `POST
/api/listing-suggestions` must return HTTP 400 with the stable error code
`INVALID_DESCRIPTION` and must not call the model gateway.

The user and AI chose a direct `typeof` and `trim` check in the Express route. A
runtime-schema library was not introduced for this single field because its cost
is not yet justified. Trimming is used only to validate the value, not to rewrite
the seller's original description.

### Red phase

The new endpoint test received HTTP 200 instead of 400, confirming that the
existing route passed whitespace directly into the generation flow.

### Green phase

The route now rejects missing, non-string, empty, and whitespace-only
descriptions before calling the model. Both endpoint tests pass and `tsc
--noEmit` completes without errors.

### Scope decision

This increment covers only obviously blank input. Semantically insufficient input
and invalid model output remain separate behaviours to introduce with their own
tests. With one valid and one invalid-request path working, the next increment can
start exposing the flow in the frontend without pretending the backend is
complete.

### Test organisation decision

The user proposed separating happy-path, input-handling, advanced-function, and
regression tests into different test files, following experience with JUnit. We
agreed on behaviour-based separation as suites grow, but not on creating files
that would currently contain only one test. Small suites stay co-located and use
`describe` groups; focused function tests get their own file, and regression
tests stay beside the behaviour they protect.

## 2026-09-04 - First minimal frontend slice

### Objective

Expose the two implemented behaviours in a minimal seller interface: reject a
blank description immediately and display complete suggestions for a valid one.

### Decisions

The user chose frontend validation for fast feedback while keeping the backend as
the source of truth. A blank submit therefore shows `Description is required.`
without making a request, while the API independently enforces the same rule for
other clients.

For testing, the user selected React Testing Library with jsdom instead of manual
testing only or a full Playwright setup. The component tests exercise accessible
controls and visible outcomes rather than component internals. The HTTP call and
its types live in a small separate module so the component remains focused on UI
state and rendering.

### Red phase

The first frontend run failed because `App.tsx` did not exist. This was the
expected initial failure after specifying the two behaviours.

### Unexpected test setup issue

After the first implementation, the blank-input test passed but the valid-input
test found duplicate copies of the interface. Automatic cleanup was not active in
the current Vitest setup, so rendered DOM leaked between tests and created
duplicate IDs. Adding explicit React Testing Library `cleanup()` in `afterEach`
fixed the isolation issue.

### Verification

- two backend and two frontend tests pass;
- `tsc --noEmit` passes after adding Vite's CSS import type reference;
- the production Vite build succeeds;
- Vite and the mock-backed Express server run together through one development
  command;
- desktop and narrow-layout screenshots were inspected without finding overlaps.

The first sandboxed development-server attempt caused `tsx` to fail while reading
Windows user information. Running the same command with normal local permissions
started both processes successfully, showing that this was an execution-environment
constraint rather than an application failure.

### Scope kept open

The development server currently selects the valid mock directly. Environment
selection between valid mock, invalid mock, and a real provider remains a later
backend behaviour and was not folded into this UI increment.

## 2026-09-04 - Making the AI boundary modular and trustworthy

### User direction

Before adding the real provider, the user emphasised that the code should depend
on useful abstractions and remain modular, without becoming generic or dominated
by dependencies that exist only for this task.

### Decision

Use abstractions only where change is already required. Model access keeps its
injected function boundary because real and mock implementations must coexist.
Output parsing becomes a concrete pure function, not another injected interface.
The application result type moves to `src/shared` to remove the real risk of
frontend and backend definitions diverging.

A manual validator was chosen over adding a schema library. The output contract
is currently small enough to keep its structural and domain checks explicit and
easy to modify live.

### TDD result

The red run failed for the expected reasons: the parser module did not exist and
malformed model JSON produced HTTP 500 instead of the chosen 502 response. The
implementation then added the shared contract, parser, focused error type, and
route mapping.

Parser tests cover valid output, malformed JSON, blank titles, invalid tag counts,
case-insensitive duplicate tags, inverted prices, and unsupported currency. The
endpoint test protects the stable `INVALID_MODEL_OUTPUT` response. All 12 tests,
the TypeScript check, and the production frontend build pass.

### Useful correction

After moving the result type, TypeScript detected that the React component still
imported it through the HTTP module. Importing the type directly from the shared
contract completed the intended dependency direction without adding a re-export.

## 2026-09-05 - Selecting the mock scenario from the environment

### Small-step boundary

The user explicitly asked to proceed in smaller increments. The first step moved
the malformed response from an inline test function into a real
`invalidMockModel`, while leaving environment selection and UI behaviour out.

The second step added only a pure `selectMockModel` function and connected it to
the development server. `MOCK_SCENARIO` accepts `valid` or `invalid`, defaults to
`valid` when absent, and rejects unknown values at startup.

### TDD result

The first run failed because the selector did not exist. After adding the small
switch and updating the server, all 15 tests and the TypeScript check passed.

No environment-file loader, cross-platform helper script, real-provider selector,
or new abstraction was added. The next behaviour remains displaying the invalid
mock outcome clearly in the frontend while preserving the seller's description.

### Frontend error verification

A focused React test then simulated the backend's `INVALID_MODEL_OUTPUT`
response. It passed on its first run: the existing generic request-error state
already displayed the backend message, preserved the seller's description, and
rendered no suggestion result. No production UI change was needed, so the new
test records and protects existing behaviour rather than manufacturing a code
change for the sake of TDD.

## 2026-09-05 - Implementing the three product outcomes

### Contract decision

The user accepted a TypeScript discriminated union in which `status` determines
the fields available to the application:

- `complete` has title, tags, and price range;
- `limited` has the same suggestions plus a non-blocking tip;
- `needs_more_information` has only a seller-facing message.

This prevents an unidentifiable item from accidentally carrying an invented
price in the application type. The parser validates each branch at runtime
because model output remains untrusted despite the TypeScript contract.

### Useful compiler feedback

After the parser tests for `needs_more_information` passed, TypeScript found that
the React component still accessed title, tags, and price without checking the
status. The UI was updated to render the message branch explicitly. This was a
real example of the discriminated union exposing an incomplete consumer that
runtime parser tests alone did not reveal.

### Limited price decision

The user requested a wider price range when important item details are missing.
We considered letting the backend expand the range by a fixed percentage, but
rejected it because the appropriate uncertainty differs substantially between
cars, clothing, and electronics.

The model will instead be instructed to return a conservative, wider range for
`limited`. The backend validates only that the numbers form a coherent EUR range,
and the UI displays both that range and the model-generated tip. Deterministic
mock scenarios now expose `limited` and `needs_more_information` so both outcomes
can be exercised without a real provider.

## 2026-09-05 - Changing the real provider to Groq

### Trigger

The user has ChatGPT Plus but no OpenAI API key or API credit. The AI clarified
that the ChatGPT subscription and API usage are separate, so the planned OpenAI
call could not be tested with the existing subscription.

### Alternatives and decision

We compared paid OpenAI API access, a free cloud provider, and a local model. A
local model would make reviewer setup heavier. Gemini offers a free tier but
would require another SDK and has a free-tier data-use trade-off. The user chose
Groq with `openai/gpt-oss-20b`: it provides sufficient free limits, structured
output support, and an OpenAI-compatible API.

The existing model boundary means this provider change remains isolated from the
route, parser, shared result contract, and UI. The real adapter will use
`GROQ_API_KEY` only on the backend, while mock mode will remain the default path
that works without credentials.

### Process correction

The AI installed the `openai` SDK before all provider decisions had been
confirmed. The user reminded the AI to ask before proceeding with significant
choices. No provider source module had been added, and the dependency remains
usable because Groq officially supports the OpenAI-compatible client, but the
sequence was still premature. Subsequent decisions were discussed and confirmed
before implementation.

## 2026-09-05 - Simplifying the Groq integration

### Gateway refinement

The model gateway originally accepted a prebuilt prompt string. The user agreed
that it should instead receive the small application-owned object
`{ description }`. A focused test first exposed the old prompt argument, then the
application function was changed to forward the object unchanged. Prompt
construction now belongs exclusively to the provider adapter.

### Structured-output proposal challenged

The AI initially proposed Groq strict Structured Outputs with an `anyOf` wrapper
around the three result variants. The user questioned whether this added too much
for the assignment. On review, the wrapper and a second full schema duplicated
the manual parser already protecting the untrusted-output boundary.

The proposal was simplified to Chat Completions with JSON Object Mode. The prompt
describes the three valid shapes and the existing parser enforces them. This
accepts a higher chance that a real response is rejected, but the application
already maps invalid model output safely and the design is substantially easier
to explain and modify.

### Price accuracy clarification

The user asked whether the model compares current market values. The current
design does not query live Wallapop listings or another comparable-sales source.
It produces an indicative range from the seller details and the model's learned
general knowledge. Adding live search or marketplace data would require another
external dependency, data-quality decisions, and category-specific comparison
logic outside the requested scope.

We chose to state this limitation honestly: all prices are estimates, limited
input receives a wider model-generated range and tip, and no price is shown when
the item cannot be identified.

### Configuration behaviour

`MODEL_PROVIDER` now selects `mock` or `groq`, with mock as the no-key default.
When Groq is explicitly selected, a missing or blank `GROQ_API_KEY` stops startup
with a clear error. A silent fallback was rejected because it could make a
developer believe the real integration was running when the response was
actually deterministic mock data.

## 2026-09-05 - First real Groq calls

### Environment setup correction

The local `.env` is ignored by Git and contains the selected provider and the
developer's private Groq key. The first attempt placed Node's optional env-file
flag before `tsx watch`; `tsx` then interpreted `watch` as a script filename.
The command was corrected to use Node as the launcher with `tsx` as a loader.

Node watch mode also reacted to OneDrive changes under `node_modules`, repeatedly
restarting the backend and interrupting a request. Restricting watch paths did not
stop dependency-file events in this setup, so backend watch mode was removed.
This is simpler and stable; backend changes require restarting `npm run dev`,
while Vite still reloads frontend changes.

### Model behaviour and prompt refinement

The first real request used the short description `iPhone`. Groq responded with
`needs_more_information`, contradicting the agreed rule that any recognizable
item should produce non-blocking `limited` suggestions. The prompt was clarified
with explicit `iPhone`, `Renault Twingo`, and vague-description examples.

The next response correctly selected `limited` but omitted `currency` from the
price range. The common parser rejected it and the endpoint returned the stable
invalid-model-output response. A temporary local output log identified the exact
missing field and was removed immediately. The prompt now states the three exact
JSON shapes, including `currency: "EUR"`.

A detailed Renault Twingo description was then classified as `limited` because
the model asked for the seller's desired price. This was also inconsistent with
the product: estimating that price is the assistant's responsibility. The prompt
now explicitly forbids requiring an asking price and treats model, year, mileage,
and condition as sufficient car details.

### Verified outcome

After the refinements, real calls produced all three expected branches:

- `iPhone` produced `limited` with a wider EUR range and a details tip;
- a Renault Twingo with year, mileage, and condition produced `complete`;
- `Something from my garage` produced `needs_more_information` without a price.

These failures were not manufactured for documentation. They demonstrate why
real-model testing, explicit product examples, and runtime validation remain
useful even when JSON Object Mode produces syntactically valid JSON.

### Reducing repeated-call variability

During manual UI testing, the user observed that identical descriptions could
produce materially different outcomes. We clarified that model size can affect
quality, but sampling randomness is the more direct cause of variation between
otherwise identical requests.

The Groq request now sets `temperature: 0.5` and `seed: 42`. Lower temperature
reduces randomness, while the fixed seed requests reproducible sampling. This is
a deliberate fit for a listing assistant, where consistency matters more than
creative variety. Groq describes seeded determinism as best effort, so the
application does not assume byte-for-byte stability across model updates.

Three consecutive real requests with the same `iPhone` description all returned
the expected `limited` outcome, a minimum of EUR 200, and a tip explaining the
missing details. The maximum still varied between EUR 800 and EUR 1,000 and the
tags were not identical. The configuration therefore improves product-level
consistency without claiming exact determinism from the external model.

## 2026-09-06 - Handling temporary model failures

After completing the real Groq path, the user agreed that the next small
increment should protect the UI from provider failures such as network errors or
rate limits. A new endpoint test first demonstrated the existing generic HTTP
500 response.

The generation route now keeps invalid AI output separate as
`INVALID_MODEL_OUTPUT` with HTTP 502 and maps other generation failures to the
stable `MODEL_UNAVAILABLE` response with HTTP 503. The frontend already rendered
the backend message, preserved the description, and allowed another submission,
so its existing error-path test covered the required interaction without adding
a duplicate test. We deliberately did not introduce provider-specific exception
classes while the generation flow has only one external failure source.

## 2026-09-06 - Preventing stale suggestions

The user raised the case where a seller edits the description after receiving a
result or submits the same description again. We considered keeping the previous
result with a stale marker, but chose the simpler behaviour: previous suggestions
are removed as soon as the description changes and whenever a new request starts.

Two frontend tests cover both transitions. The implementation only resets the
existing React state and does not add result history, extra status variants, or
new components. If generation fails, the current description and retryable error
remain visible without presenting the old result as current.

## 2026-09-06 - Setting a description limit

The user accepted a 2,000-character maximum and asked for the limit to remain
visible as useful information in the interface. The limit is held in the shared
contract so the React UI and Express validation cannot acquire separate values.

The UI displays a live character count, preserves text beyond the limit, shows
an inline error, and disables generation until the description is corrected.
The backend independently rejects overlong input with HTTP 400 and
`DESCRIPTION_TOO_LONG` before calling the model. Unicode code points are counted
instead of JavaScript UTF-16 code units so common emoji are not counted twice.

## 2026-09-06 - Improving titles and search tags

The user observed that generated titles could be too generic and tags often
looked like individual words copied from the title. Wallapop's own seller
guidance recommends descriptive, precise titles. We agreed to improve the model
instructions before considering deterministic post-processing.

The prompt now asks for concise factual titles built from product identity and
available distinguishing details. Tags should be meaningful search concepts,
keep compound identities together, complement the title, avoid repeated
near-synonyms, and use one language. Mock results were aligned with that intent.

Real Groq checks showed a meaningful but imperfect improvement. A detailed
iPhone description produced an Italian factual title and compound tags, while a
sparse `Renault Twingo` input still produced some generic tags. A Nike example
kept useful phrases but also returned bare size and color values despite the
instruction. We chose not to add brittle category-independent filtering or a
second AI call: some attribute tags remain useful, and semantic quality cannot
be guaranteed by structural validation. This limitation is intentionally visible
rather than hidden behind extra architecture.

The user then identified a concrete weak tag: `2012` was returned alone for a
Mercedes. We added examples requiring attribute tags to carry product context,
such as `auto del 2012` and `scarpe taglia 42`. A repeated real request for
`Mercedes AMG 2012 grigio elettrico` returned `auto 2012`, confirming the desired
improvement for that case. The same response still mixed languages in its tip,
which reinforces that prompt constraints improve but do not guarantee semantic
model behaviour.

## 2026-09-06 - Reducing the description limit

After trying the interface, the user considered the initial 2,000-character
maximum unnecessarily high. Wallapop's public seller guidance encourages a
detailed description but does not state an announcement-description maximum.
We therefore treated this as an application-specific boundary and reduced it to
1,000 Unicode characters, enough for useful listing details while keeping model
input and latency proportionate. The shared constant keeps the existing frontend
and backend behaviour aligned.

## 2026-09-06 - Making current limitations reviewer-visible

After pushing the latest functional increment, the user asked that the current
limits be documented while keeping language consistency and search-tag quality
on the pre-delivery polish list. We added a concise README section covering the
lack of live market data, best-effort model consistency, occasional language
drift, prompt-guided tag quality, and deliberately deferred product features.
These are presented as current constraints rather than excuses, and generated
suggestions remain explicitly subject to seller review.

## 2026-09-06 - Keeping secondary defects out of search tags

The user tested a PS5 bundle with GTA 5, Dark Souls, and two controllers, one of
which had a broken right analog stick. Groq initially returned
`controller con analogico destro difettoso` as a tag. The title was useful, but
the tag described a secondary defect rather than a plausible buyer search.

We refined the prompt so tags focus on how buyers discover the main item or
bundle. Secondary defects remain available for an honest title or description
but are excluded from tags. The rule keeps an exception when the main item is
explicitly sold as non-working or for parts. Repeating the original input against
Groq produced `PlayStation 5`, `bundle PS5`, `console con giochi`, `GTA 5`, and
`Dark Souls`, while preserving the controller defect in the title.

## 2026-09-06 - Copying the generated title

Before committing the prompt and limitation documentation, the user requested a
small on-screen action to make the generated title easy to reuse. We added a
`Copy title` button beside complete and limited result titles. It writes only the
title through the browser Clipboard API and changes to `Copied` after success.
Clipboard failure reuses the existing visible request-error area rather than
introducing another notification system. A focused frontend test verifies the
copied value and confirmation state.
