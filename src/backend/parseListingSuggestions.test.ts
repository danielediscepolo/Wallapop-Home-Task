import { describe, expect, it } from "vitest";

import {
  InvalidModelOutputError,
  parseListingSuggestions,
} from "./parseListingSuggestions";

const validOutput = {
  status: "complete",
  title: "Renault Twingo in good condition",
  tags: ["renault", "twingo", "city car"],
  priceRange: {
    min: 2500,
    max: 4000,
    currency: "EUR",
  },
};

describe("parseListingSuggestions", () => {
  it("returns a complete result for valid model output", () => {
    expect(parseListingSuggestions(JSON.stringify(validOutput))).toEqual(
      validOutput,
    );
  });

  it.each([
    ["malformed JSON", "{not-json"],
    ["an empty title", { ...validOutput, title: "   " }],
    ["fewer than three tags", { ...validOutput, tags: ["renault"] }],
    [
      "duplicate tags",
      { ...validOutput, tags: ["renault", "Renault", "city car"] },
    ],
    [
      "an inverted price range",
      { ...validOutput, priceRange: { ...validOutput.priceRange, min: 5000 } },
    ],
    [
      "a different currency",
      { ...validOutput, priceRange: { ...validOutput.priceRange, currency: "USD" } },
    ],
  ])("rejects %s", (_caseName, output) => {
    expect(() => parseListingSuggestions(output)).toThrow(
      InvalidModelOutputError,
    );
  });
});
