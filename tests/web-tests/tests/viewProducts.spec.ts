import { test } from '@setup/pageSetup';
// import * as homePage from '@pages/homePage';
import * as footerBar from '@components/footerBar';

test.describe('verify the home page', () => {
  test('should check all the items available on the page', 
    {tag: ['@product', '@intercept'] }, 
    async ({ homePage, page }) => {
    page.on('response', response => response.url().includes('rest/products/search') ? 
    console.log('<<', response.status(), response.url())
    : null);
      // await homePage.open();
      // intercepting network calls to fetch the actual rest api response body count to match against front-end
    const productSearchPromise = page.waitForResponse(
      resp => resp.url().includes('/rest/products/search'),
    );

    await page.goto('http://localhost:3000/#');
    // await homePage.open();
    const productSearchRes = await productSearchPromise;
    const searchResponseBody = await productSearchRes.json();
    await footerBar.selectItemsPerPage();
    await homePage.checkAllTheItemsAreAvailable({ count: `${searchResponseBody.data.length}` });
  });
});
