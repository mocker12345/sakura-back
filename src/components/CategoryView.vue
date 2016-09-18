<template lang="html">
  <div class="container">
    <table class="table">
      <thead>
        <tr>
          <th>
            name
          </th>
          <th>
            <button type="button" class="btn btn-primary" @click="addCategory">add</button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cate in categorys">
          <td>
            <input type="text" class="form-control" v-model="cate.name">
          </td>
          <td>
            <button type="button" class="btn btn-primary" @click="saveCategory(cate)">save</button>
            <button type="button" class="btn btn-warning" @click="deleteCategory(cate,$index)">delete</button>
          </td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script>
export default {
  data() {
    return {
      categorys:[]
    };
  },
  computed: {},
  ready() {
    this.getCategorys()

  },
  attached() {},
  methods: {
    getCategorys(){
      api.category.get().then((info)=>{
        if(info.ok){
          info.json().then((data)=>{
            if (data.success) {
              this.categorys = data.data
            }else {
              console.log(data.message)
            }
          })
        }else {
          console.log(info)
        }
      })
    },
    saveCategory(cate){
      if (cate.id){
        let params = JSON.stringify(cate)
        api.category(cate.id).put(params).then((info)=>{
          if(info.ok){
            info.json().then((data)=>{
              if (data.success) {
                this.categorys = data.data;
                alert('success')
              }else {
                console.log(data.message)
              }
            })
          }else {
            console.log(info);
          }
        })
      }else {
        let params = JSON.stringify({name:cate.name})
        api.category.post(params).then((info)=>{
          console.log(cate.name);
          if(info.ok){
            info.json().then((data)=>{
              if (data.success) {
                this.categorys = data.data;
                alert('success')
              }else {
                console.log(data.message)
              }
            })
          }else {
            console.log(info);
          }
        })
      }

    },
    deleteCategory(cate,index){
      debugger;
      if(cate.id){
        api.category(cate.id).delete().then((info)=>{
          if(info.ok){
            info.json().then((data)=>{
              if(data.success){
                this.categorys = data.data;
              }else {
                console.console.log(data.message);
              }
            })
          }
        })
      }else {
        this.categorys.splice(index,1)
      }

    },
    addCategory(){
      this.categorys.push({})
    }
  },
  components: {}
};
</script>

<style lang="css">
</style>
