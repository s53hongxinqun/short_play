<template>
	<view>
		<view class="canvas">
			<canvas class="canvasa" canvas-id="firstCanvas" id="firstCanvas" :style="{ width: cansWidth + 'px', height: cansHeight + 'px' }"></canvas>
		</view>
		
		<view class="imglist">
			<view :style="[{ width:widths+'upx'}]">
				<block v-for="(swiperLists,index) in swiperList" :key="index">
					<image style="padding: 4upx;" @click="selseimg(swiperLists.posterImg)" :src="swiperLists.posterImg" mode="aspectFill"></image>
				</block>
			</view>
		</view>
		<view class="bottom bg-default">
			<view class="bottom2" @click="upbj()">{{$t('Upload')}}</view>
			<view class="bottom3" @click="sharelink()">{{$t('share.copy')}}</view>
			<!-- #ifndef H5 -->
			<view class="bottom1"  @click="saveCans()">{{$t('share.saveposter')}}</view>
			<!-- #endif -->
		</view>
		<yq-avatar @upload="doUpload" @avtinit="doBefore" quality="1" ref="avatar"></yq-avatar>
	</view>
</template>
<script>
	import QR from '@/static/js/wxqrcode.js';
	var that
	export default {
		data() {
			return {
				invitecode:'',
				bgimg:'',
				boximg:'',
				avatar:'',
				qrcodeImg:'',
				cansWidth: 375, //海报宽度
				cansHeight: 600, //海报高度
				widths: "", //图片列表动态宽度
				imgsrc: "", //保存图片的路径
				userdata: {}, //个人数据
				swiperList: [] ,//海报数组
				qrurl:'',
				adtext:this.$t('share.adtext')
			};
		},
		onLoad: function() {
			uni.setNavigationBarTitle({
			    title: this.$t('fenxiao.share')
			});

			this.invitecode = this.inviteCode
			this.avatar = this.memberInfo.avatar

			//注册地址h5直接注册，APP注册后跳转下载地址
			this.qrurl=this.apiUrl+'/h5/#/?invitecode='+this.invitecode
			
			let img = QR.createQrCodeImg(this.qrurl, {  
			     size: 360//二维码大小  
			})
			this.qrcodeImg = img;
			//console.log(this.qrcodeImg)
			that = this
			that.huizhihaibao() //请求海报数据
		},
		methods: {
			upbj(){
				var index=0;
				var that = this
				this.$refs.avatar.fChooseImg(index,{
					selWidth: '500upx', selHeight: '893upx', 
					expWidth: '800upx', expHeight: '1429upx',
					inner: index ? 'true' : 'false',
					canRotate:false,
					quality:1,
				});
			},

			doUpload(rsp) {
				this.selseimg(rsp.path)
			},
			doBefore() {
				console.log('doBefore');
			},
			huizhihaibao() {
				var that = this
				//数据请求结束
				uni.showLoading({
					title: 'loading'
				});
				if(this.siteconfig.site.fxhb){
					var swiperList = this.siteconfig.site.fxhb
					let goodsData = [];
					swiperList.forEach(item=>{
						if(item.indexOf("http") != -1){
							item=item
						}else{
							item=that.apiUrl+item
						}
						goodsData.push({
							posterImg: item 
						})
					})
					that.swiperList=goodsData
				}else{
					that.swiperList = []
				}
				uni.hideLoading();
				//数据请求结束
				that.bgimg = that.swiperList[0].posterImg
				that.boximg = that.staticUrl+'zw.png'
				// #ifdef H5
				that.selseimg(that.bgimg)
				// #endif
				// #ifdef APP-PLUS
				//下载图像
				uni.downloadFile({
					url: that.boximg,
					success: function(res) {
						if(res.tempFilePath){
							that.boximg =res.tempFilePath
						}
					}
				})
				uni.downloadFile({
					url: that.avatar,
					success: function(res) {
						if(res.tempFilePath){
							that.avatar =res.tempFilePath
						}
					}
				})
				uni.downloadFile({
					url: that.bgimg,
					success: function(res) {
						if(res.tempFilePath){
							that.bgimg =res.tempFilePath
							that.selseimg(that.bgimg)
						}
					}
				})
				// #endif
				
			},
			selseimg(e) { //绘制海报
				if (that.memberInfo.nickname > 6) { //昵称太长加省略号
					that.memberInfo.nickname = that.memberInfo.nickname.slice(0, 6) + "..."
				}
				uni.showLoading({
					title: 'loading'
				});
				
				that.selseimging(e)
			},
			selseimging(hbbj){
				const context = uni.createCanvasContext('firstCanvas')
				context.drawImage(hbbj, 0, 0, that.cansWidth, that.cansHeight) //海报背景
				var yd=20;//控制y的距离
				setTimeout(function() { //定时器，海报方法不能立即执行，等页面渲染完成
					context.shadowColor = '#999999';
					context.shadowOffsetX = 0;// 设置阴影的横向偏移量
					context.shadowOffsetY = 0;
					context.shadowBlur = 5;// 设置模糊等级
					context.drawImage(that.boximg,10, 450+yd, 355, 110) //个人信息背景
					context.fill()
					context.save()
					
					context.drawImage(that.qrcodeImg, 260, 454+yd, 100, 100) //二维码图片 
					context.setFillStyle('#333333')
					context.setFontSize(14)
					context.fillText(that.$t('share.code')+that.invitecode, 20, 473+yd)
					context.fill()
					
					context.setFillStyle('#333333')
					context.setFontSize(14)
					context.fillText(that.memberInfo.nickname, 80, 505+yd) //昵称
					context.fill()
				
					context.setFillStyle('#333333')
					context.setFontSize(14)
					context.fillText(that.$t('share.invite'), 80, 525+yd)
					context.fillText(that.adtext, 80, 545+yd)
					context.fill()
					context.save()
					context.beginPath()
					context.arc(44, 520+yd, 25, 0, 2 * Math.PI)
					context.clip()
					context.drawImage(that.avatar, 17, 490+yd, 55, 55) //头像
					context.restore()
					context.draw()
					
					setTimeout(function () {
						let tempRatio = 1;
						uni.canvasToTempFilePath({
							x: 0,
							y: 0,
							width: that.cansWidth * tempRatio* 4,
							height: that.cansHeight * tempRatio* 4,
							destWidth: that.cansWidth * tempRatio * 4,
							destHeight: that.cansHeight * tempRatio * 4,
							canvasId: 'firstCanvas',
							success: function(res) {
								that.imgsrc = res.tempFilePath
							}
						}, this)
					}, 600);
					uni.hideLoading();
				}, 1000);
			},
			sharelink(){
				uni.setClipboardData({
					data: this.qrurl,
					complete() {
						uni.showToast({
							title: that.$t('Sharing link copied')
						})
					}
				})
			},
			saveCans(){
				uni.showLoading({
					title: this.$t('share.saving')
				});
				uni.saveImageToPhotosAlbum({
					filePath: that.imgsrc,
					success: function(red) {
						uni.showToast({
							title: this.$t('share.saveok')
						})
					},
					fail(res) {
						if (res.errMsg == "saveImageToPhotosAlbum:fail auth deny") {
							uni.showModal({
								title: this.$t('share.needauth')
							})
						}
					}
				});
				uni.hideLoading()
			}

		}
	}
</script>

<style>
	.pageHeader {
		height: var(--status-bar-height);
		background-color: #FFFFFF;
	}

	.box-header {
		position: fixed;
		top: 0upx;
		width: 100%;
		z-index: 100;
	}

	.top-box {
		height: 100upx;
		width: 100%;
	}

	.canvas {
		display: flex;
		justify-content: center;
		border-radius: 16upx;
	}

	.bottom {
		padding: 20upx 0;
		width: 100%;
		display: flex;
		justify-content: space-around;
		position: fixed;
		bottom: 0;
	}
	
	.bottom1 {
		padding: 20upx 40upx;
		background: #FF8A00;
		border-radius: 44upx;
		font-size: 30upx;
		color: #FFFFFF;
	}
	
	.bottom2 {
		padding: 20upx 40upx;
		background: #FF5256;
		border-radius: 44upx;
		font-size: 30upx;
		color: #FFFFFF;
	}
	.bottom3 {
		padding: 20upx 40upx;
		background: #5E40FF;
		border-radius: 44upx;
		font-size: 30upx;
		color: #FFFFFF;
	}

	.imglist {
		width: 100%;
		padding: 20upx 0;
		overflow: auto;
	}

	.imglist view {
		display: flex;
		justify-content: space-around;
	}

	.imglist image {
		width: 200rpx;
		height: 200rpx;
		border-radius: 30rpx;
	}
</style>
