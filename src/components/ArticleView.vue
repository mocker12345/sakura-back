<template>
	<div class="container">
		<article-list><article-list>
		<!-- <article-edit></article-edit> -->
	</div>

</template>
<script>
import ArticleList from './ArticleList'
import ArticleEdit from './ArticleEdit'
export default {
  	name:'ArticleView',
  	components: {
    	ArticleList,
			ArticleEdit
  	},
}

</script>
<style>
.container {
	padding: 20px;
}
</style>
