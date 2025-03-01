<template>
	<view>
		<view class="pl15 pr15" v-if="listData.length >0">
			<view class="box mt16 pd16_15" v-for="(datas,index) in listData" :key="index">
				<view class="order-list-item-tit" style="margin-bottom: 20upx;">
					<view class="flex alcenter space" >
						<view class="flex alcenter">
							<text class="ft14 cl-main">{{datas.out_trade_no}}</text>
						</view>
						<text class="ft14 ftw500">{{datas.status_means}}</text>
					</view>
				</view>
				<view class="flex">
					<image mode="aspectFill" class="order-list-item-l" :src="datas.img"></image>
					<view class="order-list-item-r">
						<view class="ft14 ftw600">{{datas.name}}</view>
						<view class="flex alcenter mt8" >
							<text class="ft16 cl-orange ftw600">{{datas.price}}</text>
							<text class="ml5 cl-info">{{$t('Score')}}</text>
						</view>
						<view class="mt8 cl-info2 ft12">{{datas.time}}</view>
					</view>
				</view>
				<view class="flex alcenter space mt16">
					<view v-if="datas.lx==2" class="btn-big plan btn-small">{{datas.fjname}}</view>
					<view v-if="datas.lx==1" class="btn-big plan btn-small">{{$t('Complete purchase')}}</view>
					<view class="btn-big btn-small" @click="detail(datas.sid,datas.smid)">{{$t('Play')}}</view>
				</view>
			</view>
			<uni-load-more :status="status"/>
		</view>
		<com-empty v-else :title="this.$t('No results were found')"></com-empty>
	</view>
</template>

<script>
	export default{
		data(){
			return {
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
			    title: this.$t('usermenu.buyvideo')
			});
		},
		methods:{
			async getList() {
				let data = {};
				var limit=6;
				if (this.last_id>0) {
					this.status = 'loading';
					data.offset = this.last_id*limit;
				}
				data.limit=limit		
				let [err,res] =await this.$httpas.get('/api/user/orderlists',data,{token:true});
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
			}
		}
	}
</script>
<style>
	.order-list-item-l{
		width: 180rpx;
		height: auto;
		margin-right: 5%;
		border-radius: 5px;
	}
</style>