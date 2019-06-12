<template>
  <div id="app">
    <form class="form-signin">
      <img class="mb-4" src="/static/logo.png" alt width="72" height="72">
      <h1 class="h3 mb-3 font-weight-normal">Log on to Uier</h1>
      <input
        type="email"
        id="inputEmail"
        class="form-control"
        placeholder="Email address"
        required
        autofocus
      >
      <input
        type="password"
        id="inputPassword"
        class="form-control"
        placeholder="Password"
        required
      >
      <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
      <p class="mt-2 text-muted"><a href="#">Reset password</a></p>
      <p class="mt-5 text-muted">&nbsp;</p>
    </form>
  </div>
</template>

<script>
export default {
  name: "App",
  mounted() {}
};
</script>

<style>
html,
body {
  height: 100%;
}

#app {
  text-align: center;
  width: 100%;
}

body {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: #f5f5f5;
}

.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}
.form-signin .checkbox {
  font-weight: 400;
}
.form-signin .form-control {
  position: relative;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>
