<template>
	<view>
		<view class="sign_conent_box">
			<view class="sign_conent">
				<view class="sign_conent_title">
					{{qdjl}}
				</view>
				<view class="ft12 mt10 cl-light">{{$t('signin.giftmsg')}}</view>
				<view class="sign_list_aligns">
						<view class="scroll_view_items" v-for="(item, index) in sign_list" :key="index">
								<view class="scroll_view_item">
									<view class="ft12 mb5 cl-info">{{ item.day }}</view>
									<view class="scroll_view_item_img_box">
										<uni-icons type="circle" size="24" color="white" v-if="item.xz==1"></uni-icons>
										<uni-icons type="checkbox-filled" size="24" color="#ff007f" v-if="item.xz==2"></uni-icons>
									</view>
									<view class="scroll_view_item_num">{{ item.discount }}</view>
									<view class="scroll_view_item_tips"></view>
								</view>
						</view>
				</view>
				<view class="sign_conent_btn" @click="cksigin()">{{$t('signin.submit')}}</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		sign_list: {},
		qdjl: 0,
		tdsy: 0,
	},
	data() {
		return {
			score_name:this.$t('Score')
		};
	},
	methods: {
		async cksigin() {
			let this_=this
			if(uni.getStorageSync("userinfo")){
				let data = {};
				data.tdsy=this.tdsy
				data.token = uni.getStorageSync("userinfo").token
				data.uid = uni.getStorageSync("userinfo").id
				let [err,res] =await this.$httpas.post('/api/user/qiandao',data);
				if (!this.$httpas.errorCheck(err,res)) return;
				if(res.data.code==1){
					uni.showModal({
						title: this_.$t('Warning'),
						content: res.data.msg,
						showCancel: false,
						success: res => {
							this_.$emit('cksigin')
						}
					});
				}else{
					uni.showToast({ title: res.data.msg,icon:"none" });
				}
			}else{
				this.Needlogin()
			}
		},
	}
};
</script>

<style lang="scss">
.sign_conent_box {
	width: 100%;
	display: flex;
	justify-content: center;
	margin-top: 30upx;
	.sign_conent {
		border-radius: 20upx;
		padding: 0upx 0upx;
		box-sizing: border-box;
		.sign_conent_title {
			width: 100%;
			font-size: 28upx;
			font-weight: bold;
			color: white;
			.sign_conent_title_span {
				color: #ff6526 !important;
			}
		}
		.sign_list_aligns {
			width: 100%;
			padding: 20upx 0 20upx 0;
			box-sizing: border-box;
			display: flex;
			flex-wrap: wrap;
				.scroll_view_items {
					background: rgba(255, 255, 255,.6);
					width: 120rpx;
					border: solid 1px #eeeeee;
					margin: 10rpx;
					text-align: center;
					padding: 8rpx;
					border-radius: 8rpx;
				}
				.scroll_view_item {
					.scroll_view_item_img_box {
						width: 60upx;
						height: 60upx;
						position: relative;
						margin: 0 auto;
					}
					.scroll_view_item_num {
						font-size: 28rpx;
						color: #ff007f;
					}
					.scroll_view_item_tips {
						text-align: center;
						font-size: 24upx;
						color: #333333;
					}
					
				}
				.scroll_xian {
					width: 40upx;
					height: 4upx;
					background: #bfbfbf;
					margin-top: 30upx;
				}
		}
		.sign_conent_btn {
			width: 100%;
			border-radius: 45upx;
			background: linear-gradient(270deg, #ff6aa3 0%, #ff007f 100%);
			color: #ffffff;
			text-align: center;
			padding: 22upx 0;
			font-size: 32upx;
		}
	}
}
</style>
