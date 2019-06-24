<template>
  <div id="app">
    <template v-if="$root.$data.isAuthenticated==null">
      <Loading/>
    </template>
    <template v-if="$root.$data.isAuthenticated==false">
      <Login/>
    </template>
    <template v-if="$root.$data.isAuthenticated==true">
      <Main/>
    </template>
  </div>
</template>

<script>
import Loading from "@/pages/Loading";
import Login from "@/pages/Login";
import Main from "@/pages/Main";

export default {
  name: "App",
  mounted() {},
  components: {
    Loading,
    Login,
    Main
  }
};
</script>

<style>
html,
body {
  height: 100%;
}
#app {
  width: 100%;
}
</style>
