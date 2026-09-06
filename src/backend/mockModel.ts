import type { GenerateModelOutput } from "./modelGateway";

export const validMockModel: GenerateModelOutput = async () =>
  JSON.stringify({
    status: "complete",
    title: "Renault Twingo 2018 in good condition",
    tags: ["Renault Twingo", "city car", "2018 vehicle"],
    priceRange: {
      min: 5_000,
      max: 7_000,
      currency: "EUR",
    },
  });

export const invalidMockModel: GenerateModelOutput = async () => "{not-json";

export const limitedMockModel: GenerateModelOutput = async () =>
  JSON.stringify({
    status: "limited",
    title: "Renault Twingo",
    tags: ["Renault Twingo", "city car", "compact vehicle"],
    priceRange: {
      min: 1_500,
      max: 5_000,
      currency: "EUR",
    },
    tip: "Add year, mileage and condition for a more accurate estimate.",
  });

export const needsMoreInformationMockModel: GenerateModelOutput = async () =>
  JSON.stringify({
    status: "needs_more_information",
    message: "Describe the item you want to sell more clearly.",
  });

export function selectMockModel(
  scenario: string | undefined,
): GenerateModelOutput {
  switch (scenario ?? "valid") {
    case "valid":
      return validMockModel;
    case "invalid":
      return invalidMockModel;
    case "limited":
      return limitedMockModel;
    case "needs_more_information":
      return needsMoreInformationMockModel;
    default:
      throw new Error(`Unsupported MOCK_SCENARIO: ${scenario}`);
  }
}
