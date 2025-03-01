<template>
	<view>
		<view class="box pd10">
			 <view @tap="tolink('/pages/member/vip')">	
				 <view class="home-vip-tag-box">
					 <image class="bg" v-if="isLogin && userdata.group_id && userdata.group_id ==2" :src="statics.vipBgHas"></image>
					 <image class="bg" v-else :src="statics.vipbg"></image>
					 
					 <view v-if="isLogin && userdata.group_id && userdata.group_id ==2 " class="main plr15 flex alcenter space">
						 <view class="tag-has-vip flex alcenter center">
							 <image class="vip-level-icon" :src="statics.vipLevelImg[1]"></image>
							 <text class="vip-level-means">{{userdata.group_name}}</text>
						 </view>
						 <view class="flex mr30 alcenter">
							 <view class="ft12 mr15">{{$t('vip.tip3')}}{{userdata.dtime}}</view>
							 <image class="right-icon" :src="statics.rightIcon"></image>
						 </view>
					 </view>
					 
					 <view v-else class="main plr15 flex alcenter space">
						 <view class="tag-no-vip">
							 <text v-if="isLogin==true">{{userdata.group_name}}</text>
							 <text v-else>{{$t('Guest')}}</text>
						</view>
						<text class="text-center ftw600 cl-light">{{$t('vip.uptip')}}</text>
					 </view> 
				 </view>
			 </view>
			 <view class="mt24 flex space">
				 <view class="col3 text-center">
					<view @tap="tolink('/pages/member/integrallog')">
						<view class="ft18 ftw600 cl-style">{{score}}</view>
						 <view class="ft14 mt5">{{$t('Score')}}</view>
					 </view>
				 </view>
				 <view class="col2 flex alcenter center">
					 <view class="btn-big"  @tap="tolink('/pages/member/recharge')">{{$t('Recharge')}}</view>
					 <view class="btn-big plan" @tap="getkefu">{{$t('Kefu')}}</view>
				 </view>
				 
			 </view>
		</view>
	</view>
</template>

<script>
	export default{
		props:['userdata','isLogin'],
		data(){
			return {
				score:0
			}
		},
		updated() {
			if(this.userdata){
				this.score = this.userdata.score
			}
		},
		methods:{
			tolink(url){
				if(this.isLogin == false){
					uni.showToast({ title: this.$t('Please login first'),icon:"none" });
					setTimeout(function(){
						uni.navigateTo({
							url:'/pages/login/login'
						})
					},1000)
				}else{
					uni.navigateTo({
						url:url
					})
				}
			},
			getkefu(){
				let that=this
				let kefu=this.siteconfig.site.kefu;
				if(kefu.indexOf('http') == -1){
					uni.showModal({
						showCancel:false,
						content:kefu,
						success: function (res) {
							
						}
					});
					return
				}
				// #ifndef H5
				uni.navigateTo({
					url:'/pages/index/webva?url='+encodeURIComponent(kefu)
				})
				// #endif  
				// #ifdef H5
				window.location.href=kefu
				// #endif
			}
		}
	}
</script>

<style>
	.home-vip-tag-box{
		height: 100rpx;
		width: 100%;
		position: relative;
		overflow: hidden;
		border-radius: 8rpx;
	}
	.home-vip-tag-box .main{
		width: 100%;
		height: 100rpx;
		position: absolute;
		z-index: 2;
		left: 0;
		top: 0;
	}
	.home-vip-tag-box .bg{
		width: 100%;
		height: 100rpx;
	}
	.tag-no-vip{
		width: 128rpx;
		height: 40rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
		font-size: 24rpx;
		font-weight: 600;
		color:#8A8D99;
		text-align: center;
		line-height: 40rpx;
	}
	.tag-has-vip{
		width: 200rpx;
		height: 40rpx;
		background: linear-gradient(180deg, #333333 0%, #000000 100%);
		border-radius: 20rpx;
	}
	.tag-has-vip .vip-level-icon{
		width: 36rpx;
		height: 36rpx;
	}
	.tag-has-vip .vip-level-means{
		font-size: 24rpx;
		margin-left: 8rpx;
		font-weight: 500;
		background: linear-gradient(180deg, #F2DCA9 0%, #C79556 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}
	.btn-big{
		height: 60rpx;
		border-radius: 40rpx;
		margin-right: 15rpx;
		font-size: 14px;
	}
</style>
