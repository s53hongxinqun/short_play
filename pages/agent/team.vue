<template>
	<view>
		<view class="flex space pd15">
			<text class="ft14 ftw600 cl-main">{{$t('fenxiao.direct')}}({{total}})</text>
			<text class="ft12">{{$t('fenxiao.indirect')}} {{indirect}}</text>
		</view>
		<view class="bd-line"></view>
		<view class="userlist pd15" v-if="listData.length >0">
			<block v-for="(value,index) in listData" :key="index">
			<view class="flex item alcenter">
				<image class="item-pic" mode="scaleToFill" :src="value.avatar"></image>
				<view class="item-text pl10" style="width: 500rpx;">
					<view class="flex space">
						<text class="ftw600">{{value.username}}</text>
						<text class="ml10">{{value.groupname}}</text>
					</view>
					<view class="ft12 cl-info mt5">{{value.nickname}}</view>
					<view class="ft12 cl-info mt5">{{value.createtime}}</view>
				</view>
			</view>
			</block>
			<uni-load-more :status="status" />
		</view>
		<com-empty v-else :title="this.$t('No results were found')"></com-empty>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				total:0,
				indirect:0,
				listData: [],
				last_id: 0,
				reload: true,
				status: 'more'
			}
		},
		onLoad(){
			this.indirect = uni.getStorageSync("agentinfo").indirect_user
			this.status = 'more';
			this.getList();
		},
		onReachBottom() {
			this.status = 'more';
			this.getList();
		},
		methods:{
			async getList() {
				let data = {status:1};
				
				var limit=10;
				if (this.last_id>0) {
					this.status = 'loading';
					data.offset = this.last_id*limit;
				}
				data.limit=limit
				
				let [err,res] =await this.$httpas.get('/api/agent/teams',data,{token:1});
				this.teamnum = res.data.teamnum
				this.total = res.data.total
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
.item{
	padding: 20rpx;
	background-color: white;
}
.item-pic{
	height: 130rpx;
	width: 130rpx;
	border-radius: 150rpx;
}
.ckbtn{
	text-align: center;
	padding: 8rpx 30rpx;
	background-color: #eeeeee;
	border-radius: 30rpx;
}
</style>