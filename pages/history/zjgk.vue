<template>
	<view>
		<sub-tab :tabs="tabs" @change="changeIndex" :selectIndex="selectIndex" :scrollTop="scrollTop"></sub-tab>
		<view class="" style="padding: 30upx 30upx 0px 30upx;">
			<block v-for="(value,key) in listData" :key="key">
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
		<uni-load-more :status="status" :content-text="moreText" />
	</view>
</template>

<script>
	  export default {
		data(){
			return {
				tabs:[this.$t('Last watch'),this.$t('My watch')],
				selectIndex:0,
				title:this.$t('Last watch'),
				scrollTop:0,
				listData: [],
				last_id: 0,
				reload: true,
				status: 'more'
			}
		},
		onLoad(e){
			if(e.selid){
				this.selectIndex=e.selid
			}
			this.status = 'more';
			this.getList();
			this.banners=uni.getStorageSync("config").banner
		},
		onPageScroll(e){
			this.scrollTop = e.scrollTop;
		},
		onReachBottom() {
			this.status = 'more';
			this.getList();
		},
		onShow() {
			uni.setNavigationBarTitle({
			    title: this.$t('Last watch')
			});
		},
		methods:{
			async getList(type) {
				let data = {};
				var limit=10;
				if (this.last_id>0) {
					this.status = 'loading';
					data.offset = this.last_id*limit;
				}
				data.limit=limit	
				var logtype = this.selectIndex==1?'recordlist':'videolog'
				let [err,res] =await this.$httpas.get('/api/video/'+logtype,data,{token:true});
				if (res.data.rows.length>0) {
					let list = res.data.rows;
					this.listData = this.reload ? list : this.listData.concat(list);
					this.reload = false;
					this.last_id = this.last_id+1;
					if(res.data.total<this.last_id*limit){
						this.status = 'nomore';
					}
				}else{
					this.status = 'nomore';
				}
			},
			changeIndex(index){
				this.selectIndex = index;
				if(index==0){
					this.title=this.$t('Last watch')
				}else{
					this.title=this.$t('My watch')
				}
				uni.setNavigationBarTitle({
				    title: this.title
				});
				this.last_id=0
				this.reload=true
				this.getList()
			}
		}
	}
</script>

<style>
.integral-mall-goods{
		width: 100%;
		height: 280rpx;
		background: #F2F2F2;
		border-radius: 16upx;
	}
	.user-not-vip{
		width: 100%;
		height: 80rpx;
		background: #FDF6EC;
		border-radius: 40rpx;
		border: 2rpx solid #EFC381;
		text-align: center;
		line-height: 76rpx;
		font-size: 24rpx;
		color:#000000;
		font-weight: bold;
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
	.search-result {
			padding-top: 10px;
			padding-bottom: 20px;
			text-align: center;
		}
	
		.search-result-text {
			text-align: center;
			font-size: 14px;
			color:#666;
		}
	
		.example-body {
			/* #ifndef APP-NVUE */
			display: block;
			/* #endif */
			padding: 0px;
		}
	
		.uni-mt-10 {
			margin-top: 10px;
		}
</style>