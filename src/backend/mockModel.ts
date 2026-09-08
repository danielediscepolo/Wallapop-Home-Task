import type { GenerateModelOutput } from "./modelGateway";

export const validMockModel: GenerateModelOutput = async () =>
  JSON.stringify({
    status: "complete",
    title: "Vintage leather jacket size M, worn once",
    tags: ["vintage leather jacket", "size M jacket", "leather outerwear"],
    priceRange: {
      min: 60,
      max: 120,
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
    tip: "This price range is wider because year, mileage, and condition are missing. Add those details for a more accurate estimate.",
  });

export const needsMoreInformationMockModel: GenerateModelOutput = async () =>
  JSON.stringify({
    status: "needs_more_information",
    message: "Describe the specific item you want to sell so we can suggest a title, search tags, and price range.",
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
