import Vue from 'vue'
import App from './App'
import store from './static/js/store/store.js';

//全局混入
import {common} from './static/js/mixin/common.js';
Vue.mixin(common);

//全局方法引入
import request from "./common/request.js";
Vue.prototype.$httpas = request;

import i18n from './common/i18n.js';
request.get('/api/index/lang_data',{}).then((result) => {
	let [err,res] = result;
	if(res.data.code == 1){
		let langs = res.data.data
		uni.setStorageSync('localeJson',langs);
		//设置默认语言
		let locale=uni.getStorageSync("locale")
		if(!locale){
			locale = Object.keys(langs)[0];
			uni.setStorageSync('locale',locale)
			i18n.locale = locale
			uni.setLocale(locale)
		}
		i18n.setLocaleMessage(locale, langs[locale])
	}
});

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	i18n,
    ...App,
	store
})
app.$mount()