import { getPage, waitForPageLoad } from '@utils/pageUtils';

const SELECTORS = () => ({
  addNewAdressButton: getPage().getByLabel('Add a new address'),
  addressRadioButton1: getPage().locator('radio[class="mat-radio-input"]'),
  addressRadioButton: getPage().locator('.mdc-radio__native-control').first(),
  continueButton: getPage().locator('button[aria-label="Proceed to payment selection"]'),
});

export async function addNewAdress() {
  // await getPage().pause();
  await SELECTORS().addNewAdressButton.waitFor({ state: 'visible', timeout: 2000 });
  await SELECTORS().addNewAdressButton.click();
  await waitForPageLoad();
}

export async function selectAddress() {
  await SELECTORS().addressRadioButton.waitFor({ state: 'visible', timeout: 2000 });
  await SELECTORS().addressRadioButton.click();
  await SELECTORS().continueButton.click();
  await waitForPageLoad();
}
