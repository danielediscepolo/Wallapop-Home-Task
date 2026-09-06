import { afterEach, describe, expect, it, vi } from "vitest";

import { requestListingSuggestions } from "./listingSuggestionsApi";

describe("requestListingSuggestions", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns a stable message when the network request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ECONNRESET")));

    await expect(requestListingSuggestions("Renault Twingo")).rejects.toThrow(
      "Could not generate suggestions. Please try again.",
    );
  });

  it("returns a stable message when the response is not JSON", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => {
          throw new SyntaxError("Unexpected token '<'");
        },
      }),
    );

    await expect(requestListingSuggestions("Renault Twingo")).rejects.toThrow(
      "Could not generate suggestions. Please try again.",
    );
  });

  it("preserves a structured backend error message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({
          error: {
            code: "MODEL_UNAVAILABLE",
            message: "Could not generate suggestions. Please try again.",
          },
        }),
      }),
    );

    await expect(requestListingSuggestions("Renault Twingo")).rejects.toThrow(
      "Could not generate suggestions. Please try again.",
    );
  });

  it("returns a stable message for an unexpected JSON error shape", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => null,
      }),
    );

    await expect(requestListingSuggestions("Renault Twingo")).rejects.toThrow(
      "Could not generate suggestions. Please try again.",
    );
  });
});
