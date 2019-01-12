<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import '../static/css/reset.css'
  import '../static/css/base.css'
export default {
  name: 'App'
}
</script>

<style>
  body{
    background-color: #f2f6f7;
  }
  body.modal-open {
    overflow-y: auto !important;
    padding-right: 0 !important;
  }
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
