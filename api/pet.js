const {
	postJsonRequest,
	postRequest,
	getRequest
} = require("./axios");


export function getPet(id) {
	return getRequest('/pet/getById', id)
}
export function getPetByName(pageNum, pageSize, petName) {
	return getRequest('/pet/getPetByName', {
		pageNum,
		pageSize,
		petName
	})
}

export function page(pageNum, pageSize, breedName, specie) {
	return postJsonRequest('/pet/page', {
		pageNum,
		pageSize,
		breedName,
		specie
	})
}
export function getCount(id) {
	return getRequest('/pet/getCount', {
		id
	})
}
export function getCountBySpecie(specie) {
	return getRequest('/pet/getCountBySpecie', {
		specie
	})
}

export function getBreed(specie) {
	return getRequest('/breed/getBreed', {
		specie
	})
}