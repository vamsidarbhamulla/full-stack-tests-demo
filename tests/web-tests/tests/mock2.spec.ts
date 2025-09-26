import { test } from '@setup/pageSetup';
import * as footerBar from '@components/footerBar';
import { getPage, waitForPageLoad } from '@utils/pageUtils';
import { get } from 'http';
import { expect } from '@playwright/test';

test.describe('verify the home page mock api', () => {
  test('gets the json from api and adds a new fruit', async ({ homePage, page }) => {
    // Get the response and add to it
    // Get the response and add to it
  await page.route('rest/products/search', async route => {
    const response = await route.fetch();
    const json = await response.json();
    json.push({ name: 'Loquat', id: 100 });
    // Fulfill using the original response, while patching the response body
    // with the given JSON object.
    await route.fulfill({ response, json });
  });

    // Go to the page
    await homePage.open();

    // Assert that the new fruit is visible
    await expect(page.getByText('Loquat', { exact: true })).toBeVisible();
  });
});
