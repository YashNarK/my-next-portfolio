/**
 * E2E tests for /login page changes:
 *  1. Forgot Password button is visible and sends a reset email
 *  2. Login form submits an AES-encrypted payload (not plaintext credentials)
 */
import { test, expect } from "@playwright/test";

test.describe("Login page — Forgot Password", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("Forgot Password button is visible", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: /forgot password/i })
    ).toBeVisible();
  });

  test("shows error when Forgot Password clicked with no email", async ({
    page,
  }) => {
    // Empty email field — button should show a helpful error
    await page.getByRole("button", { name: /forgot password/i }).click();
    await expect(
      page.getByText(/enter your email address/i)
    ).toBeVisible();
  });

  test("shows success message after Forgot Password with email prefilled", async ({
    page,
  }) => {
    // Pre-fill email
    await page.getByLabel("Email").fill("narenkrithick@gmail.com");

    // Intercept the Firebase sendPasswordResetEmail network call
    await page.route(
      "**/accounts:sendOobCode**",
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ email: "narenkrithick@gmail.com" }),
        });
      }
    );

    await page.getByRole("button", { name: /forgot password/i }).click();

    await expect(
      page.getByText(/password reset email sent/i)
    ).toBeVisible({ timeout: 5000 });
  });
});

test.describe("Login page — Encrypted credentials", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("login request body does NOT contain plaintext password", async ({
    page,
  }) => {
    const capturedBodies: string[] = [];

    // Capture all POST requests to our login API
    page.on("request", (req) => {
      if (req.url().includes("/api/auth/login") && req.method() === "POST") {
        capturedBodies.push(req.postData() ?? "");
      }
    });

    // Intercept the login API so we don't need real Firebase creds
    await page.route("**/api/auth/login", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ status: "ok" }),
      });
    });

    await page.getByLabel("Email").fill("narenkrithick@gmail.com");
    await page.getByLabel("Password").fill("supersecretpassword");
    await page.getByRole("button", { name: /^login$/i }).click();

    // Wait briefly for the request to fire
    await page.waitForTimeout(1000);

    expect(capturedBodies.length).toBeGreaterThan(0);

    for (const body of capturedBodies) {
      // Body must NOT contain plaintext password
      expect(body).not.toContain("supersecretpassword");
      // Body must NOT contain plaintext email
      expect(body).not.toContain("narenkrithick@gmail.com");
      // Body must contain the encrypted "payload" key
      expect(body).toContain("payload");
    }
  });

  test("login request body contains an AES-GCM base64 payload", async ({
    page,
  }) => {
    let requestBody = "";

    await page.route("**/api/auth/login", async (route) => {
      requestBody = route.request().postData() ?? "";
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ status: "ok" }),
      });
    });

    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Password").fill("testpassword123");
    await page.getByRole("button", { name: /^login$/i }).click();

    await page.waitForTimeout(1000);

    const parsed = JSON.parse(requestBody);
    expect(parsed).toHaveProperty("payload");

    // Payload should be a valid base64 string (AES-GCM IV + ciphertext)
    const base64Regex = /^[A-Za-z0-9+/]+=*$/;
    expect(parsed.payload).toMatch(base64Regex);

    // Decoded bytes must be at least 12 (IV) + 1 byte
    const decoded = Buffer.from(parsed.payload, "base64");
    expect(decoded.length).toBeGreaterThan(12);
  });

  test("shows error message on invalid credentials response", async ({
    page,
  }) => {
    await page.route("**/api/auth/login", async (route) => {
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ error: "Invalid credentials" }),
      });
    });

    await page.getByLabel("Email").fill("wrong@example.com");
    await page.getByLabel("Password").fill("wrongpassword");
    await page.getByRole("button", { name: /^login$/i }).click();

    await expect(
      page.getByText(/incorrect username or password/i)
    ).toBeVisible({ timeout: 5000 });
  });
});
