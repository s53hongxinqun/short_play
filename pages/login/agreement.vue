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
				aboutcon:'',
				type:'xieyi'
			}
		},
		onLoad(e) {
			if(e.type){
				this.type=e.type
			}
			this.artinfo();
		},
		methods: {
			async artinfo(){
				let data = {type:this.type}
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