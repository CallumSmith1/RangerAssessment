import { expect, Page, test } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const wikipediaUsername = process.env.WIKIPEDIA_USERNAME;
const wikipediaPassword = process.env.WIKIPEDIA_PASSWORD;

const loginHyperlink = "#pt-login-2",
    signInButton = "#wpLoginAttempt";

const authFile = 'src/auth/login.json';

/**
 * Manually create a Wikipedia account and then finish this test
 * so that it signs into Wikipedia and captures the logged-in
 * session to src/auth/login.json, so that the tests in all.test.ts
 * run as a signed in user.
 */
test('Sign in to Wikipedia', async ({ page }) => {
    if (!wikipediaUsername || !wikipediaPassword) {
        throw new Error(`Need a username and password to sign in!`);
    }

    // Navigate to the Wikipedia main page
    await page.goto('https://en.wikipedia.org/wiki/Main_Page');

    // Click the login link to open the sign-in form
    await page.locator(loginHyperlink).click();

    // Fill in the login form
    await enterLoginDetails(wikipediaUsername, wikipediaPassword, page);
    await page.locator(signInButton).click();

    // Verify that the user is signed in and the username is displayed
    const displayedUserName = page.locator("#pt-userpage-2 span");

    // Wait up to 10 seconds for the username element to appear and match the expected username
    await expect(displayedUserName).toBeVisible({ timeout: 10000 });
    await expect(displayedUserName).toHaveText(wikipediaUsername);

    await page.context().storageState({ path: authFile });
});

/**
 * Fills in the Wikipedia login form with the provided credentials.
 * 
 * @param username - The Wikipedia username (default: empty string)
 * @param password - The Wikipedia password (default: empty string)
 * @param page - The Playwright page object
 */
async function enterLoginDetails(username = "", password = "", page: Page) {
    const usernameField = page.locator("#wpName1");
    const passwordField = page.locator("#wpPassword1");

    await usernameField.fill(username);
    await passwordField.fill(password);
}