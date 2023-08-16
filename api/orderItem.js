const {
	postJsonRequest,postRequest,getRequest
} = require("./axios");

export function generateOrderItem(id) {
	return postJsonRequest('/orderItem/generate', id)
}

export function listOrderItem(id) {
	return getRequest('/orderItem/list', id)
}

export function toPay(id) {
	return postRequest('/orderItem/toPay', id)
}

export function cancelOrderItem(id) {
	return postRequest('/orderItem/cancelOrderItem', id)
}
export function confirm(id) {
	return postRequest('/orderItem/confirm', id)
}
export function toComment(id) {
	return postRequest('/orderItem/toComment', id)
}