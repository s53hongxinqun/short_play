<template>
	<view>
		<sub-tab :tabs="typetab" @change="changeIndex" :selectIndex="selectIndex" :scrollTop="scrollTop"></sub-tab>
		<view class="" style="padding: 30upx 30upx 0px 30upx;">
			<block v-for="(value,key) in listData" :key="key">
			<view @click="detail(value.id,0)" style="position: relative;" class="flex alcenter mb16">
				<view class="vod-badge" :class="'bg' + key">{{key+1}}</view>
				<image mode="aspectFill" class="tuan-product-l" :src="value.img"></image>
				<view class="tuan-product-r pl15">
					<view class="vod-name">{{value.name}}</view>
					<view class="vod-desc cl-notice">{{value.text}}</view>
					<view class="flex space alcenter">
						<view class="ft14 cl-style" v-if="selectIndex==2">{{$t('Tap love')}}：{{value.give}}</view>
						<view class="ft14 cl-style" v-else>{{$t('Heat')}}：{{value.views}}</view>
						<view class="btn-vip-adviser ml15">{{$t('Watch')}}</view>
					</view>
				</view>
			</view>
			</block>
		</view>
		<view style="width: 100%; height: 30upx;"></view>
	</view>
</template>

<script>
	  export default {
		data(){
			return {
				typetab:[this.$t('Recommend dramas'),this.$t('Play ranking'),this.$t('Like Ranking')],
				selectIndex:0,
				stype:'ishot',
				title:this.$t('Recommend dramas'),
				scrollTop:0,
				searchValue:'',
				keytext:'',
				listData: []
			}
		},
		onLoad(e){
			if(e.stype){
				this.stype=e.stype
				if(this.stype=='top'){
					this.selectIndex=1
					this.title=this.$t('Play ranking')
				}
			}
			uni.setNavigationBarTitle({
			    title: this.title
			});
			this.getList()
		},
		methods:{
			async getList() {
				let data = {};
				var limit=15;
				data.limit=limit
				data.stype=this.stype
				let [err,res] =await this.$httpas.get('/api/video/lists',data);
				if (res.data.total>0) {
					this.listData = res.data.rows;
				}
			},
			changeIndex(index){
				this.selectIndex = index;
				if(index==1){
					this.stype='top'
					this.title=this.$t('Play ranking')
				}else if(index==2){
					this.stype='toplove'
					this.title=this.$t('Like Ranking')
				}else{
					this.stype='ishot'
					this.title=this.$t('Recommend dramas')
				}
				uni.setNavigationBarTitle({
				    title: this.title
				});
				this.getList()
			}
		}
	}
</script>

<style>
	.tuan-product-l{
		width: 120rpx;
		height: 160rpx;
		border-radius: 16rpx;
		background: #F2F2F2;
	}
	.vod-badge{width: 30rpx;height: 36rpx;border-radius:0 6rpx;position: absolute;left:0;top:0;color: white;
		z-index: 100;
		text-align: center;
		opacity: 0.8;
		font-weight: 600;
		font-size: 24rpx;
		background-color: #999999;
	}
	.vod-badge.bg0{background-color: red;}
	.vod-badge.bg1{background-color: orangered;}
	.vod-badge.bg2{background-color: orange;}
	.tuan-product-r{
		width: calc(100% - 150rpx);
	}
	
	.vod-name{font-size: 28rpx;margin-top: 8rpx;}
	.vod-desc{height: 70rpx;font-size: 24rpx;margin-top: 10rpx;overflow: hidden;}
	.btn-vip-adviser{
		width: 150rpx;
		height: 45rpx;
		border-radius: 30rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 24rpx;
		background: #ff007f;
		color:#FFFFFF;
	}
</style>