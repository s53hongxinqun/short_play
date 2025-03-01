<template>
	<view>
		<view class="status_bar"></view>
		<view class="header">
			<view class="flex alcenter space pd16_15">
				<view class="cl-light">
					<view class="ft16">{{$t('My score')}}</view>
					<view class="ft20 cl-white">
						<uni-icons type="color-filled" size="20" color="#eeeeee"></uni-icons>
						{{memberInfo?memberInfo.score:0}}
					</view>
				</view>
				<navigator url="/pages/member/integrallog" class="btn-big plan btn-small">
					{{$t('Records')}}
				</navigator>
			</view>
			<view class="pd0_15">
				<siginIn :sign_list="sign_list" :qdjl="qddays" :tdsy="tdsy" @cksigin="cksigin"></siginIn>
			</view>
		</view>
		<view class="pd16_15">
			<view class="tast_tip cl-style">---{{$t('task.subtitle')}}---</view>
			<view class="box pd16_15 mt15">
				<view class="flex alcenter space pb16 bd-bottom mb16">
					<view class="flex alcenter">
						<uni-icons type="cloud-upload" size="36" color="#999999"></uni-icons>
						<view class="ml15">
							<view class="ft14 ftw600">{{$t('task.reg')}}</view>
							<view class="mt10 ft12 cl-notice">
								{{$t('task.reward')}} {{reggive}} {{score_name}}
							</view>
						</view>
					</view>
					<navigator url="/pages/login/reg" v-if="!memberInfo">
						<view class="btn-big btn-small">{{$t('task.todo')}}</view>
					</navigator>
					<view class="btn-big btn-small dis" v-else>{{$t('task.complete')}}</view>
				</view>
				
				<view class="flex alcenter space pb16 bd-bottom mb16">
					<view class="flex alcenter">
						<uni-icons type="personadd" size="36" color="#999999"></uni-icons>
						<view class="ml15">
							<view class="ft14 ftw600">{{$t('task.invitereg')}}</view>
							<view class="ft12 cl-notice mt10">{{$t('task.reward')}} {{invitereg_give}} {{score_name}}</view>
						</view>
					</view>
					<view @click="goshare()" class="btn-big btn-small">{{$t('task.todo')}}</view>
				</view>
				<!-- #ifndef H5 -->
				<view class="flex alcenter space pb16 bd-bottom mb16" v-if="videoad_open==1">
					<view class="flex alcenter">
						<uni-icons type="videocam" size="36" color="#999999"></uni-icons>
						<view class="ml15">
							<view class="ft14 ftw600">{{$t('task.videoad')}}</view>
							<view class="ft12 cl-notice mt10">{{$t('task.reward')}} {{admoney}} {{score_name}}({{adnum}}/{{mrcs}})</view>
						</view>
					</view>
					<view @click="adClick()" v-if="adnum < mrcs" class="btn-big btn-small">{{$t('task.todo')}}</view>
					<view @click="adClick()" v-else class="btn-big btn-small dis">{{$t('task.complete')}}</view>
				</view>
				<!-- #endif -->
				<view class="flex alcenter space pb16 bd-bottom mb16">
					<view class="flex alcenter">
						<uni-icons type="heart" size="36" color="#999999"></uni-icons>
						<view class="ml15">
							<view class="ft14 ftw600">{{$t('task.taplove')}}</view>
							<view class="ft12 cl-notice mt10">{{$t('task.reward')}} {{taplove_score}} {{score_name}}({{taplove_num}}/{{taplove_times}})</view>
						</view>
					</view>
					<navigator url="/pages/index/index" v-if="taplove_num<taplove_times">
					<view class="btn-big btn-small">{{$t('task.todo')}}</view>
					</navigator>
					<view class="btn-big btn-small dis" v-else>{{$t('task.complete')}}</view>
				</view>
			</view>
		</view>
		<com-footer></com-footer>
	</view>
</template>

<script>
	import siginIn from '@/components/fanxiao-sign/sigin-in.vue';
	import { mapActions } from 'vuex'
	var rewardedVideoAd
	export default{
		data(){
			return {
				score_name:this.$t('Score'),
				reggive:0,
				invitereg_give:0,
				videoad_open:0,
				admoney:0,
				mrcs:0,
				adnum:0,
				taplove_score:0,
				taplove_times:0,
				taplove_num:0,
				qddays:'',
				tdsy:0,
				jrqd:false,
				sign_list: [],
				adpid:'',
				mpadid:'',
				ad_isLoaded:false
			}
		},
		components: {
			siginIn
		},
		onLoad(){
			if(this.memberInfo){
				this.taplove_num = this.memberInfo.tap_count
				this.adnum = this.memberInfo.ad_count
			}
			this.config()
			this.signlist();
		},
		onShow() {
			uni.setNavigationBarTitle({
			    title: this.$t('task.title')
			});
		},
		methods:{
			...mapActions(['getConfig','getUser']),
			
			async config(){
				let sitecfg = await this.getConfig()
				if(sitecfg){
					this.reggive = sitecfg.site.reggive
					this.invitereg_give = sitecfg.site.invitereg_give
					this.videoad_open = sitecfg.site.videoad_open
					this.admoney = sitecfg.site.admoney
					this.mrcs=sitecfg.site.mrcs
					
					this.taplove_score = sitecfg.site.taplove_score
					this.taplove_times = sitecfg.site.taplove_times
					
					this.adpid=sitecfg.site.appad.adpid;//app奖励广告adpid
					this.createAd();
				}
			},
			goshare(){
				if(!this.memberInfo){
					this.Needlogin()
					return
				}
				
				var href=this.urls+'/pages/index/index?invitecode='+this.inviteCode
				let that=this
				uni.setClipboardData({
					data: href,
					complete() {
						uni.showToast({
							title: that.$t('Sharing link copied'),icon:"none" 
						})
					}
				})
			},
			cksigin(){
				this.signlist();
			},
			async signlist(){
				let this_=this
				let data = {};
				let [err,res] =await this.$httpas.get('/api/user/signlist',data,{token:true});
				if (!this.$httpas.errorCheck(err,res)) return;
				if(res.data){
					this.sign_list=res.data.getweek
					this.qddays=res.data.qddays_text
					this.tdsy=res.data.tdsy
					this.jrqd = res.data.jrqd
				}
			},
			createAd(){
				// #ifndef H5
				let userId = this.memberInfo?this.memberInfo.id:0;
				
				if (this.adpid || this.mpadid){
					rewardedVideoAd = uni.createRewardedVideoAd({
						adpid: this.adpid,
						urlCallback: { // 服务器回调透传参数
						  userId: userId,
						  extra: 'testdata'
						}
					})
					rewardedVideoAd.onLoad(() => {
						this.ad_isLoaded = true
						console.log('onLoad event')
						// 当激励视频被关闭时，默认预载下一条数据，加载完成时仍然触发 `onLoad` 事件
					})
					rewardedVideoAd.onError((err) => {
						console.log('onError event', err)
					})
					rewardedVideoAd.onClose(res => {
					  if (res && res.isEnded) {
						// 正常播放结束
						this.adjiangli()
					  } else {
						// 播放中途退出
					  }
					})
				}
				// #endif
			},
			//视频奖励
			async adjiangli(){
				var this_=this
				let data = {};
				let [err,res] =await this.$httpas.get('/api/user/admoney',data,{token:true});
				if (!this.$httpas.errorCheck(err,res)) return;
				if(res.data.code === 1){
					uni.showModal({
						title: this.$t('Warning'),
						content: this.$t('Operation completed'),
						showCancel: true,
						confirmText: this.$t('OK'),
						success: function (ress) {
							if (ress.confirm) {
								this_.getUser()
							}
						}
					});
				}else{
					uni.showToast({ title: this.$t('Operation failed'),icon:"none" });
				}
			},
			adClick(){
				var adnumleft = this.mrcs-this.adnum
				if(adnumleft<=0){
					uni.showModal({
						title: this.$t('Warning'),
						content: this.$t('task.daynumtip')+this.mrcs,
						showCancel: false,
						confirmText: this.$t('OK'),
						success: function (res) {
							
						}
					});
					return false;
				}
				if (this.ad_isLoaded) {
					rewardedVideoAd.show()
					  .catch(() => {
						  rewardedVideoAd.load()
						  .then(() => rewardedVideoAd.show())
						  .catch(err => {
							console.log('激励视频 广告显示失败')
						  })
					  })
				}
			},
		}
	}
</script>

<style>
	.header{
		background: repeating-linear-gradient(182deg, #ff007f, #f1f5f8);
	}
	.tast_tip{
		padding: 20upx;
		text-align: center;
		font-size: 36upx;
		font-weight: bold;
	}
</style>