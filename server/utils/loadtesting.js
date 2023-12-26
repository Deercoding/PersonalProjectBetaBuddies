import http from "k6/http";
import { sleep } from "k6";

export const options = {
  thresholds: {
    http_req_failed: ["rate<0.01"], // http errors should be less than 1%
    http_req_duration: ["p(95)<100"], // 95% of requests should be below 200ms
  },
  // 1. smoke test - test the result
  vus: 1,
  duration: "5s",

  // 2. average load test
  stages: [
    { duration: "5m", target: 100 },
    { duration: "30m", target: 100 },
    { duration: "5m", target: 0 },
  ],
  // 3. Stress testing
  stages: [
    { duration: "10m", target: 500 },
    { duration: "30m", target: 500 },
    { duration: "5m", target: 0 },
  ],
};

export default function () {
  let response = http.get("https://deercodeweb.com/api/search");
  // console.log(response);
  sleep(1);
}
