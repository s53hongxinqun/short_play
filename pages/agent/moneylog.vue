<template>
	<view>
		<view class="bg-style pb20">
			<view class="flex alcenter space pd20">
				<view class="cl-white">
					<view class="ft14">{{$t('My earnings')}}</view>
					<view class="mt16 flex alcenter">
						<text class="ft20 ftw600">{{userdata.money}}</text>
					</view>
				</view>
				<navigator url="./tixian" class="btn-integral">{{$t('Withdrawal')}}</navigator>
			</view>
		</view>
		<view class="box log-main">
			<view class="pd16_15 bd-bottom flex alcenter space">
				<text class="ft16 ftw600 cl-default">{{$t('Money record')}}</text>
				<picker mode="date" :value="date" :start="startDate" :end="endDate" fields="month" @change="bindDateChange">
					<view class="uni-input ft14 cl-info">{{date}}</view>
				</picker>
			</view>
			<view class="pd16_15" v-if="listData.length>0">
				<block v-for="(item,index) in listData" :key="index">
				<view class="pb16 mb16 bd-bottom flex alcenter space">
					<view class="cl-default">
						<view class="ft14">{{item.memo}}</view>
						<view class="mt8 ft12">{{item.createtime}}</view>
					</view>
					<view class="ft18 ftw600 cl-main">{{item.jzt}}{{item.money}}</view>
				</view>
				</block>
				<uni-load-more :status="status" />
			</view>
			
			<com-empty v-else :title="this.$t('No results were found')"></com-empty>
		</view>
	</view>
</template>

<script>
	  export default {
		data(){
			return {
			    listData: [],
				last_id: 0,
				reload: true,
				status: 'more',
				userdata:[],
				date: this.$t('Select'),
			}
		},
		onReachBottom() {
			this.status = 'more';
			this.getList();
		},
		onLoad() {
			this.getuser()
			this.getList();
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		methods:{
			async getuser(){
				let data = {};
				let [err,res] =await this.$httpas.get('/api/user/index',data,{token:1});
				if(res.data.code==1){
					this.userdata=res.data.data
				}	
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
				
				if (type === 'start') {
					year = year - 2;
				} else if (type === 'end') {
					year = year + 0;
				}
				month = month > 9 ? month : '0' + month;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}`;
			},
			bindDateChange: function(e) {
				this.date = e.detail.value
				this.last_id=0
				this.listData=[]
				this.getList()
			},
			async getList() {
				let data = {};
				var limit=10;
				if (this.last_id>0) {
					this.status = 'loading';
					data.offset = this.last_id*limit;
				}
				data.limit=limit
				if(this.date.indexOf('-') != -1){
					data.date=this.date
				}
				
				let [err,res] =await this.$httpas.get('/api/agent/moneylog',data,{token:1});
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
		}
	}
</script>

<style>
	.btn-integral{
		width: 192rpx;
		height: 80rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 8rpx 32rpx 0rpx rgba(0, 0, 0, 0.04);
		border-radius: 40rpx;
		text-align: center;
		line-height: 80rpx;
		font-size: 28rpx;
		font-weight: 500;
	}
	.log-main{
		position: relative;
		margin-top: -32rpx;
		border-radius: 32rpx 32rpx 0rpx 0rpx;
	}
</style>