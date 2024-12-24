import faker from "k6/x/faker";
import exec from "k6/x/exec";
import file from "k6/x/file";
import http from "k6/http";
import { check } from "k6";
import { testSummary } from "../libs/k6_core_utils.js";
import { describe, expect } from "../libs/remote_modules.js";
import { currentDateInUtc } from "../libs/date_utils.js";

export const options = {
    thresholds: {
        http_req_failed: ["rate<0.01"], // http errors should be less than 1%
        http_req_duration: ["p(95)<122"], // 95% of requests should be below 1.9s
    },
    scenarios: {
        health_check: {
            executor: "constant-arrival-rate",
            duration: "1s",
            rate: 1,
            timeUnit: "1s",
            preAllocatedVUs: 1000,
            maxVUs: 1500,
        },
    },
};

export function setup() {
    const defaultDirName = "test-results/user-registration";
    const testStartTime = currentDateInUtc();
    const dirName = `${defaultDirName}/${testStartTime.replace(/ /g, "_")}`;
    const filePath = "req-res.json"; // create-request
    const errorFilePath = "http-error.csv";
    const compareFilePath = "http-responses.csv";
    const requestFilePath = "http-requests.csv";
    const requestName = __ENV.REQUEST_NAME || "create";
    const successFilePath = `${__ENV.TEST_ENV}-${requestName}-success.csv`;
    const testStartTimeFilePath = `${__ENV.TEST_ENV}-${requestName}-test-starttime.json`;
    exec.command("mkdir", ["-p", dirName]);
    file.writeString(`${dirName}/${filePath}`, "[\n");
    file.writeString(
        `${dirName}/${errorFilePath}`,
        "email|userName|email|httpStatus|responseMessage\n",
    );
    file.writeString(
        `${dirName}/${successFilePath}`,
        "email|userName|email|httpStatus|responseMessage\n",
    );
    file.writeString(
        `${dirName}/${testStartTimeFilePath}`,
        JSON.stringify({ testStartTime }),
    );
    file.writeString(
        `${defaultDirName}/${testStartTimeFilePath}`,
        JSON.stringify({ testStartTime }),
    );
    file.writeString(
        `${dirName}/${testStartTime}.log`,
        `testStartTime=${testStartTime}`,
    );
    const resultFiles = {
        defaultDirName,
        dirName,
        filePath,
        errorFilePath,
        compareFilePath,
        requestFilePath,
        successFilePath,
    };
    const setupData = {
        resultFiles,
        testStartTime,
    };
    return setupData;
}

export default function testSuite() {
    describe("[Create Account Service]", () => {
        describe("should be able to register new user successfully", () => {
            let data = {
                fullName: faker.person.name(),
                userName: faker.internet.username(),
                email: faker.person.email(),
                password: "password",
                phone: faker.person.phone(),
            };
            let url = `${__ENV.BASE_URL}/client_registeration`;
            let response = http.post(url, data, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });

            console.log("res:", data.email, data.userName, response.json());

            check(response, {
                "is status 200": (r) => r.status === 200,
                "response body": (r) =>
                    r.body.includes("User Registered") ||
                    r.body.includes("Email already Exist"),
            });

            // Check if the response body contains "User Registered"
            expect(response.status, "status").to.equal(200);
            // expect(response, 'response').to.have.validJsonBody();
            // expect(response.json(), 'response body').to.have.validJsonBody();
            expect(
                response.json().msg,
                "user registration api response",
            ).to.equal("User Registered");
        });
    });
}

export async function tearDown(data) {
  console.log('testStartTime:', data.testStartTime);
  file.appendString(`${data.resultFiles.dirName}/${data.resultFiles.filePath}`, '\n]');
}

export const handleSummary = (data) => testSummary(data, "user_registration");
