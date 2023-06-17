const {
	postJsonRequest,postRequest,getRequest
} = require("./axios");


export function getCart(user) {
	return getRequest('/cart/getcart', user)
}

export function save(user) {
	return postRequest('/cart/save', user)
}

export function deleteById(user) {
	return postRequest('/cart/delete', user)
}
