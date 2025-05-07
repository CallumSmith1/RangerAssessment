import { Page, expect } from '@playwright/test';

const CONTENT_PAGES_HOOK = ".mw-statistics-articles .mw-statistics-numbers",
    SMALL_FONT_SIZE = "14px",
    STANDARD_FONT_SIZE = "16px",
    LARGE_FONT_SIZE = "20px";

/**
 * This test was generated using Ranger's test recording tool. The test is supposed to:
 * 1. Navigate to Wikipedia's homepage
 * 2. Assert there are less than 7,000,000 articles in English
 * 3. Assert the page's text gets smaller when the 'Small' text size option is selected
 * 4. Assert the page's text gets larger when the 'Large' text size option is selected
 * 5. Assert the page's text goes back to the default size when the 'Standard' text size option is selected
 *
 * Instructions: Run the test and ensure it performs all steps described above
 *
 * Good luck!
 */

export async function run(page: Page, params: {}) {
    /** STEP: Navigate to URL */
    await page.goto('https://en.wikipedia.org/wiki/Main_Page');

    /** STEP: Click the link to view the total number of articles in English */
    //I've updated this locator. In its previous form, it was too flaky for a dynamic article count
    //const totalArticlesLink = page.getByRole('link', { name: '6,970,005' });
    const totalArticlesLink = page.getByTitle("Special:Statistics").nth(1);
    await totalArticlesLink.click();

    // Enable the text size radio buttons
    await enableFontSizeButtons(page);

    // Hook to content whose font size will be validated
    const pageTextHook = page.locator(CONTENT_PAGES_HOOK);

    /** STEP: Select the 'Small' text size option in the appearance settings */
    const smallTextSizeOption = page.getByRole('radio', { name: 'Small' });
    await smallTextSizeOption.click({ force: true });
    await assertFontSize(pageTextHook, SMALL_FONT_SIZE);

    /** STEP: Click the 'Large' text size option to change the display size */
    const largeTextSizeOption = page.getByRole('radio', { name: 'Large' });
    await largeTextSizeOption.click();
    await assertFontSize(pageTextHook, LARGE_FONT_SIZE);
    /** STEP: Click the 'Standard' text size option in the appearance settings */
    const standardTextSizeButton = page.getByLabel('Standard').first();
    await standardTextSizeButton.click();
    await assertFontSize(pageTextHook, STANDARD_FONT_SIZE);
}

/**
 * Enables the font size radio buttons under the "Text" appearance menu.
 *
 * Callum: On my instance of Wikipedia, these radio buttons are disabled by default,
 * which prevents interaction during automated tests. This workaround locates the
 * "Text" appearance menu by its heading and removes the "disabled" attribute
 * from each associated radio input.
 */
async function enableFontSizeButtons(page: Page) {
    const textHeading = page.locator('.vector-menu-heading', { hasText: 'Text' });
    const menuContent = textHeading.locator('xpath=following-sibling::*[contains(@class, "vector-menu-content")]');

    await menuContent.evaluate((el) => {
        const radios = el.querySelectorAll('input[type="radio"]');
        radios.forEach((radio) => {
            radio.removeAttribute('disabled');
        });
    });
}

/**
 * Asserts that the given element has the expected font size.
 */
async function assertFontSize(locator: ReturnType<Page['locator']>, expectedSize: string) {
    await expect(locator).toHaveCSS("font-size", expectedSize);
}