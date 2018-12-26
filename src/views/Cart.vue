<template>
	<div>
		<span>这是购物车页面</span>
		<span>{{$route.query.goodsId}}</span>
		<button @click="back">返回</button>
	</div>
</template>
<script>
	export default {
		methods: {
			back(){
				this.$router.go(-1)
			}
		}
	}
</script>
<style></style>