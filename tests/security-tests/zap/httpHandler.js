
// This script will handle
// 1. the hostname change before sending each request to backend app with in docker network
// 2. Add different auth tokens based on resource uri for different endpoints
// 3. print out each/every request/response for all messages.

// It is a good option when trying to debug issues encountered when running ZAP in automation.
//
// The sendingRequest and responseReceived functions will be called for all requests/responses sent/received by ZAP,
// including automated tools (e.g. active scanner, fuzzer, ...)

// To use this script in the Docker packaged scans use the scan-hook zap_hook.py
// This script can be used outside of docker but if so change the /zap/wrk/ (mounted volume path) to current directory

// This script uses a mix of both javascript and java sdk together as it is using oracle nashhorn engine.

// 'initiator' is the component the initiated the request:
//              1       PROXY_INITIATOR
//              2       ACTIVE_SCANNER_INITIATOR
//              3       SPIDER_INITIATOR
//              4       FUZZER_INITIATOR
//              5       AUTHENTICATION_INITIATOR
//              6       MANUAL_REQUEST_INITIATOR
//              7       CHECK_FOR_UPDATES_INITIATOR
//              8       BEAN_SHELL_INITIATOR
//              9       ACCESS_CONTROL_SCANNER_INITIATOR
//              10      AJAX_SPIDER_INITIATOR
// For the latest list of values see the HttpSender class:
// https://github.com/zaproxy/zaproxy/blob/main/zap/src/main/java/org/parosproxy/paros/network/HttpSender.java
// 'helper' just has one method at the moment: helper.getHttpSender() which returns the HttpSender
// instance used to send the request.

var SEP = '\n ---------------------------------';
var Files = Java.type('java.nio.file.Files');
var Paths = Java.type('java.nio.file.Paths');
var StandardOpenOption = Java.type('java.nio.file.StandardOpenOption');
var System = Java.type('java.lang.System');
var env = System.getenv();

// Expected to create a folder path build/zap with right permissions to create the log file or append to it if one
// already exists
var f = Paths.get('/zap/wrk/test-results/req-resp-log.txt');
function appendToFile(str) {
    Files.write(f, str.toString().getBytes(), StandardOpenOption.CREATE, StandardOpenOption.APPEND);
}

function sendingRequest(msg, initiator, helper) {
    var urlRegEx = /client_login/;
    var targetDomain = System.getenv("app_domain");
    var header = msg.getRequestHeader()
    var headerParts = header.toString().split(' ')
    var url = headerParts[1]
    var urlParts = url.split(targetDomain + '/')
    if (urlParts.length === 2) {
        // logic to override localhost with docker network service/container/hostname to access fis app inside zap
        // docker container
        msg.getRequestHeader().setHeader('X-ZAP-Forward', urlParts)
        headerParts[1] = urlParts.join(System.getenv("app_domain") + '/')
        msg.setRequestHeader(headerParts.join(' '))

        // logic to handle different token for management and oracle token endpoints
        if(urlParts[1].toString().match(urlRegEx) != null) {
            msg.getRequestHeader().setHeader("Authorization", "Bearer " + System.getenv("api_auth_token"));
        } 
    }

    // Print everything on one line so that threads don't mix the request output
    appendToFile(SEP + 'ZAP Request Init=' + initiator + '\n' +
            msg.getRequestHeader().toString() +
            SEP + 'ZAP Request Body\n' +
            msg.getRequestBody().toString() +
            SEP + 'ZAP Request End');
}

function responseReceived(msg, initiator, helper) {
    // Print everything on one line so that threads don't mix the response output
    appendToFile(SEP + 'ZAP Response Init=' + initiator + '\n' +
            msg.getResponseHeader().toString() +
            SEP + 'ZAP Response Body\n' +
            msg.getResponseBody().toString() +
            SEP + 'ZAP Response End');
}