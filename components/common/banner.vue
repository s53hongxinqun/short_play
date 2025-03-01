<template>
	<view>
		<swiper class="home-swiper-banner" indicator-color="rgba(255, 255, 255, 0.3)" indicator-active-color="#FFFFFF" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="500">
			<swiper-item v-for="(item,index) in banners" :key="index" @tap="link(item.url)">
				<image :src="item.src" mode="scaleToFill" ></image>
			</swiper-item>
			
		</swiper>
	</view>
</template>

<script>
	export default{
		props: ['banners'],
		data(){
			return {}
		},
		methods:{
			link(link){
				if(!link) return false
				if(link.indexOf('http') !=-1){
					link ='/pages/client/webva?url='+encodeURIComponent(link)
				}

				uni.navigateTo({
					url:link
				})
			}
		}
	}
</script>

<style>
	.home-swiper-banner{
		box-shadow: 0rpx 4rpx 32rpx 0rpx rgba(0, 0, 0, 0.04);
		border-radius: 16rpx;
		overflow: hidden;
		height: 400rpx;
	}
	.home-swiper-banner image{
		width: 100%;
		height: 400rpx;
	}
	@media only screen and (min-width: 992px) {
		.home-swiper-banner{
			height: 800rpx;
		}
		.home-swiper-banner image{
			height: 800rpx;
		}
	}
</style>
