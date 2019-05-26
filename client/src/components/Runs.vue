<template>
  <div class="post">
    <div v-if="loading" class="loading">Loading...</div>

    <div v-if="error" class="error">Error: {{ error }}</div>

    <div v-if="runs" class="content">
      <div class="jumbotron">
        <h1 class="display-4">Runs</h1>
        <p class="lead">Overview of all runs.</p>
        <hr class="my-4">
        <p></p>
      </div>

      <ul class="list-group">
        <li
          v-for="run in runs"
          v-bind:key="run._id"
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          <router-link :to="'/run/' + run._id">{{ run._id }}</router-link>
          <span class="badge badge-primary badge-pill">14</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "Runs",
  data() {
    return {
      loading: false,
      runs: null,
      error: null,
      addTestTemplate: {
        name: "",
        purpose: "",
        url: ""
      }
    };
  },
  created() {
    // fetch the data when the view is created and the data is
    // already being observed
    this.fetchData();
  },
  watch: {
    // call again the method if the route changes
    $route: "fetchData"
  },
  methods: {
    fetchData() {
      var parent = this;
      this.error = this.runs = null;
      this.loading = true;
      fetch("http://localhost:8081/run")
        .then(function(response) {
          parent.loading = false;
          return response.json();
        })
        .then(function(myJson) {
          // Load data
          parent.runs = myJson;
        })
        .catch(function(error) {
          parent.loading = false;
          parent.error = error.toString();
        });
    }
  }
};
</script>

<style scoped>
</style>
