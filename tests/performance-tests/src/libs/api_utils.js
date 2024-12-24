import { Httpx } from "./remote_modules.js";
import { Counter } from 'k6/metrics';

export function httpSession({ timeout } = { timeout: 60000 }) {
    return new Httpx({
        baseURL: __ENV.BASE_URL,
        headers: {
            "Content-Type": "application/json",
        },
        timeout,
    });
}

export function httpResponseBody(res, isJson = true) {
    let body;
    switch (true) {
        case res.status === 0 || res.body === null:
            body = {}; // timeout error returns null body
            break;
        case res.status === 401: {
            // 401 error returns empty body but provide error info in headers
            body = res.headers;
            break;
        }
        case res.status >= 500:
            // 500, 502 error returns html body
            // 503, 504 error returns string body
            body = res.body;
            break;
        default:
            body = isJson ? res.json() : res.body; // handle either json or xml responses
    }
    return body;
}

export function getMetrics() {
    const metrics ={
        httpResTotalCounter: new Counter('_response_total_cnt'),
        httpResEofErrCounter: new Counter('_response_error_cnt'),    
        httpResTimeoutCounter: new Counter('_response_error_timeout_cnt'),
        httpConnResetCounter: new Counter('_response_error_reset_cnt'),
        httpResStatus200Counter: new Counter('_response_http_200_cnt'),
        httpResStatus401Counter: new Counter('_response_http_401_err_cnt'),
        httpResStatus500Counter: new Counter('_response_http_500_err_cnt'),    
        httpResStatus400Counter: new Counter('_response_http_400_err_cnt'),    
        httpResStatus503Counter: new Counter('_response_http_503_err_cnt'),    
        httpResStatus504Counter: new Counter('_response_http_504_err_cnt'),
        httpResStatus502Counter: new Counter('_response_http_502_err_cnt'),    
        httpResStatus404Counter: new Counter('_response_http_404_err_cnt'),
    }

    return metrics;
}

export function buildMetrics(data, res, storeResponseError) {
  const status = res.status;
//   const req = data.requestJson;
  const metrics = getMetrics(data);
  metrics.httpResTotalCounter.add(1, { tag: `${metrics.httpResTotalCounter.name}` });

  switch (true) {
    case (status === 0 && res.error === 'EOF'):
      metrics.httpResEofErrCounter.add(1, { tag: `${metrics.httpResEofErrCounter.name}_response_eof_err` });
      storeResponseError(data, req, res);
      break;
    // error_code = 1050 equal to request timeout
    // More Details: https://k6.io/docs/javascript-api/error-codes/
    case (status === 0 && res.error_code === 1050):
      metrics.httpResTimeoutCounter.add(1, { tag: `${metrics.httpResTimeoutCounter.name}` });
      storeResponseError(data, req, res);
      break;
    // error_code = 1220 equal to connection reset by peer
    // More Details: https://k6.io/docs/javascript-api/error-codes/
    case (status === 0 && res.error_code === 1220):
      metrics.httpConnResetCounter.add(1, { tag: `${metrics.httpConnResetCounter.name}` });
      storeResponseError(data, req, res);
      break;
    case (status === 200):
      metrics.httpResStatus200Counter.add(1, { tag: `${metrics.httpResStatus200Counter.name}` });
      break;
    case (status === 400):
      metrics.httpResStatus400Counter.add(1, { tag: `${metrics.httpResStatus400Counter.name}` });
      storeResponseError(data, req, res);
      break;
    case (status === 401):
      metrics.httpResStatus401Counter.add(1, { tag: `${metrics.httpResStatus401Counter.name}` });
      storeResponseError(data, req, res);
      break;
    case (status === 500):
      metrics.httpResStatus500Counter.add(1, { tag: `${metrics.httpResStatus500Counter.name}` });
      storeResponseError(data, req, res);
      break;
    case (status === 502):
      metrics.httpResStatus502Counter.add(1, { tag: `${metrics.httpResStatus502Counter.name}` });
      storeResponseError(data, req, res);
      break;
    case (status === 503):
      metrics.httpResStatus503Counter.add(1, { tag: `${metrics.httpResStatus503Counter.name}` });
      storeResponseError(data, req, res);
      break;
    case (status === 504):
      metrics.httpResStatus504Counter.add(1, { tag: `${metrics.httpResStatus504Counter.name}` });
      storeResponseError(data, req, res);
      break;
    case (status > 400): // any other than 4xx/5xx http status error
      storeResponseError(data, req, res);
      break;
  }
}
