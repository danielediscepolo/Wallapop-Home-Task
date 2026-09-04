export type ListingSuggestions = {
  status: "complete";
  title: string;
  tags: string[];
  priceRange: {
    min: number;
    max: number;
    currency: "EUR";
  };
};

type ApiError = {
  error?: {
    message?: string;
  };
};

export async function requestListingSuggestions(
  description: string,
): Promise<ListingSuggestions> {
  const response = await fetch("/api/listing-suggestions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description }),
  });
  const body: unknown = await response.json();

  if (!response.ok) {
    const errorBody = body as ApiError;
    throw new Error(
      errorBody.error?.message ?? "Could not generate suggestions.",
    );
  }

  return body as ListingSuggestions;
}
