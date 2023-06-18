const {
	postJsonRequest,postRequest,getRequest
} = require("./axios");


export function getCart(user) {
	return getRequest('/cart/getcart', user)
}

export function save(goodsId) {
	return postRequest('/cart/save', goodsId)
}

export function deleteById(goodsId) {
	return postRequest('/cart/delete', goodsId)
}
