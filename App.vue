<script>
	import Vue from 'vue'
	import { mapActions } from 'vuex'
	export default {
		data(){
			return {}
		},
		globalData:{
			$t:{}
		},
		onLaunch: function() {
			this.globalData.$t = str =>this.$t(str)
			this.getPlat();
			this.getConfig();
			this.getTabbar()
			this.hide_navbar();//公众号隐藏导航条
		},
		onShow: function() {
			//console.log('App Show')
		},
		onHide: function() {
			//console.log('App Hide')
		},
		methods:{
			...mapActions(['getTabbar','getConfig']),
			hide_navbar(){
				//#ifdef H5
				var ua = window.navigator.userAgent.toLowerCase();
				//公众号登录
				if(ua.match(/MicroMessenger/i) == 'micromessenger'){
					setTimeout(() => {
					    let style = document.createElement('style');
					    style.type = 'text/css';
					    style.innerHTML = "uni-page-head,.uni-page-head{display:none;}";
					    document.getElementsByTagName('head').item(0).appendChild(style);
					})
				}
				//#endif
			}
		}
	}
</script>

<style>
	/* #ifndef APP-PLUS-NVUE */
	@import url("./common/common.css");
	/* #endif */
</style>
