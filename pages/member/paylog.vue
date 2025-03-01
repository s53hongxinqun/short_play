<template>
	<view>
		<sub-tab :tabs="tabs" @change="changeIndex" :selectIndex="selectIndex" :scrollTop="scrollTop"></sub-tab>
	
		<view class="pd24_15" v-if="listData.length >0">
			<view v-for="(item,index) in listData" :key="index" class="pb24">
				<view class="box pd16_15 alcenter space">
					<view class="flex" style="width: 100%;">
						<view style="width: 75%;">
							<view class="ft14 cl-info">{{$t('OrderNo')}}：{{item.order_no}} </view>
							<view class="mt8 ft12 cl-info">{{$t('Product package')}}：<text class="ft14 cl-default">{{item.name}}</text></view>
							<view class="mt8 ft12 cl-info">{{$t('Time')}}：{{item.addtime}}</view>
						</view>
						<view class="uni-triplex-right" style="width: 25%; text-align: right; line-height: 40upx;">
							<text class="ft14 cl-style">{{item.money}} {{item.currency || 'USD'}}</text>
							<view class="ft14 cl-main mt20">{{item.paytype}}</view>
							<view class="ft14 cl-main mt10" v-if="item.status==1">{{$t('Paid')}}</view>
							<view class="ft14 cl-main mt10" v-else>{{$t('Unpaid')}}</view>
						</view>
					</view>
				</view>
			</view>
			<uni-load-more :status="status" :content-text="moreText" />
		</view>
		<com-empty v-else :title="this.$t('No results were found')"></com-empty>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				tabs:[this.$t('score.recharge'),this.$t('Activate membership')],
				selectIndex:0,
				scrollTop:0,
				listData: [],
				last_id: 0,
				reload: true,
				status: 'more'
			}
		},
		onLoad(){
			this.status = 'more';
			this.getList();
		},
		onReachBottom() {
			this.status = 'more';
			this.getList();
		},
		onShow() {
			uni.setNavigationBarTitle({
			    title: this.$t('score.recharge')
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
				data.type=this.selectIndex==0?'score':'vip'
				data.limit=limit
				let [err,res] =await this.$httpas.get('/api/user/payorders',data,{token:true});
				if (res.data.rows) {
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
				if(index==1){
					uni.setNavigationBarTitle({
					    title: this.$t('Activate membership')
					});
				}
				this.last_id=0
				this.reload=true
				this.listData=[];
				this.getList()
			}
		}
	}
</script>

<style>
	
	.order-time-line{
		padding-left: 0rpx;
	}
	.order-time-main{
		width: 100%;
		min-height: 100vh;
	}
	.order-list-item-tit{
		position: relative;
		height: 60rpx;
		line-height: 60rpx;
	}
	.order-list-item-tit .order-type{
		width: 60rpx;
		height: 60rpx;
		position: absolute;
		left: -90rpx;
		top: 0;
	}
	.order-list-item-l{
		width: 200rpx;
		height: 150rpx;
		border-radius: 8rpx;
		background: #F2F2F2;
	}
	.order-list-item-r{
		width: calc(100% - 200rpx);
		padding-left: 30rpx;
	}
	.pb24 {
	    padding-bottom: 40upx;
	}
</style>