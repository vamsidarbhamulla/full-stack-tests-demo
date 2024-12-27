import { test } from '@setup/pageSetup';
// import * as homePage from '@pages/homePage';
import * as footerBar from '@components/footerBar';

test.describe('verify the home page @pi', () => {
  test('should check all the items available on the page', async ({ homePage, page }) => {
    // intercepting network calls to fetch the actual rest api response body count to match against front-end
    // const productSearchPromise = page.waitForResponse(
    //   resp => resp.url().includes('rest/products/search') && resp.request().method() === 'GET',
    // );

    // await homePage.open();
    // const productSearchRes = await productSearchPromise;
    // const searchResponseBody = await productSearchRes.json();
    await footerBar.selectItemsPerPage();
    await homePage.checkAllTheItemsAreAvailable({ count: '37' });
  });
});
