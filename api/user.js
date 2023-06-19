const {
	postJsonRequest,
	getRequest
} = require("./axios");

export function register(user) {
	return postJsonRequest('/user/register', user)
}

export function login(user) {
	return postJsonRequest('/user/login', user)
}

export function getUser() {
	return getRequest("/user/getUser")
}

export function updateUser(user) {
	return postJsonRequest("/user/update", user)
}