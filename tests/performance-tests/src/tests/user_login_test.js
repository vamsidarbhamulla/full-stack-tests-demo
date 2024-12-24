import exec from "k6/x/exec";
import file from "k6/x/file";
import http from "k6/http";
import { testSummary, httpLog, testJSON } from "../libs/k6_core_utils.js";
import { httpResponseBody } from "../libs/api_utils.js";
import { describe, expect, randomItem } from "../libs/remote_modules.js";
import { currentDateInUtc } from "../libs/date_utils.js";
import sql from "k6/x/sql";
import driver from "k6/x/sql/driver/sqlite3";
import { Counter } from 'k6/metrics';

const errorCounter = new Counter('_response_errors_cnt');
const successCounter = new Counter('_response_success_cnt');
const totalCounter = new Counter('_response_total_cnt');

const db = sql.open(driver, "../../backend/database.db");

const requestName = __ENV.REQUEST_NAME || "login";
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
          [`user_login_${TestType.hp}_test`]: {
            executor: 'per-vu-iterations',
            vus: 1,
            iterations: 1,
            maxDuration: '10m',
          },
        };
      break;
    case TestType.std:
      executionOptions = {
        [`user_login_${TestType.std}_stress_test`]: {
          executor: 'ramping-arrival-rate',
          startRate: 1,
          timeUnit: __ENV.REQUEST_DURATION || '1s', 
          preAllocatedVUs: 500,
          maxVUs: 1000,
          stages: [
            { duration: '1m', target: 300 }, // below normal load
            { duration: '2m', target: 300 },
            { duration: '1m', target: 600 }, // normal load
            { duration: '2m', target: 600 },
            { duration: '1m', target: 1200 }, // around the breaking point
            { duration: '2m', target: 1200 },
            { duration: '1m', target: 1800 }, // beyond the breaking point
            { duration: '2m', target: 1800 },
            { duration: '2m', target: 0 }, // scale down. Recovery stage.
          ],
          gracefulStop: '2m',
        },
      };
      break;
    case TestType.ci:
    default:
      executionOptions = {
        [`user_login_${TestType.ci}_load_test`]: {
          executor: 'constant-arrival-rate',
          duration: '1m',
          rate: 500,
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
    // console.log('setup', __ENV);
    const defaultDirName = "test-results/user-login";
    const testStartTime = currentDateInUtc();
    const dirName = `${defaultDirName}/${testStartTime.replace(/[ :]/g, "-")}`;
    const filePath = "req-res.json"; 
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
    const rows = describe("Load test for user login", () => {
        console.log("Load test for user login");
        return db.query(
        "SELECT userName, email, password FROM users LIMIT 10000",
      );
    });
    

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
        rows,
        resultFiles,
        testStartTime,
    };
    return setupData;
}

export default function testSuite(setupData) {
    const currentIterData = randomItem(setupData?.rows);
    const resultFiles = setupData.resultFiles;
    // console.log('setupData:', setupData);
    // console.log('currentIterData:', currentIterData);
    describe("[Auth Service]", () => {
        describe("should be able to login successfully", () => {
            let data = {
                userName: currentIterData.userName,
                email: currentIterData.email,
                password: currentIterData.password,
            };
            let url = `${__ENV.BASE_URL}/client_login`;
            let response = http.post(url, data, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });

            httpLog({
                response,
                isJsonBody: false,
                ...resultFiles,
                mockFlexible: false,
                testStartTime: setupData?.testStartTime,
            });

            const responseMessage = httpResponseBody(response);
            totalCounter.add(1);

            if (response?.status > 400 || response?.status < 200) {
                errorCounter.add(1);
                file.appendString(
                    `${resultFiles.dirName}/${resultFiles.errorFilePath}`,
                    `${currentIterData?.email}|${currentIterData?.userName}|${response?.status}|${responseMessage}\n`,
                );
            } else {
                successCounter.add(1);
                file.appendString(
                    `${resultFiles.dirName}/${resultFiles.successFilePath}`,
                    `${currentIterData?.email}|${currentIterData?.userName}|${response?.status}|${responseMessage}\n`,
                );
            }

            // console.log('res:', response);

            // Check if the response body contains "User Registered"
            expect(response?.status, "response status").to.equal(200);
            expect(
                response,
                "response is in json format",
            ).to.have.validJsonBody();
            expect(response?.json()?.token, "user login api auth token").to.not.be
                .null;
        });
    });
}

export async function tearDown(data) {
  console.log('testStartTime:', data.testStartTime);
  file.appendString(`${data.resultFiles.dirName}/${data.resultFiles.filePath}`, '\n]');
}

export const handleSummary = (data) => testSummary(data, "user_login");
