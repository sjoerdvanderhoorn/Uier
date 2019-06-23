<template>
  <div id="app">
    <link href="/static/css/dashboard.css" rel="stylesheet">

    <!-- Navbar -->
    <nav class="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
      <router-link to="/" class="navbar-brand col-sm-3 col-md-2 mr-0">Uier</router-link>
      <!-- <input
        class="form-control form-control-dark w-100"
        type="text"
        placeholder="Search"
        aria-label="Search"
      >-->
      <ul class="navbar-nav px-3">
        <li class="nav-item text-nowrap">
          <a class="nav-link" v-on:click="logout()">Sign out</a>
        </li>
      </ul>
    </nav>

    <div class="container-fluid">
      <div class="row">
        <!-- Sidebar -->
        <nav class="col-md-2 d-none d-md-block bg-light sidebar">
          <div class="sidebar-sticky">
            <!--
            <ul class="nav flex-column">
              <li class="nav-item">
                <router-link to="/" exact class="nav-link" active-class="active">
                  <span data-feather="home"></span> Dashboard
                </router-link>
              </li>
            </ul>
            -->
            <h6
              class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted"
              v-if="$root.$data.roles.includes('test_read') || $root.$data.roles.includes('collection_read')"
            >
              <span>Definition</span>
            </h6>
            <ul class="nav flex-column">
              <li class="nav-item" v-if="$root.$data.roles.includes('test_read')">
                <router-link to="/tests" class="nav-link" active-class="active">
                  <span data-feather="box"></span> Tests
                </router-link>
              </li>
              <li class="nav-item" v-if="$root.$data.roles.includes('collection_read')">
                <router-link to="/collections" class="nav-link" active-class="active">
                  <span data-feather="codesandbox"></span> Collections
                </router-link>
              </li>
            </ul>
            <h6
              class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted"
              v-if="$root.$data.roles.includes('run_read')"
            >
              <span>Execution</span>
            </h6>
            <ul class="nav flex-column">
              <li class="nav-item" v-if="$root.$data.roles.includes('run_read')">
                <router-link to="/runs" class="nav-link" active-class="active">
                  <span data-feather="git-commit"></span> Runs
                </router-link>
              </li>
            </ul>
            <h6
              class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted"
              v-if="$root.$data.roles.includes('user_read')"
            >
              <span>Administrative</span>
            </h6>
            <ul class="nav flex-column">
              <li class="nav-item" v-if="$root.$data.roles.includes('user_read')">
                <router-link to="/users/" class="nav-link" active-class="active">
                  <span data-feather="users"></span> Users
                </router-link>
              </li>
              <!--<li class="nav-item">
                <router-link to="/timers/" class="nav-link" active-class="active">
                  <span data-feather="clock"></span> Timers
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/reports/" class="nav-link" active-class="active">
                  <span data-feather="bar-chart-2"></span> Reports
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/integrations/" class="nav-link" active-class="active">
                  <span data-feather="layers"></span> Integrations
                </router-link>
              </li>-->
            </ul>
            <h6
              class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted"
            >
              <span>Information</span>
            </h6>
            <ul class="nav flex-column mb-2">
              <li class="nav-item">
                <router-link to="/about" class="nav-link" active-class="active">
                  <span data-feather="gift"></span> About
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/help" class="nav-link" active-class="active">
                  <span data-feather="help-circle"></span> Help
                </router-link>
              </li>
            </ul>
          </div>
        </nav>

        <!-- routes will be rendered here -->
        <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
          <router-view/>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Main",
  mounted() {},
  methods: {
    logout() {
      var parent = this;
      fetch("http://localhost:8081/logout", {
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
          if (json.status == "not_authenticated") {
            parent.$root.$data.isAuthenticated = false;
          }
        });
    },
    request(url, options) {
      var parent = this;
      // Set options that apply to all requests
      if (!options) {
        options = {};
      }
      options.credentials = "include";
      // Route all data requests through this function
      return fetch(url, options).then(function(response) {
        // Test if user is still authenticated
        if (response.status == 401) {
          window.alert("It looks like you either do not have permission to perform this action, or that you are no longer logged in.");
          parent.$root.$data.isAuthenticated = false;
        } else if (!response.ok) {
          // Some other error happened
          window.alert("Error fetching data:\n" + response.statusText);
        } else {
          return response;
        }
      });
    }
  }
};
</script>

<style>
html,
body {
  height: 100%;
}
#menu {
  display: block;
  float: left;
  width: 10em;
}
</style>
