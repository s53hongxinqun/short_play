<template>
	<view>
		<view class="pd5">
			<uni-grid :column="3" :show-border="false" :square="false">
				<uni-grid-item v-for="(value,key) in datasa" :key="key">
				<view class="vod-item" @click="detail(value.vid,0)">
					<image class="vod-img" mode="scaleToFill" :src="value.img"></image>
					<view class="vod-name text-over">{{value.name}}</view>
					<view class="vod-nums flex">
						<view class="ft12">{{value.totalnum}}</view>
						 <view class="ft12"><uni-icons type="eye" size="14"></uni-icons> {{value.views}}</view>
					</view>
				</view>
				</uni-grid-item>
			</uni-grid>
		</view>
	</view>
</template>

<script>
	export default{
		props: ['datasa'],
		data(){
			return {
				
			}
		},
		methods:{
			
		}
	}
</script>

<style>
	.vod-item{
		margin-top: 15upx;
		padding: 10upx;
	}
	.vod-img{
		width: 100%;
		height: 280rpx;
		background: #F2F2F2;
		border-radius: 16upx;
	}
	.vod-name{font-size: 28rpx;margin-top: 8rpx;}
	.vod-nums{flex-direction: row;justify-content: space-between;color: #999;margin-top: 8rpx;}
	
</style>
