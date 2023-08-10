const {
	postJsonRequest,postRequest,getRequest
} = require("./axios");


export function saveMsg(user) {
	return postJsonRequest('/msg/save', user)
}

export function listMsg(user) {
	return getRequest('/msg/list', user)
}