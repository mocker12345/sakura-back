<template>
  <div id="app">
    <header-bar></header-bar>
    <!-- <hello></hello> -->

    <router-view
      class="view"
      transition
      transition-mode="out-in">
    </router-view>
  
</div>
</template>

<script>
import HeaderBar from './components/HeaderBar'
export default {
  components: {
    HeaderBar
  },
  data(){
    return {
    }
  }

}
</script>

<style>
html {
  height: 100%;
}

#app {
  color: #2c3e50;
  font-family: Source Sans Pro, Helvetica, sans-serif;
}

#app a {

  text-decoration: none;
}

</style>
