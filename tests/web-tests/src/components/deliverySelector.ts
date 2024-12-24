import { getPage, waitForPageLoad } from '@utils/pageUtils';

const SELECTORS = () => ({
  headerTitle: getPage().getByRole('heading', { name: 'Choose a delivery speed' }),
  oneDayDeliveryRadioButton: getPage().locator('.mat-radio-container').first(),
  continueButton: getPage().locator('button[aria-label="Proceed to delivery method selection"]'),
});

export async function selectDeliveryMethod() {
  await SELECTORS().headerTitle.waitFor({ state: 'visible', timeout: 2000 });
  await SELECTORS().oneDayDeliveryRadioButton.click();
  await SELECTORS().continueButton.click();
  await waitForPageLoad();
}
