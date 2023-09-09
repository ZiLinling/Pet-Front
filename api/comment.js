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
	console.log(222)
	return postRequest('/comment/addAdditional', user)
}

