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