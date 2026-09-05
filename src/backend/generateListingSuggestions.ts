import type { GenerateModelOutput } from "./modelGateway";
import { parseListingSuggestions } from "./parseListingSuggestions";
import type { ListingSuggestions } from "../shared/listingSuggestions";

export async function generateListingSuggestions(
  description: string,
  generateModelOutput: GenerateModelOutput,
): Promise<ListingSuggestions> {
  const output = await generateModelOutput({ description });

  return parseListingSuggestions(output);
}
