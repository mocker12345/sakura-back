<template>
	<nav class="navbar navbar-light bg">
		<a class="navbar-brand" v-link="{path:'/article/list'}">
			<img src="../assets/logo.png">
		</a>
		<ul class="nav navbar-nav" style="margin-top: 0.8rem;font-size:1.2rem">
			<li class="nav-item" v-link-active>
				<a class="nav-link" v-link="{path:'/article/list',activeClass:'active'}">article<span class="sr-only">(current)</span></a>
			</li>
			<li class="nav-item" v-link-active>
				<a class="nav-link" v-link="{path:'/category',activeClass:'active'}">category</a>
			</li>
			<li class="nav-item" v-link-active>
				<a class="nav-link" v-link="{path:'/commodity',activeClass:'active'}">commodity</a>
			</li>
		</ul>
	</nav>
</template>
<script>
export default {
	name:'HeaderBar',
	ready(){

	},
	data(){
		return {
			isActive:1,
		}
	},
	methods:{
		makeActive(num){

			this.isActive = num
			this.$route.router
		},
		getCookie(objname){
			var arrstr = document.cookie.split("; ");
			for(var i = 0;i < arrstr.length;i ++){
				var temp = arrstr[i].split("=");
				if(temp[0] == objname) return unescape(temp[1]);
			}
		}
	}
}

</script>
<style>
.bg{
	background-color: #475669;
}
.active {
	color: #000!important;
}


</style>
