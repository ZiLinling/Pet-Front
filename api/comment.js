const {
	postJsonRequest,postRequest,getRequest
} = require("./axios");


export function save(user) {
	return postJsonRequest('/comment/add', user)
}

export function getListByGoodsId(user) {
	return getRequest('/comment/getListByGoodsId', user)
}


export function addAdditional(user) {
	return postRequest('/comment/addAdditional', user)
}

export function getBestComment(user) {
	return postRequest('/comment/getBestComment', user)
}


