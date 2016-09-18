<template>
	<div class="row">
		<div class="col-md-4">
			<select v-model="selected" class="form-control" @change="categoryChange">
				<option value="-1">全部</option>
				<option value="0">其他</option>
				<option v-for="category in categorys" v-bind:value="category.id">{{category.name}}</option>
			</select>
		</div>

	</div>
	<table class="table">
		<thead>
			<tr>
				<th>title</th>
				<th>create_time</th>
				<th>
					<a v-link="{path:'/article/add'}" class="btn btn-primary">add</a>
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="article in articles">
				<td v-text="article.title"></td>
				<td v-text="article.create_time"></td>
				<td>
					<a class="btn btn-primary" v-link="{path:'/article/edit/'+article.id}">edit</a>
				</td>
			</tr>
		</tbody>
	</table>

	<div class="page">
		<pagination :offset.sync="offset" :total-page="totalPage"></pagination>
	</div>

</template>
<script>
import Pagination from './Pagination'
export default {
	name:'ArticleList',
	route:{
		data(){
			debugger;
		}
	},
	data(){
		return {
			selected:-1,
			categorys:null,
			articles:null,
			totalPage:null,
			limit:15,
			offset:1
		}
	},
	components:{
		Pagination
	},

	ready(){
		this.getCategorys().then((data)=>{
			this.categorys = data.data;
			this.loadArticlesByCategory();
		})

	},
	methods:{
		loadArticlesByCategory(){
			if(this.selected == -1){
				this.getAllArticles().then((data)=>{
					this.articles = data.data;
					this.totalPage = data.total_page;
				})
			}else {
				api.category(this.selected).articles.get({
					limit:this.limit,offset:this.offset
				}).then((data)=>{
					if(data.ok){
						data.json().then((data)=>{
							this.articles = data.data;
							this.totalPage = data.total_page;
						})
					}
				})
			}
		},
		getAllArticles(){
			return api.article.get({limit:this.limit,offset:this.offset}).then((data)=>{
				if(data.ok){
					return data.json()
				}
			})
		},
		getCategorys(){
			return api.category.get().then((data)=>{
				if(data.ok){
					return data.json()
				}
			})
		},
		categoryChange(){
			this.offset = 1;
			this.loadArticlesByCategory()

		},
	},
	watch:{
		'offset':function(){
			this.loadArticlesByCategory()
		}
	}
}

</script>
<style>
.page {
	text-align:center;
}
</style>
