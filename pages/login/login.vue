<template>
  <view>
    <view class="header flex center">
      <image :src="siteconfig?siteconfig.site.logo:''"></image>
    </view>
	<sub-tablogin v-if="tabs[0]" :tabs="tabs" @change="changetype" :selectIndex="selectIndex"></sub-tablogin>
    <view class="list">
      <view class="list-call" v-if="usertype=='mobile'">
        <uni-icons type="phone" size="20"></uni-icons>
		<input class="zonecode" v-model="countrycode" maxlength="5" placeholder="Code" @tap="showcode()" />
        <input class="sl-input" v-model="mobile" type="number" maxlength="11" :placeholder="this.$t('form.mobile')" />
      </view>
	  <view class="list-call" v-if="usertype=='email'">
	    <uni-icons type="email" size="20"></uni-icons>
	    <input class="sl-input" v-model="email" type="text" :placeholder="this.$t('form.email')" />
	  </view>
      <view class="list-call">
        <uni-icons type="locked" size="20"></uni-icons>
        <input class="sl-input" v-model="password" type="text" maxlength="32" :placeholder="this.$t('form.password')" password="true" />
      </view>
    </view>
	<view class="agreement">
		<view @tap="agreementSuccess">
			<uni-icons v-if="agreement==true" type="circle-filled" size="20"></uni-icons>
			<uni-icons v-else type="circle" size="20"></uni-icons>
		</view>
	  <text @tap="agreementSuccess">{{$t('Agree')}}</text>
	  <navigator class="ml5 mr5" open-type="navigate" url="/pages/login/agreement">{{$t('Agreement.user')}}</navigator>&
	  <navigator class="ml5" open-type="navigate" url="/pages/login/agreement?type=privacy">{{$t('Agreement.privacy')}}</navigator>
	</view>
	<view class="mt25 flex center plr30" @tap="bindLogin()">
	  <button class="btn-big">{{$t('Login')}}</button>
	</view>
	
	
	<view class="mt32 flex center">
	  <navigator class="plr10 cl-info" url="reg" open-type="navigate">{{$t('Sign up')}}</navigator>
	  <navigator class="plr10 cl-info" url="forget" open-type="navigate">{{$t('Reset password')}}</navigator>
	</view>

	<uni-popup ref="codelist" type="bottom">
		<view class="codelist box pd15">
		<scroll-view :scroll-y="true" style="height: 500rpx;">
			<block v-for="(item,index) in codelist" :key="index">
				<view class="flex space pd15 bd-bottom" @tap="selcode(item.telcode)">
					<text class="name">{{item.lang_name}}</text>
					<text class="code mr15">+{{item.telcode}}</text>
				</view>
			</block>
		</scroll-view>
		</view>
	</uni-popup>
  </view>
</template>

<script>
import store from '@/static/js/store/store.js';
export default {
	data() {
	  return {
		tabs:[this.$t('Mobile'),this.$t('Email')],
		selectIndex:0,
		usertype:'mobile',
		countrycode:'',
		codelist:[],
		mobile: '',
		email:'',
		password: '',
		agreement: false,
	  };
	},
	onLoad(e) {
		this.nationcode()
	},
	onShow() {
		uni.setNavigationBarTitle({
		    title: this.$t('Sign in')
		});
	},
    methods: {
		changetype(index){
			this.selectIndex = index;
			if(index==1){
				this.usertype='email'
			}else{
				this.usertype='mobile'
			}
		},
		async nationcode(){
			var data ={}
			let [err,res] =await this.$httpas.post('/api/index/nationcode',data);
			if(res.data.code == 1){
				this.codelist = res.data.data
				this.countrycode = '+'+this.codelist[0].telcode
			}
		},
		showcode(){
			this.$refs.codelist.open('bottom');
		},
		selcode(code){
			this.countrycode='+'+code;
			this.$refs.codelist.close();
		},
		agreementSuccess() {
		  this.agreement = !this.agreement;
		},
		async bindLogin() {
			let _this =this;
			if(this.usertype=='mobile' && !this.mobile){
				uni.showToast({ title: this.$t('form.mobile'),icon:"none" });
				return false;
			}
			if(this.usertype=='email' && !this.email){
				uni.showToast({ title: this.$t('form.email'),icon:"none" });
				return false;
			}
			if(!this.password){
				uni.showToast({ title: this.$t('form.password'),icon:"none" });
				return false;
			}
			if (this.agreement == false) {
				uni.showToast({ title: this.$t('Please agree agreement'),icon:"none" });
				return false;
			}
			
			let account=this.usertype=='email'?this.email:this.mobile
			let data = {'account':account,'password':this.password};
			let [err,res] =await this.$httpas.get('/api/user/login',data);
			if (!this.$httpas.errorCheck(err,res)) return;
			if(res.data.code === 1){
				var userinfo = res.data.data.userinfo
				store.commit('setMember', userinfo)
				uni.navigateTo({
					url:'/pages/member/index'
				})
			}else{
				uni.showToast({ title: res.data.msg,icon:"none" });
			}

		}
	}
}
</script>

<style>
	.header {
		margin-top: 80upx;
		margin-bottom: 50upx;
	}
	.header image {
		width: 161rpx;
		height: 161rpx;
		border-radius: 50%;
	}
  .list {
    display: flex;
    flex-direction: column;
    padding-top: 50rpx;
    padding-left: 70rpx;
    padding-right: 70rpx;
  }
  .zonecode{width: 80rpx;margin-left: 16rpx;}
  .list-call {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 100rpx;
    color: #333333;
    border-bottom: 0.5px solid #e2e2e2;
  }
  
  .list-call .img {
    width: 40rpx;
    height: 40rpx;
  }
  
  .list-call .sl-input {
    flex: 1;
    text-align: left;
    font-size: 32rpx;
    margin-left: 16rpx;
  }
  .agreement {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-size: 30rpx;
    margin-top: 80rpx;
    color: #333333;
    text-align: center;
    height: 40rpx;
    line-height: 40rpx;
  }
  
  .agreement image {
    width: 40rpx;
    height: 40rpx;
  }
</style>
