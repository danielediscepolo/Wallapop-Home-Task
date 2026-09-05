import { describe, expect, it, vi } from "vitest";

import { generateListingSuggestions } from "./generateListingSuggestions";

describe("generateListingSuggestions", () => {
  it("passes the seller description to the model as application input", async () => {
    const generateModelOutput = vi.fn(async () => ({
      status: "complete",
      title: "Renault Twingo 2018 in good condition",
      tags: ["renault", "twingo", "used car"],
      priceRange: {
        min: 5_000,
        max: 7_000,
        currency: "EUR",
      },
    }));

    await generateListingSuggestions(
      "Renault Twingo 2018, 70000 km, in good condition",
      generateModelOutput,
    );

    expect(generateModelOutput).toHaveBeenCalledWith({
      description: "Renault Twingo 2018, 70000 km, in good condition",
    });
  });
});
