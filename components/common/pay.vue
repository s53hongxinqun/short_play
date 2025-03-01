<template>
	<view>
		<view class="box mt16 pd16_15">
			<view class="ft16 pb16 ftw600 cl-main">{{$t('Payment')}}</view>
			<radio-group @change="changeType">
				<block v-for="(item,index) in payTypes" :key="index">
				<view v-if="item.open==1" class="pt16 pb16 flex alcenter space bdtop">
					<view class="flex alcenter">
						<text class="iconfont iconicon_arrow_circle ft20" style="color: #55aaff;"></text>
						<text class="ml15 ft14 ftw500 cl-main">{{item.title}}</text>
					</view>
					<view>
						<radio :value="item.name" :checked="payType == item.name" :disabled="false" :color="tempColor"  />
					</view>
				</view>
				</block>
			</radio-group>
		</view>
		<view style="margin-bottom: 150rpx;"></view>
		<view class="form-footer-h form-footer">
			<view class="form-footer-main pd10_15 flex">
				<button v-if="kamipay==true"  @click="paykami" class="btn-big plan mr5">{{$t('Cryptocard')}}</button>
				<button  @click="payAction" :loading="loading" class="btn-big">{{$t('Pay Now')}}</button>
			</view>
		</view>
		
		<hFormAlert v-if="kamiShow"
			:title="title"
			name="kamiNo" 
			:placeholder="this.$t('Please enter the card number')" 
			@confirm="kmConfirm" 
			@cancel="kmCancel" 
			:confirmText="this.$t('OK')"
			:cancelText="this.$t('Cancel')">
		</hFormAlert>
	</view>
</template>

<script>
	import hFormAlert from '@/components/h-form-alert/h-form-alert.vue';
	import { Iap,IapTransactionState } from "@/common/iap.js"
	export default{
		props:['payinfo','vpIds'],
		data(){
			return {
				title:this.$t('Cryptocard'),
				payTypes:[],
				payType:'paypal',//选择支付方式
				useiap:false,//是否使用苹果内购
				currency:'USD',//货币
				loading: false,
				kamipay:true,//开启卡密支付
				kamiShow:false,
				iap_products:[]
			}
		},
		components: {hFormAlert},
		watch: {
			siteconfig:function(newVal){
				if(newVal){
					this.configint()
				}
			}
		},
		created() {
			this.configint()
			if(uni.getSystemInfoSync().osName=="ios" && this.useiap == true){
				this.iap_init();
			}
		},
		methods:{
			configint(){
				if(this.siteconfig){
					//判断支付方式开始
					let payTypes = this.siteconfig.paytypes;
					// #ifdef H5
					//公众号里不能用支付宝
					var ua = window.navigator.userAgent.toLowerCase();
					if(ua.match(/MicroMessenger/i) == 'micromessenger'){
						for (var i = 0; i < payTypes.length; i++) {
							if(payTypes[i].name=='alipay'){
								payTypes[i].open=0;
							}
						}
					}
					// #endif
					
					//启用苹果支付则APP端只显示苹果支付
					if(uni.getSystemInfoSync().osName=="ios" && this.useiap == true){
						 payTypes=[
							 {name: "appleiap", title: "ApplePay", open: "1"}
						 ];
					}
					
					this.payTypes = payTypes;
					
					for (var i = 0; i < payTypes.length; i++) {
						if(payTypes[i].open ==1){
							this.payType = payTypes[i].name
							break;
						}
					}
				}
			},
			changeType(e){
				this.payType = e.detail.value;
			},
			paykami(){
				this.kamiShow=true
			},
			kmCancel(){
				this.kamiShow=false
			},
			async kmConfirm(e){
				if(!e.kamiNo){
					this.kamiShow=false
					uni.showModal({
						title: this.$t('Warning'),
						content: this.$t('Please enter the card number'),
						showCancel: false,
						confirmText: this.$t('OK'),
						success: function (res) {
							
						}
					});
					return false
				}
				let data = {};
				data.kamiNo = e.kamiNo;
				let [err,res] =await this.$httpas.post('/api/user/kami',data,{token:true});
				if(res.data.code==1){
					uni.showModal({
						title: this.$t('Warning'),
						content: this.$t('Pay success'),
						showCancel: false,
						confirmText: this.$t('OK'),
						success: function (res) {
							if (res.confirm) {
								uni.navigateBack();
							}
						}
					});
				}else{
					uni.showToast({ title: res.data.msg,icon:"none" });
				}
				this.kamiShow=false
			},
			payAction(){
				if(this.payinfo.itemid==0 || this.payTypes.length==0){
					uni.showModal({
						title: this.$t('Warning'),
						content: this.$t('Operation failed'),
						showCancel: false
					});
					return false;
				}		
				// #ifdef APP-PLUS
				if(uni.getSystemInfoSync().osName=="ios" && this.useiap == true){
					this.payapple()
					return
				}
				//#endif
				this.payH5()
			},
			//h5和APP选择支付
			async payH5(){
				if(!this.payinfo.itemid){
					uni.showToast({ title:this.$t('Please select a recharge product'),icon:"none" });
					return false
				}
				uni.showLoading({
				    title: 'Loading'
				});
				
				let data = {};
				data.id = this.payinfo.itemid;
				data.actype = this.payinfo.type
				data.paytype = this.payType;
				data.platform = 'h5'
				data.currency = this.payinfo.currency
				data.drama_id = this.payinfo.drama_id
				data.video_id = this.payinfo.video_id
				// #ifdef H5
				var ua = window.navigator.userAgent.toLowerCase();
				if(ua.match(/MicroMessenger/i) == 'micromessenger'){
					data.platform = 'wxgzh';
				}
				// #endif
				let [err,res] =await this.$httpas.post('/api/pay/recharge',data,{token:true});
				if(res.data.code==1){
					uni.hideLoading();
					// #ifndef H5
					uni.navigateTo({
						url:'/pages/index/webva?url='+encodeURIComponent(res.data.data.payurl)
					})
					// #endif  
					// #ifdef H5
					window.location.href=res.data.data.payurl
					// #endif
				}else{
					uni.hideLoading();
					uni.showToast({ title: res.data.msg,icon:"none" });
				}
			},
			//初始化苹果内支付
			async iap_init() {
				uni.showLoading({
				  title: this.$t('Loading')
				});
				this._iap = new Iap({
					products: this.vpIds // 内购商品id
				})
				try {
				  // 初始化，获取iap支付通道
				  await this._iap.init();
					
				  // 从苹果服务器获取产品列表
				  this.iap_products = await this._iap.getProduct();
				} catch (e) {
				  uni.showModal({
					title: this.$t('Warning'),
					content: this.$t('Pay failed'),
					showCancel: false
				  });
				} finally {
				  uni.hideLoading();
				}
					
				if (this._iap._ready) {
				  this.restore();
				}
			},
			
			async restore() {
			  	// 检查上次用户已支付且未关闭的订单，可能出现原因：首次绑卡，网络中断等异常
			  	try {
			  	  // 从苹果服务器检查未关闭的订单，可选根据 username 过滤，和调用支付时透传的值一致
			  	  const transactions = await this._iap.restoreCompletedTransactions({
			  		username: ""
			  	  });
			  	  if (!transactions.length) {
			  		return;
			  	  }
			  	  for (let i = 0; i < transactions.length; i++) {
			  		  let transaction= transactions[i]
			  		  //console.log(transaction)
			  		  switch (transaction.transactionState) {
			  			case IapTransactionState.purchased:
			  			  // 用户已付款，在此处请求开发者服务器，在服务器端请求苹果服务器验证票据
			  			  let result = await this.validatePaymentResult({
			  				 orderId: transaction.payment.username,
			  				 transactionReceipt: transaction.transactionReceipt, // 不可作为订单唯一标识
			  				 transactionIdentifier: transaction.transactionIdentifier
			  			   });
			  			  // 验证通过，交易结束，关闭订单
			  				if (result) {
			  					await this._iap.finishTransaction(transaction);
			  				}
			  			  break;
			  			case IapTransactionState.failed:
			  			  // 关闭未支付的订单
			  			  await this._iap.finishTransaction(transaction);
			  			  break;
			  			default:
			  			  break;
			  		  }
			  	  }
			  	} catch (e) {
			  	  uni.showModal({
			  		content: e.message,
			  		showCancel: false
			  	  });
			  	}
			},
			//提交苹果支付
			async payapple() {
			  	if (this.loading == true) {
			  	  return;
			  	}
			  	this.loading = true;
			  	uni.showLoading({
			  	  title: this.$t('Loading')
			  	});
			  		
			  	try {
			  	  // 从开发者服务器创建订单
			  	  const orderId = await this.createOrder();
			  		
			  	  // 请求苹果支付
			  	  const transaction = await this._iap.requestPayment({
			  		productid: this.productId,
			  		manualFinishTransaction: true,
			  		username: orderId //根据业务需求透传参数，关联用户和订单关系
			  	  });
			  	//console.log(transaction)
			  	  // 在此处请求开发者服务器，在服务器端请求苹果服务器验证票据
			  	  let result = await this.validatePaymentResult({
			  		 orderId: orderId,
			  		 transactionReceipt: transaction.transactionReceipt, // 不可作为订单唯一标识
			  		 transactionIdentifier: transaction.transactionIdentifier
			  	   });
			  		
			  	  // 验证成功后关闭订单
			  	  if (result) {
			  		await this._iap.finishTransaction(transaction);
			  	  }
					// 支付成功
					uni.showModal({
						title: this.$t('Warning'),
						content: this.$t('Pay success'),
						showCancel: false,
						confirmText: this.$t('OK'),
						success: function (res) {
							if (res.confirm) {
								uni.navigateBack();
							}
						}
					});
			  	} catch (e) {
			  	  uni.showModal({
			  		content: this.$t('Pay failed'),
			  		showCancel: false
			  	  });
			  	} finally {
			  	  this.loading = false;
			  	  uni.hideLoading();
			  	}
			},
			//创建苹果内购订单
			createOrder() {
				return new Promise((resolve, reject) => {
					let data = {};
					data.token = this.memberToken;					
					data.id = this.payinfo.itemid;
					data.actype = this.payinfo.type
					data.paytype = this.payType;
					data.platform = 'app'
					data.currency = this.payinfo.currency
					data.drama_id = this.payinfo.drama_id
					data.video_id = this.payinfo.video_id
					uni.request({
						url: this.apiUrl+'/api/pay/recharge',
						data: data,
						success: res =>{
							if(res.data.code==1){
								resolve(res.data.data.out_trade_no)
							}else{
								reject(res.data.msg)
							}
						}
					});
				})
			},
			//验证苹果内购订单
			validatePaymentResult(data) {
				return new Promise((resolve, reject) => {
					uni.request({
						url: this.apiUrl+'/index/pay/notify_iap',
						data: data,
						success: res =>{
							if(res){
								resolve(1)
							}else{
								reject(0)
							}
						}
					});
				});
			}
		}
	}
</script>

<style>
</style>