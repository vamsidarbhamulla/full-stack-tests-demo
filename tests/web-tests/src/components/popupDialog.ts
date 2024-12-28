import { getPage, waitForPageLoad } from '@utils/pageUtils';
import { sleep } from '@utils/networkUtils';
import { expect } from '@playwright/test';
import { isElementVisible, clickWithRetry } from '@utils/locatorUtils';

const SELECTORS = () => ({
  popupDialog: getPage().locator('.mat-dialog-container'),
  appleJuiceImg: getPage().locator('.mat-dialog-container').getByRole('img', { name: 'Apple Juice (1000ml)' }),
  get appleJuiceImg1() {
    return this.popupDialog.getByRole('img', { name: 'Apple Juice (1000ml)' });
  },
  // get reviewButton() {
  //   return this.popupDialog.locator('.mat-expansion-panel[aria-label="Expand for Reviews"]');
  // },
  reviewButton: getPage().locator('.mat-expansion-indicator'),
  comment: getPage().locator('.comment').first(),
  closeButton: getPage().getByLabel('Close Dialog'),
});

export async function viewAppleJuiceReviews(browser: string) {
  await expect(SELECTORS().popupDialog).toBeVisible();
  await expect(SELECTORS().appleJuiceImg1).toBeVisible();
  await SELECTORS().reviewButton.waitFor();
  await SELECTORS().reviewButton.isEnabled();
  await expect(SELECTORS().reviewButton).toBeVisible();
  // if (browser === 'chromium') {
  //   await SELECTORS().reviewButton.click();
  // } else {
  //   // eslint-disable-next-line
  //   await SELECTORS().reviewButton.click({ force: true }); // webkit and firefox need force click to work on review button
  // }
  // await SELECTORS().reviewButton.click();
  await clickWithRetry(SELECTORS().reviewButton, 2);
  await waitForPageLoad();
  let exists = await isElementVisible(SELECTORS().comment);
  let currentWait = 0;
  while (!exists && currentWait < 10) {
    await sleep(100);
    await waitForPageLoad();
    await clickWithRetry(SELECTORS().reviewButton, 2);
    exists = await isElementVisible(SELECTORS().comment);
    currentWait++;  
  }
  await expect(SELECTORS().comment).toBeVisible();
  await sleep(2000);
  await SELECTORS().closeButton.click();
}
