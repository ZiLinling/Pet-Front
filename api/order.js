const {
	postJsonRequest,postRequest,getRequest
} = require("./axios");

export function orderGenerate(id) {
	return getRequest('/order/generate', id)
}