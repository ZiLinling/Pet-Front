import Vue from 'vue'
import App from './App'
import uView from '@/uni_modules/uview-ui'
import {
	base_url
} from './api/axios'
import {
	getList
} from './api/store'

Vue.use(uView)
Vue.config.productionTip = false

App.mpType = 'app'

Vue.prototype.$base_url = base_url
getList().then((response) => {
	Vue.prototype.$store = response.data.data
})
const app = new Vue({
	...App
})
app.$mount()