import http from "k6/http";
import { group, sleep, check } from "k6";
import { Trend } from "k6/metrics";

let myTrend = new Trend("transaction_time");

// please change this later with your credential
let username = "chris.rondonuwu@nadihealth.com";
let password = "Made4mi890";

let urlbase = "https://staging.api.nadihealth.com";


// Default runtime options
export const options = {
    stages: [
      { duration: '2m', target: 5000 }, // normal load
      { duration: '6m', target: 5000 }, // steady
      { duration: '2m', target: 0 }, // around the breaking point
    ],
  };


// use this function later on other script for login
export function accountLogin(username, password, debug) {
	var url = urlbase + "/v1/customer/auth/login";
	var payload = { email: username, password: password };
	var res = http.post(url, JSON.stringify(payload), { headers: { "Content-Type": "application/json" } });
	if (typeof debug !== 'undefined') {
		console.log("Login: status=" + String(res.status) + "  Body=" + res.body);
	}
	return res;
};

// Exercise login endpoint when this test case is executed
export default function() {
	group("login", function() {
		var res = accountLogin(username, password);
		check(res, {
			"status is 200": (res) => res.status === 200,
			"login successful": (res) => JSON.parse(res.body).hasOwnProperty('token')
		});
		myTrend.add(res.timings.duration);
		sleep(0.1);
	});
};
