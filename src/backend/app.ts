import express from "express";

import { generateListingSuggestions } from "./generateListingSuggestions";
import type { GenerateModelOutput } from "./modelGateway";

export function createApp(generateModelOutput: GenerateModelOutput) {
  const app = express();

  app.use(express.json());
  app.post("/api/listing-suggestions", async (request, response, next) => {
    const description = request.body?.description;

    if (typeof description !== "string" || description.trim().length === 0) {
      response.status(400).json({
        error: {
          code: "INVALID_DESCRIPTION",
          message: "Description is required.",
        },
      });
      return;
    }

    try {
      const result = await generateListingSuggestions(
        description,
        generateModelOutput,
      );

      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  });

  return app;
}
