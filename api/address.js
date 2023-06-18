const {
	postJsonRequest, getRequest,postRequest
} = require("./axios");
export function getListByUserId() {
	return getRequest('/address/list')
}

export function addAddress(param) {
	return postJsonRequest('/address/add', param)
}

export function updateAddress(param) {
	return postJsonRequest('/address/update', param)
}

export function deleteAddress(param){
	return postRequest("/address/delete",param)
}


