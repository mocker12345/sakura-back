<template>
	<div class="container">
		<article-list><article-list>
			<!-- <article-edit></article-edit> -->
		</div>

	</template>
	<script>
	import ArticleList from './ArticleList'
	export default {
		name:'ArticleView',
		components: {
			ArticleList
		},
	}

	</script>
	<style>
	.container {
		padding: 20px;
	}
	</style>
