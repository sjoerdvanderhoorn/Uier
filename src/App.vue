<template>
  <div id="app">
    <!-- menu -->
    <ul id="menu">
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/dashboard">Dashboard</router-link></li>
      <li><router-link to="/tests">Tests</router-link></li>
      <li><router-link to="/test/1">Test 1</router-link></li>
      <li><router-link to="/test/2">Test 2</router-link></li>
      <li><router-link to="/test/3">Test 3</router-link></li>
      <li><router-link to="/test/4">Test 4</router-link></li>
    </ul>
    <!-- routes will be rendered here -->
    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  /* CSS for the entire app. */
}
#menu {
  display: block;
  float: left;
  width: 10em;
}
</style>
