<template>
  <div class="post">
    <div v-if="loading" class="loading">Loading...</div>

    <div v-if="error" class="error">Error: {{ error }}</div>

    <div v-if="tests" class="content">
      <h2>Tests from database</h2>
      <ul class="list-group">
        <li
          v-for="test in tests.tests"
          v-bind:key="test._id"
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          <router-link :to="'/test/' + test._id">{{ test.name }}</router-link>
          <span class="badge badge-primary badge-pill">14</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "Tests",
  data() {
    return {
      loading: false,
      tests: null,
      error: null
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
      this.error = this.tests = null;
      this.loading = true;
      fetch("http://localhost:8081/tests")
        .then(function(response) {
          parent.loading = false;
          return response.json();
        })
        .then(function(myJson) {
          // Load data
          parent.tests = myJson;
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
