import { Locator } from '@playwright/test';
import { sleep } from './networkUtils';
export async function isElementVisible(elementLocator: Locator, waitTime: number = 3000): Promise<boolean> {
  try {
    await elementLocator.waitFor({
      state: 'visible',
      timeout: waitTime,
    });
  } catch {
    return false;
  }
  return true;
}

export async function clickWithRetry(locator: Locator, retries: number = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      await locator.click();
      return;
    } catch {
        console.log(`click failed, retrying...attempt ${i + 1} of ${retries}`);
      await sleep(1000);
    }
  }
  throw new Error(`clickWithRetry failed element ${locator} after ${retries} times`);
}
