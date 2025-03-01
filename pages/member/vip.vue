<template>
	<view class="pd10_15">
		<view class="pd10_15 ft14" @tap="showinfo()">{{$t('vip.tip4')}}</view>
		
		<block v-for="(item,index) in productList" :key="index">
		<view class="box item flex space" :class="selid==item.id?'selected':''" @tap="changeNum(index)">
			<view class="" >
				<view class="ft14 num">{{item.name}}</view>
				<view class="ft12 text">{{$t('Recharge tip')}}</view>
			</view>
			<view class="ft12 price"><text class="ft24">{{item.price}}</text>{{item.currency}}</view>
		</view>
		</block>
		<com-pay :payinfo="payinfo" :vpIds="vpIds"></com-pay>

		<ming-pop
		    ref="infopop"
		    direction="center" 
		    :is_close="true" 
		    :is_mask="true" 
		    :width="90"  
		    height="fit-content" 
		    :maskFun="false" 
		>
		<scroll-view class="mt16 box" scroll-y="true" style="height:800rpx;">
			<view class="pd10_15">
				<rich-text :nodes="tiptext"></rich-text>
			</view>
		</scroll-view>
		</ming-pop>
		
	</view>
</template>

<script>
	export default{
		data(){
			return {
				selid:0,
				productList:[],
				payinfo:[],
				tiptext:'',
				vpIds:[],//所有的虚拟道具id
				drama_id:0,
				video_id:0
			}
		},
		onLoad(e){
			//视频来源
			if(e.vid){
				this.drama_id = e.vid
			}
			if(e.mid){
				this.video_id = e.mid
			}
			this.getproduct()
			this.artinfo()
		},
		onShow() {
			uni.setNavigationBarTitle({
			    title: this.$t('Activate membership')
			});
		},
		methods:{
			async artinfo(){
				let data = {type:'vip'};
				let [err,res] =await this.$httpas.get('/api/index/artinfo',data);
				if(res.data.code == 1){
					this.tiptext = res.data.data.content
				}
			},
			showinfo(){
				this.$refs.infopop.show();
			},
			async getproduct(){
				let data = {};
				let [err,res] =await this.$httpas.get('/api/user/viplist',data,{token:true});
				if(res.data.code==1){
					this.productList =res.data.data
					//虚拟支付产品列表
					for (var i = 0; i < this.productList.length; i++) {
						this.vpIds.push(this.productList[i].vpid)
					}
					this.changeNum(0)
				}
			},
			changeNum(index){
				let selid = this.productList[index].id
				let vpid = this.productList[index].vpid
				this.selid = parseInt(selid);
						
				this.payinfo = {
					'type':'vip',
					'itemid':selid,
					'vpid':vpid,
					'currency':this.productList[index].currency,
					'drama_id':this.drama_id,
					'video_id':this.video_id
				};
			}
		}
	}
</script>

<style>
	.item{margin: 15rpx;border: solid 1px #eeeeee;padding:10upx 25upx;}
	.selected{
		background: repeating-linear-gradient(182deg, #ff65b0, #ffffff);
		border: solid 1px #ffffff;
	}
	.item .num{margin: 20rpx 0;font-size: 36upx;font-weight: bold;color: #333333;}
	.item .price{color: #ff007f;margin: 30rpx 0;}
	.item .text{color: #999999;}
</style>