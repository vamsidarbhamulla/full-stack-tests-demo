import { extractNumberFromText } from '@utils/coreUtils';
import { getPage, openPage, waitForPageLoad } from '@utils/pageUtils';
import { expect } from '@playwright/test';
import { productListFromApi } from '@testdata/productData';

const SELECTORS = () => ({
  checkoutButton: getPage().getByRole('button', { name: 'Checkout' }),
  basketPrice: getPage().locator('#price'),
  basketItemRow: function (productName: string) {
    return getPage()
      .locator('mat-table mat-row')
      .filter({ has: getPage().locator('mat-cell:nth-child(2)').locator(`text="${productName}"`) });
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
});

export async function open() {
  await openPage('/basket');
}

export async function gotoCheckoutPage() {
  await SELECTORS().checkoutButton.click();
  await waitForPageLoad();
}

export async function validateCartBalance() {
  await validateCurrentCartBalance();
  const productList = productListFromApi();
  const productName = productList[4];
  await SELECTORS().basketItemCountIncrement(productName).scrollIntoViewIfNeeded();
  await SELECTORS().basketItemCountIncrement(productName).click();
  await SELECTORS().basketItemCountIncrement(productName).click();
  await validateCurrentCartBalance();
  await SELECTORS().basketItemCountDecrement(productName).click();
  await SELECTORS().basketItemCountDecrement(productName).click();
  await validateCurrentCartBalance();
}

export async function validateCurrentCartBalance() {
  await SELECTORS().basketItemRow('Apple Juice (1000ml)').waitFor({ timeout: 500 });
  // TODO: Implement logic to read the list of products in the basket/cart from rest api
  const currentItemList = productListFromApi();

  let calculatedTotal = 0;
  for (const item of currentItemList) {
    const currentItemPriceStr = await SELECTORS().basketItemPrice(item).textContent();
    const currentItemCountStr = await SELECTORS().basketItemCount(item).textContent();

    if (currentItemPriceStr) {
      const currentItemPrice = extractNumberFromText(currentItemPriceStr);
      calculatedTotal += currentItemPrice * Number(currentItemCountStr);
      // console.log('currentItemCountStr:', currentItemCountStr);
      // console.log('currentItemPrice:', currentItemPrice);
    }
  }
  const totalBasketPriceStr = await SELECTORS().basketPrice.textContent();
  if (totalBasketPriceStr) {
    const totalBasketPrice = extractNumberFromText(totalBasketPriceStr);
    const totalBasketPriceRounded = parseFloat(totalBasketPrice.toFixed(2));
    console.log('expectedBasketTotal:', calculatedTotal);
    console.log('actualBasketTotal:', totalBasketPriceRounded);
    expect(calculatedTotal).toBe(totalBasketPriceRounded);
  }
}
