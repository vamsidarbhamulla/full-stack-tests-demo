import { APIRequestContext } from '@playwright/test';
import { test } from '@setup/pageSetup';
import * as headerBar from '@components/headerBar';
import * as addressSelector from '@components/addressSelector';
import * as deliverySelector from '@components/deliverySelector';
import * as paymentSelector from '@components/paymentOptionSelector';
import * as orderReview from '@components/orderReview';
import * as orderSummary from '@components/orderSummary';

import { createAccountApi } from '@utils/apiUtils';

test.describe('verify product checkout', () => {
  let apiContext: APIRequestContext;

  test.beforeAll('set api context', async ({ playwright }) => {
    apiContext = await playwright.request.newContext({
      // All Api requests we send go to this API endpoint.
      baseURL: process.env.BASE_URL,
    });
  });

  test.afterAll('dispose api context', async ({}) => {
    // Dispose all responses at the end of the test.
    await apiContext.dispose();
  });

  test(
    'should be able to checkout a product successfully',
    { tag: ['@product', '@checkout'] },
    async ({ homePage, loginPage, basketPage, createAddressPage }) => {
      const { username, email, password } = await test.step('create new user and login', async () => {
        await loginPage.start();

        let email = process.env.DEFAULT_EMAIL!;
        let username = process.env.DEFAULT_USERNAME!;
        // create new user for each test using rest api based on environment variable from cli
        const createNewUser = process.env.CREATE_NEW_USER ?? 'false';
        if (createNewUser === 'true') {
          const newUser = await createAccountApi(apiContext);
          email = newUser?.data?.email ?? process.env.DEFAULT_EMAIL!;
          username = newUser?.data?.username ?? process.env.DEFAULT_USERNAME!;
        }
        const password = process.env.DEFAULT_PASSWORD!;
        return { username, email, password };
      });

      await test.step('login with new user credentials', async () => {
        await loginPage.login(email, password);
      });

      await test.step('add products to cart', async () => {
        await homePage.addProductsToCart();
        await headerBar.clickOnShoppingCart();
      });

      await test.step('validate cart balance', async () => {
        await basketPage.validateCartBalance();
      });

      await test.step('start checkout process', async () => {
        await basketPage.gotoCheckoutPage();
      });

      await test.step('add new address and select it', async () => {
        await addressSelector.addNewAdress();
        await createAddressPage.createAddress(username);
        await addressSelector.selectAddress();
      });

      await test.step('select one day delivery method', async () => {
        await deliverySelector.selectDeliveryMethod();
      });

      await test.step('select credit card payment option', async () => {
        await paymentSelector.selectCreditCardPaymentOption();
      });

      await test.step('review, checkout and validate order', async () => {
        await orderReview.checkout();
        await orderSummary.validateOrder();
      });
    },
  );
});
