const {
	postJsonRequest,postRequest,getRequest
} = require("./axios");

export function pageByStoreId(pageNum,pageSize,storeId,type) {
	return postJsonRequest('/store/pageByStoreId', {pageNum,pageSize,storeId,type})
}