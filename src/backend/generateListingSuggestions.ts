import type { GenerateModelOutput } from "./modelGateway";
import { parseListingSuggestions } from "./parseListingSuggestions";
import type { ListingSuggestions } from "../shared/listingSuggestions";

export async function generateListingSuggestions(
  description: string,
  generateModelOutput: GenerateModelOutput,
): Promise<ListingSuggestions> {
  const prompt = `Generate listing suggestions for: ${description}`;
  const output = await generateModelOutput(prompt);

  return parseListingSuggestions(output);
}
