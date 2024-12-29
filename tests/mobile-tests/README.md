# mobile-tests-demo

##### Table of Contents  
[1. testing-stack](#testing-stack)  
[2. test-repo-dependencies](#repo-deps)  
[3. test-run-setup](#test-run)  

<a name="testing-stack"></a>  

## 1. Testing stack

- **webdriverio** - nodejs runner based test automation framework,    
- **appium** - mobile ui automation       
- **typescript** - test script creation  
- **eslint + prettier** - linting 
- **browserstack** - setup for ci flow


<a name="repo-deps"></a>

## 2. Test repo dependencies  
> **Note**   
> Need to run this step to install steps once for every new repo level dependencies added/updated   
```shell
npm install
```
> [!TIP]
> Use the [appium-installer](https://github.com/AppiumTestDistribution/appium-installer) package to setup Appium on your local machine. This will also help you configure Android Emulators.

> [!NOTE]
> You don't need Appium installed on you local machine When running test in a cloud

3. Create a `./apps` directory at the root of this project. Download the app files (`.zip` / `.apk`) into the `./apps` folder.

4. Adjust the configuration file(s) for [Android](./config/wdio.android.app.conf.ts) regarding the device configuration you've created on your local machine.

<a name="test-run"></a>   

## 3. Test run setup   
> **Warning**  
> Need to create a local file named **.local.env**  for config values under env folder
```shell
npm run android.app
```

## 4. Test Report 
```shell
npm run allure-report # create report
npm run allure-open # open report  allure-report/index.html is the report
```
 
