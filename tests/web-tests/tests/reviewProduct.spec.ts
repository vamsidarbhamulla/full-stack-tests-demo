import { test } from '@setup/pageSetup';
// import * as homePage from '@pages/homePage';
import * as popupDialog from '@components/popupDialog';

test.describe('verify user reviews can be viewed', { tag: '@product' }, () => {
  test('check apple juice reviews', async ({ homePage }, testInfo) => {
    await homePage.open();
    await homePage.selectAppleJuice();
    await popupDialog.viewAppleJuiceReviews(testInfo.project.name);
  });
});
