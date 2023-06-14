const {
	postJsonRequest, getRequest,postRequest
} = require("./axios");

export function page(pageNum,pageSize,breedName,specie) {
	return postJsonRequest('/pet/page', {pageNum,pageSize,breedName,specie})
}
export function getCount(id) {
	return getRequest('/pet/getCount',{id})
}
export function getCountBySpecie(specie) {
	return getRequest('/pet/getCountBySpecie',{specie})
}