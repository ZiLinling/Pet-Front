const {
	postJsonRequest,
	postRequest,
	getRequest,
	base_url
} = require("./axios");


export function getGoods(Id) {
	return getRequest('/goods/getById', Id)
}

export function getGoodsList(pageNum, pageSize, key, category, status) {
	return getRequest('/goods/getList', {
		pageNum,
		pageSize,
		key,
		category,
		status
	})
}

export function searchGoodsList(pageNum, pageSize, name) {
	return getRequest('/goods/searchList', {
		pageNum,
		pageSize,
		name
	})
}