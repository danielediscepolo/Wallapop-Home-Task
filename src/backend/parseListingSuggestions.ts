import type { ListingSuggestions } from "../shared/listingSuggestions";

export class InvalidModelOutputError extends Error {
  constructor() {
    super("Model output does not match the listing suggestions contract.");
    this.name = "InvalidModelOutputError";
  }
}

function invalidOutput(): never {
  throw new InvalidModelOutputError();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseJson(output: unknown): unknown {
  if (typeof output !== "string") {
    return output;
  }

  try {
    return JSON.parse(output) as unknown;
  } catch {
    return invalidOutput();
  }
}

export function parseListingSuggestions(output: unknown): ListingSuggestions {
  const parsed = parseJson(output);

  if (!isRecord(parsed) || parsed.status !== "complete") {
    return invalidOutput();
  }

  const { priceRange, tags, title } = parsed;

  if (typeof title !== "string" || title.trim().length === 0) {
    return invalidOutput();
  }

  if (!Array.isArray(tags) || tags.length < 3 || tags.length > 5) {
    return invalidOutput();
  }

  const normalizedTags = tags.map((tag) =>
    typeof tag === "string" ? tag.trim() : "",
  );
  const uniqueTags = new Set(normalizedTags.map((tag) => tag.toLowerCase()));

  if (
    normalizedTags.some((tag) => tag.length === 0) ||
    uniqueTags.size !== normalizedTags.length
  ) {
    return invalidOutput();
  }

  if (!isRecord(priceRange)) {
    return invalidOutput();
  }

  const { currency, max, min } = priceRange;

  if (
    typeof min !== "number" ||
    !Number.isFinite(min) ||
    min < 0 ||
    typeof max !== "number" ||
    !Number.isFinite(max) ||
    max < min ||
    currency !== "EUR"
  ) {
    return invalidOutput();
  }

  return {
    status: "complete",
    title: title.trim(),
    tags: normalizedTags,
    priceRange: { min, max, currency },
  };
}
