const {
	postJsonRequest,postRequest,getRequest
} = require("./axios");

export function orderItemGenerate(id) {
	return getRequest('/orderItem/generate', id)
}