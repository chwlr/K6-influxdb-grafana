import http from "k6/http";
import { sleep, check } from "k6";
import { accountLogin } from "./login.js";
import { Trend } from "k6/metrics";

// please change this later with your credential
let username = "chris.rondonuwu@nadihealth.com";
let password = "Made4mi890";
let API_TOKEN;

let myTrend = new Trend("transaction_time");
let urlbase = "https://staging.api.nadihealth.com";

export const options = {
    stages: [
      { duration: '1m', target: 10 }, // below normal load
      { duration: '2m', target: 10 },
      { duration: '1m', target: 20 }, // normal load
      { duration: '2m', target: 20 },
      { duration: '1m', target: 30 }, // around the breaking point
      { duration: '2m', target: 30 },
      { duration: '1m', target: 40 }, // beyond the breaking point
      { duration: '2m', target: 40 },
      { duration: '5m', target: 0 }, // scale down. Recovery stage.
    ],
  };

export default function () {
    if(API_TOKEN == null) {
        var res = accountLogin(username, password)
        var res_json = JSON.parse(res.body);
        API_TOKEN = res_json.token
    }

    const responses = http.batch([
        ['GET', `${urlbase}/v2/customer/eclinic/doctor/list`, null, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_TOKEN}` } }],
        ['GET', `${urlbase}/v1/customer/eclinic/clinic/list`, null, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_TOKEN}` } }]
    ]);

    check(responses, {
        'is status 200': (r) => r.status === 200,
    });
    console.log(responses)
    // myTrend.add(responses.timings.duration);
	sleep(0.1);
}





