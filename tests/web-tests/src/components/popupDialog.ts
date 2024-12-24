import { getPage } from '@utils/pageUtils';
import { sleep } from '@utils/networkUtils';
import { expect } from '@playwright/test';

const SELECTORS = () => ({
  popupDialog: getPage().locator('.mat-dialog-container'),
  appleJuiceImg: getPage().locator('.mat-dialog-container').getByRole('img', { name: 'Apple Juice (1000ml)' }),
  get appleJuiceImg1() {
    return this.popupDialog.getByRole('img', { name: 'Apple Juice (1000ml)' });
  },
  get reviewButton1() {
    return this.popupDialog.locator('.mat-expansion-panel[aria-label="Expand for Reviews"]');
  },
  reviewButton: getPage().locator('.mat-expansion-panel[aria-label="Expand for Reviews"]'),
  comment: getPage().locator('.comment'),
  closeButton: getPage().getByLabel('Close Dialog'),
});

export async function viewAppleJuiceReviews() {
  await expect(SELECTORS().popupDialog).toBeVisible();
  await expect(SELECTORS().appleJuiceImg1).toBeVisible();
  await SELECTORS().reviewButton1.waitFor();
  await SELECTORS().reviewButton1.isEnabled();
  await expect(SELECTORS().reviewButton1).toBeVisible();
  await SELECTORS().reviewButton1.click();
  await SELECTORS().comment.waitFor({ state: 'visible', timeout: 5000 });
  // await (getPage().waitForSelector(SELECTORS().comment)).isVisible()
  await expect(SELECTORS().comment).toBeVisible();
  await sleep(2000);
  await SELECTORS().closeButton.click();
}
