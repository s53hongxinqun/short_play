<template>
  <view class="content">
    <view class="list">
      <view class="tishi">{{$t('Change your phone number here')}}</view>
      <view class="list-call">
        <uni-icons type="phone" size="20"></uni-icons>
		<input class="zonecode" v-model="countrycode" maxlength="5" placeholder="Code" @tap="showcode()" />
        <input class="sl-input" type="number" v-model="phone" maxlength="11" :placeholder="this.$t('form.mobile')" />
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
		countrycode:'',
		codelist:[],
		phone: '',
		second: 0,
		code: ""
      }
    },
    onLoad() {
		this.nationcode()
    },
	onShow() {
		uni.setNavigationBarTitle({
		    title: this.$t('Change mobile')
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
        if (this.phone.length <4) {
          uni.showToast({
            icon: 'none',
            title: this.$t('form.mobile')
          });
          return;
        }
        if (this.second > 0) {
          return;
        }
		// 请求服务器，发送验证码
		var data ={'mobile':this.phone,'event':'changemobile','countrycode':this.countrycode}
		let [err,res] =await this.$httpas.post('/api/sms/send',data);
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
       if (this.phone.length <4) {
         uni.showToast({
           icon: 'none',
           title: this.$t('Mobile is incorrect')
         });
         return;
       }
        if (this.code.length == 0) {
          uni.showToast({
            icon: 'none',
            title: this.$t('form.getcode')
          });
          return;
        }
        var data ={'mobile':this.phone,'event':'changemobile','captcha':this.code}
        let [err,res] =await this.$httpas.post('/api/sms/check',data);
        if (!this.$httpas.errorCheck(err,res)) return;
        if(res.data.code == 0){
        	uni.showToast({ title: this.$t('Verification code error'),icon:"none" });
        	return false;
        }
		this.changemobile();
      },
	  async changemobile(){
	  	let data = {'mobile':this.phone,'captcha':this.code}
		data.token = uni.getStorageSync("userinfo").token;
		data.uid = uni.getStorageSync("userinfo").id;
	  	let [err,res] =await this.$httpas.post('/api/user/changemobile',data);
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
