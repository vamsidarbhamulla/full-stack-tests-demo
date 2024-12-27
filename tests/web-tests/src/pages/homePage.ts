import { getPage, openPage, waitForPageLoad } from '@utils/pageUtils';
import * as footerBar from '@components/footerBar';
import { Locator, expect } from '@playwright/test';
import { productListFromApi } from '@testdata/productData';

const SELECTORS = () => ({
  productTile: function (productName: string) {
    return getPage()
      .locator('mat-card')
      .filter({ has: getPage().locator(`text="${productName}"`) });
  },
  // tiles
  appleJuiceTile: getPage().locator('mat-card').filter({ hasText: 'Apple Juice (1000ml) 1.99¤' }),
  applePomaceTile: getPage().locator('mat-card').filter({ hasText: 'Apple Pomace 0.89¤Add to' }),
  bananaJuiceTile: getPage().locator('mat-card').filter({ hasText: 'Banana Juice (1000ml) 1.99¤' }),
  carrotJuiceTile: getPage().locator('mat-card').filter({ hasText: 'Carrot Juice (1000ml) 2.99¤' }),
  eggfruitJuiceTile: getPage().locator('mat-card').filter({ hasText: 'Eggfruit Juice (500ml) 8.99¤' }),
  lemonJuiceTile: getPage().locator('mat-card').filter({ hasText: 'Lemon Juice (500ml) 2.99¤' }),
  woodruffSyrupTile: getPage().locator('mat-card').filter({ hasText: 'Woodruff Syrup "Forest Master' }),
  bestJuiceTile: getPage().locator('mat-card').filter({ hasText: 'Only 1 left Best Juice Shop' }),
  successPopUp: getPage().locator('.mat-simple-snack-bar-content').filter({ hasText: 'Placed' }),
  successPopUpCloseButton: getPage().locator('.mat-button-wrapper').filter({ hasText: 'X' }),
});

export async function open() {
  await openPage();
}

export async function checkAllTheItemsAreAvailable({ count } = { count: '48' }) {
  await SELECTORS().woodruffSyrupTile.scrollIntoViewIfNeeded();
  await SELECTORS().woodruffSyrupTile.isVisible();
  await footerBar.checkItemsLabel({ count });
}

export async function selectAppleJuice() {
  await SELECTORS().appleJuiceTile.isVisible();
  await SELECTORS().appleJuiceTile.click();
  await waitForPageLoad();
}

export async function addProductsToCart() {
  const locatorsDetails = productListFromApi()
        .map((product) => ({ locator: SELECTORS().productTile(product), product }));
  for (const details of locatorsDetails) {
    await addProductToCart(details.locator);
    await checkProductAddedSuccesfully(details.product);
  }
  await waitForPageLoad();
}

export async function addProductToCart(locator: Locator) {
  await locator.scrollIntoViewIfNeeded();
  await locator.getByLabel('Add to Basket').click();
}

export async function checkProductAddedSuccesfully(product: string) {
  await SELECTORS().successPopUp.waitFor({ state: 'visible', timeout: 1000 });
  await SELECTORS().successPopUp.isVisible();
  await SELECTORS().successPopUp.scrollIntoViewIfNeeded();
  await expect(SELECTORS().successPopUp).toContainText(`Placed ${product} into basket.`);
  await SELECTORS().successPopUpCloseButton.click();
  await SELECTORS().successPopUp.waitFor({ state: 'hidden', timeout: 500 });
  await expect(SELECTORS().successPopUp).toHaveCount(0);
}