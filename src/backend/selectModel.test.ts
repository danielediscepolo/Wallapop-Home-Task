import { describe, expect, it } from "vitest";

import { validMockModel } from "./mockModel";
import { selectModel } from "./selectModel";

describe("selectModel", () => {
  it("uses mock mode by default without an API key", () => {
    expect(selectModel({})).toBe(validMockModel);
  });

  it("creates the Groq model when its API key is configured", () => {
    expect(
      selectModel({ MODEL_PROVIDER: "groq", GROQ_API_KEY: "test-key" }),
    ).toEqual(expect.any(Function));
  });

  it("fails at startup when Groq is selected without an API key", () => {
    expect(() => selectModel({ MODEL_PROVIDER: "groq" })).toThrow(
      "GROQ_API_KEY is required when MODEL_PROVIDER=groq",
    );
  });

  it("rejects an unsupported provider", () => {
    expect(() => selectModel({ MODEL_PROVIDER: "unexpected" })).toThrow(
      "Unsupported MODEL_PROVIDER: unexpected",
    );
  });
});
