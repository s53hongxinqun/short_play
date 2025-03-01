<template>
	<view>
		<!-- 状态栏占位符 隐藏导航条时使用-->
		<view class="status_bar"><view class="top_view"></view>  </view>
		<view class="header flex space alcenter">
			<view class="search">
				<uni-search-bar @confirm="search" :focus="false" cancelButton="none" bgColor="#FFF"
				:placeholder="$t('Search drama')" 
				v-model="searchValue">
				</uni-search-bar>
			</view>
			<view class="setlang ft12 mr15" v-if="langs">
				<picker @change="changelang" :value="langset" :range="langs" range-key="lang_name">
					<view class="uni-input">{{langs[langset].lang_name}}</view>
				</picker>
			</view>
		</view>
		<view style="margin-top: 108upx;"></view>
		<view class="banner pd0_15" v-if="banners && banners.length>0">
			<com-banner :banners="banners" :key="bannerkey"></com-banner>
		</view>
		
		<!--推荐-->
		<view class="pd15" v-if="hotdata.length>0">
			<view class="flex alcenter space">
				<view class="">
					<text class="ft16 ftw600 cl-main">{{$t('Recommend dramas')}}</text>
					<uni-icons type="hand-up" size="20" color="red"></uni-icons>
				</view>
				<navigator url="/pages/video/rank?stype=ishot" class="ft14 cl-notice">{{$t('More')}}</navigator>
			</view>
			<view class="mt16 flex space">
				<block v-for="(value,key) in hotdata" :key="key" v-if="key<3">
				<view class="pb10" style="width:31%; position: relative; border-radius:20rpx;" @click="detail(value.id,0)">
					<image class="vod-img" mode="scaleToFill" :src="value.img"></image>
					<view class="text-over cl-title ft14">{{value.name}}</view>
					<view class="flex space mt5">
						<view class="ft12 cl-info">{{value.totalnum}}</view>
						 <view class="ft12 cl-info"><uni-icons type="eye" size="14"></uni-icons> {{value.views}}</view>
					</view>
				</view>
				</block>	
		
			</view>
		</view>
			
		<!--排行-->
		<view class="rank plr15" v-if="givedata.length>0">
			<view class="flex space">
				<view class="flex alcenter">
					<text class="ft16 ftw600">{{$t('Play ranking')}}</text>
					<uni-icons type="fire" size="20" color="red"></uni-icons>
				</view>
				<navigator url="/pages/video/rank?stype=top">
				<view class="ft14 cl-notice">{{$t('More')}}</view>
				</navigator>
			</view>
			<view class="mt16 flex space">
				<block v-for="(value,key) in givedata" :key="key" v-if="key<3">
				<view class="pb10" style="width:31%; position: relative; border-radius:20rpx;" @click="detail(value.id,0)">
					<view class="vod-badge" :class="'bg' + key">{{key+1}}</view>
					<image class="vod-img" mode="scaleToFill" :src="value.img"></image>
					<view class="text-over cl-title ft14">{{value.name}}</view>
					<view class="flex space mt5">
						<view class="ft12 cl-info">{{value.totalnum}}</view>
						 <view class="ft12 cl-info"><uni-icons type="eye" size="14"></uni-icons> {{value.views}}</view>
					</view>
				</view>
				</block>				
			</view>	
		</view>

		<view class="mt15">
			<view class="flex alcenter space plr15">
				<view class="flex alcenter">
					<text class="ft16 ftw600 cl-main">{{$t('New Drama')}}</text>
				</view>
				<navigator url="/pages/video/list">
				<view class="ft14 cl-notice">{{ $t('More') }}</view>
				</navigator>
			</view>
			<com-default :datasa="newdata"></com-default>
		</view>
		<uni-load-more :status="status" :content-text="moreText" />
		
		<com-footer></com-footer>
	</view>
</template>
<script>
	export default{
		data(){
			return {
				langs:[{lang_name:''}],
				langset:0,
				fastnav:[],
				typetab:[],
				selectIndex:0,
				searchValue:'',
				banners:[],
				bannerkey:0,
				datainfo:[],
				dataindex:[],
				hotdata:[],
				givedata:[],
				newdata:[],
				last_id: 0,
				reload: false,
				status: 'more',
			}
		},
		onLoad(e){
			if(e.invitecode){
				uni.setStorageSync('invitecode',e.invitecode)
			}
			this.getlang()
			this.getfastnav()
			this.indexData()
			this.getNews();
		},
		onReachBottom() {
			if(this.last_id>0){
				this.getNews();
			}
		},
		onShow() {
			uni.setNavigationBarTitle({
			    title: this.$t('App name')
			});
		},
		methods:{
			async getlang(){
				let that=this
				let data = {};
				let [err,res] =await this.$httpas.get('/api/index/lang_list',data);
				if(res.data.code == 1){
					this.langs=res.data.data
					let locale=uni.getStorageSync('locale')
					if(!locale){
						locale=this.langs[0]['flag']
					}
					//uni.setLocale(locale)
					for(var i=0;i<this.langs.length;i++){
						if(this.langs[i]['flag']==locale){
							this.langset = i;
						}
					}
				}
			},
			changelang(e){
				var index = e?e.detail.value:0;
				this.langset = index
				var lang_flag = this.langs[index].flag
				uni.setStorageSync('langset', index);
				uni.setStorageSync('locale', lang_flag);
				uni.setLocale(lang_flag)
				this.$i18n.locale = lang_flag
				
				uni.setNavigationBarTitle({
				    title: this.$t('App name')
				});

				this.getfastnav();
				this.indexData();
				getApp().getTabbar();
				this.reload=true;
				this.last_id=0;
				this.getNews();
			},
			
			async getfastnav(){
				let data = {type:1};
				let [err,res] =await this.$httpas.get('/api/index/navmenu',data);
				if(res.data.code == 1){
					this.fastnav=res.data.data
				}
			},
			changetype(index){
				this.selectIndex = index;
				this.typeid = this.typetab[index].id
				if(this.typeid){
					uni.navigateTo({
						url:'/pages/video/list?typeid='+this.typeid
					})
				}else{
					uni.navigateTo({
						url:'/pages/video/list'
					})
				}	
			},
			search(res) {
				uni.navigateTo({
					url:'/pages/video/list?keytext='+res.value
				})
			},
			async indexData() {
				let this_=this
				let data = {};
				let [err,res] =await this.$httpas.get('/api/index/index',data);
				if(res.data){
					this.hotdata=res.data.hotdata
					this.givedata=res.data.givedata
					
					this.bannerkey=this.bannerkey+1;
					this.banners = res.data.banners
				}
			},
			async getNews() {
				let data = {};
				var limit=3;
				if (this.last_id>0) {
					//说明已有数据，目前处于上拉加载
					this.status = 'loading';
					data.offset = this.last_id*limit;
				}
				data.limit=limit
				let [err,res] =await this.$httpas.get('/api/video/lists',data);
				if(res.data){			
					if (res.data.rows) {
						let list = res.data.rows;
						this.newdata = this.reload ? list : this.newdata.concat(list);
						this.reload = false;
						this.last_id = this.last_id+1;
						if(res.data.total<this.last_id*limit){
							this.status = 'nomore';
						}
					}else{
						this.status='nomore'
					}
				}
			}
		},
	}
</script>

<style>
	.top_view {  
	    height: var(--status-bar-height);  
	    width: 100%;  
	    position: fixed;  
	    background-color: #f1f5f8;  
	    top: 0;  
	    z-index: 999;  
	}
	.header{
		width:100%;
		background: #f1f5f8;
		position: fixed;
		top:var(--status-bar-height);
		left:0;
		z-index:500;
	}
	.search{width: 75%;}
	.setlang{
		background: #ff007f;
		color:white;
		padding: 10upx 15upx;
		border-radius: 30upx;
	}
	.rank{
		background: repeating-linear-gradient(182deg, #eee6c2, #f1f5f8);
		padding-top: 30upx;
		padding-bottom: 20upx;
	}
	.vod-badge{
		width: 36rpx;
		height: 42rpx;
		border-radius:0 8rpx;
		position: absolute;left:0;top:0;color: white;
		z-index: 100;
		text-align: center;
		opacity: 0.8;
		font-weight: 600;
	}
	.vod-badge.bg0{background-color: red;}
	.vod-badge.bg1{background-color: orangered;}
	.vod-badge.bg2{background-color: orange;}
	.vod-img{
		width: 100%;
		height: 280rpx;
		background: #F2F2F2;
		border-radius: 16upx;
	}
</style>