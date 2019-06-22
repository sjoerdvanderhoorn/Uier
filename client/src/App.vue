<template>
  <div id="app">
    <template v-if="$root.$data.isAuthenticated==false">
      <Login/>
    </template>
    <template v-if="$root.$data.isAuthenticated==true">
      <Main/>
    </template>
  </div>
</template>

<script>
import Login from "@/pages/Login";
import Main from "@/pages/Main";

import feather from "feather-icons";

export default {
  name: "App",
  mounted() {
    // Show icons
    feather.replace();
  },
  components: {
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
