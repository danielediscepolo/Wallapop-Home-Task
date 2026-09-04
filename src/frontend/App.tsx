import { useState, type FormEvent } from "react";

import { requestListingSuggestions } from "./listingSuggestionsApi";
import type { ListingSuggestions } from "../shared/listingSuggestions";

const REQUIRED_DESCRIPTION_MESSAGE = "Description is required.";

function formatPrice(value: number, currency: string) {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function App() {
  const [description, setDescription] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [suggestions, setSuggestions] =
    useState<ListingSuggestions | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (description.trim().length === 0) {
      setFieldError(REQUIRED_DESCRIPTION_MESSAGE);
      return;
    }

    setFieldError(null);
    setRequestError(null);
    setIsLoading(true);

    try {
      const result = await requestListingSuggestions(description);
      setSuggestions(result);
    } catch (error) {
      setRequestError(
        error instanceof Error
          ? error.message
          : "Could not generate suggestions.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <img
          className="brand-logo"
          src="/wallapop-logo.png"
          alt="Wallapop"
        />
      </header>

      <section className="workspace" aria-labelledby="page-title">
        <div className="intro">
          <p className="eyebrow">Listing assistant</p>
          <h1 id="page-title">Describe what you want to sell</h1>
          <p className="intro-copy">
            Include useful details such as brand, model, condition, size, or age.
          </p>
        </div>

        <form className="description-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="description">Describe your item</label>
          <textarea
            id="description"
            name="description"
            rows={7}
            value={description}
            aria-invalid={fieldError !== null}
            aria-describedby={fieldError ? "description-error" : undefined}
            placeholder="For example: Renault Twingo, used and in good condition..."
            onChange={(event) => {
              setDescription(event.target.value);
              if (fieldError) {
                setFieldError(null);
              }
            }}
          />
          {fieldError && (
            <p className="field-error" id="description-error" role="alert">
              {fieldError}
            </p>
          )}
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate suggestions"}
          </button>
        </form>

        {requestError && (
          <p className="request-error" role="alert">
            {requestError}
          </p>
        )}

        {suggestions && (
          <section className="result" aria-labelledby="suggested-title">
            <p className="result-label">Suggested listing</p>
            <h2 id="suggested-title">{suggestions.title}</h2>

            <div className="result-row">
              <span className="result-heading">Search tags</span>
              <ul className="tag-list" aria-label="Suggested search tags">
                {suggestions.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </div>

            <div className="result-row price-row">
              <span className="result-heading">Estimated price</span>
              <strong>
                {formatPrice(
                  suggestions.priceRange.min,
                  suggestions.priceRange.currency,
                )}{" "}
                –{" "}
                {formatPrice(
                  suggestions.priceRange.max,
                  suggestions.priceRange.currency,
                )}
              </strong>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
