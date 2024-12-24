import { getPage } from '@utils/pageUtils';

export function sleep(ms = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function waitForProductSearchResponse() {
  const responsePromise = getPage().waitForResponse(
    resp => resp.url().includes('rest/products/search') && resp.request().method() === 'GET',
  );

  return responsePromise;
}
