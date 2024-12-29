import { group, check } from "k6";
import { vu } from "k6/execution";
import exec from "k6/x/exec";
import file from "k6/x/file";
import { jUnit } from "../../node_modules/k6-junit/index.js";
import { htmlReport, textSummary } from "./remote_modules.js";
import { listProperties } from "./utils.js";

export function testJSON(res, isJsonBody = true) {
    try {
        const checkRes = res instanceof Object;
        if (!isJsonBody) {
            return checkRes;
        }
        const body = res.json();
        return checkRes && (body instanceof Array || body instanceof Object);
    } catch (error) {
        console.log("error:", error);
        return false;
    }
}

export function httpLog({
    response,
    filePath,
    isJsonBody,
    dirName,
    mockFlexible,
    testStartTime,
}) {
    const jsonBodyFlag = isJsonBody != null ? isJsonBody : true;
    const isMockFlag = mockFlexible != null ? mockFlexible : false;
    const debug = __ENV.SHOULD_LOG === "true" || "false";
    const dirname = dirName || "test-results";
    // TODO: Handle this call differently for logging between actual test method vs setup and teardown methods as instance object is not avalable in later methods
    // const logStr = `[VU ${vu.idInTest} iterTotal: ${instance.iterationsCompleted}, iterScenario: ${vu.iterationInScenario}] - ${new Date().toUTCString()}: response: ${JSON.stringify(response)}`;
    const logStr = `[VU ${vu.idInTest}, iterScenario: ${vu.iterationInScenario}] - ${new Date().toUTCString()}: response: ${JSON.stringify(response)}`;
    if (debug && debug === "true") {
        console.log(`${logStr}`);
    }

    // console.log(`url:${response.request.url} isJsonBody:${isJsonBody} jsonBodyFlag:${jsonBodyFlag}`);
    const jsonCheck = jsonBodyFlag
        ? "response & body : isJson"
        : "response: isJson";
    const isMockCheck = isMockFlag
        ? `is Mock Enabled?  ${__ENV.IS_MOCK === "true"} --> fixedDelay: ${__ENV.MOCK_DELAY}`
        : "Mock N/A";
    const parsedUrl = response.request.url.includes("password")
        ? response.request.url.split("password")[0]
        : response.request.url;
    const passed = check(response, {
        [`test start time : ${testStartTime}`]: () => true,
        [`request url : ${parsedUrl}`]: () => true,
        "response status : 200": (r) => r.status === 200,
        [`${jsonCheck}`]: (r) => testJSON(r, jsonBodyFlag),
        [`${isMockCheck}`]: () => true,
        // [`response error : ${response.error || response.status !== 200 ? '\n\t\tstatus-->' + response.status + '\n\t\terror-->' + response.error + '\n\t\tbody-->' + response.body : 'none'}`]: (r) => !r.error || r.status === 200,
        [`response error : ${response.error || response.status !== 200 ? "\n\t\tstatus-->" + response.status + "\n\t\terror-->" + response.error : "none"}`]:
            (r) => !r.error || r.status === 200,
    });

    let storeResult = false;
    switch (true) {
        case __ENV.IS_CI === "true" && !passed:
            storeResult = true;
            break;
        case __ENV.IS_CI === undefined || __ENV.IS_CI === "false":
            storeResult = true;
            break;
    }
    if (storeResult) {
        file.appendString(
            `${dirname}/${filePath}`,
            JSON.stringify(response, null, 4),
        );
        file.appendString(`${dirname}/${filePath}`, ",\n");
    }
}

export function log(
    response,
    shouldLog,
    isJsonBody = true,
    filePath = "rcsp-response.json",
) {
    httpLog({
        response,
        debug: shouldLog,
        isJsonBody,
        filePath,
        dirName: "results",
    });
}

export function customUtilGroup(name, f) {
    const start = new Date();
    group(name, f);
    return new Date() - start;
}

/**
 *
 * @param {*} data k6 summary results data object
 * @param {*} foldername results foldername
 * @returns object with htmlreport, junit xml & stdout testsummary report
 */
export function testSummary(data, foldername) {
    let dirname = `test-results/${foldername}`;
    const props = listProperties(data);
    if (props.includes("setup_data.resultFiles.dirName")) {
        dirname = `${data.setup_data.resultFiles.dirName}/${foldername}`;
    } 
    if (__ENV.IS_CI === "true" && props.includes("setup_data.resultFiles.defaultDirName")) {
        dirname = `${data.setup_data.resultFiles.defaultDirName}/${foldername}`;
    }
    exec.command("mkdir", ["-p", dirname]);
    const htmlfilename = `${dirname}/index.html`;
    const junitfilename = `${dirname}/junit.xml`;
    const logfilename = `${dirname}/run.log`;
    const jsonfilename = `${dirname}/run.json`;
    const jUnitoptions = {
        includeThresholds: true,
        testCasePassCondition: (passed, failed) => passed > 0 && failed === 0,
        maxGroupNestingLevel: 2,
    };
    return {
        [htmlfilename]: htmlReport(data),
        [junitfilename]: jUnit(data, jUnitoptions),
        [jsonfilename]: JSON.stringify(data),
        [logfilename]: textSummary(data, { indent: "-", enableColors: false }),
        stdout: textSummary(data, { indent: " ", enableColors: true }),
    };
}

export function defaultTestOptions() {
    return {
        noConnectionReuse: true,
        // summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(25)', 'p(50)', 'p(75)', 'p(95)', 'p(99)', 'p(99.50)'],
        summaryTrendStats:
            __ENV.IS_CI === "true"
                ? ["avg", "p(95)", "p(99)", "max", "med", "min"]
                : [
                      "avg",
                      "p(95)",
                      "p(99)",
                      "max",
                      "p(90)",
                      "p(75)",
                      "p(25)",
                      "med",
                      "min",
                  ],
    };
}

/**
   * A util function to distribute load across multiple test cases/scenarios with in the specific test
   * @param {[0.33, () => 'scenario 0 (33%)']} weightedFuncs
   * A 2D array with element containing % of the specific test to run and actual test function
   * @returns a test-case/task function for the current execution based on proposed percentage overall
   * Usage:
   * const getTaskFunc = weightedSwitch([
    [0.33, () => 'scenario 0 (33%)'],
    [0.33, () => 'scenario 1 (33%)'],
    [0.34, () => 'scenario 2 (34%)'],
    ]);
   */
export function weightedSwitch(weightedFuncs) {
    const funcIntervals = new Array(weightedFuncs.length);

    let weightSum = 0;
    for (let i = 0; i < weightedFuncs.length; i++) {
        funcIntervals[i] = {
            start: weightSum,
            end: weightSum + weightedFuncs[i][0],
            func: weightedFuncs[i][1],
        };
        weightSum += weightedFuncs[i][0];
    }

    if (Math.abs(weightSum - 1) > 0.0001) {
        throw new Error(
            "the sum of function weights should be 1 (100%), but is " +
                weightSum,
        );
    }

    return function (val) {
        let guess;
        let min = 0;
        let max = funcIntervals.length - 1;
        while (min <= max) {
            guess = Math.floor((max + min) / 2);

            if (val >= funcIntervals[guess].end) {
                min = guess + 1;
            } else if (val < funcIntervals[guess].start) {
                max = guess - 1;
            } else {
                return funcIntervals[guess].func;
            }
        }
    };
}
