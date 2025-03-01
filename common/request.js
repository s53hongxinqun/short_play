// 引入配置文件
import config from "./config.js";
export default{
	config:{
		baseUrl:config.webUrl,
		header:{
			'Content-Type':'application/json;charset=UTF-8',
			'Content-Type':'application/x-www-form-urlencoded'
		},
		data: {},
		method: "GET",
		dataType: "json",
	},
	request(options = {}){
		options.header = options.header || this.config.header;
		options.method = options.method || this.config.method;
		options.dataType = options.dataType || this.config.dataType;
		options.url = this.config.baseUrl+options.url;
		// TODO：token增加等操作
		if (options.token && uni.getStorageSync("userinfo")) {
			options.data.token = uni.getStorageSync("userinfo").token;
		}
		options.data.plat= uni.getStorageSync("plat")
		
		var lang =uni.getStorageSync('locale')?uni.getStorageSync('locale'):'en'
		//console.log(lang)
		options.header['Accept-Language'] = lang
		
		return uni.request(options).then(res => {
			return res;
		});
	},
	get(url,data,options={}){
		options.url = url;
		options.data = data;
		options.method = 'GET';
		return this.request(options);
	},
	post(url,data,options={}){
		options.url = url;
		options.data = data;
		options.method = 'POST';
		return this.request(options);
	},
	
	// 错误处理
	errorCheck(err,res,errfun = false,resfun = false){
		if (err) {
			typeof errfun === 'function' && errfun();
			uni.showToast({ title: '加载失败',icon:"none" });
			return false;
		}
		if (res.data.code==401) {
			typeof errfun === 'function' && resfun();
			uni.showToast({ title: res.data.msg,icon:"none" });
			return false;
		}
		return true;
	}
}