<template>
	<nav class="navbar navbar-light bg-faded">
		<a class="navbar-brand" v-link="{path:'/article/list'}">Sakura</a>
		<ul class="nav navbar-nav">
			<li class="nav-item active">
				<a class="nav-link" v-link="{path:'/article/list'}">article<span class="sr-only">(current)</span></a>
			</li>
			<li class="nav-item">
				<a class="nav-link" v-link="{path:'/categoy'}">category</a>
			</li>
			<li class="nav-item">
				<a class="nav-link" v-link="{path:'/commodity'}">commodity</a>
			</li>
		</ul>
	</nav>
</template>
<script>
	export default {
  		name:'HeaderBar'
  	}

</script>
<style>

</style>
