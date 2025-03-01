<template>
	<view>
		<!-- 状态栏占位符 隐藏导航条时使用-->
		<view class="status_bar"> </view>
		<view class="pd16_15">
			<view>
				<view class="flex alcenter space">
					<view class="flex alcenter">
						<text class="ft16 ftw600 cl-main">{{$t('Last watch')}}</text>
					</view>
					<navigator url="/pages/history/zjgk">
					<view class="ft14 cl-notice">{{$t('More')}}</view>
					</navigator>
				</view>
				<view class="mt16 flex space">
					<block v-for="(value,key) in newsa" :key="key" v-if="key<3">
					<view class="box pb10" style="width:31%; position: relative; border-radius:20rpx;" @click="detail(value.vid,value.mid)">
						<image class="integral-mall-goods" mode="aspectFill" :src="value.img"></image>
						<view class="mt8 plr10 ft14 ftw400 text-center text-over cl-main">{{value.vname}}</view>
					</view>
					</block>	
			
				</view>
			</view>	
			<view class="mt24">
				<view class="flex alcenter space">
					<view class="flex alcenter">
						<text class="ft16 ftw600 cl-main">{{$t('My watch')}}</text>
					</view>
					<navigator url="/pages/history/zjjl">
					<view class="ft14 cl-notice">{{$t('More')}}</view>
					</navigator>
				</view>
				<view class="mt16">
					<block v-for="(value,key) in record" :key="key">
					<view @click="detail(value.vid,value.mid)" style="position: relative;" class="flex alcenter mb16">
						<image mode="aspectFill" class="tuan-product-l" :src="value.img"></image>
						<view class="tuan-product-r pl15">
							<view class="ft16 ftw600 cl-main text-over2">{{value.vname}}</view>
							<view class="mt16">
								<text class="ft14 cl-style">{{value.dqname}}</text>
							</view>
							<view class="mt16 flex space alcenter">
								<view class="ft14 cl-notice">{{value.mname}}</view>
								<view class="btn-vip-adviser bg-style ml15">{{$t('Watch now')}}</view>
							</view>
						</view>
					</view>
					</block>
				</view>
			</view>	
		</view>
		<com-footer></com-footer>
	</view>
</template>
<script>
	export default{
		data(){
			return {
				newsa:[],
				record:[],
			}
		},
		onShow() {
			uni.setNavigationBarTitle({
			    title: this.$t('tabbar.history')
			});
			this.getList();
			let this_=this
		},
		methods:{
			async getList() {
				let this_=this
				let data = {};
				if(this.memberToken){
					data.token = this.memberToken
				}
				let [err,res] =await this.$httpas.get('/api/video/history',data);
				if(res.data){
					this.newsa=res.data.new
					this.record=res.data.record
				}
			}
		},
	}
</script>

<style>
	.integral-mall-goods{
		width: 100%;
		height: 280rpx;
		background: #F2F2F2;
		border-radius: 16upx;
	}
	.tuan-product-l{
		width: 150rpx;
		height: 200rpx;
		border-radius: 16rpx;
		background: #F2F2F2;
	}
	.tuan-product-r{
		width: calc(100% - 150rpx);
	}
	.btn-vip-adviser{
		width: 150rpx;
		height: 60rpx;
		border-radius: 20rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
		color:#FFFFFF;
	}
</style>