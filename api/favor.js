const {

	getRequest,
	postRequest
} = require("./axios");
export function getList(pageNum, pageSize, type) {
	return getRequest('/favor/list', {
		pageNum,
		pageSize,
		type
	})
}

export function addFavor(itemId, type) {
	return postRequest('/favor/add', {
		itemId,
		type
	})
}


export function deleteFavor(id) {
	return postRequest("/favor/delete", {
		id
	})
}


export function checkFavor(itemId, type) {
	return getRequest("/favor/check", {
		itemId,
		type
	})
}