<template>
  <div class="post">
    <div v-if="loading" class="loading">Loading...</div>

    <div v-if="error" class="error">Error: {{ error }}</div>

    <div v-if="tests" class="content">
      <div class="jumbotron">
        <h1 class="display-4">Tests</h1>
        <p class="lead">Overview of all tests in the system with details on their last few runs.</p>
        <hr class="my-4">
        <p></p>
        <!-- Button trigger modal -->
        <button
          type="button"
          class="btn btn-primary btn-lg"
          data-toggle="modal"
          data-target="#addTest"
        >Add Test</button>
        <a class="btn btn-secondary btn-lg" href="#" role="button">Run all tests</a>
      </div>

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

    <!-- Add Test -->
    <div
      class="modal fade"
      id="addTest"
      tabindex="-1"
      role="dialog"
      aria-labelledby="addTestLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addTestLabel">Add Test</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" style="width: 8em;">Name</span>
                </div>
                <input type="text" class="form-control" v-model="addTestTemplate.name">
              </div>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" style="width: 8em;">Purpose of test</span>
                </div>
                <textarea class="form-control" v-model="addTestTemplate.purpose"></textarea>
              </div>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" style="width: 8em;">Start URL</span>
                </div>
                <input type="text" class="form-control" v-model="addTestTemplate.url">
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
            <button
              type="button"
              class="btn btn-primary"
              data-dismiss="modal"
              v-on:click="addTest()"
            >Create Test</button>
          </div>
        </div>
      </div>
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
    },
    addTest() {
      var data = {
        name: this.addTestTemplate.name,
        purpose: this.addTestTemplate.purpose,
        url: this.addTestTemplate.url
      };
      fetch("http://localhost:8081/add_test/", {
        credentials: "same-origin", // 'include', default: 'omit'
        method: "POST", // 'GET', 'PUT', 'DELETE', etc.
        body: JSON.stringify(data), // Coordinate the body type with 'Content-Type'
        headers: new Headers({
          "Content-Type": "application/json"
        })
      });
    }
  }
};
</script>

<style scoped>
</style>
