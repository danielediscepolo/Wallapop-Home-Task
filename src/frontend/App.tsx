import { useState, type FormEvent } from "react";

import { requestListingSuggestions } from "./listingSuggestionsApi";
import {
  DESCRIPTION_MAX_LENGTH,
  type ListingSuggestions,
} from "../shared/listingSuggestions";

const REQUIRED_DESCRIPTION_MESSAGE = "Description is required.";
const FORMATTED_DESCRIPTION_MAX_LENGTH =
  DESCRIPTION_MAX_LENGTH.toLocaleString("en-IE");
const DESCRIPTION_TOO_LONG_MESSAGE = `Description must be ${FORMATTED_DESCRIPTION_MAX_LENGTH} characters or fewer.`;

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
  const descriptionLength = Array.from(description).length;
  const isDescriptionTooLong = descriptionLength > DESCRIPTION_MAX_LENGTH;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (description.trim().length === 0) {
      setFieldError(REQUIRED_DESCRIPTION_MESSAGE);
      return;
    }

    if (isDescriptionTooLong) {
      setFieldError(DESCRIPTION_TOO_LONG_MESSAGE);
      return;
    }

    setFieldError(null);
    setRequestError(null);
    setSuggestions(null);
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
            aria-describedby={
              fieldError
                ? "description-limit description-error"
                : "description-limit"
            }
            placeholder="For example: Renault Twingo, used and in good condition..."
            onChange={(event) => {
              const nextDescription = event.target.value;
              setDescription(nextDescription);
              setSuggestions(null);
              if (Array.from(nextDescription).length > DESCRIPTION_MAX_LENGTH) {
                setFieldError(DESCRIPTION_TOO_LONG_MESSAGE);
              } else if (fieldError) {
                setFieldError(null);
              }
            }}
          />
          <div className="description-meta" id="description-limit">
            <span>Maximum {FORMATTED_DESCRIPTION_MAX_LENGTH} characters</span>
            <span>
              {descriptionLength.toLocaleString("en-IE")} /{" "}
              {FORMATTED_DESCRIPTION_MAX_LENGTH} characters
            </span>
          </div>
          {fieldError && (
            <p className="field-error" id="description-error" role="alert">
              {fieldError}
            </p>
          )}
          <button
            type="submit"
            disabled={isLoading || isDescriptionTooLong}
          >
            {isLoading ? "Generating..." : "Generate suggestions"}
          </button>
        </form>

        {requestError && (
          <p className="request-error" role="alert">
            {requestError}
          </p>
        )}

        {suggestions?.status === "needs_more_information" && (
          <section className="result" aria-labelledby="more-information-title">
            <p className="result-label">More information needed</p>
            <h2 id="more-information-title">Tell us a little more</h2>
            <p>{suggestions.message}</p>
          </section>
        )}

        {suggestions && suggestions.status !== "needs_more_information" && (
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

            {suggestions.status === "limited" && (
              <p className="limited-tip">{suggestions.tip}</p>
            )}
          </section>
        )}
      </section>
    </main>
  );
}
