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
          <a class="nav-link" href="#">Sign out</a>
        </li>
      </ul>
    </nav>

    <div class="container-fluid">
      <div class="row">
        <!-- Sidebar -->
        <nav class="col-md-2 d-none d-md-block bg-light sidebar">
          <div class="sidebar-sticky">
            <h6
              class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted"
            >
              <span>Definition</span>
            </h6>
            <ul class="nav flex-column">
              <!-- <li class="nav-item">
                <router-link to="/" exact class="nav-link" active-class="active">
                  <span data-feather="home"></span> Dashboard
                </router-link>
              </li>-->
              <li class="nav-item">
                <router-link to="/tests" class="nav-link" active-class="active">
                  <span data-feather="box"></span> Tests
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/collections" class="nav-link" active-class="active">
                  <span data-feather="codesandbox"></span> Collections
                </router-link>
              </li>
            </ul>
            <h6
              class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted"
            >
              <span>Execution</span>
            </h6>
            <ul class="nav flex-column">
              <li class="nav-item">
                <router-link to="/runs" class="nav-link" active-class="active">
                  <span data-feather="git-commit"></span> Runs
                </router-link>
              </li>
              <!--<li class="nav-item">
                <router-link to="/timers/" class="nav-link" active-class="active">
                  <span data-feather="clock"></span> Timers
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/users/" class="nav-link" active-class="active">
                  <span data-feather="users"></span> Users
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

            <!-- <h6
              class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted"
            >
              <span>Saved reports</span>
              <a class="d-flex align-items-center text-muted" href="#">
                <span data-feather="plus-circle"></span>
              </a>
            </h6>
            <ul class="nav flex-column mb-2">
              <li class="nav-item">
                <a class="nav-link" href="#">
                  <span data-feather="file-text"></span>
                  Current month
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  <span data-feather="file-text"></span>
                  Last quarter
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  <span data-feather="file-text"></span>
                  Social engagement
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  <span data-feather="file-text"></span>
                  Year-end sale
                </a>
              </li>
            </ul>-->
          </div>
        </nav>

        <!-- routes will be rendered here -->
        <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
          <!-- <div
            class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom"
          >
            <h1 class="h2">Page name: {{$route.name}}</h1>
            <div class="btn-toolbar mb-2 mb-md-0">
              <div class="btn-group mr-2">
                <button class="btn btn-sm btn-outline-secondary">Share</button>
                <button class="btn btn-sm btn-outline-secondary">Export</button>
              </div>
              <button class="btn btn-sm btn-outline-secondary dropdown-toggle">
                <span data-feather="calendar"></span>
                This week
              </button>
            </div>
          </div>-->

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
  methods: {}
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
