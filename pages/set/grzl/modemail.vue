<template>
  <view class="content">
    <view class="list">
      <view class="tishi">{{$t('Change your E-mail here')}}</view>
      <view class="list-call">
        <uni-icons type="email" size="20"></uni-icons>
        <input class="sl-input" v-model="email" type="text" :placeholder="this.$t('form.email')" />
      </view>
      <view class="list-call">
        <uni-icons type="color" size="20"></uni-icons>
        <input class="sl-input" type="number" v-model="code" maxlength="4" :placeholder="this.$t('form.code')" />
        <view class="yzm" :class="{ yzms: second>0 }" @tap="getcode">{{yanzhengma}}</view>
      </view>
    </view>
    <view class="pd20">
    	<view class="btn-big" @tap="dosubmit()">{{$t('Submit')}}</view>
    </view>
  </view>
</template>

<script>
  var _this, js;
  export default {
    data() {
      return {
		email: '',
		second: 0,
		code: ""
      }
    },
    onLoad() {
		
    },
	onShow() {
		uni.setNavigationBarTitle({
		    title: this.$t('Change email')
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
    onUnload() {
      this.clear()
    },
    methods: {
      clear(){
        clearInterval(js)
        js = null
        this.second = 0
      },
      async getcode() {
        if(!this.email){
        	uni.showToast({ title: this.$t('form.email'),icon:"none" });
        	return false;
        }
        if (this.second > 0) {
          return;
        }
		// 请求服务器，发送验证码
		var data ={'email':this.email,'event':'changeemail'}
		let [err,res] =await this.$httpas.post('/api/ems/send',data);
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
      async dosubmit() {
		  if(!this.email){
			uni.showToast({ title: this.$t('form.email'),icon:"none" });
			return false;
		  }
        if (this.code.length == 0) {
          uni.showToast({
            icon: 'none',
            title: this.$t('form.getcode')
          });
          return;
        }
        var data ={'email':this.email,'event':'changeemail','captcha':this.code}
        let [err,res] =await this.$httpas.post('/api/ems/check',data);
        if (!this.$httpas.errorCheck(err,res)) return;
        if(res.data.code == 0){
        	uni.showToast({ title: this.$t('Verification code error'),icon:"none" });
        	return false;
        }
		this.changeemail();
      },
	  async changeemail(){
	  	let data = {'email':this.email,'captcha':this.code}
	  	let [err,res] =await this.$httpas.post('/api/user/changeemail',data,{token:true});
	  	if (!this.$httpas.errorCheck(err,res)) return;
	  	
	  	if(res.data.code === 1){
	  		uni.showModal({
	  			title: this.$t('Warning'),
	  			content: res.data.msg,
	  			showCancel: false,
	  			confirmText: this.$t('OK'),
	  			success: function (ret) {
	  				if (ret.confirm) {
	  					uni.navigateBack()
	  				}
	  			}
	  		});
	  	}else{
	  		uni.showToast({ title:res.data.msg,icon:"none" });
	  	}
	  }
    }
  }
</script>

<style>
  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .tishi {
    color: #999999;
    font-size: 28rpx;
    line-height: 50rpx;
    margin-bottom: 50rpx;
  }
	.zonecode{width: 80rpx;margin-left: 16rpx;}
  .list {
    display: flex;
    flex-direction: column;
    padding-top: 50rpx;
    padding-left: 70rpx;
    padding-right: 70rpx;
  }

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
