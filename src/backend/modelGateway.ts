export type ListingGenerationInput = {
  description: string;
};

export type GenerateModelOutput = (
  input: ListingGenerationInput,
) => Promise<unknown>;
