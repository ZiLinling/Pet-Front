const {
	postJsonRequest,postRequest,getRequest
} = require("./axios");


export function getCart(user) {
	return getRequest('/cart/getcart', user)
}

export function save(goodsId) {
	return postRequest('/cart/save', goodsId)
}

export function deleteByIds(goodsId) {
	return postRequest('/cart/delete', goodsId)
}

export function updateNum(num) {
	return postRequest('/cart/updateNum',num)
}

export function updateSelected(selected) {
	return postRequest('/cart/updateSelected', selected)
}
export function isAllSelected(selected) {
	return postRequest('/cart/allSelected', selected)
}