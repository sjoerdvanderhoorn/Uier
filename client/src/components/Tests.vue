<template>
  <div class="post">
    <div v-if="tests" class="content">
      <div class="jumbotron">
        <h1 class="display-4">Tests</h1>
        <p class="lead">Overview of all tests in the system with details on their last few runs.</p>
        <hr class="my-4">
        <p></p>
        <!-- Button trigger modal -->
        <button
          type="button"
          class="btn btn-primary"
          data-toggle="modal"
          data-target="#addTest"
        >Add Test</button>
        <button class="btn btn-secondary">Run all tests</button>
      </div>

      <div v-if="error" class="alert alert-warning">Error: {{ error }}</div>

      <table class="table table-borderless table-striped">
        <thead>
          <tr>
            <th>Test</th>
            <th>Purpose of test</th>
            <th style="width: 150px;">Steps</th>
            <th style="width: 150px;">Last Status</th>
            <th style="width: 150px;">&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="test in tests">
            <tr v-bind:key="test._id">
              <td>
                <router-link :to="'/test/' + test._id">{{ test.name }}</router-link>
              </td>
              <td>{{test.purpose}}</td>
              <td>{{test.steps.length}}</td>
              <td>pass/fail?</td>
              <td>
                <button class="btn btn-danger" title="Remove" v-on:click="removeTest(test._id)">x</button>
              </td>
            </tr>
          </template>
        </tbody>
      </table>

      <div v-if="loading" class="alert alert-primary">Loading...</div>
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
      fetch("http://localhost:8081/test")
        .then(function(response) {
          parent.loading = false;
          return response.json();
        })
        .then(function(json) {
          // Load data
          parent.tests = json;
        })
        .catch(function(error) {
          parent.loading = false;
          parent.error = error.toString();
        });
    },
    addTest() {
      var parent = this;
      var data = {
        name: this.addTestTemplate.name,
        purpose: this.addTestTemplate.purpose,
        url: this.addTestTemplate.url
      };
      fetch("http://localhost:8081/test", {
        credentials: "same-origin",
        method: "POST",
        body: JSON.stringify(data),
        headers: new Headers({
          "Content-Type": "application/json"
        })
      })
        .then(function(response) {
          return response.json();
        })
        .then(function(json) {
          parent.$router.push("/test/" + json._id);
        });
    },
    removeTest: function(testId) {
      if (window.confirm("Are you sure you want to remove this test?")) {
        var parent = this;
        fetch("http://localhost:8081/test/" + testId, {
          credentials: "same-origin",
          method: "DELETE",
          body: "",
          headers: new Headers({
            "Content-Type": "application/json"
          })
        }).then(function(response) {
          parent.fetchData();
        });
      }
    }
  }
};
</script>

<style scoped>
</style>
