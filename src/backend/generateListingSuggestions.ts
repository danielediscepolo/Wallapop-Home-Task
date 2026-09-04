import type { GenerateModelOutput } from "./modelGateway";

export async function generateListingSuggestions(
  description: string,
  generateModelOutput: GenerateModelOutput,
): Promise<unknown> {
  const prompt = `Generate listing suggestions for: ${description}`;
  const output = await generateModelOutput(prompt);

  return typeof output === "string" ? JSON.parse(output) : output;
}
