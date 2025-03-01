<template>
	<view class="pd16_15">
		<block v-for="(item,index) in listData" :key="index">
		<view class="box pd16_15 alcenter" style="margin-bottom: 30upx;">
			<view class="flex space" style="width: 100%;">
				<view style="width: 70%;">
					<view class=""><text class="cl-notice mr10">{{$t('Create time')}} : </text>{{item.createtime}}</view>
					<view class="mt8"><text class="cl-notice mr10">{{$t('cash.realname')}} : </text>{{item.name}} </view>
					<view class="mt8"><text class="cl-notice mr10">{{$t('cash.account')}} : </text>{{item.cord}}</view>
					<view class="mt8">
						<text class="cl-notice mr10">{{$t('cash.fee')}} : </text>{{item.sxf}}
					</view>
				</view>
				<view class="uni-triplex-right">
					<view class="text-right">{{item.type}}</view>
					<view class="text-right cl-info2 mt8">{{item.money}} USD</view>
					<view class="text-right cl-price mt8 ftw600">{{item.moneydz}} USD</view>
					<view class="text-right mt8">
						<text class="cl-blue" v-if="item.status==1">{{$t('cash.status1')}}</text>
						<text class="cl-green" v-if="item.status==2">{{$t('cash.status2')}}</text>
						<text class="cl-yellow" v-if="item.status==3">{{$t('cash.status3')}}</text>
					</view>
				</view>
			</view>
			<view v-if="item.memoj" class="mt8" style="width: 100%;">
				<text class="ft12 cl-notice">{{$t('Memo')}}</text>
				<text class="ft12 cl-main">{{item.memoj}}</text>
			</view>
		</view>
		</block>	
		<uni-load-more :status="status" :content-text="moreText" />
	</view>
</template>
<script>
	  export default {
	    data() {
	        return {
	            listData: [],
				last_id: 0,
				reload: true,
				status: 'more'
	        }
	    },
	    onReachBottom() {
	    	this.status = 'more';
	    	this.getList();
	    },
		
	    onLoad() {
	    	this.getList();
	    },
		onShow() {
			uni.setNavigationBarTitle({
			    title: this.$t('fenxiao.txlog')
			});
		},
		methods: {
			async getList() {
				let data = {};
				var limit=10;
				if (this.last_id>0) {
					this.status = 'loading';
					data.offset = this.last_id*limit;
				}
				data.limit=limit		
				let [err,res] =await this.$httpas.get('/api/agent/txlog',data,{token:1});
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
			}
		}
	}
</script>

<style>
	.uni-title{
		color: #444;
		font-size: 32upx;
		font-weight: normal;
	}
	.uni-text{
		font-size: 28upx;
	}
	.uni-h5{
		font-size: 32upx;
		color: #3a3a3a;
		font-weight:500;
	}
</style>