import { once } from "node:events";
import type { AddressInfo } from "node:net";

import { afterEach, describe, expect, it, vi } from "vitest";

import { createApp } from "../backend/app";
import { validMockModel } from "../backend/mockModel";
import { requestListingSuggestions } from "../frontend/listingSuggestionsApi";

describe("listing generation flow", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("passes a description from the frontend client through the HTTP API", async () => {
    const server = createApp(validMockModel).listen(0, "127.0.0.1");
    await once(server, "listening");

    try {
      const address = server.address() as AddressInfo;
      const baseUrl = `http://127.0.0.1:${address.port}`;
      const nativeFetch = globalThis.fetch.bind(globalThis);

      vi.stubGlobal(
        "fetch",
        (input: RequestInfo | URL, init?: RequestInit) =>
          nativeFetch(
            typeof input === "string" ? new URL(input, baseUrl) : input,
            init,
          ),
      );

      const result = await requestListingSuggestions(
        "Vintage leather jacket, worn once, size M",
      );

      expect(result).toMatchObject({
        status: "complete",
        title: expect.any(String),
        tags: expect.any(Array),
        priceRange: {
          min: expect.any(Number),
          max: expect.any(Number),
          currency: "EUR",
        },
      });
    } finally {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    }
  });
});
