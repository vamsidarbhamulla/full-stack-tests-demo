import { getPage, waitForPageLoad } from '@utils/pageUtils';

const SELECTORS = () => ({
  completePayment: getPage().getByLabel('Complete your purchase'),
});

export async function checkout() {
  await SELECTORS().completePayment.waitFor({ state: 'visible', timeout: 2000 });
  await SELECTORS().completePayment.click();
  await waitForPageLoad();
}
