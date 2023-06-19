import axios from 'axios'

axios.defaults.timeout = 5000;

export const base_url = "http://localhost:8090/Pet"
// const base_url = "http://10.22.197.8:8888/BackEnd"

// 添加请求拦截器，在请求头中加token
axios.interceptors.request.use(
	config => {
		if (uni.getStorageSync('token')) {
			config.headers.token = uni.getStorageSync('token');
		}
		return config;
	},
	error => {
		return Promise.reject(error);
	});

axios.interceptors.response.use(
	response => {
		if (uni.getStorageSync('token') && response.data.statusCode == 600) {
			uni.removeStorageSync('token')
			return response;
		}
		if (response.data.statusCode != 200)
			return Promise.reject(response.data);
		return response;
	},
	error => {
		return Promise.reject(error);
	});

export function getRequest(url, params) {
	return axios({
		method: "get",
		url: base_url + url,
		params: params,
	})
}
export function postRequest(url, params) {
	return axios({
		method: "post",
		url: base_url + url,
		params: params,
		header: {
			"Content-Type": "application/x-www-form-urlencoded",
		}
	})
}
export function postJsonRequest(url, params) {
	return axios({
		method: "post",
		url: base_url + url,
		data: params,
		header: {
			"Content-Type": "application/json",
		}
	})
}