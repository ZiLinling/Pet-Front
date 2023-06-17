const {
	postJsonRequest,postRequest,getRequest
} = require("./axios");


export function getPet(id) {
	return getRequest('/pet/getById', id)
}