# Functionalities

This document captures the current product direction for the Wallapop Listing
Assistant. It is a working reference, not a fixed specification. The goal is to
define enough of the experience to start building while keeping later decisions
easy to change.

## Product goal

Help a seller turn a rough description of an item into a more useful listing by
suggesting:

- an improved title;
- 3-5 search tags;
- an estimated price range.

The experience should remain comfortable for different product categories
without requiring the seller to complete a long or category-specific form.

## Agreed seller flow

1. The seller opens a single-page assistant.
2. The seller enters a free-form description.
3. Short guidance suggests useful details such as brand, model, condition,
   defects, size, year, or mileage when relevant.
4. The seller requests suggestions.
5. The description remains visible while suggestions are generated.
6. The seller receives a title, 3-5 tags, and an estimated price range.
7. The seller can later copy, edit, or regenerate the suggestions.

## First vertical slice

The first working version should include only:

- one guided free-form description field;
- one generate action;
- a visible loading state that prevents duplicate submissions;
- a complete result containing title, 3-5 tags, and price range;
- clear indication that the price is an estimate;
- preservation of the seller's description throughout the interaction.

## Expected product outcomes

### Complete information

Show the complete suggestions with the normal estimated-price indication.

### Identifiable product with limited information

Still show title, tags, and price. Add a non-blocking tip explaining that the
price is especially approximate because relevant details are missing.

Examples include a description such as `Renault Twingo` without year, mileage,
or condition.

### Unidentifiable product

Do not invent title, tags, or price. Keep the description editable and ask the
seller to explain clearly what is being sold.

This is an expected product state, not a technical error.

## Planned product features

These features are intended for later increments, after the first vertical slice:

- copy individual suggestions;
- activate an explicit edit mode for title, tags, and price;
- save or cancel local edits;
- regenerate suggestions from the current description;
- provide clearer input guidance when more useful details could be added.

Results should initially be easy to scan. They become editable only after the
seller chooses the `Edit` action.

## Possible later extensions

These are possibilities, not committed functionality:

- optional generic fields such as brand, model, or condition;
- optional fields selected by the seller;
- category-specific fields;
- contextual suggestions about missing product details;
- regeneration that considers edits made to a previous result;
- result history or persistence.

The implementation should not make these changes unnecessarily difficult, but it
should not build a generic category or form system before one is needed.

## Assignment constraints to preserve

- one frontend screen;
- one backend endpoint;
- AI-generated suggestions;
- environment-controlled mock mode that works without an API key;
- mock responses for both valid and malformed or nonsensical AI output;
- meaningful tests focused on behaviour;
- clear README and an evidence-based `AI_JOURNEY.md`;
- scope proportional to approximately 4-6 hours.

## Still open

- the exact character limit for the description;
- the exact wording of guidance and limited-information tips;
- whether output language follows the input language;
- what happens to existing suggestions when the description changes;
- the precise edit and regeneration interactions;
- the API contract, validation rules, stack, provider, and test strategy.

