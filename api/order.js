const {
	postJsonRequest,postRequest,getRequest
} = require("./axios");

export function generateOrder(id) {
	return postJsonRequest('/order/generate', id)
}