import type { GenerateModelOutput } from "./modelGateway";

export const validMockModel: GenerateModelOutput = async () =>
  JSON.stringify({
    status: "complete",
    title: "Renault Twingo 2018 in good condition",
    tags: ["renault", "twingo", "used car"],
    priceRange: {
      min: 5_000,
      max: 7_000,
      currency: "EUR",
    },
  });
