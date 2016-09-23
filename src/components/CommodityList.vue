<template lang="html">
  <div class="container">
    <header>
      <h5>COMMODITY LIST</h5>
    </header>
    <table class="table">
      <thead>
        <tr>
          <th>
            title
          </th>
          <th>
            price
          </th>
          <th>
            <button type="button" class="btn btn-primary" v-link="{path:'/commodity/add'}">add</button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in commoditys">
          <td v-text="item.title"></td>
          <td v-text="item.price"></td>
          <td>
            <button type="button" class="btn btn-primary" v-link="{path:'/commodity/edit/'+item.id}">edit</button>
            <button type="button" class="btn btn-warning" @click="deleteComm(item)">delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="page">
      <pagination :offset.sync="offset" :total-page="totalPage"></pagination>
    </div>
  </div>
</template>
<script>
import MessageBox from 'vue-msgbox'
import Pagination from './Pagination'
export default {
  data() {
    return {
      limit:12,
      offset:1,
      totalPage:null,
      commoditys:[]
    };
  },
  computed: {},
  ready() {
    this.loadCommoditys()
  },
  attached() {},
  methods: {
    loadCommoditys(){
      var params = {limit:this.limit,offset:this.offset};
      api.commodity.get(params).then((info)=>{
        if(info.ok){
          info.json().then((data)=>{
            this.totalPage = data.total_page;
            this.commoditys = data.data;
          })
        }
      })
    },
    deleteComm(item){
      api.commodity(item.id).delete().then((info)=>{
        if(info.ok){
          info.json().then((data)=>{
            if(data.success){
              MessageBox({
                message: "Delete success",
                type: 'success',
              }).then((action)=>{
                this.loadCommoditys();
              })
            }else {
              MessageBox({
                message: "Delete field",
                type: 'error',
              })
            }
          })
        }
      })
    }
  },
  watch:{
    'offset':function(){
      this.loadCommoditys()
    }
  },
  components: {
    Pagination
  }
};
</script>
<style>
@import '../../node_modules/vue-msgbox/lib/vue-msgbox.css';
.msgbox {
  width: 25%
}
</style>
