import { describe, expect, it } from "vitest";

import {
  invalidMockModel,
  limitedMockModel,
  needsMoreInformationMockModel,
  selectMockModel,
  validMockModel,
} from "./mockModel";

describe("selectMockModel", () => {
  it("uses the valid scenario by default", () => {
    expect(selectMockModel(undefined)).toBe(validMockModel);
    expect(selectMockModel("valid")).toBe(validMockModel);
  });

  it("selects the configured invalid scenario", () => {
    expect(selectMockModel("invalid")).toBe(invalidMockModel);
  });

  it("selects the configured limited scenario", async () => {
    expect(selectMockModel("limited")).toBe(limitedMockModel);

    const rawOutput = await limitedMockModel({ description: "" });
    expect(typeof rawOutput).toBe("string");

    if (typeof rawOutput !== "string") {
      throw new Error("Expected the mock model to return a JSON string.");
    }

    const output = JSON.parse(rawOutput);

    expect(output).toMatchObject({
      status: "limited",
      priceRange: { min: 1_500, max: 5_000, currency: "EUR" },
      tip: expect.any(String),
    });
  });

  it("selects the configured needs-more-information scenario", async () => {
    expect(selectMockModel("needs_more_information")).toBe(
      needsMoreInformationMockModel,
    );

    const rawOutput = await needsMoreInformationMockModel({ description: "" });
    expect(typeof rawOutput).toBe("string");

    if (typeof rawOutput !== "string") {
      throw new Error("Expected the mock model to return a JSON string.");
    }

    const output = JSON.parse(rawOutput);

    expect(output).toEqual({
      status: "needs_more_information",
      message: expect.any(String),
    });
  });

  it("rejects an unsupported scenario", () => {
    expect(() => selectMockModel("unexpected")).toThrow(
      "Unsupported MOCK_SCENARIO: unexpected",
    );
  });
});
