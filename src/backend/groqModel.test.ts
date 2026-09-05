import { describe, expect, it, vi } from "vitest";
import type OpenAI from "openai";

import { createGroqModel } from "./groqModel";

describe("createGroqModel", () => {
  it("requests one JSON listing result from Groq", async () => {
    const modelOutput = JSON.stringify({
      status: "needs_more_information",
      message: "Describe the item more clearly.",
    });
    const createCompletion = vi.fn(
      async (
        _request: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming,
      ) => ({
        choices: [{ message: { content: modelOutput } }],
      }),
    );
    const generateModelOutput = createGroqModel({
      apiKey: "test-key",
      createCompletion,
    });

    const result = await generateModelOutput({
      description: "Something from my garage",
    });

    expect(result).toBe(modelOutput);
    expect(createCompletion).toHaveBeenCalledOnce();

    const request = createCompletion.mock.calls[0]?.[0];
    expect(request).toBeDefined();

    if (!request) {
      throw new Error("Expected one Groq completion request.");
    }

    expect(request).toMatchObject({
      model: "openai/gpt-oss-20b",
      response_format: { type: "json_object" },
      temperature: 0.5,
      seed: 42,
      messages: [
        { role: "system", content: expect.any(String) },
        { role: "user", content: "Something from my garage" },
      ],
    });

    const instructions = request.messages[0]?.content;
    expect(typeof instructions).toBe("string");

    if (typeof instructions !== "string") {
      throw new Error("Expected string system instructions.");
    }

    expect(instructions).toContain("complete");
    expect(instructions).toContain("limited");
    expect(instructions).toContain("needs_more_information");
    expect(instructions).toContain("wider price range");
    expect(instructions).toContain(
      "price range is wider because information is missing",
    );
    expect(instructions).toContain("same predominant language");
    expect(instructions).toContain('"currency":"EUR"');
    expect(instructions).toContain("recognizable product or product category");
    expect(instructions).toContain('such as "iPhone" or "Renault Twingo"');
    expect(instructions).toContain("Never ask the seller for an asking price");
  });
});
