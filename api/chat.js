const {
	postJsonRequest,postRequest,getRequest
} = require("./axios");


export function save(user) {
	return postJsonRequest('/chat/save', user)
}

export function listChat(user) {
	return getRequest('chat/list', user)
}