<template>
    <view>
        <web-view :src="url"></web-view>
    </view>
</template>
<script>
	export default{
		data(){
			return {
				url:''
			}
		},
		onLoad(option){
			if(option.url){
				this.url=option.url
			}
		},

		methods:{
			// 监听原生标题导航按钮点击事件
			onNavigationBarButtonTap(e) {
				const index = e.index;
				let curpages=getCurrentPages()
				if(curpages.length>1){
					uni.navigateBack()
				}else{
					this.navLink('/pages/index/index')
				}
			}
		}
	}
</script>