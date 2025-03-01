<!--登录选项卡-->
<template>
	<view class="nav-tab-list">
		<view class="main">
			<view class="item" v-for="(item,index) in tabs" :key="index" @click="changeTab(index)" 
			:class="selectIndex == index ? 'selon' : '' ">
				{{item}}
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			isMain:{
				type:Boolean,
				default:true
			},
			tabs:{
				type:Array,
				default:function(){
					return new Array;
				}
			},
			selectIndex:{
				type:Number,
				default:0
			}
		},
		data(){
			return {
				
			}
		},
		methods:{
			changeTab(index){
				this.$emit('change',index);
			}
		}
	}
</script>

<style>
	.nav-tab-list{
		padding: 10rpx 60rpx;
		height:50rpx;
		position: relative;
	}
	.nav-tab-list .main{
		width: 100%;
		height: 100rpx;
		display: flex;
		align-items: center;
	}
	.nav-tab-list .item{
		padding: 10rpx 60rpx;
		background-color: #eee;
	}
	.nav-tab-list .selon{
		background:linear-gradient(-90deg, #ff007f, #ffd8ed) ;
		color: white;
	}
</style>