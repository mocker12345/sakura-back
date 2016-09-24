<template>
	<div class="container">
		<header>
			<h5>EDIT ARTICLE</h5>
		</header>
		<form>
			<div class="form-group">
				<label class="label">Title</label>
				<input type="email" class="form-control" v-model="articleEdit.title" placeholder="请输入标题" maxlength="100">
			</div>
			<fieldset class="form-group">
				<label class="label" >Summary</label>
				<textarea class="form-control" v-model="articleEdit.summary" rows="3" maxlength="300"></textarea>
			</fieldset>
			<fieldset class="form-group">
				<label class="label">Category</label>
				<select class="form-control" v-model="articleEdit.category">
					<option value="0">其他</option>
					<option v-for="option in categorys" v-model="option.id">{{option.name}}</option>
				</select>
			</fieldset>
			<fieldset class="form-group">
				<label class="label">Cover Image</label>
				<img :src="articleEdit.cover_url" alt="" style="height:100px;"/>
				<label class="btn btn-primary"><input class="upload-img" type="file" hidden @change="uploadImg($event)">upload image</label>
				<div class="modal upload-modal fade" role="dialog">
					<div class="modal-dialog modal-sm">
						<div class="modal-content">
							<div class="modal-body">
								uploading...wait
							</div>
						</div>
					</div>
				</div>
			</fieldset>
			<div class="relation-article">
				<label class="label">
					Related articles
				</label>
				<div class="relation-box" @click="showModal" >
					<p v-for="item in relations" v-text="item.title"></p>
					<a href="javascript:;">select article</a>
				</div>
				<article-modal v-ref:modal :articles.sync="articles" :relations.sync="relations" :article-id="articleId"></article-modal>
			</div>
			<div class="price-box">
				<label class="label">Price</label>
				<table class="table price-table">
					<thead>
						<tr >
							<th>site-name</th>
							<th>site-url</th>
							<th>price</th>
							<th>
								<button type="button" class="btn btn-primary" @click="addPrice">add</button>
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="item in articleEdit.price">
							<td><input class="form-control" type="text" v-model="item.site_name"></td>
							<td><input class="form-control" type="text" v-model="item.site_url"></td>
							<td><input class="form-control" type="text" v-model="item.price"></td>
							<td>
								<button type="button" class="btn btn-warning" @click="deletePrice($index)">delete</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<fieldset class="form-group">
				<label class="label">Content</label>
				<div id="editor-container">
					<div id="editor" style="min-height:800px" v-html="articleEdit.content"></div>
				</div>
			</fieldset>
			<button type="button" class="btn btn-primary" @click="saveEdit">Submit</button>
		</form>
	</div>
</template>
<script>
import wangEditor from "wangeditor"
import ArticleModal from "./ArticleModal"
import Vue from 'vue'
import MessageBox from "vue-msgbox"
var editor;
export default {
	name:'ArticleEdit',
	route:{
		data(){
			let self = this;
			this.loadArticle().then((data)=>{
				self.articles = data.data;

				for (let i = 0; i < self.articles.length; i++) {
					Vue.set(self.articles[i],'selected',false)
				}
				self.getCategory().then((data)=>{
					self.categorys = data.data;
					if(self.$route.params.articleId){
						let articleId = self.$route.params.articleId;
						self.articleId = articleId;
						api.article(articleId).get().then((data)=>{
							data.json().then((data)=>{
								self.articleEdit = data;
								if(self.articleEdit.children && (self.articleEdit.children.length !== 0)){
									self.relations = self.articleEdit.children;
									for (var i = 0;i<self.articles.length;i++){
										for(let j = 0;j<self.relations.length;j++){
											if(self.relations[j].id === self.articles[i].id){
												Vue.set(self.articles[i],'selected',true)
												// self.articles[i].$set('selected',true);
											}
										}

									}
								}else {
									self.relations = []
								}
							})
						})
					}
				})
			})
		}
	},
	data(){
		return {
			articleId:null,
			file:null,
			articleEdit:{
				title:'',
				cover_url:'',
				category:0,
				summary:'',
				content:'',
				price:[],
				children:[]
			},
			categorys:[],
			articles:null,
			relations:[]
		}
	},

	create(){
		this.$file = this.$el.querySelector('.upload-img');
	},
	ready(){
		wangEditor.config.printLog = false;
		editor = new wangEditor('editor')
		editor.config.customUploadInit = this.uploadInit;
		editor.config.customUpload = true;

		editor.config.menus = $.map(wangEditor.config.menus, function(item, key) {
			if (item === 'source' || item === "location" || item === "video") {
				return null;
			}
			return item;
		});
		editor.create();



	},
	components:{
		ArticleModal
	},
	methods:{
		loadArticle(){
			return api.article.get({limit:200}).then((data)=>{
				if(data.ok){
					return data.json()
				}
			})
		},
		showModal () {
			this.$refs.modal.showModal();
		},
		addPrice (){
			this.articleEdit.price.push({})
		},
		deletePrice (index){
			this.articleEdit.price.splice(index,1);
		},
		getCategory(){
			return api.category.get().then((data)=>{
				if (data.ok){
					return data.json()
				}
			});
		},
		deleteArticle(item){

		},
		saveEdit (){
			this.articleEdit.children = this.relations;
			this.articleEdit.content= editor.$txt.html();
			let params=JSON.stringify(this.articleEdit);
			$('.upload-modal').modal('show').css({
				"margin-top": function () {
					return ($(this).height() / 2);
				}
			})
			var self = this;
			if(this.$route.params.articleId){
				api.article(this.$route.params.articleId).put(params).then((info)=>{
					if (info.ok){
						info.json().then((data)=>{
							if (data.code === 400) {
								let message = self.printError(data.errors)
								MessageBox({
									message: message,
									type: 'error'
								})
							}else if (data.error == 400){
								MessageBox({
									message: data.message,
									type: 'error'
								})
							}else {
								if(data.success){
									$('.upload-modal').modal('hide')
									self.$route.router.go({path:'/article/list'})
								}
							}
						})
					}
				})
			}else {
				api.article.post(params).then((info)=>{

					if (info.ok){
						info.json().then((data)=>{
							if (data.code === 400) {
								let message = self.printError(data.errors)
								MessageBox({
									message: message,
									type: 'error'
								})
							}else if (data.error == 400){
								MessageBox({
									message: data.message,
									type: 'error'
								})
							}else {
								if(data.success){
									$('.upload-modal').modal('hide')
									self.$route.router.go({path:'/article/list'})
								}
							}
						})
					}
				})
			}
		},
		printError(error){
			let errorLog = "";
			for (let i in error){
				errorLog += i +':'+error[i][0] +'\n'
			}
			return errorLog
		},
		uploadImg(e){
			let file = e.target.files[0];
			let supportedTypes = ['image/jpg', 'image/jpeg', 'image/png'];
			if (file && supportedTypes.indexOf(file.type) >= 0) {
				this.file = file;
				let self = this;
				let formData = new FormData();
				formData.append('file',this.file);
				$('.upload-modal').modal('show').css({
					"margin-top": function () {
						return ($(this).height() / 2);
					}
				})
				api.upload.post(formData).then((info)=>{
					if(info.ok){
						info.json().then((info)=>{
							self.articleEdit.cover_url = info.image_url;
							self.file = null;
							$('.upload-modal').modal('hide')

						})
					}
				});

			} else {
				alert('文件格式只支持：jpg、jpeg 和 png');
				this.file = null;
			}
		},
		uploadInit(){
			var btnId = editor.customUploadBtnId;
			var containerId = editor.customUploadContainerId;

			var uploader = Qiniu.uploader({
				runtimes:'html5',
				browse_button:btnId,
				uptoken_url:'http:///180.76.132.102:19991/uptoken/',
				domain:'http://oce6f0hwv.bkt.clouddn.com/',
				container:containerId,
				max_file_size:'20mb',
				filters:{
					mime_types:[
						{title:"图片文件",extensions:"jpg,gif,png,bmp"}
					]
				},
				max_retries:3,
				dragdrop:true,
				drop_element:'editor-container',
				chunk_size:'3mb',
				auto_start:true,
				init:{
					'FilesAdded':function(up,files){
						plupload.each(files,function(file){
							// this.printLog('on FilesAdded')
						});
					},
					'BeforeUpload':function(up,file){
						// this.printLog('on BeforeUpload')
					},
					'UploadProgress':function(up,file){
						editor.showUploadProgress(file.parcent);
					},
					'FileUploaded':function(up,file,info){
						// this.printLog(info)
						let domain = up.getOption('domain');
						let res = $.parseJSON(info);
						let sourceLink = domain +res.key;
						// this.printLog(sourceLink);
						editor.command(null,'insertHtml','<img src="'+sourceLink+'"style="max-width:500px;"/>')
					},
					'Error':function(){
						// this.printLog('on Error');
					},
					'UploadComplete':function(){
						editor.hideUploadProgress()
					}
				}
			})
		}
	}
}


</script>
<style>
.label {
	width: 15%;
}
.form-group .form-control {
	display: inline-block;
	width: 50%;
	vertical-align: top;
}
.modal-body {
	text-align: center;
}
.relation-article .relation-box{
	display:inline-block;
	width: 50%;
	padding: 8px;
	border: 1px solid #ccc;
}
.price-table {
	width: 80%;
}
.price-table thead th {
	vertical-align:middle;
}
</style>
