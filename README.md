# full-stack-tests-demo

This is a test automation repo with web, mobile, rest-api, performance and security testing.

##### Table of Contents
[1. repo-structure](#repo-structure)<br />
[2. mobile-tests](./tests/mobile-tests/README.md)<br />
[3. web-tests](./tests/web-tests/README.md)<br />
[4. performance-tests](./tests/performance-tests/README.md)<br />
[5. security-tests](./tests/security-tests/README.md)<br />
[6. mobile-performance-tests](./tests/docs/mobile-performance-tests/README.md)<br />
[7. web-app-functional-test-observations](./tests/docs/web-app/Web-app-observations.md)<br />
[8. mobile-app-functional-test-observations](./tests/docs/mobile-app/Mobile-app-observations.md)<br /> 
[9. test-management](./tests/docs/test-management/README.md)<br />
[10. mobile-tests-results](./tests/mobile-tests/docs)<br />
[11. web-tests-results](./tests/web-tests/docs)<br />
[12. performance-tests-results](./tests/performance-tests/docs)<br />

![](https://...Dark.png)  |  ![](https://...Ocean.png)

[![Android Emulator Tests](https://github.com/vamsidarbhamulla/full-stack-tests-demo/actions/workflows/mobile-test.yml/badge.svg)](https://github.com/vamsidarbhamulla/full-stack-tests-demo/actions/workflows/mobile-test.yml) | [![Web & Api Tests](https://github.com/vamsidarbhamulla/full-stack-tests-demo/actions/workflows/web-test.yml/badge.svg)](https://github.com/vamsidarbhamulla/full-stack-tests-demo/actions/workflows/web-test.yml)<br />

[![Performance Tests](https://github.com/vamsidarbhamulla/full-stack-tests-demo/actions/workflows/load-test.yml/badge.svg)](https://github.com/vamsidarbhamulla/full-stack-tests-demo/actions/workflows/load-test.yml)  |  [![Performance Tests with Docker](https://github.com/vamsidarbhamulla/full-stack-tests-demo/actions/workflows/load-test-docker.yml/badge.svg)](https://github.com/vamsidarbhamulla/full-stack-tests-demo/actions/workflows/load-test-docker.yml)<br />

<a name="repo-stucture"></a>

## repo structure 
The repo structure is shown below:
````
+ backend
    Python Flask Rest Api 
+ mobile-app
    + android 
        app for wikipedia sample    
+ tests
    + docs 
        + mobile-app
            - exploratory testing observations for wikipedia sample app
            - including bugs + screenshots
        + mobile-performance-tests
            - apptim desktop performance test-results
        + test-management
            - 5 different scenarios detailed test approach 
        + web-app
            - exploratory testing observations for owasp web app
            - including bugs + screenshots
    + mobile-tests
        - webdriverio + nodejs + appium automated tests
        - tests run against wikipedia sample android app
    + performance-tests
        - k6 + xk6 + xk6-sqlite3 driver + load tests
        - load test run against python+flask+rest-api backend client registration endpoint
        - stress test run against python+flask+rest-api backend client login endpoiny 
    + security-tests 
        - security vulnerabilities listed for python+flask+rest-api backend
        - shell script to run the tests 
+ web-app
    owasp juice shop web-app
    shell script to start a clean docker container for owasp juice shop
````