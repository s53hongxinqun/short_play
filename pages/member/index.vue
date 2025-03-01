<template>
	<view>
		<!-- 状态栏占位符 隐藏导航条时使用-->
		<view class="status_bar"> </view>
		<view class="pd10_15">
			<view v-if="isLogin == false" class="flex alcenter space">
				<view class="flex alcenter" @click="tolink('/pages/set/grzl/grzl')">
					<view class="member-face">
						<image class="face" :src="statics.defaultFace"></image>
					</view>
					<view class="ml15">
						<view class="ft16 cl-main">{{$t('Guest')}}</view>
						<view class="mt12 cl-info">{{$t('You are not logged in')}}</view>
					</view>
				</view>
				<text class="iconfont iconicon_arrow_small"></text>	
			</view>
			<view  v-else class="flex alcenter space">
				<view class="flex alcenter" @click="tolink('/pages/set/grzl/grzl')">
					<view class="member-face">
						<image class="face" :src="userinfo.avatar"></image>
						<image class="vip-level" :src="userinfo.group_id==2?statics.vipLevelImg[1]:''"></image>
					</view>
					<view class="ml15">
						<view class="ft18 cl-main">{{ userinfo.nickname || '' }}</view>
						<view class="mt12 cl-info">ID:{{ userinfo.username || '' }}</view>
					</view>
				</view>
				<view class="btn-mini opsetads" @click="tolink('/pages/set/set')">
					<image mode="aspectFit" style="width: 100%; height: 100%;" :src="staticUrl + 'sz.png'"></image>
				</view>
			</view>
			<view class="mt15">
				<com-vipcard :userdata="userinfo" :isLogin="isLogin"></com-vipcard>
			</view>
			<view v-if="agentopen==1" class="box mt20 pd15 flex space" @tap="agentlink()">
				<view class="flex alcenter">
					<uni-icons type="staff-filled" size="28" color="#ff007f"></uni-icons>
					<text v-if="isagent" class="ft16 cl-style ftw600">{{$t('fenxiao.center')}}</text>
					<text v-else class="ft16 cl-style ftw600">{{$t('fenxiao.open')}}</text>
				</view>
				<uni-icons type="right" size="24" color="#999"></uni-icons>
			</view>
			
			<view class="box mt20 pd15">
				<view class="ftw600 mb15">{{$t('User menus')}}</view>
				<uni-grid :column="2" :showBorder="false"  :square="false">
					<uni-grid-item v-for="(item,index) in memberMenus" :key="index">
						<view @click="tolink(item.url)" class="userlink flex alcenter" >
							<image :src="item.image" style="width: 64rpx;height: 64rpx;"></image>
							<view class="ml10 cl-info ft14">{{item.langname}}</view>
						</view>
					</uni-grid-item>
				</uni-grid>
			</view>
			
		</view>
		<com-footer></com-footer>
	</view>
</template>

<script>
	import { mapActions } from 'vuex'
	export default{
		data(){
			return {
				isLogin:false,
				userinfo:[],
				memberMenus:[],
				isagent:0
			}
		},
		computed:{
			agentopen(){
				if(this.siteconfig){
					return this.siteconfig.site.agentopen;
				}
			}
		},
		onLoad(){
			uni.setNavigationBarTitle({
			    title: this.$t('User center')
			});
			
			this.getMenus();
		},
		onShow() {
			this.upUser()
		},
		methods:{
			...mapActions(['getUser']),
			
			async upUser(){
				if(this.memberToken){
					this.isLogin =true;
					let res= await this.getUser();
					if(res.data.code==1){
						this.userinfo = res.data.data
						this.isagent = res.data.data.isagent
					}
				}else{
					this.userinfo=[]
					this.isLogin =false;
				}
			},
			async getMenus(){
				let data = {type:2};
				let [err,res] =await this.$httpas.get('/api/index/navmenu',data);
				if(res.data.code === 1){
					this.memberMenus=res.data.data
				}
			},
			tolink(url){
				if(this.isLogin == false){
					this.Needlogin()
				}else{
					uni.navigateTo({
						url:url
					})
				}
			},
			agentlink(){
				if(this.isLogin==false){
					this.Needlogin()
					return
				}
				if(this.isagent==true){
					uni.navigateTo({
						url:'/pages/agent/index'
					})
				}else{
					uni.navigateTo({
						url:'/pages/agent/open'
					})
				}
			}
		}
	}
</script>

<style>
	.opsetads{
		background: #FFFFFF;
		color:#000000; 
		width: 70upx; 
		line-height: 70upx; 
		height: 70upx; 
		text-align: center; 
		border-radius: 100%;
		animation: rotate 10s linear infinite;
	}
	@keyframes rotate{
	    0%{
	        transform:rotate(0deg) skew(0deg) scale(1);
	        -ms-transform:rotate(0deg) skew(0deg) scale(1);     /* IE 9 */
	        -moz-transform:rotate(0deg) skew(0deg) scale(1);     /* Firefox */
	        -webkit-transform:rotate(0deg) skew(0deg) scale(1); /* Safari  Chrome */
	        -o-transform:rotate(0deg) skew(0deg) scale(1); 
	    }
	    100%{
	        transform:rotate(360deg) skew(0deg) scale(1);
	        -ms-transform:rotate(360deg) skew(0deg) scale(1);     /* IE 9 */
	        -moz-transform:rotate(360deg) skew(0deg) scale(1);     /* Firefox */
	        -webkit-transform:rotate(360deg) skew(0deg) scale(1); /* Safari  Chrome */
	        -o-transform:rotate(360deg) skew(0deg) scale(1); 
	    }
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
	.miniapp-icon{
		width: 48rpx;
		height: 48rpx;
		border-radius: 24rpx;
		background: #F2F2F2;
	}
	.account{
		width: 160rpx;text-align: center;
		.money{padding: 10rpx;}
		.name {color:#999999;}
	}
	
	.btn-tixian{
		padding: 15rpx 20rpx;
		border-radius: 40rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #0ccd62;
		color: white;
	}
	.btn-recharge{
		padding: 15rpx 20rpx;
		border-radius: 40rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #F2DCA9;
		margin-right: 20rpx;
		margin-left: 20rpx;
	}
	.fxlink{width: 25%; text-align: center;padding: 30rpx 0;}
	.fxicon{display: block;}
	
	.userlink{
		padding: 20upx 0;
		border-bottom: solid 1px #eeeeee;
	}
	.userlink .icon{
		width: 60rpx;
		height: 60rpx;
	}
</style>