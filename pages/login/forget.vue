<template>
  <view class="pt20">
	<view class="tishi">{{$t('Reset password tip')}}</view>
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
        <input class="sl-input" type="text" v-model="password" :placeholder="this.$t('form.newpassword')" :password="!showPassword" />
        <image class="img" :src="showPassword?'/static/shilu-login/op.png':'/static/shilu-login/cl.png'" @tap="display"></image>
      </view>
      <view class="list-call">
        <uni-icons type="color" size="20"></uni-icons>
        <input class="sl-input" type="number" v-model="code" maxlength="6" :placeholder="this.$t('form.code')" />
        <view class="yzm" :class="{ yzms: second>0 }" @tap="getcode">{{yanzhengma}}</view>
      </view>
    </view>
	<view class="mt25 flex center plr30" @tap="bindLogin()">
	  <button class="btn-big">{{$t('Reset password')}}</button>
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
  var _this, js;
  export default {
    data() {
      return {
		tabs:[this.$t('Mobile'),this.$t('Email')],
		selectIndex:0,
		usertype:'mobile',
		countrycode:'',
		countrycode:'',
		codelist:[],
        mobile: '',
        email:'',
        second: 0,
        code: "",
        showPassword: false,
        password: ''
      }
    },
	onShow() {
		uni.setNavigationBarTitle({
		    title: this.$t('Reset password')
		});
	},
    computed: {
      yanzhengma() {
        if (this.second == 0) {
          return this.$t('form.getcode');
        } else {
          if (this.second < 10) {
            return this.$t('form.getcodeagain')+'0' + this.second;
          } else {
            return this.$t('form.getcodeagain') + this.second;
          }
        }
      }
    },
	onLoad() {
		this.nationcode()
	},
    onUnload() {
      this.clear()
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
      display() {
        this.showPassword = !this.showPassword
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
      clear(){
        clearInterval(js)
        js = null
        this.second = 0
      },
      async getcode() {
        if(this.usertype=='mobile' && !this.mobile){
        	uni.showToast({ title: this.$t('form.mobile'),icon:"none" });
        	return false;
        }
        if(this.usertype=='email' && !this.email){
        	uni.showToast({ title: this.$t('form.email'),icon:"none" });
        	return false;
        }
        if (this.second > 0) {
          return;
        }
		// 请求服务器，发送验证码
		var apiurl = this.usertype=='email'?'/api/ems/send':'/api/sms/send';
		var data ={'event':'resetpwd'}
		if(this.usertype=='email'){
			data.email = this.email
		}else{
			data.mobile = this.mobile
			data.countrycode = this.countrycode
		}
		let [err,res] =await this.$httpas.post(apiurl,data);
		if (!this.$httpas.errorCheck(err,res)) return;
		if(res.data.code == 1){
			uni.showToast({ title: res.data.msg,icon:"none" });
			this.second = 60;
			//请求业务
			js = setInterval(() => {
				this.second--;
				if (this.second == 0) {
					this.clear()
				}
			}, 1000);
		}else{
			uni.showToast({ title: res.data.msg,icon:"none" });
		}
      },
      async bindLogin() {
        if(this.usertype=='mobile' && !this.mobile){
        	uni.showToast({ title: this.$t('form.mobile'),icon:"none" });
        	return false;
        }
		if(this.usertype=='email' && !this.email){
			uni.showToast({ title: this.$t('form.email'),icon:"none" });
			return false;
		}
        if (this.password.length < 6) {
          uni.showToast({
            icon: 'none',
            title: this.$t('Password is incorrect')
          });
          return;
        }
		
		var apiurl = this.usertype=='email'?'/api/ems/check':'/api/sms/check';
		var data ={'event':'resetpwd','captcha':this.code}
		if(this.usertype=='email'){
			data.email = this.email
		}else{
			data.mobile = this.mobile
			data.countrycode = this.countrycode
		}	
		let [err,res] =await this.$httpas.post(apiurl,data);
		if (!this.$httpas.errorCheck(err,res)) return;
		if(res.data.code == 0){
			uni.showToast({ title: this.$t('Verification code error'),icon:"none" });
			return false;
		}
		
		this.resetpwd();
      },
	  async resetpwd(){
	  	let _this=this;
	  	let data = {'newpassword':this.password,'captcha':this.code};
		if(this.usertype=='email'){
			data.email = this.email
		}else{
			data.mobile = this.mobile
			data.countrycode = this.countrycode
		}	
	  	let [err,res] =await this.$httpas.post('/api/user/resetpwd',data);
	  	if (!this.$httpas.errorCheck(err,res)) return;
	  	
	  	if(res.data.code === 1){
	  		uni.showModal({
	  			title: this.$t('Warning'),
	  			content: res.data.msg,
	  			showCancel: false,
	  			confirmText: this.$t('OK'),
	  			success: function (ret) {
	  				if (ret.confirm) {
	  					uni.navigateTo({
	  						url:'login'
	  					})
	  				}
	  			}
	  		});
	  	}else{
	  			uni.showToast({ title: res.data.msg,icon:"none" });
	  	}
	  }
    }
  }
</script>

<style>
	.tishi {
		color: #999999;
		font-size: 28rpx;
		margin:20rpx;
		text-align: center;
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

  .yzm {
    color: #FF7D13;
    font-size: 24rpx;
    line-height: 64rpx;
    padding-left: 10rpx;
    padding-right: 10rpx;
    width: auto;
    height: 64rpx;
    border: 1rpx solid rgba(255, 131, 30, 1);
    border-radius: 50rpx;
  }

  .yzms {
    color: #999999 !important;
    border: 1rpx solid #999999;
  }
</style>
