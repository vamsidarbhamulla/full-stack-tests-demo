import NativeAlert from '@components/NativeAlert';
import FooterBar from '@components/FooterBar';
import HomeScreen  from '@screenobjects/HomeScreen';
import { sleep } from '@helpers/Utils';

describe('Interact with  Wikipidea app pages', () => {
    beforeEach(async () => {
        // Wait for the alert and validate it
        await NativeAlert.handleEvent();
    });
    
    it('should be able to view and navigate all the wikipedia pages', async () => {
        // Always make sure you are on the right tab
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
