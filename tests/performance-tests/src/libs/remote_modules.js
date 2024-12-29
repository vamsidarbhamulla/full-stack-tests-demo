/**
 * Keeping all k6 jslib remote modules to be exported from one place for better version maintenance
 * To get more info on the available remote module libs refer: https://jslib.k6.io/
 * TODO: Need to find a better solution to import the remote modules to actual files for below reasons
 * 1. To avoid remote url dependencies with dynamic download at runtime to avoid pipeline failures.
 * 2. To keep the actual dependencies cached for no test metrics impact.
 * One option is to explore: xk6-cache lib: https://github.com/szkiba/xk6-cache
 * or build a customized solution in go-lang or javascript + webpack + babel
 **/
import * as papa from "https://jslib.k6.io/papaparse/5.1.1/index.js";
export const papaparse = papa;
export { URL } from "https://jslib.k6.io/url/1.0.0/index.js";
export { Httpx, Post } from "https://jslib.k6.io/httpx/0.1.0/index.js";
export {
    describe,
    expect,
} from "https://jslib.k6.io/k6chaijs/4.3.4.3/index.js";
export { AWSConfig, S3Client } from "https://jslib.k6.io/aws/0.13.0/s3.js";
export {
    uuidv4,
    randomIntBetween,
    randomItem,
    tagWithCurrentStageIndex,
    tagWithCurrentStageProfile,
} from "https://jslib.k6.io/k6-utils/1.4.0/index.js";
export {
    textSummary,
    jUnit,
} from "https://jslib.k6.io/k6-summary/0.1.0/index.js";
export { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
