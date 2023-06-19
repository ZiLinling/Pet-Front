const {
	postJsonRequest,postRequest,getRequest
} = require("./axios");

export function generateOrderItem(id) {
	return postJsonRequest('/orderItem/generate', id)
}