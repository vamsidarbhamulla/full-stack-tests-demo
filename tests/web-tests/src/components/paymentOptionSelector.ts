import { getPage, waitForPageLoad } from '@utils/pageUtils';
import { test } from '@setup/pageSetup';

const SELECTORS = () => ({
  headerTitle: getPage().getByRole('heading', { name: 'My Payment Options' }),
  addNewCreditCardButton: getPage().getByRole('button', { name: 'Add new card Add a credit or' }),

  creditCardName: getPage().getByLabel('Name *'),
  creditCardNumber: getPage().getByLabel('Card Number *'),
  creditCardExpiryMonth: getPage().getByLabel('Expiry Month *'),
  creditCardExpiryYear: getPage().getByLabel('Expiry Year *'),
  creditCardSubmitButton: getPage().getByRole('button', { name: 'send Submit' }),

  creditCardSelectRadioButton: getPage().locator('span[class="mat-radio-container"]').first(),
  continueButton: getPage().locator('button[aria-label="Proceed to review"]'),
  // continueButton: getPage().getByLabel('Proceed to delivery method'),
});

export async function selectCreditCardPaymentOption() {
  await test.step('add new credit card to payment option', async () => {
    await SELECTORS().headerTitle.waitFor({ state: 'visible', timeout: 2000 });
    await SELECTORS().addNewCreditCardButton.click();
    await addCreditCard();
  });

  await test.step('select newly added credit card payment option', async () => {
    await SELECTORS().creditCardSelectRadioButton.click();
    await SELECTORS().continueButton.scrollIntoViewIfNeeded();
    await SELECTORS().continueButton.click();
    await waitForPageLoad();
  });
}

export async function addCreditCard() {
  await SELECTORS().creditCardName.fill('test user1');
  await SELECTORS().creditCardNumber.fill('4444444444444444');
  await SELECTORS().creditCardExpiryMonth.selectOption('10');
  await SELECTORS().creditCardExpiryYear.selectOption('2080');
  await SELECTORS().creditCardSubmitButton.click();
  await waitForPageLoad();
}
