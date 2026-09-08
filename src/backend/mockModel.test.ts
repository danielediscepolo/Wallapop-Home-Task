import { describe, expect, it } from "vitest";

import {
  invalidMockModel,
  limitedMockModel,
  needsMoreInformationMockModel,
  selectMockModel,
  validMockModel,
} from "./mockModel";

describe("selectMockModel", () => {
  it("uses the valid scenario by default", async () => {
    expect(selectMockModel(undefined)).toBe(validMockModel);
    expect(selectMockModel("valid")).toBe(validMockModel);

    const rawOutput = await validMockModel({
      description: "Vintage leather jacket, worn once, size M",
    });

    expect(JSON.parse(String(rawOutput))).toEqual({
      status: "complete",
      title: "Vintage leather jacket size M, worn once",
      tags: [
        "vintage leather jacket",
        "size M jacket",
        "leather outerwear",
      ],
      priceRange: { min: 60, max: 120, currency: "EUR" },
    });
  });

  it("selects the configured invalid scenario", () => {
    expect(selectMockModel("invalid")).toBe(invalidMockModel);
  });

  it("selects the configured limited scenario", async () => {
    expect(selectMockModel("limited")).toBe(limitedMockModel);

    const rawOutput = await limitedMockModel({
      description: "Renault Twingo",
    });
    expect(typeof rawOutput).toBe("string");

    if (typeof rawOutput !== "string") {
      throw new Error("Expected the mock model to return a JSON string.");
    }

    const output = JSON.parse(rawOutput);

    expect(output).toMatchObject({
      status: "limited",
      priceRange: { min: 1_500, max: 5_000, currency: "EUR" },
      tip: "This price range is wider because year, mileage, and condition are missing. Add those details for a more accurate estimate.",
    });
  });

  it("selects the configured needs-more-information scenario", async () => {
    expect(selectMockModel("needs_more_information")).toBe(
      needsMoreInformationMockModel,
    );

    const rawOutput = await needsMoreInformationMockModel({
      description: "Something from my garage",
    });
    expect(typeof rawOutput).toBe("string");

    if (typeof rawOutput !== "string") {
      throw new Error("Expected the mock model to return a JSON string.");
    }

    const output = JSON.parse(rawOutput);

    expect(output).toEqual({
      status: "needs_more_information",
      message:
        "Describe the specific item you want to sell so we can suggest a title, search tags, and price range.",
    });
  });

  it("rejects an unsupported scenario", () => {
    expect(() => selectMockModel("unexpected")).toThrow(
      "Unsupported MOCK_SCENARIO: unexpected",
    );
  });
});
