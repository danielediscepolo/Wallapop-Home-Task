import { createGroqModel } from "./groqModel";
import type { GenerateModelOutput } from "./modelGateway";
import { selectMockModel } from "./mockModel";

type ModelEnvironment = {
  MODEL_PROVIDER?: string;
  MOCK_SCENARIO?: string;
  GROQ_API_KEY?: string;
};

export function selectModel(environment: ModelEnvironment): GenerateModelOutput {
  const provider = environment.MODEL_PROVIDER ?? "mock";

  switch (provider) {
    case "mock":
      return selectMockModel(environment.MOCK_SCENARIO);
    case "groq": {
      const apiKey = environment.GROQ_API_KEY?.trim();

      if (!apiKey) {
        throw new Error(
          "GROQ_API_KEY is required when MODEL_PROVIDER=groq",
        );
      }

      return createGroqModel({ apiKey });
    }
    default:
      throw new Error(`Unsupported MODEL_PROVIDER: ${provider}`);
  }
}
