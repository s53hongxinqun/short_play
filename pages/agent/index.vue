<template>
	<view>
		<view class="header pd20 flex space alcenter">
			<view class="flex alcenter">
				<view class="member-face">
					<image class="face" :src="agentinfo.avatar"></image>
				</view>
				<view class="ml15 cl-white">
					<view class="ft20">{{agentinfo.money}} <text class="ft12 ml5">USD</text></view>
					<view class="mt5">{{$t('Cashable income')}}</view>
					<view class="mt5">{{$t('Invitation code')}}：{{agentinfo.invitecode}}</view>
				</view>
			</view>
			<navigator url="./tixian" class="btntx flex alcenter">
				<text class="cl-main ft14">{{$t('Withdrawal')}}</text>
			</navigator>
		</view>
		<view class="pd16_15 bg-white ft14">
			<uni-grid :column="4" :showBorder="false"  :square="false">
				<uni-grid-item class="tjitem">
					<view class="ftw600">{{$t(agent_group.lang_var)}}</view>
					<view class="cl-info mt5">{{$t('fenxiao.level')}}</view>
				</uni-grid-item>
				<uni-grid-item class="tjitem">
					<view class="ftw600">{{agent_group.yjrate1}}%</view>
					<view class="cl-info mt5">{{$t('fenxiao.yjrate1')}}</view>
				</uni-grid-item>
				<uni-grid-item class="tjitem">
					<view class="ftw600">{{agent_group.yjrate2}}%</view>
					<view class="cl-info mt5">{{$t('fenxiao.yjrate2')}}</view>
				</uni-grid-item>
				<uni-grid-item class="tjitem">
					<view class="ftw600">{{agentinfo.income}}</view>
					<view class="cl-info mt5">{{$t('fenxiao.income')}}</view>
				</uni-grid-item>
				<uni-grid-item class="tjitem">
					<view class="ftw600">{{agentinfo.direct_user}}</view>
					<view class="cl-info mt5">{{$t('fenxiao.direct')}}</view>
				</uni-grid-item>
				<uni-grid-item class="tjitem">
					<view class="ftw600">{{agentinfo.indirect_user}}</view>
					<view class="cl-info mt5">{{$t('fenxiao.indirect')}}</view>
				</uni-grid-item>
				<uni-grid-item class="tjitem">
					<view class="ftw600">{{agentinfo.ordernum}}</view>
					<view class="cl-info mt5">{{$t('fenxiao.order_num')}}</view>
				</uni-grid-item>
				<uni-grid-item class="tjitem">
					<view class="ftw600">{{agentinfo.order_money}}</view>
					<view class="cl-info mt5">{{$t('fenxiao.order_money')}}</view>
				</uni-grid-item>
			</uni-grid>
		</view>
		<view class="navlist ml15 mr15">
			<navigator url="./team" class="item flex space pd15">
				<view class="flex alcenter">
					<uni-icons type="staff" size="20"></uni-icons>
					<text class="ml10">{{$t('fenxiao.team')}}</text>
				</view>
				<view class="cell-more"><uni-icons type="right" size="14"></uni-icons></view>
			</navigator>
			<navigator url="./order" class="item flex space pd15">
				<view class="flex alcenter">
					<uni-icons type="settings" size="20"></uni-icons>
					<text class="ml10">{{$t('fenxiao.orders')}}</text>
				</view>
				<view class="cell-more"><uni-icons type="right" size="14"></uni-icons></view>
			</navigator>
			<navigator url="./moneylog" class="item flex space pd15">
				<view class="flex alcenter">
					<uni-icons type="wallet" size="20"></uni-icons>
					<text class="ml10">{{$t('fenxiao.moneylog')}}</text>
				</view>
				<view class="cell-more"><uni-icons type="right" size="14"></uni-icons></view>
			</navigator>
			<navigator url="./sonagent" class="item flex space pd15">
				<view class="flex alcenter">
					<uni-icons type="contact" size="20"></uni-icons>
					<text class="ml10">{{$t('fenxiao.sonagent')}}</text>
				</view>
				<view class="cell-more"><uni-icons type="right" size="14"></uni-icons></view>
			</navigator>
			<navigator url="./txlog" class="item flex space pd15">
				<view class="flex alcenter">
					<uni-icons type="list" size="20"></uni-icons>
					<text class="ml10">{{$t('fenxiao.txlog')}}</text>
				</view>
				<view class="cell-more"><uni-icons type="right" size="14"></uni-icons></view>
			</navigator>
			<navigator url="./qrshare" class="item flex space pd15">
				<view class="flex alcenter">
					<uni-icons type="image" size="20"></uni-icons>
					<text class="ml10">{{$t('fenxiao.share')}}</text>
				</view>
				<view class="cell-more"><uni-icons type="right" size="14"></uni-icons></view>
			</navigator>
			<navigator url="./open" class="item flex space pd15">
				<view class="flex alcenter">
					<uni-icons type="upload" size="20"></uni-icons>
					<text class="ml10">{{$t('fenxiao.agentup')}}</text>
				</view>
				<view class="cell-more"><uni-icons type="right" size="14"></uni-icons></view>
			</navigator>
		</view>
	</view>
</template>

<script>
	import store from '@/static/js/store/store.js';
    export default {
        data() {
            return {
				agentinfo:[],
				agent_group:[]
            }
        },
		onLoad: function() {
			uni.setNavigationBarTitle({
			    title: this.$t('fenxiao.share')
			});
			this.agent()
		},
        methods: {
			async agent(){
				let data = {};
				let [err,res] =await this.$httpas.get('/api/agent/index',data,{token:1});
				if(res.data.code == 1){
					this.agentinfo = res.data.data
					this.agent_group = res.data.data.group
					uni.setStorageSync("agentinfo",res.data.data);
					store.commit('setInviteCode', res.data.data.invitecode)
				}else{
					uni.navigateTo({
						url:'/pages/member/index'
					})
				}
			}
        }
    }
</script>

<style>
.header{
	position: relative;
	background: repeating-linear-gradient(182deg, #ff007f, #a20051);
}
.member-face{
	position: relative;
}
.member-face .vip-level{
	height: 48rpx;
	width: 48rpx;
	position: absolute;
	left: calc(50% - 24rpx);
	top: -30rpx;
}
.member-face .face{
	width: 160rpx;
	height: 160rpx;
	border:6rpx solid #FFFFFF;
	background: #FFFFFF;
	border-radius: 100rpx;
	box-shadow: 0rpx 24rpx 48rpx 0rpx rgba(197, 202, 219, 0.3);
}
.btntx{
	text-align: center;
	background: #FFFFFF;
	height:36rpx;
	padding: 20rpx;
	border-radius: 50rpx;
	font-weight: bold;
}
.tjitem{
	text-align: center;
	margin-bottom: 20rpx;
}
.tjitem .cl-info{
	color: #999;
}
.navlist{
	background: #FFFFFF;
	border-radius: 20rpx;
}
.navlist .item{
	border-top:solid 1px #eeeeee ;
}
.navlist .item:first-child{border-top:0;}
</style>
