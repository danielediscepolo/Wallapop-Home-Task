// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { App } from "./App";

describe("Listing Assistant", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("shows an inline error for a blank description without calling the API", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    render(<App />);

    await user.click(
      screen.getByRole("button", { name: "Generate suggestions" }),
    );

    expect(screen.getByText("Description is required.")).toBeVisible();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("shows title, tags, and price returned for a valid description", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        status: "complete",
        title: "Renault Twingo in good condition",
        tags: ["Renault", "Twingo", "city car"],
        priceRange: {
          min: 2500,
          max: 4000,
          currency: "EUR",
        },
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<App />);

    await user.type(
      screen.getByRole("textbox", { name: "Describe your item" }),
      "Renault Twingo, used and in good condition",
    );
    await user.click(
      screen.getByRole("button", { name: "Generate suggestions" }),
    );

    expect(fetchMock).toHaveBeenCalledWith("/api/listing-suggestions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: "Renault Twingo, used and in good condition",
      }),
    });
    expect(
      await screen.findByRole("heading", {
        name: "Renault Twingo in good condition",
      }),
    ).toBeVisible();
    expect(screen.getByText("Renault")).toBeVisible();
    expect(screen.getByText("Twingo")).toBeVisible();
    expect(screen.getByText(/€2,500.*€4,000/)).toBeVisible();
  });

  it("preserves the description and shows no result when model output is invalid", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({
        error: {
          code: "INVALID_MODEL_OUTPUT",
          message:
            "We couldn't generate reliable suggestions. Please try again.",
        },
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<App />);

    const description = screen.getByRole("textbox", {
      name: "Describe your item",
    });
    await user.type(description, "Renault Twingo");
    await user.click(
      screen.getByRole("button", { name: "Generate suggestions" }),
    );

    expect(
      await screen.findByText(
        "We couldn't generate reliable suggestions. Please try again.",
      ),
    ).toBeVisible();
    expect(description).toHaveValue("Renault Twingo");
    expect(screen.queryByText("Suggested listing")).not.toBeInTheDocument();
  });
});
