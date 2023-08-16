const {
	postJsonRequest,postRequest,getRequest
} = require("./axios");


export function save(user) {
	return postJsonRequest('/comment/add', user)
}

export function getListByGoodsId(user) {
	console.log("传的值",user)
	return getRequest('/comment/getListByGoodsId', user)
}