<template lang="html">
  <div class="container">
    <div class="editbox">
      <header>
        <h4>EDIT COMMODITY</h4>
      </header>
      <form class="col-md-12">
        <fieldset class="form-group">
          <label class="label">title</label>
          <input type="text" class="form-control" v-model="commodity.title">
        </fieldset>
        <fieldset class="form-group">
          <label class="label">Summary</label>
          <textarea rows="6" cols="40" class="form-control" v-model="commodity.summary"></textarea>
        </fieldset>
        <fieldset class="form-group">
          <label class="label">Cover Image</label>
          <img :src="commodity.cover_url" alt="" style="height:100px;"/>
          <label class="btn btn-primary"><input class="upload-img" type="file" hidden @change="uploadImg($event)">upload image</label>

        </fieldset>
        <div class="modal upload-modal fade" role="dialog">
          <div class="modal-dialog modal-sm">
            <div class="modal-content">
              <div class="modal-body">
                uploading...wait
              </div>
            </div>
          </div>
        </div>
        <fieldset class="form-group">
          <label class="label">Price</label>
          <input type="number" class="form-control" step="0.1" min="0.1" v-model="commodity.price">
        </fieldset>
        <fieldset class="form-group">
          <label class="label">Url</label>
          <input type="text" class="form-control" v-model="commodity.buy_url">
        </fieldset>
        <fieldset>
          <button type="button" name="button" @click="saveEdit"class="btn btn-primary offset-md-1">Submit</button>
        </fieldset>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      file:null,
      commodity:{
        title:null,
        summary:null,
        cover_url:null,
        price:null,
        buy_url:null
      },
    };
  },
  computed: {},
  ready() {
    this.loadCommodity()
  },
  attached() {},
  methods: {
    loadCommodity(){
      if(this.$route.params.id){
        let id = this.$route.params.id;
        api.commodity(id).get().then((info)=>{
          if (info.ok) {
            info.json().then((data)=>{
              if(data.message){
                alert(data.message)
                this.route.router.go('/commodity')
              }else {
                ;
                this.commodity = data
              }
            })
          }
        })
      }
    },
    saveEdit(){
      var params = JSON.stringify(this.commodity)
      $('.upload-modal').modal('show').css({
        "margin-top": function () {
          return ($(this).height() / 2);
        }
      })
      if(this.$route.params.id){
        let id = this.$route.params.id;
        api.commodity(id).put(params).then((info)=>{
          if (info.ok) {
            info.json().then((data)=>{
              $('.upload-modal').modal('hide')
              if(data.success){
                this.$route.router.go('/commodity')
              }else {
                alert(data.message)
              }
            })
          }
        })
      }else {
        api.commodity.post(params).then((info)=>{
          if(info.ok){
            info.json().then((data)=>{
              $('.upload-modal').modal('hide')
              if (data.success) {
                this.$route.router.go('/commodity')
              }else {
                alert(data.message)
              }
            })
          }
        })
      }
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
              $('.upload-modal').modal('hide')
              self.commodity.cover_url = info.image_url;
              self.file = null;
            })
          }
        });

      } else {
        alert('文件格式只支持：jpg、jpeg 和 png');
        this.file = null;
      }
    }
  },
  components: {}
};
</script>

<style lang="css">
header {
  border-bottom: 5px solid #f7f7f9;
  margin-bottom: 20px
}
.label {
  width: 20%;
  font-size: 18px
}
</style>
