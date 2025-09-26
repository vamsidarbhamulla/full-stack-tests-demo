/**
 * page-setup.ts: This module is responsible for setting up the initial state of a page before each test.
 * It includes a hook that runs before each test, setting the page context. By centralizing these setup operations,
 * it ensures a consistent starting point for each test, improving test reliability. It also exports a base test object
 * with a beforeEach hook already set up. This can be used to define tests with the page context set up.
 */

import { test as baseTest } from '@playwright/test';
import { setPage } from '@utils/pageUtils';

import { HomePage } from '@pages/homePage';
import { LoginPage } from '@pages/loginPage';
import { RegistrationPage } from '@pages/registrationPage';
import { CreateAddressPage } from '@pages/createAddressPage';
import { BasketPage } from '@pages/basketPage';

import { Product } from '@models/product';

interface AppFixtures {
  homePage: HomePage; // Every entry point to the app should be a fixture.
  loginPage: LoginPage;
  registrationPage: RegistrationPage;
  createAddressPage: CreateAddressPage;
  basketPage: BasketPage;
  createMockApi: () => void;
}

// Specify both option and fixture types.
export const test = baseTest.extend<AppFixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    setPage({ pageInstance: page });
    await use(homePage);
  },
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    setPage({ pageInstance: page });
    await use(loginPage);
  },

  registrationPage: async ({ page }, use) => {
    const registrationPage = new RegistrationPage(page);
    setPage({ pageInstance: page });
    await use(registrationPage);
  },

  basketPage: async ({ page }, use) => {
    const basketPage = new BasketPage(page);
    setPage({ pageInstance: page });
    await use(basketPage);
  },

  createAddressPage: async ({ page }, use) => {
    const createAddressPage = new CreateAddressPage(page);
    setPage({ pageInstance: page });
    await use(createAddressPage);
  },

  createMockApi: async ({ page }, use) => {
    const mockedProduct: Product = {
      id: 55555,
      name: 'Random Mock Juice',
      description: 'Adding a random mock juice to test the intercept and mock api feature',
      price: 66.66,
      deluxePrice: 66.66,
      image: 'https://picsum.photos/100/150',
      createdAt: '2025-09-23 23:08:04.874 +00:00',
      updatedAt: '2025-09-23 23:08:04.874 +00:00',
      deletedAt: null,
    };
    await page.route('rest/products/search', async route => {
      const response = await route.fetch();
      const json: Product[] = await response.json();
      json.unshift(mockedProduct);
      // Fulfill using the original response, while patching the response body
      // with the given JSON object.
      await route.fulfill({ response, json });
    });
    setPage({ pageInstance: page });
    // This `use` call allows the test to run after the route is set up
    await use();
    // const createAddressPage = new CreateAddressPage(page);
    // setPage({ pageInstance: page });
    // await use(createAddressPage);
  },
});

export { expect } from '@playwright/test';
