import config from "@/common/config.js"
import {statics} from '../statics.js';
import {mapState} from 'vuex';
export const common = {
	data(){
		return {
			apiUrl:config.webUrl,
			staticUrl:config.webUrl+'/img/',
			statics:statics
		}
	},
	computed:{
		...mapState({
			siteconfig:state 		=> state.siteconfig,
			tempColor:state			=> state.tempColor,
			memberInfo:state   		=> state.member,
			inviteCode:state 		=> state.inviteCode
		}),
		memberToken(){
			if(this.memberInfo){
				return this.memberInfo.token
			}else{
				return null
			}
		},
		moreText() {
			return {
				contentdown: this.$t('loadmore.down'),
				contentrefresh: this.$t('loadmore.refresh'),
				contentnomore: this.$t('loadmore.nomore')
			}
		},
		checkLogin(){ //验证是否登录
			if(this.memberToken === null) return false;
			if(this.memberInfo == null) return false;
			return true;
		}
	},
	methods:{
		navLink(href){
			uni.navigateTo({
			  url: href,
			  fail () {
			    uni.switchTab({
			      url: href
			    })
			  }
			})
		},
		Needlogin(){
			uni.showToast({ title: this.$t('Please login first'),icon:"none" });
			setTimeout(function(){
				uni.navigateTo({
					url:'/pages/login/login'
				})
			},1000)
		},
		getPlat(){
			var plat='h5';
			// #ifdef APP-PLUS
				plat='app'
			// #endif
			// #ifdef MP
				plat='mp'
			// #endif
			uni.setStorageSync("plat",plat);
			return plat;
		},
		detail(vid,mid){
			uni.navigateTo({
				url:'/pages/video/detail?vid='+vid+'&mid='+mid
			})
		}
	}
}