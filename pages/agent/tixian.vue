<template>
	<view>
		<view class="bg-style">
			<view class="flex alcenter space pd20">
				<view class="cl-white">
					<view class="ft14">{{$t('My earnings')}}</view>
					<view class="mt16 flex alcenter">
						<text class="ft20 ftw600">{{urerdata.money}}</text>
					</view>
				</view>
				<navigator open-type="redirect" url="./txlog" class="btn-big plan btn-small">{{$t('Records')}}</navigator>
			</view>
		</view>
		<view class="pd16_15">
			<view class="ft16">{{$t('cash.method')}} > {{type}}</view>
			<view class="ft14 mt20">{{$t('cash.money')}}</view>
			<input type="digit" class="inbox mt16" v-model="money" :placeholder="$t('cash.input.money')" />
			<view class="ft14 mt20">{{$t('cash.realname')}}</view>
			<input type="text" class="inbox mt16" v-model="name" :placeholder="$t('cash.input.realname')" />
			<view class="ft14 mt20">{{$t('cash.account')}}</view>
			<input type="text" class="inbox mt16" v-model="cord" :placeholder="$t('cash.input.account')" />
			
			<view class="ft14 mt16" style="color: #ff0000;">{{$t('cash.beizhu',{ps:siteconfig.site.txsxf})}}</view>
			
			<button @click="butsub()" class="mt20 btn-big">{{$t('Submit')}}</button>
		</view>
	</view>
</template>

<script>
    export default {
        data() {
            return {
                loading: false,
                money: '',
				name: '',
				cord:'',
				type:'Paypal',
				urerdata:[]
            }
        },
		onLoad: function() {
			
		},
		onShow() {
			uni.setNavigationBarTitle({
			    title: this.$t('Withdrawal')
			});
			this.getuser()
		},
        methods: {
			async getuser(){
				let data = {};
				let [err,res] =await this.$httpas.post('/api/user/index',data,{token:1});
				if(res.data.code==1){
					this.money=res.data.data.money
					this.urerdata=res.data.data
				}else{
					uni.showToast({ title: res.data.msg,icon:"none" });
				}	
			},
			async butsub(){
				var that=this
				let data = {
					'money':this.money,
					'name':this.name,
					'cord':this.cord,
					'type':this.type,
					};
				let [err,res] =await this.$httpas.get('/api/agent/tixian',data,{token:1});
				if (!this.$httpas.errorCheck(err,res)) return;
				uni.showModal({
					title: this.$t('Warning'),
					content: res.data.msg,
					showCancel: false,
					success: ress => {
						if(res.data.code == 1){
							that.money=''
							that.name=''
							that.cord=''
						}
						that.getuser()
					}
				});
			}
        }
    }
</script>

<style>
	.inbox{border:solid 1px #cccccc;padding: 10rpx;background-color: white;}
</style>
