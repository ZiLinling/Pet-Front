const {
	postJsonRequest
} = require("./axios");

export function register(user) {
	return postJsonRequest('/user/register', user)
}

export function login(user) {
	return postJsonRequest('/user/login', user)
}