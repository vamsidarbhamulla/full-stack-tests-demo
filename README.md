# full-stack-tests-demo

This is a test automation repo with web, mobile, rest-api, performance and security testing.

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

