import faker from "k6/x/faker";
import exec from "k6/x/exec";
import file from "k6/x/file";
import http from "k6/http";
import { check } from "k6";
import { testSummary } from "../libs/k6_core_utils.js";
import { describe, expect } from "../libs/remote_modules.js";
import { currentDateInUtc } from "../libs/date_utils.js";

const requestName = __ENV.REQUEST_NAME || "registration";
const TestType = {
  hp: 'hp',
  std: 'std',
  ci: 'ci'
};

const scenario = __ENV.TEST_TYPE || 'hp';

function testOptions(testType) {
  let executionOptions = {};
  switch (testType) {
    case TestType.hp:
      executionOptions = {
          [`user_registration_${TestType.hp}_test`]: {
            executor: 'per-vu-iterations',
            vus: 1,
            iterations: 1,
            maxDuration: '10m',
          },
        };
      break;
    case TestType.std:
      executionOptions = {
        [`user_registration_${TestType.std}_stress_test`]: {
          executor: 'ramping-arrival-rate',
          startRate: 1,
          timeUnit: __ENV.REQUEST_DURATION || '1s', 
          preAllocatedVUs: 500,
          maxVUs: 1000,
          stages: [
            { duration: '1m', target: 50 }, // below normal load
            { duration: '2m', target: 50 },
            { duration: '1m', target: 100 }, // normal load
            { duration: '2m', target: 100 },
            { duration: '1m', target: 150 }, // around the breaking point
            { duration: '2m', target: 150 },
            { duration: '1m', target: 200 }, // beyond the breaking point
            { duration: '2m', target: 200 },
            { duration: '1m', target: 0 }, // scale down. Recovery stage.
          ],
          gracefulStop: '2m',
        },
      };
      break;
    case TestType.ci:
    default:
      executionOptions = {
        [`user_registration_${TestType.ci}_load_test`]: {
          executor: 'constant-arrival-rate',
          duration: '1m',
          rate: 10,
          timeUnit:  '1s',
          // Logic to calculate preAllocatedVUs
          // preAllocatedVUs = [median_iteration_duration * rate] + constant_for_variance
          // preAllocatedVUs = [60 sec * 10] + 50 = 600 + 50 = 650
          preAllocatedVUs: 200,
          maxVUs: 500,
          gracefulStop: '5m',
        },
      };
      break;
  }
  const currOptions = {
    ...executionOptions,
  };
  return currOptions;
}

export const options = {
   thresholds: {
        http_req_failed: ["rate<0.01"], // http errors should be less than 1%
        http_req_duration: ["p(95)<122"], // 95% of requests should be below 1.9s
    },
  setupTimeout: '5m',
  teardownTimeout: '5m',
  scenarios: testOptions(scenario),
};

export function setup() {
    const defaultDirName = "test-results/user-registration";
    const testStartTime = currentDateInUtc();
    const dirName = `${defaultDirName}/${testStartTime.replace(/[ :]/g, "-")}`;
    const filePath = "req-res.json"; // create-request
    const errorFilePath = "http-error.csv";
    const compareFilePath = "http-responses.csv";
    const requestFilePath = "http-requests.csv";
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
        `${dirName}/${testStartTime.replace(/[ :]/g, "-")}.log`,
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
                password: __ENV.DEFUALT_USER_PWD,
                phone: faker.person.phone(),
            };
            let url = `${__ENV.BASE_URL}/client_registeration`;
            let response = http.post(url, data, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });

            if(__ENV.CI === 'false' || __ENV.CI === false) {
              console.log("res:", __ENV.CI, data?.email, data?.userName, response?.json());
            }

            check(response, {
                "is status 200": (r) => r.status === 200,
                "response body": (r) =>
                    r?.body?.includes("User Registered") ||
                    r?.body?.includes("Email already Exist"),
            });

            // Check if the response body contains "User Registered"
            expect(response?.status, "status").to.equal(200);
            // expect(response, 'response').to.have.validJsonBody();
            // expect(response.json(), 'response body').to.have.validJsonBody();
            expect(
                response?.json()?.msg,
                "user registration api response",
            ).to.equal("User Registered");
        });
    });
}

export async function tearDown(data) {
  console.log('testStartTime:', data?.testStartTime);
  file.appendString(`${data.resultFiles.dirName}/${data.resultFiles.filePath}`, '\n]');
}

export const handleSummary = (data) => testSummary(data, "user_registration");
