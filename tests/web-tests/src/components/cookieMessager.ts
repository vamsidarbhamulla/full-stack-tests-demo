import { getPage } from '@utils/pageUtils';

const SELECTORS = () => ({
  dismisscookieMessage: getPage().getByLabel('dismiss cookie message'),
});

export async function dismiss() {
  await SELECTORS().dismisscookieMessage.click();
  await SELECTORS().dismisscookieMessage.waitFor({ state: 'hidden', timeout: 2000 });
}
