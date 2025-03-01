<template>
	<view class="container">
		<view class="list-cell b-b avatar" hover-class="cell-hover" :hover-stay-time="50"  @click="clk(0)">
			<text class="cell-tit">{{$t('profile.avatar')}}</text>
			<image :src="avatarimg" mode="aspectFill"></image>
		</view>
		<view class="list-cell" @click="modinfo('nickname',listgrzl.nickname)" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">{{$t('profile.nickname')}}</text>
			<text class="cell-tip">{{listgrzl.nickname}}</text>
			<view class="cell-more"><uni-icons type="right" size="14"></uni-icons></view>
		</view>
		<view class="list-cell m-t b-b" @tap="sexchange"  hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">{{$t('profile.sex')}}</text>
			<text class="cell-tip">{{sexType}}</text>
			<view class="cell-more"><uni-icons type="right" size="14"></uni-icons></view>
		</view>
		<view class="list-cell" @click="modinfo('age',''+listgrzl.age)" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">{{$t('profile.age')}}</text>
			<text class="cell-tip">{{listgrzl.age}}</text>
			<view class="cell-more"><uni-icons type="right" size="14"></uni-icons></view>
		</view>
		<navigator class="list-cell" url="modphone">
			<text class="cell-tit">{{$t('profile.mobile')}}</text>
			<text class="cell-tip">{{listgrzl.mobile||$t('Bind')}}</text>
			<view class="cell-more"><uni-icons type="right" size="14"></uni-icons></view>
		</navigator>
		<navigator class="list-cell" url="modemail">
			<text class="cell-tit">{{$t('Email')}}</text>
			<text class="cell-tip">{{listgrzl.email||$t('Bind')}}</text>
			<view class="cell-more"><uni-icons type="right" size="14"></uni-icons></view>
		</navigator>
		<avatar @upload="doUpload" @avtinit="doBefore" quality="1" ref="avatar"></avatar>
	</view>
</template>

<script>
	import avatar from "../../../components/yq-avatar/yq-avatar.vue";
	export default {
		data() {
			return {
				avatarimg:'',
				sex:[this.$t('profile.female'), this.$t('profile.male')],
				sexsi:'',
				array: [],
				ageid: 0, 
				listgrzl:[],
				msg:false
			};
		},
		components: {
			avatar
		},
		computed: {
			sexType() {
				return this.sex[this.sexsi];
			},
		},
		onShow(){
			uni.setNavigationBarTitle({
			    title: this.$t('Profile')
			});
			this.ongrzlTap();
			if(this.msg){
				uni.showToast({ title: this.$t('Operation completed'),icon:"none" });
				this.msg=false;
			}
		},
		methods:{
			//跳转
			async ongrzlTap(){
				let _this=this;
				let [err,res] = await this.$httpas.get('/api/user/index',{},{token:true});
				if (!this.$httpas.errorCheck(err,res)) return;
				if(res.data.code === 1){
					this.listgrzl=res.data.data;
					this.sexsi=res.data.data.gender;
					this.avatarimg = res.data.data.avatar;
				}else{
					uni.showToast({title:res.data.msg})
				}
			},
			modinfo(type,value){
				var this_ = this
				uni.showModal({
					title: this.$t('Edit'),
					content: value,
					editable:true,
					success: function (res) {
						console.log(res)
						if (res.confirm) {
							if(type=='nickname'){
								this_.edituser({nickname:res.content});
							}
							if(type=='age'){
								this_.edituser({age:res.content});
							}
						} else if (res.cancel) {
							
						}
					}
				});
			},
			//选择性别
			sexchange() {
				uni.showActionSheet({
					itemList:this.sex,
					success: (res)=> {
						this.edituser({sex:res.tapIndex});
					}
				});
			},
			async edituser(data) {
				let _this=this;
				let [err,res] = await this.$httpas.post('/api/user/edituser',data,{token:true});
				if (!this.$httpas.errorCheck(err,res)) return;
				if(res.data.code === 1){
					this.ongrzlTap()
					uni.showToast({
						title:this.$t('Operation completed')
					})
				}else{
					uni.showToast({title:res.data.msg})
				}
			},
			clk(index) {
				this.$refs.avatar.fChooseImg(index,{
					selWidth: '350upx', selHeight: '350upx', 
					expWidth: '400upx', expHeight: '400upx',
					inner: index ? 'true' : 'false',
					canRotate:false,
					quality:1,
				});
			},
			doUpload(rsp) {
				uni.showLoading({
				    title: this.$t('Loading')
				});
				uni.uploadFile({
					url: this.apiUrl+'/api/user/uploadpic?token='+uni.getStorageSync("userinfo").token, //仅为示例，非真实的接口地址
					filePath: rsp.path,
					name: "file",
					dataType:"json",
					formData: {
						'type':'avatar',
						// #ifdef H5
						'base64':rsp.base64, //h5上传base64
						// #endif
					},
					success: (uploadFileRes) => {
						var dataarr=JSON.parse(uploadFileRes.data);
						if(dataarr.code==1){
							this.avatarimg=this.apiUrl+dataarr.data.url;
							uni.showToast({
								title:this.$t('Operation completed')
							})
							
						}else{
							uni.showToast({
								title:dataarr.msg
							})
						}
					},
					complete(res) {
						uni.hideLoading();
					}
				});
			}
		}
	}
</script>

<style lang='scss'>
	page{
		background: $page-color-base;
	}
	.yyt-ellipsis{
		display: inline-block;
		overflow:hidden; //超出的文本隐藏
		text-overflow:ellipsis; //溢出用省略号显示
		white-space:nowrap; //溢出不换
	}
	.avatar{
		padding-top: 40upx!important;
		padding-bottom: 40upx!important;
	}
	.agess{
		position: absolute;
		z-index: 2;
		top: 0px;
		right: 0px;
		height: 100%;
		line-height: 38px;
		padding-left: 200px;
		padding-right: 36px!important;
		background: transparent;
	}
	.avatar .cell-tit{
		font-weight: bold!important;
	}
	.avatar image{
		position: absolute;
		top: 50%;
		right: 36px;
		width: 88upx;
		height: 88upx;
		border-radius: 50%;
		margin-top: -44upx;
		z-index: 1
	}
	.list-cell{
		display:flex;
		align-items:baseline;
		padding: 20upx $page-row-spacing;
		line-height:60upx;
		position:relative;
		background: #fff;
		justify-content: center;
		align-items: center;
		&.log-out-btn{
			margin-top: 40upx;
			.cell-tit{
				color: $uni-color-primary;
				text-align: center;
				margin-right: 0;
			}
		}
		&.cell-hover{
			background:#fafafa;
		}
		&.b-b:after{
			left: 30upx;
		}
		&.m-t{
			margin-top: 16upx; 
		}
		.cell-more{
			align-self: baseline;
			font-size:$font-lg;
			color:$font-color-light;
			margin-left:10upx;
		}
		.cell-tit{
			flex: 1;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			margin-right:10upx;
		}
		.cell-tip{
			font-size: $font-base;
			color: $font-color-light;
		}
		switch{
			transform: translateX(16upx) scale(.84);
		}
	}
</style>
