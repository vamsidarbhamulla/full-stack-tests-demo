/**
 * page-factory.ts: This module is responsible for setting and managing instances of pages.
 * It provides a centralized way to set and access pages, ensuring that each test has a clean, isolated page instance.
 * This helps to maintain the state and context of each test independently, improving test reliability and debugging.
 * It also includes functions for switching between pages, closing pages, and reverting to the default page.
 */
import { Page } from '@playwright/test';

import { dismiss as cookieMessagerDismiss } from '@components/cookieMessager';
import { handle as welcomeBannerHandle } from '@components/welcomeBanner';

const SMALL_TIMEOUT = 5 * 1000;
let page: Page;

/**
 * Returns the current Page.
 * @returns {Page} The current Page.
 */
export function getPage(): Page {
  if (!page || page?.isClosed()) {
    throw new Error(`getPage(): Page is not initialized from, ${!page}, ${page?.isClosed()}`);
  }
  return page;
}

/**
 * Sets the current Page.
 * @param {Page} pageInstance - The Page instance to set as the current Page.
 */
export function setPage({ pageInstance }: { pageInstance: Page }) {
  page = pageInstance;
}

export async function openPage({ page, uri, handlePopup }: { page: Page; uri: string; handlePopup: boolean }) {
  const baseUrl = process.env.BASE_URL!;
  setPage({ pageInstance: page });
  await page.goto(`${baseUrl}/#/${uri}`);
  await waitForPageLoad();
  if (handlePopup) {
    await welcomeBannerHandle();
    await cookieMessagerDismiss();
  }
}

export async function waitForPageLoad() {
  await getPage().waitForLoadState('load');
  await getPage().waitForLoadState('domcontentloaded');
  // eslint-disable-next-line
  await getPage().waitForLoadState('networkidle');
}
/**
 * Switches to a different page by its index (1-based).
 * If the desired page isn't immediately available, this function will wait and retry for up to 'SMALL_TIMEOUT' seconds.
 * @param {number} winNum - The index of the page to switch to.
 * @throws {Error} If the desired page isn't found within 'SMALL_TIMEOUT' seconds.
 */
export async function switchPage(winNum: number): Promise<void> {
  const startTime = Date.now();
  while (page.context().pages().length < winNum && Date.now() - startTime < SMALL_TIMEOUT) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  if (page.context().pages().length < winNum) {
    throw new Error(`Page number ${winNum} not found after ${SMALL_TIMEOUT} seconds`);
  }
  const pageInstance = page.context().pages()[winNum - 1];
  await pageInstance.waitForLoadState();
  // setPage(pageInstance);
}

/**
 * Switches back to the default page (the first one).
 */
export async function switchToDefaultPage(): Promise<void> {
  const pageInstance = page.context().pages()[0];
  if (pageInstance) {
    await pageInstance.bringToFront();
    // setPage(pageInstance);
  }
}

/**
 * Closes a page by its index (1-based).
 * If no index is provided, the current page is closed.
 * If there are other pages open, it will switch back to the default page.
 * @param {number} winNum - The index of the page to close.
 */
export async function closePage(winNum: number): Promise<void> {
  if (!winNum) {
    await page.close();
    return;
  }
  const noOfWindows = page.context().pages().length;
  const pageInstance = page.context().pages()[winNum - 1];
  await pageInstance.close();
  if (noOfWindows > 1) {
    await switchToDefaultPage();
  }
}
