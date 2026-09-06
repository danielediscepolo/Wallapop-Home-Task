import express from "express";

import { DESCRIPTION_MAX_LENGTH } from "../shared/listingSuggestions";
import { generateListingSuggestions } from "./generateListingSuggestions";
import type { GenerateModelOutput } from "./modelGateway";
import { InvalidModelOutputError } from "./parseListingSuggestions";

export function createApp(generateModelOutput: GenerateModelOutput) {
  const app = express();

  app.use(express.json());
  app.post("/api/listing-suggestions", async (request, response) => {
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

    if (Array.from(description).length > DESCRIPTION_MAX_LENGTH) {
      response.status(400).json({
        error: {
          code: "DESCRIPTION_TOO_LONG",
          message: `Description must be ${DESCRIPTION_MAX_LENGTH.toLocaleString("en-IE")} characters or fewer.`,
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
      if (error instanceof InvalidModelOutputError) {
        response.status(502).json({
          error: {
            code: "INVALID_MODEL_OUTPUT",
            message:
              "We couldn't generate reliable suggestions. Please try again.",
          },
        });
        return;
      }

      response.status(503).json({
        error: {
          code: "MODEL_UNAVAILABLE",
          message: "Could not generate suggestions. Please try again.",
        },
      });
    }
  });

  return app;
}
