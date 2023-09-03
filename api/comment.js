const {
	postJsonRequest,postRequest,getRequest
} = require("./axios");


export function save(user) {
	return postJsonRequest('/comment/add', user)
}

export function getListByGoodsId(user) {
	return getRequest('/comment/getListByGoodsId', user)
}