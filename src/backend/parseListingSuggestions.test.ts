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

  it("returns a limited result with a non-blocking tip", () => {
    const limitedOutput = {
      ...validOutput,
      status: "limited",
      tip: "Add year, mileage and condition for a more accurate price.",
    };

    expect(parseListingSuggestions(JSON.stringify(limitedOutput))).toEqual(
      limitedOutput,
    );
  });

  it("asks for more information when no sellable item can be identified", () => {
    const needsMoreInformationOutput = {
      status: "needs_more_information",
      message: "Describe the item you want to sell more clearly.",
    };

    expect(
      parseListingSuggestions(JSON.stringify(needsMoreInformationOutput)),
    ).toEqual(needsMoreInformationOutput);
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
    [
      "a limited result without a tip",
      { ...validOutput, status: "limited", tip: "   " },
    ],
    [
      "a request for more information without a message",
      { status: "needs_more_information", message: "   " },
    ],
  ])("rejects %s", (_caseName, output) => {
    expect(() => parseListingSuggestions(output)).toThrow(
      InvalidModelOutputError,
    );
  });
});
