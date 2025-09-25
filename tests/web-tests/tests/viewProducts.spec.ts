import { test } from '@setup/pageSetup';
import * as footerBar from '@components/footerBar';
import { waitForPageLoad } from '@utils/pageUtils';

test.describe('verify the home page', () => {
  test(
    'should check all the items available on the page',
    { tag: ['@product', '@intercept'] },
    async ({ homePage, page }, testInfo) => {
      await homePage.open();
      page.on('response', response =>
        response.url().includes('rest/products/search') ? console.log('<<', response.status(), response.url()) : null,
      );

      //
      let itemCount = '48';
      // intercepting network calls to fetch the actual rest api response body count to match against front-end
      // intercepting request that gets redirected is not working in webkit safari
      // if (testInfo.project.name === 'chromium') {
        const productSearchPromise = page.waitForResponse(resp => 
          resp.status() === 200 &&
          resp.url().includes('/rest/products/search'));

        await page.reload();
        await waitForPageLoad();
        const productSearchRes = await productSearchPromise;
        const searchResponseBody = await productSearchRes.json();
        itemCount = `${searchResponseBody.data.length}`;
      // }

      await footerBar.selectItemsPerPage();
      await homePage.checkAllTheItemsAreAvailable({ count: itemCount });
    },
  );
});
