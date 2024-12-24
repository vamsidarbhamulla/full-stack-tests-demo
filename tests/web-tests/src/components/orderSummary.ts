import { getPage, waitForPageLoad } from '@utils/pageUtils';

const SELECTORS = () => ({
  confirmOrderText: getPage().getByRole('heading', { name: 'Thank you for your purchase!' }),
});

export async function validateOrder() {
  await SELECTORS().confirmOrderText.waitFor({ state: 'visible', timeout: 2000 });
  await SELECTORS().confirmOrderText.isVisible();
  await waitForPageLoad();
}
