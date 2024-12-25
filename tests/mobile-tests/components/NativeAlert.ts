const SELECTORS = {
    ANDROID: {
        ALERT_MESSAGE: '*//android.widget.TextView[@resource-id="android:id/message"]',
        ALERT_OK_BUTTON: 'new UiSelector().resourceId("android:id/button1")',
        ALERT_TITLE: 'new UiSelector().resourceId("android:id/alertTitle")',
    },
    IOS: {
        ALERT: '-ios predicate string:type == \'XCUIElementTypeAlert\'',
    },
};

class NativeAlert {
    /**
     * Wait for the alert to exist.
     *
     * The selector for Android differs from iOS
     */
    static async waitForIsShown (isShown = true) {
        const selector = driver.isAndroid
            ? `android=${SELECTORS.ANDROID.ALERT_TITLE}`
            : SELECTORS.IOS.ALERT;

        return $(selector).waitForExist({
            timeout: 11000,
            reverse: !isShown,
        });
    }

    /**
     * Press a button in a cross-platform way.
     *
     * IOS:
     *  iOS always has an accessibilityID so use the `~` in combination
     *  with the name of the button as shown on the screen
     * ANDROID:
     *  Use the text of the button, provide a string and it will automatically transform it to uppercase
     *  and click on the button
     */
    static async topOnButtonWithText (selector: string) {
        const buttonSelector = driver.isAndroid
            ? `android=${SELECTORS.ANDROID.ALERT_OK_BUTTON}`
            : `~${selector}`;
        await $(buttonSelector).click();
    }

    static async tapOnOkButton () {
        const buttonSelector = `android=${SELECTORS.ANDROID.ALERT_OK_BUTTON}`;
        await $(buttonSelector).click();
    }

    /**
     * Get the alert text
     *
     * iOS:
     *  The default Appium method can be used to get the text of the alert
     * Android:
     *  The UI hierarchy for Android is different so it will not give the same result as with
     *  iOS if `getText` is being used. Here we construct a method that would give the same output.
     */
    static async text ():Promise<string> {
        if (driver.isIOS) {
            return $(SELECTORS.IOS.ALERT).getText();
        }

        return `${await $(SELECTORS.ANDROID.ALERT_TITLE).getText()}\n${await $(SELECTORS.ANDROID.ALERT_MESSAGE).getText()}`;
    }

    static async handleEvent(){
        const caps = driver?.capabilities;
        const isAndroidEmulator = caps?.desired?.udid?.includes('emulator') 
        || caps?.deviceName?.includes('emulator') 
        || caps?.deviceUDID?.includes('emulator')
        const isCi = !!process.env.CI || process.env.CI == 'true'
        if (isAndroidEmulator && !isCi) {
            await this.waitForIsShown();
            // Close the alert
            await this.tapOnOkButton();
            await this.waitForIsShown(false);
        }
    }
}

export default NativeAlert;
