# full-stack-tests-demo

This is a test automation repo with web, mobile, rest-api, performance and security testing.

[![Android Emulator Tests](https://github.com/vamsidarbhamulla/full-stack-tests-demo/actions/workflows/mobile-test.yml/badge.svg)](https://github.com/vamsidarbhamulla/full-stack-tests-demo/actions/workflows/mobile-test.yml)

[![Web & Api Tests](https://github.com/vamsidarbhamulla/full-stack-tests-demo/actions/workflows/web-test.yml/badge.svg)](https://github.com/vamsidarbhamulla/full-stack-tests-demo/actions/workflows/web-test.yml)

[![Performance Tests](https://github.com/vamsidarbhamulla/full-stack-tests-demo/actions/workflows/load-test.yml/badge.svg)](https://github.com/vamsidarbhamulla/full-stack-tests-demo/actions/workflows/load-test.yml)

[![Performance Tests with Docker](https://github.com/vamsidarbhamulla/full-stack-tests-demo/actions/workflows/load-test-docker.yml/badge.svg)](https://github.com/vamsidarbhamulla/full-stack-tests-demo/actions/workflows/load-test-docker.yml)

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
        + test-scenarios
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

##### Table of Contents  
[1. mobile-tests](./tests/mobile-tests/README.md)<br />
[2. web-tests](./tests/web-tests/README.md)<br />
[3. performance-tests](./tests/performance-tests/README.md)<br />
[4. security-tests](./tests/security-tests/README.md)<br />
[5. mobile-performance-tests](./tests/docs/mobile-performance-tests/README.md)<br />
[6. web-app-bug-reports](./tests/docs/web-app/Web-app-observations.md)<br />
[7. mobile-app-bug-reports](./tests/docs/mobile-app/Mobile-app-observations.md)<br /> 
[8. test-plan](./tests/docs/test-scenarios/README.md)<br />