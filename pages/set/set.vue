<template>
	<view class="container">
		<navigator class="list-cell b-b m-t" url="grzl/grzl" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">{{$t('Profile')}}</text>
			<view class="cell-more"><uni-icons type="right" size="14"></uni-icons></view>
		</navigator>
		<block v-for="(item,index) in artlist" :key="index">
		<navigator class="list-cell b-b" :url="'about?id='+item.id" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">{{item.title}}</text>
			<view class="cell-more"><uni-icons type="right" size="14"></uni-icons></view>
		</navigator>
		</block>
		<view class="list-cell">
			<text class="cell-tit">{{$t('Version')}}</text>
			<text class="cell-tip">{{version}}</text>
		</view>
		<view class="pd16_20" @click="toLogout">
			<view class="btn-big btn-manage">{{$t('Sign out')}}</view>
		</view>
	</view>
</template>

<script>
	import {  mapMutations  } from 'vuex';
	export default {
		data() {
			return {
				artlist:[],
				version:'1.0'
			}
		},
		onShow() {
			uni.setNavigationBarTitle({
			    title: this.$t('Settings')
			});
		},
		onLoad() {
			// #ifdef APP-PLUS
			this.version=plus.runtime.version
			// #endif
			this.article()
		},
		methods:{
			...mapMutations(['logout']),
			
			async article(){
				let data = {type:0};
				let [err,res] =await this.$httpas.get('/api/index/artlist',data);
				if(res.data.code == 1){
					this.artlist = res.data.data
				}
			},
			//退出登录
			toLogout(){
				uni.showModal({
				    content: this.$t('Login out confirm'),
				    success: (e)=>{
				    	if(e.confirm){
							this.logout()
				    		uni.navigateTo({
				    			url:'/pages/index/index'
				    		})
				    	}
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
	.list-cell{
		display:flex;
		align-items:baseline;
		padding: 20upx $page-row-spacing;
		line-height:60upx;
		position:relative;
		background: #fff;
		justify-content: center;
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
