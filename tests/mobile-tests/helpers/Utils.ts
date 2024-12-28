/**
 * Get the time difference in seconds
 */
export function timeDifference (string: string, start:number, end:number) {
    const elapsed = (end - start) / 1000;
    console.log(`${string} It took ${elapsed} seconds.`);
}

export async function sleep (ms: number) {
    new Promise((r) => setTimeout(r, ms));
} 

/**
 * relaunch the app by closing it and starting it again
 */
export async function relaunchApp(identifier:string) {
    const appIdentifier = { [driver.isAndroid ? 'appId' : 'bundleId']: identifier };
    const terminateCommand = 'mobile: terminateApp';
    const launchCommand = `mobile: ${driver.isAndroid ? 'activateApp' : 'launchApp'}`;

    await driver.execute(terminateCommand, appIdentifier);
    await driver.execute(launchCommand, appIdentifier);

}

type AppInfo = {
    processArguments: {
        env: { [key: string]: any };
        args: any[];
    };
    name: string;
    pid: number;
    bundleId: string;
};

/**
 * Typically, app dialogs are initiated by the application itself and can be interacted with via standard Appium commands. However, there are occasions
 * when a dialog is initiated by the operating system, rather than the app. An example of this is the "Touch/Face ID" permission dialog on iOS. This is happening
 * with `appium-xcuitest-driver` V6 and higher.
 * Since this dialog is outside the app's context, normal Appium interactions within the app context won't work. To interact with such dialogs, a strategy is to switch
 * the interaction context to the home screen. The `executeInHomeScreenContext` function is designed for this purpose. For iOS, it temporarily changes the
 * interaction context to the home screen (com.apple.springboard), allowing interaction with the system dialog, and then switches back to the original app context
 * post-interaction.
 * Src: https://appium.github.io/appium-xcuitest-driver/latest/guides/troubleshooting/#interact-with-dialogs-managed-by-comapplespringboard
 */
export async function executeInHomeScreenContext(action:() => Promise<void>): Promise<any> {
    // For Android, directly execute the action as this workaround isn't necessary
    if (driver.isAndroid) {
        return action();
    }

    // Retrieve the currently active app information
    const activeAppInfo: AppInfo = await driver.execute('mobile: activeAppInfo');
    // Switch the active context to the iOS home screen
    await driver.updateSettings({ 'defaultActiveApplication': 'com.apple.springboard' });
    let result;

    try {
        // Execute the action in the home screen context
        result = await action();
    } catch (e) {
        // Ignore any exceptions during the action
    }

    // Revert to the original app context
    await driver.updateSettings({ 'defaultActiveApplication': activeAppInfo.bundleId });

    return result;
}
