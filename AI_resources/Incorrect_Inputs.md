# Incorrect Inputs

This document records seller inputs and interactions that the implementation
should handle deliberately. It does not define AI-provider or infrastructure
failures, which will be considered separately.

## Guiding rule

Bias towards helping the seller. If an item can be identified, generate the
suggestions even when details are limited and qualify the price estimate with a
non-blocking tip. Stop only when the application cannot understand what is being
sold well enough to provide meaningful suggestions.

Do not use an arbitrary minimum character count to judge meaning. A short input
such as `PS5` can be useful, while a longer sentence can still be meaningless.

## Inputs to handle

| Seller input or action | Intended behaviour |
| --- | --- |
| Empty or whitespace-only description | Do not allow generation. |
| Description over the maximum length | Preserve the text, show the limit clearly, and do not allow generation until corrected. |
| Short but identifiable product | Generate suggestions; use the limited-information tip when appropriate. |
| Identifiable product missing relevant details | Generate all suggestions and warn that the price is especially approximate. |
| Meaningless or unrelated text | Do not generate a fabricated result; ask for a clearer item description. |
| Only a URL | Do not assume the application can open it; ask the seller to describe the item. |
| Emoji, accents, punctuation, or line breaks | Accept them as normal text. |
| HTML or script content | Treat it only as text and never execute or render it as markup. |
| Instructions directed at the AI | Do not let them override the listing task; generate only when a product remains identifiable. |
| Phone number, email, or other personal data | Do not reproduce personal data in the generated title, tags, or price. |
| Seller's desired price | Do not treat it automatically as evidence of market value. |
| Multiple items described as a clear bundle | Treat the bundle as the item being sold. |
| Several unrelated or ambiguous items | Ask the seller to clarify what the listing should represent. |
| Contradictory product details | Avoid pretending the estimate is precise; prefer the limited-information outcome. |
| Repeated generate clicks | Accept only one request while generation is in progress. |
| Description edited after generation | Existing suggestions must not silently appear current; exact UX remains open. |

## Implementation guardrails

- Trim only for validation; do not silently rewrite the seller's description.
- Never silently truncate pasted text.
- Preserve the description when the seller needs to correct it.
- Keep validation behaviour consistent between frontend and backend.
- Render all seller and AI text safely as plain content.
- Do not create separate UI errors for every example above; map them to a small,
  consistent set of product states.
- Treat insufficient input differently from technical failures.

## Deliberately not designed yet

- marketplace policy enforcement for prohibited products;
- a category taxonomy or category-specific validation engine;
- automatic inspection of external URLs;
- a numeric confidence score;
- persistence across page refreshes;
- exact multilingual behaviour.

