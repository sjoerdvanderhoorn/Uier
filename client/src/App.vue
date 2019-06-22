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

import feather from "feather-icons";

export default {
  name: "App",
  mounted() {
    // Show icons
    feather.replace();
    // Check if already authenticated
    var parent = this;
    fetch("http://localhost:8081/authenticated", {
      credentials: "include",
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json"
      })
    })
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        if (json.status == "authenticated") {
          parent.$root.$data.user = json.user;
          parent.$root.$data.roles = json.roles;
          parent.$root.$data.isAuthenticated = true;
        } else {
          parent.$root.$data.isAuthenticated = false;
        }
      });
  },
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
