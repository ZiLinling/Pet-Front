const {
	postJsonRequest,postRequest,getRequest
} = require("./axios");


export function getCart(user) {
	return getRequest('/cart/getcart', user)
}