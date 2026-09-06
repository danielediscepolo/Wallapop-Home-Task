import request from "supertest";
import { describe, expect, it, vi } from "vitest";

import { createApp } from "./app";
import { invalidMockModel, validMockModel } from "./mockModel";

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

  it("rejects a blank description without calling the model", async () => {
    const generateModelOutput = vi.fn(async () => undefined);
    const app = createApp(generateModelOutput);

    const response = await request(app)
      .post("/api/listing-suggestions")
      .send({ description: "   " });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: {
        code: "INVALID_DESCRIPTION",
        message: "Description is required.",
      },
    });
    expect(generateModelOutput).not.toHaveBeenCalled();
  });

  it("rejects a description over 1,000 characters without calling the model", async () => {
    const generateModelOutput = vi.fn(async () => undefined);
    const app = createApp(generateModelOutput);

    const response = await request(app)
      .post("/api/listing-suggestions")
      .send({ description: "a".repeat(1001) });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: {
        code: "DESCRIPTION_TOO_LONG",
        message: "Description must be 1,000 characters or fewer.",
      },
    });
    expect(generateModelOutput).not.toHaveBeenCalled();
  });

  it("returns a stable error when the model output is invalid", async () => {
    const app = createApp(invalidMockModel);

    const response = await request(app)
      .post("/api/listing-suggestions")
      .send({ description: "Renault Twingo" });

    expect(response.status).toBe(502);
    expect(response.body).toEqual({
      error: {
        code: "INVALID_MODEL_OUTPUT",
        message: "We couldn't generate reliable suggestions. Please try again.",
      },
    });
  });

  it("returns a stable error when the model is unavailable", async () => {
    const generateModelOutput = vi.fn(async () => {
      throw new Error("Provider rate limit exceeded");
    });
    const app = createApp(generateModelOutput);

    const response = await request(app)
      .post("/api/listing-suggestions")
      .send({ description: "Renault Twingo" });

    expect(response.status).toBe(503);
    expect(response.body).toEqual({
      error: {
        code: "MODEL_UNAVAILABLE",
        message: "Could not generate suggestions. Please try again.",
      },
    });
  });
});
