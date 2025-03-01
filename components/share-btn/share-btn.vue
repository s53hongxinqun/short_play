<template>
	<view class="sharebtn">
		<view class="uni-share">
			<view class="uni-share-content">
				<view v-for="(item, index) in bottomData" :key="index" style="position: relative;" class="uni-share-content-box" >
					<view class="uni-share-content-image">
						<image :src="item.icon" class="content-image" />
					</view>
					<text class="uni-share-content-text">{{ item.text }}</text>
					<button open-type="share" style="position: absolute; background: none; width: 100%; height: 100%;"  @click='btnShare(item.text)'></button>
				</view>
				
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				bottomData: [
					// #ifdef H5 
					{
						text: '复制',
						icon: '/static/index/copy.png',
						name: 'copy'
					}
					// #endif
					// #ifdef APP-PLUS || MP-WEIXIN
					{
						text: '微信',
						icon: '/static/index/weixin.png',
						name: 'wx'
					},
					{
						text: '朋友圈',
						icon: '/static/index/pengyouquan.png',
						name: 'copy'
					}
					
					// #endif
					
				],
				// sharedataTemp: {
				// 	type: 0,
				// 	strShareUrl: "https://uniapp.dcloud.io",
				// 	strShareTitle: "分享标题",
				// 	strShareSummary: "分享总结",
				// 	strShareImageUrl: "/static/sharemenu/copyurl.png"
				// }
			}
		},
		props: ["sharedataTemp"],
		// onLoad() {
		// 	console.log('sharedataTemp',this.sharedataTemp);
		// },
		methods: {
			btnShare(ind) {
				console.log(ind);
				var strProvider = "",
					strScene = "",
					mytype = '';
				switch (ind) {
					case '复制':
						uni.setClipboardData({
							data: this.sharedataTemp.strShareUrl,
							complete() {
								uni.showToast({
									title: "已复制到剪贴板"
								})
							}
						})
						break;
					case '微信':
						strProvider = "weixin"
						strScene = "WXSceneSession"
						mytype = 0
						break;
					case '朋友圈':
						strProvider = "weixin"
						strScene = "WXSenceTimeline"
						mytype = 0
						break;
				}
				if (strProvider != "") { //点击了0-3序号的这4个按钮
					uni.share({
						provider: strProvider,
						scene: strScene,
						type: mytype,
						href: this.sharedataTemp.strShareUrl,
						title: this.sharedataTemp.strShareTitle,
						summary: this.sharedataTemp.strShareSummary,
						imageUrl: this.sharedataTemp.strShareImageUrl,
						success: function(res) {
							console.log("success:" + JSON.stringify(res));
						},
						fail: function(err) {
							console.log("fail:" + JSON.stringify(err));
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	/* 底部分享 */
	.sharebtn {
		.uni-share {
			width: 690rpx;
			margin: 30rpx;
			border-radius: 30rpx;
			/* #ifndef APP-NVUE */
			display: flex;
			flex-direction: column;
			/* #endif */
			background-color: #fff;
			.uni-share-content {
				/* #ifndef APP-NVUE */
				display: flex;
				/* #endif */
				flex-direction: row;
				flex-wrap: nowrap;
				justify-content: center;
				overflow-x: scroll;
				padding: 15px 50rpx;
				.uni-share-content-box {
					/* #ifndef APP-NVUE */
					display: flex;
					/* #endif */
					flex-direction: column;
					align-items: center;
					// width: 25%;
					// justify-content: space-between;
					margin-right: 60rpx;
					&:nth-last-child(1) {
						margin-right: 0;
					}
					.uni-share-content-image {
						/* #ifndef APP-NVUE */
						display: flex;
						/* #endif */
						flex-direction: row;
						justify-content: center;
						align-items: center;
						width: 90rpx;
						height: 90rpx;
						overflow: hidden;
						border-radius: 10rpx;
						.content-image {
							width: 90rpx;
							height: 90rpx;
						}
					}
					&:nth-last-child(1){
						.uni-share-content-image .content-image {
							width: 50rpx!important;
							height: 50rpx!important;
						}
					}
					.uni-share-content-text {
						font-size: 26rpx;
						color: #333;
						padding-top: 5px;
						padding-bottom: 10px;
					}
				}
			}
		}
	}
</style>
