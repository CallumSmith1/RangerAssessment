import { Page, expect } from '@playwright/test';

//Fields that could be common between future test additions
const PAGE_TITLE = ".mw-page-title-main",
    VIEW_HISTORY_LINK = '#ca-history a';

/**
 * This test was generated using Ranger's test recording tool. The test is supposed to:
 * 1. Navigate to Wikipedia
 * 2. Go to the "Artificial intelligence" page
 * 3. Click "View history"
 * 4. Assert that the latest edit was made by the user "Worstbull"
 *
 * Instructions:
 * - Run the test and ensure it performs all steps described above
 * - Add assertions to the test to ensure it validates the expected
 *   behavior:
 *   - If the latest edit was not made by "Worstbull" update the steps above accordingly
 *   - Write your assertion to provide clear diagnostic feedback if it fails
 *
 * Good luck!
 */
export async function run(page: Page, params: {}) {
    /** STEP: Navigate to URL */
    await page.goto('https://www.wikipedia.org/');

    /** STEP: Enter text 'art' into the search input field */
    const searchInputField = page.getByRole('searchbox', {
        name: 'Search Wikipedia',
    });
    await searchInputField.fill('artificial');

    /** STEP: Click the 'Artificial Intelligence' link in the search suggestions */
    //Callum: The name attribute was depricated, so I've updated it.
    const artificialIntelligenceLink = page.getByRole('link', {
        name: 'Artificial intelligence Intelligence of machines',
    });
    await artificialIntelligenceLink.click();
    //Assert the page title

    // Assert the page title is correct
    const pageTitle = page.locator(PAGE_TITLE);
    await expect(pageTitle).toHaveText("Artificial intelligence");

    // Click on the "View history" tab
    await page.locator(VIEW_HISTORY_LINK).click();

    // Verify that the most recent editor is "Worstbull"
    const latestEditor = await getMostRecentEditor(page);
    expect(latestEditor?.trim()).toBe('GreyStar456');
}

/**
 * Extracts the username of the most recent editor from the page.
 */
async function getMostRecentEditor(page: Page): Promise<string | null> {
    const editorLocator = page.locator('.mw-userlink').first();
    return editorLocator.textContent();
}