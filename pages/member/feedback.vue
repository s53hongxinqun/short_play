<template>
	<view class="pd10">
		<view class="box pd16_15">
			<view class="flex alcenter">
				<text class="ft16 cl-main ftw600 ">{{$t('feedback.type')}}</text>
			</view>
			<view class="mt16 flex  wrap">
				<view v-for="(item,index) in tags" :key="index" @click="changeTag(index)" :class="{on:index == selindex}" class="tag-feedback">{{item.name}}</view>
			</view>
		</view>
		
		<view class="mt16  box pd16_15">
			<textarea v-model="content" :placeholder="$t('Please enter the message content')" placeholder-class="cl-notice" class="ft14" style="height: 100rpx; width: 100%;" :maxlength="300"></textarea>
			<view class="mt12 text-right ft12 cl-notice">
				{{content.length}}/300
			</view>
		</view>
		<view class="mt16">
			<button class="btn-big" @tap="subform">{{$t('Submit')}}</button>
		</view>
		
		
		<view class="mt16" v-if="listData.length>0">
			<view v-for="(item,index) in listData" class="box card mt5" :key="index">
				<view class="card-top">
					<view class="flex" style="flex-direction: row;">
						<image class="card-image" :src="item.useravatar"></image>
						<text class="card-name size-14">{{item.username}}</text>
					</view>
					<text class="card-time">{{item.createtime}}</text>
				</view>
				<div class="card-message">
					<view class="card-text size-14">{{item.content}}</view>
					<view class="ft12 cl-blue pd10" v-if="item.reply">{{$t('Reply')}}：{{item.reply}}</view>
				</div>
			</view>
			<uni-load-more :status="status" :content-text="moreText" />
		</view>	
	</view>
</template>

<script>
	export default{
		data(){
			return {
				title:this.$t('feedback.type1'),
				content:'',
				tags:[
					{name:this.$t('feedback.type1')},
					{name:this.$t('feedback.type2')},
					{name:this.$t('feedback.type3')}
				],
				selindex:0,
				reload:false,
				listData: [],
				last_id: 0,
				status: 'more'
			}
		},
		computed:{
			isSubmit(){
				if(this.content.length < 5){
					return false;
				}else{
					return true;
				}
			}
		},
		onLoad(){
			this.getList()
		},
		onReachBottom() {
			this.status = 'more';
			this.getList();
		},
		onShow() {
			uni.setNavigationBarTitle({
			    title: this.$t('Feedback')
			});
		},
		methods:{
			changeTag(index){
				this.selindex=index
				this.title=this.tags[index].name
			},
			subform(){
				if(this.content.length < 5){
					return false;
				}
				let _this=this;
				uni.showModal({
					title: this.$t('Submit'),
					content:this.$t('Are you sure to submit'),
					success: function (res) {
						if (res.confirm) {
							_this.addfeed()
						}
					}
				});
			},
			async addfeed(){
				let _this=this;
				let data = {};
				data.token = uni.getStorageSync("userinfo").token;
				data.uid = uni.getStorageSync("userinfo").id;
				data.title=_this.title
				data.content=_this.content
				let [err,res] =await this.$httpas.post('/api/user/feedback',data);
				if(res.data.code==1){
					uni.showToast({title:res.data.msg})
					_this.last_id=0;
					_this.reload = true;
					_this.getList();
				}else{
					uni.showToast({title:res.data.msg})
				}
			},
			async getList() {
				let data = {};
				var limit=10;
				if (this.last_id>0) {
					this.status = 'loading'
					data.offset = this.last_id*limit
				}
				data.limit=limit		
				data.token = uni.getStorageSync("userinfo").token;
				let [err,res] =await this.$httpas.get('/api/user/feedlist',data);
				if (res.data.rows.length>0) {
					let list = res.data.rows;
					this.listData = this.reload ? list : this.listData.concat(list);
					this.reload = false;
					this.last_id = this.last_id+1;
					if(res.data.total<=this.last_id*limit){
						this.status = '';
					}else{
						this.status = 'more'
					}
				}else{
					this.status = '';
				}
			},
		}
	}
</script>

<style>
	.tag-feedback{
		height: 64rpx;
		border:2rpx solid #E4E6ED;
		padding: 0 20rpx;
		line-height: 60rpx;
		color:#000000;
		font-size: 28rpx;
		border-radius: 32rpx;
		margin-right: 20rpx;
		margin-bottom: 20rpx;
	}
	.tag-feedback.on{
		border:none;
		color:#FFFFFF;
		line-height: 64rpx;
		padding: 0 22rpx;
		background-color: #666666;
	}
	
	.card{
		position: relative;
		padding: 30rpx;
		color:#666;
	}
	.card-image{
		height: 50rpx;
		width: 50rpx;
		border-radius: 50%;
		margin-right: 10rpx;
	}
	.card-top{
		display: flex;
		flex-direction: row;
		height: 50rpx;
		line-height: 50rpx;
		justify-content: space-between;
	}
	.card-message{
		margin-top: 20rpx;
		color: #333;
		font-size: 28rpx;
	}
</style>