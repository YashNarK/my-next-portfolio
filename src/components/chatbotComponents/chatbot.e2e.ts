/**
 * E2E tests for the portfolio chatbot widget.
 * The widget is retrieval-only (no external model call), so these tests
 * assert against exact, deterministic response fragments rather than
 * "looks plausible" fuzzy checks.
 */
import { test, expect } from "@playwright/test";

test.describe("Chatbot widget", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("FAB is visible and opens the chat panel with a greeting", async ({ page }) => {
    const fab = page.getByRole("button", {
      name: /chat with narendran's portfolio assistant/i,
    });
    await expect(fab).toBeVisible();
    await fab.click();

    await expect(page.getByRole("dialog", { name: /ask about narendran/i })).toBeVisible();
    await expect(page.getByText(/portfolio assistant/i)).toBeVisible();
  });

  test("Escape key closes the panel", async ({ page }) => {
    await page
      .getByRole("button", { name: /chat with narendran's portfolio assistant/i })
      .click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
  });

  test("answers a skills question from static profile data", async ({ page }) => {
    await page
      .getByRole("button", { name: /chat with narendran's portfolio assistant/i })
      .click();

    const input = page.getByLabel("Chat message");
    await input.fill("What are your skills?");
    await input.press("Enter");

    await expect(page.getByText(/here's my toolkit, grouped by area/i)).toBeVisible();
    await expect(page.getByText(/typescript/i).last()).toBeVisible();
  });

  test("answers a contact question with the canonical email", async ({ page }) => {
    await page
      .getByRole("button", { name: /chat with narendran's portfolio assistant/i })
      .click();

    const input = page.getByLabel("Chat message");
    await input.fill("How can I contact you?");
    await input.press("Enter");

    await expect(page.getByText(/ai\.narendran@gmail\.com/i)).toBeVisible();
  });

  test("confirms a known technology by name", async ({ page }) => {
    await page
      .getByRole("button", { name: /chat with narendran's portfolio assistant/i })
      .click();

    const input = page.getByLabel("Chat message");
    await input.fill("Do you know Docker?");
    await input.press("Enter");

    await expect(page.getByText(/docker is part of my toolkit/i)).toBeVisible();
  });

  test("falls back gracefully on an unrelated question instead of guessing", async ({ page }) => {
    await page
      .getByRole("button", { name: /chat with narendran's portfolio assistant/i })
      .click();

    const input = page.getByLabel("Chat message");
    await input.fill("What's the airspeed velocity of an unladen swallow?");
    await input.press("Enter");

    await expect(
      page.getByText(/couldn't find anything about that in my profile/i)
    ).toBeVisible();
  });

  test("send button is disabled for empty input and enabled once text is typed", async ({ page }) => {
    await page
      .getByRole("button", { name: /chat with narendran's portfolio assistant/i })
      .click();

    const sendButton = page.getByRole("button", { name: /send message/i });
    await expect(sendButton).toBeDisabled();

    await page.getByLabel("Chat message").fill("hello");
    await expect(sendButton).toBeEnabled();
  });

  test("suggestion chips send a canned query", async ({ page }) => {
    await page
      .getByRole("button", { name: /chat with narendran's portfolio assistant/i })
      .click();

    await page.getByRole("button", { name: "Contact", exact: true }).click();
    await expect(page.getByText(/ai\.narendran@gmail\.com/i)).toBeVisible();
  });
});
