<template>
	<view>
		<view class="flex alcenter space pd24_20">
			<view>
				<view class="ft16">{{$t('My score')}}</view>
				<view class="ft20 cl-style">
					<uni-icons type="color-filled" size="20" color="#999"></uni-icons>
					{{memberInfo?memberInfo.score:0}}
				</view>
			</view>
			<navigator url="recharge" class="btn-big btn-mid">
				{{$t('Recharge')}}
			</navigator>
		</view>
		<view class="integral-log-main">
			<view class="pd16_15 bd-bottom flex alcenter">
				<text class="ft16 ftw600 cl-main">{{$t('Integral record')}}</text>
			</view>
			<view class="pd16_15" v-if="listData.length>0">
				<block v-for="(item,index) in listData" :key="index">
				<view class="pb16 mb16 bd-bottom flex alcenter space">
					<view>
						<view class="ft14 cl-main">{{item.memo}}</view>
						<view class="mt8 ft12 cl-notice">{{item.createtime}}</view>
					</view>
					<view class="ft18 ftw600 cl-main">{{item.jzt}}{{item.score}}</view>
				</view>
				</block>
				<uni-load-more :status="status" :content-text="moreText" />
			</view>
			
			<com-empty v-else :title="this.$t('No results were found')"></com-empty>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				userinfo:[],
				listData: [],
				last_id: 0,
				reload: true,
				status: 'more',
			}
		},
		onLoad(){
			if(!this.memberInfo){
				this.Needlogin()
				return
			}
			this.getList();
		},
		onShow() {
			uni.setNavigationBarTitle({
			    title: this.$t('Integral record')
			});
		},
		onReachBottom() {
			this.status = 'more';
			this.getList();
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
				let [err,res] =await this.$httpas.get('/api/user/scorelogs',data,{token:true});
				if (res.data.rows.length>0) {
					let list = res.data.rows;
					this.listData = this.reload ? list : this.listData.concat(list);
					this.reload = false;
					this.last_id = this.last_id+1;
					if(res.data.total<=this.last_id*limit){
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
	.integral-log-main{
		background: #FFFFFF;
		border-radius: 32rpx 32rpx 0rpx 0rpx;
	}
</style>