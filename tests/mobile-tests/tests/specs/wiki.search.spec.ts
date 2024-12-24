import NativeAlert from '@components/NativeAlert';
import HomeScreen  from '@screenobjects/HomeScreen';
import { sleep } from '@helpers/Utils';
import SearchScreen from '@screenobjects/SearchScreen.js';

describe('When interacting with a Wikipidea app,', () => {
    beforeEach(async () => {
       // Wait for the alert and validate it
       await NativeAlert.handleEvent();
    });
    
    it('should be able search for a topic successfully', async () => {
        // Always make sure you are on the right tab
        await HomeScreen.checkHomeScreen();
        
        await HomeScreen.openSearch();
        await sleep(2000);
        await SearchScreen.checkSeachScreen();
        await SearchScreen.searchInfo({ text: 'new york' });
        
    });

    
});
