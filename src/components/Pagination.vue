<template lang="html">
  <nav aria-label="Page navigation">
    <ul class="pagination">
      <li class="page-item" @click="pre">
        <a class="page-link" href="javascript:;" >
          <span >&laquo;Prev</span>
          <!-- <span class="sr-only">Previous</span> -->
        </a>
      </li>
      <li class="page-item" @click="next">
        <a class="page-link" href="javascript:;" >
          <span>Next&raquo;</span>
          <!-- <span class="sr-only">Next</span> -->
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
import MessageBox from "vue-msgbox"
export default {
  name:'Pagination',
  data() {
    return {

    }
  },
  props:['offset','totalPage'],
  computed: {},
  ready() {

  },
  attached: function () {},
  methods: {
    pre(){
      if(this.offset === 1){
        MessageBox({
          message: "已经是第一页了",
          type: 'error'
        })
      }else {
        this.offset--
      }
    },
    next(){
      if(this.offset === this.totalPage){
        MessageBox({
          message: "已经是最后一页了",
          type: 'error'
        })
      }else {
        this.offset++
      }
    }
  },
  components: {}
}
</script>

<style lang="css">
</style>
