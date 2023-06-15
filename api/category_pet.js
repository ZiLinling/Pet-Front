const {
	postJsonRequest, getRequest,postRequest
} = require("./axios");
export function getBreed(specie) {
	return getRequest('/breed/getBreed',{specie})
}