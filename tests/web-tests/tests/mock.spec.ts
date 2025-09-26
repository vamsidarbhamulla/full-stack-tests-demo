import { test } from '@setup/pageSetup';
import * as footerBar from '@components/footerBar';
import { getPage, waitForPageLoad } from '@utils/pageUtils';
import { get } from 'http';
import { expect } from '@playwright/test';

test.describe('verify the home page mock api', () => {
  test('gets the json from api and adds a new fruit', async ({ homePage, page }) => {
    // Get the response and add to it
    

    // Go to the page
    await homePage.open();

    // Assert that the new fruit is visible
    await expect(page.getByText('Loquat', { exact: true })).toBeVisible();
  });
});
