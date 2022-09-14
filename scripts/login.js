import http from "k6/http";
import { group, sleep, check } from "k6";
import { Trend } from "k6/metrics";

// Default runtime options
export let options = {
	vus: 1,
	duration: '5s',
	thresholds: {
		transaction_time: ["avg<1000"], // Require transaction_time's average to be <1000ms
		http_req_duration: ["avg<2000"], // Require http_req_duration's average to be <2000ms
	}
};

// Create a Trend metric to hold transaction time data samples from the HTTP calls to the various end points
// Please see note below about this metric and the thresholds set in 'options' above
export let myTrend = new Trend("transaction_time");

// Base URL that we prepend to all URLs we use
export let urlbase = "https://testing.api.nadihealth.com";

// Think times, to slow down execution
export let thinktime1 = 0.1;
export let thinktime2 = 2.0;

// please change this later with your credential
let username = "chris.rondonuwu@nadihealth.com";
let password = "Made4mi123";

// use this function later on other script for login
export function accountLogin(username, password, debug) {
	var url = urlbase + "/v1/customer/auth/login";
	var payload = { email: username, password: password };
	var res = http.post(url, JSON.stringify(payload), { headers: { "Content-Type": "application/json" } });
	if (typeof debug !== 'undefined') {
		console.log("Login: status=" + String(res.status) + "  Body=" + res.body);
	}
	console.log(res)
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
		sleep(thinktime1);
	});
};
