<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/> -->
    <!-- <up-file></up-file>
    <el-divider></el-divider>
    <up-image></up-image> -->
    <!-- <prototype></prototype> -->
    <router-view></router-view>
  </div>
</template>

<script>
  // import UpFile from './components/UpFile.vue'
  // import UpImage from './components/UpImage.vue'
  // import Prototype from './components/Prototype.vue';
  
  export default {
    name: 'App',
    components: {
      //"up-file": UpFile,
      //"up-image": UpImage,
      // "prototype": Prototype,
    }
  }
  </script>

<style lang="less">
#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50; */
}

#nav {
  padding: 30px;
  /* a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  } */
}
</style>
