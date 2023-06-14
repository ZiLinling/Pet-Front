const {
	postJsonRequest,postRequest,getRequest
} = require("./axios");


export function getGoods(Id) {
	return getRequest('/goods/getById', Id)
}