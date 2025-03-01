<template>
	<view class="pd10">
		<view class="box pd10">
			<rich-text class="cont" :nodes="aboutcon"></rich-text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:'',
				aboutcon:'',
			}
		},
		onLoad(e) {
			if(e.id){
				this.artinfo(e.id);
			}
		},
		methods: {
			async artinfo(id){
				let data = {id};
				let [err,res] =await this.$httpas.get('/api/index/artinfo',data);
				if(res.data.code == 1){
					this.title = res.data.data.title
					this.aboutcon = res.data.data.content
					uni.setNavigationBarTitle({
					    title: this.title
					});
				}
			}
		}
	}
</script>

<style>
.h1{
	font-size: 32rpx;
	text-align: center;
	font-weight: bold;
	line-height: 52px;
}
</style>
