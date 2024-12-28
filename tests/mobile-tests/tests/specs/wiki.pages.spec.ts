import NativeAlert from '@components/NativeAlert';
import FooterBar from '@components/FooterBar';
import HomeScreen  from '@screenobjects/HomeScreen';
import { sleep } from '@helpers/Utils';
import AllureReporter from '@wdio/allure-reporter'

describe('When User interacts with  Wikipidea app pages', () => {
    beforeEach(async () => {
        // Wait for the alert and validate it
        await NativeAlert.handleEvent();
    });
    
    it('Then he should be able to view and navigate all the wikipedia pages', async () => {

        await HomeScreen.checkHomeScreen();
        await HomeScreen.scrollToBottom();
        await sleep(2000);

        await FooterBar.tapOnMyLists();
        await sleep(3000);

        await FooterBar.tapOnSearchHistory();
        await sleep(3000);

        await FooterBar.tapOnNearByLocations();
        await sleep(3000);

        await FooterBar.tapOnHome();
        await sleep(3000);

        await HomeScreen.scrollToBeginning();
        await sleep(2000);
    });

    
});
 