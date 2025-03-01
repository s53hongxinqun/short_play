<template>
	<view class="pd16_15" v-if="listData.length>0">
		<block v-for="(item,index) in listData" :key="index">
		<view class="box pd16_15 flex alcenter space" style="margin-bottom: 30upx;">
			<view>
				<view class="ft14 cl-main">{{item.memo}} 【{{$t('Order')}}ID:{{item.oid}}】</view>
				<view class="mt8 ft12 cl-notice">{{item.createtime}}</view>
			</view>
			<view class="cl-main ft18 ftw600">
				{{item.jzt}}{{item.money}}
			</view>
		
		</view>
		</block>	
		<uni-load-more :status="status" :content-text="moreText" />
	</view>
	<com-empty v-else :title="this.$t('No results were found')"></com-empty>
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
		onReachBottom() {
			this.status = 'more';
			this.getList();
		},
		onLoad() {
			this.getList();
		},
		onShow() {
			uni.setNavigationBarTitle({
			    title: this.$t('fenxiao.orders')
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
				let [err,res] =await this.$httpas.get('/api/agent/orders',data,{token:1});
				this.total=res.data.total
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