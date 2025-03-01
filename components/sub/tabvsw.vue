<!--分类切换，支持拖动显示，无底部亮条,灰色背景,选项按钮形式-->
<template>
	<view class="tab-nav-plus">
		<view class="tab-nav-plus-main"  :class="isFixed ? 'fixed' : ''">
			<scroll-view :scroll-left="getLeft" :scroll-with-animation="true" :scroll-x="true" class="tab-nav-plus-scroll">
				<view v-for="(item,index) in tabs" :key="index"  :data-index="index" @click="tabClick" class="item">
					<view class="tit" :class="selectIndex == index ? 'on' : ''" :style="{color: selectIndex == index ? '#FF6600': '#353535'}">{{item.name}}</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			scrollTop:{
				type:Number,
				default:0,
			},
			selectIndex:{
				type:Number,
				default:0,
			},
			tabs:{
				type:Array,
				default:function(){
					return new Array;
				}
			}
		},
		data(){
			return {
				myTop:150,
			}
		},
		computed:{
			isFixed(){
				return this.scrollTop >= this.myTop; 
			},
			getLeft(){ //这个计算不准确 凑合用
				let w = 0;
				for(var a  in this.tabs){
					if(this.selectIndex < a) break;
					let myw = 0;
					if(this.selectIndex == a){
						myw = this.tabs[a].name.length * 32;
					}else{
						myw = this.tabs[a].name.length * 28;
					}
					w+=myw;
				}
				w+= this.selectIndex * 60;
				if(w > 375){
					return  uni.upx2px(w - 375);
				}
				return 0;
			},
		},
		created(){
			setTimeout(()=>{
				const query = uni.createSelectorQuery().in(this);
				let css = '.tab-nav-plus';
				query.select(css).boundingClientRect(data => {
				   this.myTop = data.top;
				}).exec();
			},500);
		},
		methods:{
			tabClick(e){
				let index  = parseInt(e.currentTarget.dataset.index);
				this.$emit('change',index);
			}
		}
	}
</script>

<style>
	::-webkit-scrollbar {
	    display: none;  
	    width: 0 !important;  
	    height: 0 !important;  
	    -webkit-appearance: none;  
	    background: transparent;  
	}
	.tab-nav-plus{
	}
	.tab-nav-plus-main{
		width: 100%;
		padding: 20rpx 0rpx 0rpx 0rpx;
	}
	.tab-nav-plus-main.fixed{
		left: 0;
		z-index: 20;
		box-shadow:0rpx 4rpx 16rpx 0rpx rgba(0,0,0,0.08);
	}
	.tab-nav-plus-scroll{
		width: 100%;
		white-space: nowrap;
	}

	.tab-nav-plus-scroll .item{
		height: 60upx;
		line-height: 60upx;
		display: inline-block;
		margin-left: 20rpx;
		position: relative;
	}
	.tab-nav-plus-scroll .item:last-child{
		margin-right: 20rpx;
	}
	.tab-nav-plus-scroll .item .tit{
		text-align: center;
		height: 48rpx;
		line-height: 44rpx;
		font-size: 26rpx;
		/* border: solid 1upx #ddd; */
		background: #f0f0f0;
		padding: 0upx 16upx;
		border-radius: 12upx;
		font-weight: 500;
		color: #909398;
	}
	.tab-nav-plus-scroll .item .tit.on{
		font-size: 28rpx;
		font-weight: 600;
	}
	.tab-nav-plus-main .tab-nav-plus-scroll .item .bd{
		position: absolute;
		z-index: 1;
		left: calc(50% - 18rpx);
		bottom: 0;
		width: 36rpx;
		height: 12rpx;
		border-radius: 6rpx 6rpx 0rpx 0rpx;
	}
	
	.tab-nav-plus-main.fixed  .tab-nav-plus-scroll .item .bd{
		background: #FFFFFF;
	}
	
</style>