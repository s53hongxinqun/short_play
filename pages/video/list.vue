<template>
	<view>
		<sub-tabvs  v-if="typetab[0]" :tabs="typetab" @change="changetype" :selectIndex="selectIndex" :scrollTop="scrollTop"></sub-tabvs>
		<!-- #ifdef H5 -->
		<view style="background: #ffffff;"> 
			<uni-search-bar @confirm="search" :focus="false" :placeholder="$t('Please enter search keywords')" :cancelText="$t('Cancel')"
			v-model="searchValue"
			@cancel="cancel">
			</uni-search-bar>
		</view>
		<!-- #endif -->
		<view style="margin:10upx 30upx 0 30upx;box-shadow: 0px 4px 20px 0px rgba(0,0,0,0.04);">
			<!-- #ifdef APP-PLUS -->
			<ad :adpid="app_bannerAD" v-if="app_bannerAD !=''"></ad>
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<ad :adpid="h5_bannerAD" v-if="h5_bannerAD !=''"></ad>
			<!-- #endif -->
		</view>
		<com-default :datasa="listData"></com-default>
		<uni-load-more :status="status" :content-text="moreText" />
		<view style="width: 100%; height: 30upx;"></view>
	</view>
</template>

<script>
	  export default {
		data(){
			return {
				typetab:[],
				selectIndex:0,
				typeid:0,//分类id
				mp_bannerAD:'',
				app_bannerAD:'',
				h5_bannerAD:'',
				total:0,
				pageSize:10,
				stype:'',
				title:this.$t('New Drama'),
				scrollTop:0,
				searchValue:'',
				keytext:'',
				listData: [],
				last_id: 0,
				reload: true,
				status: 'more'
			}
		},
		onLoad(e){
			if(e.stype){
				this.stype=e.stype
				if(this.stype=='ishot'){
					this.title=this.$t('Recommend dramas')
				}else if(this.stype=='free'){
					this.title=this.$t('Free video')
				}
			}
			uni.setNavigationBarTitle({
			    title: this.title
			});
			
			if(e.typeid){
				this.typeid = e.typeid
			}
			if(e.keytext){
				this.keytext=e.keytext
				this.searchValue=e.keytext
			}
			
			this.catList()
			
			this.getList();
			
			if(this.siteconfig){
				this.app_bannerAD =this.siteconfig.site.appad.bannerAD
				this.h5_bannerAD =this.siteconfig.site.h5ad.bannerAD
			}
		},
		onPageScroll(e){
			this.scrollTop = e.scrollTop;
		},
		onReachBottom() {
			if(this.last_id>0){
				this.status = 'loading';
				this.getList();
			}
		},
		//监听搜索框文本变化
		onNavigationBarSearchInputChanged(e) {
			let text = e.text;
			this.keytext=text;
		},
		onNavigationBarButtonTap() {
			// #ifdef APP
			plus.key.hideSoftKeybord();
			// #endif
		    
		    var this_=this
		    let text = this.keytext;
		    if (!text) {
		    	uni.showModal({
		    		title: '',
		    		content:this.$t('Please enter search keywords'),
		    		showCancel: false,
		    		confirmColor:"#e19503",
		    		success: function (res) {
						this_.keytext='';
						this_.getList()
		    		}
		    	});
		    	return;
		    } else {
		    	this.keytext=text;
		    	this.listData=[];
		    	this.last_id=0;
		    	this.getList()
		    }
		},
		//监听点击搜索按钮事件
		onNavigationBarSearchInputConfirmed(e) {
			// #ifdef APP
			plus.key.hideSoftKeybord();
			// #endif
			var this_=this
			let text = e.text;
			if (!text) {
				uni.showModal({
					title: '',
					content:this.$t('Please enter search keywords'),
					showCancel: false,
					confirmColor:"#e19503",
					success: function (res) {
						this_.keytext='';
						this_.getList()
					}
				});
				return;
			} else {
				this.keytext=text;
				this.listData=[];
				this.last_id=0;
				this.getList()
			}
			
		},
		methods:{
			async catList(){
				let data = {};
				let [err,res] =await this.$httpas.get('/api/index/catlist',data);
				if(res.data){
					var fenlei = res.data
					if(fenlei.length>0){
						this.typetab=[
							{id:0,name:this.$t('Classify All')}
							]
						for (let i = 0; i < fenlei.length; i++) {
							this.typetab.push(fenlei[i])
						}
					}
					if(this.typeid>0){
						for (var i=0;i<this.typetab.length;i++)
						{ 
							if(this.typeid==this.typetab[i].id){
								this.selectIndex=i
							}
						}
					}
				}
			},
			async getList() {
				let data = {};
				var limit=6;
				if (this.last_id>0) {
					//说明已有数据，目前处于上拉加载
					this.status = 'loading';
					data.offset = this.last_id*limit;
				}
				data.limit=limit		
				if(this.typeid){
					data.typeid=this.typeid
				}
				if(this.stype){
					data.stype=this.stype
				}
				if(this.keytext){
					data.keytext=this.keytext
				}
				let [err,res] =await this.$httpas.get('/api/video/lists',data);
				if(res.data){
					if (res.data.total>0) {
						let list = res.data.rows;
						this.listData = this.reload ? list : this.listData.concat(list);
						this.reload = false;
						this.last_id = this.last_id+1;
						if(res.data.total < this.last_id*limit){
							this.status = '';
						}
					}else{
						this.listData=[];
						this.status=''
					}
				}
			},
			changetype(index){
				this.selectIndex = index;
				this.typeid = this.typetab[index].id
				this.getdata()				
			},
			getdata(){
				this.last_id=0
				this.reload=true
				this.getList()
			},
			search(res) {
				this.listData=[];
				this.last_id=0;
				this.keytext=res.value;	
				this.getList(0)
			},
			cancel(res) {
				this.keytext='';
				this.getList(0)
			}
		}
	}
</script>

<style>
	.vod-img{
		width: 100%;
		height: 280rpx;
		background: #F2F2F2;
		border-radius: 16upx;
	}
	.vod-name{font-size: 28rpx;margin-top: 8rpx;}
	.vod-nums{flex-direction: row;justify-content: space-between;color: #999;margin-top: 8rpx;}
</style>