const {
	postJsonRequest,postRequest,getRequest
} = require("./axios");


export function getPet(id) {
	return getRequest('/pet/getById', id)
}
export function getPetByName(pageNum,pageSize,petName) {
	return getRequest('/pet/getPetByName', {pageNum,pageSize,petName})
}