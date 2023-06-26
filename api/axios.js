import axios from 'axios'

axios.defaults.timeout = 5000;

export const base_url = "http://localhost:8090/Pet"
// export const base_url = "http://47.120.4.106:8090/Pet"

//添加请求拦截器， 在请求头中加token
// axios.interceptors.request.use(
// 	config => {
// 		if (uni.getStorageSync('token')) {
// 			config.headers.token = uni.getStorageSync('token');
// 		}
// 		return config;
// 	},
// 	error => {
// 		return Promise.reject(error);
// 	});

// axios.interceptors.response.use(
// 	response => {
// 		if (uni.getStorageSync('token') && response.data.statusCode == 600) {
// 			uni.removeStorageSync('token')
// 			return response;
// 		}
// 		if (response.data.statusCode != 200)
// 			return Promise.reject(response.data);
// 		return response;
// 	},
// 	error => {
// 		return Promise.reject(error);
// 	});

// export function getRequest(url, params) {
// 	return axios({
// 		method: "get",
// 		url: base_url + url,
// 		params: params,
// 	})
// }
// export function postRequest(url, params) {
// 	return axios({
// 		method: "post",
// 		url: base_url + url,
// 		params: params,
// 		header: {
// 			"Content-Type": "application/x-www-form-urlencoded",
// 		}
// 	})
// }
// export function postJsonRequest(url, params) {
// 	return axios({
// 		method: "post",
// 		url: base_url + url,
// 		data: params,
// 		header: {
// 			"Content-Type": "application/json",
// 		}
// 	})
// }



uni.addInterceptor('request', {
	success: function(config) {
		if (uni.getStorageSync('token') && config.data.statusCode === "600") {
			uni.removeStorageSync('token');
			return config;
		}
		return config
	},
	fail: function(error) {
		return Promise.reject(error);
	}
});



export function getRequest(url, params) {
	return new Promise((resolve, reject) => {
		const token = uni.getStorageSync("token")
		uni.request({
			method: 'GET',
			url: base_url + url,
			data: params,
			params: params,
			header: {
				"token": token
			},
			success: res => {
				if (res.data.statusCode !== "200") {
					reject(res.data);
				}
				resolve(res)
			},
			fail: err => {
				reject(err)
			}
		})
	})
}

export function postRequest(url, params) {
	return new Promise((resolve, reject) => {
		const token = uni.getStorageSync("token")
		uni.request({
			method: 'POST',
			url: base_url + url,
			data: params,
			header: {
				'Content-Type': 'application/x-www-form-urlencoded',
				"token": token
			},
			success: res => {
				if (res.data.statusCode !== "200") {
					reject(res.data);
				}
				resolve(res)
			},
			fail: err => {
				reject(err)
			}
		})
	})
}


export function postJsonRequest(url, params) {
	return new Promise((resolve, reject) => {
		const token = uni.getStorageSync("token")
		uni.request({
			method: 'POST',
			url: base_url + url,
			data: params,
			header: {
				'Content-Type': 'application/json',
				"token": token
			},
			success: res => {
				if (res.data.statusCode !== "200") {
					reject(res.data);
				}
				resolve(res)
			},
			fail: err => {
				reject(err)
			}
		})
	})
}