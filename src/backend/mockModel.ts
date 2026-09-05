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

export const invalidMockModel: GenerateModelOutput = async () => "{not-json";

export function selectMockModel(
  scenario: string | undefined,
): GenerateModelOutput {
  switch (scenario ?? "valid") {
    case "valid":
      return validMockModel;
    case "invalid":
      return invalidMockModel;
    default:
      throw new Error(`Unsupported MOCK_SCENARIO: ${scenario}`);
  }
}
