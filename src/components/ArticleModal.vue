<template lang="html">
  <div class="modal-article modal fade" role="dialog">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
        <span class="sr-only">Close</span>
      </button>
      <h4 class="modal-title">选择关联文章</h4>
    </div> -->
    <div class="modal-body">
      <table class="table">
        <thead>
          <tr>
            <th>title</th>
            <th>relation</th>
          </tr>
        </thead>
        <tbody>

          <tr v-for="item in articles" v-if="item.id != articleId">
            <td v-text="item.title" ></td>
            <td>
              <input type="checkbox" v-model="item.selected" @click="alocked(item)">
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
</div>
</template>

<script>
export default {
  name:'AritcleModal',
  data(){
    return {

    }
  },
  props:['articles','relations','articleId'],
  computed: {},
  ready(){
  },
  methods: {
    showModal(){
      $('.modal-article').modal('show')
    },
    alocked(item){
      item.selected=!item.selected;
      if(item.selected){
        this.relations.push({id:item.id,title:item.title});
      }else {
        for(let i = 0;i<this.relations.length;i++){
          if(item.id === this.relations[i].id){
            this.relations.splice(i,1);
            i--;
          }
        }
      }
    }
  },

  components: {}
}
</script>

<style lang="css">

</style>
