import { expect, type Locator, type Page } from '@playwright/test';
import { openPage2, waitForPageLoad } from '@utils/pageUtils';
import * as footerBar from '@components/footerBar';
import { productListFromApi } from '@testdata/productData';

export class HomePage {
  readonly page: Page;
  readonly SELECTORS;
  constructor(page: Page) {
    this.page = page;
    this.SELECTORS = this.selectors(this.page);
  }

  getPage(): Page {
    return this.page;
  }

selectors (page: Page) {
  return {
  productTile: function (productName: string) {
    return page
      .locator('mat-card')
      .filter({ has: page.locator(`text="${productName}"`) });
  },
  // tiles
  appleJuiceTile: page.locator('mat-card').filter({ hasText: 'Apple Juice (1000ml) 1.99¤' }),
  applePomaceTile: page.locator('mat-card').filter({ hasText: 'Apple Pomace 0.89¤Add to' }),
  bananaJuiceTile: page.locator('mat-card').filter({ hasText: 'Banana Juice (1000ml) 1.99¤' }),
  carrotJuiceTile: page.locator('mat-card').filter({ hasText: 'Carrot Juice (1000ml) 2.99¤' }),
  eggfruitJuiceTile: page.locator('mat-card').filter({ hasText: 'Eggfruit Juice (500ml) 8.99¤' }),
  lemonJuiceTile: page.locator('mat-card').filter({ hasText: 'Lemon Juice (500ml) 2.99¤' }),
  woodruffSyrupTile: page.locator('mat-card').filter({ hasText: 'Woodruff Syrup "Forest Master' }),
  bestJuiceTile: page.locator('mat-card').filter({ hasText: 'Only 1 left Best Juice Shop' }),
  successPopUp: page.locator('.mat-simple-snack-bar-content').filter({ hasText: 'Placed' }),
  successPopUpCloseButton: page.locator('.mat-button-wrapper').filter({ hasText: 'X' }),
  };
}

async open() {
  await openPage2(this.page);
}

async check() {
   await this.SELECTORS.appleJuiceTile.isVisible();
}

async checkAllTheItemsAreAvailable({ count } = { count: '48' }) {
  await this.SELECTORS.woodruffSyrupTile.scrollIntoViewIfNeeded();
  await this.SELECTORS.woodruffSyrupTile.isVisible();
  await footerBar.checkItemsLabel({ count });
}

async selectAppleJuice() {
  await this.SELECTORS.appleJuiceTile.isVisible();
  await this.SELECTORS.appleJuiceTile.click();
  await waitForPageLoad();
}

async addProductsToCart() {
  const locatorsDetails = productListFromApi()
        .map((product) => ({ locator: this.SELECTORS.productTile(product), product }));
  for (const details of locatorsDetails) {
    await this.addProductToCart(details.locator);
    await this.checkProductAddedSuccesfully(details.product);
  }
  await waitForPageLoad();
}

async addProductToCart(locator: Locator) {
  await locator.scrollIntoViewIfNeeded();
  await locator.getByLabel('Add to Basket').click();
}

async checkProductAddedSuccesfully(product: string) {
  await this.SELECTORS.successPopUp.waitFor({ state: 'visible', timeout: 1000 });
  await this.SELECTORS.successPopUp.isVisible();
  await this.SELECTORS.successPopUp.scrollIntoViewIfNeeded();
  await expect(this.SELECTORS.successPopUp).toContainText(`Placed ${product} into basket.`);
  await this.SELECTORS.successPopUpCloseButton.click();
  await this.SELECTORS.successPopUp.waitFor({ state: 'hidden', timeout: 500 });
  await expect(this.SELECTORS.successPopUp).toHaveCount(0);
}

}
