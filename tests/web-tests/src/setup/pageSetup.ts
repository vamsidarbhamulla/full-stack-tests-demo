/**
 * page-setup.ts: This module is responsible for setting up the initial state of a page before each test.
 * It includes a hook that runs before each test, setting the page context. By centralizing these setup operations,
 * it ensures a consistent starting point for each test, improving test reliability. It also exports a base test object
 * with a beforeEach hook already set up. This can be used to define tests with the page context set up.
 */

import { Page, Browser, BrowserContext, test as baseTest, expect } from '@playwright/test';
import { setPage, openPage2 } from '@utils/pageUtils';

import { HomePage } from '@pages/homePage2';

// Declare your options to type-check your configuration.
export type MyOptions = {
  defaultItem: string;
};
interface AppFixtures {
  homePage: HomePage;
};

type CustomFixtures = {
  pageFixtures: AppFixtures;
  defaultItem: string;
}

// Specify both option and fixture types.
export const test = baseTest.extend<AppFixtures>({

  // Our "todoPage" fixture depends on the option.
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await homePage.open();
    await use(homePage);
  },
  // page: async ({ baseURL, page }, use) => {
  //   await openPage2(page);
  //   await use(page);
  // },
}); 

// type Account = {
//   username: string;
//   password: string;
// };

// // Note that we pass worker fixture types as a second template parameter.
// baseTest.extend<{}, { account: Account }>({
//   account: [async ({ browser }, use, workerInfo) => {
//     // Unique username.
//     const username = 'user' + workerInfo.workerIndex;
//     const password = 'verysecure';

//     // Create the account with Playwright.
//     const page = await browser.newPage();
//     await page.goto('/signup');
//     await page.getByLabel('User Name').fill(username);
//     await page.getByLabel('Password').fill(password);
//     await page.getByText('Sign up').click();
//     // Make sure everything is ok.
//     await expect(page.getByTestId('result')).toHaveText('Success');
//     // Do not forget to cleanup.
//     await page.close();

//     // Use the account value.
//     await use({ username, password });
//   }, { scope: 'worker' }],

//   page: async ({ page, account }, use) => {
//     // Sign in with our account.
//     const { username, password } = account;
//     await page.goto('/signin');
//     await page.getByLabel('User Name').fill(username);
//     await page.getByLabel('Password').fill(password);
//     await page.getByText('Sign in').click();
//     await expect(page.getByTestId('userinfo')).toHaveText(username);

//     // Use signed-in page in the test.
//     await use(page);
//   },
// });

//  baseTest.extend<{ page: Page, baseURL: string }>({
//   page: async ({ baseURL, page }, use) => {
//     await page.goto(baseURL);
//     await setPage({ pageInstance: page });
//     await use(page);
//   },
// });

// baseTest.extend<{ forEachTest: void }>({
//   forEachTest: [async ({ page }, use) => {
//     // This code runs before every test.
//     await page.goto('http://localhost:3000');
//     // await setPage({ pageInstance: page });
//     await use();
//     // This code runs after every test.
//     console.log('Last URL:', page.url());
//   }, { auto: true }],  // automatically starts for every test.
// });

// baseTest.extend<{}, { forEachWorker: void }>({
//   forEachWorker: [async ({}, use) => {
//     // This code runs before all the tests in the worker process.
//     console.log(`Starting test worker ${test.info().workerIndex}`);
//     // await setPage({ pageInstance: page });
//     await use();
//     // This code runs after all the tests in the worker process.
//     console.log(`Stopping test worker ${test.info().workerIndex}`);
//   }, { scope: 'worker', auto: true }],  // automatically starts for every worker.
// });

// /**
//  * A hook that runs before each test, setting the page context.
//  * @param {Page} page - The page context provided by Playwright.
//  */
// baseTest.beforeEach(async ({  page, browser, context }: { page: Page, browser: Browser,  context: BrowserContext  }) => {
//   console.log(`Running ${test.info().title}`);
//   let pageInstance = page;
//   if (!context) {
//     console.log('getting context from test:', context);
//     if (!browser.contexts()[0]) {
//       context = await browser.newContext();
//       console.log('getting context from browser:', context);
//     } else {
//       context = browser.contexts()[0];
//       console.log('creating new context from browser:', context);
//     }
//   }
//     if (!page || page?.isClosed()) {
//     // const context =  browser.contexts()[0];
//     const pagePromise = context.waitForEvent('page');
//     pageInstance = await pagePromise;
//     // throw new Error('setPage(): Page is not initialized');
//   }
//    await setPage({ pageInstance });
  
//   console.log('pageInstance1:', pageInstance.isClosed());
//   // console.log('pageInstance2:', pageInstance2.isClosed);
// });

// baseTest.afterEach(async ({ page }: { page: Page }) => {
//   await page.close();
// });

/**
 * The base test object with a beforeEach hook already set up.
 * This can be used to define tests with the page context set up.
 */
// export const test = baseTest;
export { expect } from '@playwright/test';
