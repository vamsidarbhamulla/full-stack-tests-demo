import { extractNumberFromText } from '@utils/coreUtils';
import { openPage, waitForPageLoad } from '@utils/pageUtils';
import { productListFromApi } from '@testdata/productData';
import { type Page, expect } from '@playwright/test';
import { sleep } from '@utils/networkUtils';

export class BasketPage {
  readonly page: Page;
  readonly SELECTORS;
  readonly uriPath: string;

  constructor(page: Page) {
    this.page = page;
    this.SELECTORS = this.selectors(this.page);
    this.uriPath = '/basket';
  }

  async open() {
    await openPage({ page: this.page, uri: this.uriPath, handlePopup: false });
  }

  async start() {
    // use this method if we directly want to open the page is
    await openPage({ page: this.page, uri: this.uriPath, handlePopup: true });
  }

  async check() {
    await this.SELECTORS.checkoutButton.isVisible();
  }
  selectors(page: Page) {
    return {
      checkoutButton: page.getByRole('button', { name: 'Checkout' }),
      basketPrice: page.locator('#price'),
      basketItemRow: function (productName: string) {
        return page
          .locator('mat-table mat-row')
          .filter({ has: page.locator('mat-cell:nth-child(2)').locator(`text="${productName}"`) });
      },

      basketItemName: function (productName: string) {
        return this.basketItemRow(productName).locator('mat-cell:nth-child(2)');
      },
      basketItemCount: function (productName: string) {
        return this.basketItemRow(productName).locator('mat-cell:nth-child(3)');
      },

      basketItemPrice: function (productName: string) {
        return this.basketItemRow(productName).locator('mat-cell:nth-child(4)');
      },

      basketItemCountIncrement: function (productName: string) {
        return this.basketItemCount(productName).locator('.fa-plus-square');
      },

      basketItemCountDecrement: function (productName: string) {
        return this.basketItemCount(productName).locator('.fa-minus-square');
      },
    };
  }

  async gotoCheckoutPage() {
    await this.SELECTORS.checkoutButton.click();
    await waitForPageLoad();
  }

  async validateCartBalance() {
    await this.validateCurrentCartBalance();
    const productList = productListFromApi();
    const productName = productList[4];
    await this.SELECTORS.basketItemCountIncrement(productName).scrollIntoViewIfNeeded();
    await this.updateItemCount(productName, true);
    await this.validateCurrentCartBalance();
    await this.updateItemCount(productName, true);
    await this.validateCurrentCartBalance();
    await this.updateItemCount(productName, false);
    await this.validateCurrentCartBalance();
    await this.updateItemCount(productName, false);
    await this.validateCurrentCartBalance();
  }

  async updateItemCount(productName: string, increment: boolean) {
    const currentItemCountStrBefore = await this.SELECTORS.basketItemCount(productName).textContent();
    const matcher = increment ? Number(currentItemCountStrBefore) + 1 : Number(currentItemCountStrBefore) - 1;
    if (increment) {
      await this.SELECTORS.basketItemCountIncrement(productName).click();
    } else {
      await this.SELECTORS.basketItemCountDecrement(productName).click();
    }
    let currentItemCountStrAfter = await this.SELECTORS.basketItemCount(productName).textContent();
    await waitForPageLoad();

    let currentWait = 0;
    while (Number(currentWait < 10) && matcher !== Number(currentItemCountStrAfter)) {
      await sleep(1000);
      await waitForPageLoad();
      currentWait += 1;
      currentItemCountStrAfter = await this.SELECTORS.basketItemCount(productName).textContent();
    }
  }

  async validateCurrentCartBalance() {
    await this.SELECTORS.basketItemRow('Apple Juice (1000ml)').waitFor({ timeout: 500 });
    // TODO: Implement logic to read the list of products in the basket/cart from rest api
    const currentItemList = productListFromApi();

    let calculatedTotal = 0;
    for (const item of currentItemList) {
      const currentItemPriceStr = await this.SELECTORS.basketItemPrice(item).textContent();
      const currentItemCountStr = await this.SELECTORS.basketItemCount(item).textContent();

      if (currentItemPriceStr) {
        const currentItemPrice = extractNumberFromText(currentItemPriceStr);
        calculatedTotal += currentItemPrice * Number(currentItemCountStr);
      }
    }
    const totalBasketPriceStr = await this.SELECTORS.basketPrice.textContent();
    if (totalBasketPriceStr) {
      const totalBasketPrice = extractNumberFromText(totalBasketPriceStr);
      const totalBasketPriceRounded = parseFloat(totalBasketPrice.toFixed(2));
      const expectedBasketTotal = parseFloat(calculatedTotal.toFixed(2));
      console.log('expectedBasketTotal:', expectedBasketTotal);
      console.log('actualBasketTotal:', totalBasketPriceRounded);
      expect(totalBasketPriceRounded).toBe(expectedBasketTotal);
    }
  }
}
