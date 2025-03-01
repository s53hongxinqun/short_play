<template>
	<view>
		<view class="header ft18 ftw600">{{$t('agent.opentip')}}</view>
		<view class="pd16_15">
			<block v-for="(item,index) in agentgroup" :key="index">
			<view class="agent mb20 flex space alcenter">
				<view>
					<view class="ft16 cl-style ftw600">{{$t(item.lang_var)}}</view>
					<view class="ft14 cl-info">
						<view>{{$t('fenxiao.yjrate1')}}：{{item.yjrate1}}%</view>
						<view>{{$t('fenxiao.yjrate2')}}：{{item.yjrate2}}%</view>
					</view>
				</view>
				<view class="text-right ft12">
					<view class="ft14 ftw600">{{item.price}} {{$t('Score')}}</view>
					<view class="cl-info">{{$t('agent.needuser',{ps:item.son_num})}}</view>
					<view class="cl-info" v-if="agent_group >= item.id">{{$t('agent.applypassed')}}</view>
					<view class="btn" v-else @tap="apply(item.id)">{{$t('agent.apply')}}</view>
				</view>
			</view>
			</block>
			
		</view>
		<view class="pd0_15">
			<rich-text class="cl-default ft14 lh24" :nodes="textcon"></rich-text>
		</view>
	</view>
</template>

<script>
    export default {
        data() {
            return {
				agentgroup:[],
				agent_group:0,
				textcon:''
            }
        },
		onLoad: function() {
			uni.setNavigationBarTitle({
			    title: this.$t('fenxiao.open')
			});
			if(this.memberInfo){
				this.agent_group = this.memberInfo.agent_group;
			}
			this.group()
			this.artinfo()
		},
        methods: {
			async group(){
				let data ={}
				let [err,res] =await this.$httpas.get('/api/agent/group',data,{token:true});
				if(res.data){
					this.agentgroup=res.data
				}
			},
			async artinfo(){
				let data = {type:'fenxiao'};
				let [err,res] =await this.$httpas.get('/api/index/artinfo',data);
				if(res.data.code == 1){
					this.textcon = res.data.data.content
				}
			},
			
			apply(id){
				uni.showModal({
					title: this.$t('Warning'),
					content: this.$t('Are you sure to submit'),
					success: ret => {
						if(ret.confirm){
							this.doapply(id)
						}
					}
				});
			},
			async doapply(id){
				let data = {id};
				let [err,res] = await this.$httpas.post('/api/agent/apply',data,{token:1});
				if(res.data.code == 1){
					this.agent_group=id
					uni.showToast({
						title:this.$t('Operation completed'),icon:'success'
					})
				}else{
					uni.showToast({ title: res.data.msg,icon:"error" });
				}
			}
        }
    }
</script>

<style>
	.header{
		padding-top: 60upx;
		padding-bottom: 60upx;
		color: white;
		text-align: center;
		background: repeating-linear-gradient(182deg, #641856, #f862b2);
	}
	.agent{
		background-color: #ffffff;
		padding: 10rpx 20rpx;
		line-height: 60rpx;
		box-shadow: 0rpx 8rpx 32rpx 0rpx rgba(0, 0, 0, 0.04);
		border-radius: 20rpx;
	}
	
	.btn{
		padding:0upx 15upx;
		background: #ff5cab;
		color:white;
		border-radius: 80upx;
		text-align: center;
		font-size: 28rpx;
	}
</style>
