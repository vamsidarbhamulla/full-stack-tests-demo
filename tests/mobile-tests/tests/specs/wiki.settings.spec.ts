import HeaderBar from '@components/HeaderBar';
import MenuOptions from '@components/MenuOptions';
import NativeAlert from '@components/NativeAlert';
import HomeScreen  from '@screenobjects/HomeScreen';
import { sleep } from '@helpers/Utils';
import SettingsScreen from '@screenobjects/SettingsScreen.js';

describe('When User interacting with a Wikipidea Settings ,', () => {
    beforeEach(async () => {
       // Wait for the alert and validate it
       await NativeAlert.handleEvent();
    });
    
    it('Then he should be able to toggle all settings successfully', async () => {
        await HeaderBar.checkHeaderBar();
        await HeaderBar.tapOnMoreOptions();
        await MenuOptions.tapOnSettingsMenu();
        await SettingsScreen.checkSettingsScreen();
        await SettingsScreen.toggleAllSettings();
        await SettingsScreen.navigateToHomeScreen();
        await HomeScreen.checkHomeScreen();
        await HomeScreen.scrollToBottom();
        await sleep(2000);
    });
});
