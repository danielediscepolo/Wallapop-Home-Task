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
