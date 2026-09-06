import type { ListingSuggestions } from "../shared/listingSuggestions";

const REQUEST_ERROR_MESSAGE =
  "Could not generate suggestions. Please try again.";

function readErrorMessage(body: unknown): string {
  if (typeof body !== "object" || body === null || !("error" in body)) {
    return REQUEST_ERROR_MESSAGE;
  }

  const error = body.error;

  if (
    typeof error !== "object" ||
    error === null ||
    !("message" in error) ||
    typeof error.message !== "string" ||
    error.message.trim().length === 0
  ) {
    return REQUEST_ERROR_MESSAGE;
  }

  return error.message;
}

export async function requestListingSuggestions(
  description: string,
): Promise<ListingSuggestions> {
  let response: Response;

  try {
    response = await fetch("/api/listing-suggestions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description }),
    });
  } catch {
    throw new Error(REQUEST_ERROR_MESSAGE);
  }

  let body: unknown;

  try {
    body = await response.json();
  } catch {
    throw new Error(REQUEST_ERROR_MESSAGE);
  }

  if (!response.ok) {
    throw new Error(readErrorMessage(body));
  }

  return body as ListingSuggestions;
}
