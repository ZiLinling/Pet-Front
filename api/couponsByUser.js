const {
	postJsonRequest,postRequest,getRequest
} = require("./axios");


export function add(user) {
	return postRequest('/couponsByUser/add', user)
}


export function getCoupons(user) {
	return getRequest('/couponsByUser/getCoupons', user)
}