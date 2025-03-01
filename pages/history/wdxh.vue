<template>
	<view>
		<com-default :datasa="listData"></com-default>
		<uni-load-more :status="status" :content-text="moreText" />
	</view>
</template>

<script>
	  export default {
		data(){
			return {
				listData: [],
				last_id: 0,
				reload: true,
				status: 'more'
			}
		},
		onLoad(e){
			this.getList();
		},
		onReachBottom() {
			this.status = 'more';
			this.getList();
		},
		onShow() {
			uni.setNavigationBarTitle({
			    title: this.$t('usermenu.love')
			});
		},
		methods:{
			async getList() {
				let data = {};
				var limit=10;
				if (this.last_id>0) {
					this.status = 'loading';
					data.offset = this.last_id*limit;
				}
				data.limit=limit
				let [err,res] =await this.$httpas.get('/api/video/wdxh',data,{token:true});
				if (res.data.rows.length>0) {
					let list = res.data.rows;
					this.listData = this.reload ? list : this.listData.concat(list);
					this.reload = false;
					this.last_id = this.last_id+1;
					if(res.data.total<=this.last_id*limit){
						this.status = '';
					}else{
						this.status = 'more'
					}
				}else{
					this.status = '';
				}
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
		/* font-weight: 600; */
		background: #FF6600;
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