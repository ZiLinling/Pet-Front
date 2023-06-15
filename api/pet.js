const {
	postJsonRequest,postRequest,getRequest
} = require("./axios");


export function getPet(Id) {
	return getRequest('/pet/getById', {Id})
}