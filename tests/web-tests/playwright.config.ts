import { defineConfig, devices } from '@playwright/test';

import dotenv from 'dotenv';
// import path from 'path';

const testEnv = process.env.TEST_ENV || 'local';
const isCi = process.env.CI === 'true';
// dotenv.config({ path: path.resolve(__dirname, './env', `.${testEnv}.env`)  });
dotenv.config({ path: `./env/.${testEnv}.env`  });

const startLocalHost = testEnv === 'local' && process.env.IS_LOCAL_WEB_APP === 'true';


const actionTimeout = 5 * 1000;
const navigationTimeout = 30 * 1000;
const testTimeout = 2 * 60 * 1000;


export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: isCi,
  /* Retry on CI only */
  retries: isCi ? 4 : 2,
  /* Opt out of parallel tests on CI. */
  workers: isCi ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { outputFolder: 'playwright-report' }], 
    ['list'], 
    // ['dot'],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  globalSetup: require.resolve('./src/setup/globalSetup.ts'),
  globalTeardown: require.resolve('./src/setup/globalTeardown.ts'),  
  use: {
    headless: isCi ? false : process.env.HEADLESS === 'true' || false,
    ignoreHTTPSErrors: true,
    acceptDownloads: true,
    // video: 'on',
    /**
     * The base URL to be used in navigation actions such as `await page.goto('/')`.
     * This allows for shorter and more readable navigation commands in the tests.
     */
    baseURL: process.env.BASE_URL,
    /* Records traces after each test failure for debugging purposes. */
    trace: process.env.TRACE === 'true' ? 'on' : 'retain-on-failure',
    /* Captures screenshots after each test failure to provide visual context. */
    screenshot: 'only-on-failure',
    /* Sets a timeout for actions like click, fill, select to prevent long-running operations. */
    actionTimeout: actionTimeout,
    /* Sets a timeout for page loading navigations like goto URL, go back, reload, waitForNavigation to prevent long page loads. */
    navigationTimeout: navigationTimeout,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  /**
   * If the tests are being run on localhost, this configuration starts a web server.
   * See https://playwright.dev/docs/test-webserver#configuring-a-web-server
   */
  ...(startLocalHost && {
    webServer: {
      // cwd: `${os.homedir()}/repos/ui`, // You can also use the realtive path to the UI repo
      command: 'docker run --rm -p 127.0.0.1:3000:3000 bkimminich/juice-shop', // Start the UI server
      url: 'http://localhost:3000',
      ignoreHTTPSErrors: true,
      timeout: testTimeout,
      reuseExistingServer: !process.env.CI,
      stdout: 'pipe',
      stderr: 'pipe',
    },
  }),
});
