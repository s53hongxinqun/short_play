<template>
	<view class="footer-h">
		<view class="footer-box" :style="{background: barstyle.tabbar_bgcolor}">
			<view class="footer-main">
				<view class="footer-item" v-for="(item,index) in tabBar" :key="index"  @click="linkTo(index)" :style="{width:getWidth}">
					<image class="tabicon" :src="item.cur==1?item.image_sel:item.image" mode="aspectFit"></image>
					<view :style="{color:item.cur==1?barstyle.tabbar_selectedColor:barstyle.tabbar_color}">
						<text class="footer-item-text">{{item.langname}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'//引入mapState
	export default{
		data(){
			return {
				
			}
		},
		computed:{
			 ...mapState({
				tabBar:state =>state.tabBar
			}),
			barstyle(){
				let barstyle={tabbar_bgcolor:'',tabbar_color:'',tabbar_selectedColor:''}
				if(this.siteconfig){
					barstyle.tabbar_bgcolor = this.siteconfig.site.tabbar_bgcolor,
					barstyle.tabbar_color = this.siteconfig.site.tabbar_color,
					barstyle.tabbar_selectedColor = this.siteconfig.site.tabbar_selectedColor
				}
				return barstyle;
			},
			getWidth(){
				let len = this.tabBar.length;
				if(len > 0){
					return  (100/len) + '%';
				}
				return  '100%';
			}
		},
		watch:{
			tabBar:function(newVal){//异步请求有值时候渲染
				if(newVal){
					this.changetab()
				}
			}
		},
		created() {
			this.changetab()
		},
		methods:{
			changetab(){
				if(this.tabBar){
					var pages = getCurrentPages();
					var page = pages[pages.length - 1];
					let pageurl =  page.route
					for(let i=0;i<this.tabBar.length;i++){
						if(this.tabBar[i].url.indexOf(pageurl) !=-1){
							this.tabBar[i].cur=1
						}else{
							this.tabBar[i].cur=0
						}
					}
				}
			},
			linkTo(index){
				uni.redirectTo({
					url:this.tabBar[index].url
				})
			}
		}
	}
</script>

<style>
	.footer-h {
		height: 100rpx;
	}
	
	.footer-box {
		width:750upx;
		position: fixed;
		z-index: 100;
		left: 0;
		bottom: 0;
		background: #FFFFFF;
	}
	
	.footer-main {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-direction: row;
		align-items: center;
		height: 100rpx;
	}
	
	.footer-item {
		flex:1;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		height: 100rpx;
		padding-top: 10rpx;
		
	}
	.tabicon{
		margin-bottom: 5rpx;
		width:50upx;
		height:50upx;
	}
	.footer-item-text{
		font-size:24upx;
	}
</style>