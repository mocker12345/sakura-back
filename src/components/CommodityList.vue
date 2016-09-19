<template lang="html">
  <div class="container">
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
            <button type="button" class="btn btn-primary">add</button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in commoditys">
          <td v-text="item.title"></td>
          <td v-text="item.price"></td>
          <td>
            <button type="button" class="btn btn-primary">edit</button>
            <button type="button" class="btn btn-warning">delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="page">
      <pagination></pagination>
    </div>
  </div>
</template>

<script>
import Pagination from './Pagination'
export default {
  data() {
    return {
    };
  },
  computed: {},
  ready() {},
  attached() {},
  methods: {
    loadCommoditys(){
      
    }
  },
  components: {
    Pagination
  }
};
</script>

<style lang="css">
</style>
