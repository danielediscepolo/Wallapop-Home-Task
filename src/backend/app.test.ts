import request from "supertest";
import { describe, expect, it } from "vitest";

import { createApp } from "./app";
import { validMockModel } from "./mockModel";

describe("POST /api/listing-suggestions", () => {
  it("returns complete suggestions for a valid description in mock mode", async () => {
    const app = createApp(validMockModel);

    const response = await request(app)
      .post("/api/listing-suggestions")
      .send({
        description: "Renault Twingo 2018, 70000 km, in good condition",
      });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("complete");
    expect(response.body.title).toEqual(expect.any(String));
    expect(response.body.title.length).toBeGreaterThan(0);
    expect(response.body.tags.length).toBeGreaterThanOrEqual(3);
    expect(response.body.tags.length).toBeLessThanOrEqual(5);
    expect(new Set(response.body.tags).size).toBe(response.body.tags.length);
    expect(response.body.priceRange).toEqual({
      min: expect.any(Number),
      max: expect.any(Number),
      currency: "EUR",
    });
    expect(response.body.priceRange.min).toBeLessThanOrEqual(
      response.body.priceRange.max,
    );
  });
});
