import { sleep } from '@helpers/Utils';

export default class AppScreen {
    private selector: string;

    constructor (selector: string) {
        this.selector = selector;
    }

    /**
     * Wait for the login screen to be visible
     *
     * @param {boolean} isShown
     */
    async waitForIsShown (isShown = true): Promise<boolean | void> {
        return $(this.selector).waitForDisplayed({
            reverse: !isShown,
        });
    }

    async scrollDown({ maxSwipes, waitTimeAfterScroll } = {maxSwipes: 1, waitTimeAfterScroll: 500}) {
        for (let i = 0; i < maxSwipes; i++) {
            await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollToEnd(1,5)');
            await sleep(waitTimeAfterScroll);
        }
    }

    async scrollTop({ maxSwipes, waitTimeAfterScroll } = {maxSwipes: 1, waitTimeAfterScroll: 500}) {
        for (let i = 0; i < maxSwipes; i++) {
            await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollToBeginning(1,5)');
            await sleep(waitTimeAfterScroll);
        }
    }
}
