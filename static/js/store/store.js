import Vue from 'vue';
import  Vuex  from 'vuex';
Vue.use(Vuex);
import config from "@/common/config.js";

const store = new Vuex.Store({
	state : {
		siteconfig: "",
		tempColor: '#ff007f',//模板风格颜色
		tabBar:null,//底部菜单
		member:uni.getStorageSync('userinfo') ? uni.getStorageSync('userinfo') : null,
		inviteCode:null,//邀请码
	},
	getters: {
		siteconfig: state => state.siteconfig,
	},
	mutations:{
		setConfig(state, data) {
			state.siteconfig = data
		},
		setTemp(state,param){
			state.tempColor = param;
		},
		setTabBar(state,param){
			state.tabBar = param;
		},
		changeTabBar(state,param){
			let bars = state.tabBar
			for(let i=0;i<bars.length;i++){
				if(param.index==i){
					bars[i].cur=1
				}else{
					bars[i].cur=0
				}
			}
			state.tabBar = bars;
		},
		setMember(state,param){
			state.member = param;
			uni.setStorageSync('userinfo', param);
		},
		logout(state){
			uni.removeStorageSync('userinfo');
			state.member = null;
		},
		setInviteCode(state,param){
			state.inviteCode = param;
		}
	},
	actions:{
		async getConfig(context){
			const result = await new Promise((resolve, reject) => {
				let data = {
					plat:uni.getStorageSync('plat')
				};
				uni.request({
					url:config.webUrl+'/api/common/siteconfig',
					data,
					success: (res) => {
						if(res.data){
							context.commit('setConfig', res.data)
							resolve(res.data)
						} else {
							reject(res)
						}
					}
				})
			})
			return result
		},
		getTabbar (context) {
			let lang =uni.getStorageSync('locale')?uni.getStorageSync('locale'):'en'
			let data = {
				type:0,
				lang,
				plat:uni.getStorageSync('plat')
			};
			uni.request({
				url:config.webUrl+'/api/index/navmenu',
				data,
				success: (res) => {
					if(res.data.code === 1){
						context.commit('setTabBar', res.data.data)
					}
				}
			})
		},
		async getUser (context) {
			const result = await new Promise((resolve, reject) => {
				let lang =uni.getStorageSync('locale')?uni.getStorageSync('locale'):'en'
				let data ={
						token:context.state.member.token,lang
					}
				uni.request({
					url:config.webUrl+'/api/user/index',
					data,
					success: (res) => {
						if(res.data.code==1){
							let userinfo = res.data.data
							context.commit('setMember', userinfo)
							resolve(res)
						}else if(res.data.code==401){
							context.commit('setMember', null)
						} else {
							reject(res)
						}
					},
					fail: (err) => {
					  reject(err);
					}
				})
			})
			return result
		}
	}
});

export default store