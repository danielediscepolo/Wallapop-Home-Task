import { describe, expect, it } from "vitest";

import {
  invalidMockModel,
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

  it("rejects an unsupported scenario", () => {
    expect(() => selectMockModel("unexpected")).toThrow(
      "Unsupported MOCK_SCENARIO: unexpected",
    );
  });
});
