import express from "express";

import { generateListingSuggestions } from "./generateListingSuggestions";
import type { GenerateModelOutput } from "./modelGateway";

export function createApp(generateModelOutput: GenerateModelOutput) {
  const app = express();

  app.use(express.json());
  app.post("/api/listing-suggestions", async (request, response, next) => {
    try {
      const result = await generateListingSuggestions(
        request.body.description,
        generateModelOutput,
      );

      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  });

  return app;
}
