import { test } from '@setup/pageSetup';
import * as footerBar from '@components/footerBar';
import { waitForPageLoad } from '@utils/pageUtils';

test.describe('verify the home page mock api', () => {
  test(
    'should display the modified product count using playwright mock api',
    { tag: ['@product', '@mock'] },
    async ({ homePage, page }) => {
      // Step 1: Intercept and modify the response for the products API
      await test.step('intercept and mock the product search api', async () => {
        await page.route('rest/products/search', async route => {
          const response = await route.fetch();
          const json: Record<string, unknown>[] = await response.json();
          json.push({
            id: 55555,
            name: 'Random Mock Juice',
            description: 'Adding a random mock juice to test the intercept and mock api feature',
            price: 66.66,
            deluxePrice: 66.66,
            image: 'https://picsum.photos/100/150',
            createdAt: '2025-09-23 23:08:04.874 +00:00',
            updatedAt: '2025-09-23 23:08:04.874 +00:00',
            deletedAt: null,
          });
          // Fulfill using the original response, while patching the response body
          // with the given JSON object.
          await route.fulfill({ response, json });
        });
      });
      //
      let itemCount = '48';
      // intercepting network calls to fetch the actual rest api response body count to match against front-end
      // intercepting request that gets redirected is not working in webkit safari
      // if (testInfo.project.name === 'chromium') {
      const productSearchPromise = page.waitForResponse(
        resp => resp.status() === 200 && resp.url().includes('rest/products/search'),
      );

      await homePage.open();
      await waitForPageLoad();
      const productSearchRes = await productSearchPromise;
      const searchResponseBody = await productSearchRes.json();

      console.log('<< Search Response Body:', searchResponseBody);
      itemCount = `${searchResponseBody.data.length}`;
      // }

      await footerBar.selectItemsPerPage();
      await homePage.checkAllTheItemsAreAvailable({ count: itemCount });
    },
  );
});
