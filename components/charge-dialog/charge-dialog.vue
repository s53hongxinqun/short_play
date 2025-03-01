<template>
	<view class="buybox">
		<view>
			<view class="flex_row">
				<view style="display: flex; flex-direction: column;">
					<view class="flex_row">
						<text class="btm_tit">{{$t('video.notplay')}}</text>
					</view>
				</view>
				<image @click="close" src="@/static/img/index/down.png" class="downicon"></image>
			</view>
		</view>
		<view class="pricebox" style="margin-top: 10px;">
			<text class="cl-light">{{$t('video.playing')}} - {{chargeinfo.title}}</text>
		</view>
		<view class="pricebox">
			<view class="flex_row">
				<text class="cl-light">{{$t('video.oneprice')}}：</text>
				<text class="cl-orange">{{chargeinfo.priced}} {{$t('Score')}}</text>
				<text class="cl-light" style="margin-left: 10px;">{{$t('video.allprice')}}：</text>
				<text class="cl-orange">{{chargeinfo.priceq}} {{$t('Score')}}</text>
			</view>
			<view class="flex_row" style="margin-top: 10px;">
				<text class="cl-light">{{$t('video.balance')}}：</text>
				<text class="cl-orange">{{chargeinfo.userscore||0}} {{$t('Score')}}</text>
			</view>
		</view>
		<view class="btnbox">
			<view class="flex_row" style="justify-content:space-between;">
				<text @click="buyAct(1)" class="buybtn1">{{$t('video.buyone')}}</text>
				<text @click="buyAct(0)" class="buybtn1" style="margin-right: 0;">{{$t('video.buyall')}}</text>
			</view>
			<view class="buybtn2" style="background-color:#00dfa4;">
				<text v-if="adunlock==1" @click="freebyad()" class="btn-txt">{{$t('video.unlockbyad')}}</text>
			</view>
			<view class="buybtn2" style="background-color: orange;"><text @click="govip()" class="btn-txt">{{$t('Activate membership')}}</text></view>
		</view>
	</view>
</template>

<script>
	import request from "@/common/request.js"
	export default {
		name:"charge-dialog",
		/**
		 * 组件的属性列表
		 */
		props: {
			playerId: {
			  type: String,
			  value: ''
			},
			srcAppid: {
			  type: String,
			  value: ''
			},
			dramaId: {
			  type: String,
			  value: ''
			},
			serialNo: {
			  type: Number,
			  value: 0
			},
			extParam: {
			  type: String,
			  value: ''
			},
			vid: {
			  type: Number,
			  value: 0
			},
			mid: {
			  type: Number,
			  value: 0
			},
			adunlock:{
				type: Number,
				value: 0
			}
		},
		data() {
			return {
				chargeinfo:[]
			};
		},
		created() {
			this.$t = getApp().globalData.$t;
		},
		mounted() {
			this.getInfo()
		},
		watch: {
			serialNo(serialNo) {
				console.log(serialNo)
			},
			playerId(playerId) {
			  this.initChargeDialog()
			}
		},
		/**
		 * 组件的方法列表
		 */
		methods: {
			async getInfo(){
				let data = {};
				if(this.dramaId){
					data.drama_id = this.dramaId
				}else{
					data.vid = this.vid
					data.mid = this.mid
				}
				data.serialno = this.serialNo

				let [err,res] =await request.get('/api/video/chargeinfo',data,{token:true});
				if(res.data.code==1){
					this.chargeinfo=res.data.data
				}
			},
			denglu(){
				uni.navigateTo({
					url:"/pages/login/login"
				})
			},
			close() {
				this.$emit("watchClose")
			},
			freebyad(){
				this.$emit("Adunlock")
			},
			//积分解锁
			buyAct(buytype){
				if(!uni.getStorageSync("usertoken")){
					this.denglu()
					return false
				}
				var needscore = buytype==1?this.chargeinfo.priced:this.chargeinfo.priceq
				if(this.chargeinfo.userscore < needscore){
					uni.showModal({
						title: this.$t('Warning'),
						content: this.$t('Balance is insufficient'),
						showCancel: true,
						cancelText: this.$t('Cancel'),
						confirmText: this.$t('Recharge'),
						success: function (res) {
							if (res.confirm) {
								uni.navigateTo({
									url:"/pages/member/recharge?vid="+this.chargeinfo.vid+"&mid="+this.chargeinfo.mid
								})
							}
						}
					});
					return false
				}
				this.close();
				//支付
				uni.showModal({
					title: this.$t('Warning'),
					content: this.$t('video.confirmbuy'),
					showCancel: true,
					cancelText: this.$t('Cancel'),
					confirmText: this.$t('OK'),
					success: res => {
						if (res.confirm) {
							this.paybuy(buytype);
						}
					}
				});
			},
			async paybuy(buytype){
				var needscore = buytype==1?this.chargeinfo.priced:this.chargeinfo.priceq
				let data = {};
				data.vid=this.chargeinfo.vid
				data.mid=this.chargeinfo.mid
				data.sum =1;
				data.pricebuy = needscore
				data.buytype = buytype

				let [err,res] =await request.post('/api/pay/videopay',data,{token:true});
				if(res.data.code==1){
					this.unlockSuccess(this.chargeinfo);
				}else{
					uni.showModal({
						title: this.$t('Warning'),
						content: this.$t('Operation failed'),
						showCancel: false,
						success: res => {
							
						}
					});
				}
			},
			//解锁成功
			unlockSuccess(info){
				uni.navigateTo({
					url:"/pages/video/detail?vid="+info.vid+"&mid="+info.mid
				})
			},
			govip(){
				if(uni.getStorageSync("userinfo")){
					uni.navigateTo({
						url:"/pages/member/vip?vid="+this.chargeinfo.vid+"&mid="+this.chargeinfo.mid
					})
				}else{
					this.denglu()
					return false
				}
			}
		}	
	}
</script>

<style lang="scss">
.flex_row{display:flex;flex-direction: row;}
.buybox{ background-color: #202020; border-top-left-radius: 10px; border-top-right-radius: 10px;}
.btnbox{padding:30rpx;}
.buybtn1{
	font-size: 30rpx; 
	color:white;
	line-height: 90rpx;
	background: #ff007f;
	border-radius: 18rpx; 
	padding: 0 20rpx;
	text-align: center; 
	margin-bottom: 20rpx;
	flex: 1; /* 子元素均分空间 */
	margin-right: 10px;
}
.buybtn2{
	height:90rpx;
	border-radius: 18rpx; 
	padding: 0 20rpx;
	margin-bottom: 20rpx;
	text-align: center;
}
.btn-txt{
	line-height: 90rpx;
	text-align: center;
	color: white;
	font-size: 30rpx; 
	font-weight: 600; 
}
.suo_icon{width: 20px; height: 20px; margin-top: 10px; margin-left: 20px;}
.btm_tit{font-size: 14px; font-weight: bold; color: #FFFFFF; margin-top: 9px; height: 22px; margin-left: 10px;  overflow: hidden;}
.downicon {width: 30px; height: 30px; margin-top: 5px; position: absolute; right: 20px;}
.pricebox{padding: 5px 15px;}
.cl-light{font-size: 12px;color: white;}
.cl-orange{font-size: 12px;color: #ff007f;}
</style>